// ========================================
// EXEFIT PWA - ALL TYPESCRIPT TYPES
// File Location: src/entities/types.ts
// ========================================
// ⚠️ IMPORTANT: All TypeScript types for the application are defined in this single file
// This follows best practices for type organization and maintainability
// ========================================

// ========================================
// WGER API TYPES
// ========================================

export interface Exercise {
  id: number;
  name: string;
  uuid: string;
  description: string; // HTML content
  category: number;
  muscles: number[];
  muscles_secondary: number[];
  equipment: number[];
  language: number; // 2 = English
  images: ExerciseImage[];
  variations: number[];
  creation_date?: string;
  update_date?: string;
}

export interface ExerciseImage {
  id: number;
  image: string; // URL
  is_main: boolean;
  exercise: number;
  license?: number;
  license_author?: string;
}

export interface Category {
  id: number;
  name: string; // "Abs", "Arms", "Back", etc.
}

export interface Muscle {
  id: number;
  name: string; // "Abdominals", "Biceps", etc.
  is_front: boolean;
  image_url_main: string;
  image_url_secondary: string;
}

export interface Equipment {
  id: number;
  name: string; // "Barbell", "Dumbbell", "Bench", etc.
}

export interface WgerApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ========================================
// FIREBASE TYPES
// ========================================

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: FirebaseTimestamp;
  lastLogin: FirebaseTimestamp;
}

export interface Favorite {
  exerciseId: number;
  exerciseName: string;
  category: string;
  imageUrl: string;
  addedAt: FirebaseTimestamp;
  lastViewed?: FirebaseTimestamp;
}

export interface FirebaseTimestamp {
  seconds: number;
  nanoseconds: number;
}

// ========================================
// UI STATE TYPES
// ========================================

export interface FilterState {
  category: number | null;
  muscle: number | null;
  equipment: number | null;
  searchQuery: string;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  limit: number;
  offset: number;
  totalResults: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number; // milliseconds
}

// ========================================
// COMPONENT PROPS TYPES
// ========================================

export interface ExerciseCardProps {
  exercise: Exercise;
  isFavorite?: boolean;
  onFavoriteToggle?: (exerciseId: number) => void;
}

export interface ExerciseGridProps {
  exercises: Exercise[];
  isLoading: boolean;
  error?: string;
}

export interface FilterMenuProps {
  categories: Category[];
  muscles: Muscle[];
  equipment: Equipment[];
  currentFilter: FilterState;
  onFilterChange: (filter: Partial<FilterState>) => void;
}

export interface NavbarProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// ========================================
// API TYPES
// ========================================

export interface FetchExercisesParams {
  language?: number;
  limit?: number;
  offset?: number;
  category?: number;
  muscle?: number;
  equipment?: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// ========================================
// PWA TYPES
// ========================================

export interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  showPrompt: boolean;
  deferredPrompt: InstallPromptEvent | null;
}

export interface ServiceWorkerState {
  isOnline: boolean;
  isCacheReady: boolean;
  lastSync: number | null;
}

// ========================================
// FORM TYPES
// ========================================

export interface SearchFormData {
  query: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

// ========================================
// UTILITY TYPES
// ========================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncData<T> = {
  data: T | null;
  isLoading: boolean;
  error: string | null;
};

// ========================================
// CONSTANTS TYPES
// ========================================

export type RouteKey = 'HOME' | 'FAVORITES' | 'EXERCISE_DETAILS';
export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type ThemeMode = 'light' | 'dark' | 'system';
