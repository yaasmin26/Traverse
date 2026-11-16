import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Impor tipe data dan services asinkron
import { Todo, TabType, FilterType } from '../types/todo';
import {
  getTodos,
  createTodo,
  updateTodoStatus,
  deleteTodo,
  simulateNetworkError,
} from '../services/todoService';

export default function TodoListApp() {
  const router = useRouter();

  // -------------------------------------------------------------
  // STATE MANAGEMENT (React Hooks: useState)
  // -------------------------------------------------------------
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [activeTab, setActiveTab] = useState<TabType>('todos');
  const [filter, setFilter] = useState<FilterType>('all');

  // Fitur 02: State Loading & Status Asinkron
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Fitur 05: State Error Handling
  const [fetchError, setFetchError] = useState<string | null>(null);

  // -------------------------------------------------------------
  // FITUR 01 & 06: FETCH DATA (GET) & REFRESH DATA
  // Menggunakan useEffect & async/await untuk mengambil data dari server
  // -------------------------------------------------------------
  const loadTodos = useCallback(async (isRefresh: boolean = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setInitialLoading(true);
    }
    setFetchError(null);

    // Fitur 05: Error Handling dengan try...catch
    try {
      const data = await getTodos(10);
      setTodos(data);
    } catch (err: any) {
      const message = err.message || 'Gagal terhubung ke REST API server';
      setFetchError(message);
      Alert.alert(
        '⚠️ Gagal Mengambil Data',
        `${message}\n\nPastikan koneksi internet aktif untuk mengakses jsonplaceholder.typicode.com.`,
        [{ text: 'OK' }]
      );
    } finally {
      setInitialLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Fitur 01: GET data saat komponen dimuat pertama kali (Mount)
  useEffect(() => {
    loadTodos(false);
  }, [loadTodos]);

  // -------------------------------------------------------------
  // FITUR 03: MENAMBAHKAN TODO (POST)
  // Mengirim input teks ke REST API dengan metode POST
  // -------------------------------------------------------------
  const handleAddTodo = async () => {
    const trimmed = inputText.trim();

    // Validasi form input
    if (!trimmed) {
      Alert.alert('Peringatan', 'Silakan ketik nama tugas terlebih dahulu!', [{ text: 'OK' }]);
      return;
    }

    setSubmitting(true);

    // Fitur 05: Error Handling dengan try...catch
    try {
      const newTodoFromServer = await createTodo(trimmed);

      // JSONPlaceholder mengembalikan id: 201. Agar ID unik di sisi klien jika tambah beberapa kali:
      const uniqueNewTodo: Todo = {
        ...newTodoFromServer,
        id: Date.now(), // Unique ID untuk list lokal
        completed: false,
        isLocal: true,
      };

      // Tambahkan ke posisi paling atas
      setTodos((prev) => [uniqueNewTodo, ...prev]);
      setInputText('');

      Alert.alert('✅ Berhasil Menambah Tugas', `Tugas "${trimmed}" berhasil dikirim ke REST API (POST 201 Created)!`);
    } catch (err: any) {
      Alert.alert('❌ Gagal Menambahkan', err.message || 'Terjadi kesalahan saat POST data ke server');
    } finally {
      setSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // FITUR 04: UBAH STATUS TUGAS (PATCH)
  // Centang/toggle status selesai/belum secara dinamis melalui server
  // -------------------------------------------------------------
  const handleToggleTodo = async (todo: Todo) => {
    const targetStatus = !todo.completed;
    setTogglingId(todo.id);

    // Fitur 05: Error Handling dengan try...catch
    try {
      await updateTodoStatus(todo.id, targetStatus);

      // Perbarui status pada state lokal secara reaktif
      setTodos((prev) =>
        prev.map((item) => (item.id === todo.id ? { ...item, completed: targetStatus } : item))
      );
    } catch (err: any) {
      Alert.alert('❌ Gagal Mengubah Status', err.message || 'Gagal mengirim PATCH request ke server');
    } finally {
      setTogglingId(null);
    }
  };

  // -------------------------------------------------------------
  // FITUR TAMBAHAN: HAPUS TUGAS (DELETE)
  // Melengkapi siklus CRUD Async penuh
  // -------------------------------------------------------------
  const handleDeleteTodo = (todo: Todo) => {
    Alert.alert(
      'Hapus Tugas',
      `Apakah Anda yakin ingin menghapus "${todo.title}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            setDeletingId(todo.id);
            try {
              await deleteTodo(todo.id);
              setTodos((prev) => prev.filter((item) => item.id !== todo.id));
              Alert.alert('🗑️ Berhasil', 'Tugas berhasil dihapus dari daftar (DELETE 200 OK).');
            } catch (err: any) {
              Alert.alert('❌ Gagal Menghapus', err.message || 'Terjadi kesalahan saat menghapus data');
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  // -------------------------------------------------------------
  // FITUR 05: DEMONSTRASI ERROR HANDLING (Untuk Pengujian & Dosen/Aslab)
  // -------------------------------------------------------------
  const handleTestErrorSimulation = async () => {
    try {
      Alert.alert('Menguji Koneksi...', 'Mengirim permintaan ke endpoint invalid untuk menguji blok try...catch.');
      await simulateNetworkError();
    } catch (err: any) {
      // Menangkap error dan memberikan umpan balik Alert
      Alert.alert(
        '🛡️ Bukti Error Handling (try...catch)',
        `Error Berhasil Ditangkap:\n"${err.message}"\n\nAplikasi tidak crash dan tetap berjalan mulus!`,
        [{ text: 'Keren, Paham!' }]
      );
    }
  };

  // -------------------------------------------------------------
  // FILTER DATA
  // -------------------------------------------------------------
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'pending') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const completedCount = todos.filter((t) => t.completed).length;
  const pendingCount = todos.length - completedCount;

  // -------------------------------------------------------------
  // RENDER ITEM TODO
  // -------------------------------------------------------------
  const renderTodoItem = ({ item }: { item: Todo }) => {
    const isToggling = togglingId === item.id;
    const isDeleting = deletingId === item.id;

    return (
      <View style={[styles.todoCard, item.completed && styles.todoCardCompleted]}>
        {/* Fitur 04: Centang / Toggle Status (PATCH) */}
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => handleToggleTodo(item)}
          disabled={isToggling || isDeleting}
          activeOpacity={0.7}
        >
          {isToggling ? (
            <ActivityIndicator size="small" color="#2563eb" />
          ) : (
            <Ionicons
              name={item.completed ? 'checkbox' : 'square-outline'}
              size={24}
              color={item.completed ? '#10b981' : '#64748b'}
            />
          )}
        </TouchableOpacity>

        {/* Teks Judul Tugas */}
        <TouchableOpacity
          style={styles.todoTextContainer}
          onPress={() => handleToggleTodo(item)}
          disabled={isToggling || isDeleting}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.todoTitle,
              item.completed && styles.todoTitleCompleted,
            ]}
            numberOfLines={2}
          >
            {item.title}
          </Text>
          <Text style={styles.todoIdText}>
            ID #{item.id} {item.isLocal ? '• Lokal Baru' : '• Server API'}
          </Text>
        </TouchableOpacity>

        {/* Tombol Hapus Tugas (DELETE) */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteTodo(item)}
          disabled={isToggling || isDeleting}
          activeOpacity={0.7}
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color="#ef4444" />
          ) : (
            <Ionicons name="trash-outline" size={20} color="#94a3b8" />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  // -------------------------------------------------------------
  // TAMPILAN TAB 1: DAFTAR TODO
  // -------------------------------------------------------------
  const renderTodosTab = () => (
    <View style={styles.tabContent}>
      {/* Fitur 03: Form Input Teks & Tombol + Tambah */}
      <View style={styles.inputWrapper}>
        <View style={styles.inputBox}>
          <Ionicons name="create-outline" size={20} color="#64748b" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            placeholder="Tugas baru..."
            placeholderTextColor="#94a3b8"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleAddTodo}
            returnKeyType="done"
          />
          {inputText.length > 0 && (
            <TouchableOpacity onPress={() => setInputText('')}>
              <Ionicons name="close-circle" size={18} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[styles.addButton, submitting && styles.addButtonDisabled]}
          onPress={handleAddTodo}
          disabled={submitting}
          activeOpacity={0.8}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <Ionicons name="add" size={18} color="#ffffff" style={{ marginRight: 2 }} />
              <Text style={styles.addButtonText}>Tambah</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Bar Statistik & Filter */}
      <View style={styles.statusRow}>
        <View style={styles.statusChips}>
          <TouchableOpacity
            style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterChipText, filter === 'all' && styles.filterChipTextActive]}>
              Semua ({todos.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, filter === 'pending' && styles.filterChipActive]}
            onPress={() => setFilter('pending')}
          >
            <Text style={[styles.filterChipText, filter === 'pending' && styles.filterChipTextActive]}>
              Belum ({pendingCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, filter === 'completed' && styles.filterChipActive]}
            onPress={() => setFilter('completed')}
          >
            <Text style={[styles.filterChipText, filter === 'completed' && styles.filterChipTextActive]}>
              Selesai ({completedCount})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Fitur 06: Tombol Refresh Cepat */}
        <TouchableOpacity
          style={styles.quickReloadBtn}
          onPress={() => loadTodos(true)}
          disabled={refreshing || initialLoading}
          activeOpacity={0.7}
        >
          <Ionicons
            name="refresh-outline"
            size={18}
            color="#2563eb"
            style={refreshing ? { transform: [{ rotate: '45deg' }] } : {}}
          />
        </TouchableOpacity>
      </View>

      {/* Fitur 02: Loading Indicator saat data awal dimuat */}
      {initialLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingTitle}>Memuat Data dari Server...</Text>
          <Text style={styles.loadingSub}>GET https://jsonplaceholder.typicode.com/todos</Text>
        </View>
      ) : fetchError ? (
        // Fitur 05: Banner Error jika fetch gagal
        <View style={styles.errorContainer}>
          <Ionicons name="cloud-offline-outline" size={48} color="#ef4444" />
          <Text style={styles.errorTitle}>Koneksi Server Terputus</Text>
          <Text style={styles.errorSub}>{fetchError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => loadTodos(false)}>
            <Ionicons name="reload" size={16} color="#ffffff" style={{ marginRight: 6 }} />
            <Text style={styles.retryButtonText}>Coba Ambil Ulang Data</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Fitur 01: Daftar Tugas Utama (FlatList) */
        <FlatList
          data={filteredTodos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTodoItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          // Fitur 06: RefreshControl (Pull to Refresh)
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadTodos(true)}
              colors={['#2563eb']}
              tintColor="#2563eb"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="file-tray-outline" size={44} color="#94a3b8" />
              <Text style={styles.emptyTitle}>Tidak ada tugas dalam kategori ini</Text>
              <Text style={styles.emptySub}>Tambah tugas baru di atas atau ubah filter.</Text>
            </View>
          }
        />
      )}
    </View>
  );

  // -------------------------------------------------------------
  // TAMPILAN TAB 2: PENGATURAN & INFORMASI PENUGASAN
  // -------------------------------------------------------------
  const renderSettingsTab = () => (
    <ScrollView contentContainerStyle={styles.settingsContent} showsVerticalScrollIndicator={false}>
      {/* Kartu Header Info Tugas */}
      <View style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <Ionicons name="school-outline" size={24} color="#2563eb" />
          <Text style={styles.infoCardTitle}>Penugasan Praktik: Todo List Async</Text>
        </View>
        <Text style={styles.infoCardDesc}>
          Modul 3 (Week 8) Praktikum Pemrograman Mobile: Multi-Threading & Komputasi Asinkron di React Native dan Expo Go.
        </Text>

        <View style={styles.badgeRow}>
          <View style={styles.badgeSuccess}>
            <Text style={styles.badgeText}>Siklus Penuh CRUD Async</Text>
          </View>
          <View style={styles.badgeBlue}>
            <Text style={styles.badgeText}>Expo Go Ready</Text>
          </View>
        </View>
      </View>

      {/* 6 Fitur Wajib Checklist */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>6 Fitur Wajib Aplikasi (Terpenuhi)</Text>

        <View style={styles.featureItem}>
          <Ionicons name="checkmark-circle" size={20} color="#10b981" />
          <View style={styles.featureTextBox}>
            <Text style={styles.featureTitle}>01. Tampilkan Data API</Text>
            <Text style={styles.featureDesc}>GET /todos?_limit=10 menggunakan fetch() & useEffect().</Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Ionicons name="checkmark-circle" size={20} color="#10b981" />
          <View style={styles.featureTextBox}>
            <Text style={styles.featureTitle}>02. Loading Indicator</Text>
            <Text style={styles.featureDesc}>Komponen ActivityIndicator saat menunggu respon server API.</Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Ionicons name="checkmark-circle" size={20} color="#10b981" />
          <View style={styles.featureTextBox}>
            <Text style={styles.featureTitle}>03. Menambahkan Todo</Text>
            <Text style={styles.featureDesc}>Form input teks & metode POST /todos ke REST API.</Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Ionicons name="checkmark-circle" size={20} color="#10b981" />
          <View style={styles.featureTextBox}>
            <Text style={styles.featureTitle}>04. Ubah Status Tugas</Text>
            <Text style={styles.featureDesc}>Centang / toggle dinamis ke server melalui PATCH /todos/:id.</Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Ionicons name="checkmark-circle" size={20} color="#10b981" />
          <View style={styles.featureTextBox}>
            <Text style={styles.featureTitle}>05. Error Handling</Text>
            <Text style={styles.featureDesc}>Blok try...catch menangani kegagalan koneksi & Alert pesan umpan balik.</Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Ionicons name="checkmark-circle" size={20} color="#10b981" />
          <View style={styles.featureTextBox}>
            <Text style={styles.featureTitle}>06. Refresh Data</Text>
            <Text style={styles.featureDesc}>Tombol reload & pull-to-refresh untuk mengambil ulang data terbaru.</Text>
          </View>
        </View>
      </View>

      {/* Aksi Uji Coba & Testing */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>Pengujian & Alat Asisten Lab</Text>

        {/* Tombol Uji Error Handling */}
        <TouchableOpacity style={styles.actionBtnWarning} onPress={handleTestErrorSimulation}>
          <Ionicons name="bug-outline" size={18} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={styles.actionBtnText}>Uji Simulasi Error (try...catch Alert)</Text>
        </TouchableOpacity>

        {/* Tombol Reload Data */}
        <TouchableOpacity style={styles.actionBtnPrimary} onPress={() => loadTodos(true)}>
          <Ionicons name="refresh" size={18} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={styles.actionBtnText}>Muat Ulang Data Server (Re-fetch)</Text>
        </TouchableOpacity>

        {/* Akses ke Modul Sebelumnya (Traverse App) */}
        <TouchableOpacity
          style={styles.actionBtnSecondary}
          onPress={() => router.push('/home')}
        >
          <Ionicons name="compass-outline" size={18} color="#2563eb" style={{ marginRight: 8 }} />
          <Text style={styles.actionBtnSecondaryText}>Buka Aplikasi Traverse (Modul 2)</Text>
        </TouchableOpacity>
      </View>

      {/* Keterangan REST API */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>Informasi REST API</Text>
        <Text style={styles.codeText}>Host: https://jsonplaceholder.typicode.com</Text>
        <Text style={styles.codeText}>• GET   /todos?_limit=10</Text>
        <Text style={styles.codeText}>• POST  /todos</Text>
        <Text style={styles.codeText}>• PATCH /todos/:id</Text>
        <Text style={styles.codeText}>• DELETE /todos/:id</Text>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Top Header Aplikasi Sesuai Target Mockup */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerLogo}>
            <Ionicons name="checkbox" size={24} color="#2563eb" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Todo List App</Text>
            <Text style={styles.headerSubtitle}>Modul 3 • Asynchronous REST API</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => loadTodos(true)}
            disabled={refreshing || initialLoading}
            activeOpacity={0.7}
          >
            <Ionicons name="reload" size={20} color="#2563eb" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Konten Tab Utama */}
      <View style={styles.mainContainer}>
        {activeTab === 'todos' ? renderTodosTab() : renderSettingsTab()}
      </View>

      {/* Bottom Tab Bar (Target UI Mobile: Daftar Todo & Pengaturan) */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'todos' && styles.tabButtonActive]}
          onPress={() => setActiveTab('todos')}
          activeOpacity={0.8}
        >
          <Ionicons
            name={activeTab === 'todos' ? 'list' : 'list-outline'}
            size={22}
            color={activeTab === 'todos' ? '#2563eb' : '#64748b'}
          />
          <Text
            style={[styles.tabLabel, activeTab === 'todos' && styles.tabLabelActive]}
          >
            Daftar Todo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'settings' && styles.tabButtonActive]}
          onPress={() => setActiveTab('settings')}
          activeOpacity={0.8}
        >
          <Ionicons
            name={activeTab === 'settings' ? 'settings' : 'settings-outline'}
            size={22}
            color={activeTab === 'settings' ? '#2563eb' : '#64748b'}
          />
          <Text
            style={[styles.tabLabel, activeTab === 'settings' && styles.tabLabelActive]}
          >
            Pengaturan
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  inputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    height: '100%',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f59e0b', // Aksen orange/amber sesuai slide target mockup
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 12,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonDisabled: {
    backgroundColor: '#cbd5e1',
    shadowOpacity: 0,
    elevation: 0,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusChips: {
    flexDirection: 'row',
    gap: 6,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  quickReloadBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
  },
  listContent: {
    paddingBottom: 24,
  },
  todoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  todoCardCompleted: {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
    opacity: 0.85,
  },
  checkboxContainer: {
    marginRight: 12,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todoTextContainer: {
    flex: 1,
    marginRight: 8,
  },
  todoTitle: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#1e293b',
    lineHeight: 20,
  },
  todoTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#94a3b8',
    fontWeight: 'normal',
  },
  todoIdText: {
    fontSize: 10.5,
    color: '#94a3b8',
    marginTop: 3,
  },
  deleteButton: {
    padding: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingTitle: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
  },
  loadingSub: {
    marginTop: 4,
    fontSize: 11,
    color: '#64748b',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ef4444',
    marginTop: 12,
  },
  errorSub: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 18,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  bottomTabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingBottom: 12,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {},
  tabLabel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
  settingsContent: {
    padding: 16,
    paddingBottom: 40,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginLeft: 8,
  },
  infoCardDesc: {
    fontSize: 12.5,
    color: '#64748b',
    lineHeight: 18,
    marginTop: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  badgeSuccess: {
    backgroundColor: '#dcfce7',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  badgeBlue: {
    backgroundColor: '#dbeafe',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#166534',
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  featureTextBox: {
    marginLeft: 10,
    flex: 1,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  featureDesc: {
    fontSize: 11.5,
    color: '#64748b',
    marginTop: 2,
    lineHeight: 16,
  },
  actionBtnWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  actionBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  actionBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingVertical: 12,
    borderRadius: 10,
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  actionBtnSecondaryText: {
    color: '#2563eb',
    fontSize: 13,
    fontWeight: 'bold',
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 11.5,
    color: '#475569',
    backgroundColor: '#f1f5f9',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
});
