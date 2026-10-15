import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  Utensils, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Lock, 
  UserCheck, 
  ChefHat, 
  Flame,
  Bell,
  Receipt,
  Tag,
  CheckCircle2,
  Megaphone,
  Table as TableIcon,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RESTAURANT_INFO, MENU_ITEMS, CUSTOMER_REVIEWS } from './data/restaurantData';
import HeroAndReviews from './components/HeroAndReviews';
import MenuSection from './components/MenuSection';
import MoodBiteAI from './components/MoodBiteAI';
import CartDrawer from './components/CartDrawer';
import OrderRequestModal from './components/OrderRequestModal';
import LiveOrderStatusModal from './components/LiveOrderStatusModal';
import CustomerKitchenModal from './components/CustomerKitchenModal';
import TableServiceModal from './components/TableServiceModal';
import ThermalReceiptModal from './components/ThermalReceiptModal';
import CustomerReviewModal from './components/CustomerReviewModal';
import StaffLoginModal from './components/StaffLoginModal';
import TableSelectModal from './components/TableSelectModal';
import AdminDashboardView from './components/AdminDashboardView';
import ManagerDashboardView from './components/ManagerDashboardView';

export default function App() {
  // Check if visitor entered with an explicit table in URL (e.g. from QR code scan ?table=X)
  const initialUrlTable = (() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tbl = params.get('table');
      if (tbl && !isNaN(tbl)) {
        const parsed = parseInt(tbl, 10);
        if (parsed >= 1 && parsed <= 99) return parsed;
      }
    } catch (e) {}
    return null;
  })();

  // Dynamic tables list (default 1 to 5, or stored in localStorage)
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

  const [tableNumber, setTableNumber] = useState(() => {
    if (initialUrlTable !== null) return initialUrlTable;
    try {
      const saved = localStorage.getItem('biteiq_current_table');
      if (saved && !isNaN(saved)) {
        const parsed = parseInt(saved, 10);
        if (parsed >= 1 && parsed <= 99) return parsed;
      }
    } catch (e) {}
    return 1; // Default fallback
  });

  // If user entered WITHOUT an explicit ?table= query parameter, prompt them to select their table!
  const [isTableSelectModalOpen, setIsTableSelectModalOpen] = useState(() => {
    return initialUrlTable === null;
  });

  const handleSelectTable = (selectedNum) => {
    setTableNumber(selectedNum);
    setIsTableSelectModalOpen(false);
    try {
      localStorage.setItem('biteiq_current_table', String(selectedNum));
      const url = new URL(window.location.href);
      url.searchParams.set('table', String(selectedNum));
      window.history.replaceState({}, '', url.toString());
    } catch (e) {}
  };

  // Synchronize tableNumber with URL query param and localStorage once table is chosen / present
  useEffect(() => {
    if (isTableSelectModalOpen && initialUrlTable === null) return;
    try {
      localStorage.setItem('biteiq_current_table', String(tableNumber));
      const url = new URL(window.location.href);
      if (url.searchParams.get('table') !== String(tableNumber)) {
        url.searchParams.set('table', String(tableNumber));
        window.history.replaceState({}, '', url.toString());
      }
    } catch (e) {}
  }, [tableNumber, isTableSelectModalOpen, initialUrlTable]);

  // Listen for browser navigation / URL change
  useEffect(() => {
    const handlePopState = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const tbl = params.get('table');
        if (tbl && !isNaN(tbl)) {
          setTableNumber(parseInt(tbl, 10));
        }
      } catch (e) {}
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  
  // Modals state
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isKitchenStatusOpen, setIsKitchenStatusOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [loyaltyCoins, setLoyaltyCoins] = useState(150); // Default user starting loyalty coins
  const [customerServedReceipt, setCustomerServedReceipt] = useState(null);

  // Staff & Role Auth state
  const [activeStaffRole, setActiveStaffRole] = useState(null); // 'admin' | 'manager' | null
  const [isStaffLoginOpen, setIsStaffLoginOpen] = useState(false);

  // Order flow state
  const [cartItems, setCartItems] = useState([]);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [currentLiveOrder, setCurrentLiveOrder] = useState(null);

  // Customer Reviews & Feedback state for Manager Dashboard (starts empty, only real daily reviews)
  const [customerReviews, setCustomerReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('biteiq_today_reviews');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('biteiq_today_reviews', JSON.stringify(customerReviews));
    } catch {}
  }, [customerReviews]);

  // Manager Discount / Announcement Notice broadcast to user page
  const [activeNotice, setActiveNotice] = useState(() => {
    try {
      const saved = localStorage.getItem('biteiq_active_notice');
      return saved ? JSON.parse(saved) : {
        isActive: true,
        title: "🔥 আজকের স্পেশাল ডাইনিং অফার! সকল খাবারে ১৫% ছাড়",
        message: "আপনার পছন্দের যেকোনো ডিশ অর্ডারে পাচ্ছেন ১৫% বিশেষ ছাড়! কুপন কোড ব্যবহার করে বিল পরিশোধ করুন।",
        promoCode: "BITE15",
        discountPercent: 15,
        badgeText: "HOT DEAL 🔥"
      };
    } catch {
      return {
        isActive: true,
        title: "🔥 আজকের স্পেশাল ডাইনিং অফার! সকল খাবারে ১৫% ছাড়",
        message: "আপনার পছন্দের যেকোনো ডিশ অর্ডারে পাচ্ছেন ১৫% বিশেষ ছাড়! কুপন কোড ব্যবহার করে বিল পরিশোধ করুন।",
        promoCode: "BITE15",
        discountPercent: 15,
        badgeText: "HOT DEAL 🔥"
      };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('biteiq_active_notice', JSON.stringify(activeNotice));
    } catch {}
  }, [activeNotice]);

  // Featured Reviews for Homepage "মানুষ কী বলছে BiteIQ সম্পর্কে?"
  const [featuredReviews, setFeaturedReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('biteiq_featured_reviews');
      return saved ? JSON.parse(saved) : CUSTOMER_REVIEWS;
    } catch {
      return CUSTOMER_REVIEWS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('biteiq_featured_reviews', JSON.stringify(featuredReviews));
    } catch {}
  }, [featuredReviews]);

  const [copiedPromo, setCopiedPromo] = useState(false);
  const [isNoticeDismissedByCustomer, setIsNoticeDismissedByCustomer] = useState(false);

  const handleToggleFeatureReview = (reviewToToggle) => {
    setFeaturedReviews((prev) => {
      const exists = prev.some((r) => r.id === reviewToToggle.id);
      let updated;
      if (exists) {
        updated = prev.filter((r) => r.id !== reviewToToggle.id);
      } else {
        const formattedReview = {
          id: reviewToToggle.id,
          name: reviewToToggle.name || `Table ${reviewToToggle.tableNumber || ''} Guest`,
          role: reviewToToggle.role || (reviewToToggle.invoiceNumber ? `Invoice #${reviewToToggle.invoiceNumber}` : 'Verified Customer'),
          avatar: reviewToToggle.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
          rating: reviewToToggle.rating || reviewToToggle.foodRating || 5,
          date: reviewToToggle.date || 'Today',
          table: reviewToToggle.table || (reviewToToggle.tableNumber ? `Table #${reviewToToggle.tableNumber}` : 'Dine-in'),
          orderedDish: reviewToToggle.orderedDish || 'Chef Special Item',
          dishPhoto: reviewToToggle.dishPhoto || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
          comment: reviewToToggle.comment || reviewToToggle.feedbackText || 'খাবার ও সার্ভিসের মান অসাধারণ লেগেছে!'
        };
        updated = [formattedReview, ...prev];
      }
      try {
        localStorage.setItem('biteiq_featured_reviews', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleResetFeaturedReviews = () => {
    setFeaturedReviews(CUSTOMER_REVIEWS);
    try {
      localStorage.setItem('biteiq_featured_reviews', JSON.stringify(CUSTOMER_REVIEWS));
    } catch {}
  };

  const handleUpdateNotice = (updatedNotice) => {
    setActiveNotice(updatedNotice);
    setIsNoticeDismissedByCustomer(false);
    try {
      localStorage.setItem('biteiq_active_notice', JSON.stringify(updatedNotice));
    } catch {}
  };

  // Restaurant Menu items with persistence
  const [menuItems, setMenuItems] = useState(() => {
    try {
      const saved = localStorage.getItem('biteiq_menu_items');
      return saved ? JSON.parse(saved) : MENU_ITEMS;
    } catch {
      return MENU_ITEMS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('biteiq_menu_items', JSON.stringify(menuItems));
    } catch {}
  }, [menuItems]);

  const handleUpdateMenuItem = (updatedItem) => {
    setMenuItems((prev) => {
      const updated = prev.map((item) => (item.id === updatedItem.id ? updatedItem : item));
      try {
        localStorage.setItem('biteiq_menu_items', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleAddMenuItem = (newItem) => {
    setMenuItems((prev) => {
      const updated = [newItem, ...prev];
      try {
        localStorage.setItem('biteiq_menu_items', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleDeleteMenuItem = (itemId) => {
    setMenuItems((prev) => {
      const updated = prev.filter((item) => item.id !== itemId);
      try {
        localStorage.setItem('biteiq_menu_items', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleResetMenu = () => {
    setMenuItems(MENU_ITEMS);
    try {
      localStorage.setItem('biteiq_menu_items', JSON.stringify(MENU_ITEMS));
    } catch {}
  };

  // Waiter & Table Service calls feed
  const [serviceCalls, setServiceCalls] = useState([]);
  // Track IDs of manager messages / replies that the customer has already seen
  const [seenManagerMessageIds, setSeenManagerMessageIds] = useState([]);

  // Calculate unread manager messages for the customer's current table
  const customerUnreadCount = serviceCalls
    .filter((c) => c.tableNumber === tableNumber)
    .reduce((count, c) => {
      let unreadInThread = 0;
      // Direct message from manager at thread level
      if ((c.sender === 'manager' || c.type === 'manager_direct') && !seenManagerMessageIds.includes(c.id)) {
        unreadInThread += 1;
      }
      // Replies from manager
      if (c.replies && c.replies.length > 0) {
        c.replies.forEach((rep) => {
          if (rep.sender === 'manager' && !seenManagerMessageIds.includes(rep.id)) {
            // Avoid double counting if thread id already counted the initial direct message
            if (rep.id !== 'rep_' + c.id && !seenManagerMessageIds.includes(rep.id)) {
              unreadInThread += 1;
            }
          }
        });
      }
      return count + unreadInThread;
    }, 0);

  // Mark all manager messages for this table as seen
  const markCustomerMessagesAsSeen = React.useCallback(() => {
    const tableMsgs = serviceCalls.filter((c) => c.tableNumber === tableNumber);
    const idsToMark = [];
    tableMsgs.forEach((c) => {
      if (c.sender === 'manager' || c.type === 'manager_direct') {
        idsToMark.push(c.id);
      }
      if (c.replies && c.replies.length > 0) {
        c.replies.forEach((rep) => {
          if (rep.sender === 'manager') {
            idsToMark.push(rep.id);
          }
        });
      }
    });
    if (idsToMark.length > 0) {
      setSeenManagerMessageIds((prev) => {
        const hasNew = idsToMark.some((id) => !prev.includes(id));
        if (!hasNew) return prev;
        return Array.from(new Set([...prev, ...idsToMark]));
      });
    }
  }, [serviceCalls, tableNumber]);

  // Global time ticker for 100% synchronized countdown across all views
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const ticker = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(ticker);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tbl = params.get('table');
      if (tbl) {
        setTableNumber(parseInt(tbl, 10));
      }
    }
  }, []);

  const handleAddToCart = (item) => {
    setCartItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // User sends service / waiter call or chat message
  const handleSendServiceRequest = (newCall) => {
    setServiceCalls((prev) => [{ ...newCall, isSeenByManager: false }, ...prev]);
  };

  // Manager marks all calls for a specific table as seen
  const handleMarkTableCallsAsSeen = React.useCallback((tblNum) => {
    setServiceCalls((prev) =>
      prev.map((c) =>
        c.tableNumber === tblNum ? { ...c, isSeenByManager: true } : c
      )
    );
  }, []);

  // Manager sends a reply to user's message
  const handleReplyServiceCall = (callId, replyText) => {
    if (!replyText || !replyText.trim()) return;
    const replyObj = {
      id: 'rep_' + Date.now(),
      sender: 'manager',
      text: replyText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setServiceCalls((prev) =>
      prev.map((c) =>
        c.id === callId
          ? {
              ...c,
              replies: [...(c.replies || []), replyObj],
              status: 'replied', // replied by manager
              isSeenByManager: true
            }
          : c
      )
    );
  };

  // Manager sends a direct message to any specific table (Table 1 to 5)
  const handleManagerDirectMessageToTable = (tblNum, messageText) => {
    if (!messageText || !messageText.trim()) return;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Check if an active thread exists for this table
    const existingThread = serviceCalls.find(
      (c) => c.tableNumber === tblNum && c.status !== 'attended'
    );

    const replyObj = {
      id: 'rep_' + Date.now(),
      sender: 'manager',
      text: messageText.trim(),
      time: nowTime
    };

    if (existingThread) {
      setServiceCalls((prev) =>
        prev.map((c) =>
          c.id === existingThread.id
            ? {
                ...c,
                replies: [...(c.replies || []), replyObj],
                status: 'replied',
                isSeenByManager: true
              }
            : c.tableNumber === tblNum
            ? { ...c, isSeenByManager: true }
            : c
        )
      );
    } else {
      // Create new thread originating from manager
      const newThread = {
        id: 'mgr_msg_' + Date.now(),
        tableNumber: tblNum,
        type: 'manager_direct',
        message: messageText.trim(),
        sender: 'manager',
        time: nowTime,
        status: 'replied',
        isSeenByManager: true,
        replies: []
      };
      setServiceCalls((prev) => [newThread, ...prev]);
    }
  };

  // Manager dismisses/attends service call
  const handleDismissServiceCall = (callId) => {
    setServiceCalls((prev) =>
      prev.map((c) => (c.id === callId ? { ...c, status: 'attended' } : c))
    );
  };

  // User clicks "ম্যানেজারের কাছে অর্ডারের রিকোয়েস্ট পাঠান"
  const handleRequestOrder = (customPrepTime) => {
    if (cartItems.length === 0) return;

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const total = Math.round(subtotal * 1.05);
    const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    
    // Dynamic Kitchen prep time calculation with max 30 mins cap
    const baseMax = Math.max(...cartItems.map((i) => i.prepTime));
    const extraCount = totalItemsCount - 1;
    const computedTime = Math.min(30, baseMax + Math.max(0, extraCount) * 2);
    const totalPrepTime = customPrepTime || computedTime;

    const newRequest = {
      requestId: Math.floor(1000 + Math.random() * 9000),
      tableNumber,
      items: [...cartItems],
      total,
      totalPrepTime,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'pending'
    };

    setPendingRequests((prev) => [newRequest, ...prev]);
    setCurrentRequest(newRequest);
    setCartItems([]);
    setIsCartOpen(false);
    setIsRequestModalOpen(true);
  };

  // Manager confirms order: Set exact targetEndTime for sync across user and manager
  const handleConfirmRequest = (req) => {
    setPendingRequests((prev) => prev.filter((r) => r.requestId !== req.requestId));
    
    const startTime = Date.now();
    const durationSeconds = req.totalPrepTime * 60;
    const targetEndTime = startTime + durationSeconds * 1000;

    const confirmedOrder = {
      ...req,
      orderId: req.requestId,
      status: 'confirmed',
      startTime,
      targetEndTime,
      durationSeconds
    };

    setActiveOrders((prev) => [confirmedOrder, ...prev]);
    
    if (currentRequest && currentRequest.requestId === req.requestId) {
      setCurrentLiveOrder(confirmedOrder);
      setCurrentRequest(null);
      setIsRequestModalOpen(false);
      setIsOrderModalOpen(true);
    }
  };

// Helper to consolidate/merge multiple running (unpaid) orders for the same table into a single master bill
const consolidateTableBills = (orders = []) => {
  const mergedMap = new Map();
  const paidOrders = [];

  orders.forEach((ord) => {
    if (ord.paymentStatus !== 'paid' && ord.tableNumber) {
      if (mergedMap.has(ord.tableNumber)) {
        const existing = mergedMap.get(ord.tableNumber);
        const combinedItems = [...existing.items];
        (ord.items || []).forEach((item) => {
          const matchIdx = combinedItems.findIndex((i) => i.id === item.id);
          if (matchIdx >= 0) {
            combinedItems[matchIdx] = {
              ...combinedItems[matchIdx],
              quantity: combinedItems[matchIdx].quantity + item.quantity
            };
          } else {
            combinedItems.push(item);
          }
        });
        const subtotal = combinedItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
        const vat = Math.round(subtotal * 0.05);
        const total = subtotal + vat;

        mergedMap.set(ord.tableNumber, {
          ...existing,
          items: combinedItems,
          subtotal,
          vat,
          total,
          orderRounds: (existing.orderRounds || 1) + 1
        });
      } else {
        mergedMap.set(ord.tableNumber, ord);
      }
    } else {
      paidOrders.push(ord);
    }
  });

  return [...Array.from(mergedMap.values()), ...paidOrders];
};

  // Auto-consolidate any existing open table bills on load
  useEffect(() => {
    setCompletedOrders((prev) => {
      const consolidated = consolidateTableBills(prev);
      if (consolidated.length !== prev.length) {
        return consolidated;
      }
      return prev;
    });
  }, []);

  // Kitchen/Manager completes order (Served) -> Auto-merges into single running table bill
  const handleCompleteOrder = (orderId) => {
    const finished = activeOrders.find((o) => o.orderId === orderId);
    if (!finished) return null;

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nowDate = new Date().toLocaleDateString('en-GB');
    const tbl = finished.tableNumber;
    let finalReceipt = null;

    setCompletedOrders((prev) => {
      // Find if an active (unpaid) running bill already exists for this table
      const existingBillIdx = prev.findIndex(
        (b) => b.tableNumber === tbl && b.paymentStatus !== 'paid'
      );

      if (existingBillIdx >= 0) {
        // Auto-merge items into the existing open running bill for this table
        const existing = prev[existingBillIdx];
        const combinedItems = [...existing.items];

        (finished.items || []).forEach((newItem) => {
          const matchIdx = combinedItems.findIndex((i) => i.id === newItem.id);
          if (matchIdx >= 0) {
            combinedItems[matchIdx] = {
              ...combinedItems[matchIdx],
              quantity: combinedItems[matchIdx].quantity + newItem.quantity
            };
          } else {
            combinedItems.push(newItem);
          }
        });

        const subtotal = combinedItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
        const vat = Math.round(subtotal * 0.05);
        const total = subtotal + vat;

        finalReceipt = {
          ...existing,
          items: combinedItems,
          subtotal,
          vat,
          total,
          servedAtTime: nowTime,
          servedDate: nowDate,
          orderRounds: (existing.orderRounds || 1) + 1
        };

        const updated = [...prev];
        updated[existingBillIdx] = finalReceipt;
        return consolidateTableBills(updated);
      } else {
        // First order of this table's session
        const itemsList = finished.items || [];
        const subtotal = itemsList.reduce((acc, i) => acc + i.price * i.quantity, 0);
        const vat = Math.round(subtotal * 0.05);
        const total = finished.total || Math.round(subtotal + vat);

        finalReceipt = {
          ...finished,
          invoiceNumber: 'INV-' + (finished.orderId || Math.floor(1000 + Math.random() * 9000)),
          terminalId: 'POS-0' + tbl,
          servedAtTime: nowTime,
          servedDate: nowDate,
          subtotal,
          vat,
          total,
          paymentStatus: 'unpaid',
          paymentMethod: null,
          orderRounds: 1
        };

        return consolidateTableBills([finalReceipt, ...prev]);
      }
    });

    // If this completed order belongs to current customer's table, pop up consolidated receipt with confetti!
    if (finished.tableNumber === tableNumber) {
      setTimeout(() => {
        setCustomerServedReceipt((prev) => {
          if (prev && prev.tableNumber === tableNumber && prev.paymentStatus !== 'paid') {
            const combinedItems = [...prev.items];
            (finished.items || []).forEach((newItem) => {
              const matchIdx = combinedItems.findIndex((i) => i.id === newItem.id);
              if (matchIdx >= 0) {
                combinedItems[matchIdx] = {
                  ...combinedItems[matchIdx],
                  quantity: combinedItems[matchIdx].quantity + newItem.quantity
                };
              } else {
                combinedItems.push(newItem);
              }
            });
            const subtotal = combinedItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
            const vat = Math.round(subtotal * 0.05);
            const total = subtotal + vat;
            return {
              ...prev,
              items: combinedItems,
              subtotal,
              vat,
              total,
              servedAtTime: nowTime,
              orderRounds: (prev.orderRounds || 1) + 1
            };
          }
          return finalReceipt;
        });
        setIsReceiptModalOpen(true);
        setIsOrderModalOpen(false);
        setIsKitchenStatusOpen(false);
      }, 50);

      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }

    setActiveOrders((prev) => prev.filter((o) => o.orderId !== orderId));
    if (currentLiveOrder && currentLiveOrder.orderId === orderId) {
      setCurrentLiveOrder(null);
    }

    return finalReceipt;
  };

    // Settle bill / Update payment status
    const handleUpdatePaymentStatus = (invoiceNum, method = 'cash') => {
      setCompletedOrders((prev) =>
        prev.map((ord) =>
          ord.invoiceNumber === invoiceNum || String(ord.orderId) === String(invoiceNum)
            ? { ...ord, paymentStatus: 'paid', paymentMethod: method }
            : ord
        )
      );
      if (customerServedReceipt && (customerServedReceipt.invoiceNumber === invoiceNum || String(customerServedReceipt.orderId) === String(invoiceNum))) {
        setCustomerServedReceipt((prev) => ({ ...prev, paymentStatus: 'paid', paymentMethod: method }));
        // Open review modal after a short delay so customer can rate their dining experience
        setTimeout(() => {
          setIsReviewModalOpen(true);
        }, 1200);
      }
    };

    // Manager / Floor staff releases table when customer finishes and leaves
    const handleReleaseTable = (tblNum) => {
      if (customerServedReceipt && customerServedReceipt.tableNumber === tblNum) {
        setCustomerServedReceipt(null);
      }
      setCompletedOrders((prev) => prev.filter((o) => o.tableNumber !== tblNum || o.paymentStatus !== 'paid'));
      setServiceCalls((prev) => prev.filter((c) => c.tableNumber !== tblNum));
    };

    // Manager applies special discount (percentage or flat amount) to an order bill
    const handleApplyDiscount = (invoiceNum, discountAmount, discountReason = 'Manager Courtesy Discount') => {
      setCompletedOrders((prev) =>
        prev.map((ord) => {
          if (ord.invoiceNumber === invoiceNum || String(ord.orderId) === String(invoiceNum)) {
            const newTotal = Math.max(0, (ord.total || 0) - discountAmount);
            return {
              ...ord,
              discount: (ord.discount || 0) + discountAmount,
              discountReason,
              total: newTotal
            };
          }
          return ord;
        })
      );
      if (customerServedReceipt && (customerServedReceipt.invoiceNumber === invoiceNum || String(customerServedReceipt.orderId) === String(invoiceNum))) {
        setCustomerServedReceipt((prev) => {
          const newTotal = Math.max(0, (prev.total || 0) - discountAmount);
          return {
            ...prev,
            discount: (prev.discount || 0) + discountAmount,
            discountReason,
            total: newTotal
          };
        });
      }
    };

  // Calculate synchronized remaining seconds for an order
  const getOrderRemainingSeconds = (order) => {
    if (!order || !order.targetEndTime) return 0;
    const diff = Math.round((order.targetEndTime - now) / 1000);
    return Math.max(0, diff);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="w-full flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-md shadow-orange-500/20">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-black text-slate-900 tracking-wider">
                Bite<span className="text-orange-600">IQ</span>
              </span>
              <span className="block text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                Smart Gastronomy
              </span>
            </div>
          </div>

          {/* Action Buttons for Customers */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Table Selector Pill in Navbar */}
            <button
              onClick={() => setIsTableSelectModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 font-extrabold text-xs transition-all cursor-pointer active:scale-95 shadow-2xs"
              title="টেবিল নম্বর পরিবর্তন করতে ক্লিক করুন"
            >
              <TableIcon className="w-3.5 h-3.5 text-orange-600" />
              <span>Table {tableNumber}</span>
              <span className="text-[10px] text-orange-600 font-bold hidden sm:inline">(পরিবর্তন 🔄)</span>
            </button>
            {/* Table Assistance & Call Waiter Button in Navbar with Unread Badge */}
            <button
              onClick={() => {
                setIsServiceModalOpen(true);
                markCustomerMessagesAsSeen();
              }}
              className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 border ${
                customerUnreadCount > 0
                  ? 'bg-purple-50 hover:bg-purple-100 border-purple-300 text-purple-900 ring-2 ring-purple-200 animate-pulse'
                  : 'bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-700'
              }`}
            >
              <Bell className={`w-4 h-4 ${customerUnreadCount > 0 ? 'text-purple-600 animate-bounce' : 'text-orange-600'}`} />
              <span>সার্ভিস / মেসেজ</span>
              {customerUnreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-purple-600 text-white font-black text-[10px] rounded-full flex items-center justify-center shadow-md animate-bounce ring-2 ring-white">
                  {customerUnreadCount}
                </span>
              )}
            </button>

            {/* Real-time Kitchen Tracking Button in Navbar */}
            <button
              onClick={() => setIsKitchenStatusOpen(true)}
              className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs border ${
                currentLiveOrder
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-200 animate-pulse'
                  : currentRequest
                  ? 'bg-amber-50 text-amber-900 border-amber-300 ring-2 ring-amber-200 animate-pulse'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <ChefHat className={`w-4 h-4 ${currentLiveOrder ? 'text-emerald-600' : 'text-slate-600'}`} />
              <span className="hidden sm:inline">কিচেন লাইভ স্ট্যাটাস</span>
              <span className="sm:hidden">কিচেন</span>
              {currentLiveOrder ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping ml-0.5" />
              ) : currentRequest ? (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping ml-0.5" />
              ) : null}
            </button>

            {/* Thermal Bill Receipt Button for Served Tables */}
            {customerServedReceipt && (
              <button
                onClick={() => setIsReceiptModalOpen(true)}
                className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer ${
                  customerServedReceipt.paymentStatus === 'paid'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-500/20'
                    : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-red-500/30 animate-pulse'
                }`}
              >
                <Receipt className="w-4 h-4" />
                <span>
                  {customerServedReceipt.paymentStatus === 'paid' 
                    ? 'বিল পরিশোধিত (৳০ বাকি)' 
                    : `বিল রসিদ (৳${customerServedReceipt.total})`}
                </span>
                {customerServedReceipt.paymentStatus === 'unpaid' && (
                  <span className="w-2 h-2 rounded-full bg-yellow-300 animate-ping ml-0.5" />
                )}
                {customerServedReceipt.paymentStatus === 'paid' && (
                  <span className="w-2 h-2 rounded-full bg-emerald-200 ml-0.5" />
                )}
              </button>
            )}



            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 transition-all active:scale-95 flex items-center justify-center"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-slate-900 text-white font-extrabold text-[10px] rounded-full flex items-center justify-center shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 space-y-8 pb-16">
        {/* Dynamic Discount Notice Banner Broadcasted by Manager */}
        {activeNotice?.isActive && !isNoticeDismissedByCustomer && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-3 animate-fadeIn">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 p-0.5 shadow-xl shadow-orange-500/15">
              <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 text-white rounded-[22px] px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 text-center md:text-left">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/30">
                    <span className="text-xl sm:text-2xl animate-bounce">🎁</span>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                      <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                        {activeNotice.badgeText || "SPECIAL NOTICE"}
                      </span>
                      <h3 className="text-sm sm:text-base font-extrabold text-white">
                        {activeNotice.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 max-w-xl">
                      {activeNotice.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                  {activeNotice.promoCode && (
                    <div className="flex items-center gap-2">
                      <div className="text-right hidden sm:block">
                        <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">কুপন কোড:</span>
                        <span className="text-xs text-slate-400">{activeNotice.discountPercent ? `${activeNotice.discountPercent}% ছাড়` : 'স্পেশাল ছাড়'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(activeNotice.promoCode);
                          }
                          setCopiedPromo(true);
                          setTimeout(() => setCopiedPromo(false), 2000);
                        }}
                        className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer text-xs"
                        title="কোড কপি করতে চাপ দিন"
                      >
                        <span className="font-mono tracking-wider font-extrabold text-sm">{activeNotice.promoCode}</span>
                        {copiedPromo ? (
                          <span className="bg-slate-900 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded">
                            কপি হয়েছে! ✓
                          </span>
                        ) : (
                          <span className="bg-slate-900/20 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            কপি করুন 📋
                          </span>
                        )}
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsNoticeDismissedByCustomer(true)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-all cursor-pointer"
                    title="নোটিশ বন্ধ করুন"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <HeroAndReviews
          tableNumber={tableNumber}
          onOpenAI={() => setIsAiOpen(true)}
          onOpenTableSelect={() => setIsTableSelectModalOpen(true)}
          currentRequest={currentRequest}
          currentLiveOrder={currentLiveOrder}
          remainingSeconds={getOrderRemainingSeconds(currentLiveOrder)}
          onOpenKitchenStatus={() => {
            if (currentLiveOrder) {
              setIsOrderModalOpen(true);
            } else {
              setIsKitchenStatusOpen(true);
            }
          }}
          featuredReviews={featuredReviews}
        />

        <MenuSection
          items={menuItems}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveItem}
          cartItems={cartItems}
        />
      </main>



      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 sm:px-8 text-center text-xs text-slate-500 space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-2 text-slate-600 font-semibold">
          <MapPin className="w-3.5 h-3.5 text-orange-600" />
          <span>{RESTAURANT_INFO.address}</span>
          <span className="mx-2 hidden sm:inline">•</span>
          <Clock className="w-3.5 h-3.5 text-orange-600" />
          <span>{RESTAURANT_INFO.openingHours}</span>
        </div>
        <p>© 2026 {RESTAURANT_INFO.name} — Autonomous Dining Ecosystem. Designed for ultra-low staff friction & AI meal satisfaction.</p>
        
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setIsStaffLoginOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-bold transition-all shadow-xs"
          >
            <UserCheck className="w-3.5 h-3.5 text-orange-600" />
            <span>Floor Manager Portal</span>
            {(pendingRequests.length > 0 || serviceCalls.length > 0) && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse ml-0.5" />
            )}
          </button>

          <button
            onClick={() => setIsStaffLoginOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold transition-all"
          >
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Admin Executive Suite</span>
          </button>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <MoodBiteAI
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        onAddToCart={(item) => {
          handleAddToCart(item);
          setIsCartOpen(true);
        }}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onRequestOrder={handleRequestOrder}
        tableNumber={tableNumber}
      />

      {/* Table Assistance / Call Waiter Modal (Middle of screen popup) */}
      <TableServiceModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        tableNumber={tableNumber}
        onSendRequest={handleSendServiceRequest}
        serviceCalls={serviceCalls}
        onSeen={markCustomerMessagesAsSeen}
        unreadCount={customerUnreadCount}
      />

      <OrderRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        orderRequest={currentRequest}
      />

      <LiveOrderStatusModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        order={currentLiveOrder}
        remainingSeconds={getOrderRemainingSeconds(currentLiveOrder)}
      />

      <CustomerKitchenModal
        isOpen={isKitchenStatusOpen}
        onClose={() => setIsKitchenStatusOpen(false)}
        currentRequest={currentRequest}
        currentLiveOrder={currentLiveOrder}
        tableNumber={tableNumber}
        remainingSeconds={getOrderRemainingSeconds(currentLiveOrder)}
      />

      {/* Customer Thermal Receipt Modal */}
      <ThermalReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        order={customerServedReceipt}
        onUpdatePayment={handleUpdatePaymentStatus}
        onOpenReview={() => setIsReviewModalOpen(true)}
        isManagerView={false}
      />

      {/* Post-Payment Customer Star Review & Loyalty Coins Modal */}
      <CustomerReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        tableNumber={tableNumber}
        invoiceNumber={customerServedReceipt?.invoiceNumber || 'INV-1042'}
        totalAmount={customerServedReceipt?.total || 0}
        onSubmitReview={(rev) => {
          setLoyaltyCoins((prev) => prev + (rev.coinsEarned || 20));
          const newReviewEntry = {
            id: 'rev_' + Date.now(),
            tableNumber: rev.tableNumber,
            invoiceNumber: rev.invoiceNumber,
            foodRating: rev.foodRating,
            serviceRating: rev.serviceRating,
            feedbackText: rev.feedbackText || 'খাবার চমৎকার ছিল!',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: 'Today',
            coinsEarned: rev.coinsEarned
          };
          setCustomerReviews((prev) => [newReviewEntry, ...prev]);
        }}
      />

      {/* Direct Link Visitor Table Selector Modal (যদি কাস্টমার সরাসরি লিঙ্কে বা সার্চ করে ঢোকে) */}
      <TableSelectModal
        isOpen={isTableSelectModalOpen}
        onClose={() => setIsTableSelectModalOpen(false)}
        tablesList={tablesList}
        currentTable={tableNumber}
        onSelectTable={handleSelectTable}
        onOpenStaffLogin={() => {
          setIsTableSelectModalOpen(false);
          setIsStaffLoginOpen(true);
        }}
      />

      <StaffLoginModal
        isOpen={isStaffLoginOpen}
        onClose={() => setIsStaffLoginOpen(false)}
        onLoginSuccess={(role) => {
          setActiveStaffRole(role);
        }}
      />

      {/* STANDALONE MANAGER DASHBOARD */}
      {activeStaffRole === 'manager' && (
        <ManagerDashboardView
          pendingRequests={pendingRequests}
          activeOrders={activeOrders}
          completedOrders={completedOrders}
          serviceCalls={serviceCalls}
          customerReviews={customerReviews}
          featuredReviews={featuredReviews}
          activeNotice={activeNotice}
          menuItems={menuItems}
          onUpdateMenuItem={handleUpdateMenuItem}
          onAddMenuItem={handleAddMenuItem}
          onDeleteMenuItem={handleDeleteMenuItem}
          onResetMenu={handleResetMenu}
          onUpdateNotice={handleUpdateNotice}
          onToggleFeatureReview={handleToggleFeatureReview}
          onResetFeaturedReviews={handleResetFeaturedReviews}
          onClearReviews={() => {
            setCustomerReviews([]);
            try {
              localStorage.removeItem('biteiq_today_reviews');
            } catch {}
          }}
          onConfirmRequest={handleConfirmRequest}
          onCompleteOrder={handleCompleteOrder}
          onDismissServiceCall={handleDismissServiceCall}
          onReplyServiceCall={handleReplyServiceCall}
          onDirectMessageToTable={handleManagerDirectMessageToTable}
          onMarkTableAsSeen={handleMarkTableCallsAsSeen}
          onUpdatePaymentStatus={handleUpdatePaymentStatus}
          onReleaseTable={handleReleaseTable}
          onApplyDiscount={handleApplyDiscount}
          getOrderRemainingSeconds={getOrderRemainingSeconds}
          onLogout={() => setActiveStaffRole(null)}
          onClose={() => setActiveStaffRole(null)}
        />
      )}

      {/* STANDALONE ADMIN DASHBOARD */}
      {activeStaffRole === 'admin' && (
        <AdminDashboardView
          completedOrders={completedOrders}
          onLogout={() => setActiveStaffRole(null)}
          onClose={() => setActiveStaffRole(null)}
        />
      )}
    </div>
  );
}
