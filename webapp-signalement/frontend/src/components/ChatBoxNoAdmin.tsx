import { useState, useEffect, useRef } from "react";

interface Message {
  id: number;
  userId: string | null;
  contenu: string; 
  createdAt: string;
  user?: {
    name: string;
    role: { nameRole: string };
  } | null;
}

interface ChatBoxProps {
  idSignalement: number;
  trackingCode: string; // Ajouté pour l'API
  password: string;     // Ajouté pour l'API
}

export default function ChatBox({ idSignalement, trackingCode, password }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Charger les messages avec le BODY spécifique (POST)
  const fetchMessages = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/signalements/getMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            idSignalement, 
            trackingCode, 
            password 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (err) {
      console.error("Erreur chargement messages:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000); // Polling 10s
    return () => clearInterval(interval);
  }, [idSignalement]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const response = await fetch("http://localhost:5000/api/messages/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            idSignalement, 
            bodymessage: newMessage, 
            userId: null 
        }),
      });

      if (response.ok) {
        setNewMessage("");
        await fetchMessages();
      }
    } catch (err) {
      console.error("Erreur envoi:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden h-[500px] mt-6">
      <div className="bg-slate-50 p-3 border-b border-gray-100 flex items-center justify-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest">Canal de communication chiffré</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/20">
        {messages.map((msg) => {
          const isAdmin = msg.userId !== null;
          return (
            <div key={msg.id} className={`flex w-full ${isAdmin ? "justify-start" : "justify-end"}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${
                isAdmin ? "bg-white border border-slate-200 rounded-bl-none text-slate-800" : "bg-blue-600 text-white rounded-br-none"
              }`}>
                <div className="flex items-center justify-between gap-4 mb-1">
                  <span className={`text-[10px] font-black uppercase tracking-tighter ${isAdmin ? "text-blue-600" : "text-blue-100"}`}>
                    {isAdmin ? `⚖️ ${msg.user?.role?.nameRole} (${msg.user?.name})` : "👤 Vous"}
                  </span>
                  <span className="text-[9px] opacity-60 font-mono">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.contenu}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Répondre ici..."
          className="flex-1 bg-slate-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
        <button 
          type="submit" 
          disabled={sending || !newMessage.trim()}
          className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-all text-sm font-bold disabled:bg-slate-200 disabled:text-slate-400"
        >
          {sending ? "..." : "Envoyer"}
        </button>
      </form>
    </div>
  );
}