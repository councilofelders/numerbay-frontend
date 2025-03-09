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

export type DeleteArtifactParams = {
  productId: number | string;
  artifactId: number | string;
};

export type DeleteArtifactResponse = {
  success: boolean;
  [key: string]: any;
};

// Keep the original function signature for backward compatibility
export default async function deleteArtifact(
  context: Context, 
  params: DeleteArtifactParams, 
  customQuery?: any
): Promise<DeleteArtifactResponse> {
  // Create URL object containing full endpoint URL
  const url = new URL(`products/${params.productId}/artifacts/${params.artifactId}`, context.config.api.url);
  const token = context.config.auth.onTokenRead();

  try {
    // Use axios to send a DELETE request
    const { data } = await context.client.delete(url.href, authHeaders(token));
    
    // Return data from the API
    return data;
  } catch (error) {
    console.error('Error deleting artifact:', error);
    if (error.response) {
      error.response.data.error = error.response.status;
      return error.response.data;
    }
    throw error;
  }
}
