import classNames from "classnames";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import { IconPatch } from "@/components/buttons/IconPatch";
import { Icon, Icons } from "@/components/Icon";
import { OverlayPortal } from "@/components/overlays/OverlayDisplay";
import { Flare } from "@/components/utils/Flare";
import { Heading2 } from "@/components/utils/Text";
import { useQueryParam } from "@/hooks/useQueryParams";

export function useModal(id: string) {
  const [currentModal, setCurrentModal] = useQueryParam("m");
  const show = useCallback(() => setCurrentModal(id), [id, setCurrentModal]);
  const hide = useCallback(() => setCurrentModal(null), [setCurrentModal]);
  return {
    id,
    isShown: currentModal === id,
    show,
    hide,
  };
}

export function ModalCard(props: { children?: ReactNode }) {
  return (
    <div className="w-full max-w-[30rem] m-4">
      <div className="w-full bg-modal-background rounded-xl p-8 pointer-events-auto">
        {props.children}
      </div>
    </div>
  );
}

export function Modal(props: { id: string; children?: ReactNode }) {
  const modal = useModal(props.id);

  return (
    <OverlayPortal darken close={modal.hide} show={modal.isShown}>
      <Helmet>
        <html data-no-scroll />
      </Helmet>
      <div className="flex absolute inset-0 items-center justify-center flex-col">
        {props.children}
      </div>
    </OverlayPortal>
  );
}

export function FancyModal(props: {
  id: string;
  children?: ReactNode;
  title?: string;
  size?: "md" | "xl";
  oneTime?: boolean;
}) {
  const modal = useModal(props.id);

  useEffect(() => {
    if (props.oneTime) {
      const isDismissed = localStorage.getItem(`modal-${props.id}-dismissed`);
      if (!isDismissed) {
        modal.show();
      }
    }
  }, [modal, props.id, props.oneTime]);

  const handleClose = () => {
    if (props.oneTime) {
      localStorage.setItem(`modal-${props.id}-dismissed`, "true");
    }
    modal.hide();
  };

  return (
    <OverlayPortal darken close={handleClose} show={modal.isShown}>
      <Helmet>
        <html data-no-scroll />
      </Helmet>
      <div className="flex absolute inset-0 items-center justify-center">
        <Flare.Base
          className={classNames(
            "group -m-[0.705em] rounded-3xl bg-background-main transition-colors duration-300 focus:relative focus:z-10",
            "w-full mx-4 p-6 bg-mediaCard-hoverBackground bg-opacity-60 backdrop-filter backdrop-blur-lg shadow-lg",
            props.size === "md" ? "max-w-md" : "max-w-2xl",
          )}
        >
          <div className="transition-transform duration-300 overflow-y-scroll max-h-[90dvh] scrollbar-none">
            <Flare.Light
              flareSize={300}
              cssColorVar="--colors-mediaCard-hoverAccent"
              backgroundClass="bg-mediaCard-hoverBackground duration-100"
              className="rounded-3xl bg-background-main group-hover:opacity-100"
            />
            <Flare.Child className="pointer-events-auto relative mb-2p-[0.4em] transition-transform duration-300">
              <div className="flex justify-between items-center mb-4">
                {props.title && (
                  <Heading2 className="!mt-0 !mb-0 pr-6">
                    {props.title}
                  </Heading2>
                )}
                <button
                  type="button"
                  className="text-s font-semibold text-type-secondary hover:text-white transition-transform hover:scale-95"
                  onClick={handleClose}
                >
                  <IconPatch icon={Icons.X} />
                </button>
              </div>
              <div className="text-lg text-type-secondary">
                {props.children}
              </div>
            </Flare.Child>
          </div>
        </Flare.Base>
      </div>
    </OverlayPortal>
  );
}

function DetailsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="relative">
        {/* Backdrop */}
        <div className="h-64 relative -mt-12">
          <div
            className="absolute inset-0 bg-mediaCard-hoverBackground"
            style={{
              maskImage:
                "linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 60px)",
              WebkitMaskImage:
                "linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 60px)",
            }}
          />
        </div>
        {/* Content */}
        <div className="px-6 pb-6 mt-[-30px]">
          <div className="h-8 w-3/4 bg-white/10 rounded mb-3" /> {/* Title */}
          <div className="space-y-2 mb-6">
            {/* Description */}
            <div className="h-4 bg-white/10 rounded w-full" />
            <div className="h-4 bg-white/10 rounded w-full" />
            <div className="h-4 bg-white/10 rounded w-full" />
            <div className="h-4 bg-white/10 rounded w-3/4" />
          </div>
          {/* Additional details */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="h-4 bg-white/10 rounded w-3/4" />
            <div className="h-4 bg-white/10 rounded w-3/4" />
            <div className="h-4 bg-white/10 rounded w-3/4" />
            <div className="h-4 bg-white/10 rounded w-3/4" />
          </div>
          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            <div className="h-6 w-20 bg-white/10 rounded-full" />
            <div className="h-6 w-24 bg-white/10 rounded-full" />
            <div className="h-6 w-16 bg-white/10 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface DetailsContent {
  title: string;
  overview?: string;
  backdrop?: string;
  runtime?: number | null;
  genres?: Array<{ id: number; name: string }>;
  language?: string;
  voteAverage?: number;
  voteCount?: number;
  releaseDate?: string;
  rating?: string;
  director?: string;
  actors?: string[];
  type?: "movie" | "show";
  id?: number;
  episodes?: number;
  seasons?: number;
  imdbId?: string;
  seasonData?: {
    seasons: Array<{
      id: number;
      season_number: number;
      name: string;
      episode_count: number;
      overview: string;
      air_date: string;
      poster_path: string | null;
    }>;
    episodes: Array<{
      id: number;
      name: string;
      overview: string;
      episode_number: number;
      season_number: number;
      still_path: string | null;
      air_date: string;
      vote_average: number;
      vote_count: number;
    }>;
  };
}

