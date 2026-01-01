const QUOTES = [
  "The only way to do great work is to love what you do.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "Believe you can and you're halfway there.",
  "Your time is limited, don't waste it living someone else's life.",
  "Don't watch the clock; do what it does. Keep going.",
  "The future depends on what you do today.",
  "It always seems impossible until it's done.",
  "Quality is not an act, it is a habit.",
  "You don't have to be great to start, but you have to start to be great.",
  "Action is the foundational key to all success.",
];

export const getDailyQuote = (date) => {
  const d = new Date(date);
  const seed = d.getFullYear() * 1000 + d.getMonth() * 100 + d.getDate();
  return QUOTES[seed % QUOTES.length];
};
