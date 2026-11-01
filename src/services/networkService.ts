import { Platform } from 'react-native';

export type NetworkStatusListener = (isOnline: boolean) => void;

class NetworkService {
  private isOnlineStatus: boolean = true;
  private isSimulatedOffline: boolean = false;
  private listeners: Set<NetworkStatusListener> = new Set();
  private pingEndpoint: string = 'https://jsonplaceholder.typicode.com/todos/1';

  constructor() {
    this.init();
  }

  private init() {
    // 1. Deteksi awal di lingkungan Web Browser
    if (Platform.OS === 'web' && typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      this.isOnlineStatus = navigator.onLine;

      window.addEventListener('online', () => {
        if (!this.isSimulatedOffline) {
          this.setOnline(true);
        }
      });

      window.addEventListener('offline', () => {
        this.setOnline(false);
      });
    } else {
      // Default online untuk mobile
      this.isOnlineStatus = true;
    }
  }

  /**
   * Cek status koneksi saat ini (memperhitungkan mode simulasi offline)
   */
  public isConnected(): boolean {
    if (this.isSimulatedOffline) {
      return false;
    }
    return this.isOnlineStatus;
  }

  /**
   * Mengaktifkan/menonaktifkan simulasi mode offline (sangat berguna untuk demo pengujian)
   */
  public setSimulatedOfflineMode(simulated: boolean) {
    this.isSimulatedOffline = simulated;
    this.notifyListeners(this.isConnected());
  }

  public getIsSimulatedOffline(): boolean {
    return this.isSimulatedOffline;
  }

  /**
   * Ping server nyata untuk memvalidasi apakah koneksi internet benar-benar aktif
   */
  public async checkRealConnection(): Promise<boolean> {
    if (this.isSimulatedOffline) {
      return false;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      // Menggunakan fetch ringan dengan timestamp untuk mencegah cache
      const response = await fetch(`${this.pingEndpoint}?_t=${Date.now()}`, {
        method: 'HEAD',
        cache: 'no-cache',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const online = response.ok || response.status < 500;
      this.setOnline(online);
      return online;
    } catch {
      // Jika fetch gagal (karena timeout / tanpa koneksi)
      this.setOnline(false);
      return false;
    }
  }

  private setOnline(online: boolean) {
    if (this.isOnlineStatus !== online) {
      this.isOnlineStatus = online;
      this.notifyListeners(this.isConnected());
    }
  }

  private notifyListeners(status: boolean) {
    this.listeners.forEach((listener) => {
      try {
        listener(status);
      } catch (err) {
        console.warn('Network listener error:', err);
      }
    });
  }

  public addListener(listener: NetworkStatusListener): () => void {
    this.listeners.add(listener);
    // Langsung beri status saat ini
    listener(this.isConnected());
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const networkService = new NetworkService();

