import { AxiosInstance } from 'axios';
import { Order } from '../../types';
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

export type CreateOrderParams = {
  id: string | number;
  optionId: string | number;
  rounds?: number[];
  submitModelId?: string | number;
  coupon?: string;
};

export type CreateOrderResponse = Order;

// Keep the original function signature for backward compatibility
export default async function createOrder(
  context: Context, 
  params: CreateOrderParams, 
  customQuery?: any
): Promise<CreateOrderResponse> {
  // Create URL object containing full endpoint URL
  const url = new URL('orders/', context.config.api.url);
  const token = context.config.auth.onTokenRead();

  // price: Decimal
  //   currency: str
  //   chain: str
  //   from_address: str
  //   to_address: str
  //   product_id: int

  // Prepare payload
  const payload = {
    id: parseInt(params.id as string),
    // eslint-disable-next-line camelcase
    option_id: parseInt(params.optionId as string),
    rounds: params.rounds,
    // eslint-disable-next-line camelcase
    submit_model_id: params.submitModelId,
    coupon: params.coupon
  };

  try {
    // Use axios to send a POST request
    const { data } = await context.client.post(url.href, payload, authHeaders(token));
    
    // Return data from the API
    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    if (error.response) {
      error.response.data.error = error.response.status;
      return error.response.data;
    }
    throw error;
  }
}

