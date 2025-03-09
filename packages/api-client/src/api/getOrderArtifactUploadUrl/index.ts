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

export type GetOrderArtifactUploadUrlParams = {
  orderId: string | number;
  isNumeraiDirect: boolean | string;
  filename: string;
  filesize: string | number;
  type: string;
};

export type GetOrderArtifactUploadUrlResponse = {
  url: string;
  artifactId: number;
  [key: string]: any;
};

// Keep the original function signature for backward compatibility
export default async function getOrderArtifactUploadUrl(
  context: Context, 
  params: GetOrderArtifactUploadUrlParams, 
  customQuery?: any
): Promise<GetOrderArtifactUploadUrlResponse> {
  // Create URL object containing full endpoint URL
  const url = new URL('artifacts/generate-upload-url', context.config.api.url);
  const token = context.config.auth.onTokenRead();

  const postParams = new URLSearchParams();
  postParams.append('order_id', params.orderId.toString());
  postParams.append('is_numerai_direct', params.isNumeraiDirect.toString());
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

