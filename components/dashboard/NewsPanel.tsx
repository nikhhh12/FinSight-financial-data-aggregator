'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { cn, formatTimeAgo } from '@/lib/utils';
import Image from 'next/image';
import { getNews } from '@/lib/actions/finnhub.actions';

const TABS = ['Top stories', 'Local market', 'World markets'];

const NewsPanel = () => {
    const [activeTab, setActiveTab] = useState('Top stories');
    const [news, setNews] = useState<MarketNewsArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                // For 'Top stories' we pass symbols to get more vibrant article-specific news with images
                // For 'World markets' we pass major indices/ETFs to get global macro news
                // For other categories we use the Finnhub news API categories
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
        <div className="flex flex-col gap-4 w-full h-full bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-sm overflow-hidden min-h-[600px]">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-100">Today&apos;s Financial News</h3>
                <Link href="/news" className="text-sm text-teal-400 hover:text-teal-300 flex items-center gap-1 font-medium transition-colors">
                    View all <ArrowUpRight className="h-4 w-4" />
                </Link>
            </div>

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
            <div className="flex-1 overflow-y-auto pr-1 space-y-6 custom-scrollbar">
                {loading ? (
                    <div className="flex flex-col gap-6 animate-pulse">
                        {[1, 2, 3].map(i => (
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
    );
};

const NewsItem = ({ item }: { item: MarketNewsArticle }) => {
    const [imgError, setImgError] = useState(false);

    return (
        <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-between gap-4 group cursor-pointer border-b border-gray-700/50 pb-4 last:border-0"
        >
            <div className="flex flex-col gap-2 flex-1">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-semibold text-gray-400">{item.source}</span>
                    <span>•</span>
                    <span>{formatTimeAgo(item.datetime)}</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-200 group-hover:text-teal-400 transition-colors line-clamp-2 leading-tight">
                    {item.headline}
                </h4>
                {item.related && (
                    <div className="mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-700 text-gray-300 border border-gray-600">
                            {item.related}
                        </span>
                    </div>
                )}
            </div>
            {item.image && !imgError && (
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-900 border border-gray-700 shrink-0 self-center relative">
                    <Image
                        src={item.image}
                        alt={item.headline}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-all duration-300"
                        onError={() => setImgError(true)}
                    />
                </div>
            )}
        </a>
    );
};

export default NewsPanel;
