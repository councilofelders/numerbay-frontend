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

export type UpdateOrderSubmissionModelParams = {
  orderId: string | number;
  modelId: string | number;
};

export type UpdateOrderSubmissionModelResponse = {
  success: boolean;
  message?: string;
  [key: string]: any;
};

// Keep the original function signature for backward compatibility
export default async function updateOrderSubmissionModel(
  context: Context, 
  params: UpdateOrderSubmissionModelParams, 
  customQuery?: any
): Promise<UpdateOrderSubmissionModelResponse> {
  // Create URL object containing full endpoint URL
  const url = new URL(`orders/${params.orderId}/submission-model`, context.config.api.url);
  const token = context.config.auth.onTokenRead();

  const payload = {
    // eslint-disable-next-line camelcase
    model_id: params.modelId
  };

  try {
    // Use axios to send a POST request
    const { data } = await context.client.post(url.href, payload, authHeaders(token));
    
    // Return data from the API
    return data;
  } catch (error) {
    console.error('Error updating order submission model:', error);
    if (error.response) {
      error.response.data.error = error.response.status;
      return error.response.data;
    }
    throw error;
  }
}

