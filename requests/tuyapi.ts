import crypto from 'crypto';
import querystring from 'querystring';

const origin = process.env.ORIGIN;
if (!origin) {
  throw new Error('ORIGIN is not defined');
}
const clientId = process.env.CLIENT_ID;
if (!clientId) {
  throw new Error('CLIENT_ID is not defined');
}
const secret = process.env.SECRET;
if (!secret) {
  throw new Error('SECRET is not defined');
}

const toSignedHash = (str: string) => {
  return crypto.createHmac('sha256', secret).update(str).digest('hex');
};
const toHash = (str: string) => {
  return crypto.createHash('sha256').update(str).digest('hex');
};

type Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
interface _RequestParams<M extends Method> {
  version: 1 | 2;
  pathname: string;
  headers?: Record<string, string>;
  query?: Parameters<typeof querystring.stringify>[0];
  method?: M;
}
type Primitive = string | number | boolean;
type Body = { [key in string]: Primitive | Array<Primitive> | Body };
type RequestParams<M extends Method> = M extends 'GET' | 'DELETE'
  ? _RequestParams<M>
  : _RequestParams<M> & { body: Body };
export default async <M extends Method>(requestParams: RequestParams<M>) => {
  const {
    version,
    pathname,
    headers: requestHeaders = {},
    query,
    method = 'GET',
  } = requestParams;
  const accessToken =
    'access_token' in requestHeaders ? requestHeaders.access_token : '';
  const timestamp = Date.now();
  const path =
    `/v${version}.0` +
    pathname +
    (query ? `?${querystring.stringify(query)}` : '');
  const url = origin + path;
  const hasBody = 'body' in requestParams;
  const body = hasBody ? JSON.stringify(requestParams.body) : '';
  const contentHash = toHash(body);
  const stringToSign = [method, contentHash, '', path].join('\n');
  const str = clientId + accessToken + timestamp.toString() + stringToSign;
  const sign = toSignedHash(str).toUpperCase();
  const headers = {
    ...requestHeaders,
    ...(hasBody ? { 'content-type': 'application/json' } : {}),
    client_id: clientId,
    t: timestamp.toString(),
    sign_method: 'HMAC-SHA256',
    sign,
  };

  const response = await fetch(url, {
    method,
    body,
    headers,
    verbose: process.env.VERBOSE === 'true',
  });

  const result = await response.text();
  console.log(result);
  result;
};
