import jwt, { Secret, SignOptions } from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET: Secret = process.env.ACCESS_TOKEN_SECRET || 'access_secret';


export const signJwt = (
  payload: string | object | Buffer,
  secret: Secret,
  expiresIn: SignOptions['expiresIn']
) => {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, secret, options);
};

export const verifyJwt = <T>(token: string, secret: Secret): T | null => {
  try {
    return jwt.verify(token, secret) as T;
  } catch {
    return null;
  }
};

export const signAccessToken = (payload: string | object | Buffer) => {
  return signJwt(payload, ACCESS_TOKEN_SECRET, '1d');
};

export const verifyAccessToken = <T>(token: string): T | null => {
  return verifyJwt<T>(token, ACCESS_TOKEN_SECRET);
};