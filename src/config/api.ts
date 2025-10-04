const DEFAULT_LOCAL_API_HOST = 'http://localhost:8001';
const DEFAULT_PROD_API_HOST = 'https://mfzznc3aac4ed2sjkrvm2ctqje0iukdd.lambda-url.eu-west-2.on.aws';

function normaliseHost(value: string): string {
  return value.replace(/\/$/, '');
}

export function resolveApiHost(): string {
  const rawEnvValue = import.meta.env.VITE_API_HOST;
  const candidate = typeof rawEnvValue === 'string' && rawEnvValue.trim().length > 0
    ? rawEnvValue
    : import.meta.env.DEV
      ? DEFAULT_LOCAL_API_HOST
      : DEFAULT_PROD_API_HOST;

  return normaliseHost(candidate);
}

export const API_HOST = resolveApiHost();