function DetailsContent({ data }: { data: DetailsContent }) {
  const formatRuntime = (minutes?: number | null) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatVoteCount = (count?: number) => {
    if (!count) return "0";
    if (count >= 1000) {
      return `${Math.floor(count / 1000)}K+`;
    }
    return count.toString();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Function to get color based on rating
  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "bg-green-500";
    if (rating >= 6) return "bg-yellow-500";
    if (rating >= 4) return "bg-orange-500";
    return "bg-red-500";
  };

  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;

    const cardWidth = 256; // w-64 in pixels
    const cardSpacing = 16; // space-x-4 in pixels
    const scrollAmount = (cardWidth + cardSpacing) * 2;

    const newScrollPosition =
      carouselRef.current.scrollLeft +
      (direction === "left" ? -scrollAmount : scrollAmount);

    carouselRef.current.scrollTo({
      left: newScrollPosition,
      behavior: "smooth",
    });
  };

  const currentSeasonEpisodes = data.seasonData?.episodes.filter(
    (ep) => ep.season_number === selectedSeason,
  );

  // Function to generate the episode URL
  const getEpisodeUrl = (episode: any) => {
    // Find the season ID for the current season
    const season = data.seasonData?.seasons.find(
      (s) => s.season_number === selectedSeason,
    );

    if (!season || !data.id) return "#";

    // Create the URL in the format: /media/tmdb-tv-{showId}-{showName}/{seasonId}/{episodeId}
    return `/media/tmdb-tv-${data.id}-${data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/${season.id}/${episode.id}`;
  };

  return (
    <div className="relative h-full flex flex-col">
      {/* Backdrop - Even taller */}
      <div className="h-64 lg:h-80 xl:h-96 relative -mt-12">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: data.backdrop
              ? `url(${data.backdrop})`
              : undefined,
            maskImage:
              "linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 60px)",
            WebkitMaskImage:
              "linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 60px)",
          }}
        />
      </div>
      {/* Content */}
      <div className="px-6 pb-6 mt-[-30px] flex-grow">
        {/* Title and Genres Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
          <h3 className="text-2xl font-bold text-white mb-3 sm:mb-0 z-[999]">
            {data.title}
          </h3>
          {data.genres && data.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-start sm:justify-end z-[999]">
              {data.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-white/20 text-white/80"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Two Column Layout - Stacked on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6">
          {/* Left Column - Description */}
          <div className="md:col-span-2">
            {data.overview && (
              <p className="text-sm text-white/90 mb-6">{data.overview}</p>
            )}

            {/* Director and Cast */}
            <div className="space-y-4 mb-6">
              {data.director && (
                <div className="text-xs">
                  <span className="font-medium text-white/80">Director:</span>{" "}
                  <span className="text-white/70">{data.director}</span>
                </div>
              )}
              {data.actors && data.actors.length > 0 && (
                <div className="text-xs">
                  <span className="font-medium text-white/80">Cast:</span>{" "}
                  <span className="text-white/70">
                    {data.actors.join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="md:col-span-1">
            <div className="space-y-3 text-xs">
              {data.runtime && (
                <div className="flex items-center gap-1 text-white/80">
                  <span className="font-medium">Runtime:</span>{" "}
                  {formatRuntime(data.runtime)}
                </div>
              )}
              {data.language && (
                <div className="flex items-center gap-1 text-white/80">
                  <span className="font-medium">Language:</span>{" "}
                  {data.language.toUpperCase()}
                </div>
              )}
              {data.releaseDate && (
                <div className="flex items-center gap-1 text-white/80">
                  <span className="font-medium">Release Date:</span>{" "}
                  {formatDate(data.releaseDate)}
                </div>
              )}
              {data.rating && (
                <div className="flex items-center gap-1 text-white/80">
                  <span className="font-medium">Rating:</span> {data.rating}
                </div>
              )}
              {data.voteAverage !== undefined &&
                data.voteCount !== undefined &&
                data.voteCount > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-white/80">
                      <span className="font-medium">Rating:</span>{" "}
                      <span className="text-white/90">
                        {data.voteAverage.toFixed(1)}/10
                      </span>
                    </div>
                    {/* Rating Progress Bar */}
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getRatingColor(data.voteAverage)} transition-all duration-500`}
                        style={{ width: `${(data.voteAverage / 10) * 100}%` }}
                      />
                    </div>
                    <div className="text-white/60 text-[10px] text-right">
                      {formatVoteCount(data.voteCount)} votes
                    </div>

                    {/* External Links */}
                    <div className="flex gap-3 mt-2">
                      {data.id && (
                        <a
                          href={`https://www.themoviedb.org/${data.type === "show" ? "tv" : "movie"}/${data.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-[#0d253f] flex items-center justify-center transition-transform hover:scale-110"
                          title="View on TMDB"
                        >
                          <Icon icon={Icons.TMDB} className="text-white" />
                        </a>
                      )}
                      {data.imdbId && (
                        <a
                          href={`https://www.imdb.com/title/${data.imdbId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center transition-transform hover:scale-110"
                          title="View on IMDB"
                        >
                          <Icon icon={Icons.IMDB} className="text-black" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Episodes Carousel for TV Shows */}
        {data.type === "show" && data.seasonData && (
          <div className="mt-6 md:mt-0">
            {/* Season Selector */}
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-lg font-semibold text-white">Episodes</h4>
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(Number(e.target.value))}
                className="bg-white/10 text-white rounded-lg px-3 py-1.5 text-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                {data.seasonData.seasons.map((season) => (
                  <option key={season.id} value={season.season_number}>
                    Season {season.season_number}
                  </option>
                ))}
              </select>
            </div>

            {/* Episodes Carousel */}
            <div className="relative">
              {/* Left scroll button */}
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 px-4 hidden lg:block">
                <button
                  type="button"
                  className="p-2 bg-black/80 hover:bg-video-context-hoverColor transition-colors rounded-full border border-video-context-border backdrop-blur-sm"
                  onClick={() => handleScroll("left")}
                >
                  <Icon icon={Icons.CHEVRON_LEFT} className="text-white/80" />
                </button>
              </div>

              <div
                ref={carouselRef}
                className="flex overflow-x-auto space-x-4 pb-4 pt-2 lg:px-12 scrollbar-hide"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {/* Add padding before the first card */}
                <div className="flex-shrink-0 w-4" />

                {currentSeasonEpisodes?.map((episode) => (
                  <Link
                    key={episode.id}
                    to={getEpisodeUrl(episode)}
                    className="flex-shrink-0 w-64 rounded-lg overflow-hidden transition-all duration-200 relative cursor-pointer hover:scale-95 hover:bg-white/5"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video w-full bg-video-context-hoverColor">
                      {episode.still_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                          alt={episode.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                          <Icon
                            icon={Icons.FILM}
                            className="text-video-context-type-main opacity-50 text-3xl"
                          />
                        </div>
                      )}

                      {/* Episode Number Badge */}
                      <div className="absolute top-2 left-2">
                        <span className="p-0.5 px-2 rounded inline bg-video-context-hoverColor bg-opacity-80 text-video-context-type-main text-sm">
                          E{episode.episode_number}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3">
                      <h3 className="font-bold text-white line-clamp-1">
                        {episode.name}
                      </h3>
                      {episode.overview && (
                        <p className="text-sm text-white/80 mt-1.5 line-clamp-2">
                          {episode.overview}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}

                {/* Add padding after the last card */}
                <div className="flex-shrink-0 w-4" />
              </div>

              {/* Right scroll button */}
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 px-4 hidden lg:block">
                <button
                  type="button"
                  className="p-2 bg-black/80 hover:bg-video-context-hoverColor transition-colors rounded-full border border-video-context-border backdrop-blur-sm"
                  onClick={() => handleScroll("right")}
                >
                  <Icon icon={Icons.CHEVRON_RIGHT} className="text-white/80" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function DetailsModal(props: {
  id: string;
  data?: DetailsContent;
  isLoading?: boolean;
}) {
  const modal = useModal(props.id);

  return (
    <OverlayPortal darken close={modal.hide} show={modal.isShown}>
      <Helmet>
        <html data-no-scroll />
      </Helmet>
      <div className="flex absolute inset-0 items-center justify-center">
        <Flare.Base
          className={classNames(
            "group -m-[0.705em] rounded-3xl bg-background-main transition-colors duration-300 focus:relative focus:z-10",
            "max-h-[900px] max-w-[1200px]",
            "bg-mediaCard-hoverBackground bg-opacity-60 backdrop-filter backdrop-blur-lg shadow-lg overflow-hidden",
            props.data?.type === "movie"
              ? "h-fit w-[90%] md:w-[70%] lg:w-[50%]"
              : "h-[90%] w-[90%] md:w-[70%] lg:w-[60%]", // that seems to work lmao
          )}
        >
          <div className="transition-transform duration-300 h-full">
            <Flare.Light
              flareSize={300}
              cssColorVar="--colors-mediaCard-hoverAccent"
              backgroundClass="bg-mediaCard-hoverBackground duration-100"
              className="rounded-3xl bg-background-main group-hover:opacity-100"
            />
            <Flare.Child className="pointer-events-auto relative h-full overflow-y-auto scrollbar-none">
              <div className="absolute right-4 top-4 z-10">
                <button
                  type="button"
                  className="text-s font-semibold text-type-secondary hover:text-white transition-transform hover:scale-95"
                  onClick={modal.hide}
                >
                  <IconPatch icon={Icons.X} />
                </button>
              </div>
              <div className="pt-12">
                {props.isLoading || !props.data ? (
                  <DetailsSkeleton />
                ) : (
                  <DetailsContent data={props.data} />
                )}
              </div>
            </Flare.Child>
          </div>
        </Flare.Base>
      </div>
    </OverlayPortal>
  );
}
