// ENTIDADES PRINCIPAIS DA API WGER
/**
 * Representa um exercício físico da API Wger
 * Contém todas as informações necessárias para exibir e filtrar exercícios
 */
export interface Exercise {
  id: number;
  name: string;
  uuid: string;
  description: string;
  category: number;
  muscles: number[];
  muscles_secondary: number[];
  equipment: number[];
  language: number;
  images: ExerciseImage[];
  variations: number[];
  creation_date?: string;
  update_date?: string;
}

/**
 * Representa uma imagem de exercício
 * Cada exercício pode ter múltiplas imagens
 */
export interface ExerciseImage {
  id: number;
  image: string;
  is_main: boolean;
  exercise: number;
  license?: number;
  license_author?: string;
}

/**
 * Categoria de exercício (ex: Arms, Legs, Chest)
 */
export interface Category {
  id: number;
  name: string;
}

/**
 * Músculo trabalhado no exercício
 */
export interface Muscle {
  id: number;
  name: string;
  name_en: string;
  is_front: boolean;
  image_url_main: string;
  image_url_secondary: string;
}

/**
 * Equipamento necessário para o exercício
 */
export interface Equipment {
  id: number;
  name: string;
}

/**
 * Resposta paginada da API Wger
 * Tipo genérico que envolve arrays de dados com metadados de paginação
 */
export interface WgerApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

//AUTENTICAÇÃO & UTILIZADOR (FIREBASE)
/**
 * Utilizador autenticado via Firebase
 * Armazena dados do perfil do Google
 */
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: FirebaseTimestamp;
  lastLogin: FirebaseTimestamp;
}

/**
 * Exercício favorito guardado no Firestore
 * Associado ao UID do utilizador
 */
export interface Favorite {
  exerciseId: number;
  exerciseName: string;
  category: string;
  imageUrl: string;
  addedAt: FirebaseTimestamp;
  lastViewed?: FirebaseTimestamp;
}

/**
 * Timestamp do Firestore
 * Formato nativo do Firebase para datas
 */
export interface FirebaseTimestamp {
  seconds: number;
  nanoseconds: number;
}

//ESTADO DA APLICAÇÃO
/**
 * Estado dos filtros de pesquisa de exercícios
 */
export interface FilterState {
  category: number | null;
  muscle: number | null;
  equipment: number | null;
  searchQuery: string;
}

/**
 * Estado da paginação
 * Controla a navegação entre páginas de resultados
 */
export interface PaginationState {
  currentPage: number;
  totalPages: number;
  limit: number;
  offset: number;
  totalResults: number;
}

/**
 * Estado da autenticação
 * Gerido pelo contexto AuthContext
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Item armazenado em cache
 * Usado para cache de dados da API no localStorage
 */
export interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

//PROPS DE COMPONENTES
/**
 * Props do componente ExerciseCard
 */
export interface ExerciseCardProps {
  exercise: Exercise;
  isFavorite?: boolean;
  onFavoriteToggle?: (exerciseId: number) => void;
}

/**
 * Props do componente ExerciseDetails
 */
export interface ExerciseDetailsProps {
  exercise: Exercise;
  onFavorite?: () => void;
  isFavorite?: boolean;
  isLoadingFavorite?: boolean;
}

/**
 * Props do componente ExerciseGrid
 */
export interface ExerciseGridProps {
  exercises: Exercise[];
  isLoading: boolean;
  error?: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

/**
 * Props do componente FilterMenu
 * Menu lateral de filtros de pesquisa
 */
export interface FilterMenuProps {
  categories: Category[];
  muscles: Muscle[];
  equipment: Equipment[];
  currentFilter: FilterState;
  onFilterChange: (filter: Partial<FilterState>) => void;
}

/**
 * Props do componente Navbar
 * Barra de navegação superior
 */
export interface NavbarProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
}

/**
 * Props do componente Pagination
 * Controles de navegação entre páginas
 */
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// API & REQUISIÇÕES
/**
 * Parâmetros para buscar exercícios da API Wger
 */
export interface FetchExercisesParams {
  language?: number;
  limit?: number;
  offset?: number;
  category?: number;
  muscle?: number;
  equipment?: number;
}

/**
 * Erro retornado pela API
 * Estrutura padronizada para tratamento de erros
 */ export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// PWA (PROGRESSIVE WEB APP)
/**
 * Evento de instalação do PWA
 * Permite capturar o prompt de instalação do navegador
 */
export interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Estado do PWA
 * Controla a instalabilidade e prompts
 */
export interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  showPrompt: boolean;
  deferredPrompt: InstallPromptEvent | null;
}

/**
 * Estado do Service Worker
 * Controla cache e sincronização offline
 */
export interface ServiceWorkerState {
  isOnline: boolean;
  isCacheReady: boolean;
  lastSync: number | null;
}

// FORMULÁRIOS

/**
 * Dados do formulário de pesquisa
 */
export interface SearchFormData {
  query: string;
}

/**
 * Dados do formulário de login
 * (Nota: No ExeFit usamos Google OAuth, mas mantido para futura expansão)
 */
export interface LoginFormData {
  email: string;
  password: string;
}

//  UTILITY TYPES

//Torna um tipo nullable (pode ser T ou null)
export type Nullable<T> = T | null;

//Torna um tipo opcional (pode ser T ou undefined)
export type Optional<T> = T | undefined;

/**
 * Wrapper para dados assíncronos
 * Usado em hooks customizados para gerir estado de loading/error
 */
export type AsyncData<T> = {
  data: T | null;
  isLoading: boolean;
  error: string | null;
};

// ENUMS & CONSTANTES

/**
 * Chaves de rotas da aplicação
 * Usado para navegação tipada
 */
export type RouteKey = "HOME" | "FAVORITES" | "EXERCISE_DETAILS";

/**
 * Tipos de toast/notificação
 * Usado no sistema de notificações
 */
export type ToastType = "success" | "error" | "warning" | "info";

/**
 * Modos de tema da aplicação
 * 'light' = claro, 'dark' = escuro, 'system' = segue preferência do SO
 */
export type ThemeMode = "light" | "dark" | "system";

// AUTH CONTEXT
/**
 * Interface do contexto de autenticação
 */
export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

/**
 * Props do AuthProvider
 */
export interface AuthProviderProps {
  children: React.ReactNode;
}
