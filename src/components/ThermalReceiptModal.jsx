import React, { useState } from 'react';
import { 
  Printer, 
  X, 
  Banknote, 
  Smartphone, 
  CreditCard, 
  QrCode, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck, 
  Sparkles,
  Camera,
  ArrowRight,
  ArrowLeft,
  Receipt,
  Star,
  Users,
  Percent,
  Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ThermalReceiptModal({
  isOpen,
  onClose,
  order,
  onUpdatePayment,
  onOpenReview,
  isManagerView = false
}) {
  if (!isOpen || !order) return null;

  const items = order.items || [];
  const subtotal = order.subtotal || items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const vat = order.vat || Math.round(subtotal * 0.05);
  const discount = order.discount || 0;
  const total = order.total !== undefined ? order.total : Math.max(0, Math.round(subtotal + vat - discount));
  const invoiceNum = order.invoiceNumber || ('INV-' + (order.orderId || '1042'));
  const tableNum = order.tableNumber || 4;
  const servedDate = order.servedDate || new Date().toLocaleDateString('en-GB');
  const servedTime = order.servedAtTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const isPaid = order.paymentStatus === 'paid';
  const payMethod = order.paymentMethod || 'cash';
  const customerName = order.customerName || (typeof window !== 'undefined' ? localStorage.getItem('biteiq_customer_name') : '') || '';

  // Step state: 'receipt' | 'payment'
  // When opened, if already paid or manager view -> always 'receipt'
  const [currentStep, setCurrentStep] = useState('receipt');

  // Split bill state (divide bill among friends)
  const [splitCount, setSplitCount] = useState(1); // 1 = full bill, 2, 3, 4
  const perPersonAmount = Math.ceil(total / (splitCount || 1));

  // Customer promo coupon state
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null); // { code: 'BITE10', amount: 50 }

  // State for Customer Payment Gateway
  const [activeTab, setActiveTab] = useState('cash'); // 'cash' | 'wallet' | 'card'
  const [walletBrand, setWalletBrand] = useState('bkash'); // 'bkash' | 'nagad' | 'rocket'
  const [walletPhone, setWalletPhone] = useState('01700-123456');
  const [walletAmount, setWalletAmount] = useState(total.toString());
  const [walletPin, setWalletPin] = useState('');
  const [showQrScanner, setShowQrScanner] = useState(false);

  // Card form state
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [cardHolder, setCardHolder] = useState('MD. TANVIR HASAN');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('•••');

  // Loading state during simulated transaction
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleExecutePayment = (methodType) => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      if (onUpdatePayment) {
        onUpdatePayment(invoiceNum, methodType);
      }
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore if canvas unavailable
      }
      // Flip back to receipt to show the green paid stamp!
      setCurrentStep('receipt');
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-[390px] my-auto flex flex-col items-center">
        
        {/* Top Controls Bar */}
        <div className="w-full flex items-center justify-between mb-3 px-1 print:hidden text-white">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isPaid ? 'bg-emerald-400' : currentStep === 'payment' ? 'bg-rose-500 animate-pulse' : 'bg-amber-400 animate-ping'}`} />
            <span className="text-xs font-black tracking-wide text-slate-200 uppercase">
              {isManagerView 
                ? 'Manager POS Telemetry' 
                : isPaid 
                  ? 'Official Receipt (Paid)' 
                  : currentStep === 'payment'
                    ? 'Step 2: Payment Gateway'
                    : 'Step 1: Dining Bill'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {currentStep === 'receipt' && (
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all border border-white/20 shadow-sm active:scale-95 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>প্রিন্ট / সেভ</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-rose-600 text-white transition-all border border-white/20 shadow-sm active:scale-95 flex items-center justify-center cursor-pointer"
              title="বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: CLEAN THERMAL RECEIPT VIEW                                        */}
        {/* ========================================================================= */}
        {(currentStep === 'receipt' || isManagerView) && (
          <div className="w-full flex flex-col items-center animate-fadeIn">
            
            {/* REALISTIC THERMAL PAPER CONTAINER */}
            <div className="w-full max-w-[370px] filter drop-shadow-2xl select-text transition-all">
              
              {/* Top Zigzag Serrated Tear Edge */}
              <div className="w-full overflow-hidden leading-none -mb-[1px]">
                <svg className="w-full h-3 text-white fill-current block" viewBox="0 0 400 12" preserveAspectRatio="none">
                  <path d="M0,12 L10,0 L20,12 L30,0 L40,12 L50,0 L60,12 L70,0 L80,12 L90,0 L100,12 L110,0 L120,12 L130,0 L140,12 L150,0 L160,12 L170,0 L180,12 L190,0 L200,12 L210,0 L220,12 L230,0 L240,12 L250,0 L260,12 L270,0 L280,12 L290,0 L300,12 L310,0 L320,12 L330,0 L340,12 L350,0 L360,12 L370,0 L380,12 L390,0 L400,12 Z" />
                </svg>
              </div>

              {/* Paper Body */}
              <div className="bg-white px-5 sm:px-6 py-5 text-slate-900 font-mono text-[13px] leading-relaxed relative">
                
                {/* Realistic Ink Rubber Stamp if paid (Fixed, no bouncing) */}
                {isPaid && (
                  <div className="absolute top-28 right-4 pointer-events-none select-none z-10 rotate-[-12deg]">
                    <div className="border-[3px] border-dashed border-emerald-600/90 rounded-md px-3 py-1 bg-emerald-50/75 shadow-xs backdrop-blur-[0.5px]">
                      <div className="flex items-center gap-1.5 text-emerald-700 font-black tracking-widest text-[11px] uppercase">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                        <span>PAID / পরিশোধিত</span>
                      </div>
                      <div className="text-[8px] font-mono font-bold text-emerald-800 tracking-wider text-center border-t border-emerald-600/50 pt-0.5 mt-0.5">
                        {payMethod === 'bkash' ? 'BKASH WALLET' : 
                         payMethod === 'nagad' ? 'NAGAD WALLET' :
                         payMethod === 'rocket' ? 'ROCKET WALLET' :
                         payMethod === 'card' ? 'CARD AUTHORIZED' : 'CASH COUNTER'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Asterisk top rule */}
                <div className="text-center text-slate-400 text-xs tracking-tighter overflow-hidden whitespace-nowrap">
                  ****************************************************
                </div>

                {/* Restaurant & Receipt Header */}
                <div className="text-center my-2 space-y-0.5">
                  <h2 className="text-lg font-black tracking-wider uppercase text-slate-950 font-sans">
                    Bite<span className="text-orange-600">IQ</span> Fine Dine
                  </h2>
                  <p className="text-[10px] text-slate-500 font-sans">
                    House 42, Road 11, Banani, Dhaka-1213
                  </p>
                  <p className="text-[10px] text-slate-500 font-sans">
                    Hotline: +880 1700-000000 | VAT Reg: 004928172
                  </p>
                  <div className="pt-1.5 pb-1">
                    <span className="text-xs font-black tracking-widest uppercase border-y border-dashed border-slate-300 py-0.5 px-4 inline-block text-slate-800">
                      RECEIPT
                    </span>
                  </div>
                </div>

                {/* Asterisk separator */}
                <div className="text-center text-slate-400 text-xs tracking-tighter overflow-hidden whitespace-nowrap">
                  ****************************************************
                </div>

                {/* Terminal, Table & Date Information */}
                <div className="py-2 space-y-1 text-xs text-slate-700">
                  <div className="flex justify-between items-center">
                    <span>Terminal#{tableNum}</span>
                    <span>{servedDate}</span>
                    <span>{servedTime}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-500">
                    <span>Table: <strong className="text-slate-900">Table {tableNum}</strong></span>
                    <span>Inv: <strong className="text-slate-900">{invoiceNum}</strong></span>
                  </div>
                  {customerName && (
                    <div className="flex justify-between items-center text-[11px] text-slate-600 border-t border-dotted border-slate-200 pt-1 mt-0.5">
                      <span>Guest / কাস্টমার:</span>
                      <strong className="text-slate-950 font-bold font-sans">{customerName}</strong>
                    </div>
                  )}
                </div>

                {/* Dashed line */}
                <div className="border-t border-dashed border-slate-400 my-2" />

                {/* Items Header */}
                <div className="flex justify-between text-[11px] font-bold text-slate-500 pb-1 uppercase">
                  <span>Qty & Description</span>
                  <span>Price</span>
                </div>

                {/* Item Rows */}
                <div className="space-y-1.5 py-1 text-xs">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start gap-2">
                      <div className="flex-1 pr-2 leading-tight">
                        <span className="font-bold text-slate-950">{item.quantity} x </span>
                        <span className="text-slate-800 font-sans">{item.name}</span>
                      </div>
                      <span className="font-bold text-slate-900 whitespace-nowrap">
                        ৳{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Dashed line */}
                <div className="border-t border-dashed border-slate-400 my-2.5" />

                {/* Subtotal, Taxes & Discount */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>SUBTOTAL</span>
                    <span>৳{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>VAT & SERVICE (5%)</span>
                    <span>৳{vat.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>DISCOUNT / ছাড় ({order.discountReason || 'PROMO'})</span>
                      <span>-৳{discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* Dashed line */}
                <div className="border-t border-dashed border-slate-400 my-2" />

                {/* TOTAL AMOUNT & DUE AMOUNT */}
                <div className="space-y-1 py-1">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span>BILLED TOTAL</span>
                    <span>৳{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-black text-slate-950">
                    <span className="tracking-wide">
                      {isPaid ? 'NET DUE AMOUNT' : 'TOTAL AMOUNT'}
                    </span>
                    <span className={`text-base tracking-tight font-sans font-bold ${
                      isPaid ? 'text-emerald-700' : 'text-slate-950'
                    }`}>
                      {isPaid ? '৳0.00 (PAID)' : `৳${total.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="py-2 space-y-1 text-[11px] text-slate-600 border-t border-dashed border-slate-300 mt-2">
                  <div className="flex justify-between">
                    <span>PAYMENT STATUS</span>
                    <span className={`font-black ${isPaid ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {isPaid ? 'PAID / পরিশোধিত' : 'PENDING'}
                    </span>
                  </div>
                  {isPaid && (
                    <div className="flex justify-between">
                      <span>PAID VIA</span>
                      <span className="font-bold uppercase text-slate-900">
                        {payMethod === 'bkash' ? 'bKash Mobile Wallet' : 
                         payMethod === 'nagad' ? 'Nagad Mobile Wallet' :
                         payMethod === 'rocket' ? 'Rocket Mobile Wallet' :
                         payMethod === 'wallet' ? 'Mobile Wallet' :
                         payMethod === 'card' ? 'Visa / Bank Card' : 'Cash Counter'}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-500">
                    <span>Approval#</span>
                    <span>{order.orderId ? `APV-${order.orderId}` : '123654'}</span>
                  </div>
                </div>

                {/* Dashed line */}
                <div className="border-t border-dashed border-slate-400 my-2" />

                {/* Thank you message */}
                <div className="text-center py-1 space-y-1">
                  <div className="text-slate-400 text-xs tracking-tighter overflow-hidden whitespace-nowrap">
                    **********THANK YOU!**********
                  </div>
                  <p className="text-[10px] text-slate-500 font-sans">
                    Please visit us again soon!
                  </p>
                </div>

                {/* Realistic Barcode Graphic */}
                <div className="pt-2 pb-1 flex flex-col items-center">
                  <svg className="w-56 h-10 text-slate-900 fill-current" viewBox="0 0 240 50">
                    <rect x="0" y="0" width="3" height="42" />
                    <rect x="5" y="0" width="1" height="42" />
                    <rect x="8" y="0" width="4" height="42" />
                    <rect x="15" y="0" width="2" height="42" />
                    <rect x="19" y="0" width="1" height="42" />
                    <rect x="23" y="0" width="5" height="42" />
                    <rect x="31" y="0" width="2" height="42" />
                    <rect x="35" y="0" width="3" height="42" />
                    <rect x="41" y="0" width="1" height="42" />
                    <rect x="44" y="0" width="4" height="42" />
                    <rect x="51" y="0" width="2" height="42" />
                    <rect x="56" y="0" width="5" height="42" />
                    <rect x="63" y="0" width="1" height="42" />
                    <rect x="67" y="0" width="3" height="42" />
                    <rect x="73" y="0" width="4" height="42" />
                    <rect x="80" y="0" width="2" height="42" />
                    <rect x="85" y="0" width="1" height="42" />
                    <rect x="89" y="0" width="6" height="42" />
                    <rect x="98" y="0" width="2" height="42" />
                    <rect x="103" y="0" width="3" height="42" />
                    <rect x="108" y="0" width="1" height="42" />
                    <rect x="112" y="0" width="5" height="42" />
                    <rect x="120" y="0" width="2" height="42" />
                    <rect x="125" y="0" width="4" height="42" />
                    <rect x="132" y="0" width="1" height="42" />
                    <rect x="136" y="0" width="3" height="42" />
                    <rect x="142" y="0" width="5" height="42" />
                    <rect x="150" y="0" width="2" height="42" />
                    <rect x="155" y="0" width="1" height="42" />
                    <rect x="159" y="0" width="4" height="42" />
                    <rect x="166" y="0" width="2" height="42" />
                    <rect x="171" y="0" width="6" height="42" />
                    <rect x="180" y="0" width="1" height="42" />
                    <rect x="184" y="0" width="3" height="42" />
                    <rect x="190" y="0" width="4" height="42" />
                    <rect x="197" y="0" width="2" height="42" />
                    <rect x="202" y="0" width="5" height="42" />
                    <rect x="210" y="0" width="1" height="42" />
                    <rect x="214" y="0" width="3" height="42" />
                    <rect x="220" y="0" width="4" height="42" />
                    <rect x="227" y="0" width="2" height="42" />
                    <rect x="232" y="0" width="3" height="42" />
                    <rect x="237" y="0" width="2" height="42" />
                  </svg>
                  <span className="text-[10px] tracking-widest text-slate-500 pt-1 font-mono">
                    * {invoiceNum} *
                  </span>
                </div>
              </div>

              {/* Bottom Zigzag Serrated Tear Edge */}
              <div className="w-full overflow-hidden leading-none rotate-180 -mt-[1px]">
                <svg className="w-full h-3 text-white fill-current block" viewBox="0 0 400 12" preserveAspectRatio="none">
                  <path d="M0,12 L10,0 L20,12 L30,0 L40,12 L50,0 L60,12 L70,0 L80,12 L90,0 L100,12 L110,0 L120,12 L130,0 L140,12 L150,0 L160,12 L170,0 L180,12 L190,0 L200,12 L210,0 L220,12 L230,0 L240,12 L250,0 L260,12 L270,0 L280,12 L290,0 L300,12 L310,0 L320,12 L330,0 L340,12 L350,0 L360,12 L370,0 L380,12 L390,0 L400,12 Z" />
                </svg>
              </div>
            </div>

            {/* Bottom Action for Customer: Either "Proceed to Pay" button or "Paid Badge" */}
            {!isManagerView && (
              <div className="w-full max-w-[370px] mt-3 space-y-2">
                {!isPaid ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep('payment')}
                    className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 hover:from-orange-500 hover:to-rose-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-orange-950/40 active:scale-98 transition-all cursor-pointer group"
                  >
                    <span>বিল পরিশোধ করুন (Pay Bill ৳{total})</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="bg-emerald-950/80 border border-emerald-600/50 rounded-2xl p-3 text-center text-emerald-200 text-xs font-bold flex items-center justify-center gap-2 shadow-lg">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>বিলটি সফলভাবে পরিশোধিত হয়েছে! ধন্যবাদ।</span>
                    </div>

                    {/* Customer Rating & Review Trigger Button */}
                    {onOpenReview && (
                      <button
                        type="button"
                        onClick={onOpenReview}
                        className="w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all cursor-pointer"
                      >
                        <Star className="w-4 h-4 fill-white" />
                        <span>খাবার ও সেবার রেটিং দিন (Earn Loyalty Coins ⭐)</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: DEDICATED FULL PAYMENT GATEWAY CARD                                */}
        {/* ========================================================================= */}
        {currentStep === 'payment' && !isManagerView && !isPaid && (
          <div className="w-full max-w-[380px] bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-2xl animate-fadeIn">
            
            {/* Header with Back button */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
              <button
                type="button"
                onClick={() => setCurrentStep('receipt')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>রসিদ দেখুন</span>
              </button>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-mono">পরিশোধযোগ্য বিল</span>
                <span className="text-base font-extrabold text-emerald-400 font-mono">৳{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Title */}
            <div className="my-3 flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs font-black text-slate-100 uppercase tracking-wide">
                  পেমেন্ট মাধ্যম নির্বাচন করুন
                </h3>
                <p className="text-[10px] text-slate-400">
                  নিরাপদ ও তাৎক্ষণিক বিল নিষ্পত্তির মাধ্যম
                </p>
              </div>
            </div>

            {/* 3 Main Method Tabs: Cash, Mobile Wallet, Bank Card */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/70 rounded-2xl border border-slate-800">
              {/* Cash Tab */}
              <button
                type="button"
                onClick={() => setActiveTab('cash')}
                className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'cash'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Banknote className="w-4 h-4 mb-1" />
                <span className="text-[11px]">Cash</span>
              </button>

              {/* Mobile Wallet Tab */}
              <button
                type="button"
                onClick={() => setActiveTab('wallet')}
                className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'wallet'
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Smartphone className="w-4 h-4 mb-1" />
                <span className="text-[11px]">Mobile Wallet</span>
              </button>

              {/* Bank Card Tab */}
              <button
                type="button"
                onClick={() => setActiveTab('card')}
                className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'card'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <CreditCard className="w-4 h-4 mb-1" />
                <span className="text-[11px]">Bank Card</span>
              </button>
            </div>

            {/* TAB 1: CASH PAYMENT */}
            {activeTab === 'cash' && (
              <div className="mt-4 space-y-3.5 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Banknote className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-100">
                    নগদ (Cash) কাউন্টারে পরিশোধ
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    ওয়েটার অথবা ক্যাশ কাউন্টারে সরাসরি টাকা প্রদান করার পর নিচের বাটনে চাপ দিন।
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleExecutePayment('cash')}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950/50 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>বিল সম্পন্ন হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>নগদ বিল সম্পন্ন করুন (Pay Cash ৳{total})</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* TAB 2: MOBILE WALLET (bKash, Nagad, Rocket) */}
            {activeTab === 'wallet' && (
              <div className="mt-4 space-y-3 animate-fadeIn">
                {/* 3 Wallet Brand Icons */}
                <div className="grid grid-cols-3 gap-2">
                  {/* bKash */}
                  <button
                    type="button"
                    onClick={() => setWalletBrand('bkash')}
                    className={`py-2 px-1.5 rounded-xl flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      walletBrand === 'bkash'
                        ? 'bg-pink-900/30 border-pink-500 text-pink-300 ring-2 ring-pink-500/40'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-500 inline-block" />
                    <span className="text-[11px] font-black">বিকাশ (bKash)</span>
                  </button>

                  {/* Nagad */}
                  <button
                    type="button"
                    onClick={() => setWalletBrand('nagad')}
                    className={`py-2 px-1.5 rounded-xl flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      walletBrand === 'nagad'
                        ? 'bg-amber-900/30 border-amber-500 text-amber-300 ring-2 ring-amber-500/40'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
                    <span className="text-[11px] font-black">নগদ (Nagad)</span>
                  </button>

                  {/* Rocket */}
                  <button
                    type="button"
                    onClick={() => setWalletBrand('rocket')}
                    className={`py-2 px-1.5 rounded-xl flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      walletBrand === 'rocket'
                        ? 'bg-purple-900/30 border-purple-500 text-purple-300 ring-2 ring-purple-500/40'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
                    <span className="text-[11px] font-black">রকেট (Rocket)</span>
                  </button>
                </div>

                {/* QR Scanner Simulation Overlay */}
                {showQrScanner ? (
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-700 text-center space-y-2 animate-fadeIn">
                    <div className="relative w-36 h-36 mx-auto bg-black rounded-lg border-2 border-dashed border-rose-500 flex flex-col items-center justify-center overflow-hidden">
                      <div className="absolute inset-x-0 h-0.5 bg-rose-500 animate-pulse top-1/2" />
                      <QrCode className="w-20 h-20 text-slate-500" />
                      <span className="text-[10px] text-rose-400 font-mono mt-1">BiteIQ Merchant QR</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      রেস্তোরাঁর টেবিল কিউআর কোড ডিটেক্টেড হয়েছে!
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setShowQrScanner(false);
                        setWalletPhone('01711-889900');
                      }}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg font-bold cursor-pointer"
                    >
                      ক্যামেরা বন্ধ করুন
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Number + Scan QR Row */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        {walletBrand === 'bkash' ? 'বিকাশ নম্বর' : walletBrand === 'nagad' ? 'নগদ নম্বর' : 'রকেট নম্বর'}
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={walletPhone}
                            onChange={(e) => setWalletPhone(e.target.value)}
                            placeholder="01XXXXXXXXX"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowQrScanner(true)}
                          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95"
                          title="ক্যামেরা দিয়ে মার্চেন্ট কিউআর স্ক্যান করুন"
                        >
                          <Camera className="w-3.5 h-3.5 text-rose-400" />
                          <span>Scan QR</span>
                        </button>
                      </div>
                    </div>

                    {/* Amount Input */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        টাকার পরিমাণ (Amount in ৳)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-xs text-slate-500 font-bold">৳</span>
                        <input
                          type="number"
                          value={walletAmount}
                          onChange={(e) => setWalletAmount(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-7 pr-3 py-2 text-xs font-mono text-emerald-400 font-bold focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                        />
                      </div>
                    </div>

                    {/* Wallet PIN Input */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        পিন নম্বর (PIN)
                      </label>
                      <input
                        type="password"
                        maxLength="5"
                        value={walletPin}
                        onChange={(e) => setWalletPin(e.target.value)}
                        placeholder="••••"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 tracking-widest focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                      />
                    </div>
                  </>
                )}

                {/* Wallet Pay Button */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleExecutePayment(walletBrand)}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-950/50 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{walletBrand.toUpperCase()} পেমেন্ট প্রসেসিং হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay ৳{walletAmount || total} ({walletBrand.toUpperCase()})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* TAB 3: BANK CARD (Visa / Mastercard) */}
            {activeTab === 'card' && (
              <div className="mt-4 space-y-3 animate-fadeIn">
                {/* Card Number */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      কার্ড নম্বর (Card Number)
                    </label>
                    <span className="text-[10px] font-mono text-blue-400">VISA / MasterCard</span>
                  </div>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4000 1234 5678 9010"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Cardholder Name */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    কার্ডধারীর নাম (Cardholder Name)
                  </label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="NAME ON CARD"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 uppercase focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Expiry & CVV */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      মেয়াদ (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="12/26"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      CVV / CVC
                    </label>
                    <input
                      type="password"
                      maxLength="4"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="123"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Secure Badge */}
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>256-Bit SSL Secured Payment Gateway</span>
                </div>

                {/* Card Pay Button */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleExecutePayment('card')}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-950/50 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>কার্ড ভেরিফিকেশন হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Pay ৳{total} (বিল পরিশোধ করুন)</span>
                    </>
                  )}
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
