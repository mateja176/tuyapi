import tuyapi from './tuyapi';

const access_token = process.env.ACCESS_TOKEN;
if (!access_token) {
  throw new Error('ACCESS_TOKEN is not defined');
}

const groupId = process.env.GROUP_ID;
if (!groupId) {
  throw new Error('GROUP_ID is not defined');
}

tuyapi({
  version: 2,
  pathname: `/cloud/thing/group/${groupId}/properties`,
  headers: {
    access_token,
  },
});
