import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Modality } from "@google/genai";
import dotenv from "dotenv";
import http from "http";
import { WebSocketServer } from "ws";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API routes FIRST
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: "GEMINI_API_KEY environment variable is not configured. Please add it to your secrets." 
      });
    }

    // Prepare contents array
    const contents = [];
    if (history && Array.isArray(history)) {
      // Limit history to last 10 messages for performance and safety
      contents.push(...history.slice(-10));
    }
    contents.push({ role: 'user', parts: [{ text: message }] });

    // Call Gemini with Search Grounding
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: "You are VintageGuru Assistant, an expert AI assistant for vintage, classic, and modern cars. Always provide accurate, helpful answers. Since you are connected to Google Search, ALWAYS use the Google Search tool when appropriate to get the latest, most accurate up-to-date web information. When rendering classic or new vehicle information, specify specs, price estimates, release news, and other verified facts.",
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No response received.";
    
    // Extract grounding URLs/metadata
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const searchQueries = response.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];
    
    // Extract links
    const links = groundingChunks
      .map((chunk: any) => {
        if (chunk.web) {
          return {
            title: chunk.web.title,
            uri: chunk.web.uri,
          };
        }
        return null;
      })
      .filter(Boolean);

    res.json({
      text,
      links,
      queries: searchQueries,
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

// Handle WebSocket connection for Voice Chat (Gemini Live API)
wss.on("connection", async (clientWs) => {
  console.log("Client connected to voice-chat WebSocket");
  let session: any = null;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      clientWs.send(JSON.stringify({ error: "GEMINI_API_KEY is not configured on the server. Please add it in Settings > Secrets." }));
      clientWs.close();
      return;
    }

    session = await ai.live.connect({
      model: "gemini-3.1-flash-live-preview",
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
        },
        systemInstruction: "You are the VintageGuru Voice Assistant, a friendly and knowledgeable AI expert on vintage, classic, and antique cars. You help buyers and sellers search for cars, understand specifications, and navigate the platform. Keep your answers brief, charming, and highly conversational, since your response is being spoken back to the user in real time.",
      },
      callbacks: {
        onmessage: (message: any) => {
          try {
            const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audio) {
              clientWs.send(JSON.stringify({ audio }));
            }
            if (message.serverContent?.interrupted) {
              clientWs.send(JSON.stringify({ interrupted: true }));
            }
          } catch (err) {
            console.error("Error sending message to client:", err);
          }
        },
      },
    });

    clientWs.on("message", (data) => {
      try {
        const payload = JSON.parse(data.toString());
        if (payload.audio && session) {
          session.sendRealtimeInput({
            audio: { data: payload.audio, mimeType: "audio/pcm;rate=16000" },
          });
        }
      } catch (err) {
        console.error("Error processing client message:", err);
      }
    });

  } catch (err: any) {
    console.error("Error in Live API connection:", err);
    clientWs.send(JSON.stringify({ error: "Failed to connect to Gemini Live API: " + err.message }));
    clientWs.close();
  }

  clientWs.on("close", () => {
    console.log("Voice-chat WebSocket connection closed");
    if (session) {
      try {
        session.close();
      } catch (e) {
        // ignore
      }
    }
  });
});

// Upgrade HTTP server to WebSockets on /api/voice-chat path
server.on("upgrade", (request, socket, head) => {
  try {
    const pathname = request.url ? new URL(request.url, `http://${request.headers.host}`).pathname : '';
    if (pathname === "/api/voice-chat") {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    } else {
      // Allow other upgrade paths (e.g., Vite HMR) to proceed or bypass
    }
  } catch (e) {
    // ignore parsing errors
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
