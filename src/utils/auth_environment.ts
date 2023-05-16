import {
  IPublicClientApplication,
  PublicClientApplication,
} from '@azure/msal-browser';

import { EnvironmentType } from '../components';

interface IConfig {
  CLIENT_ID: string;
  NAME: string;
  API_URL: string;
  API_SCOPE: string;
  ENVIRONMENT_NAME: string;
  PORTAL_PROD_CLIENT_ID: string;
  IS_MOCK: boolean;
  SLACK_WEBHOOK_URL: string;
}

declare const window: any;

const getConfig = (param: keyof IConfig): string => {
  if (!window._env_) {
    return '';
  }
  if (!window._env_[param]) {
    throw new Error('Missing required environment variable: ' + param);
  }
  return window._env_[param];
};

const getAppName = (appName: string | undefined): string => {
  if (!appName) {
    return getConfig('NAME');
  }
  return appName;
};

const getClientId = (clientId: string | undefined): string => {
  if (!clientId) {
    return getConfig('CLIENT_ID');
  }
  return clientId;
};

const getApiUrl = (apiUrl: string | undefined): string => {
  if (!apiUrl) {
    return getConfig('API_URL');
  }
  return apiUrl;
};

const getApiScope = (apiScope: string | undefined): string => {
  if (!apiScope) {
    return getConfig('API_SCOPE');
  }
  return apiScope;
};

const getEnvironmentName = (
  environmentName: string | EnvironmentType | undefined
): EnvironmentType => {
  if (!environmentName) {
    return getConfig('ENVIRONMENT_NAME') as EnvironmentType;
  }
  return environmentName as EnvironmentType;
};

const getPortalProdClientId = (
  portalProdClientId: string | undefined
): string => {
  if (!portalProdClientId) {
    return getConfig('PORTAL_PROD_CLIENT_ID');
  }
  return portalProdClientId;
};

const getSlackWebhookUrl = (slackWebhookUrl: string | undefined) => {
  if (!slackWebhookUrl) {
    return getConfig('SLACK_WEBHOOK_URL');
  }
  return slackWebhookUrl;
};

const getIsMock = (isMock: string | undefined): boolean => {
  if (isMock === undefined) {
    return false;
  }
  return isMock === 'true';
};

const GRAPH_ENDPOINTS = {
  PHOTO: 'https://graph.microsoft.com/v1.0/me/photos/96x96/$value',
};

const fetchMsGraph = (url: string, accessToken: string) => {
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const GRAPH_SCOPES = {
  OPENID: 'openid',
  PROFILE: 'profile',
  USER_READ: 'User.Read',
};

const GRAPH_REQUESTS_LOGIN = {
  scopes: [GRAPH_SCOPES.OPENID, GRAPH_SCOPES.PROFILE, GRAPH_SCOPES.USER_READ],
};

const GRAPH_REQUESTS_PHOTO = {
  scopes: [GRAPH_SCOPES.USER_READ],
};

const GRAPH_REQUESTS_BACKEND = (apiScope: string) => ({
  scopes: [apiScope],
});

const msalApp = (clientId: string) => {
  if (getIsMock(import.meta.env.VITE_IS_MOCK)) {
    return {} as PublicClientApplication;
  }

  return new PublicClientApplication({
    auth: {
      clientId: clientId,
      authority:
        'https://login.microsoftonline.com/StatoilSRM.onmicrosoft.com/',
      redirectUri: window.location.origin,
      postLogoutRedirectUri: window.location.origin,
      navigateToLoginRequestUrl: false,
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: false,
    },
    system: {
      iframeHashTimeout: 10000,
    },
  });
};

const acquireToken = async (
  instance: IPublicClientApplication,
  request = GRAPH_REQUESTS_LOGIN
) => {
  return instance.acquireTokenSilent({
    ...request,
    redirectUri: `${window.location.origin}/auth.html`,
  });
};

const isReaderOnly = (roles: string[] | undefined) => {
  if (roles) {
    const enrolledToWriterRole = roles.some((r) => r.includes('WRITE'));
    return !enrolledToWriterRole;
  } else {
    return true;
  }
};

export const auth = {
  fetchMsGraph,
  GRAPH_SCOPES,
  GRAPH_REQUESTS_LOGIN,
  GRAPH_REQUESTS_PHOTO,
  GRAPH_REQUESTS_BACKEND,
  GRAPH_ENDPOINTS,
  msalApp,
  acquireToken,
  isReaderOnly,
};

export const environment = {
  getConfig,
  getAppName,
  getClientId,
  getApiUrl,
  getApiScope,
  getEnvironmentName,
  getPortalProdClientId,
  getIsMock,
  getSlackWebhookUrl,
};
