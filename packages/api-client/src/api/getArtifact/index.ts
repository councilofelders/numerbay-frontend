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

export type GetArtifactParams = {
  productId: number | string;
};

export type Artifact = {
  id: number;
  filename: string;
  filesize: number;
  type: string;
  created_at: string;
  [key: string]: any;
};

export type GetArtifactResponse = Artifact[];

// Keep the original function signature for backward compatibility
export default async function getArtifact(
  context: Context, 
  params: GetArtifactParams, 
  customQuery?: any
): Promise<GetArtifactResponse> {
  // Create URL object containing full endpoint URL
  const url = new URL(`products/${params.productId}/artifacts`, context.config.api.url);
  const token = context.config.auth.onTokenRead();

  try {
    // Use axios to send a GET request
    const { data } = await context.client.get(url.href, authHeaders(token));
    
    // Return data from the API
    return data;
  } catch (error) {
    console.error('Error getting artifacts:', error);
    if (error.response) {
      error.response.data.error = error.response.status;
      return error.response.data;
    }
    throw error;
  }
}

