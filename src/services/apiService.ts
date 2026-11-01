import { networkService } from './networkService';
import { AppAssets } from '../assets';

/**
 * ============================================================================
 * [MODUL API: PENANGANAN ERROR & MANAJEMEN STATE ASINKRON]
 * Struktur Tipe Data Error API dan Respons Asinkron
 * ============================================================================
 */
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

export type SimulationMode = 'none' | 'error_500' | 'error_404' | 'timeout' | 'slow_network';

// Model Data untuk API Destinasi & Berita
export interface DestinationItem {
  readonly id: string;
  name: string;
  image: any;
  province?: string;
  rating?: number;
  description?: string;
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
}

// Data Mock & Fallback Default
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
  private defaultTimeoutMs: number = 6000;

  constructor() {
    // Inisialisasi cache awal
    this.cache.set('destinations', DEFAULT_DESTINATIONS);
    this.cache.set('street_news', DEFAULT_STREET_NEWS);
    this.cache.set('travel_plans', DEFAULT_TRAVEL_PLANS);
    this.loadCacheFromStorage();
  }

  private loadCacheFromStorage() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedDest = window.localStorage.getItem('traverse_cache_destinations');
        if (savedDest) {
          // Hanya jika ada saved data
        }
      }
    } catch {
      // Abaikan jika localStorage tidak didukung
    }
  }

  private saveToCache<T>(key: string, data: T) {
    this.cache.set(key, data);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(`traverse_cache_${key}`, JSON.stringify(data));
      }
    } catch {
      // Fail-safe
    }
  }

  private getFromCache<T>(key: string): T | null {
    if (this.cache.has(key)) {
      return this.cache.get(key) as T;
    }
    return null;
  }

  /**
   * Mengatur mode simulasi untuk demonstrasi pengujian (404, 500, Timeout, Slow Network)
   */
  public setSimulationMode(mode: SimulationMode) {
    this.simulationMode = mode;
  }

  public getSimulationMode(): SimulationMode {
    return this.simulationMode;
  }

  /**
   * Helper parsing pesan error berdasarkan status code HTTP
   */
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
        message = 'Autentikasi gagal (401 Unauthorized). Silakan login ulang.';
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

  /**
   * 1. API: Mendapatkan Daftar Destinasi Populer
   * Dilengkapi error handling, offline caching, dan simulasi pengujian
   */
  public async getDestinations(): Promise<ApiResponse<DestinationItem[]>> {
    const cacheKey = 'destinations';
    const endpoint = '/api/v1/destinations/popular';

    // 1. Cek Kondisi Offline
    if (!networkService.isConnected()) {
      const cached = this.getFromCache<DestinationItem[]>(cacheKey) || DEFAULT_DESTINATIONS;
      return {
        success: false,
        data: cached,
        isFromCache: true,
        error: {
          code: 'OFFLINE',
          message: 'Mode Offline: Tidak ada koneksi internet. Menampilkan data lokal (Cache).',
          details: 'Periksa sinyal Wi-Fi atau data seluler Anda.',
          timestamp: new Date().toLocaleTimeString('id-ID'),
          endpoint,
        },
      };
    }

    // 2. Simulasi Error untuk Demonstrasi Tugas / Praktikum
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
          details: 'Waktu tunggu melebihi batas toleransi 3000ms.',
          timestamp: new Date().toLocaleTimeString('id-ID'),
          endpoint,
        },
      };
    }

    // 3. Eksekusi Request Asli / Simulasi Delay Network
    try {
      const delay = this.simulationMode === 'slow_network' ? 2500 : 700;
      await new Promise((res) => setTimeout(res, delay));

      // Berhasil: Simpan ke cache untuk offline handling
      const resultData = DEFAULT_DESTINATIONS;
      this.saveToCache(cacheKey, resultData);

      return {
        success: true,
        data: resultData,
        isFromCache: false,
      };
    } catch (err: any) {
      // Tangani Unexpected Network Failure
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

  /**
   * 2. API: Mendapatkan Berita Lalu Lintas Terbaru (Street News)
   */
  public async getStreetNews(): Promise<ApiResponse<StreetNewsItem[]>> {
    const cacheKey = 'street_news';
    const endpoint = '/api/v1/news/traffic-stream';

    if (!networkService.isConnected()) {
      const cached = this.getFromCache<StreetNewsItem[]>(cacheKey) || DEFAULT_STREET_NEWS;
      return {
        success: false,
        data: cached,
        isFromCache: true,
        error: {
          code: 'OFFLINE',
          message: 'Mode Offline: Memuat berita tersimpan di memori perangkat.',
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

  /**
   * 3. API: Operasi CRUD Rencana Perjalanan (Simulasi API Server)
   */
  public async getTravelPlans(): Promise<ApiResponse<TravelPlanItem[]>> {
    const cacheKey = 'travel_plans';
    const endpoint = '/api/v1/travel-plans';

    if (!networkService.isConnected()) {
      const cached = this.getFromCache<TravelPlanItem[]>(cacheKey) || DEFAULT_TRAVEL_PLANS;
      return {
        success: false,
        data: cached,
        isFromCache: true,
        error: {
          code: 'OFFLINE',
          message: 'Offline: Menampilkan data rencana dari penyimpanan lokal.',
          details: 'Data disinkronkan saat koneksi tersedia kembali.',
          timestamp: new Date().toLocaleTimeString('id-ID'),
          endpoint,
        },
      };
    }

    try {
      await new Promise((res) => setTimeout(res, 500));
      const current = this.getFromCache<TravelPlanItem[]>(cacheKey) || DEFAULT_TRAVEL_PLANS;
      return {
        success: true,
        data: current,
        isFromCache: false,
      };
    } catch (err: any) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Gagal mengambil data rencana perjalanan.',
          details: err?.message,
          timestamp: new Date().toLocaleTimeString('id-ID'),
          endpoint,
        },
      };
    }
  }

  /**
   * 4. API: Otentikasi Login Pengguna
   */
  public async login(
    username: string,
    password: string
  ): Promise<ApiResponse<{ token: string; user: { username: string; name: string } }>> {
    const endpoint = '/api/v1/auth/login';

    // Cek Offline
    if (!networkService.isConnected()) {
      return {
        success: false,
        error: {
          code: 'OFFLINE',
          message: 'Tidak dapat masuk ke akun saat offline. Silakan sambungkan koneksi internet.',
          details: 'Offline mode is active',
          timestamp: new Date().toLocaleTimeString('id-ID'),
          endpoint,
        },
      };
    }

    // Simulasi delay jaringan
    await new Promise((res) => setTimeout(res, 1000));

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

    // Berhasil Login
    return {
      success: true,
      data: {
        token: `jwt_token_${Date.now()}`,
        user: {
          username: username.trim(),
          name: username.trim(),
        },
      },
    };
  }
}

export const apiService = new ApiService();
