export interface PolymarketMarket {
  question: string;
  url: string;
}

const API_ENDPOINT = 'https://gamma-api.polymarket.com/query';

const queryInput = {
  "0": {
    "json": {
      "json_filter": {
        "bool": {
          "must": [
            { "term": { "active": true } },
            { "term": { "closed": false } },
            { "range": { "volume": { "gt": "5000" } } }
          ],
          "must_not": [
            { "term": { "question": "[deprecated]" } }
          ]
        }
      },
      "sort_by": "volume",
      "is_v2": true,
      "page_size": 25
    }
  }
};


export async function fetchTrendingMarkets(): Promise<PolymarketMarket[]> {
  try {
    const encodedInput = encodeURIComponent(JSON.stringify(queryInput));
    const url = `${API_ENDPOINT}?batch=1&input=${encodedInput}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Polymarket API returned status ${response.status}`);
    }

    const json = await response.json();
    const markets = json?.[0]?.result?.data?.json?.data;

    if (!Array.isArray(markets)) {
      throw new Error('Unexpected response format from Polymarket API');
    }

    const binaryMarkets = markets
      .filter((market: any) =>
        Array.isArray(market.outcomes) &&
        market.outcomes.length === 2 &&
        market.outcomes.includes('Yes') &&
        market.outcomes.includes('No')
      )
      .map((market: any) => ({
        question: market.question,
        url: `https://polymarket.com/event/${market.slug}`,
      }));

    return binaryMarkets.slice(0, 5);
  } catch (error) {
    console.error("Failed to fetch trending markets:", error);
    return [];
  }
}
