import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: 'https://stunning-silkworm-42982.upstash.io',
  token: 'AafmAAIncDE3NDY1MTgxMjVjODU0NmNkYjY3NzAwMmMzMzQ1NTQ2MXAxNDI5ODI',
});

export { redis };
