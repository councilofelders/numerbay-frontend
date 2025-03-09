import { AxiosInstance } from 'axios';
import { Category } from '../../types';

// Define the types needed for the implementation
type ApiConfig = {
  api: {
    url: string;
  };
};

type Context = {
  client: AxiosInstance;
  config: ApiConfig;
};

export type GetCategoryParams = {
  slug?: string;
};

export type GetCategoryResponse = Category;

// Keep the original function signature for backward compatibility
export default async function getCategory(
  context: Context, 
  params: GetCategoryParams, 
  customQuery?: any
): Promise<GetCategoryResponse> {
  // Create URL object containing full endpoint URL
  const url = new URL('categories/', context.config.api.url);

  // Add parameters passed from composable as query strings to the URL
  params.slug && url.searchParams.set('slug', params.slug);

  try {
    // Use axios to send a GET request
    const { data } = await context.client.get(url.href);

    // Return data from the API
    return data;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
}
