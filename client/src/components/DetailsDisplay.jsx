import { FIELD_METADATA, getFieldsForSubcategory } from '../utils/subcategoryFields';

export default function DetailsDisplay({ category, subCategory, details = {} }) {
  if (!category || !subCategory) return null;

  const fields = getFieldsForSubcategory(category, subCategory);

  if (!fields || fields.length === 0) return null;

  const displayItems = fields
    .filter((field) => details?.[field] !== undefined && details?.[field] !== null && details?.[field] !== '')
    .map((field) => ({
      label: FIELD_METADATA[field]?.label || capitalize(field),
      value: formatValue(details[field]),
    }));

  if (displayItems.length === 0) return null;

  return (
    <section className="mt-4 sm:mt-6">
      <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-3 border-b pb-1">
        Details
      </h4>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm">
        {displayItems.map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-2"
          >
            <span className="text-[11px] text-gray-500 font-medium capitalize leading-tight truncate">
              {label}
            </span>
            <span className="text-gray-800 font-semibold truncate leading-tight">
              {value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function capitalize(s) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatValue(v) {
  if (Array.isArray(v)) return v.join(', ');
  if (typeof v === 'boolean') return v ? 'Yes' : 'No';
  if (typeof v === 'number') return v.toLocaleString();
  return String(v);
}
