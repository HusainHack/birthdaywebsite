/**
 * config.js - Centralized Data & Configuration for Husaina's Birthday Experience
 */

window.BIRTHDAY_DATA = {
  recipientName: "Husaina",
  defaultTheme: "sakura",

  // 1. Mystery Gifts Data (Two Special Surprises)
  mysteryGifts: [
    {
      id: "gift-1",
      boxClass: "gift-rose",
      ribbonClass: "ribbon-gold",
      tag: "Surprise #1",
      title: "A Heartfelt Birthday Toast",
      icon: "🥂",
      preview: "A golden toast from the heart",
      revealTitle: "A Toast to the Wonderful You",
      revealBody: "“Some people make ordinary days feel a little more special just by being themselves. Today is your day, and I hope it brings you as much happiness as you bring to the people around you. Never stop being the amazing person you are. Happy Birthday!”",
      signoff: "Cheers to you today & always 💗"
    },
    {
      id: "gift-3",
      boxClass: "gift-cream",
      ribbonClass: "ribbon-rosegold",
      tag: "Surprise #2",
      title: "The Friendship Golden Ticket",
      icon: "🎟️",
      preview: "A digital redeemable treat coupon",
      revealTitle: "Official Birthday Treat Coupon",
      revealBody: "THIS TICKET ENTILES HUSAINA TO:\n☕ One cozy café hangout with your favorite beverage ☕\n🍰 Any dessert or pastry of your choice\n💬 Endless conversation with zero rush.\n\n*Valid anytime, anywhere, with no expiration date.*",
      isCoupon: true,
      couponCode: "HUSAINA-BDAY-2026",
      signoff: "Redeemable whenever you feel like catching up! 💖"
    }
  ],

  // 2. Compliments Deck (Non-repeating shuffle bag)
  compliments: [
    "Your warmth has a way of making any room feel calm and welcoming.",
    "You have an effortless grace in how you treat the people around you.",
    "Your genuine laugh is one of the most comforting sounds in the world.",
    "You remember the subtle little details about people that everyone else overlooks.",
    "Your kindness isn't an afterthought—it's woven into who you are.",
    "You stay true to yourself in a world that constantly pushes people to conform.",
    "Being around you feels like taking a deep, peaceful breath after a long day.",
    "You listen with your whole heart, without rushing or judging.",
    "Your quiet resilience and inner strength are deeply inspiring.",
    "You bring an understated brilliance to every conversation you join.",
    "Your thoughtful perspective always sheds light on things in a refreshing way.",
    "You have an exquisite sense of style, beauty, and appreciation for the little things.",
    "The world is undeniably softer, brighter, and kinder because you are in it.",
    "You make friendships feel effortless, secure, and enduring.",
    "Your generosity of spirit inspires those lucky enough to know you.",
    "You face challenges with a calm courage that commands quiet respect.",
    "You know exactly when someone needs a warm word or gentle encouragement.",
    "Your dreams are worth believing in—you have the talent and heart to reach every single one.",
    "You bring peace into chaos and sincerity into a crowded world.",
    "Never forget how profoundly cherished, valued, and loved you truly are."
  ],

  // 3. "Open When..." Letters Data
  openWhenNotes: [
    {
      id: "smile",
      icon: "☀️",
      trigger: "You Need a Smile",
      title: "When You Need an Instant Smile",
      content: "Pause for just a moment. Take a deep breath. Look at how far you've come and how many lives you've quietly brightened along the way. Whatever is on your mind right now, remember that you are capable, you are appreciated, and brighter moments are always just around the corner."
    },
    {
      id: "stress",
      icon: "🌿",
      trigger: "You're Feeling Stressed",
      title: "When the Day Feels Overwhelming",
      content: "You don't have to carry everything all at once. It's okay to put down the heavy burdens, step away, drink a warm cup of tea, and just rest. Give yourself the exact same tenderness and patience that you so effortlessly give to others."
    },
    {
      id: "doubt",
      icon: "💫",
      trigger: "You're Doubting Yourself",
      title: "When Uncertainty Creeps In",
      content: "Doubt is just a cloud passing in front of the sun—it doesn't mean the sun stopped shining. You have handled tough days before, and you came through them with grace. Trust your instincts, trust your timing, and know that you are more than enough."
    },
    {
      id: "laugh",
      icon: "🎈",
      trigger: "You Want a Lighthearted Laugh",
      title: "When You Just Want a Giggle",
      content: "Reminder: Science has proven that eating birthday cake (or having dessert anytime) resets all stress hormones to zero. Also, remember that no matter how chaotic things get, you are doing amazing, and you look fabulous doing it!"
    },
    {
      id: "sleep",
      icon: "🌙",
      trigger: "You Can't Fall Asleep",
      title: "When the Night Feels Restless",
      content: "Let go of today's thoughts. The day is done, and it did the best it could. Close your eyes, sink into the quiet, and let tomorrow take care of itself. Wishing you the softest, most peaceful dreams tonight."
    },
    {
      id: "cherished",
      icon: "💗",
      trigger: "You Need to Feel Cherished",
      title: "When You Need a Gentle Reminder",
      content: "Just in case no one told you today: your existence is a gift to those around you. Thank you for being such a steadfast, wonderful friend. You are valued beyond words, today and every single day."
    }
  ],

  // 4. Starry Night Constellation Wishes (Arranged in the letter 'H' for Husaina)
  starWishes: [
    {
      id: "star-1",
      name: "Star of Serenity",
      pillar: "left-top",
      coord: { x: 28, y: 20 },
      wish: "May your heart always find calm waters, even in the middle of life's busy storms."
    },
    {
      id: "star-2",
      name: "Star of Gentle Courage",
      pillar: "left-mid",
      coord: { x: 28, y: 50 },
      wish: "May you always have the quiet strength to pursue what sets your soul on fire."
    },
    {
      id: "star-3",
      name: "Star of Boundless Love",
      pillar: "left-bottom",
      coord: { x: 28, y: 80 },
      wish: "May you always feel surrounded by people who honor, celebrate, and protect your precious energy."
    },
    {
      id: "star-4",
      name: "Star of Unstoppable Joy",
      pillar: "right-top",
      coord: { x: 72, y: 20 },
      wish: "May your laughter be frequent, deep, and so contagious it fills every room you enter."
    },
    {
      id: "star-5",
      name: "Star of Lifelong Flourishing",
      pillar: "right-mid",
      coord: { x: 72, y: 50 },
      wish: "May everything you pour your heart into blossom into something far greater than you imagined."
    },
    {
      id: "star-6",
      name: "Star of New Adventures",
      pillar: "right-bottom",
      coord: { x: 72, y: 80 },
      wish: "May this year open unexpected doors to places, people, and experiences that delight your soul."
    },
    {
      id: "star-7",
      name: "Star of Pure Magic",
      pillar: "center",
      coord: { x: 50, y: 50 },
      wish: "May your world be touched by everyday miracles and moments that take your breath away."
    }
  ],

  // 5. Digital Keepsake Birthday Card
  birthdayCard: {
    heading: "Happy Birthday, Husaina",
    subtitle: "A Little Keepsake For Your New Year",
    message: "May this year surround you with quiet peace, unexpected wonders, and laughter that feels like home. Thank you for being such an extraordinary, genuine friend whose presence makes the world softer and brighter. Never forget how much you are cherished.",
    signoff: "With warmest wishes & heartfelt joy,\nAlways ✨"
  }
};
