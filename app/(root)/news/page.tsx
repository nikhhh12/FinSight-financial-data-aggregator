'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { getNews } from '@/lib/actions/finnhub.actions';
import NewsItem from '@/components/NewsItem';

const TABS = ['Top stories', 'Local market', 'World markets'];

const NewsPage = () => {
    const [activeTab, setActiveTab] = useState('Top stories');
    const [news, setNews] = useState<MarketNewsArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                let symbols: string[] | undefined;
                if (activeTab === 'Top stories') {
                    symbols = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN', 'GOOGL', 'META'];
                } else if (activeTab === 'World markets') {
                    symbols = ['SPY', 'QQQ', 'IWM', 'EEM', 'GLD', 'SLV', 'DIA'];
                }

                const data = await getNews(symbols, activeTab);
                setNews(data || []);
            } catch (error) {
                console.error("Failed to fetch news:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [activeTab]);

    return (
        <div className="w-full h-full flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-gray-100">Financial News</h1>

            <div className="flex flex-col gap-4 w-full bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-sm min-h-[600px]">
                {/* Tabs */}
                <div className="flex gap-4 border-b border-gray-700 pb-2 mb-4 overflow-x-auto scrollbar-hide">
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "pb-2 text-sm font-medium transition-colors whitespace-nowrap border-b-2",
                                activeTab === tab
                                    ? "text-teal-400 border-teal-400"
                                    : "text-gray-500 border-transparent hover:text-gray-300"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* News List */}
                <div className="flex-1 space-y-6">
                    {loading ? (
                        <div className="flex flex-col gap-6 animate-pulse">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="flex justify-between gap-4">
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 bg-gray-700 rounded w-1/4" />
                                        <div className="h-6 bg-gray-700 rounded w-full" />
                                        <div className="h-6 bg-gray-700 rounded w-3/4" />
                                    </div>
                                    <div className="w-24 h-24 bg-gray-700 rounded-lg shrink-0" />
                                </div>
                            ))}
                        </div>
                    ) : news.length > 0 ? (
                        news.map((item) => (
                            <NewsItem key={item.id} item={item} />
                        ))
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500 py-10">
                            No recent news found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewsPage;
