import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  Flame, 
  CheckCircle, 
  Clock, 
  Utensils, 
  Check, 
  LogOut, 
  Table as TableIcon, 
  AlertTriangle, 
  Sparkles, 
  UserCheck, 
  MessageSquare, 
  Send, 
  CornerDownRight, 
  Receipt, 
  DollarSign, 
  Coins, 
  TrendingUp, 
  Star, 
  Award, 
  Heart, 
  Sliders, 
  Megaphone, 
  Tag, 
  RefreshCw, 
  Eye, 
  Trash2, 
  Gift, 
  Plus, 
  CheckCircle2, 
  X, 
  Edit3, 
  Search,
  Upload,
  Camera,
  FolderOpen,
  QrCode
} from 'lucide-react';
import ThermalReceiptModal from './ThermalReceiptModal';
import MonthlySalesLedgerModal from './MonthlySalesLedgerModal';
import TableQRCodeModal from './TableQRCodeModal';
import { CUSTOMER_REVIEWS } from '../data/restaurantData';

export default function ManagerDashboardView({
  pendingRequests,
  activeOrders,
  completedOrders,
  serviceCalls = [],
  customerReviews = [],
  featuredReviews = [],
  activeNotice,
  menuItems = [],
  onUpdateMenuItem,
  onAddMenuItem,
  onDeleteMenuItem,
  onResetMenu,
  onUpdateNotice,
  onToggleFeatureReview,
  onResetFeaturedReviews,
  onClearReviews,
  onConfirmRequest,
  onCompleteOrder,
  onDismissServiceCall,
  onReplyServiceCall,
  onMarkTableAsSeen,
  onUpdatePaymentStatus,
  onReleaseTable,
  onApplyDiscount,
  getOrderRemainingSeconds,
  onLogout,
  onClose
}) {
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'kitchen' | 'assistance' | 'bills' | 'reviews' | 'control'
  const [replyInputMap, setReplyInputMap] = useState({});
  const [selectedChatTable, setSelectedChatTable] = useState(null); // No table selected initially (empty chat card)
  const [directMsgText, setDirectMsgText] = useState('');
  const [manualOccupiedTables, setManualOccupiedTables] = useState([]);
  const [viewingReceiptOrder, setViewingReceiptOrder] = useState(null);

  // Menu item management state
  const [editingItem, setEditingItem] = useState(null);
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);
  const [menuSearchQuery, setMenuSearchQuery] = useState('');
  const [menuSelectedCategory, setMenuSelectedCategory] = useState('All');
  const [menuSaveSuccess, setMenuSaveSuccess] = useState(false);
  const [isSalesLedgerOpen, setIsSalesLedgerOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // File input ref for uploading pictures directly from user's laptop/PC
  const imageFileInputRef = useRef(null);

  const handleDeviceImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('অনুগ্রহ করে একটি ছবি ফাইল (.jpg, .png, .webp) নির্বাচন করুন!');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert('ছবির সাইজ ৮MB এর কম হতে হবে!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Image = event.target?.result;
      if (base64Image) {
        setEditingItem((prev) => ({
          ...prev,
          image: base64Image
        }));
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const displayedMenuItems = (menuItems || []).filter((item) => {
    const matchesCat = menuSelectedCategory === 'All' || item.category === menuSelectedCategory;
    const matchesSearch = !menuSearchQuery.trim() || 
      item.name.toLowerCase().includes(menuSearchQuery.toLowerCase()) ||
      (item.tag && item.tag.toLowerCase().includes(menuSearchQuery.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(menuSearchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Manager discount modal state
  const [discountingOrder, setDiscountingOrder] = useState(null);
  const [customDiscountAmt, setCustomDiscountAmt] = useState(50);

  // Notice broadcast form state
  const [noticeForm, setNoticeForm] = useState({
    isActive: activeNotice?.isActive ?? true,
    title: activeNotice?.title || "🔥 আজকের স্পেশাল ডাইনিং অফার! সকল খাবারে ১৫% ছাড়",
    message: activeNotice?.message || "আপনার পছন্দের যেকোনো ডিশ অর্ডারে পাচ্ছেন ১৫% বিশেষ ছাড়! কুপন কোড ব্যবহার করে বিল পরিশোধ করুন।",
    promoCode: activeNotice?.promoCode || "BITE15",
    discountPercent: activeNotice?.discountPercent || 15,
    badgeText: activeNotice?.badgeText || "HOT DEAL 🔥"
  });

  useEffect(() => {
    if (activeNotice) {
      setNoticeForm({
        isActive: activeNotice.isActive ?? true,
        title: activeNotice.title || "",
        message: activeNotice.message || "",
        promoCode: activeNotice.promoCode || "",
        discountPercent: activeNotice.discountPercent || 15,
        badgeText: activeNotice.badgeText || "HOT DEAL 🔥"
      });
    }
  }, [activeNotice]);

  const [noticeSaveSuccess, setNoticeSaveSuccess] = useState(false);

  const noticePresets = [
    {
      name: "🔥 ১৫% অল-অর্ডার অফার",
      title: "🔥 আজকের স্পেশাল ডাইনিং অফার! সকল খাবারে ১৫% ছাড়",
      message: "আপনার পছন্দের যেকোনো ডিশ অর্ডারে পাচ্ছেন ১৫% বিশেষ ছাড়! কুপন কোড ব্যবহার করে বিল পরিশোধ করুন।",
      promoCode: "BITE15",
      discountPercent: 15,
      badgeText: "HOT DEAL 🔥"
    },
    {
      name: "🎉 ২০% উইকেন্ড ধামাকা",
      title: "🎉 উইকেন্ড স্পেশাল ডিনার ধামাকা! ২০% ছাড়",
      message: "আজকের উইকেন্ডে বন্ধু বা পরিবারের সাথে প্রিমিয়াম ডাইনিংয়ে পাচ্ছেন ২০% মেগা ডিসকাউন্ট।",
      promoCode: "WEEKEND20",
      discountPercent: 20,
      badgeText: "WEEKEND SPECIAL 🌟"
    },
    {
      name: "⚡ ১০% হ্যাপি আওয়ারস",
      title: "⚡ হ্যাপি আওয়ার অফার! সকল বেভারেজ ও স্ন্যাক্সে ১০% ছাড়",
      message: "সীমিত সময়ের জন্য সকল কোল্ড বেভারেজ, কফি ও প্রিমিয়াম স্ন্যাক্সে স্পেশাল ছাড়!",
      promoCode: "HAPPY10",
      discountPercent: 10,
      badgeText: "HAPPY HOUR ⏰"
    },
    {
      name: "👨‍🍳 শেফ স্পেশাল ডিশ",
      title: "👨‍🍳 শেফের সেরা সিগনেচার স্পেশাল মেন্যু অফার!",
      message: "আজকের শেফ রিকমেন্ডেড ওয়াগিউ স্লাইডার ও স্পেশাল ডেজার্টে আকর্ষণীয় ডিসকাউন্ট উপভোগ করুন।",
      promoCode: "CHEF10",
      discountPercent: 10,
      badgeText: "CHEF'S PICK 🍽️"
    }
  ];

  const handleToggleNoticeStatus = () => {
    const updated = { ...noticeForm, isActive: !noticeForm.isActive };
    setNoticeForm(updated);
    if (onUpdateNotice) {
      onUpdateNotice(updated);
    }
    setNoticeSaveSuccess(true);
    setTimeout(() => setNoticeSaveSuccess(false), 2500);
  };

  const handleSaveNotice = (e) => {
    if (e) e.preventDefault();
    if (onUpdateNotice) {
      onUpdateNotice(noticeForm);
    }
    setNoticeSaveSuccess(true);
    setTimeout(() => setNoticeSaveSuccess(false), 2500);
  };

  const [dismissedUrgentAlerts, setDismissedUrgentAlerts] = useState([]);
  const [dismissedReadyAlerts, setDismissedReadyAlerts] = useState([]);
  const [dismissedPendingAlerts, setDismissedPendingAlerts] = useState([]);
  const [dismissedServiceAlerts, setDismissedServiceAlerts] = useState([]);
  // Track message IDs that the manager has seen / opened
  const [seenServiceCallIds, setSeenServiceCallIds] = useState([]);

  const markTableAsSeen = (tbl) => {
    setSelectedChatTable(tbl);
    if (onMarkTableAsSeen) {
      onMarkTableAsSeen(tbl);
    }
    const unseen = serviceCalls.filter(
      (c) => c.tableNumber === tbl && !c.isSeenByManager && !seenServiceCallIds.includes(c.id)
    );
    if (unseen.length > 0) {
      setSeenServiceCallIds((prev) => [...new Set([...prev, ...unseen.map((c) => c.id)])]);
    }
  };

  const handleMarkServed = (order) => {
    const res = onCompleteOrder(order.orderId);
    const existing = completedOrders.find(
      (b) => b.tableNumber === order.tableNumber && b.paymentStatus !== 'paid'
    );
    if (existing) {
      const combined = [...existing.items];
      (order.items || []).forEach((item) => {
        const matchIdx = combined.findIndex((i) => i.id === item.id);
        if (matchIdx >= 0) {
          combined[matchIdx] = {
            ...combined[matchIdx],
            quantity: combined[matchIdx].quantity + item.quantity
          };
        } else {
          combined.push(item);
        }
      });
      const subtotal = combined.reduce((acc, i) => acc + i.price * i.quantity, 0);
      const vat = Math.round(subtotal * 0.05);
      const total = subtotal + vat;
      setViewingReceiptOrder({
        ...existing,
        items: combined,
        subtotal,
        vat,
        total,
        servedAtTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        orderRounds: (existing.orderRounds || 1) + 1
      });
    } else {
      setViewingReceiptOrder(
        res || {
          ...order,
          invoiceNumber: 'INV-' + (order.orderId || Math.floor(1000 + Math.random() * 9000)),
          terminalId: 'POS-0' + order.tableNumber,
          servedAtTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          servedDate: new Date().toLocaleDateString('en-GB'),
          subtotal: order.items.reduce((acc, i) => acc + i.price * i.quantity, 0),
          vat: Math.round(order.items.reduce((acc, i) => acc + i.price * i.quantity, 0) * 0.05),
          total: order.total || Math.round(order.items.reduce((acc, i) => acc + i.price * i.quantity, 0) * 1.05),
          paymentStatus: 'unpaid',
          paymentMethod: null,
          orderRounds: 1
        }
      );
    }
  };

  // Auto-mark calls as seen when manager selects/views a table's chat
  React.useEffect(() => {
    if (selectedChatTable) {
      if (onMarkTableAsSeen) {
        onMarkTableAsSeen(selectedChatTable);
      }
      const tableCalls = serviceCalls.filter(
        (c) => c.tableNumber === selectedChatTable && !c.isSeenByManager && !seenServiceCallIds.includes(c.id)
      );
      if (tableCalls.length > 0) {
        setSeenServiceCallIds((prev) => [...new Set([...prev, ...tableCalls.map((c) => c.id)])]);
      }
    }
  }, [selectedChatTable, serviceCalls, onMarkTableAsSeen]);

  // Active customer-originated calls (unseen or unhandled by manager)
  const activeServiceCalls = serviceCalls.filter(
    (c) =>
      c.status !== 'attended' &&
      !c.isSeenByManager &&
      c.sender !== 'manager' &&
      c.type !== 'manager_direct' &&
      !seenServiceCallIds.includes(c.id)
  );

  // Active customer calls for top purple alert banner only (dismissable via OK without affecting the message list)
  const activeServiceAlerts = activeServiceCalls.filter(
    (c) => !dismissedServiceAlerts.includes(c.id)
  );

  // Filter pending requests that haven't been dismissed from top banner
  const unDismissedPendingRequests = pendingRequests.filter(
    (req) => !dismissedPendingAlerts.includes(req.requestId)
  );

  const formatTimer = (secondsLeft) => {
    if (secondsLeft === undefined) return '00:00';
    const m = Math.floor(secondsLeft / 60);
    const s = secondsLeft % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const urgentOrders = activeOrders.filter((order) => {
    const sec = getOrderRemainingSeconds(order);
    return sec > 0 && sec <= 300 && !dismissedUrgentAlerts.includes(order.orderId);
  });

  // Orders that finished cooking (Remaining time = 00:00)
  const readyOrders = activeOrders.filter((order) => {
    const sec = getOrderRemainingSeconds(order);
    return sec <= 0 && !dismissedReadyAlerts.includes(order.orderId);
  });

  // Dynamic Tables list (stored in localStorage, default 1 to 5)
  const [tablesList, setTablesList] = useState(() => {
    try {
      const saved = localStorage.getItem('biteiq_tables_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(Number).sort((a, b) => a - b);
        }
      }
    } catch {}
    return [1, 2, 3, 4, 5];
  });

  useEffect(() => {
    try {
      localStorage.setItem('biteiq_tables_list', JSON.stringify(tablesList));
    } catch {}
  }, [tablesList]);

  const handleAddTable = (tableNum) => {
    const num = Number(tableNum);
    if (!num || isNaN(num) || num <= 0) return false;
    if (tablesList.includes(num)) return false;
    setTablesList((prev) => [...prev, num].sort((a, b) => a - b));
    return true;
  };

  const handleRemoveTable = (tableNum) => {
    if (tablesList.length <= 1) return;
    setTablesList((prev) => prev.filter((t) => t !== tableNum));
  };

  const totalTables = tablesList; // alias for backwards compatibility

  // Financial & Sales Metrics Calculation
  const totalRevenue = completedOrders.reduce((sum, ord) => sum + (ord.total || 0), 0);
  const paidRevenue = completedOrders
    .filter((ord) => ord.paymentStatus === 'paid')
    .reduce((sum, ord) => sum + (ord.total || 0), 0);
  const pendingRevenue = totalRevenue - paidRevenue;
  const unpaidBillsCount = completedOrders.filter((ord) => ord.paymentStatus !== 'paid').length;
  const paidBillsCount = completedOrders.filter((ord) => ord.paymentStatus === 'paid').length;
  const orderOccupiedTables = activeOrders.map((o) => o.tableNumber);
  const isTableOccupied = (tbl) => orderOccupiedTables.includes(tbl) || manualOccupiedTables.includes(tbl);

  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafc] overflow-y-auto animate-fadeIn flex flex-col justify-between">
      {/* Top Header Navbar - Left and Right Aligned with Empty Middle */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 sm:px-8 lg:px-10 py-3.5 shadow-xs w-full">
        <div className="w-full flex items-center justify-between">
          {/* Left Side: Brand Logo, Title & Status */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black shadow-md shadow-orange-500/20">
              MG
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                Floor Manager Operations Center
                <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-2.5 py-0.5 rounded-full border border-orange-200">
                  Live Dispatch Active
                </span>
              </h2>
              <p className="text-xs text-slate-500">Logged in as: manager@biteiq.com</p>
            </div>
          </div>

          {/* Right Side: Action Navigation Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 font-bold text-xs transition-all cursor-pointer shadow-xs active:scale-95"
              title="৫টি টেবিলের জন্য প্রিন্টযোগ্য QR কোড তৈরি ও প্রিন্ট করুন"
            >
              <QrCode className="w-4 h-4 text-orange-600" />
              <span>টেবিল QR কোড</span>
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
            >
              Return to Customer View
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-xs transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Operational Body */}
      <main className="max-w-7xl mx-auto w-full p-4 sm:p-8 space-y-6 flex-1">

        {/* 0. DISH COOKING COMPLETE (00:00) ALERT BANNER */}
        {readyOrders.length > 0 && (
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-5 text-white shadow-xl shadow-emerald-600/25 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black tracking-tight">
                  🍽️ রান্না সম্পন্ন হয়েছে: {readyOrders.map(o => `Table ${o.tableNumber}`).join(', ')} এর খাবার পরিবেশন করুন!
                </h3>
                <p className="text-xs text-emerald-100 font-medium">
                  রান্নার সময় শেষ হয়েছে। কিচেন থেকে খাবার প্রস্তুত, অনুগ্রহ করে দ্রুত গ্রাহকের টেবিলে খাবার পৌঁছে দিন।
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                // Dismiss ready banner with OK
                setDismissedReadyAlerts(prev => [...prev, ...readyOrders.map(o => o.orderId)]);
              }}
              className="px-6 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 font-black text-xs shadow-md transition-all active:scale-95 shrink-0"
            >
              OK ✓
            </button>
          </div>
        )}

        {/* 1. URGENT 5-MINUTE DISPATCH WARNING ALERT */}
        {urgentOrders.length > 0 && (
          <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-3xl p-5 text-white shadow-xl shadow-red-600/25 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black tracking-tight">
                  ⚠️ 5-Minute Delivery Alert: {urgentOrders.map(o => `Table ${o.tableNumber}`).join(', ')}
                </h3>
                <p className="text-xs text-rose-100 font-medium">
                  এই টেবিলের খাবার পরিবেশনের সময় শেষ হতে আর মাত্র ৫ মিনিট বা তার কম সময় বাকি আছে! ওয়েটার টিমকে প্রস্তুত থাকতে বলুন।
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                // Dismiss this urgent alert by adding current urgent order IDs to dismissed list
                setDismissedUrgentAlerts(prev => [...prev, ...urgentOrders.map(o => o.orderId)]);
              }}
              className="px-6 py-2.5 rounded-xl bg-white hover:bg-rose-50 text-red-700 font-black text-xs shadow-md transition-all active:scale-95 shrink-0"
            >
              OK ✓
            </button>
          </div>
        )}

        {/* 2. CUSTOMER WAITER / ASSISTANCE CALL ALERT */}
        {activeServiceAlerts.length > 0 && (() => {
          // Find unique tables and count messages per table
          const alertTableMap = {};
          activeServiceAlerts.forEach((c) => {
            alertTableMap[c.tableNumber] = (alertTableMap[c.tableNumber] || 0) + 1;
          });
          const alertTableNumbers = Object.keys(alertTableMap).map(Number);
          const tableSummaryText = alertTableNumbers
            .map((t) => `Table ${t} (${alertTableMap[t]}টি মেসেজ)`)
            .join(', ');

          return (
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-5 text-white shadow-xl shadow-purple-600/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight">
                    🛎️ ওয়েটার / সার্ভিস কল: {tableSummaryText} থেকে সাহায্য চেয়ে বার্তা এসেছে!
                  </h3>
                  <p className="text-xs text-purple-100 font-medium">
                    {alertTableNumbers.map((t) => `Table ${t}`).join(', ')} থেকে গ্রাহক পানি, পরিচ্ছন্নতা বা মেসেজ পাঠিয়েছেন। নিচের তালিকা থেকে টেবিলে ক্লিক করে সরাসরি রিপ্লাই দিন।
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  // Instant OK button: Only hides the top notification banner, keeps the message active in chat list
                  setDismissedServiceAlerts((prev) => [
                    ...prev,
                    ...activeServiceAlerts.map((c) => c.id)
                  ]);
                }}
                className="px-6 py-2.5 rounded-xl bg-white hover:bg-purple-50 text-purple-900 font-black text-xs shadow-md transition-all active:scale-95 shrink-0"
              >
                OK ✓
              </button>
            </div>
          );
        })()}

        {/* 3. PENDING REQUESTS ALERT BANNER */}
        {unDismissedPendingRequests.length > 0 && (
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-5 text-white shadow-xl shadow-orange-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black tracking-tight">
                  🔔 Attention Manager: {unDismissedPendingRequests.length} New Order Request Received!
                </h3>
                <p className="text-xs text-orange-100 font-medium">
                  নতুন টেবিল থেকে খাবার অর্ডার পাঠানো হয়েছে। দ্রুত পর্যালোচনা করে অনুমোদন (Confirm) করুন।
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                // Dismiss banner by adding current pending request IDs to dismissedPendingAlerts
                setDismissedPendingAlerts((prev) => [
                  ...prev,
                  ...unDismissedPendingRequests.map((r) => r.requestId)
                ]);
              }}
              className="px-6 py-2.5 rounded-xl bg-white text-slate-900 font-black text-xs shadow-md hover:bg-orange-50 transition-all shrink-0 active:scale-95"
            >
              OK ✓
            </button>
          </div>
        )}

        {/* Real-time KPI summary (Now with Today's Total Sales Revenue) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Today's Total Sales Revenue (Only collected paid amount - Clickable to open 1-Month Ledger) */}
          <div 
            onClick={() => setIsSalesLedgerOpen(true)}
            className="bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-2xl p-4 shadow-md space-y-1 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden"
            title="১ মাসের ডিজিটাল হিসাব খাতা দেখতে ক্লিক করুন"
          >
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
              হিসাব খাতা 📖
            </div>
            <span className="text-xs font-bold text-emerald-100 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-emerald-200" /> আজকের বিক্রি (আদায়কৃত)
              </span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono group-hover:hidden">Paid Sales</span>
            </span>
            <div className="text-2xl font-black font-mono">৳{paidRevenue.toLocaleString()}</div>
            <div className="flex items-center justify-between text-[11px] text-emerald-100 pt-0.5 border-t border-white/20">
              <span>পরিশোধিত বিল: {paidBillsCount}টি</span>
              <span className="text-emerald-200 font-bold flex items-center gap-0.5 underline">
                হিসাব খাতা দেখুন ↗
              </span>
            </div>
          </div>

          {/* 2. Pending Orders */}
          <div className={`rounded-2xl p-4 shadow-xs space-y-1 border-2 transition-all ${
            pendingRequests.length > 0
              ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300'
              : 'bg-white border-slate-200'
          }`}>
            <span className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-amber-600 animate-pulse" /> Pending Orders
            </span>
            <div className="text-2xl font-black text-slate-900">{pendingRequests.length}</div>
            <p className="text-[11px] text-slate-500">Awaiting kitchen dispatch</p>
          </div>

          {/* 3. Active Cooking */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-1">
            <span className="text-xs font-bold text-orange-700 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-600" /> Active Cooking
            </span>
            <div className="text-2xl font-black text-orange-600">{activeOrders.length}</div>
            <p className="text-[11px] text-slate-500">Kitchen timer ticking</p>
          </div>

          {/* 4. Tables Served */}
          <div 
            onClick={() => setActiveTab('bills')}
            className={`bg-white border rounded-2xl p-4 shadow-xs space-y-1 cursor-pointer transition-all hover:border-emerald-400 ${
              activeTab === 'bills' ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-slate-200'
            }`}
            title="বিল হিস্ট্রি দেখতে চাপ দিন"
          >
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> Tables Served
            </span>
            <div className="text-2xl font-black text-emerald-600">{completedOrders.length}</div>
            <p className="text-[11px] text-slate-500">
              {paidBillsCount} Paid • {unpaidBillsCount} Pending
            </p>
          </div>
        </div>

        {/* Tab Navigation - Left Operations & Right Management/Control */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 gap-4 overflow-x-auto pb-0.5">
          {/* Left: Operations & Live Station Tabs */}
          <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('requests')}
              className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'requests'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Live Order Approvals</span>
              {pendingRequests.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-extrabold animate-pulse">
                  {pendingRequests.length} New
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('assistance')}
              className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'assistance'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Waiter & Customer Chat Feed ({activeServiceCalls.length})</span>
              {activeServiceCalls.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-extrabold animate-pulse">
                  {activeServiceCalls.length} Active
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('kitchen')}
              className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'kitchen'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Kitchen Chef Station ({activeOrders.length})</span>
            </button>
          </div>

          {/* Right: History, Reviews & Control Tabs */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 overflow-x-auto">
            <button
              onClick={() => setActiveTab('bills')}
              className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'bills'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Receipt className="w-4 h-4 text-emerald-600" />
              <span>Bill History (মোট {completedOrders.length}টি)</span>
              {unpaidBillsCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold" title="বকেয়া বিল">
                  {unpaidBillsCount} Due
                </span>
              ) : completedOrders.length > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold" title="পরিশোধিত">
                  ✓ All Paid
                </span>
              ) : null}
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'reviews'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Review History ({customerReviews.length})</span>
              {customerReviews.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold">
                  {customerReviews.length} Reviews
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('control')}
              className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'control'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sliders className="w-4 h-4 text-indigo-600" />
              <span>Control (কন্ট্রোল সেন্টার)</span>
              {activeNotice?.isActive && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black border border-emerald-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Notice
                </span>
              )}
            </button>
          </div>
        </div>

        {/* TAB 1: PENDING ORDER REQUESTS */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900">
              Incoming Customer Order Requests
            </h3>

            {pendingRequests.length === 0 ? (
              <div className="py-16 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
                <CheckCircle className="w-12 h-12 stroke-[1.5] mx-auto text-emerald-400 mb-2" />
                <p className="text-sm font-bold text-slate-700">All caught up! Zero pending requests.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingRequests.map((req) => (
                  <div
                    key={req.requestId}
                    className="bg-white border-2 border-orange-400 rounded-3xl p-5 shadow-md space-y-4 flex flex-col justify-between ring-1 ring-orange-200"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <span className="px-3.5 py-1 rounded-xl bg-orange-600 text-white font-black text-xs shadow-xs">
                          Table {req.tableNumber}
                        </span>
                        <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2.5 py-1 rounded-lg">
                          ⏱ {req.createdAt}
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-amber-800">
                          <Bell className="w-3.5 h-3.5 text-orange-600" />
                          <span>নতুন অর্ডার এসেছে, অনুগ্রহ করে কনফার্ম করুন:</span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          Table {req.tableNumber} থেকে গ্রাহক অর্ডারের অপেক্ষায় আছেন। অনুমোদন দিলে লাইভ টাইমার চালু হবে।
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        {req.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs text-slate-800 font-semibold bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <span><strong className="text-orange-600">{item.quantity}x</strong> {item.name}</span>
                            <span className="text-slate-500">⏱ ~{item.prepTime} mins</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">Estimated Prep</span>
                        <span className="text-sm font-black text-slate-900">~{req.totalPrepTime} Minutes</span>
                      </div>

                      <button
                        onClick={() => onConfirmRequest(req)}
                        className="py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition-all active:scale-95"
                      >
                        <Check className="w-4 h-4" />
                        <span>অর্ডার নিশ্চিত করুন (Confirm Order)</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: 2-CARD SYSTEM (CARD 1: 5-TABLE OCCUPANCY & STATUS MAP | CARD 2: LIVE CHAT & DIRECT MESSAGING) */}
        {activeTab === 'assistance' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Floor Operations: Table Map & Customer Communication Hub
                </h3>
                <p className="text-xs text-slate-500">
                  বাম কার্ডে ৫টি টেবিলের বুকিং স্ট্যাটাস দেখুন এবং ডান কার্ড থেকে যেকোনো টেবিলে সরাসরি মেসেজ পাঠান।
                </p>
              </div>

              {activeServiceCalls.length > 0 && (
                <button
                  onClick={() => {
                    activeServiceCalls.forEach((c) => onDismissServiceCall(c.id));
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs transition-all"
                >
                  Mark All Attended
                </button>
              )}
            </div>

            {/* TWO MASTER CARDS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              {/* CARD 1: 5 TABLES STATUS & OCCUPANCY (lg:col-span-5) */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <TableIcon className="w-5 h-5 text-orange-600" />
                    <h4 className="text-sm font-black text-slate-900">
                      রেস্তোরাঁ টেবিল স্ট্যাটাস (Table 1 - {tablesList[tablesList.length - 1] || 5})
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsQrModalOpen(true)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 font-extrabold text-[11px] border border-orange-200 transition-all cursor-pointer shadow-xs active:scale-95"
                      title={`${tablesList.length}টি টেবিলের জন্য QR কোড প্রিন্ট ও তৈরি করুন`}
                    >
                      <QrCode className="w-3.5 h-3.5 text-orange-600" />
                      <span>QR কোড প্রিন্ট</span>
                    </button>
                    <span className="text-[11px] font-bold text-slate-400">
                      মোট {tablesList.length}টি টেবিল
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {totalTables.map((tbl) => {
                    const isOccupied = isTableOccupied(tbl);
                    const isSelected = selectedChatTable === tbl;
                    // Count unread customer calls/messages for this table that haven't been seen by manager
                    const tableActiveCalls = serviceCalls.filter(
                      (c) =>
                        c.tableNumber === tbl &&
                        c.status !== 'attended' &&
                        !c.isSeenByManager &&
                        c.sender !== 'manager' &&
                        c.type !== 'manager_direct' &&
                        !seenServiceCallIds.includes(c.id)
                    );
                    const unreadTableMsgCount = tableActiveCalls.length;

                    return (
                      <div
                        key={tbl}
                        onClick={() => markTableAsSeen(tbl)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'border-purple-500 bg-purple-50/60 ring-2 ring-purple-200 shadow-xs'
                            : unreadTableMsgCount > 0
                            ? 'border-purple-300 bg-purple-50/30 hover:bg-purple-50/50 ring-1 ring-purple-200 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shadow-2xs ${
                            isSelected
                              ? 'bg-purple-600 text-white'
                              : unreadTableMsgCount > 0
                              ? 'bg-purple-700 text-white animate-pulse'
                              : isOccupied
                              ? 'bg-orange-500 text-white'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            T-{tbl}
                            {unreadTableMsgCount > 0 && (
                              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 text-white font-black text-[10px] rounded-full flex items-center justify-center shadow-md ring-2 ring-white animate-bounce">
                                {unreadTableMsgCount}
                              </span>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-extrabold text-xs text-slate-900">
                                Table {tbl}
                              </h5>
                              {unreadTableMsgCount > 0 && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-black bg-purple-600 text-white px-2 py-0.5 rounded-full shadow-xs animate-pulse">
                                  <MessageSquare className="w-2.5 h-2.5" />
                                  <span>{unreadTableMsgCount}টি নতুন মেসেজ</span>
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {isOccupied ? (
                                <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-orange-600" />
                                  বুকড / ডাইনিং
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  খালি (Available)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions for this table */}
                        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              // Toggle occupancy manually
                              setManualOccupiedTables((prev) =>
                                prev.includes(tbl)
                                  ? prev.filter((t) => t !== tbl)
                                  : [...prev, tbl]
                              );
                            }}
                            title="বুকিং স্ট্যাটাস পরিবর্তন করুন"
                            className="text-[10px] font-bold px-2 py-1 rounded-lg border bg-white hover:bg-slate-100 text-slate-600 transition-colors"
                          >
                            {isOccupied ? 'Make Free' : 'Book Table'}
                          </button>

                          <button
                            onClick={() => markTableAsSeen(tbl)}
                            className={`relative p-1.5 rounded-lg text-xs font-bold transition-all ${
                              isSelected
                                ? 'bg-purple-600 text-white'
                                : unreadTableMsgCount > 0
                                ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-xs'
                                : 'bg-slate-200 hover:bg-purple-100 hover:text-purple-700 text-slate-600'
                            }`}
                            title="টেবিলের সাথে চ্যাট করুন"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>🟢 খালি: {totalTables.filter((t) => !isTableOccupied(t)).length}</span>
                  <span>🔴 বুকড: {totalTables.filter((t) => isTableOccupied(t)).length}</span>
                </div>
              </div>

              {/* CARD 2: LIVE TABLE CHAT & DIRECT MESSAGING (lg:col-span-7) */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4 flex flex-col justify-between min-h-[460px]">
                {selectedChatTable === null ? (
                  /* Empty state when manager first enters and has not selected any table */
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3 my-auto">
                    <div className="w-16 h-16 rounded-3xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-sm">
                      <MessageSquare className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-slate-800">
                        কোনো টেবিল সিলেক্ট করা নেই
                      </h4>
                      <p className="text-xs text-slate-500 max-w-sm">
                        বাম পাশের তালিকা থেকে যেকোনো একটি টেবিলে ক্লিক করুন (বা মেসেজ আইকনে চাপ দিন) তাহলে সেই টেবিলের লাইভ চ্যাট ওপেন হবে এবং আপনি মেসেজ পাঠাতে পারবেন।
                      </p>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      {totalTables.map((t) => (
                        <button
                          key={t}
                          onClick={() => markTableAsSeen(t)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-100 hover:text-purple-700 text-slate-700 text-xs font-bold transition-all border border-slate-200"
                        >
                          Table {t}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Chat Card Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-xs">
                          T-{selectedChatTable}
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                            Table {selectedChatTable} লাইভ চ্যাট ও মেসেজ ফিড
                            {isTableOccupied(selectedChatTable) ? (
                              <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-md">
                                বুকড
                              </span>
                            ) : (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                                খালি
                              </span>
                            )}
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            এখানে ম্যানেজার সরাসরি টেবিল {selectedChatTable}-এ বার্তা পাঠাতে পারবেন।
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Message Conversation Scroll Box for Selected Table (Messenger / WhatsApp style) */}
                    <div className="flex-1 overflow-y-auto max-h-[320px] space-y-3.5 p-3.5 bg-slate-100/70 rounded-2xl border border-slate-200">
                      {serviceCalls.filter((c) => c.tableNumber === selectedChatTable).length === 0 ? (
                        <div className="py-16 text-center text-slate-400 space-y-2">
                          <div className="w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center text-slate-400 mx-auto">
                            <MessageSquare className="w-6 h-6 stroke-[1.5]" />
                          </div>
                          <p className="text-xs font-bold text-slate-600">
                            Table {selectedChatTable}-এর সাথে এখনো কোনো মেসেজ আদান-প্রদান হয়নি।
                          </p>
                          <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                            নিচের মেসেজ বক্স ব্যবহার করে আপনি এই টেবিলে সরাসরি বার্তা পাঠাতে পারেন।
                          </p>
                        </div>
                      ) : (
                        (() => {
                          const tableThreads = serviceCalls.filter((c) => c.tableNumber === selectedChatTable);
                          const allBubbles = [];
                          tableThreads.forEach((msg) => {
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
                              threadId: msg.id,
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
                                    ts: repTs,
                                    threadId: msg.id
                                  });
                                }
                              });
                            }
                          });

                          // Sort chronologically ascending (oldest first at top, newest at bottom)
                          allBubbles.sort((a, b) => a.ts - b.ts);

                          return allBubbles.map((bubble, bIdx) => {
                            const isManager = bubble.sender === 'manager'; // Manager messages on right

                            return (
                              <div
                                key={bubble.id || bIdx}
                                className={`flex items-end gap-2 ${isManager ? 'justify-end' : 'justify-start'}`}
                              >
                                {/* Customer Avatar on Left */}
                                {!isManager && (
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center text-[11px] font-black shadow-xs shrink-0 ring-2 ring-white">
                                    T-{selectedChatTable}
                                  </div>
                                )}

                                {/* Bubble Content */}
                                <div
                                  className={`max-w-[78%] sm:max-w-[70%] rounded-2xl px-3.5 py-2.5 shadow-xs transition-all ${
                                    isManager
                                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-xs shadow-purple-500/15'
                                      : 'bg-white text-slate-900 border border-slate-200/90 rounded-bl-xs'
                                  }`}
                                >
                                  {/* Sender Label */}
                                  <div className="flex items-center justify-between gap-3 mb-1">
                                    <span
                                      className={`text-[10px] font-extrabold uppercase tracking-wider ${
                                        isManager ? 'text-purple-200' : 'text-orange-600'
                                      }`}
                                    >
                                      {isManager ? 'আপনি (ম্যানেজার)' : 'গ্রাহক (Table ' + selectedChatTable + ')'}
                                    </span>
                                    <span
                                      className={`text-[9px] font-mono ${
                                        isManager ? 'text-purple-200/90' : 'text-slate-400'
                                      }`}
                                    >
                                      {bubble.time}
                                    </span>
                                  </div>

                                  {/* Message Body */}
                                  <p className={`text-xs leading-relaxed font-medium break-words ${isManager ? 'text-white' : 'text-slate-800'}`}>
                                    {bubble.text}
                                  </p>
                                </div>

                                {/* Manager Avatar on Right */}
                                {isManager && (
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-[11px] font-black shadow-xs shrink-0 ring-2 ring-white">
                                    MG
                                  </div>
                                )}
                              </div>
                            );
                          });
                        })()
                      )}
                    </div>

                    {/* Direct Message Input Box to Customer Table */}
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          "খাবার রান্না শেষ, টেবিলে পৌঁছে দেওয়া হচ্ছে।",
                          "ওয়েটার পাঠানো হয়েছে, একটু অপেক্ষা করুন।",
                          "টেবিল এখনই পরিষ্কার করে দেওয়া হচ্ছে।"
                        ].map((templateText, tIdx) => (
                          <button
                            key={tIdx}
                            onClick={() => {
                              if (onDirectMessageToTable) {
                                onDirectMessageToTable(selectedChatTable, templateText);
                              }
                              markTableAsSeen(selectedChatTable);
                            }}
                            className="text-[10px] bg-slate-100 hover:bg-purple-100 hover:text-purple-900 text-slate-700 px-2.5 py-1 rounded-lg font-medium border border-slate-200 transition-colors text-left"
                          >
                            + {templateText}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={directMsgText}
                          onChange={(e) => setDirectMsgText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && directMsgText.trim()) {
                              if (onDirectMessageToTable) {
                                onDirectMessageToTable(selectedChatTable, directMsgText);
                                setDirectMsgText('');
                              }
                              markTableAsSeen(selectedChatTable);
                            }
                          }}
                          placeholder={`Table ${selectedChatTable}-এ সরাসরি মেসেজ লিখুন...`}
                          className="flex-1 bg-slate-50 border border-slate-200 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none"
                        />

                        <button
                          onClick={() => {
                            if (directMsgText.trim() && onDirectMessageToTable) {
                              onDirectMessageToTable(selectedChatTable, directMsgText);
                              setDirectMsgText('');
                            }
                            markTableAsSeen(selectedChatTable);
                          }}
                          disabled={!directMsgText.trim()}
                          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs active:scale-95 shrink-0"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>মেসেজ পাঠান</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: KITCHEN CHEF STATION */}
        {activeTab === 'kitchen' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Kitchen Preparation & Ready-to-Serve Telemetry
                </h3>
                <p className="text-xs text-slate-500">
                  রান্না শেষ হলে স্বয়ংক্রিয়ভাবে নোটিফিকেশন আসবে এবং সার্ভ করার অপশন চালু হবে।
                </p>
              </div>
            </div>

            {/* SECTION 3A: READY TO SERVE DISHES (Time Completed = 00:00) */}
            {activeOrders.some(o => getOrderRemainingSeconds(o) <= 0) && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <h4 className="text-xs font-black text-emerald-800 uppercase tracking-wider">
                    🎉 রান্না সম্পন্ন হয়েছে - টেবিলে খাবার পরিবেশন করুন (Ready to Serve):
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeOrders.filter(o => getOrderRemainingSeconds(o) <= 0).map((order) => (
                    <div
                      key={order.orderId}
                      className="bg-emerald-50/70 border-2 border-emerald-400 rounded-3xl p-5 shadow-md space-y-4 flex flex-col justify-between ring-2 ring-emerald-300/40"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-emerald-200/80 pb-3">
                          <span className="px-3.5 py-1 rounded-xl bg-emerald-700 text-white font-black text-xs">
                            Table {order.tableNumber}
                          </span>
                          <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-200 text-emerald-950 border border-emerald-300 flex items-center gap-1.5 font-mono">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                            রান্না শেষ (Ready!)
                          </span>
                        </div>

                        <div className="p-3 rounded-2xl bg-white border border-emerald-200 text-xs text-emerald-950 font-bold flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>শেফ রান্না শেষ করেছেন। দয়া করে খাবার গ্রাহকের টেবিলে পৌঁছে দিন।</span>
                        </div>

                        <div className="space-y-1.5">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs text-slate-800 font-semibold p-2.5 bg-white rounded-xl border border-emerald-100 shadow-2xs">
                              <span><strong className="text-emerald-700 font-bold">{item.quantity}x</strong> {item.name}</span>
                              <span className="text-emerald-700 bg-emerald-100/70 border border-emerald-300 px-2 py-0.5 rounded text-[11px] font-black">
                                ✓ Cooked
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                        <div className="pt-3 border-t border-emerald-200 flex items-center justify-end">
                        <button
                          onClick={() => handleMarkServed(order)}
                          className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>টেবিলে সার্ভ করা হয়েছে (Mark as Served)</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 3B: STILL COOKING DISHES (Time Remaining > 0) */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider">
                🍳 কিচেনে রান্না চলমান রয়েছে (Active Cooking):
              </h4>

              {activeOrders.filter(o => getOrderRemainingSeconds(o) > 0).length === 0 ? (
                <div className="py-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
                  <Utensils className="w-10 h-10 stroke-[1.5] mx-auto text-slate-300 mb-2" />
                  <p className="text-xs font-bold text-slate-700">বর্তমানে নতুন কোনো রান্নার টাইমার চলমান নেই।</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeOrders.filter(o => getOrderRemainingSeconds(o) > 0).map((order) => {
                    const remSec = getOrderRemainingSeconds(order);
                    const countdownFormatted = formatTimer(remSec);
                    const isUrgent = remSec > 0 && remSec <= 300;

                    return (
                      <div
                        key={order.orderId}
                        className={`bg-white border-2 rounded-3xl p-5 shadow-xs space-y-4 flex flex-col justify-between transition-all ${
                          isUrgent
                            ? 'border-red-400 ring-2 ring-red-300/60'
                            : 'border-orange-200'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <span className="px-3.5 py-1 rounded-xl bg-slate-900 text-white font-black text-xs">
                              Table {order.tableNumber}
                            </span>

                            <span className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 font-mono ${
                              isUrgent
                                ? 'bg-red-100 text-red-800 border-red-300 animate-pulse'
                                : 'bg-orange-100 text-orange-700 border-orange-200'
                            }`}>
                              <Clock className="w-3.5 h-3.5 text-orange-600 animate-spin" />
                              Remaining: {countdownFormatted}
                            </span>
                          </div>

                          {isUrgent && (
                            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                              <span>সময় প্রায় শেষ! টেবিলে খাবার পৌঁছাতে আর ৫ মিনিটের কম সময় বাকি।</span>
                            </div>
                          )}

                          <div className="space-y-1.5">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-xs text-slate-800 font-semibold p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
                                <span><strong className="text-orange-600 font-bold">{item.quantity}x</strong> {item.name}</span>
                                <span className="text-orange-700 bg-orange-100/70 border border-orange-200 px-2.5 py-0.5 rounded-lg font-mono font-black text-xs flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-orange-600" />
                                  {countdownFormatted}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                          <button
                            onClick={() => handleMarkServed(order)}
                            className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
                          >
                            <CheckCircle className="w-4 h-4 text-emerald-400" /> Mark as Served to Table
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: BILL HISTORY & THERMAL RECEIPTS */}
        {activeTab === 'bills' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-600" />
                  খাবার পরিবেশন সম্পন্ন ও বিল রসিদ হিস্ট্রি (Bill History)
                </h3>
                <p className="text-xs text-slate-500">
                  পরিবেশন সম্পন্ন হওয়া সমস্ত টেবিলের ডিজিটাল থার্মাল ক্যাশমেমো ও আজকের বিক্রির হিসাব।
                </p>
              </div>

              {/* Financial Quick Metrics */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                  মোট পরিবেশিত: <strong className="text-slate-900">{completedOrders.length}টি টেবিল</strong>
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  আজকের আদায়কৃত বিক্রি: <strong className="text-emerald-700 font-mono">৳{paidRevenue.toLocaleString()}</strong>
                </span>
                {pendingRevenue > 0 && (
                  <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                    অনাদায়ী / বকেয়া বিল: <strong className="text-amber-700 font-mono">৳{pendingRevenue.toLocaleString()}</strong>
                  </span>
                )}
              </div>
            </div>

            {completedOrders.length === 0 ? (
              <div className="py-16 text-center text-slate-400 bg-white rounded-3xl border border-slate-200 space-y-2">
                <Receipt className="w-12 h-12 stroke-[1.5] mx-auto text-slate-300" />
                <p className="text-sm font-bold text-slate-700">বর্তমানে কোনো সম্পন্ন বিলের রেকর্ড নেই।</p>
                <p className="text-xs text-slate-400">
                  কিচেন স্টেশন থেকে খাবার "Mark as Served to Table" করলে এখানে রসিদ জমা হবে।
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedOrders.map((ord) => (
                  <div
                    key={ord.invoiceNumber || ord.orderId}
                    className="bg-white border-2 border-slate-200 hover:border-emerald-400 rounded-3xl p-5 shadow-xs flex flex-col justify-between gap-4 transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-black text-xs shadow-xs">
                            Table {ord.tableNumber}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-700">
                            {ord.invoiceNumber || ('#INV-' + ord.orderId)}
                          </span>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            ord.paymentStatus === 'paid'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {ord.paymentStatus === 'paid' ? '✓ Paid' : 'Pending Payment'}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>পরিবেশনের সময়:</span>
                          <span className="font-bold text-slate-700">{ord.servedAtTime || ord.createdAt}</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>তারিখ:</span>
                          <span className="font-bold text-slate-700">{ord.servedDate || 'Today'}</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>আইটেম সংখ্যা:</span>
                          <span className="font-bold text-slate-700">{(ord.items || []).length}টি আইটেম</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-600">সর্বমোট বিল:</span>
                        <div className="text-right">
                          <span className="text-base font-black text-slate-900 font-mono">৳{ord.total}</span>
                          {ord.discount > 0 && (
                            <span className="block text-[10px] text-emerald-600 font-bold font-mono">
                              (৳{ord.discount} ছাড় প্রয়োগকৃত)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        {/* Manager Discount button (only if unpaid) */}
                        {ord.paymentStatus !== 'paid' && onApplyDiscount && (
                          <button
                            type="button"
                            onClick={() => {
                              const discountAmt = prompt('ম্যানেজার স্পেশাল ছাড়ের পরিমাণ লিখুন (টাকা):', '50');
                              if (discountAmt && !isNaN(discountAmt) && Number(discountAmt) > 0) {
                                onApplyDiscount(ord.invoiceNumber, Number(discountAmt), 'ম্যানেজার সৌজন্য ছাড়');
                              }
                            }}
                            className="flex-1 py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                          >
                            <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                            <span>ছাড় / ডিসকাউন্ট</span>
                          </button>
                        )}

                        {/* Release / Free Table Button (when paid) */}
                        {ord.paymentStatus === 'paid' && onReleaseTable && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Table ${ord.tableNumber} এর কাস্টমার চলে গেছেন? টেবিলটি পরবর্তী কাস্টমারের জন্য খালি ও প্রস্তুত করতে চান?`)) {
                                onReleaseTable(ord.tableNumber);
                              }
                            }}
                            className="flex-1 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>টেবিল খালি করুন (Free Table)</span>
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => setViewingReceiptOrder(ord)}
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                      >
                        <Receipt className="w-4 h-4 text-emerald-400" />
                        <span>রসিদ দেখুন (View Thermal Receipt)</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: CUSTOMER REVIEWS & FEEDBACK HISTORY */}
        {activeTab === 'reviews' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  কাস্টমার রিভিউ ও রেটিং হিস্ট্রি (Review History)
                </h3>
                <p className="text-xs text-slate-500">
                  খাবার ও সেবার মান সম্পর্কে গ্রাহকদের সরাসরি মতামত, স্টার রেটিং ও ফিডব্যাক রেকর্ড।
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>আজকের রিভিউ: {customerReviews.length}টি</span>
                </span>
                {customerReviews.length > 0 && onClearReviews && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('আজকের সমস্ত রিভিউ হিস্ট্রি মুছে ফেলে নতুন দিন শুরু করতে চান?')) {
                        onClearReviews();
                      }
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                  >
                    হিস্ট্রি ক্লিয়ার করুন
                  </button>
                )}
              </div>
            </div>

            {customerReviews.length === 0 ? (
              <div className="py-16 text-center text-slate-400 bg-white rounded-3xl border border-slate-200 space-y-2">
                <Star className="w-12 h-12 stroke-[1.5] mx-auto text-slate-300" />
                <p className="text-sm font-bold text-slate-700">বর্তমানে কোনো রিভিউ জমা পড়েনি।</p>
                <p className="text-xs text-slate-400">
                  গ্রাহক বিল পরিশোধের পর তাদের ডিভাইসে রেটিং দিলে স্বয়ংক্রিয়ভাবে এখানে জমা হবে।
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customerReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white border-2 border-slate-200 hover:border-amber-400 rounded-3xl p-5 shadow-xs flex flex-col justify-between gap-4 transition-all"
                  >
                    <div className="space-y-3">
                      {/* Top Table & Time */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-xl bg-slate-900 text-white font-black text-xs shadow-xs">
                            Table {rev.tableNumber}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-500">
                            {rev.invoiceNumber}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {rev.time} • {rev.date}
                        </span>
                      </div>

                      {/* Ratings Breakdown */}
                      <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                        {/* Food Rating */}
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 block uppercase">খাবারের মান:</span>
                          <div className="flex items-center gap-1 text-amber-500 mt-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${
                                  s <= (rev.foodRating || 5)
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-slate-200'
                                }`}
                              />
                            ))}
                            <span className="text-xs font-black text-slate-800 ml-1">
                              {rev.foodRating || 5}.0
                            </span>
                          </div>
                        </div>

                        {/* Service Rating */}
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 block uppercase">সার্ভিস স্পিড:</span>
                          <div className="flex items-center gap-1 text-amber-500 mt-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${
                                  s <= (rev.serviceRating || 5)
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-slate-200'
                                }`}
                              />
                            ))}
                            <span className="text-xs font-black text-slate-800 ml-1">
                              {rev.serviceRating || 5}.0
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Customer Written Comment */}
                      <div className="p-3 bg-amber-50/50 rounded-2xl border border-amber-100/80">
                        <span className="text-[10px] font-bold text-amber-800 block uppercase mb-1">
                          গ্রাহকের মন্তব্য:
                        </span>
                        <p className="text-xs text-slate-800 italic leading-relaxed">
                          "{rev.feedbackText}"
                        </p>
                      </div>

                      {/* Loyalty Coins Given */}
                      {rev.coinsEarned && (
                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                          <span className="flex items-center gap-1">
                            <Coins className="w-3.5 h-3.5 text-amber-500" /> অর্জিত লয়্যালটি কয়েন:
                          </span>
                          <span className="font-bold text-amber-700 font-mono">+{rev.coinsEarned} Coins</span>
                        </div>
                      )}

                      {/* Homepage Feature Button */}
                      {onToggleFeatureReview && (
                        <div className="pt-2 border-t border-slate-100">
                          {(() => {
                            const isFeatured = featuredReviews.some((r) => r.id === rev.id);
                            return (
                              <button
                                type="button"
                                onClick={() => onToggleFeatureReview(rev)}
                                className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                  isFeatured
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300'
                                    : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-xs'
                                }`}
                              >
                                {isFeatured ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>হোমপেজে প্রদর্শিত হচ্ছে ✓ (সরান)</span>
                                  </>
                                ) : (
                                  <>
                                    <Star className="w-3.5 h-3.5 fill-white text-white" />
                                    <span>⭐ হোমপেজে ফিচার / প্রদর্শন করুন</span>
                                  </>
                                )}
                              </button>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: CONTROL CENTER */}
        {activeTab === 'control' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-3xl p-6 text-white border border-indigo-800/50 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/30">
                      <Sliders className="w-5 h-5" />
                    </span>
                    <h3 className="text-lg font-black text-white">
                      ম্যানেজার কন্ট্রোল সেন্টার (Operations & Broadcast Control)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                    ১. কাস্টমারদের মোবাইলে লাইভ ডিসকাউন্ট নোটিশ ও কুপন কোড ব্রডকাস্ট করুন।<br />
                    ২. "মানুষ কী বলছে BiteIQ সম্পর্কে?" সেকশনে কোন রিভিউ ও খাবারের ছবিগুলো দেখানো হবে তা নির্বাচন ও কিউরেট করুন।
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 border ${
                    noticeForm.isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${noticeForm.isActive ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'}`} />
                    {noticeForm.isActive ? 'নোটিশ লাইভ চলছে' : 'নোটিশ নিষ্ক্রিয়'}
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION 1: DISCOUNT NOTICE BROADCASTER */}
            <div className="bg-white border-2 border-indigo-100 rounded-3xl p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900">
                      ১. কাস্টমার পেজ ডিসকাউন্ট নোটিশ ব্রডকাস্ট (Discount Announcement)
                    </h4>
                    <p className="text-xs text-slate-500">
                      এখানে যে অফার বা নোটিশ সেট করবেন তা সরাসরি কাস্টমারদের মোবাইলের হোমপেজে সবার উপরে হাইলাইট হয়ে থাকবে।
                    </p>
                  </div>
                </div>

                {/* Active / Inactive Switch Button */}
                <button
                  type="button"
                  onClick={handleToggleNoticeStatus}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                    noticeForm.isActive
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${noticeForm.isActive ? 'bg-white' : 'bg-slate-500'}`} />
                  {noticeForm.isActive ? 'নোটিশ চালু আছে (ক্লিক করে বন্ধ করুন)' : 'নোটিশ বন্ধ আছে (ক্লিক করে চালু করুন)'}
                </button>
              </div>

              {/* LIVE PREVIEW OF HOW USER SEES IT */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-indigo-600" />
                    কাস্টমার স্ক্রিনে দেখতে কেমন লাগবে (Live Customer Preview):
                  </span>
                  {!noticeForm.isActive && (
                    <span className="text-[11px] font-bold text-rose-500">
                      (বর্তমানে নোটিশটি বন্ধ রয়েছে, চালু করলে কাস্টমাররা দেখতে পাবে)
                    </span>
                  )}
                </div>

                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 p-0.5 shadow-md">
                  <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 text-white rounded-[14px] p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shrink-0">
                        <span className="text-xl">🎁</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                            {noticeForm.badgeText || "SPECIAL NOTICE"}
                          </span>
                          <h5 className="text-xs sm:text-sm font-extrabold text-white">
                            {noticeForm.title || "কোনো শিরোনাম দেওয়া হয়নি"}
                          </h5>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          {noticeForm.message || "কোনো বিস্তারিত বার্তা লেখা হয়নি"}
                        </p>
                      </div>
                    </div>

                    {noticeForm.promoCode && (
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right hidden sm:block">
                          <span className="text-[9px] uppercase font-bold text-amber-400 block">কুপন কোড:</span>
                          <span className="text-[11px] text-slate-400">{noticeForm.discountPercent ? `${noticeForm.discountPercent}% ছাড়` : 'স্পেশাল'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black px-3 py-1.5 rounded-lg text-xs">
                          <span className="font-mono font-extrabold">{noticeForm.promoCode}</span>
                          <span className="bg-slate-900/20 text-[10px] px-1 rounded">কপি 📋</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* QUICK PRESET TEMPLATES */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-600 block">
                  ⚡ দ্রুত রেডিমেড অফার টেমপ্লেট থেকে সিলেক্ট করুন:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {noticePresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        const updated = { ...preset, isActive: true };
                        setNoticeForm(updated);
                        if (onUpdateNotice) onUpdateNotice(updated);
                        setNoticeSaveSuccess(true);
                        setTimeout(() => setNoticeSaveSuccess(false), 2500);
                      }}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-orange-500 hover:bg-orange-50/50 text-left transition-all cursor-pointer group"
                    >
                      <span className="text-xs font-extrabold text-slate-800 group-hover:text-orange-700 block">
                        {preset.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Code: {preset.promoCode} ({preset.discountPercent}%)
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* NOTICE EDIT FORM */}
              <form onSubmit={handleSaveNotice} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    নোটিশ শিরোনাম (Notice Title):
                  </label>
                  <input
                    type="text"
                    value={noticeForm.title}
                    onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                    placeholder="যেমন: 🔥 আজকের স্পেশাল ডাইনিং অফার! সকল খাবারে ১৫% ছাড়"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 font-medium"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    ব্যাজ টেক্সট (Badge Label):
                  </label>
                  <input
                    type="text"
                    value={noticeForm.badgeText}
                    onChange={(e) => setNoticeForm({ ...noticeForm, badgeText: e.target.value })}
                    placeholder="যেমন: HOT DEAL 🔥 অথবা WEEKEND SPECIAL"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    বিস্তারিত বার্তা (Announcement Description):
                  </label>
                  <textarea
                    rows={2}
                    value={noticeForm.message}
                    onChange={(e) => setNoticeForm({ ...noticeForm, message: e.target.value })}
                    placeholder="কাস্টমারদের উদ্দেশ্যে আপনার ছাড় বা অফারের বিস্তারিত লিখুন..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 font-medium resize-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    প্রোমো বা কুপন কোড (Promo Code):
                  </label>
                  <div className="relative">
                    <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={noticeForm.promoCode}
                      onChange={(e) => setNoticeForm({ ...noticeForm, promoCode: e.target.value.toUpperCase() })}
                      placeholder="যেমন: BITE15 বা SAVE20"
                      className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 font-mono font-bold tracking-wider"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    ডিসকাউন্ট পার্সেন্টেজ (% ছাড়):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={noticeForm.discountPercent}
                    onChange={(e) => setNoticeForm({ ...noticeForm, discountPercent: Number(e.target.value) })}
                    placeholder="যেমন: 15"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 font-bold"
                  />
                </div>

                <div className="sm:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    {noticeSaveSuccess && (
                      <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-1.5 animate-fadeIn">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        নোটিশ সফলভাবে কাস্টমার পেজে লাইভ আপডেট হয়েছে!
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>সেভ ও কাস্টমার পেজে ব্রডকাস্ট করুন</span>
                  </button>
                </div>
              </form>
            </div>

            {/* SECTION 2: HOMEPAGE REVIEWS & FOOD PHOTOS CURATION */}
            <div className="bg-white border-2 border-amber-100 rounded-3xl p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                    <Star className="w-5 h-5 fill-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900">
                      ২. "মানুষ কী বলছে BiteIQ সম্পর্কে?" রিভিউ কিউরেশন ও ডিসপ্লে
                    </h4>
                    <p className="text-xs text-slate-500">
                      গ্রাহকদের জমা দেওয়া রিভিউগুলো থেকে আপনার পছন্দের রিভিউ ও খাবারের ছবি নির্বাচন করুন। সিলেক্ট করা রিভিউ সরাসরি হোমপেজে প্রদর্শিত হবে।
                    </p>
                  </div>
                </div>

                {onResetFeaturedReviews && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('হোমপেজের রিভিউ লিস্টকে ডিফল্ট অবস্থায় রিস্টোর করতে চান?')) {
                        onResetFeaturedReviews();
                      }
                    }}
                    className="text-xs font-bold text-slate-600 hover:text-amber-700 bg-slate-100 hover:bg-amber-50 border border-slate-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>ডিফল্ট রিভিউ রিস্টোর করুন</span>
                  </button>
                )}
              </div>

              {/* CURRENTLY FEATURED REVIEWS ON HOMEPAGE */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                      বর্তমানে হোমপেজে প্রদর্শিত রিভিউ ({featuredReviews.length}টি)
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                      Live on Homepage
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    হোমপেজে যে কোনো কার্ড রিমুভ করতে নিচের বাটনে চাপ দিন
                  </span>
                </div>

                {featuredReviews.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
                    <p className="text-xs font-bold text-slate-600">বর্তমানে কোনো রিভিউ ফিচার করা নেই!</p>
                    <p className="text-[11px] text-slate-400">নিচের জমা পড়া রিভিউ বা ডিফল্ট রিভিউ থেকে 'হোমপেজে ফিচার করুন' এ ক্লিক করুন।</p>
                    {onResetFeaturedReviews && (
                      <button
                        type="button"
                        onClick={onResetFeaturedReviews}
                        className="mt-2 text-xs font-bold bg-amber-500 text-white px-3 py-1.5 rounded-xl cursor-pointer"
                      >
                        ডিফল্ট রিভিউ দেখান
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {featuredReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="bg-white border-2 border-emerald-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between gap-3 relative group"
                      >
                        <div className="space-y-2.5">
                          {rev.dishPhoto && (
                            <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-100">
                              <img
                                src={rev.dishPhoto}
                                alt={rev.orderedDish || 'Dish'}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-1.5 left-1.5 bg-slate-900/85 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                                ⭐ {rev.orderedDish || 'Popular Dish'}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex text-amber-500 gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-3 h-3 ${i < (rev.rating || rev.foodRating || 5) ? 'text-amber-500 fill-amber-500' : 'text-slate-200'}`} 
                                />
                              ))}
                            </div>
                            <span className="text-[10px] text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full font-bold">
                              {rev.table || (rev.tableNumber ? `Table #${rev.tableNumber}` : 'Guest')}
                            </span>
                          </div>

                          <p className="text-xs text-slate-700 italic line-clamp-3">
                            "{rev.comment || rev.feedbackText}"
                          </p>

                          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                            <img
                              src={rev.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                              alt="Avatar"
                              className="w-7 h-7 rounded-full object-cover border"
                            />
                            <div>
                              <h5 className="text-[11px] font-bold text-slate-900">{rev.name || `Table ${rev.tableNumber} Guest`}</h5>
                              <p className="text-[9px] text-slate-400">{rev.role || 'Customer'}</p>
                            </div>
                          </div>
                        </div>

                        {onToggleFeatureReview && (
                          <button
                            type="button"
                            onClick={() => onToggleFeatureReview(rev)}
                            className="w-full py-1.5 text-[11px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>হোমপেজ থেকে সরান</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>



              {/* SYSTEM DEFAULT REVIEWS */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 block">
                  সিস্টেম স্ট্যান্ডার্ড রিভিউ (Pre-curated Reviews)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {CUSTOMER_REVIEWS.map((rev) => {
                    const isFeatured = featuredReviews.some((r) => r.id === rev.id);
                    return (
                      <div
                        key={rev.id}
                        className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={rev.avatar}
                            alt={rev.name}
                            className="w-8 h-8 rounded-full object-cover border"
                          />
                          <div>
                            <h6 className="text-xs font-bold text-slate-900">{rev.name}</h6>
                            <p className="text-[10px] text-slate-500">{rev.orderedDish}</p>
                          </div>
                        </div>

                        {onToggleFeatureReview && (
                          <button
                            type="button"
                            onClick={() => onToggleFeatureReview(rev)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              isFeatured
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-slate-200 hover:bg-amber-500 hover:text-white text-slate-700'
                            }`}
                          >
                            {isFeatured ? 'ফিচার করা আছে ✓' : '+ যোগ করুন'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* SECTION 3: RESTAURANT MENU & DIRECT ORDER CONTROL */}
            <div className="bg-white border-2 border-orange-100 rounded-3xl p-6 shadow-xs space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-orange-500/20">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-extrabold text-slate-900">
                        ৩. রেস্টুরেন্ট মেনু ও সরাসরি অর্ডার কন্ট্রোল (Menu Management)
                      </h4>
                      <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-black">
                        মোট: {menuItems.length}টি খাবার
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      কাস্টমার পেজের সকল খাবারের ছবি, নাম, রেটিং, ক্যালোরি (kcal), বিবরণ, মূল্য, প্রিপারেশন সময় ও ক্যাটাগরি এক ক্লিকে এডিট করুন বা নতুন খাবার যুক্ত করুন।
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {onResetMenu && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('মেনুর সমস্ত ডাটা ডিফল্ট অবস্থায় রিস্টোর করতে চান?')) {
                          onResetMenu();
                        }
                      }}
                      className="text-xs font-bold text-slate-600 hover:text-orange-700 bg-slate-100 hover:bg-orange-50 border border-slate-200 px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>ডিফল্ট মেন্যু</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNewItem(true);
                      setEditingItem({
                        id: 'm_' + Date.now(),
                        name: '',
                        category: 'Mains',
                        price: 500,
                        prepTime: 15,
                        rating: 4.8,
                        calories: '450 kcal',
                        tag: 'Chef Special',
                        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
                        description: '',
                        moodTags: ['Hungry', 'Popular'],
                        isOutOfStock: false
                      });
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ নতুন খাবার যোগ করুন</span>
                  </button>
                </div>
              </div>

              {/* Filter and Search Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Category Pills */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto w-full sm:w-auto">
                  {['All', 'Mains', 'Starters', 'Beverages', 'Desserts'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setMenuSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                        menuSelectedCategory === cat
                          ? 'bg-orange-500 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Search box */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={menuSearchQuery}
                    onChange={(e) => setMenuSearchQuery(e.target.value)}
                    placeholder="খাবারের নাম বা ট্যাগ দিয়ে খুঁজুন..."
                    className="w-full text-xs pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>
              </div>

              {/* Toast message if saved */}
              {menuSaveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>মেন্যু সফলভাবে আপডেট হয়েছে এবং কাস্টমার পেজে লাইভ দেখাচ্ছে!</span>
                </div>
              )}

              {/* Menu Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedMenuItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border-2 border-slate-200 hover:border-orange-300 rounded-3xl p-4 shadow-xs flex flex-col justify-between gap-3 group transition-all"
                  >
                    <div className="space-y-2.5">
                      {/* Image Thumbnail with Overlay Badges */}
                      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {item.tag && (
                          <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-900/85 text-white backdrop-blur-xs">
                            {item.tag}
                          </span>
                        )}
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-orange-500/90 text-white backdrop-blur-xs">
                          {item.category}
                        </span>
                        <div className="absolute bottom-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/95 text-slate-800 text-[10px] font-bold shadow-xs">
                          <Clock className="w-3 h-3 text-orange-600" />
                          <span>{item.prepTime} মিনিট</span>
                        </div>
                      </div>

                      {/* Title & Price */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h5 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-1">
                            {item.name}
                          </h5>
                          {/* Rating & Calories */}
                          <div className="flex items-center gap-2 text-xs mt-1">
                            <span className="flex items-center gap-1 font-bold text-amber-500">
                              <Star className="w-3.5 h-3.5 fill-amber-500" />
                              {item.rating || 5.0}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-500 font-bold text-[11px] bg-slate-100 px-2 py-0.5 rounded-md">
                              🔥 {item.calories || '400 kcal'}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">মূল্য</span>
                          <span className="text-base font-black text-slate-900 font-mono">৳{item.price}</span>
                        </div>
                      </div>

                      {/* Subtitle / Description */}
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {item.description || 'সুস্বাদু ও প্রিমিয়াম খাবার'}
                      </p>
                    </div>

                    {/* Footer Action Buttons */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = { ...item, isOutOfStock: !item.isOutOfStock };
                          if (onUpdateMenuItem) onUpdateMenuItem(updated);
                        }}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                          item.isOutOfStock
                            ? 'bg-rose-100 text-rose-700 border border-rose-300'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                        }`}
                        title="স্টক স্ট্যাটাস পরিবর্তন করতে চাপ দিন"
                      >
                        {item.isOutOfStock ? '🔴 স্টক আউট' : '🟢 ইন-স্টক'}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingNewItem(false);
                            setEditingItem({ ...item });
                          }}
                          className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>এডিট করুন</span>
                        </button>

                        {onDeleteMenuItem && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`'${item.name}' খাবারটি মেনু থেকে সম্পূর্ণ মুছে ফেলতে চান?`)) {
                                onDeleteMenuItem(item.id);
                              }
                            }}
                            className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3.5 px-6 text-center text-xs text-slate-400">
        BiteIQ Autonomous Gastronomy • Shift Operations Engine
      </footer>

      {/* Thermal Bill Receipt Modal for Floor Manager */}
      <ThermalReceiptModal
        isOpen={!!viewingReceiptOrder}
        onClose={() => setViewingReceiptOrder(null)}
        order={viewingReceiptOrder}
        onUpdatePayment={onUpdatePaymentStatus}
        isManagerView={true}
      />

      {/* MENU ITEM EDIT / CREATE MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  {isAddingNewItem ? <Plus className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {isAddingNewItem ? 'নতুন খাবার মেনুতে যোগ করুন' : `খাবার এডিট করুন: ${editingItem.name}`}
                  </h3>
                  <p className="text-xs text-slate-500">
                    ছবি, নাম, রেটিং, ক্যালোরি, বিবরণ ও মূল্য পরিবর্তন করুন।
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (isAddingNewItem) {
                  if (onAddMenuItem) onAddMenuItem(editingItem);
                } else {
                  if (onUpdateMenuItem) onUpdateMenuItem(editingItem);
                }
                setEditingItem(null);
                setMenuSaveSuccess(true);
                setTimeout(() => setMenuSaveSuccess(false), 2500);
              }}
              className="space-y-4"
            >
              {/* Picture Upload from Laptop / Device & Live Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-orange-600" />
                    <span>খাবারের ছবি (Picture):</span>
                  </label>
                  <span className="text-[11px] text-orange-600 font-bold flex items-center gap-1">
                    ছবিতে ক্লিক করে ল্যাপটপ থেকে ছবি সিলেক্ট করুন 💻
                  </span>
                </div>

                {/* Hidden File Input for Device Storage */}
                <input
                  type="file"
                  ref={imageFileInputRef}
                  accept="image/*"
                  onChange={handleDeviceImageUpload}
                  className="hidden"
                />

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  {/* Clickable Image Box that triggers file explorer directly */}
                  <div
                    onClick={() => imageFileInputRef.current?.click()}
                    className="sm:col-span-4 relative group h-28 rounded-2xl overflow-hidden border-2 border-dashed border-orange-300 hover:border-orange-500 bg-orange-50/40 hover:bg-orange-50 cursor-pointer transition-all flex flex-col items-center justify-center text-center p-2 shadow-xs"
                    title="ল্যাপটপ / কম্পিউটার থেকে ছবি সিলেক্ট করতে চাপ দিন"
                  >
                    {editingItem.image ? (
                      <>
                        <img
                          src={editingItem.image}
                          alt="Food Preview"
                          className="w-full h-full object-cover rounded-xl"
                        />
                        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-2xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-center p-2 rounded-xl">
                          <FolderOpen className="w-6 h-6 mb-1 text-orange-300" />
                          <span className="text-[10px] font-black leading-tight">ছবি বদলাতে ক্লিক করুন</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-orange-600 space-y-1">
                        <Upload className="w-6 h-6" />
                        <span className="text-[11px] font-black">ল্যাপটপ থেকে ছবি দিন</span>
                        <span className="text-[9px] text-slate-400">JPG, PNG, WEBP</span>
                      </div>
                    )}
                    <span className="absolute bottom-1.5 right-1.5 p-1 rounded-lg bg-orange-500 text-white shadow-xs">
                      <Camera className="w-3 h-3" />
                    </span>
                  </div>

                  {/* Actions & URL Option */}
                  <div className="sm:col-span-8 space-y-2">
                    <button
                      type="button"
                      onClick={() => imageFileInputRef.current?.click()}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <FolderOpen className="w-4 h-4" />
                      <span>ল্যাপটপ / কম্পিউটার স্টোরেজ থেকে ছবি সিলেক্ট করুন 📂</span>
                    </button>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">
                        অথবা ছবির অনলাইন লিংক (URL) দিন:
                      </span>
                      <input
                        type="url"
                        value={editingItem.image?.startsWith('data:') ? '' : editingItem.image}
                        onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                        placeholder={editingItem.image?.startsWith('data:') ? '✓ ল্যাপটপ থেকে ছবি সফলভাবে আপলোড করা হয়েছে' : 'https://images.unsplash.com/...'}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-orange-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Headline & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    খাবারের নাম (Headline / Name):
                  </label>
                  <input
                    type="text"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    placeholder="যেমন: Truffle Glazed Wagyu Slider"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-orange-500 font-bold"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    ক্যাটাগরি (Category):
                  </label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-orange-500 font-bold bg-white"
                  >
                    <option value="Mains">Mains (মূল খাবার)</option>
                    <option value="Starters">Starters (স্টার্টার)</option>
                    <option value="Beverages">Beverages (পানীয়/কফি)</option>
                    <option value="Desserts">Desserts (ডেজার্ট/মিষ্টি)</option>
                  </select>
                </div>
              </div>

              {/* Price, Prep Time, Rating, Calories */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    মূল্য (৳ BDT):
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                    placeholder="680"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-orange-500 font-black"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    সময় (মিনিট):
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingItem.prepTime}
                    onChange={(e) => setEditingItem({ ...editingItem, prepTime: Number(e.target.value) })}
                    placeholder="18"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-orange-500 font-bold"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    রেটিং (১-৫):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={editingItem.rating}
                    onChange={(e) => setEditingItem({ ...editingItem, rating: Number(e.target.value) })}
                    placeholder="4.9"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-orange-500 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    ক্যালোরি (kcal):
                  </label>
                  <input
                    type="text"
                    value={editingItem.calories}
                    onChange={(e) => setEditingItem({ ...editingItem, calories: e.target.value })}
                    placeholder="520 kcal"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-orange-500 font-bold"
                  />
                </div>
              </div>

              {/* Tag & Subtitle/Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  স্পেশাল ট্যাগ (Special Tag Badge):
                </label>
                <input
                  type="text"
                  value={editingItem.tag || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, tag: e.target.value })}
                  placeholder="যেমন: Chef Special, Spicy & Hot, Healthy Pick, Must Try"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  খাবারের বিবরণ / সাবটাইটেল (Description):
                </label>
                <textarea
                  rows={3}
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="খাবারের সুস্বাদু বিবরণ ও মূল উপাদানসমূহ লিখুন..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-orange-500 font-medium resize-none"
                  required
                />
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/25 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>সেভ করুন ও মেনুতে আপডেট করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 30-Day Monthly Sales Ledger Modal (ডিজিটাল হিসাব খাতা) */}
      <MonthlySalesLedgerModal
        isOpen={isSalesLedgerOpen}
        onClose={() => setIsSalesLedgerOpen(false)}
        todayPaidRevenue={paidRevenue}
        todayPaidBillsCount={paidBillsCount}
      />

      {/* Table QR Code Stand Modal (টেবিলের QR কোড প্রিন্ট, টেস্ট ও নতুন কিউআর তৈরি) */}
      <TableQRCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        totalTables={tablesList}
        onAddTable={handleAddTable}
        onRemoveTable={handleRemoveTable}
      />
    </div>
  );
}
