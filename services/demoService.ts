import { TravelStory, ApiResponse } from '../types/demo';

/**
 * services/demoService.ts
 * Berisi fungsi-fungsi asynchronous dan promise untuk aplikasi Traverse
 */

/**
 * 1. Mengambil cerita/ulasan perjalanan dari API Publik Eksternal
 * - Custom Async Function: Menggunakan kata kunci async/await
 * - Pre-built Async Function: Memanggil fetch() dan response.json()
 * - Mengubah data berdasarkan destinasi yang dipilih menggunakan parameter 'skip'
 */
export const getTravelStories = async (destination: string = 'Gunung Bromo'): Promise<TravelStory[]> => {
  // Sederhana: Tentukan skip data agar ulasan tiap destinasi berbeda
  let skip = 0;
  if (destination === 'Pantai Kuta') {
    skip = 2;
  } else if (destination === 'Ranu Kumbolo') {
    skip = 4;
  }

  const response = await fetch(`https://dummyjson.com/posts?limit=2&skip=${skip}`);

  if (!response.ok) {
    throw new Error('Gagal terhubung ke server API eksternal.');
  }

  const data: ApiResponse<TravelStory> = await response.json();
  return data.posts;
};

/**
 * 2. Simulasi pengecekan kuota tiket wisata
 * - Menggunakan Promise Constructor: new Promise((resolve, reject) => ...)
 * - resolve() dipanggil jika tiket tersedia
 * - reject() dipanggil jika kuota tiket habis (misal: Ranu Kumbolo)
 */
export const checkTicketQuota = (destination: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Simulasi jeda waktu async 1.2 detik
    setTimeout(() => {
      if (destination === 'Ranu Kumbolo') {
        // Simulasi kondisi gagal / reject
        reject(`Maaf, kuota tiket untuk ${destination} hari ini sudah penuh!`);
      } else {
        // Simulasi kondisi sukses / resolve
        resolve(`Tiket untuk ${destination} tersedia. Kuota masih aman!`);
      }
    }, 1200);
  });
};
