'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { formatTimeAgo } from '@/lib/utils';
import { cn } from '@/lib/utils'; // Assuming cn is available here, though not strictly used in the extracted snippet usually.

interface NewsItemProps {
    item: MarketNewsArticle;
    className?: string; // Add className prop for flexibility
}

const NewsItem = ({ item, className }: NewsItemProps) => {
    const [imgError, setImgError] = useState(false);

    return (
        <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn("flex justify-between gap-4 group cursor-pointer border-b border-gray-700/50 pb-4 last:border-0", className)}
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

export default NewsItem;
