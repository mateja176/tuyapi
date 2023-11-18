import tuyapi from './tuyapi';

const access_token = process.env.ACCESS_TOKEN;
if (!access_token) {
  throw new Error('ACCESS_TOKEN is not defined');
}

const virtualId = process.env.VIRTUAL_ID;
if (!virtualId) {
  throw new Error('VIRTUAL_ID is not defined');
}

tuyapi({
  version: 2,
  pathname: `/cloud/thing/group/device/${virtualId}`,
  headers: {
    access_token,
  },
});
