import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY;
const REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_KEY;

export const cookieOptions = {
  secure: true,
  sameSite: "strict",
  path: "/",
  expires: 7, // 7 days
} as const;

export const cookies = {
  getAccessToken: () => Cookies.get(ACCESS_TOKEN_KEY),
  getRefreshToken: () => Cookies.get(REFRESH_TOKEN_KEY),

  setAccessToken: (token: string) => {
    Cookies.set(ACCESS_TOKEN_KEY, token, cookieOptions);
  },

  setRefreshToken: (token: string) => {
    Cookies.set(REFRESH_TOKEN_KEY, token, cookieOptions);
  },

  removeAccessToken: () => {
    Cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
  },

  removeRefreshToken: () => {
    Cookies.remove(REFRESH_TOKEN_KEY, { path: "/" });
  },

  clearTokens: () => {
    cookies.removeAccessToken();
    cookies.removeRefreshToken();
  },
};
