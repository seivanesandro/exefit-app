"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Dumbbell, Target, Zap, Activity } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";
import { Breadcrumbs } from "@/shared/ui/breadcrumbs";
import { ImageGallery } from "./ImageGallery";
import { FavoriteButton } from "@/entities/favorite/ui/FavoriteButton";
import type { ExerciseDetailsProps, BreadcrumbItem } from "@/entities/types";

/**
 * Remove tags HTML da descrição para evitar problemas com imagens sem alt
 */
function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Componente de detalhes completo do exercício
 * Exibe: hero image, badges, descrição, músculos, equipamento, galeria
 */
export function ExerciseDetails({
  exercise,
  categories,
  muscles,
  equipment,
}: ExerciseDetailsProps) {

  // Encontrar nomes das categorias, músculos e equipamento
  const categoryName = useMemo(
    () => categories.find((c) => c.id === exercise.category)?.name || "Unknown",
    [categories, exercise.category],
  );

  const primaryMuscles = useMemo(
    () =>
      exercise.muscles
        .map((mId) => muscles.find((m) => m.id === mId))
        .filter((m): m is NonNullable<typeof m> => m !== undefined),
    [muscles, exercise.muscles],
  );

  const secondaryMuscles = useMemo(
    () =>
      exercise.muscles_secondary
        .map((mId) => muscles.find((m) => m.id === mId))
        .filter((m): m is NonNullable<typeof m> => m !== undefined),
    [muscles, exercise.muscles_secondary],
  );

  const equipmentList = useMemo(
    () =>
      exercise.equipment
        .map((eId) => equipment.find((e) => e.id === eId))
        .filter((e): e is NonNullable<typeof e> => e !== undefined),
    [equipment, exercise.equipment],
  );

  // Alt text para a hero image (sempre garantido não vazio)
  const heroAlt = exercise.name?.trim() || "Exercise demonstration";

  // Breadcrumbs
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: heroAlt, href: `/exercicios/${exercise.id}` },
  ];

  // Hero image (primeira imagem ou placeholder)
  const heroImage =
    exercise.images.length > 0
      ? exercise.images[0].image
      : "/placeholder-exercise.png";

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Botão Voltar */}
      <Link href="/">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Exercises
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hero Image */}
        <div className="space-y-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-gray-200 shadow-lg">
            <Image
              src={heroImage}
              alt={heroAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Galeria de Imagens (se múltiplas) */}
          {exercise.images.length > 1 && (
            <ImageGallery
              images={exercise.images}
              exerciseName={heroAlt}
            />
          )}
        </div>

        {/* Informações Principais */}
        <div className="space-y-6">
          {/* Nome e Badges */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {heroAlt}
            </h1>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default" className="text-sm">
                <Dumbbell className="mr-1 h-3 w-3" />
                {categoryName}
              </Badge>
              {exercise.images.length > 0 && (
                <Badge variant="secondary" className="text-sm">
                  {exercise.images.length} Image
                  {exercise.images.length > 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          </div>

          <Separator />

          {/* Botão de Favorito */}
          <FavoriteButton
            exerciseId={exercise.id}
            exerciseName={heroAlt}
            categoryId={exercise.category}
            className="w-full"
          />

          {/* Descrição */}
          {exercise.description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {stripHtmlTags(exercise.description)}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Músculos Primários */}
          {primaryMuscles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Target className="mr-2 h-5 w-5 text-red-500" />
                  Primary Muscles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {primaryMuscles.map((muscle) => (
                    <Badge
                      key={muscle.id}
                      variant="outline"
                      className="text-sm border-red-500 text-red-700"
                    >
                      {muscle.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Músculos Secundários */}
          {secondaryMuscles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-blue-500" />
                  Secondary Muscles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {secondaryMuscles.map((muscle) => (
                    <Badge
                      key={muscle.id}
                      variant="outline"
                      className="text-sm border-blue-500 text-blue-700"
                    >
                      {muscle.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Equipamento */}
          {equipmentList.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-yellow-500" />
                  Equipment Needed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {equipmentList.map((eq) => (
                    <Badge
                      key={eq.id}
                      variant="outline"
                      className="text-sm border-yellow-500 text-yellow-700"
                    >
                      {eq.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Variações */}
          {exercise.variations && exercise.variations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Variations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  {exercise.variations.length} variation
                  {exercise.variations.length > 1 ? "s" : ""} available
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
