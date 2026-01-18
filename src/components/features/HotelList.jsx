import HotelCard from "./HotelCard.jsx";
import Button from "../ui/Button.jsx";
import { LoadingInline } from "../ui/Spinner.jsx";

/**
 * HotelList Component
 * @module components/features/HotelList
 *
 * Renders a grid of hotel cards with loading states and pagination.
 */

/**
 * Empty state component
 */
const EmptyState = ({ onReset }) => (
  <div className="text-center py-16">
    <div className="mb-4 text-6xl">🏨</div>
    <h3 className="text-xl font-semibold text-white mb-2">No hotels found</h3>
    <p className="text-slate-400 mb-6 max-w-md mx-auto">
      We couldn't find any hotels matching your criteria. Try adjusting your
      filters or search in a different location.
    </p>
    {onReset && (
      <Button variant="secondary" onClick={onReset}>
        Reset Filters
      </Button>
    )}
  </div>
);

/**
 * Skeleton loading cards
 */
const SkeletonCard = () => (
  <div className="bg-slate-800/60 rounded-2xl overflow-hidden animate-pulse">
    <div className="h-48 bg-slate-700" />
    <div className="p-4 space-y-3">
      <div className="h-5 bg-slate-700 rounded w-3/4" />
      <div className="h-4 bg-slate-700 rounded w-1/2" />
      <div className="flex gap-2">
        <div className="h-6 bg-slate-700 rounded w-16" />
        <div className="h-6 bg-slate-700 rounded w-16" />
      </div>
      <div className="flex gap-2 pt-2">
        <div className="h-9 bg-slate-700 rounded flex-1" />
        <div className="h-9 bg-slate-700 rounded w-20" />
      </div>
    </div>
  </div>
);

/**
 * HotelList component props
 * @param {Object} props - Component props
 * @param {import('../../api/mockData.js').Hotel[]} props.hotels - Array of hotels
 * @param {boolean} props.loading - Loading state
 * @param {string|null} props.error - Error message
 * @param {boolean} props.hasMore - More results available
 * @param {number} props.total - Total results count
 * @param {Function} props.onLoadMore - Load more handler
 * @param {Function} [props.onViewDetails] - View details handler
 * @param {Function} [props.onReset] - Reset filters handler
 * @returns {JSX.Element} HotelList component
 */
const HotelList = ({
  hotels,
  loading,
  error,
  hasMore,
  total,
  onLoadMore,
  onViewDetails,
  onReset,
}) => {
  // Initial loading state
  if (loading && hotels.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-slate-700 rounded w-32 animate-pulse" />
        </div>
        <div className="hotel-grid">
          {[...Array(8)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-16">
        <div className="mb-4 text-6xl">⚠️</div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Something went wrong
        </h3>
        <p className="text-slate-400 mb-6">{error}</p>
        <Button variant="secondary" onClick={onReset}>
          Try Again
        </Button>
      </div>
    );
  }

  // Empty state
  if (!loading && hotels.length === 0) {
    return <EmptyState onReset={onReset} />;
  }

  return (
    <div>
      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-slate-400">
          Showing{" "}
          <span className="text-white font-medium">{hotels.length}</span> of{" "}
          <span className="text-white font-medium">{total}</span> hotels
        </p>
      </div>

      {/* Hotel Grid */}
      <div className="hotel-grid">
        {hotels.map((hotel) => (
          <HotelCard
            key={hotel.id}
            hotel={hotel}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="mt-8 text-center">
          {loading ? (
            <LoadingInline message="Loading more hotels..." />
          ) : (
            <Button variant="secondary" onClick={onLoadMore}>
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              Load More Hotels
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default HotelList;
