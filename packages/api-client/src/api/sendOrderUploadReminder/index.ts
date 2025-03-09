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

export type SendOrderUploadReminderParams = {
  orderId: string | number;
};

export type SendOrderUploadReminderResponse = {
  success: boolean;
  message?: string;
  [key: string]: any;
};

// Keep the original function signature for backward compatibility
export default async function sendOrderUploadReminder(
  context: Context, 
  params: SendOrderUploadReminderParams, 
  customQuery?: any
): Promise<SendOrderUploadReminderResponse> {
  // Create URL object containing full endpoint URL
  const url = new URL(`orders/${params.orderId}/upload-reminder`, context.config.api.url);
  const token = context.config.auth.onTokenRead();

  try {
    // Use axios to send a POST request
    const { data } = await context.client.post(url.href, null, authHeaders(token));
    
    // Return data from the API
    return data;
  } catch (error) {
    console.error('Error sending upload reminder:', error);
    if (error.response) {
      error.response.data.error = error.response.status;
      return error.response.data;
    }
    throw error;
  }
}

