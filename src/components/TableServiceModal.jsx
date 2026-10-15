import React, { useState } from 'react';
import { 
  Bell, 
  Send, 
  UserCheck, 
  X, 
  CheckCircle2, 
  MessageSquare, 
  History,
  Sparkles,
  CornerDownRight,
  ShieldCheck
} from 'lucide-react';

export default function TableServiceModal({
  isOpen,
  onClose,
  tableNumber,
  onSendRequest,
  serviceCalls = [],
  onSeen,
  unreadCount = 0
}) {
  // Filter messages related to this table
  const tableMessages = serviceCalls.filter(c => c.tableNumber === tableNumber);
  
  const [customMessage, setCustomMessage] = useState('');
  const chatBottomRef = React.useRef(null);

  const prevMsgCountRef = React.useRef(tableMessages.length);

  // Mark as seen whenever user opens the modal
  React.useEffect(() => {
    if (isOpen && onSeen) {
      onSeen();
    }
  }, [isOpen]);

  // Scroll to bottom ONLY when modal opens or when a brand new message arrives
  React.useEffect(() => {
    if (isOpen) {
      if (tableMessages.length !== prevMsgCountRef.current || prevMsgCountRef.current === 0) {
        prevMsgCountRef.current = tableMessages.length;
        const timer = setTimeout(() => {
          chatBottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 80);
        return () => clearTimeout(timer);
      }
    }
  }, [tableMessages.length, isOpen]);

  if (!isOpen) return null;

  const quickRequests = [
    { label: "এক বোতল পানি প্রয়োজন", icon: "💧", text: "দয়া করে এক বোতল ফ্রেশ মিনারেল ওয়াটার পাঠান।" },
    { label: "টেবিল পরিষ্কার করুন", icon: "🧽", text: "দয়া করে আমাদের টেবিলটি একবার পরিষ্কার করে দিন।" },
    { label: "টিস্যু ও কাটলারি দিন", icon: "🍴", text: "অতিরিক্ত টিস্যু ও চামচ/কাটলারি প্রয়োজন।" },
    { label: "পার্সেল / টেকঅ্যাওয়ে বক্স", icon: "📦", text: "অবশিষ্ট খাবার প্যাক করার জন্য পার্সেল বক্স পাঠান।" },
    { label: "লবণ ও মরিচ/সস দিন", icon: "🧂", text: "অতিরিক্ত চিলি সস ও গোলমরিচ দিন।" }
  ];

  const handleSubmit = (type, messageText) => {
    const textToSend = messageText || customMessage;
    if (!textToSend.trim() && type === 'custom') return;

    onSendRequest({
      id: 'req_' + Date.now(),
      tableNumber,
      type: type, // 'waiter' | 'custom'
      message: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'pending',
      isSeenByManager: false,
      replies: []
    });

    setCustomMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col h-[600px] max-h-[92vh] overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-2 rounded-full transition-colors text-xs font-bold z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-md shadow-orange-500/15 shrink-0">
            <Bell className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">টেবিল সার্ভিস ও ওয়েটার কল</h3>
            <p className="text-xs text-orange-600 font-bold">
              Table {tableNumber} Dining Assistance
            </p>
          </div>
        </div>

        {/* Unified Messenger Screen (Idea 1: Everything in one clean view) */}
        <div className="flex-1 flex flex-col min-h-0 pt-3 space-y-3">
          
          {/* Quick Direct Waiter Alert Bar */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-2.5 sm:p-3 text-white flex items-center justify-between shadow-xs shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                <Bell className="w-3.5 h-3.5 text-white animate-bounce" />
              </div>
              <span className="text-xs font-bold">জরুরি ওয়েটার প্রয়োজন?</span>
            </div>
            <button
              onClick={() => handleSubmit('waiter', 'গ্রাহক টেবিলে একজন ওয়েটার ডেকেছেন।')}
              className="px-3 py-1.5 rounded-xl bg-white text-orange-600 font-black text-xs hover:bg-orange-50 transition-all shadow-xs flex items-center gap-1 active:scale-95"
            >
              <UserCheck className="w-3.5 h-3.5 text-orange-600" />
              <span>Call Waiter</span>
            </button>
          </div>

          {/* Conversation Flow Area (Fully Scrollable) */}
          <div className="flex-1 overflow-y-auto space-y-3 p-3 sm:p-4 bg-slate-100/70 rounded-2xl border border-slate-200 min-h-0 overscroll-contain">
            {tableMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 text-slate-400">
                <div className="w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center text-slate-400">
                  <MessageSquare className="w-6 h-6 stroke-[1.5]" />
                </div>
                <p className="text-xs font-bold text-slate-600">ম্যানেজারের সাথে লাইভ চ্যাট</p>
                <p className="text-[11px] text-slate-400 max-w-xs">
                  নিচের কুইক অপশনে চাপ দিন অথবা আপনার যেকোনো চাহিদা লিখে সরাসরি মেসেজ পাঠান।
                </p>
              </div>
            ) : (
              (() => {
                // Flatten all items into chronological list of messages
                const allBubbles = [];
                tableMessages.forEach((msg) => {
                  const isMgrThread = msg.sender === 'manager' || msg.type === 'manager_direct';
                  const baseTs = typeof msg.id === 'string' && msg.id.includes('_')
                    ? parseInt(msg.id.split('_')[1], 10) || 0
                    : 0;

                  allBubbles.push({
                    id: msg.id,
                    sender: isMgrThread ? 'manager' : 'customer',
                    text: msg.message,
                    time: msg.time,
                    ts: baseTs,
                    status: msg.status
                  });

                  if (msg.replies && msg.replies.length > 0) {
                    msg.replies.forEach((rep) => {
                      if (rep.text !== msg.message) {
                        const repTs = typeof rep.id === 'string' && rep.id.includes('_')
                          ? parseInt(rep.id.split('_')[1], 10) || baseTs + 1
                          : baseTs + 1;

                        allBubbles.push({
                          id: rep.id,
                          sender: rep.sender || 'manager',
                          text: rep.text,
                          time: rep.time,
                          ts: repTs
                        });
                      }
                    });
                  }
                });

                // Sort chronologically ascending (oldest first at top, newest at bottom)
                allBubbles.sort((a, b) => a.ts - b.ts);

                return allBubbles.map((bubble, bIdx) => {
                  const isMe = bubble.sender === 'customer'; // User message on the right (White bubble)

                  return (
                    <div
                      key={bubble.id || bIdx}
                      className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      {/* Manager Avatar on Left */}
                      {!isMe && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-[11px] font-black shadow-xs shrink-0 ring-2 ring-white">
                          MG
                        </div>
                      )}

                      {/* Bubble Content */}
                      <div
                        className={`max-w-[78%] sm:max-w-[70%] rounded-2xl px-3.5 py-2.5 shadow-xs transition-all ${
                          isMe
                            ? 'bg-white text-slate-900 border border-slate-200/90 rounded-br-xs'
                            : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-bl-xs shadow-purple-500/15'
                        }`}
                      >
                        {/* Sender Label */}
                        <div className="flex items-center justify-between gap-3 mb-1">
                          <span
                            className={`text-[10px] font-extrabold uppercase tracking-wider ${
                              isMe ? 'text-orange-600' : 'text-purple-200'
                            }`}
                          >
                            {isMe ? 'আপনি (Table ' + tableNumber + ')' : 'ফ্লোর ম্যানেজার'}
                          </span>
                          <span
                            className={`text-[9px] font-mono ${
                              isMe ? 'text-slate-400' : 'text-purple-200/90'
                            }`}
                          >
                            {bubble.time}
                          </span>
                        </div>

                        {/* Message Body */}
                        <p className={`text-xs leading-relaxed font-medium break-words ${isMe ? 'text-slate-800' : 'text-white'}`}>
                          {bubble.text}
                        </p>
                      </div>

                      {/* Customer Avatar on Right */}
                      {isMe && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center text-[11px] font-black shadow-xs shrink-0 ring-2 ring-white">
                          T-{tableNumber}
                        </div>
                      )}
                    </div>
                  );
                });
              })()
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Action Chips (One-Click Pills) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
            {quickRequests.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSubmit('custom', q.text)}
                className="whitespace-nowrap px-2.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-[11px] font-bold text-orange-800 transition-all shadow-2xs active:scale-95 flex items-center gap-1 shrink-0"
              >
                <span>{q.icon}</span>
                <span>{q.label}</span>
              </button>
            ))}
          </div>

          {/* Bottom Message Input Bar */}
          <div className="space-y-1.5 shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customMessage.trim()) {
                    handleSubmit('custom', customMessage);
                  }
                }}
                placeholder="মেসেজ লিখুন (যেমন: পানি দিন, টেবিল পরিষ্কার করুন)..."
                className="flex-1 bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none"
              />

              <button
                onClick={() => handleSubmit('custom', customMessage)}
                disabled={!customMessage.trim()}
                className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs active:scale-95 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>পাঠান</span>
              </button>
            </div>
            
            <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 font-medium">
              <span>টেবিলের সাথে ফ্লোর ম্যানেজার সংযুক্ত</span>
              <span>লাইভ চ্যাট সক্রিয় • BiteIQ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
