import React from 'react';
import { MessageCircle, Users, Wrench, Calendar, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const DISCUSSIONS = [
  { id: 1, title: "Where to source authentic parts for '68 Mustang?", author: "ClassicFan99", replies: 24, category: "Restoration Help", lastActive: "2 hours ago" },
  { id: 2, title: "Upcoming Vintage Meetup in Milan (Oct 2026)", author: "VespaKing", replies: 8, category: "Events", lastActive: "5 hours ago" },
  { id: 3, title: "Debate: Patina vs Full Restoration on pre-war models", author: "HeritagePreserver", replies: 156, category: "General Discussion", lastActive: "1 day ago" },
  { id: 4, title: "Identifying engine cast numbers on Series II Land Rover", author: "MuddyTracks", replies: 12, category: "Authenticity & Marking", lastActive: "2 days ago" },
];

export default function Community() {
  return (
    <div className="py-12 bg-[var(--color-antique)] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12">
           <h1 className="font-serif text-4xl mb-2 text-[var(--color-bottle)]">Enthusiast Community</h1>
           <p className="text-[var(--color-charcoal)] opacity-70">Join the discussion. Share knowledge, ask for help, or plan events.</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-[var(--color-parchment)] p-6 rounded-2xl border border-[var(--color-brass)] border-opacity-30 flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer">
             <div className="bg-[#E4E3E0] p-3 rounded-full shrink-0"><Users className="w-6 h-6 text-[var(--color-charcoal)]" /></div>
             <div><h3 className="font-serif text-lg font-semibold mb-1 text-[var(--color-bottle)]">General Chat</h3><p className="text-xs text-gray-500">All things vintage.</p></div>
          </div>
          <div className="bg-[var(--color-parchment)] p-6 rounded-2xl border border-[var(--color-brass)] border-opacity-30 flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer">
             <div className="bg-[#E4E3E0] p-3 rounded-full shrink-0"><Wrench className="w-6 h-6 text-[var(--color-charcoal)]" /></div>
             <div><h3 className="font-serif text-lg font-semibold mb-1 text-[var(--color-bottle)]">Restoration Help</h3><p className="text-xs text-gray-500">Technical advice & sourcing.</p></div>
          </div>
          <div className="bg-[var(--color-parchment)] p-6 rounded-2xl border border-[var(--color-brass)] border-opacity-30 flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer">
             <div className="bg-[#E4E3E0] p-3 rounded-full shrink-0"><Calendar className="w-6 h-6 text-[var(--color-charcoal)]" /></div>
             <div><h3 className="font-serif text-lg font-semibold mb-1 text-[var(--color-bottle)]">Events</h3><p className="text-xs text-gray-500">Rallies, auctions & shows.</p></div>
          </div>
          <div className="bg-[var(--color-parchment)] p-6 rounded-2xl border border-[var(--color-brass)] border-opacity-30 flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer">
             <div className="bg-[#E4E3E0] p-3 rounded-full shrink-0"><MessageCircle className="w-6 h-6 text-[var(--color-charcoal)]" /></div>
             <div><h3 className="font-serif text-lg font-semibold mb-1 text-[var(--color-bottle)]">Suggestions</h3><p className="text-xs text-gray-500">Platform feedback.</p></div>
          </div>
        </div>

        {/* Latest Discussions */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-2xl text-[var(--color-bottle)]">Latest Discussions</h2>
            <button className="bg-[var(--color-bottle)] text-white px-5 py-2 rounded-xl text-sm font-semibold tracking-wide uppercase hover:bg-opacity-90 transition-colors">
              New Topic
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            {DISCUSSIONS.map((topic, idx) => (
              <div key={topic.id} className={`p-5 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors ${idx !== DISCUSSIONS.length -1 ? 'border-b border-gray-100' : ''}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-brass)]">{topic.category}</span>
                  </div>
                  <h3 className="font-serif text-lg font-medium text-[var(--color-bottle)] mb-1">{topic.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>By <span className="font-medium text-gray-700">{topic.author}</span></span>
                    <span>{topic.lastActive}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 ml-4">
                  <div className="text-center hidden sm:block">
                    <span className="block font-medium text-gray-800">{topic.replies}</span>
                    <span className="text-xs text-gray-500">Replies</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
