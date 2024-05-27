import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  global: true,
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: process.env.JWT_TTL },
}));
