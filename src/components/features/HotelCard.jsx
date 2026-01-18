import { useHotelContext } from "../../context/HotelContext.jsx";
import { formatCurrency } from "../../utils/formatCurrency.js";
import { AMENITY_ICONS, RATING_LABELS } from "../../utils/constants.js";
import Button from "../ui/Button.jsx";
import Card from "../ui/Card.jsx";

/**
 * HotelCard Component
 * @module components/features/HotelCard
 *
 * Displays hotel information with image, rating, price, and comparison toggle.
 */

/**
 * Render star rating
 * @param {number} rating - Star rating (1-5)
 * @returns {JSX.Element} Star rating display
 */
const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-amber-400" : "text-slate-600"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
    <span className="ml-1.5 text-xs text-slate-400">
      {RATING_LABELS[rating] || "Standard"}
    </span>
  </div>
);

/**
 * HotelCard component props
 * @param {Object} props - Component props
 * @param {import('../../api/mockData.js').Hotel} props.hotel - Hotel data
 * @param {Function} [props.onViewDetails] - View details handler
 * @returns {JSX.Element} HotelCard component
 */
const HotelCard = ({ hotel, onViewDetails }) => {
  const { isInComparison, toggleComparison, canAddMore } = useHotelContext();
  const inComparison = isInComparison(hotel.id);

  /**
   * Handle comparison toggle
   */
  const handleToggleComparison = (e) => {
    e.stopPropagation();
    if (!inComparison && !canAddMore) {
      return; // Max items reached
    }
    toggleComparison(hotel);
  };

  return (
    <Card hoverable padding={false} className="group overflow-hidden">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={hotel.images[0]}
          alt={hotel.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        {/* Comparison Badge */}
        {inComparison && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-amber-500 text-slate-900 text-xs font-bold rounded-lg">
            In Comparison
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-slate-900/90 backdrop-blur-sm rounded-lg">
          <span className="text-amber-400 font-bold">
            {formatCurrency(hotel.pricePerNight)}
          </span>
          <span className="text-slate-400 text-xs"> / night</span>
        </div>

        {/* Free Cancellation Badge */}
        {hotel.freeCancellation && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-green-500/20 border border-green-500/50 text-green-400 text-xs rounded-lg">
            Free Cancellation
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold text-white line-clamp-1 group-hover:text-amber-400 transition-colors">
            {hotel.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <svg
              className="w-4 h-4 text-slate-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-sm text-slate-400">
              {hotel.location.city}, {hotel.location.country}
            </span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between">
          <StarRating rating={hotel.rating} />
          <div className="flex items-center gap-1">
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-sm font-bold rounded">
              {hotel.userRating}
            </span>
            <span className="text-xs text-slate-500">
              ({hotel.reviewCount.toLocaleString()} reviews)
            </span>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2">
          {hotel.amenities.slice(0, 4).map((amenity) => (
            <span
              key={amenity}
              className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-md"
              title={amenity}
            >
              {AMENITY_ICONS[amenity] || "✓"} {amenity}
            </span>
          ))}
          {hotel.amenities.length > 4 && (
            <span className="px-2 py-1 text-slate-400 text-xs">
              +{hotel.amenities.length - 4} more
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant={inComparison ? "primary" : "secondary"}
            size="sm"
            onClick={handleToggleComparison}
            disabled={!inComparison && !canAddMore}
            className="flex-1"
          >
            {inComparison ? (
              <>
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Added
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Compare
              </>
            )}
          </Button>
          {onViewDetails && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(hotel)}
            >
              Details
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default HotelCard;
