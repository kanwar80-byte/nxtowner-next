"use client";

import { AuthGate } from "@/components/auth/AuthGate";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getDealRoomById,
  getMessagesForRoom,
  getOffersForRoom,
  sendMessage,
  submitOffer,
  updateOfferStatus,
} from "@/app/actions/dealroom";
import type { DealRoom, Message, Offer } from "@/types/database";

interface DealRoomPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function DealRoomPage({ params }: DealRoomPageProps) {
  const [roomId, setRoomId] = useState<string>("");
  const [room, setRoom] = useState<DealRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [offerAmount, setOfferAmount] = useState("");
  const [offerNotes, setOfferNotes] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "messages" | "offers">("overview");

  const loadRoom = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    const roomData = await getDealRoomById(id);
    if (!roomData) {
      setError("You do not have access to this deal room or it does not exist.");
      setLoading(false);
      return;
    }

    setRoom(roomData);

    const [msgs, offs] = await Promise.all([
      getMessagesForRoom(id),
      getOffersForRoom(id),
    ]);

    setMessages(msgs || []);
    setOffers(offs || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    params.then((p) => {
      setRoomId(p.id);
      void loadRoom(p.id);
    });
  }, [params, loadRoom]);

  async function handleSendMessage() {
    if (!roomId || !messageInput.trim()) return;
    const res = await sendMessage(roomId, messageInput.trim());
    if (!res.success) {
      alert(res.error || "Failed to send message");
      return;
    }
    setMessageInput("");
    const msgs = await getMessagesForRoom(roomId);
    setMessages(msgs || []);
  }

  async function handleSubmitOffer() {
    if (!roomId || !offerAmount.trim()) return;
    const amount = Number(offerAmount);
    if (Number.isNaN(amount) || amount <= 0) {
      alert("Enter a valid offer amount");
      return;
    }
    const res = await submitOffer(roomId, amount, offerNotes.trim() || undefined);
    if (!res.success) {
      alert(res.error || "Failed to submit offer");
      return;
    }
    setOfferAmount("");
    setOfferNotes("");
    const offs = await getOffersForRoom(roomId);
    setOffers(offs || []);
    setActiveTab("offers");
  }

  async function handleOfferAction(offerId: string, status: 'accepted' | 'rejected' | 'withdrawn') {
    const res = await updateOfferStatus(offerId, status);
    if (!res.success) {
      alert(res.error || "Failed to update offer");
      return;
    }
    const offs = await getOffersForRoom(roomId);
    setOffers(offs || []);
  }

  const sortedMessages = useMemo(
    () => [...messages].sort((a, b) => a.created_at.localeCompare(b.created_at)),
    [messages]
  );

  const sortedOffers = useMemo(
    () => [...offers].sort((a, b) => b.created_at.localeCompare(a.created_at)),
    [offers]
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-brand-bg py-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-brand-muted">Loading deal room...</div>
      </main>
    );
  }

  if (error || !room) {
    return (
      <main className="min-h-screen bg-brand-bg py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-8 text-center">
            <h1 className="text-2xl font-bold text-brand-text mb-3">Access Denied</h1>
            <p className="text-brand-muted">{error || "You do not have access to this deal room."}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <AuthGate>
      <div className="min-h-screen bg-brand-bg py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Header */}
          <div className="bg-brand-card border border-brand-border rounded-2xl shadow-sm p-6">
            <h1 className="text-3xl font-bold text-brand-text mb-2">Deal Room</h1>
            <p className="text-brand-muted">Deal ID: <span className="font-mono text-brand-text">{roomId}</span></p>
            <p className="text-brand-muted text-sm mt-1">Listing: {room.listing_id}</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-brand-border">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                activeTab === "overview" ? "border-brand-navy text-brand-navy" : "border-transparent text-brand-muted hover:text-brand-text"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                activeTab === "messages" ? "border-brand-navy text-brand-navy" : "border-transparent text-brand-muted hover:text-brand-text"
              }`}
            >
              Messages
            </button>
            <button
              onClick={() => setActiveTab("offers")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                activeTab === "offers" ? "border-brand-navy text-brand-navy" : "border-transparent text-brand-muted hover:text-brand-text"
              }`}
            >
              Offers
            </button>
          </div>

          {activeTab === "overview" && (
            <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-6 space-y-3">
              <p className="text-brand-text"><span className="font-semibold">Status:</span> {room.status}</p>
              <p className="text-brand-text"><span className="font-semibold">Created:</span> {new Date(room.created_at).toLocaleString("en-CA")}</p>
              <p className="text-brand-text"><span className="font-semibold">Updated:</span> {new Date(room.updated_at).toLocaleString("en-CA")}</p>
            </div>
          )}

          {activeTab === "messages" && (
            <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-6 space-y-4">
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {sortedMessages.length === 0 && (
                  <p className="text-sm text-brand-muted">No messages yet.</p>
                )}
                {sortedMessages.map((m) => (
                  <div key={m.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between text-xs text-brand-muted mb-1">
                      <span className="font-semibold text-brand-text">User {m.sender_id.slice(0, 6)}...</span>
                      <span>{new Date(m.created_at).toLocaleString("en-CA")}</span>
                    </div>
                    <p className="text-brand-text text-sm whitespace-pre-wrap">{m.body}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-brand-border pt-4 space-y-2">
                <textarea
                  rows={3}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full px-4 py-2.5 border border-brand-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-navy resize-none"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-brand-navy text-white rounded-md font-medium hover:bg-slate-900 transition"
                >
                  Send Message
                </button>
              </div>
            </div>
          )}

          {activeTab === "offers" && (
            <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-6 space-y-4">
              <div className="space-y-3">
                {sortedOffers.length === 0 && <p className="text-sm text-brand-muted">No offers yet.</p>}
                {sortedOffers.map((offer) => (
                  <div key={offer.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-lg font-semibold text-brand-text">${offer.amount.toLocaleString("en-CA")}</p>
                        <p className="text-xs text-brand-muted">{new Date(offer.created_at).toLocaleString("en-CA")}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-700 uppercase">{offer.status}</span>
                    </div>
                    {offer.notes && <p className="text-sm text-brand-text mt-2 whitespace-pre-wrap">{offer.notes}</p>}
                    <div className="flex gap-2 mt-3">
                      {offer.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleOfferAction(offer.id, "accepted")}
                            className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-semibold hover:bg-green-700 transition"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleOfferAction(offer.id, "rejected")}
                            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-semibold hover:bg-red-700 transition"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleOfferAction(offer.id, "withdrawn")}
                            className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md text-sm font-semibold hover:bg-slate-300 transition"
                          >
                            Withdraw
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-brand-border pt-4 space-y-2">
                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    type="number"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    placeholder="Offer amount (CAD)"
                    className="flex-1 px-4 py-2 border border-brand-border rounded-md"
                  />
                  <textarea
                    rows={2}
                    value={offerNotes}
                    onChange={(e) => setOfferNotes(e.target.value)}
                    placeholder="Notes (optional)"
                    className="flex-1 px-4 py-2 border border-brand-border rounded-md"
                  />
                  <button
                    onClick={handleSubmitOffer}
                    className="px-4 py-2 bg-brand-navy text-white rounded-md font-medium hover:bg-slate-900 transition"
                  >
                    Submit Offer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthGate>
  );
}
