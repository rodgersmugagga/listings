import { FIELD_METADATA, getFieldsForSubcategory } from '../utils/subcategoryFields';

export default function DetailsDisplay({ category, subCategory, details = {} }) {
  if (!category || !subCategory) return null;

  const fields = getFieldsForSubcategory(category, subCategory);

  // Fallback: no predefined fields — display whatever is in `details`
  if (!fields || fields.length === 0) {
    const keys = Object.keys(details);
    if (keys.length === 0) return null;

    return (
      <section className="mt-4 sm:mt-6">
        <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-3 border-b pb-1">
          Details
        </h4>
        <ul className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 text-xs sm:text-sm">
          {keys.map((k) => (
            <li
              key={k}
              className="flex justify-between sm:justify-start sm:gap-2 items-center border-b sm:border-none pb-1"
            >
              <span className="font-medium text-gray-700 capitalize truncate">
                {k.replace(/([A-Z])/g, ' $1')}:
              </span>
              <span className="text-gray-600 truncate">{formatValue(details[k])}</span>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section className="mt-4 sm:mt-6">
      <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-3 border-b pb-1">
        Details
      </h4>

      <ul className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 text-xs sm:text-sm">
        {fields.map((field) => {
          const meta = FIELD_METADATA[field];
          const value = details?.[field];
          if (value === undefined || value === null || value === '') return null;

          return (
            <li
              key={field}
              className="flex justify-between sm:justify-start sm:gap-2 items-center border-b sm:border-none pb-1"
            >
              <span className="font-medium text-gray-700 truncate">
                {(meta && meta.label) || capitalize(field)}:
              </span>
              <span className="text-gray-600 truncate">{formatValue(value)}</span>
            </li>
          );
        })}

        {/* Fallback for any extra keys not defined in metadata */}
        {Object.keys(details)
          .filter((k) => !fields.includes(k))
          .map((k) => (
            <li
              key={k}
              className="flex justify-between sm:justify-start sm:gap-2 items-center border-b sm:border-none pb-1"
            >
              <span className="font-medium text-gray-700 truncate">
                {capitalize(k)}:
              </span>
              <span className="text-gray-600 truncate">{formatValue(details[k])}</span>
            </li>
          ))}
      </ul>
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
  if (typeof v === 'number') return v.toLocaleString(); // adds commas
  return String(v);
}
