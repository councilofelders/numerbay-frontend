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

export type DeleteFavoriteParams = {
  productId: string | number;
};

export type DeleteFavoriteResponse = {
  id: number;
  user_id: number;
  product_id: number;
  [key: string]: any;
};

// Keep the original function signature for backward compatibility
export default async function deleteFavorite(
  context: Context, 
  params: DeleteFavoriteParams, 
  customQuery?: any
): Promise<DeleteFavoriteResponse> {
  // Create URL object containing full endpoint URL
  const url = new URL('favorites/', context.config.api.url);
  const token = context.config.auth.onTokenRead();

  // Prepare payload
  const payload = {
    // eslint-disable-next-line camelcase
    product_id: Number(params.productId)
  };

  try {
    // Use axios to send a DELETE request
    const { data } = await context.client.delete(url.href, {
      data: payload, 
      ...authHeaders(token)
    });
    
    // Return data from the API
    return data;
  } catch (error) {
    console.error('Error deleting favorite:', error);
    if (error.response) {
      error.response.data.error = error.response.status;
      return error.response.data;
    }
    throw error;
  }
}

