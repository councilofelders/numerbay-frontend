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

export type CancelOrderParams = {
  orderId: string | number;
};

export type CancelOrderResponse = {
  success: boolean;
  message?: string;
  [key: string]: any;
};

// Keep the original function signature for backward compatibility
export default async function cancelOrder(
  context: Context, 
  params: CancelOrderParams, 
  customQuery?: any
): Promise<CancelOrderResponse> {
  // Create URL object containing full endpoint URL
  const url = new URL(`orders/${params.orderId}`, context.config.api.url);
  const token = context.config.auth.onTokenRead();

  try {
    // Use axios to send a DELETE request
    const { data } = await context.client.delete(url.href, authHeaders(token));
    
    // Return data from the API
    return data;
  } catch (error) {
    console.error('Error canceling order:', error);
    if (error.response) {
      error.response.data.error = error.response.status;
      return error.response.data;
    }
    throw error;
  }
}

