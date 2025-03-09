import { AxiosInstance } from 'axios';
import { ProductVariant } from '../../types';
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

export type UpdateProductParams = {
  id: number | string;
  avatar?: string | null;
  isActive: boolean;
  isDaily: boolean;
  useEncryption: boolean;
  webhook?: string | null;
  expirationRound?: number;
  description: string;
  options: any[];
  featuredProducts?: Array<{ id: number }> | null;
  roundLock?: number;
};

export type UpdateProductResponse = ProductVariant;

// Keep the original function signature for backward compatibility
export default async function updateProduct(
  context: Context, 
  params: UpdateProductParams, 
  customQuery?: any
): Promise<UpdateProductResponse> {
  // Create URL object containing full endpoint URL
  const url = new URL(`products/${params.id}`, context.config.api.url);
  const token = context.config.auth.onTokenRead();

  // Prepare payload
  const payload = {
    avatar: params.avatar ? params.avatar : null,
    // eslint-disable-next-line camelcase
    is_active: params.isActive,
    // eslint-disable-next-line camelcase
    is_daily: params.isDaily,
    // eslint-disable-next-line camelcase
    use_encryption: params.useEncryption,
    webhook: params.webhook ? params.webhook : null,
    // eslint-disable-next-line camelcase
    expiration_round: params.expirationRound,
    description: params.description,
    options: params.options,
    // eslint-disable-next-line camelcase
    featured_products: params.featuredProducts ? params.featuredProducts.map(p => p.id) : null,
    round_lock: params.roundLock,
  };

  try {
    // Use axios to send a PUT request
    const { data } = await context.client.put(url.href, payload, authHeaders(token));
    
    // Return data from the API
    return data;
  } catch (error) {
    console.error('Error updating product:', error);
    if (error.response) {
      error.response.data.error = error.response.status;
      return error.response.data;
    }
    throw error;
  }
}

