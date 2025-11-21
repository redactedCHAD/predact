
export interface PolymarketMarket {
  question: string;
  url: string;
}

const FALLBACK_MARKETS: PolymarketMarket[] = [
  { question: "Will Donald Trump win the 2024 US Election?", url: "https://polymarket.com/event/presidential-election-winner-2024" },
  { question: "Fed interest rate cut in March 2025?", url: "https://polymarket.com/event/fed-interest-rates-march-2025" },
  { question: "Bitcoin above $100k in 2024?", url: "https://polymarket.com/event/bitcoin-price-2024" },
  { question: "Will TikTok be banned in the US in 2024?", url: "https://polymarket.com/event/tiktok-ban-usa-2024" },
  { question: "GTA VI release date announced in 2024?", url: "https://polymarket.com/event/gta-6-release-date-2024" }
];

const API_ENDPOINT = 'https://gamma-api.polymarket.com/query';

const queryInput = {
  "0": {
    "json": {
      "json_filter": {
        "bool": {
          "must": [
            { "term": { "active": true } },
            { "term": { "closed": false } },
            { "range": { "volume": { "gt": "50000" } } }
          ],
          "must_not": [
            { "term": { "question": "[deprecated]" } }
          ]
        }
      },
      "sort_by": "volume",
      "is_v2": true,
      "page_size": 10
    }
  }
};


export async function fetchTrendingMarkets(): Promise<PolymarketMarket[]> {
  try {
    // Add a timeout to prevent long hangs
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const encodedInput = encodeURIComponent(JSON.stringify(queryInput));
    const url = `${API_ENDPOINT}?batch=1&input=${encodedInput}`;

    const response = await fetch(url, { 
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`Polymarket API error (${response.status}), using fallback data.`);
      return FALLBACK_MARKETS;
    }

    const json = await response.json();
    const markets = json?.[0]?.result?.data?.json?.data;

    if (!Array.isArray(markets)) {
       console.warn("Invalid Polymarket API response format, using fallback data.");
       return FALLBACK_MARKETS;
    }

    const binaryMarkets = markets
      .filter((market: any) =>
        Array.isArray(market.outcomes) &&
        market.outcomes.length === 2 &&
        (market.outcomes.includes('Yes') || market.outcomes.includes('YES')) &&
        (market.outcomes.includes('No') || market.outcomes.includes('NO'))
      )
      .map((market: any) => ({
        question: market.question,
        url: `https://polymarket.com/event/${market.slug}`,
      }));

    return binaryMarkets.length > 0 ? binaryMarkets.slice(0, 5) : FALLBACK_MARKETS;
  } catch (error) {
    console.warn("Failed to fetch trending markets (likely CORS or network), using fallback data.");
    // Return fallback data instead of throwing to prevent UI breakage
    return FALLBACK_MARKETS;
  }
}
