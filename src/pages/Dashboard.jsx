import { useState, useEffect } from "react";
import { useHotelSearch } from "../hooks/useHotelSearch.js";
import { useHotelContext } from "../context/HotelContext.jsx";
import { HotelFilters, HotelList } from "../components/features/index.js";
import { Navbar, Footer } from "../components/layout/index.js";
import Modal from "../components/ui/Modal.jsx";
import Button from "../components/ui/Button.jsx";
import { formatCurrency } from "../utils/formatCurrency.js";
import { AMENITY_ICONS } from "../utils/constants.js";

/**
 * Dashboard Page
 * @module pages/Dashboard
 *
 * Main hotel search page with filters, results, and comparison features.
 */

/**
 * Hotel Detail Modal Content
 */
const HotelDetailModal = ({ hotel, onClose }) => {
  const { isInComparison, toggleComparison, canAddMore } = useHotelContext();
  const inComparison = hotel ? isInComparison(hotel.id) : false;

  if (!hotel) return null;

  return (
    <div className="space-y-6">
      {/* Image Gallery */}
      <div className="grid grid-cols-3 gap-2">
        {hotel.images.slice(0, 3).map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`${hotel.name} ${index + 1}`}
            className={`w-full h-32 object-cover rounded-lg ${index === 0 ? "col-span-2 row-span-2 h-full" : ""}`}
          />
        ))}
      </div>

      {/* Info */}
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">{hotel.name}</h3>
            <p className="text-slate-400 flex items-center gap-1 mt-1">
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
              </svg>
              {hotel.location.address}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-amber-500">
              {formatCurrency(hotel.pricePerNight)}
            </p>
            <p className="text-slate-400 text-sm">per night</p>
          </div>
        </div>

        <p className="text-slate-300 mt-4">{hotel.description}</p>
      </div>

      {/* Rating & Reviews */}
      <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${i < hotel.rating ? "text-amber-400" : "text-slate-600"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <div className="h-8 w-px bg-slate-600" />
        <div>
          <span className="text-lg font-bold text-white">
            {hotel.userRating}
          </span>
          <span className="text-slate-400 ml-1">/ 10</span>
        </div>
        <span className="text-slate-400">
          ({hotel.reviewCount.toLocaleString()} reviews)
        </span>
      </div>

      {/* Amenities */}
      <div>
        <h4 className="text-white font-medium mb-3">Amenities</h4>
        <div className="flex flex-wrap gap-2">
          {hotel.amenities.map((amenity) => (
            <span
              key={amenity}
              className="px-3 py-1.5 bg-slate-700/50 text-slate-300 text-sm rounded-lg"
            >
              {AMENITY_ICONS[amenity] || "✓"} {amenity}
            </span>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="flex gap-4">
        {hotel.freeCancellation && (
          <div className="flex items-center gap-2 text-green-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Free Cancellation
          </div>
        )}
        {hotel.breakfastIncluded && (
          <div className="flex items-center gap-2 text-green-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Breakfast Included
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-slate-700">
        <Button
          variant={inComparison ? "primary" : "secondary"}
          onClick={() => toggleComparison(hotel)}
          disabled={!inComparison && !canAddMore}
          className="flex-1"
        >
          {inComparison ? "✓ In Comparison" : "+ Add to Compare"}
        </Button>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

/**
 * Dashboard component
 */
const Dashboard = () => {
  const {
    hotels,
    loading,
    error,
    total,
    hasMore,
    filters,
    updateFilters,
    search,
    loadMore,
    reset,
  } = useHotelSearch();

  const { comparisonCount, maxItems } = useHotelContext();
  const [selectedHotel, setSelectedHotel] = useState(null);

  // Initial search on mount
  useEffect(() => {
    search();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Find Your Perfect Hotel
            </h1>
            <p className="text-slate-400">
              Search and compare thousands of hotels to find the best deals
            </p>
          </div>

          {/* Comparison Bar */}
          {comparisonCount > 0 && (
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-amber-500 font-medium">
                  {comparisonCount} / {maxItems} hotels selected for comparison
                </span>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => (window.location.href = "/comparison")}
              >
                Compare Now →
              </Button>
            </div>
          )}

          {/* Filters */}
          <HotelFilters
            filters={filters}
            onFilterChange={updateFilters}
            onSearch={search}
            onReset={reset}
            loading={loading}
          />

          {/* Results */}
          <HotelList
            hotels={hotels}
            loading={loading}
            error={error}
            hasMore={hasMore}
            total={total}
            onLoadMore={loadMore}
            onViewDetails={setSelectedHotel}
            onReset={reset}
          />
        </div>
      </main>

      <Footer />

      {/* Hotel Detail Modal */}
      <Modal
        isOpen={!!selectedHotel}
        onClose={() => setSelectedHotel(null)}
        title="Hotel Details"
        size="lg"
      >
        <HotelDetailModal
          hotel={selectedHotel}
          onClose={() => setSelectedHotel(null)}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;
