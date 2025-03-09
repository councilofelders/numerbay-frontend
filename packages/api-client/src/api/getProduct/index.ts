import { AxiosInstance } from 'axios';
import { ProductVariant } from '../../types';
import { authHeaders, safeTokenRead } from '../utils';

// Define the types needed for the implementation
type ApiConfig = {
  api: {
    url: string;
  };
  auth?: {
    onTokenRead: () => string | null;
  };
};

type Context = {
  client: AxiosInstance;
  config: ApiConfig;
};

export type GetProductParams = {
  id?: string | number;
  catId?: number;
  limit?: number;
  offset?: number;
  filters?: Record<string, any>;
  term?: string;
  name?: string;
  categorySlug?: string;
  sort?: any;
  coupon?: string;
  qty?: number;
  rounds?: number;
};

export type GetProductResponse = {
  data: ProductVariant[];
  total: number;
};

// Keep the original function signature for backward compatibility
export default async function getProduct(
  context: Context,
  params: GetProductParams,
  customQuery?: any
): Promise<GetProductResponse> {
  // console.log('[DEBUG] getProduct - Function called with params:', JSON.stringify(params));

  // Create URL object containing full endpoint URL
  const token = safeTokenRead(context);
  // console.log('[DEBUG] getProduct - Token available:', !!token);

  const url = new URL(token ? 'products/search-authenticated' : 'products/search', context.config.api.url);
  // console.log('[DEBUG] getProduct - Request URL:', url.href);

  const payload = {
    id: params.id,
    // eslint-disable-next-line camelcase
    category_id: params.catId,
    limit: params.limit,
    skip: params.offset,
    filters: params.filters,
    term: params.term,
    name: params.name,
    // eslint-disable-next-line camelcase
    category_slug: params.categorySlug,
    sort: params.sort,
    coupon: params.coupon,
    qty: params.qty,
    rounds: params.rounds,
  };
  // console.log('[DEBUG] getProduct - Request payload:', JSON.stringify(payload));

  try {
    // Use axios to send a POST request
    // console.log('[DEBUG] getProduct - Sending POST request with config:', JSON.stringify(token ? authHeaders(token) : {}));
    const { data } = await context.client.post(url.href, payload, token ? authHeaders(token) : {}).catch(async (error) => {
      // console.log('[DEBUG] getProduct - POST request failed:', error.message);
      // console.log('[DEBUG] getProduct - Error details:', error.response ? JSON.stringify(error.response.data) : 'No response data');

      if (token) {
        // retry without token
        // console.log('[DEBUG] getProduct - Retrying without token');
        const retryUrl = new URL('products/search', context.config.api.url);
        // console.log('[DEBUG] getProduct - Retry URL:', retryUrl.href);
        return await context.client.post(retryUrl.href, payload);
      }

      throw error;
    });

    // console.log('[DEBUG] getProduct - Response received:', data ? 'Data present' : 'Empty data');
    // console.log('[DEBUG] getProduct - Response data structure:', data ? Object.keys(data) : 'No keys');

    if (data && data.data) {
      // console.log('[DEBUG] getProduct - Number of products:', data.data.length);
    }

    // Return data from the API
    return data;
  } catch (error) {
    // console.error('[DEBUG] getProduct - Unhandled error:', error.message);
    // console.error('[DEBUG] getProduct - Error stack:', error.stack);
    throw error;
  }
} 