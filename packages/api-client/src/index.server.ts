import axios, { AxiosInstance } from 'axios';
import closePoll from './api/closePoll';
import createFavorite from './api/createFavorite';
import createOrder from './api/createOrder';
import createPoll from './api/createPoll';
import createProduct from './api/createProduct';
import createCoupon from './api/createCoupon';
import deleteCoupon from './api/deleteCoupon';
import createReview from './api/createReview';
import deleteArtifact from './api/deleteArtifact';
import deleteFavorite from './api/deleteFavorite';
import deleteOrderArtifact from './api/deleteOrderArtifact';
import deletePoll from './api/deletePoll';
import deleteProduct from './api/deleteProduct';
import testProductWebhook from './api/testProductWebhook';
import getArtifact from './api/getArtifact';
import getArtifactDownloadUrl from './api/getArtifactDownloadUrl';
import getArtifactUploadUrl from './api/getArtifactUploadUrl';
import getCategory from './api/getCategory';
import getFavorite from './api/getFavorite';
import getGlobals from './api/getGlobals';
import getStats from './api/getStats';
import getMe from './api/getMe';
import getNumeraiModelInfo from './api/getNumeraiModelInfo';
import getNumeraiModels from './api/getNumeraiModels';
import getOrder from './api/getOrder';
import getOrderArtifact from './api/getOrderArtifact';
import getOrderArtifactDownloadUrl from './api/getOrderArtifactDownloadUrl';
import getOrderArtifactUploadUrl from './api/getOrderArtifactUploadUrl';
import getPoll from './api/getPoll';
import getProduct from './api/getProduct';
import getSalesLeaderboard from './api/getSalesLeaderboard';
import getReview from './api/getReview';
import logInGetNonce from './api/logInGetNonce';
import logInGetNonceAuthenticated from './api/logInGetNonceAuthenticated';
import logInGetToken from './api/logInGetToken';
import logInGetTokenWeb3 from './api/logInGetTokenWeb3';
import logOutUser from './api/logOutUser';
import signUpUser from './api/signUpUser';
import submitArtifact from './api/submitArtifact';
import updateOrderSubmissionModel from './api/updateOrderSubmissionModel';
import updatePoll from './api/updatePoll';
import updateProduct from './api/updateProduct';
import userUpdateMe from './api/userUpdateMe';
import userSyncNumerai from './api/userSyncNumerai';
import validateArtifactUpload from './api/validateArtifactUpload';
import validateOrderArtifactUpload from './api/validateOrderArtifactUpload';
import validatePayment from './api/validatePayment';
import cancelOrder from './api/cancelOrder';
import sendOrderUploadReminder from './api/sendOrderUploadReminder';
import sendOrderRefundRequest from './api/sendOrderRefundRequest';
import votePoll from './api/votePoll';
import { withErrorHandling } from './api/utils';

