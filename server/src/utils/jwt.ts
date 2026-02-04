import jwt, { SignOptions } from "jsonwebtoken";

export const generateAccessToken = (userId: string): string => {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  const expiresIn = process.env.ACCESS_TOKEN_EXPIRE;

  if (!secret || !expiresIn) {
    throw new Error("JWT env variables not defined");
  }

  return jwt.sign(
    { userId },
    secret,
    {
      expiresIn: expiresIn as SignOptions["expiresIn"]
,
    } as SignOptions
  );
};
