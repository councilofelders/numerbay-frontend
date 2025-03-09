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

export type TestProductWebhookParams = {
  url: string;
};

export type TestProductWebhookResponse = {
  success: boolean;
  message?: string;
  [key: string]: any;
};

// Keep the original function signature for backward compatibility
export default async function testProductWebhook(
  context: Context, 
  params: TestProductWebhookParams, 
  customQuery?: any
): Promise<TestProductWebhookResponse> {
  // Create URL object containing full endpoint URL
  const url = new URL('utils/test-product-webhook/', context.config.api.url);
  const token = context.config.auth.onTokenRead();

  const payload = {
    url: params.url
  };

  try {
    // Use axios to send a POST request
    const { data } = await context.client.post(url.href, payload, authHeaders(token));
    
    // Return data from the API
    return data;
  } catch (error) {
    console.error('Error testing product webhook:', error);
    if (error.response) {
      error.response.data.error = error.response.status;
      return error.response.data;
    }
    throw error;
  }
}

