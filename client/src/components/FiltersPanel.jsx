import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setKeyword,
  setCategory,
  setSubCategory,
  setFilter,
  setSort,
  clearFilters
} from '../redux/filters/filtersSlice.js';
import { getFieldsForSubcategory, FIELD_METADATA } from '../utils/subcategoryFields';

const CATEGORIES = [
  { key: 'all', title: 'All', subs: [] },
  { key: 'Real Estate', title: 'Real Estate', subs: ['Apartment', 'House', 'Land', 'Commercial'] },
  { key: 'Vehicles', title: 'Vehicles', subs: ['Car', 'Motorcycle', 'Truck', 'Bus'] },
  { key: 'Electronics', title: 'Electronics', subs: ['Mobile Phone', 'Laptop', 'TV', 'Camera'] },
];

export default function FiltersPanel({ onApply, compact = false }) {
  const dispatch = useDispatch();
  const filters = useSelector((s) => s.filters);

  const wrapperClass = compact
    ? 'p-2 sm:p-3 bg-white rounded-md shadow-sm w-full md:w-64'
    : 'p-3 sm:p-4 bg-white rounded-md shadow-sm w-full md:w-80';

  // Updated control styles — improved dropdown behavior on small screens
  const controlClass = `
    w-full p-2 sm:p-3 text-sm sm:text-base border rounded
    appearance-none focus:outline-none focus:ring-2 focus:ring-brand-500
    bg-white relative z-[60] overflow-visible
  `;

  const smallControlClass = `
    w-full p-2 sm:p-3 text-sm sm:text-base border rounded
    appearance-none focus:outline-none focus:ring-2 focus:ring-brand-500
    bg-white relative z-[60] overflow-visible
  `;

  const handleKeyword = (e) => dispatch(setKeyword(e.target.value));
  const handleCategory = (e) => dispatch(setCategory(e.target.value));
  const handleSub = (e) => dispatch(setSubCategory(e.target.value));
  const handleSort = (e) => dispatch(setSort(e.target.value));
  const toggleFilter = (key) => dispatch(setFilter({ key, value: !filters.filters[key] }));

  const onSubmit = (e) => {
    e.preventDefault();
    if (typeof onApply === 'function') onApply();
  };

  return (
    <aside
      className={`${wrapperClass}
        fixed bottom-0 left-0 right-0 md:static
        md:rounded-md md:shadow-sm
        md:w-72 md:max-h-[calc(100vh-1rem)]
        z-[50] bg-white
        border-t md:border-none
        max-h-[85vh] sm:max-h-[90vh]
        overflow-x-hidden overflow-y-auto
        overscroll-contain
      `}
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:gap-4">
        {/* Keyword */}
        <div>
          <label className="text-xs sm:text-sm font-semibold">Search</label>
          <input
            value={filters.keyword}
            onChange={handleKeyword}
            placeholder="Search listings"
            className={`${controlClass} mt-1`}
          />
        </div>

        {/* Category */}
        <div className="relative overflow-visible">
          <label className="text-xs sm:text-sm font-semibold">Category</label>
          <select
            value={filters.category}
            onChange={handleCategory}
            className={`${controlClass} mt-1`}
          >
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory */}
        {filters.category !== 'all' && (
          <div className="relative overflow-visible">
            <label className="text-xs sm:text-sm font-semibold">Subcategory</label>
            <select
              value={filters.subCategory}
              onChange={handleSub}
              className={`${controlClass} mt-1`}
            >
              <option value="all">All</option>
              {CATEGORIES.find((c) => c.key === filters.category)?.subs?.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Dynamic Filters */}
        {filters.category !== 'all' && filters.subCategory !== 'all' && (
          <div>
            <label className="text-xs sm:text-sm font-semibold">More filters</label>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-1 gap-2">
              {getFieldsForSubcategory(filters.category, filters.subCategory).map((field) => {
                const meta = FIELD_METADATA[field];
                const value = filters.filters[field] ?? '';
                if (!meta) return null;

                if (meta.type === 'select' || meta.type === 'radio') {
                  return (
                    <div key={field} className="flex flex-col relative overflow-visible">
                      <label className="text-xs sm:text-sm">{meta.label}</label>
                      <select
                        value={value}
                        onChange={(e) => dispatch(setFilter({ key: field, value: e.target.value }))}
                        className={`${smallControlClass} mt-1`}
                      >
                        <option value="">Any</option>
                        {meta.options?.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }

                if (meta.type === 'number') {
                  return (
                    <div key={field} className="flex flex-col">
                      <label className="text-xs sm:text-sm">{meta.label}</label>
                      <input
                        type="number"
                        value={value}
                        onChange={(e) =>
                          dispatch(
                            setFilter({
                              key: field,
                              value: e.target.value === '' ? '' : Number(e.target.value),
                            })
                          )
                        }
                        className={`${smallControlClass} mt-1`}
                      />
                    </div>
                  );
                }

                return (
                  <div key={field} className="flex flex-col">
                    <label className="text-xs sm:text-sm">{meta.label}</label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => dispatch(setFilter({ key: field, value: e.target.value }))}
                      className={`${smallControlClass} mt-1`}
                      placeholder={meta.placeholder || ''}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Amenities */}
        <div>
          <label className="text-xs sm:text-sm font-semibold">Amenities</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {['parking', 'furnished', 'offer'].map((a) => (
              <label key={a} className="flex items-center gap-1 text-xs sm:text-sm">
                <input
                  type="checkbox"
                  checked={!!filters.filters[a]}
                  onChange={() => toggleFilter(a)}
                  className="w-4 h-4 accent-brand-600"
                />
                <span className="capitalize">{a}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="relative overflow-visible">
          <label className="text-xs sm:text-sm font-semibold">Sort</label>
          <select
            value={filters.sort}
            onChange={handleSort}
            className={`${controlClass} mt-1`}
          >
            <option value="createdAt">Latest</option>
            <option value="regularPrice_desc">Price High to Low</option>
            <option value="regularPrice_asc">Price Low to High</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <button
            type="submit"
            className="bg-brand-600 hover:bg-brand-700 text-white px-3 py-2 rounded text-sm sm:text-base flex-1"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => dispatch(clearFilters())}
            className="border px-3 py-2 rounded text-sm sm:text-base flex-1"
          >
            Clear
          </button>
        </div>
      </form>
    </aside>
  );
}
