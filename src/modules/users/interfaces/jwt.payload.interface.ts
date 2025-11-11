export interface TokenPayload {  
  sub: number;
  email: string;
  role: string;
}

export interface TokenPayloadWithRefreshToken extends TokenPayload {
  refreshToken: string;
}