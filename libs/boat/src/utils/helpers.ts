import { ulid } from 'ulid';

export const generateUlid = (): string => {
  return ulid();
};
