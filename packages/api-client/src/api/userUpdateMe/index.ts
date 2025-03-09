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

export type UserUpdateMeParams = {
  username?: string;
  password?: string;
  email?: string;
  defaultReceivingWalletAddress?: string;
  socialDiscord?: string;
  socialLinkedIn?: string;
  socialTwitter?: string;
  socialWebsite?: string;
  numeraiApiKeyPublicId?: string;
  numeraiApiKeySecret?: string;
  publicAddress?: string;
  signature?: string;
  publicKeyV2?: string;
  encryptedPrivateKeyV2?: string;
  factor?: string;
};

export type UserUpdateMeResponse = {
  id: number;
  username: string;
  email?: string;
  is_active: boolean;
  [key: string]: any;
};

// Keep the original function signature for backward compatibility
export default async function userUpdateMe(
  context: Context, 
  params: UserUpdateMeParams, 
  customQuery?: any
): Promise<UserUpdateMeResponse> {
  // Create URL object containing full endpoint URL
  const url = new URL('users/me', context.config.api.url);
  const token = context.config.auth.onTokenRead();

  const payload = {
    username: params.username,
    password: params.password,
    email: params.email ? params.email : null,
    // eslint-disable-next-line camelcase
    default_receiving_wallet_address: params.defaultReceivingWalletAddress ? params.defaultReceivingWalletAddress : null,
    // eslint-disable-next-line camelcase
    social_discord: params.socialDiscord,
    // eslint-disable-next-line camelcase
    social_linkedin: params.socialLinkedIn,
    // eslint-disable-next-line camelcase
    social_twitter: params.socialTwitter,
    // eslint-disable-next-line camelcase
    social_website: params.socialWebsite,
    // eslint-disable-next-line camelcase
    numerai_api_key_public_id: params.numeraiApiKeyPublicId ? params.numeraiApiKeyPublicId : null,
    // eslint-disable-next-line camelcase
    numerai_api_key_secret: params.numeraiApiKeySecret ? params.numeraiApiKeySecret : null,
    // eslint-disable-next-line camelcase
    public_address: params.publicAddress,
    signature: params.signature,
    // eslint-disable-next-line camelcase
    public_key: params.publicKeyV2,
    // eslint-disable-next-line camelcase
    encrypted_private_key: params.encryptedPrivateKeyV2,
    factor: params.factor
  };

  try {
    // Use axios to send a PUT request
    const { data } = await context.client.put(url.href, payload, authHeaders(token));

    // Return data from the API
    return data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    if (error.response) {
      error.response.data.error = error.response.status;
      return error.response.data;
    }
    throw error;
  }
}

