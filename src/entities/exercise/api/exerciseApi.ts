import axiosInstance from "@/shared/lib/axios";
import {
  Exercise,
  Category,
  Muscle,
  Equipment,
  ExerciseImage,
  WgerApiResponse,
  FetchExercisesParams,
  ApiError,
} from "@/entities/types";
import { AxiosError } from "axios";
import { toast } from "sonner";

/**
 * Obtem lista de exercícios com filtros opcionais e suas imagens
 * Endpoint: GET /exercise/ + GET /exerciseimage/ em paralelo (leve)
 */
export async function fetchExercises(
  params: FetchExercisesParams = {},
): Promise<WgerApiResponse<Exercise>> {
  try {
    const defaultParams: FetchExercisesParams = {
      language: 2, // Inglês
      limit: 20,
      offset: 0,
      ...params,
    };

    // Remove parâmetros null/undefined
    const cleanParams: Partial<FetchExercisesParams> = {};
    (Object.keys(defaultParams) as Array<keyof FetchExercisesParams>).forEach(
      (key) => {
        const value = defaultParams[key];
        if (value != null) {
          cleanParams[key] = value;
        }
      },
    );

    const response = await axiosInstance.get<WgerApiResponse<Exercise>>(
      "/exercise/",
      { params: cleanParams },
    );

    // A API Wger tem BUG: /exerciseinfo/ retorna name VAZIO!
    // SOLUÇÃO: Buscar apenas imagens e usar ID como referência
    const enhancedExercises = await Promise.all(
      response.data.results.map(async (exercise) => {
        try {
          // Buscar apenas imagens (rápido e confiável)
          const images = await fetchExerciseImages(exercise.id);
          
          // Nome baseado no ID (formato profissional)
          const readableName = `Exercise #${exercise.id}`;
          
          return {
            ...exercise,
            name: readableName,
            images: images || [],
            description: `Exercise ID: ${exercise.id} | Category: ${exercise.category}`,
          };
        } catch {
          // Fallback: sem imagens
          return {
            ...exercise,
            name: `Exercise #${exercise.id}`,
            images: [],
            description: `Exercise ID: ${exercise.id}`,
          };
        }
      })
    );

    return {
      ...response.data,
      results: enhancedExercises,
    };
  } catch (error) {
    console.error("[fetchExercises] Error:", error);
    throw handleApiError(error, "Failed to fetch exercises");
  }
}

/**
 * Obtem detalhes completos de um exercício específico
 * Endpoint: GET /exercise/{id}/
 */
export async function fetchExerciseById(id: number): Promise<Exercise> {
  try {
    // Buscar exercício base
    const exerciseResponse = await axiosInstance.get<Exercise>(
      `/exercise/${id}/`,
      {
        params: { language: 2 }, // English
        timeout: 5000,
      }
    );

    const exercise = exerciseResponse.data;

    // Buscar imagens do exercício
    const images = await fetchExerciseImages(id);

    // Retornar exercício com imagens (mantém nome e descrição original da API)
    return {
      ...exercise,
      images,
    };
  } catch (error) {
    console.warn(`[fetchExerciseById] Failed for ID ${id}:`, error);
    throw handleApiError(error, `Failed to fetch exercise with ID ${id}`);
  }
}

/**
 * Obtem todas as imagens associadas a um exercício
 * Endpoint: GET /exerciseimage/?exercise={exerciseId}
 */
export async function fetchExerciseImages(
  exerciseId: number,
): Promise<ExerciseImage[]> {
  try {
    const response = await axiosInstance.get<WgerApiResponse<ExerciseImage>>(
      "/exerciseimage/",
      { params: { exercise: exerciseId } },
    );
    return response.data.results;
  } catch {
    // Silenciar erro de imagens - não é crítico
    console.warn(`No images found for exercise ${exerciseId}`);
    return [];
  }
}

/**
 * Obtem todas as categorias de exercícios disponíveis
 * Endpoint: GET /exercisecategory/
 */
export async function fetchCategories(): Promise<Category[]> {
  try {
    const response =
      await axiosInstance.get<WgerApiResponse<Category>>("/exercisecategory/");
    return response.data.results;
  } catch (error) {
    toast.error("Failed to load categories");
    throw handleApiError(error, "Failed to fetch categories");
  }
}

/**
 * Obtem todos os músculos disponíveis
 * Endpoint: GET /muscle/
 */
export async function fetchMuscles(): Promise<Muscle[]> {
  try {
    const response =
      await axiosInstance.get<WgerApiResponse<Muscle>>("/muscle/");
    return response.data.results;
  } catch (error) {
    toast.error("Failed to load muscles");
    throw handleApiError(error, "Failed to fetch muscles");
  }
}

/**
 * Obtem todos os equipamentos disponíveis
 * Endpoint: GET /equipment/
 */
export async function fetchEquipment(): Promise<Equipment[]> {
  try {
    const response =
      await axiosInstance.get<WgerApiResponse<Equipment>>("/equipment/");
    return response.data.results;
  } catch (error) {
    toast.error("Failed to load equipment");
    throw handleApiError(error, "Failed to fetch equipment");
  }
}

/**
 * Trata erros de requisições HTTP
 */
function handleApiError(error: unknown, defaultMessage: string): ApiError {
  if (error instanceof AxiosError) {
    return {
      message: error.response?.data?.message || error.message || defaultMessage,
      status: error.response?.status || 500,
      code: error.code,
    };
  }

  return {
    message: defaultMessage,
    status: 500,
    code: "UNKNOWN_ERROR",
  };
}

/**
 * Verifica se um exercício possui imagens
 */
export function hasImages(exercise: Exercise): boolean {
  return Array.isArray(exercise.images) && exercise.images.length > 0;
}

/**
 * Obtém a imagem principal de um exercício
 */
export function getMainImage(exercise: Exercise): string | null {
  if (!hasImages(exercise)) return null;

  const mainImage = exercise.images?.find((img) => img.is_main);
  return mainImage?.image || exercise.images?.[0]?.image || null;
}

/**
 * Remove tags HTML de uma string
 */
export function stripHtmlTags(htmlDescription: string): string {
  if (!htmlDescription) return "";
  return htmlDescription.replace(/<[^>]*>/g, "").trim();
}
