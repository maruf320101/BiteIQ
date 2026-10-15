# 🍽️ BiteIQ - Smart QR Dining & Restaurant Operations System

> **A modern, responsive, end-to-end QR Code Digital Dining & Restaurant Floor Operations Platform built with React 19, Vite, and Tailwind CSS.**

![BiteIQ Smart Dining](https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80)

---

## ✨ Key Features

### 📱 1. Customer Self-Service QR Ordering
- **Dynamic Table Auto-Detection:** Tables 1–5 (and custom tables) encoded in individual printable QR codes (`?table=1`, `?table=2`, etc.).
- **Interactive Digital Menu:** Filter by categories (*Biryani, Platters, Grills, Desserts, Mocktails*), live dietary filters (Spicy, Chef Special, Best Seller), and real-time search.
- **Dietary & Cooking Customization:** Add item-level cooking notes (e.g. *"less spice"*, *"no onions"*).
- **Loyalty Coins & Promo Codes:** Apply promo codes (e.g. `BITE15` for 15% discount) and redeem dining reward coins.
- **Service Assistance:** Call waiter, request water/cutlery, ask for bill, or send direct table messages.

---

### 👨‍💼 2. Floor Manager Operations Center
- **Live Dispatch & Kitchen Telemetry:** Track active orders with live preparation countdown timers and status indicators (*Pending, In Kitchen, Ready to Serve, Delivered*).
- **Table Occupancy Grid:** Real-time visibility of occupied vs vacant tables, unread customer call badges, and table release management.
- **Direct Table Chat:** WhatsApp/Messenger style real-time live messaging between manager and each table.
- **Custom QR Stand Generator & Print Hub:**
  - One-click **Create QR** option to dynamically add new tables (e.g. Table 6, Table 7, VIP).
  - Print-ready **A4 layout** precisely formatted with **2 table cards per sheet** with cutting guide lines (`✂️`).
  - LAN/WiFi IP configuration for testing with real mobile phone cameras.

---

### 📊 3. Financial Sales Ledger & Billing
- **30-Day Digital Sales Book (ডিজিটাল হিসাব খাতা):** Daily turnover, breakdown by Cash, Card, and MFS (bKash / Nagad / Rocket).
- **Custom Date Range Filtering:** Inspect historical revenue from specific date intervals.
- **Thermal Receipt Printer:** Standard 58mm / 80mm thermal receipt generator with VAT breakdown and table number.
- **Excel & Print Export:** Export sales audit ledger directly to Excel spreadsheets or print formatted booklets.

---

### 🛠️ 4. Menu & Offer Management
- **In-App Menu Editor:** Add new dishes, edit prices, descriptions, and tags.
- **Device Image Upload:** Directly upload dish photos from PC/laptop files or paste image URLs.
- **Live Announcement Banner:** Broadcast real-time deals and discount notices across customer screens.

---

## 🚀 Tech Stack

- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **QR Code:** qrcode.react (SVG rendering)
- **Delight & Animations:** Canvas Confetti + Custom CSS Keyframes

---

## 💻 Getting Started Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (version 18+ recommended).

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/BiteIQ.git
   cd BiteIQ
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:5173
   ```

---

## 🖨️ Building for Production

To create a production-ready optimized build:
```bash
npm run build
```
Preview the production build:
```bash
npm run preview
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
