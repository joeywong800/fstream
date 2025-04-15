import { useState } from "react";

import { getMediaBackdrop, getMediaDetails } from "@/backend/metadata/tmdb";
import {
  TMDBContentTypes,
  TMDBMovieData,
  TMDBShowData,
} from "@/backend/metadata/types/tmdb";
import { Icons } from "@/components/Icon";
import { DetailsModal, useModal } from "@/components/overlays/Modal";
import { usePlayerStore } from "@/stores/player/store";

import { VideoPlayerButton } from "./Button";

export function InfoButton() {
  const meta = usePlayerStore((s) => s.meta);
  const modal = useModal("player-details");
  const [isLoading, setIsLoading] = useState(false);
  const [detailsData, setDetailsData] = useState<any>(null);

  const handleClick = async () => {
    if (!meta?.tmdbId) return;

    setIsLoading(true);
    try {
      const type =
        meta.type === "movie" ? TMDBContentTypes.MOVIE : TMDBContentTypes.TV;
      const details = await getMediaDetails(meta.tmdbId, type);
      const backdropUrl = getMediaBackdrop(details.backdrop_path);

      if (type === TMDBContentTypes.MOVIE) {
        const movieDetails = details as TMDBMovieData;
        setDetailsData({
          title: movieDetails.title,
          overview: movieDetails.overview,
          backdrop: backdropUrl,
          runtime: movieDetails.runtime,
          genres: movieDetails.genres,
          language: movieDetails.original_language,
          voteAverage: movieDetails.vote_average,
          voteCount: movieDetails.vote_count,
          releaseDate: movieDetails.release_date,
          rating: movieDetails.release_dates?.results?.find(
            (r: { iso_3166_1: string }) => r.iso_3166_1 === "US",
          )?.release_dates?.[0]?.certification,
          director: movieDetails.credits?.crew?.find(
            (person) => person.job === "Director",
          )?.name,
          actors: movieDetails.credits?.cast
            ?.slice(0, 5)
            .map((actor) => actor.name),
          type: "movie",
          id: movieDetails.id,
          imdbId: movieDetails.external_ids?.imdb_id,
        });
      } else {
        const showDetails = details as TMDBShowData & {
          episodes: Array<{
            id: number;
            name: string;
            episode_number: number;
            overview: string;
            still_path: string | null;
            air_date: string;
            season_number: number;
          }>;
        };
        setDetailsData({
          title: showDetails.name,
          overview: showDetails.overview,
          backdrop: backdropUrl,
          episodes: showDetails.number_of_episodes,
          seasons: showDetails.number_of_seasons,
          genres: showDetails.genres,
          language: showDetails.original_language,
          voteAverage: showDetails.vote_average,
          voteCount: showDetails.vote_count,
          releaseDate: showDetails.first_air_date,
          rating: showDetails.content_ratings?.results?.find(
            (r: { iso_3166_1: string }) => r.iso_3166_1 === "US",
          )?.rating,
          director: showDetails.credits?.crew?.find(
            (person) => person.job === "Director",
          )?.name,
          actors: showDetails.credits?.cast
            ?.slice(0, 5)
            .map((actor) => actor.name),
          type: "show",
          id: showDetails.id,
          imdbId: showDetails.external_ids?.imdb_id,
          seasonData: {
            seasons: showDetails.seasons,
            episodes: showDetails.episodes,
          },
        });
      }
    } catch (err) {
      console.error("Failed to fetch media details:", err);
    } finally {
      setIsLoading(false);
    }
    modal.show();
  };

  return (
    <>
      <VideoPlayerButton
        icon={Icons.CIRCLE_QUESTION}
        iconSizeClass="text-base"
        className="p-2 !-mr-1"
        onClick={handleClick}
      />
      <DetailsModal
        id="player-details"
        data={detailsData}
        isLoading={isLoading}
        minimal
      />
    </>
  );
}
