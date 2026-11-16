/**
 * types/demo.ts
 * Struktur data (Interface) untuk menampung respon API eksternal
 */

export interface TravelStory {
  id: number;
  title: string;
  body: string;
  tags?: string[];
  views?: number;
}

export interface ApiResponse<T> {
  posts: T[];
  total: number;
  skip: number;
  limit: number;
}
