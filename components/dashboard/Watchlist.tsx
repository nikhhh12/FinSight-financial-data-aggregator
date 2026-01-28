'use client';

import React from 'react';
import WatchlistButton from '@/components/WatchlistButton';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { toggleWatchlist } from '@/lib/actions/watchlist.actions';
import { toast } from 'sonner';

interface WatchlistStock {
    symbol: string;
    company: string;
    price?: number;
    change?: number; // Added context
    percentChange?: number;
    logo?: string;
}

interface WatchlistProps {
    initialWatchlist: WatchlistStock[];
    email: string;
}

const Watchlist = ({ initialWatchlist, email }: WatchlistProps) => {
    // Limit to 6 items for the dashboard view to match mockup expectation (3x2)
    const displayItems = initialWatchlist.slice(0, 6);

    const handleWatchlistChange = async (symbol: string, isAdded: boolean, company?: string) => {
        try {
            const success = await toggleWatchlist(email, symbol, company || symbol);
            if (success) {
                toast.success(`Watchlist updated`);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update watchlist");
        }
    }

    return (
        <div className="flex flex-col gap-4 w-full h-full bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-100">Your Watchlist</h3>
                <Link href="/watchlist" className="text-sm text-gray-400 hover:text-gray-100 transition-colors">
                    View all
                </Link>
            </div>

            {displayItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 py-10">
                    <p>Your watchlist is empty.</p>
                    <Link href="/search" className="mt-2 text-teal-400 hover:underline">Add stocks</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayItems.map((item) => (
                        <div key={item.symbol} className="bg-gray-900 border border-gray-700 rounded-xl p-5 flex flex-col gap-4 hover:bg-gray-800/50 transition-all group">
                            <div className="flex items-start justify-between">
                                {/* Square Logo Container */}
                                <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-700 shrink-0">
                                    {item.logo ? (
                                        <Image src={item.logo} alt={item.symbol} width={48} height={48} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-100 font-bold text-lg">
                                            {item.symbol[0]}
                                        </div>
                                    )}
                                </div>
                                <WatchlistButton
                                    symbol={item.symbol}
                                    company={item.company || item.symbol}
                                    isInWatchlist={true}
                                    type="icon"
                                    onWatchlistChange={handleWatchlistChange}
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <h4 className="text-sm text-gray-400 font-medium truncate">
                                    {item.company || item.symbol}
                                </h4>
                                <span className="text-lg font-bold text-gray-100 leading-none">
                                    ${item.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '---'}
                                </span>
                                <div className={`flex items-center gap-1.5 text-sm font-semibold transition-colors mt-0.5 ${(item.percentChange || 0) >= 0 ? 'text-teal-400' : 'text-red-500'
                                    }`}>
                                    <span>
                                        {item.change ? (item.change > 0 ? '+' : '') + item.change.toFixed(1) : '0.0'}
                                        {' '}
                                        ({item.percentChange ? (item.percentChange > 0 ? '+' : '') + item.percentChange.toFixed(2) + '%' : '0.00%'})
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Watchlist;
