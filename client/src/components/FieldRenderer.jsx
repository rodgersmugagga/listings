import { FIELD_METADATA, isFieldRequired } from '../utils/subcategoryFields';

/**
 * Responsive, accessible form field renderer
 * Auto-adjusts styles for mobile and desktop
 */
export default function FieldRenderer({
  fieldName,
  value,
  onChange,
  category,
  subCategory,
  error,
}) {
  const meta = FIELD_METADATA[fieldName];
  const isRequired = isFieldRequired(category, subCategory, fieldName);

  if (!meta) return null;

  const labelClasses =
    'block text-xs sm:text-sm font-medium mb-1 sm:mb-1.5 text-gray-800';
  const inputBase =
    'border rounded-lg w-full p-2 sm:p-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition appearance-auto z-50';
  const errorClass = error ? 'border-red-500 ring-red-300' : 'border-gray-300';

  const commonProps = {
    id: fieldName,
    onChange,
    value: value || '',
    required: isRequired,
    title: `${meta.label}${isRequired ? ' (required)' : ''}`,
    className: `${inputBase} ${errorClass}`,
  };

  switch (meta.type) {
    case 'number':
      return (
        <div className="flex flex-col w-full">
          <label htmlFor={fieldName} className={labelClasses}>
            {meta.label} {isRequired && <span className="text-red-500">*</span>}
          </label>
          <input
            {...commonProps}
            type="number"
            min={meta.min}
            max={meta.max}
            step={meta.step || 1}
            placeholder={meta.placeholder || ''}
          />
          {error && (
            <p className="text-red-500 text-xs mt-1 sm:mt-1.5">{error}</p>
          )}
        </div>
      );

    case 'text':
      return (
        <div className="flex flex-col w-full">
          <label htmlFor={fieldName} className={labelClasses}>
            {meta.label} {isRequired && <span className="text-red-500">*</span>}
          </label>
          <input
            {...commonProps}
            type="text"
            placeholder={meta.placeholder || ''}
          />
          {error && (
            <p className="text-red-500 text-xs mt-1 sm:mt-1.5">{error}</p>
          )}
        </div>
      );

    case 'select':
      return (
        <div className="flex flex-col w-full">
          <label htmlFor={fieldName} className={labelClasses}>
            {meta.label} {isRequired && <span className="text-red-500">*</span>}
          </label>
          <select {...commonProps}>
            <option value="">Select {meta.label.toLowerCase()}</option>
            {meta.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {error && (
            <p className="text-red-500 text-xs mt-1 sm:mt-1.5">{error}</p>
          )}
        </div>
      );

    case 'radio':
      return (
        <div className="flex flex-col w-full">
          <label className={labelClasses}>
            {meta.label} {isRequired && <span className="text-red-500">*</span>}
          </label>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {meta.options?.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-700"
              >
                <input
                  type="radio"
                  name={fieldName}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={onChange}
                  required={isRequired}
                  className="w-4 h-4 accent-brand-600"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
          {error && (
            <p className="text-red-500 text-xs mt-1 sm:mt-1.5">{error}</p>
          )}
        </div>
      );

    default:
      return null;
  }
}
