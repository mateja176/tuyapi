import tuyapi from './tuyapi';

const refreshToken = process.env.REFRESH_TOKEN;
if (!refreshToken) {
  throw new Error('REFRESH_TOKEN is not defined');
}

tuyapi({
  version: 1,
  pathname: `/token/${refreshToken}`,
});
