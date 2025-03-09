import { AxiosInstance } from 'axios';
import { Order } from '../../types';
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

export type GetOrderParams = {
  role?: string;
  id?: string | number;
  limit?: number;
  offset?: number;
  filters?: Record<string, any>;
  sort?: any;
};

export type GetOrderResponse = {
  data: Order[];
  total: number;
};

// Keep the original function signature for backward compatibility
export default async function getOrder(
  context: Context, 
  params: GetOrderParams, 
  customQuery?: any
): Promise<GetOrderResponse> {
  // Create URL object containing full endpoint URL
  const url = new URL('orders/search', context.config.api.url);
  const token = context.config.auth.onTokenRead();

  const payload = {
    role: params.role,
    id: params.id,
    limit: params.limit,
    skip: params.offset,
    filters: params.filters,
    sort: params.sort
  };

  try {
    // Use axios to send a POST request
    const { data } = await context.client.post(url.href, payload, authHeaders(token));

    // Return data from the API
    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}

