import { registerAs } from '@nestjs/config';

export default registerAs('app', () => {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    jwtSecret:process.env.JWT_SECRET,
    jwtExpirationTime: process.env.JWT_EXPIRATION_TIME || '1d',
    adminSecret: process.env.ADMIN_SECRET || 'admin',
  };
});