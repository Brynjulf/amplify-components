/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiRequestOptions } from './ApiRequestOptions';
import { environment, auth } from 'src/utils';
import { CancelablePromise } from 'src/api';
import { getLocalStorage, updateLocalStorage } from 'src/hooks/useLocalStorage';
import { JwtPayload } from 'jwt-decode';
import jwtDecode from 'jwt-decode';
import { TokenService } from 'src/api/services/TokenService';

const { getApiUrl, getEnvironmentName } = environment;
const { GRAPH_REQUESTS_BACKEND, acquireToken, msalApp } = auth;

type Resolver<T> = (options: ApiRequestOptions) => Promise<T>;
type Headers = Record<string, string>;

const environmentName = getEnvironmentName(
  import.meta.env.VITE_ENVIRONMENT_NAME
);
const noLocalhostEnvironmentName =
  environmentName === 'localhost' ? 'development' : environmentName;

export type OpenAPIConfig = {
  BASE: string;
  VERSION: string;
  WITH_CREDENTIALS: boolean;
  CREDENTIALS: 'include' | 'omit' | 'same-origin';
  TOKEN?: string | Resolver<string>;
  USERNAME?: string | Resolver<string>;
  PASSWORD?: string | Resolver<string>;
  HEADERS?: Headers | Resolver<Headers>;
  ENCODE_PATH?: (path: string) => string;
};

const getApplicationToken = async () => {
  return (
    await acquireToken(
      msalApp(environment.getClientId(import.meta.env.VITE_CLIENT_ID)),
      GRAPH_REQUESTS_BACKEND(
        environment.getApiScope(import.meta.env.VITE_API_SCOPE)
      )
    )
  ).accessToken;
};

const isJwtTokenExpired = (token: string) => {
  const decodedToken: JwtPayload = jwtDecode(token);
  const todayInSecUnix = new Date().getTime() / 1000;
  return decodedToken.exp && todayInSecUnix > decodedToken.exp;
};

const getToken = async (
  localStorageKey: string,
  tokenRequest: () => CancelablePromise<string>
) => {
  const localStorageToken = getLocalStorage(localStorageKey, '');
  if (localStorageToken.length !== 0 && !isJwtTokenExpired(localStorageToken)) {
    return localStorageToken;
  } else {
    const requestToken = await tokenRequest();
    updateLocalStorage(localStorageKey, requestToken);
    return requestToken;
  }
};

const getPortalToken = async () => {
  return getToken(
    `amplify-portal-${environmentName}`,
    TokenService.getAmplifyPortalToken
  );
};

const getPortalProdToken = async () => {
  return getToken(
    `amplify-portal-production`,
    TokenService.getAmplifyPortalProductionToken
  );
};

export const OpenAPI: OpenAPIConfig = {
  BASE: getApiUrl(import.meta.env.VITE_API_URL),
  VERSION: '1.0',
  WITH_CREDENTIALS: false,
  CREDENTIALS: 'include',
  TOKEN: getApplicationToken,
  USERNAME: undefined,
  PASSWORD: undefined,
  HEADERS: undefined,
  ENCODE_PATH: undefined,
};

export const OpenAPI_Portal: OpenAPIConfig = {
  BASE: `https://api-amplify-portal-${noLocalhostEnvironmentName}.radix.equinor.com`,
  VERSION: '1.0',
  WITH_CREDENTIALS: false,
  CREDENTIALS: 'include',
  TOKEN: getPortalToken,
  USERNAME: undefined,
  PASSWORD: undefined,
  HEADERS: undefined,
  ENCODE_PATH: undefined,
};
export const OpenAPI_Portal_Prod: OpenAPIConfig = {
  BASE: `https://api-amplify-portal-production.radix.equinor.com`,
  VERSION: '1.0',
  WITH_CREDENTIALS: false,
  CREDENTIALS: 'include',
  TOKEN: getPortalProdToken,
  USERNAME: undefined,
  PASSWORD: undefined,
  HEADERS: undefined,
  ENCODE_PATH: undefined,
};