// Custom logger implementation to replace Vue Storefront Logger
const Logger = {
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[NumerbayAPI] ${message}`, data || '');
    }
  },
  info: (message: string, data?: any) => {
    console.info(`[NumerbayAPI] ${message}`, data || '');
  },
  warn: (message: string, data?: any) => {
    console.warn(`[NumerbayAPI] ${message}`, data || '');
  },
  error: (message: string, data?: any) => {
    console.error(`[NumerbayAPI] ${message}`, data || '');
  }
};

// Type definitions
export type ApiConfig = {
  api: {
    url: string;
  };
  auth?: {
    onTokenChange?: (token: any) => void;
    onTokenRead?: () => any;
    onTokenRemove?: () => void;
  };
};

export type ApiContext = {
  config: ApiConfig;
  client: AxiosInstance;
};

export type ApiClientExtension = {
  name: string;
  hooks: (req: any, res: any) => {
    beforeCreate?: (options: { configuration: ApiConfig }) => ApiConfig;
    afterCreate?: (options: { configuration: ApiConfig; client: ApiContext }) => void;
  };
};

export type ApiMethods = {
  [key: string]: Function;
};

const onCreate = (settings: ApiConfig): ApiContext => {
  const client = axios.create({
    baseURL: settings.api.url
  });

  client.interceptors.request.use(request => {
    Logger.debug('Starting Request', request);
    return request;
  }, error => {
    // Handle request errors
    console.error('API Request Error:', error);
    return Promise.reject(error);
  });

  client.interceptors.response.use(response => {
    Logger.debug('Response:', response);
    return response;
  }, error => {
    // Handle response errors
    console.error('API Response Error:', error.message, {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    
    // Rethrow the error to allow it to be caught by the calling code
    return Promise.reject(error);
  });

  return {
    config: settings,
    client
  };
};

const parseToken = (rawToken: string): any => {
  try {
    return JSON.parse(rawToken);
  } catch (e) {
    return null;
  }
};

const tokenExtension: ApiClientExtension = {
  name: 'tokenExtension',
  hooks: (req, res) => {
    const rawCurrentToken = req.cookies['nb-token'];
    const currentToken = parseToken(rawCurrentToken);

    return {
      beforeCreate: ({ configuration }) => ({
        ...configuration,
        auth: {
          onTokenChange: (newToken) => {
            if (!currentToken || currentToken !== newToken) {
              res.cookie(
                'nb-token',
                JSON.stringify(newToken),
                newToken?.expires_at ? { expires: new Date(newToken.expires_at) } : {}
              );
            }
          },

          onTokenRead: () => {
            res.cookie(
              'nb-token',
              rawCurrentToken,
              currentToken?.expires_at ? { expires: new Date(currentToken.expires_at) } : {}
            );
            return currentToken;
          },

          onTokenRemove: () => {
            delete req.cookies['nb-token'];
            res.clearCookie('nb-token');
          }
        }
      })
    };
  }
};

// Custom implementation of apiClientFactory to replace Vue Storefront's
const apiClientFactory = <T, K>({ 
  onCreate, 
  api, 
  extensions = [] 
}: { 
  onCreate: (settings: ApiConfig) => ApiContext; 
  api: ApiMethods; 
  extensions?: ApiClientExtension[] 
}) => {
  return {
    // Add _predefinedExtensions property to fix the previous error
    createApiClient: Object.assign(
      function createApiClient(config: ApiConfig, req?: any, res?: any) {
        let finalConfig = { ...config };
        
        if (req && res) {
          for (const extension of extensions) {
            const hooks = extension.hooks(req, res);
            
            if (hooks.beforeCreate) {
              finalConfig = hooks.beforeCreate({ configuration: finalConfig });
            }
          }
        }
        
        const client = onCreate(finalConfig);
        
        if (req && res) {
          for (const extension of extensions) {
            const hooks = extension.hooks(req, res);
            
            if (hooks.afterCreate) {
              hooks.afterCreate({ configuration: finalConfig, client });
            }
          }
        }
        
        const apiClient = {} as any;
        
        for (const [apiName, apiMethod] of Object.entries(api)) {
          // Wrap each API method with error handling
          apiClient[apiName] = withErrorHandling(apiMethod.bind(null, client));
        }
        
        // Return an object with an api property that contains all the API functions
        return {
          api: apiClient
        };
      },
      { _predefinedExtensions: extensions }
    )
  };
};

const { createApiClient } = apiClientFactory<any, any>({
  onCreate,
  api: {
    getProduct,
    getSalesLeaderboard,
    createProduct,
    updateProduct,
    deleteProduct,
    createCoupon,
    deleteCoupon,
    testProductWebhook,
    getCategory,
    getReview,
    getFavorite,
    createFavorite,
    deleteFavorite,
    createReview,
    signUpUser,
    logInGetToken,
    logInGetTokenWeb3,
    logInGetNonce,
    logInGetNonceAuthenticated,
    logOutUser,
    getMe,
    userUpdateMe,
    userSyncNumerai,
    getNumeraiModels,
    getNumeraiModelInfo,
    getOrder,
    createOrder,
    getGlobals,
    getStats,
    getArtifactDownloadUrl,
    getOrderArtifactDownloadUrl,
    getArtifactUploadUrl,
    getOrderArtifactUploadUrl,
    validateArtifactUpload,
    validateOrderArtifactUpload,
    updateOrderSubmissionModel,
    validatePayment,
    sendOrderUploadReminder,
    sendOrderRefundRequest,
    cancelOrder,
    getArtifact,
    getOrderArtifact,
    submitArtifact,
    deleteArtifact,
    deleteOrderArtifact,
    getPoll,
    createPoll,
    updatePoll,
    deletePoll,
    closePoll,
    votePoll
  },
  extensions: [tokenExtension]
});

export {
  createApiClient
};
