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

export type GetArtifactDownloadUrlParams = {
  productId: number | string;
  artifactId: number | string;
};

export type GetArtifactDownloadUrlResponse = {
  url: string;
  [key: string]: any;
};

// Keep the original function signature for backward compatibility
export default async function getArtifactDownloadUrl(
  context: Context, 
  params: GetArtifactDownloadUrlParams, 
  customQuery?: any
): Promise<GetArtifactDownloadUrlResponse> {
  // Create URL object containing full endpoint URL
  const url = new URL(`products/${params.productId}/artifacts/${params.artifactId}/generate-download-url`, context.config.api.url);
  const token = context.config.auth.onTokenRead();

  try {
    // Use axios to send a GET request
    const { data } = await context.client.get(url.href, authHeaders(token));
    
    // Return data from the API
    return data;
  } catch (error) {
    console.error('Error getting artifact download URL:', error);
    if (error.response) {
      error.response.data.error = error.response.status;
      return error.response.data;
    }
    throw error;
  }
}

