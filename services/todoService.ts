import { Todo } from '../types/todo';

/**
 * services/todoService.ts
 * Layanan komunikasi REST API Asinkron untuk Penugasan Modul 3 (Week 8)
 * Rekomendasi API: https://jsonplaceholder.typicode.com
 *
 * Menerapkan:
 * - Fitur 01: GET /todos?_limit=10 (Mengambil 10 daftar tugas awal)
 * - Fitur 03: POST /todos (Simulasi menambah tugas baru)
 * - Fitur 04: PATCH /todos/:id (Simulasi update status selesai)
 * - CRUD Lengkap: DELETE /todos/:id (Hapus tugas)
 * - Fitur 05: try...catch penanganan error
 */

const BASE_URL = 'https://jsonplaceholder.typicode.com/todos';

/**
 * 01. Tampilkan Data API (GET /todos?_limit=10)
 * Menggunakan async/await & fetch() untuk mengambil data dari server.
 */
export const getTodos = async (limit: number = 10): Promise<Todo[]> => {
  const response = await fetch(`${BASE_URL}?_limit=${limit}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Gagal memuat data dari server! Status: ${response.status}`);
  }

  const data: Todo[] = await response.json();
  return data;
};

/**
 * 03. Menambahkan Todo (POST /todos)
 * Mengirim payload tugas baru ke server menggunakan metode POST.
 */
export const createTodo = async (title: string): Promise<Todo> => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({
      title,
      completed: false,
      userId: 1,
    }),
  });

  if (!response.ok) {
    throw new Error(`Gagal menambahkan tugas ke server! Status: ${response.status}`);
  }

  const data: Todo = await response.json();
  return data;
};

/**
 * 04. Ubah Status Tugas (PATCH /todos/:id)
 * Mengubah status 'completed' tugas secara dinamis melalui server.
 * Catatan: Jika ID > 200 (data lokal baru hasil POST), gunakan ID 1 agar mock server JSONPlaceholder merespons 200 OK.
 */
export const updateTodoStatus = async (id: number, completed: boolean): Promise<Todo> => {
  const targetId = id > 200 ? 1 : id;

  const response = await fetch(`${BASE_URL}/${targetId}`, {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({
      completed,
    }),
  });

  if (!response.ok) {
    throw new Error(`Gagal memperbarui status tugas di server! Status: ${response.status}`);
  }

  const data: Todo = await response.json();
  return data;
};

/**
 * Hapus Todo (DELETE /todos/:id)
 * Melengkapi siklus penuh CRUD Async.
 */
export const deleteTodo = async (id: number): Promise<boolean> => {
  const targetId = id > 200 ? 1 : id;

  const response = await fetch(`${BASE_URL}/${targetId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Gagal menghapus tugas dari server! Status: ${response.status}`);
  }

  return true;
};

/**
 * 05. Simulasi Error untuk Uji Coba try...catch & Alert
 * Mengirim permintaan ke endpoint yang salah guna membuktikan error handling.
 */
export const simulateNetworkError = async (): Promise<never> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/endpoint_error_404_testing');
  if (!response.ok) {
    throw new Error(`Simulasi Kesalahan Server: Endpoint tidak ditemukan (Status: ${response.status}). Blok try...catch berhasil menangkap error!`);
  }
  throw new Error('Terjadi kesalahan jaringan buatan.');
};
