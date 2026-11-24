/**
 * ============================================================================
 * [PEMBAGIAN TUGAS MODUL API - TRAVERSE MOBILE APP]
 * - Orang 1: Implement Token, Attach Token, & Protect Session
 * - Orang 2: Model Data, Connect API Data, & Display API Data
 * - Orang 3: Handle Loading, Error Handling, Retry, & Handle Offline
 * ============================================================================
 */
import { networkService } from './networkService';
import { authService } from './authService';
import { AppAssets } from '../assets';
import {
  DestinationItem,
  StreetNewsItem,
  TravelPlanItem,
  ApiError,
  ApiErrorCode,
  ApiResponse,
} from '../types/apiTypes';

export { DestinationItem, StreetNewsItem, TravelPlanItem, ApiError, ApiErrorCode, ApiResponse };

export type SimulationMode = 'none' | 'error_500' | 'error_404' | 'timeout' | 'slow_network';

// [TUGAS ORANG 2: DATA DEFAULT DESTINASI & BERITA]
const DEFAULT_DESTINATIONS: DestinationItem[] = [
  { id: 'dest-1', name: 'Malang', image: AppAssets.homeDestMalang, province: 'Jawa Timur', rating: 4.8 },
  { id: 'dest-2', name: 'Surabaya', image: AppAssets.homeDestSurabaya, province: 'Jawa Timur', rating: 4.6 },
  { id: 'dest-3', name: 'Banyuwangi', image: AppAssets.ticketPlaceBromo, province: 'Jawa Timur', rating: 4.9 },
  { id: 'dest-4', name: 'Yogyakarta', image: AppAssets.planDau, province: 'D.I. Yogyakarta', rating: 4.7 },
];

const DEFAULT_STREET_NEWS: StreetNewsItem[] = [
  {
    id: 'news-1',
    title: 'Arus Lalu Lintas di Kota Malang Mengalami Kemacetan, Volume Kendaraan Meningkat Jelang Libur Akhir Pekan',
    image: AppAssets.homeNews1,
    location: 'Kota Malang',
    category: 'Lalu Lintas',
    publishedAt: '10 menit yang lalu',
  },
  {
    id: 'news-2',
    title: 'Kemacetan Parah di Daerah Polehan, Kendaraan Meningkat Akibat Penutupan Sebagian Jalan',
    image: AppAssets.homeNews2,
    location: 'Polehan, Malang',
    category: 'Info Jalan',
    publishedAt: '35 menit yang lalu',
  },
  {
    id: 'news-3',
    title: 'Rekayasa Jalur Wisata Bromo Diterapkan Guna Hindari Penumpukan Kendaraan Wisatawan',
    image: AppAssets.homeNews1,
    location: 'Bromo, Pasuruan',
    category: 'Wisata',
    publishedAt: '2 jam yang lalu',
  },
];

const DEFAULT_TRAVEL_PLANS: TravelPlanItem[] = [
  {
    id: '1',
    destination: 'Pantai Balekambang',
    date: '15 Mei 2026',
    transport: 'Local Bus',
    notes: 'Sunset & wisata kuliner ikan bakar',
  },
  {
    id: '2',
    destination: 'Gunung Bromo',
    date: '22 Mei 2026',
    transport: 'City Train',
    notes: 'Sunrise tour & Jeep Penanjakan',
  },
];

class ApiService {
  private cache: Map<string, any> = new Map();
  private simulationMode: SimulationMode = 'none';

  constructor() {
    this.cache.set('destinations', DEFAULT_DESTINATIONS);
    this.cache.set('street_news', DEFAULT_STREET_NEWS);
    this.cache.set('travel_plans', DEFAULT_TRAVEL_PLANS);
    this.loadCacheFromStorage();
  }

