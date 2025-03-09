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

export type CreateCouponParams = {
  username: string;
  applicability: string;
  code: string;
  date_expiration: string;
  applicable_product_ids: number[];
  discount_percent: number | string;
  quantity_total: number | string;
  max_discount: number | string;
  min_spend: number | string;
  message?: string;
};

export type CreateCouponResponse = {
  id: number;
  [key: string]: any;
};

// Keep the original function signature for backward compatibility
export default async function createCoupon(
  context: Context, 
  params: CreateCouponParams, 
  customQuery?: any
): Promise<CreateCouponResponse> {
  // Create URL object containing full endpoint URL
  const url = new URL(`coupons/${params.username}`, context.config.api.url);
  const token = context.config.auth.onTokenRead();

  // Prepare payload
  const payload = {
    coupon_in: {
      applicability: params.applicability,
      code: params.code,
      // eslint-disable-next-line camelcase
      date_expiration: params.date_expiration,
      // eslint-disable-next-line camelcase
      applicable_product_ids: params.applicable_product_ids,
      // eslint-disable-next-line camelcase
      discount_percent: Number(params.discount_percent),
      // eslint-disable-next-line camelcase
      quantity_total: Number(params.quantity_total),
      // eslint-disable-next-line camelcase
      max_discount: Number(params.max_discount),
      // eslint-disable-next-line camelcase
      min_spend: Number(params.min_spend),
    },
    message: params.message
  };

  try {
    // Use axios to send a POST request
    const { data } = await context.client.post(url.href, payload, authHeaders(token));
    
    // Return data from the API
    return data;
  } catch (error) {
    console.error('Error creating coupon:', error);
    if (error.response) {
      error.response.data.error = error.response.status;
      return error.response.data;
    }
    throw error;
  }
}

