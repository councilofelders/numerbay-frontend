import { AxiosInstance } from 'axios';

// Define the types needed for the implementation
type ApiConfig = {
  api: {
    url: string;
  };
};

type Context = {
  client: AxiosInstance;
  config: ApiConfig;
};

export type GetSalesLeaderboardParams = {
  categorySlug?: string;
  limit?: number;
  offset?: number;
};

export type GetSalesLeaderboardResponse = {
  data: any[];
  total: number;
};

// Keep the original function signature for backward compatibility
export default async function getSalesLeaderboard(
  context: Context, 
  params: GetSalesLeaderboardParams, 
  customQuery?: any
): Promise<GetSalesLeaderboardResponse> {
  // Create URL object containing full endpoint URL
  const url = new URL('products/sales-leaderboard', context.config.api.url);

  const payload = {
    // eslint-disable-next-line camelcase
    category_slug: params.categorySlug,
    limit: params.limit,
    skip: params.offset
  };

  try {
    // Use axios to send a POST request
    const { data } = await context.client.post(url.href, payload);

    // Return data from the API
    return data;
  } catch (error) {
    console.error('Error fetching sales leaderboard:', error);
    throw error;
  }
}

