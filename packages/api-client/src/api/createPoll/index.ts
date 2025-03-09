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

export type CreatePollParams = {
  id?: string | number;
  topic: string;
  description: string;
  dateFinish: string;
  isMultiple: boolean;
  maxOptions: number;
  isAnonymous: boolean;
  isBlind: boolean;
  weightMode: string;
  isStakePredetermined: boolean;
  stakeBasisRound: number;
  minStake: number;
  minRounds: number;
  clipLow: number;
  clipHigh: number;
  options: any[];
};

export type CreatePollResponse = {
  id: number;
  [key: string]: any;
};

// Keep the original function signature for backward compatibility
export default async function createPoll(
  context: Context, 
  params: CreatePollParams, 
  customQuery?: any
): Promise<CreatePollResponse> {
  // Create URL object containing full endpoint URL
  const url = new URL('polls/', context.config.api.url);
  const token = context.config.auth.onTokenRead();

  // Prepare payload
  const payload = {
    id: params.id,
    topic: params.topic,
    description: params.description,
    // eslint-disable-next-line camelcase
    date_finish: params.dateFinish,
    // eslint-disable-next-line camelcase
    is_multiple: params.isMultiple,
    // eslint-disable-next-line camelcase
    max_options: params.maxOptions,
    // eslint-disable-next-line camelcase
    is_anonymous: params.isAnonymous,
    // eslint-disable-next-line camelcase
    is_blind: params.isBlind,
    // eslint-disable-next-line camelcase
    weight_mode: params.weightMode,
    // eslint-disable-next-line camelcase
    is_stake_predetermined: params.isStakePredetermined,
    // eslint-disable-next-line camelcase
    stake_basis_round: params.stakeBasisRound,
    // eslint-disable-next-line camelcase
    min_stake: params.minStake,
    // eslint-disable-next-line camelcase
    min_rounds: params.minRounds,
    // eslint-disable-next-line camelcase
    clip_low: params.clipLow,
    // eslint-disable-next-line camelcase
    clip_high: params.clipHigh,
    options: params.options
  };

  try {
    // Use axios to send a POST request
    const { data } = await context.client.post(url.href, payload, authHeaders(token));
    
    // Return data from the API
    return data;
  } catch (error) {
    console.error('Error creating poll:', error);
    if (error.response) {
      error.response.data.error = error.response.status;
      return error.response.data;
    }
    throw error;
  }
}

