'use server';

import { connectToDatabase } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.model';

// ... existing imports

export async function toggleWatchlist(email: string, symbol: string, company: string): Promise<boolean> {
  if (!email || !symbol) return false;

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');

    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string }>({ email });
    if (!user) throw new Error('User not found');

    const userId = (user.id as string) || String(user._id || '');
    if (!userId) throw new Error('User ID missing');

    const existing = await Watchlist.findOne({ userId, symbol });

    if (existing) {
      await Watchlist.findByIdAndDelete(existing._id);
      return false; // Removed
    } else {
      await Watchlist.create({ userId, symbol, company });
      return true; // Added
    }
  } catch (err) {
    console.error('toggleWatchlist error:', err);
    throw err;
  }
}

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
  // ... existing code

  if (!email) return [];

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');

    // Better Auth stores users in the "user" collection
    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

    if (!user) return [];

    const userId = (user.id as string) || String(user._id || '');
    if (!userId) return [];

    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => String(i.symbol));
  } catch (err) {
    console.error('getWatchlistSymbolsByEmail error:', err);
    return [];
  }
}