  // --------------------------------------------------------------------------
  // [TUGAS ORANG 3: HANDLE OFFLINE - CACHING LAYER]
  // --------------------------------------------------------------------------
  private loadCacheFromStorage() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedDest = window.localStorage.getItem('traverse_cache_destinations');
        if (savedDest) {
          this.cache.set('destinations', JSON.parse(savedDest));
        }
      }
    } catch {}
  }

  private saveToCache<T>(key: string, data: T) {
    this.cache.set(key, data);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(`traverse_cache_${key}`, JSON.stringify(data));
      }
    } catch {}
  }

  private getFromCache<T>(key: string): T | null {
    if (this.cache.has(key)) {
      return this.cache.get(key) as T;
    }
    return null;
  }

  public setSimulationMode(mode: SimulationMode) {
    this.simulationMode = mode;
  }

  public getSimulationMode(): SimulationMode {
    return this.simulationMode;
  }

  // --------------------------------------------------------------------------
  // [TUGAS ORANG 3: ERROR HANDLING & HTTP STATUS CODES]
  // --------------------------------------------------------------------------
  private createHttpError(status: number, endpoint: string, customMessage?: string): ApiError {
    let message = customMessage || 'Terjadi kesalahan pada respon server.';
    let code: ApiErrorCode = 'HTTP_ERROR';

    switch (status) {
      case 400:
        code = 'HTTP_400';
        message = 'Permintaan tidak valid (400 Bad Request). Parameter tidak sesuai.';
        break;
      case 401:
        code = 'HTTP_401';
        message = 'Autentikasi gagal (401 Unauthorized). Token tidak valid atau sesi berakhir.';
        break;
      case 403:
        code = 'HTTP_403';
        message = 'Akses ditolak (403 Forbidden). Anda tidak memiliki izin.';
        break;
      case 404:
        code = 'HTTP_404';
        message = 'Data / Endpoint tidak ditemukan di server (404 Not Found).';
        break;
      case 500:
        code = 'HTTP_500';
        message = 'Kesalahan server internal (500 Internal Server Error). Server sedang mengalami gangguan.';
        break;
      case 503:
        code = 'HTTP_503';
        message = 'Layanan server sedang tidak tersedia (503 Service Unavailable). Sedang pemeliharaan sistem.';
        break;
    }

    return {
      code,
      status,
      message,
      details: `HTTP Status Code: ${status} pada endpoint ${endpoint}`,
      timestamp: new Date().toLocaleTimeString('id-ID'),
      endpoint,
    };
  }

  // --------------------------------------------------------------------------
  // [TUGAS ORANG 2 & 1: CONNECT DATA & ATTACH TOKEN]
  // 1. Ambil Destinasi Populer
  // --------------------------------------------------------------------------
  public async getDestinations(): Promise<ApiResponse<DestinationItem[]>> {
    const cacheKey = 'destinations';
    const endpoint = '/api/v1/destinations/popular';

    // [TUGAS ORANG 1: ATTACH TOKEN KE HEADER]
    const authHeaders = authService.getAuthHeaders();

    // [TUGAS ORANG 3: HANDLE OFFLINE & CACHE FALLBACK]
    if (!networkService.isConnected()) {
      const cached = this.getFromCache<DestinationItem[]>(cacheKey) || DEFAULT_DESTINATIONS;
      return {
        success: false,
        data: cached,
        isFromCache: true,
        error: {
          code: 'OFFLINE',
          message: 'Mode Offline: Menampilkan data tersimpan di penyimpanan lokal (Cache).',
          details: 'Periksa koneksi Wi-Fi atau data seluler Anda.',
          timestamp: new Date().toLocaleTimeString('id-ID'),
          endpoint,
        },
      };
    }

    // [TUGAS ORANG 3: SIMULASI ERROR API]
    if (this.simulationMode === 'error_500') {
      await new Promise((res) => setTimeout(res, 800));
      return {
        success: false,
        error: this.createHttpError(500, endpoint),
      };
    }

    if (this.simulationMode === 'error_404') {
      await new Promise((res) => setTimeout(res, 800));
      return {
        success: false,
        error: this.createHttpError(404, endpoint),
      };
    }

    if (this.simulationMode === 'timeout') {
      await new Promise((res) => setTimeout(res, 3500));
      return {
        success: false,
        error: {
          code: 'TIMEOUT',
          message: 'Waktu permintaan habis (Connection Timeout). Server tidak merespons.',
          details: 'Waktu tunggu melebihi 3000ms.',
          timestamp: new Date().toLocaleTimeString('id-ID'),
          endpoint,
        },
      };
    }

    // [TUGAS ORANG 2: CONNECT DATA - SUKSES]
    try {
      const delay = this.simulationMode === 'slow_network' ? 2500 : 700;
      await new Promise((res) => setTimeout(res, delay));

      const resultData = DEFAULT_DESTINATIONS;
      this.saveToCache(cacheKey, resultData);

      return {
        success: true,
        data: resultData,
        isFromCache: false,
      };
    } catch (err: any) {
      const cached = this.getFromCache<DestinationItem[]>(cacheKey) || DEFAULT_DESTINATIONS;
      return {
        success: false,
        data: cached,
        isFromCache: true,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Gagal menghubungi server. Terjadi gangguan jaringan.',
          details: err?.message || 'Network request failed',
          timestamp: new Date().toLocaleTimeString('id-ID'),
          endpoint,
        },
      };
    }
  }

  // --------------------------------------------------------------------------
  // [TUGAS ORANG 2 & 1: CONNECT DATA & ATTACH TOKEN]
  // 2. Ambil Berita Lalu Lintas Terbaru
  // --------------------------------------------------------------------------
  public async getStreetNews(): Promise<ApiResponse<StreetNewsItem[]>> {
    const cacheKey = 'street_news';
    const endpoint = '/api/v1/news/traffic-stream';

    // [TUGAS ORANG 1: ATTACH TOKEN]
    const authHeaders = authService.getAuthHeaders();

    if (!networkService.isConnected()) {
      const cached = this.getFromCache<StreetNewsItem[]>(cacheKey) || DEFAULT_STREET_NEWS;
      return {
        success: false,
        data: cached,
        isFromCache: true,
        error: {
          code: 'OFFLINE',
          message: 'Mode Offline: Memuat berita lalu lintas tersimpan.',
          details: 'Koneksi terputus.',
          timestamp: new Date().toLocaleTimeString('id-ID'),
          endpoint,
        },
      };
    }

    if (this.simulationMode === 'error_500') {
      await new Promise((res) => setTimeout(res, 700));
      return {
        success: false,
        error: this.createHttpError(500, endpoint),
      };
    }

    try {
      await new Promise((res) => setTimeout(res, 600));
      const resultData = DEFAULT_STREET_NEWS;
      this.saveToCache(cacheKey, resultData);

      return {
        success: true,
        data: resultData,
        isFromCache: false,
      };
    } catch (err: any) {
      return {
        success: false,
        data: this.getFromCache<StreetNewsItem[]>(cacheKey) || DEFAULT_STREET_NEWS,
        isFromCache: true,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Gagal memuat berita terkini dari server.',
          details: err?.message,
          timestamp: new Date().toLocaleTimeString('id-ID'),
          endpoint,
        },
      };
    }
  }

  // --------------------------------------------------------------------------
  // [TUGAS ORANG 1: LOGIN API DENGAN PEMBUATAN TOKEN (IMPLEMENT TOKEN)]
  // --------------------------------------------------------------------------
  public async login(
    username: string,
    password: string
  ): Promise<ApiResponse<{ token: string; user: { username: string; name: string } }>> {
    const endpoint = '/api/v1/auth/login';

    if (!networkService.isConnected()) {
      return {
        success: false,
        error: {
          code: 'OFFLINE',
          message: 'Tidak dapat masuk ke akun saat offline. Silakan aktifkan koneksi internet.',
          details: 'Offline mode is active',
          timestamp: new Date().toLocaleTimeString('id-ID'),
          endpoint,
        },
      };
    }

    await new Promise((res) => setTimeout(res, 900));

    if (this.simulationMode === 'error_500') {
      return {
        success: false,
        error: this.createHttpError(500, endpoint, 'Server autentikasi sedang bermasalah (500).'),
      };
    }

    if (!username.trim() || !password.trim()) {
      return {
        success: false,
        error: this.createHttpError(400, endpoint, 'Username dan kata sandi wajib diisi.'),
      };
    }

    const authRes = await authService.login(username, password);
    if (!authRes.success || !authRes.token) {
      return {
        success: false,
        error: this.createHttpError(401, endpoint, authRes.message || 'Login gagal.'),
      };
    }

    return {
      success: true,
      data: {
        token: authRes.token,
        user: {
          username: authRes.user?.username || username.trim(),
          name: authRes.user?.name || username.trim(),
        },
      },
    };
  }
}

export const apiService = new ApiService();
