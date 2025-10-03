import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

function CardAnime({ card, addToFavorites, isFavorite }) {
  return (
    <div className="relative  bg-gray-800 text-white border border-gray-700 rounded shadow-lg p-4 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
      {/* Icona cuore */}
      {isFavorite ? (
        <FavoriteIcon
          onClick={addToFavorites}
          className="absolute top-2 right-2 text-red-500 cursor-pointer"
        />
      ) : (
        <FavoriteBorderIcon
          onClick={addToFavorites}
          className="absolute top-2 right-2 text-red-500 cursor-pointer"
        />
      )}

      <h2 className="font-bold text-lg mb-2 text-center">{card.title}</h2>

      {card.images?.jpg?.image_url && (
        <img
          src={card.images.jpg.image_url}
          alt={card.title}
          className="w-48 h-72 object-cover rounded-md mb-3"
        />
      )}

      <p className="text-sm text-gray-300 mb-2 text-center">
        {card.synopsis
          ? card.synopsis.slice(0, 200) + "..."
          : "Descrizione non disponibile"}
      </p>

      <p className="text-xs text-gray-400">
        <strong>Anno:</strong> {card.year || "N/D"}
      </p>
    </div>
  );
}

export default CardAnime;
