'use client';

import { useState, useMemo } from 'react';
import TradingViewWidget from '@/components/TradingViewWidget';
import { cn } from '@/lib/utils';
import { CANDLE_CHART_WIDGET_CONFIG } from '@/lib/constants';

const TABS = ['Indices', 'Stocks', 'Crypto', 'Forex', 'Bonds', 'ETFs'];

const DEFAULT_SYMBOLS: Record<string, string> = {
    'Indices': 'BATS:SPY',
    'Stocks': 'NASDAQ:AAPL',
    'Crypto': 'BINANCE:BTCUSDT',
    'Forex': 'FX:EURUSD',
    'Bonds': 'BATS:TLT',
    'ETFs': 'BATS:SPY',
};

// Summary Cards Data (Mock or Config for Widgets)
const SUMMARY_INDICES = [
    { name: 'S&P 500', symbol: 'BATS:SPY' },
    { name: 'Nasdaq 100', symbol: 'BATS:QQQ' },
    { name: 'Dow 30', symbol: 'BATS:DIA' },
];

const MarketSummary = () => {
    const [activeTab, setActiveTab] = useState('Indices');
    const [selectedSymbol, setSelectedSymbol] = useState(DEFAULT_SYMBOLS['Indices']);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        setSelectedSymbol(DEFAULT_SYMBOLS[tab] || DEFAULT_SYMBOLS['Indices']);
    };

    const mainChartConfig = useMemo(() => ({
        symbols: [[selectedSymbol, selectedSymbol]],
        chartOnly: false,
        width: "100%",
        height: 300,
        locale: "en",
        colorTheme: "dark",
        autosize: true,
        showVolume: false,
        hideDateRanges: false,
        scalePosition: "right",
        scaleMode: "Normal",
        fontFamily: "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
        fontSize: "10",
        noTimeScale: false,
        valuesTracking: "1",
        changeMode: "price-and-percent",
        chartType: "area",
        lineColor: "#2962FF",
        bottomColor: "rgba(41, 98, 255, 0)",
        topColor: "rgba(41, 98, 255, 0.3)",
        backgroundColor: "rgba(19, 23, 34, 0)",
        gridLineColor: "rgba(240, 243, 250, 0.06)",
        fontColor: "#787B86",
        range: "12M",
        hide_side_toolbar: false,
        allow_symbol_change: false,
        details: true,
        calendar: false,
    }), [selectedSymbol]);

    const scriptUrlPrefix = `https://s3.tradingview.com/external-embedding/embed-widget-`;

    return (
        <div className="flex flex-col gap-6 w-full h-full bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-100">Market Summary</h3>
            </div>
            {/* Header: Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-gray-700 pb-4">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => handleTabChange(tab)}
                        className={cn(
                            "px-4 py-2 text-sm font-medium rounded-lg transition-all",
                            activeTab === tab
                                ? "bg-gray-700 text-teal-400 border border-gray-600 shadow-sm"
                                : "text-gray-400 hover:text-gray-100 hover:bg-gray-700/50"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Main Chart */}
            <div className="flex-1 min-h-[300px] w-full bg-gray-900 rounded-lg overflow-hidden border border-gray-700 relative">
                <TradingViewWidget
                    key={activeTab} // Force remount on tab change to ensure clean transition
                    scriptUrl={`${scriptUrlPrefix}symbol-overview.js`}
                    height={300}
                    config={mainChartConfig}
                />
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                {SUMMARY_INDICES.map((index) => (
                    <div key={index.symbol} className="h-[100px] bg-gray-900 border border-gray-700 rounded-lg overflow-hidden relative">
                        <TradingViewWidget
                            scriptUrl={`${scriptUrlPrefix}mini-symbol-overview.js`}
                            height={100}
                            config={{
                                symbol: index.symbol,
                                width: "100%",
                                height: 100,
                                locale: "en",
                                dateRange: "12M",
                                colorTheme: "dark",
                                isTransparent: true,
                                // customize to minimal
                                autosize: true,
                                largeChartUrl: ""
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MarketSummary;
