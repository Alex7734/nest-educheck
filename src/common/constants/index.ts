export const Environment = {
  development: 'development',
  production: 'production',
  test: 'test',
} as const;

export type Environment = (typeof Environment)[keyof typeof Environment];

export const ErrorCodes = {
  AUTH_ACCOUNT_NOT_CREATED: 'auth/account-not-created',
  AUTH_ACCOUNT_ALREADY_CREATED: 'auth/account-already-created',
  OTP_EMAIL_NOT_FOUND: 'otp/email-not-found',
};
