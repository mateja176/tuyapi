import tuyapi from './tuyapi';

const virtualId = process.env.VIRTUAL_ID;
if (!virtualId) {
  throw new Error('VIRTUAL_ID is not defined');
}
const access_token = process.env.ACCESS_TOKEN;
if (!access_token) {
  throw new Error('ACCESS_TOKEN is not defined');
}

tuyapi({
  version: 2,
  pathname: `/cloud/thing/${virtualId}/shadow/properties`,
  headers: {
    access_token,
  },
});
