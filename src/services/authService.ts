/**
 * ============================================================================
 * [TUGAS ORANG 1: IMPLEMENT TOKEN, ATTACH TOKEN, & PROTECT SESSION]
 * Manajemen Autentikasi Pengguna, Penyimpanan Token JWT, dan Proteksi Sesi
 * ============================================================================
 */
import { AuthUser, AuthSession, AuthTokenResponse } from '../types/apiTypes';
import { networkService } from './networkService';

class AuthService {
  private currentToken: string | null = 'traverse_jwt_token_sample_2026';
  private currentUser: AuthUser | null = {
    id: 'user-001',
    username: 'Yaasmin',
    name: 'Yaasmin',
    email: 'priasigma@gmail.com',
    role: 'user',
  };

  constructor() {
    this.restoreToken();
  }

  private restoreToken() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedToken = window.localStorage.getItem('traverse_auth_token');
        if (savedToken) {
          this.currentToken = savedToken;
        }
      }
    } catch {}
  }

  // --------------------------------------------------------------------------
  // 1. [IMPLEMENT TOKEN]: Pembuatan dan Penyimpanan Token Login
  // --------------------------------------------------------------------------
  public async login(username: string, password: string): Promise<AuthTokenResponse> {
    // Validasi Offline
    if (!networkService.isConnected()) {
      return {
        success: false,
        message: 'Tidak dapat melakukan login dalam mode offline. Pastikan koneksi internet aktif.',
      };
    }

    // Simulasi delay autentikasi server
    await new Promise((res) => setTimeout(res, 800));

    if (!username.trim() || !password.trim()) {
      return {
        success: false,
        message: 'Username dan kata sandi wajib diisi.',
      };
    }

    // Simulasi respons server dengan JWT Bearer Token
    const generatedToken = `jwt_bearer_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    this.currentToken = generatedToken;
    this.currentUser = {
      id: `usr_${Date.now()}`,
      username: username.trim(),
      name: username.trim(),
      email: `${username.trim().toLowerCase()}@traverse.id`,
      role: 'user',
    };

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('traverse_auth_token', generatedToken);
      }
    } catch {}

    return {
      success: true,
      token: generatedToken,
      user: this.currentUser,
      message: 'Login berhasil! Token sesi telah diterbitkan.',
    };
  }

  // --------------------------------------------------------------------------
  // 2. [ATTACH TOKEN]: Menempelkan Token ke Header Request API
  // --------------------------------------------------------------------------
  public getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (this.currentToken) {
      headers['Authorization'] = `Bearer ${this.currentToken}`;
      headers['X-Traverse-Client'] = 'Mobile-App-v1.0';
    }

    return headers;
  }

  // --------------------------------------------------------------------------
  // 3. [PROTECT SESSION]: Validasi & Proteksi Sesi Pengguna
  // --------------------------------------------------------------------------
  public isAuthenticated(): boolean {
    return this.currentToken !== null && this.currentToken.length > 0;
  }

  public getToken(): string | null {
    return this.currentToken;
  }

  public getUser(): AuthUser | null {
    return this.currentUser;
  }

  public setToken(token: string | null) {
    this.currentToken = token;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        if (token) {
          window.localStorage.setItem('traverse_auth_token', token);
        } else {
          window.localStorage.removeItem('traverse_auth_token');
        }
      }
    } catch {}
  }

  public logout() {
    this.currentToken = null;
    this.currentUser = null;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem('traverse_auth_token');
      }
    } catch {}
  }

  /**
   * Pengecekan apakah sebuah halaman/fitur membutuhkan sesi terautentikasi (Protected Route)
   */
  public isRouteProtected(screen: string): boolean {
    const protectedRoutes = ['MainTabs', 'ProfileSetup', 'TravelRecap', 'PaymentReceipt', 'QRISPayment'];
    return protectedRoutes.includes(screen);
  }
}

export const authService = new AuthService();
