import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Globe, Search, Mic, MicOff, Phone, PhoneOff, Sparkles } from 'lucide-react';

interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
  links?: Array<{ title: string; uri: string }>;
  queries?: Array<string>;
  error?: boolean;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'bot', text: 'Hello! I am the VintageGuru Assistant. Powered by Google AI & Google Search, I can help you with specifications, valuation, classic car history, reviews, or anything else. What would you like to know today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Voice mode states
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Audio & WS refs
  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const audioQueueRef = useRef<AudioBufferSourceNode[]>([]);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isVoiceMode) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading, isVoiceMode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopVoiceSession();
    };
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    setIsLoading(true);

    // 1. Add user message to UI
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);

    try {
      // 2. Format history for backend API
      const chatHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      // 3. Request response from our backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userText,
          history: chatHistory
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from VintageGuru AI server.');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // 4. Add bot response with grounding links
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: data.text,
        links: data.links || [],
        queries: data.queries || []
      }]);

    } catch (error: any) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: `Sorry, I encountered an error: ${error.message || 'Could not connect to the Google AI server.'}`,
        error: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions for audio processing
  const floatTo16BitPCM = (float32Array: Float32Array): ArrayBuffer => {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    let offset = 0;
    for (let i = 0; i < float32Array.length; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    return buffer;
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  const playAudioChunk = (audioCtx: AudioContext, base64: string) => {
    try {
      const arrayBuffer = base64ToArrayBuffer(base64);
      const int16Array = new Int16Array(arrayBuffer);
      const float32Array = new Float32Array(int16Array.length);
      for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768.0;
      }

      const audioBuffer = audioCtx.createBuffer(1, float32Array.length, 24000);
      audioBuffer.getChannelData(0).set(float32Array);

      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);

      const currentTime = audioCtx.currentTime;
      if (nextStartTimeRef.current < currentTime) {
        nextStartTimeRef.current = currentTime;
      }
      source.start(nextStartTimeRef.current);
      nextStartTimeRef.current += audioBuffer.duration;

      audioQueueRef.current.push(source);
      source.onended = () => {
        audioQueueRef.current = audioQueueRef.current.filter(s => s !== source);
      };
    } catch (e) {
      console.error("Playback error:", e);
    }
  };

  const startVoiceSession = async () => {
    try {
      setVoiceStatus('connecting');
      setVoiceError(null);
      nextStartTimeRef.current = 0;
      audioQueueRef.current = [];

      // Setup WebSocket
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/voice-chat`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      // Audio contexts setup (Veb Audio API)
      const outputAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      outputAudioCtxRef.current = outputAudioCtx;

      const inputAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      inputAudioCtxRef.current = inputAudioCtx;

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const source = inputAudioCtx.createMediaStreamSource(stream);
      const processor = inputAudioCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      source.connect(processor);
      processor.connect(inputAudioCtx.destination);

      processor.onaudioprocess = (e) => {
        if (ws.readyState === WebSocket.OPEN) {
          const inputData = e.inputBuffer.getChannelData(0);
          const pcmBuffer = floatTo16BitPCM(inputData);
          const base64Audio = arrayBufferToBase64(pcmBuffer);
          ws.send(JSON.stringify({ audio: base64Audio }));
        }
      };

      ws.onopen = () => {
        setVoiceStatus('connected');
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.error) {
            setVoiceError(msg.error);
            setVoiceStatus('error');
            stopVoiceSession();
          } else if (msg.audio) {
            playAudioChunk(outputAudioCtx, msg.audio);
          } else if (msg.interrupted) {
            // Stop current playback
            audioQueueRef.current.forEach(src => {
              try { src.stop(); } catch (e) {}
            });
            audioQueueRef.current = [];
            nextStartTimeRef.current = outputAudioCtx.currentTime;
          }
        } catch (err) {
          console.error("Error decoding message:", err);
        }
      };

      ws.onerror = (err) => {
        console.error("Voice chat socket error:", err);
        setVoiceError("Connection issue. Please verify server status.");
        setVoiceStatus('error');
      };

      ws.onclose = () => {
        if (voiceStatus === 'connecting') {
          setVoiceError("Could not establish a stream connection.");
          setVoiceStatus('error');
        } else if (voiceStatus !== 'error') {
          setVoiceStatus('idle');
        }
      };

    } catch (err: any) {
      console.error("Error initializing mic or voice channel:", err);
      setVoiceError(err.message || "Microphone access blocked or unavailable.");
      setVoiceStatus('error');
      stopVoiceSession();
    }
  };

  const stopVoiceSession = () => {
    if (processorRef.current) {
      try { processorRef.current.disconnect(); } catch (e) {}
      processorRef.current = null;
    }
    if (micStreamRef.current) {
      try {
        micStreamRef.current.getTracks().forEach(track => track.stop());
      } catch (e) {}
      micStreamRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      try { inputAudioCtxRef.current.close(); } catch (e) {}
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current) {
      try { outputAudioCtxRef.current.close(); } catch (e) {}
      outputAudioCtxRef.current = null;
    }
    if (wsRef.current) {
      try { wsRef.current.close(); } catch (e) {}
      wsRef.current = null;
    }
    try {
      audioQueueRef.current.forEach(src => {
        try { src.stop(); } catch (e) {}
      });
    } catch (e) {}
    audioQueueRef.current = [];

    if (voiceStatus !== 'error') {
      setVoiceStatus('idle');
    }
  };

  const handleToggleVoiceMode = () => {
    if (isVoiceMode) {
      stopVoiceSession();
      setIsVoiceMode(false);
    } else {
      setIsVoiceMode(true);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-[#d02326] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-115 transition-all z-50 hover:bg-[#b01e20] ${isOpen ? 'hidden' : 'flex'}`}
        id="chatbot-toggle"
      >
        <MessageSquare className="w-6 h-6 animate-pulse" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-85 sm:w-100 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl z-50 overflow-hidden flex flex-col h-[550px] max-h-[85vh] transition-colors duration-200">
          {/* Header */}
          <div className="bg-[#d02326] text-white p-4 flex justify-between items-center relative">
            <div className="relative z-10 flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-ping absolute"></div>
              <div className="w-2.5 h-2.5 bg-green-400 rounded-full"></div>
              <div>
                <h3 className="font-serif font-bold text-base tracking-wide">
                  {isVoiceMode ? 'Live Voice Search' : 'VintageGuru Expert Chat'}
                </h3>
                <p className="text-[10px] text-red-100 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-white" /> Search Grounding Active
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 relative z-10">
              {/* Voice Mode Toggle Button */}
              <button 
                onClick={handleToggleVoiceMode}
                className={`p-1.5 rounded-lg flex items-center gap-1 text-xs font-semibold border transition-all ${
                  isVoiceMode 
                    ? 'bg-white text-[#d02326] border-white' 
                    : 'bg-transparent text-white border-white/40 hover:bg-white/10'
                }`}
                title={isVoiceMode ? "Switch to Text Chat" : "Switch to Live Voice Search"}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{isVoiceMode ? "Chat Mode" : "Voice Call"}</span>
              </button>

              <button onClick={() => { stopVoiceSession(); setIsOpen(false); }} className="text-white hover:text-gray-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          {isVoiceMode ? (
            /* VOICE CONVERSATION INTERFACE */
            <div className="flex-1 flex flex-col bg-gray-950 text-white p-6 justify-between items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(208,35,38,0.08)_0%,transparent_70%)] pointer-events-none"></div>
              
              <div className="text-center space-y-2 mt-4 relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/40 border border-red-900/30 text-xs font-medium text-red-400">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Gemini 3.1 Live Engine Active
                </div>
                <h4 className="text-lg font-serif font-semibold tracking-wide text-gray-100">Live Voice Search</h4>
                <p className="text-xs text-gray-400 max-w-[280px] mx-auto">
                  Speak directly to search the marketplace, ask specifications, or consult buying & selling guidance.
                </p>
              </div>

              {/* Bouncing Retro/Modern Voice Waveform Indicator */}
              <div className="relative flex items-center justify-center w-full h-40">
                {voiceStatus === 'connected' ? (
                  <div className="flex items-end gap-1.5 h-20">
                    <div className="w-1.5 bg-red-500 rounded-full animate-[bounce_1s_infinite_100ms] h-12"></div>
                    <div className="w-1.5 bg-red-400 rounded-full animate-[bounce_1s_infinite_300ms] h-16"></div>
                    <div className="w-1.5 bg-red-500 rounded-full animate-[bounce_1s_infinite_0s] h-8"></div>
                    <div className="w-1.5 bg-red-600 rounded-full animate-[bounce_1s_infinite_500ms] h-20"></div>
                    <div className="w-1.5 bg-red-400 rounded-full animate-[bounce_1s_infinite_200ms] h-14"></div>
                    <div className="w-1.5 bg-red-500 rounded-full animate-[bounce_1s_infinite_400ms] h-10"></div>
                    <div className="w-1.5 bg-red-600 rounded-full animate-[bounce_1s_infinite_600ms] h-18"></div>
                  </div>
                ) : voiceStatus === 'connecting' ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full border-4 border-red-500 border-t-transparent animate-spin"></div>
                    <span className="text-xs text-gray-400">Connecting audio channels...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-20 h-20 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500">
                      <Mic className="w-8 h-8" />
                    </div>
                    <span className="text-xs text-gray-400">Call is disconnected</span>
                  </div>
                )}
              </div>

              {/* Bottom Controls */}
              <div className="w-full text-center space-y-4 relative z-10">
                {voiceError && (
                  <p className="text-xs text-red-400 bg-red-950/20 px-3 py-2 rounded-lg border border-red-900/30 max-w-[300px] mx-auto">
                    {voiceError}
                  </p>
                )}

                {voiceStatus === 'connected' ? (
                  <button 
                    onClick={stopVoiceSession}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold rounded-full shadow-lg transition-all cursor-pointer text-sm"
                  >
                    <PhoneOff className="w-4 h-4" /> End Live Call
                  </button>
                ) : (
                  <button 
                    onClick={startVoiceSession}
                    disabled={voiceStatus === 'connecting'}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-800 active:scale-95 text-white font-bold rounded-full shadow-lg transition-all cursor-pointer text-sm"
                  >
                    <Phone className="w-4 h-4" /> Start Live Search Call
                  </button>
                )}

                <div className="text-[10px] text-gray-500 flex items-center justify-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${voiceStatus === 'connected' ? 'bg-green-500' : 'bg-gray-600'}`}></span>
                  Status: {voiceStatus === 'connected' ? 'Connected (Live)' : voiceStatus === 'connecting' ? 'Dialing...' : 'Disconnected'}
                </div>
              </div>
            </div>
          ) : (
            /* STANDARD TEXT CHAT INTERFACE */
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                      msg.sender === 'user' 
                        ? 'bg-[#d02326] text-white rounded-br-none' 
                        : msg.error 
                          ? 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-bl-none'
                          : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      
                      {/* Google Search Queries */}
                      {msg.queries && msg.queries.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500 flex items-center gap-1">
                            <Search className="w-3 h-3" /> Searched for:
                          </span>
                          {msg.queries.map((q, qidx) => (
                            <span key={qidx} className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-md text-[10px] italic">
                              "{q}"
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Grounding Source Links */}
                      {msg.links && msg.links.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800">
                          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                            <Globe className="w-3 h-3" /> Search Sources:
                          </p>
                          <div className="space-y-1.5">
                            {msg.links.map((link, lidx) => (
                              <a 
                                key={lidx} 
                                href={link.uri} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block text-xs text-blue-600 dark:text-blue-400 hover:underline truncate max-w-full font-medium"
                              >
                                • {link.title || link.uri}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Loading / Typing Indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 rounded-bl-none shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-1.5 h-1.5 bg-[#d02326] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-1.5 h-1.5 bg-[#d02326] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-1.5 h-1.5 bg-[#d02326] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                        <span className="text-xs italic flex items-center gap-1">
                          <Search className="w-3 h-3 text-[#d02326] animate-pulse" /> Google AI is searching the web...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                <form onSubmit={handleSend} className="flex items-center gap-2">
                  <input 
                    type="text" 
                    placeholder="Ask about car specs, pricing, classic history..." 
                    className="flex-1 bg-gray-50 dark:bg-gray-950 rounded-full px-4 py-2 text-sm text-gray-800 dark:text-gray-150 border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-1 focus:ring-[#d02326] focus:border-transparent"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    disabled={isLoading}
                  />
                  <button 
                    type="submit" 
                    disabled={!input.trim() || isLoading}
                    className="w-9 h-9 bg-[#d02326] disabled:bg-gray-300 dark:disabled:bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-[#b01e20] transition-colors shrink-0"
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
