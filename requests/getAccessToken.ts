import tuyapi from './tuyapi';

tuyapi({ version: 1, pathname: '/token', query: { grant_type: 1 } });
