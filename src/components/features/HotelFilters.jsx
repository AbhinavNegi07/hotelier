import { useState } from "react";
import Input from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import Card from "../ui/Card.jsx";
import { GUEST_OPTIONS, SORT_OPTIONS } from "../../utils/constants.js";
import {
  getTodayForInput,
  getTomorrowForInput,
} from "../../utils/formatDate.js";

/**
 * HotelFilters Component
 * @module components/features/HotelFilters
 *
 * Search and filter controls for hotel search.
 */

/**
 * HotelFilters component props
 * @param {Object} props - Component props
 * @param {Object} props.filters - Current filter values
 * @param {Function} props.onFilterChange - Filter change handler
 * @param {Function} props.onSearch - Search handler
 * @param {Function} props.onReset - Reset handler
 * @param {boolean} [props.loading=false] - Loading state
 * @returns {JSX.Element} HotelFilters component
 */
const HotelFilters = ({
  filters,
  onFilterChange,
  onSearch,
  onReset,
  loading = false,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  /**
   * Handle input change
   * @param {string} field - Field name
   * @param {any} value - New value
   */
  const handleChange = (field, value) => {
    onFilterChange({ [field]: value });
  };

  /**
   * Handle form submit
   * @param {React.FormEvent} e - Form event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <Card className="mb-8">
      <form onSubmit={handleSubmit}>
        {/* Main Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Location */}
          <Input
            label="Destination"
            placeholder="Where are you going?"
            value={filters.location || ""}
            onChange={(e) => handleChange("location", e.target.value)}
            leftIcon={
              <svg
                className="w-5 h-5"
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
            }
          />

          {/* Check-in Date */}
          <Input
            label="Check-in"
            type="date"
            value={filters.checkIn || getTodayForInput()}
            onChange={(e) => handleChange("checkIn", e.target.value)}
            min={getTodayForInput()}
          />

          {/* Check-out Date */}
          <Input
            label="Check-out"
            type="date"
            value={filters.checkOut || getTomorrowForInput()}
            onChange={(e) => handleChange("checkOut", e.target.value)}
            min={filters.checkIn || getTodayForInput()}
          />

          {/* Guests */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-300">
              Guests
            </label>
            <select
              value={filters.guests || 2}
              onChange={(e) => handleChange("guests", parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white transition-all duration-200 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            >
              {GUEST_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-amber-500 transition-colors mb-4"
        >
          <svg
            className={`w-4 h-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`}
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
          {showAdvanced ? "Hide" : "Show"} Advanced Filters
        </button>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pb-4 border-b border-slate-700">
            {/* Price Range */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">
                Price Range (per night)
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ""}
                  onChange={(e) =>
                    handleChange(
                      "minPrice",
                      e.target.value ? parseInt(e.target.value) : undefined,
                    )
                  }
                  className="flex-1"
                />
                <span className="text-slate-500">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || ""}
                  onChange={(e) =>
                    handleChange(
                      "maxPrice",
                      e.target.value ? parseInt(e.target.value) : undefined,
                    )
                  }
                  className="flex-1"
                />
              </div>
            </div>

            {/* Star Rating */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">
                Minimum Stars
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      handleChange(
                        "rating",
                        filters.rating === star ? undefined : star,
                      )
                    }
                    className={`
                      p-2 rounded-lg transition-all
                      ${
                        filters.rating >= star
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-slate-800 text-slate-500 hover:text-amber-400"
                      }
                    `}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">
                Sort By
              </label>
              <select
                value={filters.sortBy || "price_asc"}
                onChange={(e) => handleChange("sortBy", e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white transition-all duration-200 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="flex-1 sm:flex-none"
          >
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
          <Button type="button" variant="ghost" onClick={onReset}>
            Reset Filters
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default HotelFilters;
