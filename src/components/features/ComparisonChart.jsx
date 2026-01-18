import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { CHART_COLORS, AMENITY_ICONS } from "../../utils/constants.js";
import { formatCurrency } from "../../utils/formatCurrency.js";

/**
 * ComparisonChart Component
 * @module components/features/ComparisonChart
 *
 * Visualizes hotel comparison data using various chart types.
 */

/**
 * Custom chart tooltip
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
      <p className="text-white font-medium mb-2">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-sm" style={{ color: entry.color }}>
          {entry.name}:{" "}
          {typeof entry.value === "number" && entry.dataKey === "pricePerNight"
            ? formatCurrency(entry.value)
            : entry.value}
        </p>
      ))}
    </div>
  );
};

/**
 * Price comparison bar chart
 * @param {Object} props - Component props
 * @param {import('../../api/mockData.js').Hotel[]} props.hotels - Hotels to compare
 */
export const PriceComparisonChart = ({ hotels }) => {
  const data = hotels.map((hotel, index) => ({
    name:
      hotel.name.length > 15 ? hotel.name.substring(0, 15) + "..." : hotel.name,
    pricePerNight: hotel.pricePerNight,
    fill: Object.values(CHART_COLORS)[index % 4],
  }));

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Price Comparison
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
          <XAxis
            dataKey="name"
            tick={{ fill: CHART_COLORS.text, fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            tick={{ fill: CHART_COLORS.text }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="pricePerNight"
            fill={CHART_COLORS.primary}
            radius={[4, 4, 0, 0]}
            name="Price per Night"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Rating comparison chart
 * @param {Object} props - Component props
 * @param {import('../../api/mockData.js').Hotel[]} props.hotels - Hotels to compare
 */
export const RatingComparisonChart = ({ hotels }) => {
  const data = hotels.map((hotel, index) => ({
    name:
      hotel.name.length > 12 ? hotel.name.substring(0, 12) + "..." : hotel.name,
    userRating: hotel.userRating,
    starRating: hotel.rating * 2, // Normalize to 10 scale
    fill: Object.values(CHART_COLORS)[index % 4],
  }));

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Rating Comparison
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
          <XAxis
            dataKey="name"
            tick={{ fill: CHART_COLORS.text, fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis tick={{ fill: CHART_COLORS.text }} domain={[0, 10]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: CHART_COLORS.text }} />
          <Bar
            dataKey="userRating"
            fill={CHART_COLORS.primary}
            name="User Rating"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="starRating"
            fill={CHART_COLORS.secondary}
            name="Star Rating (x2)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Amenities radar chart
 * @param {Object} props - Component props
 * @param {import('../../api/mockData.js').Hotel[]} props.hotels - Hotels to compare
 */
export const AmenitiesRadarChart = ({ hotels }) => {
  // Get all unique amenities
  const allAmenities = [...new Set(hotels.flatMap((h) => h.amenities))].slice(
    0,
    8,
  );

  const data = allAmenities.map((amenity) => {
    const point = { amenity };
    hotels.forEach((hotel, index) => {
      point[`hotel${index + 1}`] = hotel.amenities.includes(amenity) ? 1 : 0;
    });
    return point;
  });

  const colors = [
    CHART_COLORS.primary,
    CHART_COLORS.secondary,
    CHART_COLORS.tertiary,
    CHART_COLORS.quaternary,
  ];

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Amenities Comparison
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <RadarChart data={data}>
          <PolarGrid stroke={CHART_COLORS.grid} />
          <PolarAngleAxis
            dataKey="amenity"
            tick={{ fill: CHART_COLORS.text, fontSize: 11 }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 1]} tick={false} />
          {hotels.map((hotel, index) => (
            <Radar
              key={hotel.id}
              name={hotel.name.substring(0, 15)}
              dataKey={`hotel${index + 1}`}
              stroke={colors[index]}
              fill={colors[index]}
              fillOpacity={0.3}
            />
          ))}
          <Legend wrapperStyle={{ color: CHART_COLORS.text }} />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Comparison table component
 * @param {Object} props - Component props
 * @param {import('../../api/mockData.js').Hotel[]} props.hotels - Hotels to compare
 */
export const ComparisonTable = ({ hotels }) => {
  const attributes = [
    {
      key: "pricePerNight",
      label: "Price / Night",
      format: (v) => formatCurrency(v),
    },
    { key: "rating", label: "Star Rating", format: (v) => "⭐".repeat(v) },
    { key: "userRating", label: "User Rating", format: (v) => `${v}/10` },
    { key: "reviewCount", label: "Reviews", format: (v) => v.toLocaleString() },
    { key: "roomType", label: "Room Type", format: (v) => v },
    {
      key: "freeCancellation",
      label: "Free Cancel",
      format: (v) => (v ? "✅ Yes" : "❌ No"),
    },
    {
      key: "breakfastIncluded",
      label: "Breakfast",
      format: (v) => (v ? "✅ Included" : "❌ Not included"),
    },
  ];

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-2xl overflow-hidden">
      <h3 className="text-lg font-semibold text-white p-6 border-b border-slate-700">
        Detailed Comparison
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                Attribute
              </th>
              {hotels.map((hotel) => (
                <th
                  key={hotel.id}
                  className="px-6 py-4 text-left text-sm font-medium text-white"
                >
                  {hotel.name.length > 20
                    ? hotel.name.substring(0, 20) + "..."
                    : hotel.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attributes.map((attr, index) => (
              <tr
                key={attr.key}
                className={`border-b border-slate-700/50 ${
                  index % 2 === 0 ? "bg-slate-800/30" : ""
                }`}
              >
                <td className="px-6 py-4 text-sm text-slate-400">
                  {attr.label}
                </td>
                {hotels.map((hotel) => (
                  <td key={hotel.id} className="px-6 py-4 text-sm text-white">
                    {attr.format(hotel[attr.key])}
                  </td>
                ))}
              </tr>
            ))}
            {/* Amenities row */}
            <tr className="bg-slate-800/30">
              <td className="px-6 py-4 text-sm text-slate-400">Amenities</td>
              {hotels.map((hotel) => (
                <td key={hotel.id} className="px-6 py-4 text-sm text-white">
                  <div className="flex flex-wrap gap-1">
                    {hotel.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="px-2 py-0.5 bg-slate-700 rounded text-xs"
                        title={amenity}
                      >
                        {AMENITY_ICONS[amenity] || "✓"}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * Main ComparisonChart component - renders all comparison visualizations
 */
const ComparisonChart = ({ hotels }) => {
  if (!hotels || hotels.length < 2) {
    return (
      <div className="text-center py-12 text-slate-400">
        <p>Select at least 2 hotels to compare</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriceComparisonChart hotels={hotels} />
        <RatingComparisonChart hotels={hotels} />
      </div>
      <AmenitiesRadarChart hotels={hotels} />
      <ComparisonTable hotels={hotels} />
    </div>
  );
};

export default ComparisonChart;
