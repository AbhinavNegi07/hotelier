import { Link } from "react-router-dom";
import { useHotelContext } from "../context/HotelContext.jsx";
import { Navbar, Footer } from "../components/layout/index.js";
import { ComparisonChart } from "../components/features/index.js";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import { formatCurrency } from "../utils/formatCurrency.js";

/**
 * Comparison Page
 * @module pages/Comparison
 *
 * Hotel comparison page with charts and detailed comparison table.
 */

/**
 * Empty comparison state
 */
const EmptyComparison = () => (
  <div className="text-center py-20">
    <div className="text-6xl mb-4">📊</div>
    <h2 className="text-2xl font-bold text-white mb-2">No Hotels to Compare</h2>
    <p className="text-slate-400 mb-6 max-w-md mx-auto">
      Start by adding hotels to your comparison list from the search results.
      You can compare up to 4 hotels at once.
    </p>
    <Link to="/dashboard">
      <Button variant="primary">
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        Search Hotels
      </Button>
    </Link>
  </div>
);

/**
 * Single hotel comparison card
 */
const ComparisonHotelCard = ({ hotel, onRemove }) => (
  <Card className="relative group">
    {/* Remove Button */}
    <button
      onClick={() => onRemove(hotel.id)}
      className="absolute top-2 right-2 p-1.5 bg-red-500/20 text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/30"
      aria-label="Remove from comparison"
    >
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
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>

    {/* Image */}
    <div className="h-32 mb-4 -mx-6 -mt-6 overflow-hidden rounded-t-2xl">
      <img
        src={hotel.images[0]}
        alt={hotel.name}
        className="w-full h-full object-cover"
      />
    </div>

    {/* Content */}
    <div>
      <h3 className="font-semibold text-white line-clamp-1">{hotel.name}</h3>
      <p className="text-slate-400 text-sm flex items-center gap-1 mt-1">
        <svg
          className="w-3 h-3"
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
        {hotel.location.city}
      </p>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1">
          {[...Array(hotel.rating)].map((_, i) => (
            <svg
              key={i}
              className="w-4 h-4 text-amber-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-amber-500 font-bold">
          {formatCurrency(hotel.pricePerNight)}
        </span>
      </div>
    </div>
  </Card>
);

/**
 * Comparison page component
 */
const Comparison = () => {
  const { comparisonList, removeFromComparison, clearComparison } =
    useHotelContext();

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Compare Hotels
              </h1>
              <p className="text-slate-400">
                {comparisonList.length > 0
                  ? `Comparing ${comparisonList.length} hotel${comparisonList.length > 1 ? "s" : ""}`
                  : "Select hotels to compare prices, ratings, and amenities"}
              </p>
            </div>

            {comparisonList.length > 0 && (
              <div className="flex gap-3">
                <Link to="/dashboard">
                  <Button variant="secondary" size="sm">
                    + Add More
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={clearComparison}>
                  Clear All
                </Button>
              </div>
            )}
          </div>

          {/* Content */}
          {comparisonList.length === 0 ? (
            <EmptyComparison />
          ) : (
            <div className="space-y-8">
              {/* Selected Hotels Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {comparisonList.map((hotel) => (
                  <ComparisonHotelCard
                    key={hotel.id}
                    hotel={hotel}
                    onRemove={removeFromComparison}
                  />
                ))}

                {/* Add More Placeholder */}
                {comparisonList.length < 4 && (
                  <Link
                    to="/dashboard"
                    className="flex flex-col items-center justify-center h-full min-h-[200px] border-2 border-dashed border-slate-700 rounded-2xl text-slate-500 hover:text-amber-500 hover:border-amber-500/50 transition-colors"
                  >
                    <svg
                      className="w-8 h-8 mb-2"
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
                    <span className="text-sm font-medium">Add Hotel</span>
                  </Link>
                )}
              </div>

              {/* Comparison Charts */}
              {comparisonList.length >= 2 && (
                <ComparisonChart hotels={comparisonList} />
              )}

              {/* Need more hotels message */}
              {comparisonList.length === 1 && (
                <Card className="text-center py-12">
                  <p className="text-slate-400 mb-4">
                    Add at least one more hotel to see the comparison charts
                  </p>
                  <Link to="/dashboard">
                    <Button variant="primary">Find More Hotels</Button>
                  </Link>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Comparison;
