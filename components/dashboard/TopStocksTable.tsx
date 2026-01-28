'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface StockData {
    symbol: string;
    company: string;
    price: number;
    change: number; // percent change
    marketCap: number; // in millions usually
    peRatio?: number;
    logo?: string;
}

interface TopStocksTableProps {
    stocks: StockData[];
}

const TopStocksTable = ({ stocks }: TopStocksTableProps) => {
    const [sortConfig, setSortConfig] = useState<{ key: keyof StockData; direction: 'asc' | 'desc' } | null>(null);

    const sortedStocks = React.useMemo(() => {
        let sortableItems = [...stocks];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key] ?? 0;
                const bValue = b[sortConfig.key] ?? 0;
                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [stocks, sortConfig]);

    const requestSort = (key: keyof StockData) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: keyof StockData) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 ml-1" /> : <ArrowDown className="w-3 h-3 ml-1" />;
    };

    const formatMarketCap = (val: number) => {
        if (!val) return '---';
        if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}T`;
        if (val >= 1000) return `$${(val / 1000).toFixed(2)}B`;
        return `$${val.toFixed(2)}M`;
    };

    return (
        <div className="flex flex-col gap-4 w-full h-full bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-100">Today&apos;s Top Stocks</h3>
                <Link href="/markets" className="text-sm text-teal-400 hover:text-teal-300 flex items-center gap-1 font-medium transition-colors">
                    View all <ArrowUpRight className="h-4 w-4" />
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-gray-500 text-sm border-b border-gray-700 font-medium">
                            <th className="py-4 px-2 cursor-pointer hover:text-gray-300 transition-colors" onClick={() => requestSort('company')}>
                                <div className="flex items-center">Company {getSortIcon('company')}</div>
                            </th>
                            <th className="py-4 px-2 cursor-pointer hover:text-gray-300 transition-colors" onClick={() => requestSort('symbol')}>
                                <div className="flex items-center">Symbol {getSortIcon('symbol')}</div>
                            </th>
                            <th className="py-4 px-2 cursor-pointer hover:text-gray-300 transition-colors text-right" onClick={() => requestSort('price')}>
                                <div className="flex items-center justify-end">Price {getSortIcon('price')}</div>
                            </th>
                            <th className="py-4 px-2 cursor-pointer hover:text-gray-300 transition-colors text-right" onClick={() => requestSort('change')}>
                                <div className="flex items-center justify-end">Change {getSortIcon('change')}</div>
                            </th>
                            <th className="py-4 px-2 cursor-pointer hover:text-gray-300 transition-colors text-right" onClick={() => requestSort('marketCap')}>
                                <div className="flex items-center justify-end">Market Cap {getSortIcon('marketCap')}</div>
                            </th>
                            <th className="py-4 px-2 cursor-pointer hover:text-gray-300 transition-colors text-right" onClick={() => requestSort('peRatio')}>
                                <div className="flex items-center justify-end">P/E Ratio {getSortIcon('peRatio')}</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {sortedStocks.map((stock) => (
                            <tr key={stock.symbol} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors text-gray-200 group">
                                <td className="py-4 px-2 font-medium text-gray-100">
                                    {stock.company}
                                </td>
                                <td className="py-4 px-2 text-gray-400 font-medium">
                                    {stock.symbol}
                                </td>
                                <td className="py-4 px-2 text-right font-semibold text-gray-100">
                                    ${stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                                <td className="py-4 px-2 text-right">
                                    <span className={cn(
                                        "font-bold",
                                        stock.change >= 0 ? "text-teal-400" : "text-red-500"
                                    )}>
                                        {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}%
                                    </span>
                                </td>
                                <td className="py-4 px-2 text-right text-gray-200">
                                    {formatMarketCap(stock.marketCap)}
                                </td>
                                <td className="py-4 px-2 text-right text-gray-200">
                                    {stock.peRatio ? stock.peRatio.toFixed(1) : '---'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TopStocksTable;
