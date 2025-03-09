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

export type GetArtifactUploadUrlParams = {
  productId: number | string;
  filename: string;
  filesize: string | number;
  type: string;
};

export type GetArtifactUploadUrlResponse = {
  url: string;
  fields: Record<string, string>;
  [key: string]: any;
};

// Keep the original function signature for backward compatibility
export default async function getArtifactUploadUrl(
  context: Context, 
  params: GetArtifactUploadUrlParams, 
  customQuery?: any
): Promise<GetArtifactUploadUrlResponse> {
  // Create URL object containing full endpoint URL
  const url = new URL(`products/${params.productId}/artifacts/generate-upload-url`, context.config.api.url);
  const token = context.config.auth.onTokenRead();

  const postParams = new URLSearchParams();
  postParams.append('filename', params.filename);
  postParams.append('filesize', params.filesize.toString());
  postParams.append('type', params.type);

  try {
    // Use axios to send a POST request
    const { data } = await context.client.post(url.href, postParams, authHeaders(token));
    
    // Return data from the API
    return data;
  } catch (error) {
    console.error('Error getting artifact upload URL:', error);
    if (error.response) {
      error.response.data.error = error.response.status;
      return error.response.data;
    }
    throw error;
  }
}

