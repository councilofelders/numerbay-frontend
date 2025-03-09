import { AxiosInstance } from 'axios';

// Define the types needed for the implementation
type ApiConfig = {
  auth: {
    onTokenRemove: () => Promise<void>;
  };
};

type Context = {
  client: AxiosInstance;
  config: ApiConfig;
};

export type LogOutUserParams = Record<string, unknown>;

export type LogOutUserResponse = void;

// Keep the original function signature for backward compatibility
export default async function logOutUser(
  context: Context, 
  params?: LogOutUserParams, 
  customQuery?: any
): Promise<LogOutUserResponse> {
  try {
    await context.config.auth.onTokenRemove();
  } catch (error) {
    console.error('Error logging out user:', error);
    throw error;
  }
}

