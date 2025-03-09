import { AxiosInstance } from 'axios';

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

export type GetNumeraiModelInfoParams = {
  tournament: string | number;
  modelName: string;
};

export type GetNumeraiModelInfoResponse = {
  [key: string]: any;
};

// Keep the original function signature for backward compatibility
export default async function getNumeraiModelInfo(
  context: Context, 
  params: GetNumeraiModelInfoParams, 
  customQuery?: any
): Promise<GetNumeraiModelInfoResponse> {
  // Create URL object containing full endpoint URL
  const url = new URL(`numerai/${params.tournament}/${params.modelName}`, context.config.api.url);

  try {
    // Use axios to send a GET request
    const { data } = await context.client.get(url.href);
    
    // Return data from the API
    return data;
  } catch (error) {
    console.error('Error fetching Numerai model info:', error);
    if (error.response) {
      error.response.data.error = error.response.status;
      return error.response.data;
    }
    throw error;
  }
}

