import React from 'react';
import Watchlist from "@/components/dashboard/Watchlist";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { getWatchlistSymbolsByEmail } from "@/lib/actions/watchlist.actions";
import { getStockQuotes, getStockProfiles } from "@/lib/actions/finnhub.actions";
import { redirect } from "next/navigation";

export default async function WatchlistPage() {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) redirect('/sign-in');

    // Fetch user's watchlist symbols
    const userEmail = session?.user?.email || '';
    const watchlistSymbols = await getWatchlistSymbolsByEmail(userEmail);

    // Fetch watchlist data
    let watchlistData: any[] = [];
    if (watchlistSymbols.length > 0) {
        const [quotes, profiles] = await Promise.all([
            getStockQuotes(watchlistSymbols),
            getStockProfiles(watchlistSymbols)
        ]);

        watchlistData = watchlistSymbols.map(sym => ({
            symbol: sym,
            company: profiles[sym]?.name || sym,
            price: quotes[sym]?.price,
            change: quotes[sym]?.change,
            percentChange: quotes[sym]?.percentChange,
            logo: profiles[sym]?.logo
        }));
    }

    return (
        <div className="w-full h-full flex flex-col gap-6">
            <div className="w-full">
                <Watchlist initialWatchlist={watchlistData} email={userEmail} showAll={true} />
            </div>
        </div>
    );
}
