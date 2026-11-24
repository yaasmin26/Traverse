/**
 * ============================================================================
 * [TUGAS ORANG 2 & ORANG 1: MODEL DATA (TYPE & INTERFACE)]
 * Definisi struktur data untuk API, Autentikasi, Destinasi, dan Media
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// [TUGAS ORANG 1: MODEL DATA AUTHENTICATION & SESSION]
// ----------------------------------------------------------------------------
export interface AuthUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'guest';
}

export interface AuthSession {
  token: string;
  user: AuthUser;
  expiresAt: number;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthTokenResponse {
  success: boolean;
  token?: string;
  user?: AuthUser;
  message?: string;
}

// ----------------------------------------------------------------------------
// [TUGAS ORANG 2: MODEL DATA DESTINASI, BERITA, & RENCANA PERJALANAN]
// ----------------------------------------------------------------------------
export interface DestinationItem {
  readonly id: string;
  name: string;
  image: any;
  province?: string;
  rating?: number;
  description?: string;
  price?: string;
}

export interface StreetNewsItem {
  readonly id: string;
  title: string;
  image: any;
  location: string;
  category?: string;
  publishedAt?: string;
}

export interface TravelPlanItem {
  readonly id: string;
  destination: string;
  date: string;
  transport: string;
  notes?: string;
  imageUri?: string;
}

// ----------------------------------------------------------------------------
// [TUGAS ORANG 3: MODEL DATA RESPONSE, ERROR & NETWORK]
// ----------------------------------------------------------------------------
export type ApiErrorCode =
  | 'OFFLINE'
  | 'TIMEOUT'
  | 'HTTP_400'
  | 'HTTP_401'
  | 'HTTP_403'
  | 'HTTP_404'
  | 'HTTP_500'
  | 'HTTP_503'
  | 'HTTP_ERROR'
  | 'NETWORK_ERROR'
  | 'PARSE_ERROR';

export interface ApiError {
  code: ApiErrorCode;
  status?: number;
  message: string;
  details?: string;
  timestamp: string;
  endpoint?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  isFromCache?: boolean;
}
