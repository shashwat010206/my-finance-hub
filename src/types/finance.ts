export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: number;
}

export const INCOME_CATEGORIES = [
  '💰 Salary',
  '💼 Freelance',
  '📈 Investment',
  '🎁 Gift',
  '🔄 Refund',
  '📦 Other Income',
];

export const EXPENSE_CATEGORIES = [
  '🍔 Food & Dining',
  '🚗 Transport',
  '🛒 Shopping',
  '🎬 Entertainment',
  '💡 Bills & Utilities',
  '🏠 Rent',
  '💊 Health',
  '📚 Education',
  '✈️ Travel',
  '📦 Other Expense',
];

export const MEME_QUOTES = [
  "Paisa hi paisa hoga! 💸",
  "Stonks only go up! 📈",
  "Apna time aayega! ⏰",
  "Middle class mentality on! 🧠",
  "Thoda sa paisa, bohot sara sapna! 💭",
  "Budget tight hai boss! 🤏",
  "Savings go brrrrr! 🚀",
  "Inflation: I'm about to end this man's whole career 😤",
  "Me: *spends money* Also me: why am I poor? 🤡",
  "Money can't buy happiness, but poverty can't buy anything! 💀",
];
