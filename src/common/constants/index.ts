export const Environment = {
  development: 'development',
  production: 'production',
  test: 'test',
} as const;

export type Environment = (typeof Environment)[keyof typeof Environment];
