export interface Todo {
  id: number;
  userId?: number;
  title: string;
  completed: boolean;
  isLocal?: boolean;
}

export type TabType = 'todos' | 'settings';

export type FilterType = 'all' | 'pending' | 'completed';

export interface ApiState {
  loading: boolean;
  refreshing: boolean;
  submitting: boolean;
  togglingId: number | null;
  deletingId: number | null;
  error: string | null;
}
