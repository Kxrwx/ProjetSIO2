import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";

interface Message {
  id: number;
  idSignalement: number;
  userId: string | null;
  contenu: string;
  isRead: boolean;
  createdAt: string;
  user?: {
    name: string;
    surname: string;
    role: {
      nameRole: string;
    };
  } | null;
}

export default function Messages() {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll automatique vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = useCallback(async () => {
    if (!id) return;

    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/signalement/getMessage",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idSignalement: Number(id) }),
        }
      );

      if (!response.ok) throw new Error("Erreur lors du chargement des messages");

      const result = await response.json();
      // Adapter selon la structure retournée par votre API
      setMessages(Array.isArray(result) ? result : result.messages ?? []);
      console.log("Messages récupérés:", result);
      setError(null);
    } catch (err) {
      console.error("Erreur connexion:", err);
      setError("Impossible de charger les messages.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Chargement initial + polling toutes les 10s
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 10_000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/signalements/createMessage",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idSignalement: Number(id),
            bodymessage: newMessage,
          }),
        }
      );

      if (!response.ok) throw new Error("Échec de l'envoi");

      setNewMessage("");
      await fetchMessages();
      inputRef.current?.focus();
    } catch (err) {
      console.error("Erreur envoi:", err);
      setError("Échec de l'envoi du message.");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
    });

  // Grouper les messages par date
  const groupedMessages = messages.reduce<{ date: string; msgs: Message[] }[]>(
    (acc, msg) => {
      const date = formatDate(msg.createdAt);
      const last = acc[acc.length - 1];
      if (last && last.date === date) {
        last.msgs.push(msg);
      } else {
        acc.push({ date, msgs: [msg] });
      }
      return acc;
    },
    []
  );

  return (
    <div className="flex flex-col h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
            #{id}
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800">
              Signalement n°{id}
            </h1>
            <p className="text-xs text-slate-400">Canal de communication chiffré</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Indicateur de connexion live */}
          <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            En direct
          </span>

          {/* Bouton rafraîchir manuel */}
          <button
            onClick={fetchMessages}
            className="text-xs text-slate-500 hover:text-blue-600 border border-slate-200 hover:border-blue-300 rounded-lg px-3 py-1.5 transition-all"
          >
            ↻ Actualiser
          </button>
        </div>
      </div>

      {/* Zone messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {loading && (
          <div className="flex justify-center py-20">
            <div className="flex flex-col items-center gap-3 text-slate-400">
              <div className="w-8 h-8 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-sm">Chargement des messages…</p>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="flex justify-center py-10">
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-5 py-3">
              ⚠️ {error}
            </div>
          </div>
        )}

        {!loading && !error && messages.length === 0 && (
          <div className="flex justify-center py-20">
            <div className="text-center text-slate-400">
              <p className="text-3xl mb-2">💬</p>
              <p className="text-sm font-medium">Aucun message pour l'instant</p>
              <p className="text-xs mt-1">Démarrez la conversation avec le déclarant</p>
            </div>
          </div>
        )}

        {groupedMessages.map(({ date, msgs }) => (
          <div key={date} className="space-y-3">
            {/* Séparateur de date */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider px-2">
                {date}
              </span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {msgs.map((msg) => {
              // userId !== null → message envoyé par un admin (côté admin = droite)
              const isFromAdmin = msg.userId !== null;

              return (
                <div
                  key={msg.id}
                  className={`flex w-full ${isFromAdmin ? "justify-end" : "justify-start"}`}
                >
                  {/* Avatar utilisateur externe */}
                  {!isFromAdmin && (
                    <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs mr-2 mt-1 flex-shrink-0">
                      👤
                    </div>
                  )}

                  <div
                    className={`max-w-[70%] px-4 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed ${
                      isFromAdmin
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white border border-slate-200 text-slate-800 rounded-bl-none"
                    }`}
                  >
                    {/* En-tête de bulle */}
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <span
                        className={`text-[10px] font-black uppercase tracking-tighter ${
                          isFromAdmin ? "text-blue-200" : "text-blue-600"
                        }`}
                      >
                        {isFromAdmin
                          ? `⚖️ ${msg.user?.role?.nameRole ?? "Admin"} — ${msg.user?.name ?? ""}`
                          : "👤 Déclarant"}
                      </span>
                      <span
                        className={`text-[9px] font-mono ${
                          isFromAdmin ? "text-blue-200" : "text-slate-400"
                        }`}
                      >
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>

                    <p className="whitespace-pre-wrap">{msg.contenu}</p>
                  </div>

                  {/* Avatar admin */}
                  {isFromAdmin && (
                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs ml-2 mt-1 flex-shrink-0">
                      ⚖️
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Zone de saisie */}
      <div className="bg-white border-t border-slate-200 px-6 py-4">
        {error && !loading && (
          <p className="text-xs text-red-500 mb-2">⚠️ {error}</p>
        )}
        <form onSubmit={handleSendMessage} className="flex gap-3 items-center">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Répondre au déclarant…"
            className="flex-1 bg-slate-100 rounded-full px-5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm px-5 py-2.5 rounded-full transition-all"
          >
            {sending ? (
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Envoi…
              </span>
            ) : (
              "Envoyer ↗"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}