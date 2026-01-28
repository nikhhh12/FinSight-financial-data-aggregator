import MarketSummary from "@/components/dashboard/MarketSummary";
import Watchlist from "@/components/dashboard/Watchlist";
import TopStocksTable from "@/components/dashboard/TopStocksTable";
import NewsPanel from "@/components/dashboard/NewsPanel";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { getWatchlistSymbolsByEmail } from "@/lib/actions/watchlist.actions";
import { getStockQuotes, getStockProfiles, getBasicFinancials } from "@/lib/actions/finnhub.actions";

export default async function Home() {
    const session = await auth.api.getSession({ headers: await headers() });

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

    // Fetch Top Stocks
    const TOP_STOCK_SYMBOLS = [
        'AAPL', 'MSFT', 'NVDA', 'AMZN', 'GOOGL', 'META', 'TSLA', 'BRK.B', 'LLY', 'AVGO',
        'V', 'JPM', 'WMT', 'XOM', 'MA', 'UNH', 'PG', 'COST', 'JNJ', 'HD',
        'MRK', 'ORCL', 'CVX', 'BAC', 'KO'
    ];
    const [topStockQuotes, topStockProfiles, topStockFinancials] = await Promise.all([
        getStockQuotes(TOP_STOCK_SYMBOLS),
        getStockProfiles(TOP_STOCK_SYMBOLS),
        getBasicFinancials(TOP_STOCK_SYMBOLS)
    ]);

    const topStocksData = TOP_STOCK_SYMBOLS.map(sym => ({
        symbol: sym,
        company: topStockProfiles[sym]?.name || sym,
        price: topStockQuotes[sym]?.price || 0,
        change: topStockQuotes[sym]?.percentChange || 0,
        marketCap: topStockProfiles[sym]?.marketCapitalization || 0,
        peRatio: topStockFinancials[sym]?.peNormalizedAnnual || 0,
        logo: topStockProfiles[sym]?.logo
    }));

    return (
        <div className="flex flex-col gap-6">
            {/* Top Row: Market Summary & Watchlist */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 min-h-[400px]">
                    <MarketSummary />
                </div>
                <div className="xl:col-span-1 min-h-[400px]">
                    <Watchlist initialWatchlist={watchlistData} email={userEmail} />
                </div>
            </div>

            {/* Bottom Row: Top Stocks & News */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 min-h-[400px]">
                    <TopStocksTable stocks={topStocksData} />
                </div>
                <div className="xl:col-span-1 min-h-[400px]">
                    <NewsPanel />
                </div>
            </div>
        </div>
    );
}
