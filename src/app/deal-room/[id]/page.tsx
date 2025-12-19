'use client';

import {
  CheckCircle,
  ChevronRight,
  FileText,
  Lock,
  Menu,
  MessageSquare,
  Paperclip,
  Send
} from 'lucide-react';
import { useState } from 'react';

export default function DealRoomPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('feed');

  // --- MOCK DATA (Bypassing Database) ---
  const listing = {
    title: "High-Volume Chevron Gas Station & C-Store",
    price: 2450000,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80",
    id: params.id || '123'
  };

  const dealStages = [
    { id: 1, label: "NDA Signed", status: "completed", date: "Dec 12" },
    { id: 2, label: "Buyer Review", status: "active", date: "Current" },
    { id: 3, label: "Letter of Intent", status: "locked", date: "-" },
    { id: 4, label: "Due Diligence", status: "locked", date: "-" },
    { id: 5, label: "Closing", status: "locked", date: "-" },
  ];

  const messages = [
    { id: 1, sender: "System", text: "NDA signed by John Doe.", time: "Dec 12, 9:00 AM", type: "system" },
    { id: 2, sender: "Broker", text: "Welcome to the deal room! I've uploaded the P&L for 2023.", time: "Dec 12, 10:30 AM", type: "agent" },
    { id: 3, sender: "You", text: "Thanks. Can I see the lease agreement?", time: "Dec 12, 11:15 AM", type: "user" },
  ];

  const documents = [
    { name: "2023_Financials_P&L.pdf", size: "2.4 MB", locked: false },
    { name: "Lease_Agreement_Draft.pdf", size: "1.1 MB", locked: true },
    { name: "Staff_List_Blind.xlsx", size: "850 KB", locked: true },
  ];

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-50 overflow-hidden">
      
      {/* LEFT COLUMN: DEAL STAGES (Hidden on mobile) */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-200 p-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Deal Progress</h3>
        <div className="space-y-6 relative">
          {/* Vertical Line */}
          <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-slate-100 -z-10"></div>
          
          {dealStages.map((stage) => (
            <div key={stage.id} className="flex items-start gap-4">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center border-2 z-10
                ${stage.status === 'completed' ? 'bg-green-100 border-green-500 text-green-600' : ''}
                ${stage.status === 'active' ? 'bg-blue-600 border-blue-600 text-white' : ''}
                ${stage.status === 'locked' ? 'bg-white border-slate-200 text-slate-300' : ''}
              `}>
                {stage.status === 'completed' ? <CheckCircle size={14} /> : 
                 stage.status === 'locked' ? <Lock size={14} /> : 
                 <span className="text-xs font-bold">{stage.id}</span>}
              </div>
              <div className="pt-1">
                <p className={`text-sm font-bold ${stage.status === 'active' ? 'text-slate-900' : 'text-slate-500'}`}>
                  {stage.label}
                </p>
                <p className="text-xs text-slate-400">{stage.date}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* CENTER COLUMN: ACTIVITY & CHAT */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="text-slate-400" size={20} />
            Deal Activity
          </h1>
          <button className="md:hidden text-slate-500"><Menu /></button>
        </header>

        {/* Scrollable Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`
                max-w-md p-4 rounded-xl text-sm shadow-sm
                ${msg.type === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'}
                ${msg.type === 'system' ? 'bg-slate-100 border-none text-slate-500 w-full text-center max-w-none shadow-none italic' : ''}
              `}>
                {msg.type !== 'system' && <p className="text-xs opacity-70 mb-1">{msg.sender}</p>}
                <p>{msg.text}</p>
                {msg.type !== 'system' && <p className="text-[10px] opacity-50 text-right mt-2">{msg.time}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200">
          <div className="flex gap-3 max-w-3xl mx-auto">
            <button className="p-2 text-slate-400 hover:text-slate-600"><Paperclip size={20} /></button>
            <input 
              type="text" 
              placeholder="Type a message to the broker..." 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Send size={20} />
            </button>
          </div>
        </div>
      </main>

      {/* RIGHT COLUMN: CONTEXT & DOCS (Hidden on mobile) */}
      <aside className="hidden lg:flex w-80 flex-col bg-white border-l border-slate-200 overflow-y-auto">
        {/* Listing Card */}
        <div className="p-5 border-b border-slate-100">
          <div className="aspect-video rounded-lg bg-slate-100 overflow-hidden mb-4 relative">
            <img src={listing.image} alt="Listing" className="w-full h-full object-cover" />
            <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded">DEAL ROOM ACTIVE</div>
          </div>
          <h3 className="font-bold text-slate-900 leading-tight mb-2">{listing.title}</h3>
          <p className="text-2xl font-extrabold text-slate-900 mb-4">${listing.price.toLocaleString()}</p>
          <button className="w-full bg-[#EA580C] hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2">
            Make an Offer <ChevronRight size={16} />
          </button>
        </div>

        {/* Document Vault */}
        <div className="p-5">
          <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FileText size={18} className="text-slate-400" /> 
            Document Vault
          </h4>
          <div className="space-y-3">
            {documents.map((doc, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-slate-300 transition-colors group cursor-pointer">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="bg-slate-100 p-2 rounded">
                    <FileText size={16} className="text-slate-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{doc.name}</p>
                    <p className="text-xs text-slate-400">{doc.size}</p>
                  </div>
                </div>
                {doc.locked ? <Lock size={14} className="text-slate-300" /> : <div className="w-2 h-2 rounded-full bg-green-500"></div>}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
