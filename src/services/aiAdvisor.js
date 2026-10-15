import { MENU_ITEMS } from '../data/restaurantData';

/**
 * MoodBite AI Recommendation Engine
 * Analyzes natural language inputs (mood, physiological state, cravings)
 * and returns scientifically backed food/beverage suggestions with empathetic reasoning.
 */
export async function getAIMoodRecommendation(userQuery, userMood = null) {
  // Simulate thinking delay for natural AI feel
  await new Promise((resolve) => setTimeout(resolve, 900));

  const query = (userQuery + ' ' + (userMood || '')).toLowerCase();

  // Condition 1: Headache, Migraine, Mental Stress, Fatigue
  if (
    query.includes('মাথা ব্যথা') ||
    query.includes('headache') ||
    query.includes('migraine') ||
    query.includes('টেনশন') ||
    query.includes('stress') ||
    query.includes('cluttered') ||
    query.includes('শান্ত') ||
    query.includes('relax')
  ) {
    const recommendedItem = MENU_ITEMS.find((i) => i.id === 'd1') || MENU_ITEMS[4];
    const alternativeItem = MENU_ITEMS.find((i) => i.id === 'd4');

    return {
      title: "Tension Relief & Neuro-Calming Protocol",
      analysis:
        "মাথা ব্যথা বা স্ট্রেসের সময় অতিরিক্ত কড়া ক্যাফেইন নার্ভাস সিস্টেমকে আরও উত্তেজিত করতে পারে। বৈজ্ঞানিকভাবে ক্যামোমাইল ও কাঁচা আদা রক্ত সঞ্চালন স্বাভাবিক করে এবং ব্রেন টেনশন দ্রুত প্রশমিত করে।",
      advice:
        "আপনার জন্য কফির চেয়ে ভেষজ আদা ও ক্যামোমাইল মধু এলিক্সির সবথেকে কার্যকরী হবে। এর সাথে হালকা খাবার গ্রহণ করতে পারেন।",
      suggestedItems: [recommendedItem, alternativeItem].filter(Boolean),
      recommendedItemId: recommendedItem.id,
      tone: "empowering"
    };
  }

  // Condition 2: Sleepy, Need Energy, Coding, Deadline, Tired
  if (
    query.includes('ঘুম') ||
    query.includes('sleepy') ||
    query.includes('energy') ||
    query.includes('exhausted') ||
    query.includes('ক্লান্ত') ||
    query.includes('কাজ') ||
    query.includes('focus') ||
    query.includes('কফি') ||
    query.includes('coffee')
  ) {
    const recommendedItem = MENU_ITEMS.find((i) => i.id === 'd2');
    const snackItem = MENU_ITEMS.find((i) => i.id === 'm1');

    return {
      title: "Cognitive Spark & High-Focus Matrix",
      analysis:
        "ক্লান্তি এবং কাজের মাঝে এনার্জি ড্রপ কাটাতে নাইট্রোজেন সমৃদ্ধ কোল্ড ব্রিউ মেটাবলিজম বৃদ্ধি করে এবং ক্যাফেইন ক্র্যাশ ছাড়া দীর্ঘস্থায়ী এনার্জি প্রদান করে।",
      advice:
        "নাইট্রো কোল্ড ব্রিউ এর সাথে প্রোটিন সমৃদ্ধ খাবার নিন যা আপনার ব্লাড সুগার স্পাইক হতে দেবে না।",
      suggestedItems: [recommendedItem, snackItem].filter(Boolean),
      recommendedItemId: recommendedItem?.id,
      tone: "energetic"
    };
  }

  // Condition 3: Sad, Bad day, Broken, Need sweet comfort
  if (
    query.includes('মন খারাপ') ||
    query.includes('sad') ||
    query.includes('depressed') ||
    query.includes('lonely') ||
    query.includes('sweet') ||
    query.includes('মিষ্টি')
  ) {
    const recommendedItem = MENU_ITEMS.find((i) => i.id === 'ds1');
    const teaItem = MENU_ITEMS.find((i) => i.id === 'd4');

    return {
      title: "Endorphin & Mood Elevation Booster",
      analysis:
        "মন খারাপের মুহূর্তে ডার্ক চকলেট ব্রেইনে সেরোটোনিন ও এন্ডোরফিন হরমোন নিঃসরণে সহায়তা করে, যা তাৎক্ষণিকভাবে মানসিক বিষণ্ণতা হালকা করে।",
      advice:
        "আমাদের ওয়ার্ম বেলজিয়ান ডার্ক চকলেট ডোম এবং এক কাপ খাঁটি মসলা চা আপনার মেজাজকে মুহূর্তেই প্রফুল্ল করে তুলবে।",
      suggestedItems: [recommendedItem, teaItem].filter(Boolean),
      recommendedItemId: recommendedItem?.id,
      tone: "comforting"
    };
  }

  // Condition 4: Very Hungry, Celebration, Food craving, Party
  if (
    query.includes('ক্ষুধা') ||
    query.includes('hungry') ||
    query.includes('starving') ||
    query.includes('heavy') ||
    query.includes('পার্টি') ||
    query.includes('taste') ||
    query.includes('spicy') ||
    query.includes('ঝাল')
  ) {
    const recommendedItem = MENU_ITEMS.find((i) => i.id === 'm3') || MENU_ITEMS[0];
    const starterItem = MENU_ITEMS.find((i) => i.id === 's1');

    return {
      title: "Savory Feast & Palate Satisfaction",
      analysis:
        "তীব্র ক্ষুধা এবং ঝাল স্বাদের প্রতি তৃষ্ণা মেটাতে হাই-প্রোটিন রোস্টেড আইটেম ও মুচমুচে স্টার্টার নিখুঁত কম্বিনেশন।",
      advice:
        "ফায়ার রোস্টেড পেরি পেরি চিকেনের সাথে ক্রিস্পি কালামারি আপনার ক্ষুধা মেটাতে পুরোপুরি উপযুক্ত।",
      suggestedItems: [recommendedItem, starterItem].filter(Boolean),
      recommendedItemId: recommendedItem?.id,
      tone: "delighted"
    };
  }

  // Fallback: General balanced wellness recommendation
  const generalItem1 = MENU_ITEMS.find((i) => i.id === 'm2') || MENU_ITEMS[1];
  const generalItem2 = MENU_ITEMS.find((i) => i.id === 'd3') || MENU_ITEMS[6];

  return {
    title: "Nutrient-Dense Harmonized Suggestion",
    analysis:
      "আপনার বর্তমান চাহিদা অনুযায়ী আমরা একটি ব্যালেন্সড হাই-নিউট্রিশন মিল সাজেস্ট করছি যা ফ্রেশ এবং হজমে সহজ।",
    advice:
      "আমাদের শেফ রিকমেন্ডেড স্মোকড সালমন টার্টিনের সাথে রিফ্রেশিং ম্যাচা ড্রিংক ট্রাই করুন। এটি হালকা ও শরীরে সতেজতা দেয়।",
    suggestedItems: [generalItem1, generalItem2].filter(Boolean),
    recommendedItemId: generalItem1?.id,
    tone: "balanced"
  };
}
