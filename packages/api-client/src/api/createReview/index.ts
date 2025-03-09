import { AxiosInstance } from 'axios';
import { authHeaders } from '../utils';

// Define the types needed for the implementation
type ApiConfig = {
  api: {
    url: string;
  };
  auth: {
    onTokenRead: () => string | null;
  };
};

type Context = {
  client: AxiosInstance;
  config: ApiConfig;
};

export type CreateReviewParams = {
  productId: string | number;
  ratings: Array<{
    value_id: string | number;
  }>;
  text?: string;
};

export type CreateReviewResponse = {
  id: number;
  created_at: string;
  round_tournament: number;
  rating: number;
  text?: string;
  is_verified_order: boolean;
  reviewer_id: number;
  product_id: number;
  [key: string]: any;
};

// Keep the original function signature for backward compatibility
export default async function createReview(
  context: Context, 
  params: CreateReviewParams, 
  customQuery?: any
): Promise<CreateReviewResponse> {
  // Create URL object containing full endpoint URL
  const url = new URL('reviews/', context.config.api.url);
  const token = context.config.auth.onTokenRead();

  // Prepare payload
  const payload = {
    // eslint-disable-next-line camelcase
    product_id: Number(params.productId),
    rating: Number(params.ratings[0].value_id),
    text: params.text
  };

  try {
    // Use axios to send a POST request
    const { data } = await context.client.post(url.href, payload, authHeaders(token));
    
    // Return data from the API
    return data;
  } catch (error) {
    console.error('Error creating review:', error);
    if (error.response) {
      error.response.data.error = error.response.status;
      return error.response.data;
    }
    throw error;
  }
}

