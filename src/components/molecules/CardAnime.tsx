import { useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

interface AnimeCard {
  mal_id: number;
  title: string;
  images?: {
    jpg?: {
      image_url: string;
    };
  };
  episodes?: number | null;
  status?: string;
  genres?: Array<{ name: string }>;
  year?: number | null;
}

interface CardAnimeProps {
  card: AnimeCard;
  addToFavorites: () => Promise<void>;
  isFavorite: boolean;
  seeDetails: () => void;
}

export default function CardAnime({
  card,
  addToFavorites,
  isFavorite,
  seeDetails,
}: CardAnimeProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      await addToFavorites();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative bg-gray-800 text-white border border-gray-700 rounded shadow-lg p-4 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
      <div
        onClick={handleFavoriteClick}
        className={`absolute top-2 right-2 text-red-500 cursor-pointer transition-all duration-200 ${
          isLoading ? "opacity-50 scale-90" : "hover:scale-125"
        }`}
      >
        {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </div>

      <h2 className="font-bold text-lg my-4 text-center">{card.title}</h2>

      {card.images?.jpg?.image_url && (
        <img
          src={card.images.jpg.image_url}
          alt={card.title}
          className="w-full h-48 object-cover rounded-md mb-3 cursor-pointer"
          onClick={seeDetails}
        />
      )}

      <p className="text-sm text-gray-300 mb-2 text-center">{`Episodi: ${card.episodes || "N/D"}`}</p>

      <p className="text-xs text-gray-400">
        <strong>Stato:</strong> {card.status || "N/D"}
      </p>

      <p className="text-xs text-gray-400">
        <strong>Genere:</strong> {card.genres?.[0]?.name || "N/D"}
      </p>

      <p className="text-xs text-gray-400">
        <strong>Anno:</strong> {card.year || "N/D"}
      </p>
    </div>
  );
}
