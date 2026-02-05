import type { Exercise, CachedExercise, CacheConfig } from "@/entities/types";

/**
 * Configuração padrão do cache de exercícios
 */
const DEFAULT_CONFIG: CacheConfig = {
  maxExercises: 50,
  expirationTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
  storageKey: "exefit-exercise-cache",
};

/**
 * Verifica se estamos no browser (SSR-safe)
 */
const isBrowser = typeof window !== "undefined";

/**
 * Guarda um exercício no cache do localStorage
 * Mantém apenas os últimos 50 exercícios visitados
 * 
 * @param {Exercise} exercise - Exercício a ser cacheado
 * @param {CacheConfig} config - Configuração customizada (opcional)
 * 
 * @example
 * ```ts
 * cacheExercise(exercise);
 * ```
 */
export function cacheExercise(
  exercise: Exercise,
  config: Partial<CacheConfig> = {}
): void {
  if (!isBrowser) {
    console.warn("[Cache] Not in browser environment");
    return;
  }

  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  try {
    // Obter cache existente
    const cachedData = getCachedExercises(finalConfig);

    // Remover exercício se já existe (para atualizar timestamp)
    const filtered = cachedData.filter((item) => item.exercise.id !== exercise.id);

    // Adicionar novo exercício no início
    const newCache: CachedExercise = {
      exercise,
      cachedAt: Date.now(),
    };

    filtered.unshift(newCache);

    // Manter apenas os últimos maxExercises
    const trimmed = filtered.slice(0, finalConfig.maxExercises);

    // Salvar no localStorage
    localStorage.setItem(finalConfig.storageKey, JSON.stringify(trimmed));

    console.log(`[Cache] Cached exercise: ${exercise.name} (${exercise.id})`);
  } catch (error) {
    console.error("[Cache] Error caching exercise:", error);
  }
}

/**
 * Obtém todos os exercícios cacheados
 * Remove exercícios expirados automaticamente
 * 
 * @param {CacheConfig} config - Configuração customizada (opcional)
 * @returns {CachedExercise[]} Array de exercícios cacheados
 * 
 * @example
 * ```ts
 * const cached = getCachedExercises();
 * console.log(`${cached.length} exercises in cache`);
 * ```
 */
export function getCachedExercises(
  config: Partial<CacheConfig> = {}
): CachedExercise[] {
  if (!isBrowser) {
    return [];
  }

  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  try {
    const stored = localStorage.getItem(finalConfig.storageKey);

    if (!stored) {
      return [];
    }

    const parsed: CachedExercise[] = JSON.parse(stored);
    const now = Date.now();

    // Filtrar exercícios expirados
    const valid = parsed.filter((item) => {
      const age = now - item.cachedAt;
      return age < finalConfig.expirationTime;
    });

    // Se removemos alguns, salvar versão limpa
    if (valid.length !== parsed.length) {
      localStorage.setItem(finalConfig.storageKey, JSON.stringify(valid));
      console.log(`[Cache] Removed ${parsed.length - valid.length} expired exercises`);
    }

    return valid;
  } catch (error) {
    console.error("[Cache] Error reading cache:", error);
    return [];
  }
}

/**
 * Busca um exercício específico no cache
 * 
 * @param {number} exerciseId - ID do exercício
 * @param {CacheConfig} config - Configuração customizada (opcional)
 * @returns {Exercise | null} Exercício encontrado ou null
 * 
 * @example
 * ```ts
 * const exercise = getCachedExercise(123);
 * if (exercise) {
 *   console.log("Found in cache:", exercise.name);
 * }
 * ```
 */
export function getCachedExercise(
  exerciseId: number,
  config: Partial<CacheConfig> = {}
): Exercise | null {
  const cached = getCachedExercises(config);
  const found = cached.find((item) => item.exercise.id === exerciseId);
  return found ? found.exercise : null;
}

/**
 * Remove um exercício específico do cache
 * 
 * @param {number} exerciseId - ID do exercício a remover
 * @param {CacheConfig} config - Configuração customizada (opcional)
 * 
 * @example
 * ```ts
 * removeCachedExercise(123);
 * ```
 */
export function removeCachedExercise(
  exerciseId: number,
  config: Partial<CacheConfig> = {}
): void {
  if (!isBrowser) return;

  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  try {
    const cached = getCachedExercises(finalConfig);
    const filtered = cached.filter((item) => item.exercise.id !== exerciseId);

    localStorage.setItem(finalConfig.storageKey, JSON.stringify(filtered));
    console.log(`[Cache] Removed exercise: ${exerciseId}`);
  } catch (error) {
    console.error("[Cache] Error removing exercise:", error);
  }
}

/**
 * Limpa todo o cache de exercícios
 * 
 * @param {CacheConfig} config - Configuração customizada (opcional)
 * 
 * @example
 * ```ts
 * clearCache();
 * console.log("All cache cleared");
 * ```
 */
export function clearCache(config: Partial<CacheConfig> = {}): void {
  if (!isBrowser) return;

  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  try {
    localStorage.removeItem(finalConfig.storageKey);
    console.log("[Cache] All cache cleared");
  } catch (error) {
    console.error("[Cache] Error clearing cache:", error);
  }
}

/**
 * Obtém estatísticas do cache
 * 
 * @param {CacheConfig} config - Configuração customizada (opcional)
 * @returns {object} Estatísticas do cache
 * 
 * @example
 * ```ts
 * const stats = getCacheStats();
 * console.log(`Cache: ${stats.count}/${stats.maxSize} exercises`);
 * ```
 */
export function getCacheStats(config: Partial<CacheConfig> = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const cached = getCachedExercises(finalConfig);

  return {
    count: cached.length,
    maxSize: finalConfig.maxExercises,
    oldestCachedAt: cached.length > 0 ? Math.min(...cached.map((c) => c.cachedAt)) : null,
    newestCachedAt: cached.length > 0 ? Math.max(...cached.map((c) => c.cachedAt)) : null,
  };
}
