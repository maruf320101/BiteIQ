export const RESTAURANT_INFO = {
  name: "BiteIQ",
  tagline: "Autonomous Smart Dining & AI Gastronomy",
  description: "Experience the next era of dining. Zero waitstaff friction, real-time kitchen telemetry, and personalized mood-based AI recommendations tailored to your cravings.",
  rating: 4.9,
  totalReviews: 1248,
  address: "Level 4, Skyview Tower, Gulshan-2, Dhaka",
  openingHours: "11:00 AM - 11:30 PM",
  tables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  features: [
    { title: "QR Self-Ordering", desc: "Order directly from your seat with precise preparation tracking." },
    { title: "MoodBite™ AI", desc: "Feeling stressed or tired? Our AI analyzes your mood and curates your meal." },
    { title: "Direct Kitchen Dispatch", desc: "Orders route straight to automated chef stations in seconds." },
    { title: "Zero-Wait Checkout", desc: "Split bills or pay digitally right from your phone before leaving." }
  ]
};

export const MENU_ITEMS = [
  // Mains
  {
    id: "m1",
    name: "Truffle Glazed Wagyu Slider",
    category: "Mains",
    price: 680,
    prepTime: 18,
    rating: 4.9,
    reviewsCount: 342,
    calories: "520 kcal",
    tag: "Chef Special",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
    description: "Premium A5 Wagyu beef patty infused with black truffle butter, brioche bun, aged gruyère, and caramelized scallion glaze.",
    moodTags: ["Hungry", "Indulgent", "Celebration", "Energetic"]
  },
  {
    id: "m2",
    name: "Smoked Salmon & Avocado Tartine",
    category: "Mains",
    price: 520,
    prepTime: 12,
    rating: 4.8,
    reviewsCount: 198,
    calories: "380 kcal",
    tag: "Healthy Pick",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80",
    description: "Cold-smoked Norwegian salmon, smashed hass avocado, poached organic quail eggs, microgreens on toasted artisan sourdough.",
    moodTags: ["Light", "Refreshed", "Healthy", "Work Lunch"]
  },
  {
    id: "m3",
    name: "Fire-Roasted Peri Peri Chicken",
    category: "Mains",
    price: 590,
    prepTime: 22,
    rating: 4.7,
    reviewsCount: 260,
    calories: "640 kcal",
    tag: "Spicy & Hot",
    image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=600&q=80",
    description: "Flame-grilled boneless chicken marinated in 14 African bird's eye chilies & herb emulsion, served with charred baby corn.",
    moodTags: ["Excited", "Hungry", "Spicy Craving", "Adventurous"]
  },
  {
    id: "m4",
    name: "Wild Mushroom & Truffle Risotto",
    category: "Mains",
    price: 550,
    prepTime: 16,
    rating: 4.85,
    reviewsCount: 144,
    calories: "460 kcal",
    tag: "Vegetarian",
    image: "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=600&q=80",
    description: "Slow-simmered arborio rice with porcini mushrooms, parmigiano-reggiano, white truffle oil, and crispy sage crisps.",
    moodTags: ["Comforting", "Rainy Day", "Cozy", "Relaxed"]
  },

  // Starters
  {
    id: "s1",
    name: "Crispy Calamari & Citrus Aioli",
    category: "Starters",
    price: 380,
    prepTime: 10,
    rating: 4.75,
    reviewsCount: 180,
    calories: "310 kcal",
    tag: "Crowd Favorite",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    description: "Tender ring calamari dusted in spiced cornmeal crust, flash-fried and served with yuzu citrus garlic aioli.",
    moodTags: ["Social", "Quick Bite", "Conversational"]
  },
  {
    id: "s2",
    name: "Burrata & Heritage Tomato Caprese",
    category: "Starters",
    price: 440,
    prepTime: 8,
    rating: 4.9,
    reviewsCount: 112,
    calories: "280 kcal",
    tag: "Fresh",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    description: "Creamy artisanal burrata cheese with heirloom tomatoes, aged Modena balsamic glaze, basil oil, and focaccia wafers.",
    moodTags: ["Light", "Refreshed", "Aesthetic"]
  },

  // Beverages
  {
    id: "d1",
    name: "Calm Serenity Chamomile & Honey Elixir",
    category: "Beverages",
    price: 220,
    prepTime: 6,
    rating: 4.95,
    reviewsCount: 410,
    calories: "45 kcal",
    tag: "Stress Relief",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
    description: "Whole chamomile blossoms steeped with raw organic wild honey, fresh crushed ginger, and lavender essence. Formulated for tension relief.",
    moodTags: ["Headache", "Stressed", "Tired", "Need Sleep", "Anxious", "Calm", "Relaxed"]
  },
  {
    id: "d2",
    name: "Energizing Nitro Cold Brew & Cardamom",
    category: "Beverages",
    price: 280,
    prepTime: 5,
    rating: 4.9,
    reviewsCount: 380,
    calories: "15 kcal",
    tag: "High Energy",
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80",
    description: "24-hour slow steep Ethiopian single-origin beans infused with nitrogen gas and aromatic crushed green cardamom. Silky, rich, zero crash.",
    moodTags: ["Sleepy", "Low Energy", "Focus Needed", "Work Mode", "Exhausted"]
  },
  {
    id: "d3",
    name: "Matcha Zen Mint Refresher",
    category: "Beverages",
    price: 290,
    prepTime: 7,
    rating: 4.8,
    reviewsCount: 220,
    calories: "90 kcal",
    tag: "Antioxidant",
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80",
    description: "Ceremonial grade Uji Japanese matcha whisked with fresh spearmint, lime zest, and coconut water. Clean focus without coffee jitters.",
    moodTags: ["Headache", "Fatigued", "Brain Fog", "Healthy", "Refreshing"]
  },
  {
    id: "d4",
    name: "Spiced Masala Velvet Chai",
    category: "Beverages",
    price: 180,
    prepTime: 8,
    rating: 4.95,
    reviewsCount: 520,
    calories: "120 kcal",
    tag: "Traditional Hug",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80",
    description: "Slow-boiled Assam CTC tea infused with crushed ginger, cinnamon bark, cloves, and whole creamy milk. Warm comfort in every sip.",
    moodTags: ["Headache", "Cold", "Rainy Day", "Comforting", "Homesick", "Tired"]
  },

  // Desserts
  {
    id: "ds1",
    name: "Molten Belgian Dark Chocolate Dome",
    category: "Desserts",
    price: 360,
    prepTime: 12,
    rating: 4.92,
    reviewsCount: 395,
    calories: "490 kcal",
    tag: "Mood Booster",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
    description: "70% single-origin Callebaut dark chocolate with a warm liquid heart, Madagascar vanilla bean gelato, and raspberry dust.",
    moodTags: ["Sad", "Sweet Craving", "Romantic", "Celebration"]
  },
  {
    id: "ds2",
    name: "Pistachio & Saffron Milk Cake",
    category: "Desserts",
    price: 340,
    prepTime: 5,
    rating: 4.88,
    reviewsCount: 280,
    calories: "380 kcal",
    tag: "Must Try",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80",
    description: "Feather-light sponge soaked in three evaporated milk infusions enriched with Iranian saffron and toasted Persian pistachios.",
    moodTags: ["Happy", "Sweet Craving", "Family"]
  }
];

