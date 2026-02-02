import axiosInstance from '@/shared/lib/axios';
import {
  Exercise,
  Category,
  Muscle,
  Equipment,
  ExerciseImage,
  WgerApiResponse,
  FetchExercisesParams,
  ApiError,
} from '@/entities/types';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

/**
 * Obtem lista de exercícios com filtros opcionais
 * Endpoint: GET /exercise/
 */
export async function fetchExercises(
  params: FetchExercisesParams = {}
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
    (Object.keys(defaultParams) as Array<keyof FetchExercisesParams>).forEach((key) => {
      const value = defaultParams[key];
      if (value != null) {
        cleanParams[key] = value;
      }
    });

    const response = await axiosInstance.get<WgerApiResponse<Exercise>>(
      '/exercise/',
      { params: cleanParams }
    );

    return response.data;
  } catch (error) {
    toast.error('Failed to load exercises');
    throw handleApiError(error, 'Failed to fetch exercises');
  }
}

/**
 * Obtem detalhes completos de um exercício específico
 * Endpoint: GET /exerciseinfo/{id}/
 */
export async function fetchExerciseById(id: number): Promise<Exercise> {
  try {
    const response = await axiosInstance.get<Exercise>(`/exerciseinfo/${id}/`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      toast.error('Exercise not found');
    } else {
      toast.error('Failed to load exercise details');
    }
    throw handleApiError(error, `Failed to fetch exercise with ID ${id}`);
  }
}

/**
 * Obtem todas as imagens associadas a um exercício
 * Endpoint: GET /exerciseimage/?exercise={exerciseId}
 */
export async function fetchExerciseImages(exerciseId: number): Promise<ExerciseImage[]> {
  try {
    const response = await axiosInstance.get<WgerApiResponse<ExerciseImage>>(
      '/exerciseimage/',
      { params: { exercise: exerciseId } }
    );
    return response.data.results;
  } catch (error) {
    toast.error('Failed to load exercise images');
    throw handleApiError(error, `Failed to fetch images for exercise ${exerciseId}`);
  }
}

/**
 * Obtem todas as categorias de exercícios disponíveis
 * Endpoint: GET /exercisecategory/
 */
export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await axiosInstance.get<WgerApiResponse<Category>>('/exercisecategory/');
    return response.data.results;
  } catch (error) {
    toast.error('Failed to load categories');
    throw handleApiError(error, 'Failed to fetch categories');
  }
}

/**
 * Obtem todos os músculos disponíveis
 * Endpoint: GET /muscle/
 */
export async function fetchMuscles(): Promise<Muscle[]> {
  try {
    const response = await axiosInstance.get<WgerApiResponse<Muscle>>('/muscle/');
    return response.data.results;
  } catch (error) {
    toast.error('Failed to load muscles');
    throw handleApiError(error, 'Failed to fetch muscles');
  }
}

/**
 * Obtem todos os equipamentos disponíveis
 * Endpoint: GET /equipment/
 */
export async function fetchEquipment(): Promise<Equipment[]> {
  try {
    const response = await axiosInstance.get<WgerApiResponse<Equipment>>('/equipment/');
    return response.data.results;
  } catch (error) {
    toast.error('Failed to load equipment');
    throw handleApiError(error, 'Failed to fetch equipment');
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
    code: 'UNKNOWN_ERROR',
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
  if (!htmlDescription) return '';
  return htmlDescription.replace(/<[^>]*>/g, '').trim();
}