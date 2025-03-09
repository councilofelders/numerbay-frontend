import { AxiosInstance } from 'axios';
import { ProductVariant } from '../../types';
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

export type GetFavoriteParams = Record<string, unknown>;

export type GetFavoriteResponse = ProductVariant[];

// Keep the original function signature for backward compatibility
export default async function getFavorite(
  context: Context, 
  params?: GetFavoriteParams, 
  customQuery?: any
): Promise<GetFavoriteResponse> {
  // Create URL object containing full endpoint URL
  const url = new URL('favorites/', context.config.api.url);
  const token = context.config.auth.onTokenRead();

  try {
    // Use axios to send a GET request
    const { data } = await context.client.get(url.href, authHeaders(token));

    // Return data from the API
    return data;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
}