export const CUSTOMER_REVIEWS = [
  {
    id: "r1",
    name: "Tanvir Hasan",
    role: "Tech Lead & Food Enthusiast",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    date: "Yesterday",
    table: "Table #4",
    orderedDish: "Truffle Glazed Wagyu Slider",
    dishPhoto: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80",
    comment: "যে কোনো রেস্টুরেন্টে ওয়েটারের জন্য বসে থাকতে ভালো লাগে না। BiteIQ-তে এসে কিউআর স্ক্যান করে অর্ডার করলাম, ১৮ মিনিটে ওয়াগিউ স্লাইডার টেবিলে হাজির! জুসি অ্যান্ড পারফেক্ট টেস্ট!"
  },
  {
    id: "r2",
    name: "Sabrina Rahman",
    role: "Product Designer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    date: "3 days ago",
    table: "Table #2",
    orderedDish: "Calm Serenity Chamomile Tea",
    dishPhoto: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80",
    comment: "অফিসের কাজের পর মারাত্মক মাথা ব্যথা ছিল। Mood AI-তে লিখলাম, সাথে সাথে ক্যামোমাইল হানি এলিক্সির সাজেস্ট করল। আধা ঘণ্টার মধ্যে আমি একদম রিলাক্সড ও ফ্রেশ!"
  },
  {
    id: "r3",
    name: "Abrar Chowdhury",
    role: "Founder & CEO",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    date: "1 week ago",
    table: "Table #8",
    orderedDish: "Fire-Roasted Peri Peri Chicken",
    dishPhoto: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=400&q=80",
    comment: "ওয়েটার ডাকার ঝামেলা নেই, বিলের জন্য দাঁড়িয়ে থাকা নেই। খাবার শেষে মোবাইল ব্যাংকিং দিয়ে পে করে জাস্ট বের হয়ে গেলাম। কনসেপ্টটা সত্যিকার অর্থেই প্রিমিয়াম।"
  }
];
