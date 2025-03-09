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

export type CreateProductParams = {
  name: string;
  category: number | string;
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

export type CreateProductResponse = ProductVariant;

// Keep the original function signature for backward compatibility
export default async function createProduct(
  context: Context, 
  params: CreateProductParams, 
  customQuery?: any
): Promise<CreateProductResponse> {
  // Create URL object containing full endpoint URL
  const url = new URL('products/', context.config.api.url);
  const token = context.config.auth.onTokenRead();

  // Prepare payload
  const payload = {
    name: params.name,
    // eslint-disable-next-line camelcase
    category_id: Number(params.category),
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
    // Use axios to send a POST request
    const { data } = await context.client.post(url.href, payload, authHeaders(token));
    
    // Return data from the API
    return data;
  } catch (error) {
    console.error('Error creating product:', error);
    if (error.response) {
      error.response.data.error = error.response.status;
      return error.response.data;
    }
    throw error;
  }
}

