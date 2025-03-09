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

export type ValidatePaymentParams = {
  orderId: string | number;
  transactionHash: string;
};

export type ValidatePaymentResponse = {
  success: boolean;
  message?: string;
  [key: string]: any;
};

// Keep the original function signature for backward compatibility
export default async function validatePayment(
  context: Context, 
  params: ValidatePaymentParams, 
  customQuery?: any
): Promise<ValidatePaymentResponse> {
  // Create URL object containing full endpoint URL
  const url = new URL(`orders/${params.orderId}/payment/${params.transactionHash}`, context.config.api.url);
  const token = context.config.auth.onTokenRead();

  try {
    // Use axios to send a POST request
    const { data } = await context.client.post(url.href, null, authHeaders(token));
    
    // Return data from the API
    return data;
  } catch (error) {
    console.error('Error validating payment:', error);
    if (error.response) {
      error.response.data.error = error.response.status;
      return error.response.data;
    }
    throw error;
  }
}

