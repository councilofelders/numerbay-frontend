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

export type ValidateOrderArtifactUploadParams = {
  artifactId: string | number;
};

export type ValidateOrderArtifactUploadResponse = {
  success: boolean;
  message?: string;
  [key: string]: any;
};

// Keep the original function signature for backward compatibility
export default async function validateOrderArtifactUpload(
  context: Context, 
  params: ValidateOrderArtifactUploadParams, 
  customQuery?: any
): Promise<ValidateOrderArtifactUploadResponse> {
  // Create URL object containing full endpoint URL
  const url = new URL(`artifacts/${params.artifactId}/validate-upload`, context.config.api.url);
  const token = context.config.auth.onTokenRead();

  try {
    // Use axios to send a POST request
    const { data } = await context.client.post(url.href, null, authHeaders(token));
    
    // Return data from the API
    return data;
  } catch (error) {
    console.error('Error validating artifact upload:', error);
    if (error.response) {
      error.response.data.error = error.response.status;
      return error.response.data;
    }
    throw error;
  }
}

