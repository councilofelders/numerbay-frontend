import { AxiosInstance } from 'axios';
import { Review } from '../../types';

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

export type GetReviewParams = {
  id?: string | number;
  productId?: string | number;
  limit?: number;
  offset?: number;
  filters?: Record<string, any>;
  term?: string;
  sort?: any;
};

export type GetReviewResponse = {
  data: Review[];
  total: number;
};

// Keep the original function signature for backward compatibility
export default async function getReview(
  context: Context, 
  params: GetReviewParams, 
  customQuery?: any
): Promise<GetReviewResponse> {
  // Create URL object containing full endpoint URL
  const url = new URL('reviews/search', context.config.api.url);

  const payload = {
    id: params.id,
    // eslint-disable-next-line camelcase
    product_id: params.productId,
    limit: params.limit,
    skip: params.offset,
    filters: params.filters,
    term: params.term,
    sort: params.sort
  };

  try {
    // Use axios to send a POST request
    const { data } = await context.client.post(url.href, payload);

    // Return data from the API
    return data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
}

