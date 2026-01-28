'use client';

import React from 'react';
import WatchlistButton from '@/components/WatchlistButton';
import { toggleWatchlist } from '@/lib/actions/watchlist.actions';
import { toast } from 'sonner';

interface StockWatchlistButtonProps {
    symbol: string;
    company: string;
    isInWatchlist: boolean;
    userEmail: string;
}

const StockWatchlistButton = ({ symbol, company, isInWatchlist, userEmail }: StockWatchlistButtonProps) => {
    const handleWatchlistChange = async (targetSymbol: string, isAdded: boolean, targetCompany?: string) => {
        if (!userEmail) {
            toast.error("Please log in to manage your watchlist");
            return;
        }

        try {
            const success = await toggleWatchlist(userEmail, targetSymbol, targetCompany || targetSymbol);
            if (success) {
                toast.success(`Added ${targetSymbol} to watchlist`);
            } else {
                toast.success(`Removed ${targetSymbol} from watchlist`);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update watchlist");
        }
    };

    return (
        <WatchlistButton
            symbol={symbol}
            company={company}
            isInWatchlist={isInWatchlist}
            onWatchlistChange={handleWatchlistChange}
        />
    );
};

export default StockWatchlistButton;
