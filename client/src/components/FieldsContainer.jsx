import FieldRenderer from './FieldRenderer';

/**
 * Renders multiple fields from a fields array
 * Handles the mapping of fields to individual FieldRenderer components
 */
export default function FieldsContainer({ 
  fields = [], 
  data = {}, 
  onChange,
  category,
  subCategory,
  errors = {}
}) {
  if (!fields || fields.length === 0) {
    return <p className='text-gray-500 col-span-full'>No fields available for this category.</p>;
  }

  return (
    <>
      {fields.map(fieldName => (
        <FieldRenderer
          key={fieldName}
          fieldName={fieldName}
          value={data[fieldName]}
          onChange={(e) => {
            const { value, type, checked } = e.target;
            const finalValue = type === 'checkbox' ? checked : (type === 'number' && value !== '' ? Number(value) : value);
            onChange(fieldName, finalValue);
          }}
          category={category}
          subCategory={subCategory}
          error={errors[fieldName]}
        />
      ))}
    </>
  );
}
