import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const token = process.env.FINNHUB_API_KEY || process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

async function checkNewsImages() {
    if (!token) {
        console.error('FINNHUB_API_KEY not found');
        process.exit(1);
    }

    try {
        console.log('Fetching general news from Finnhub...');
        const res = await fetch(`https://finnhub.io/api/v1/news?category=general&token=${token}`);
        const news = await res.json();

        console.log(`\nAnalyzing ${news.length} general news items...`);
        news.slice(0, 20).forEach((item, i) => {
            console.log(`[${i}] ${item.source} - ${item.headline.substring(0, 40)}...`);
            console.log(`    Image: ${item.image}`);
        });

        // Check some company news for major symbols
        const symbols = ['AAPL', 'TSLA', 'NVDA', 'AMZN'];
        for (const symbol of symbols) {
            console.log(`\nFetching company news for ${symbol}...`);
            const cRes = await fetch(`https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=2026-01-20&to=2026-01-29&token=${token}`);
            const cNews = await cRes.json();
            console.log(`Found ${cNews.length} items for ${symbol}. Top 3:`);
            cNews.slice(0, 3).forEach((item, i) => {
                console.log(`    [${i}] ${item.source} - ${item.headline.substring(0, 40)}...`);
                console.log(`        Image: ${item.image}`);
            });
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit(0);
    }
}

checkNewsImages();
