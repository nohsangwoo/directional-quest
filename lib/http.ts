import axios from "axios";
import { getAuthState } from "@/lib/store/auth-store";

// API 기본 주소: 환경변수 없으면 RFP의 공개 엔드포인트 사용
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://fe-hiring-rest-api.vercel.app";

// 공용 axios 인스턴스: Zustand 스토어의 토큰을 Authorization으로 주입
export const http = axios.create({ baseURL });

http.interceptors.request.use((config) => {
  // 로그인 등 인증 엔드포인트에는 Authorization 주입하지 않음
  const url = config.url || "";
  if (url.includes("/auth/")) return config;

  if (typeof window !== "undefined") {
    const { token } = getAuthState();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
