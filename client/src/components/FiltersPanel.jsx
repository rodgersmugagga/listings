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

export default function FiltersPanel({ onApply, compact = false, lockedCategory = null }) {
  const dispatch = useDispatch();
  const filters = useSelector((s) => s.filters);

  const wrapperClass = compact
    ? 'p-1 bg-brand-50 rounded-md shadow w-full md:w-56'
    : 'p-1.5 sm:p-2 bg-brand-50 rounded-md shadow w-full md:w-64';

   const controlClass = `
    w-full p-1 text-xs border rounded
    appearance-none focus:outline-none focus:ring-2 focus:ring-brand-500
    bg-white
  `;

  const handleKeyword = (e) => dispatch(setKeyword(e.target.value));
  const handleCategory = (e) => dispatch(setCategory(e.target.value));
  const handleSub = (e) => dispatch(setSubCategory(e.target.value));
  const handleSort = (e) => dispatch(setSort(e.target.value));
  //const toggleFilter = (key) => dispatch(setFilter({ key, value: !filters.filters[key] }));

  const onSubmit = (e) => {
    e.preventDefault();
    if (typeof onApply === 'function') onApply();
  };

   return (
    <aside
      className={`${wrapperClass}
        relative w-full   
        md:rounded-md md:shadow-sm
        md:w-72 md:max-h-[calc(100vh-1rem)]
        z-[50] bg-brand-50
        border-t border-brand-200 md:border-none
        max-h-[85vh] sm:max-h-[90vh]
        overflow-x-hidden overflow-y-auto
        overscroll-contain
      `}
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-1.5">

        {/* Search */}
        <div>
          <label className="text-[10px] font-medium">Search</label>
          <input
            value={filters.keyword}
            onChange={handleKeyword}
            placeholder="Search listings"
            className={`${controlClass} mt-0.5`}
          />
        </div>

        {/* Category & Subcategory */}
        {!lockedCategory && (
          <div className="grid grid-cols-2 gap-1.5">
            <div>
              <label className="text-[10px] font-medium">Category</label>
              <select
                value={filters.category}
                onChange={handleCategory}
                className={`${controlClass} mt-0.5`}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            {filters.category !== 'all' && (
              <div>
                <label className="text-[10px] font-medium">Subcategory</label>
                <select
                  value={filters.subCategory}
                  onChange={handleSub}
                  className={`${controlClass} mt-0.5`}
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
          </div>
        )}

        {/* Subcategory only (when category is locked) */}
        {lockedCategory && (
          <div>
            <label className="text-[10px] font-medium">Subcategory</label>
            <select
              value={filters.subCategory}
              onChange={handleSub}
              className={`${controlClass} mt-0.5 w-full`}
            >
              <option value="all">All</option>
              {CATEGORIES.find((c) => c.key === lockedCategory)?.subs?.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Dynamic Filters (4 per row on mobile) */}
        {(lockedCategory || filters.category !== 'all') && filters.subCategory !== 'all' && (
          <div>
            <label className="text-[10px] font-medium">More filters</label>
            <div className="mt-1 grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 gap-1">
              {getFieldsForSubcategory(lockedCategory || filters.category, filters.subCategory).map((field) => {
                const meta = FIELD_METADATA[field];
                const value = filters.filters[field] ?? '';
                if (!meta) return null;

                if (meta.type === 'select' || meta.type === 'radio') {
                  return (
                    <div key={field} className="flex flex-col">
                      <label className="text-[9px] sm:text-[10px] font-medium truncate">{meta.label}</label>
                      <select
                        value={value}
                        onChange={(e) => dispatch(setFilter({ key: field, value: e.target.value }))}
                        className={`${controlClass} mt-0.5 text-[11px]`}
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
                      <label className="text-[9px] sm:text-[10px] font-medium truncate">{meta.label}</label>
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
                        className={`${controlClass} mt-0.5 text-[11px]`}
                      />
                    </div>
                  );
                }

                return (
                  <div key={field} className="flex flex-col">
                    <label className="text-[9px] sm:text-[10px] font-medium truncate">{meta.label}</label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => dispatch(setFilter({ key: field, value: e.target.value }))}
                      className={`${controlClass} mt-0.5 text-[11px]`}
                      placeholder={meta.placeholder || ''}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Sort */}
        <div className="grid grid-cols-2 gap-1.5">
          <div>
            <label className="text-[10px] font-medium">Sort</label>
            <select
              value={filters.sort}
              onChange={handleSort}
              className={`${controlClass} mt-0.5`}
            >
              <option value="createdAt">Latest</option>
              <option value="regularPrice_desc">Price High to Low</option>
              <option value="regularPrice_asc">Price Low to High</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-1.5 mt-1">
          <button
            type="submit"
            className="bg-brand-600 hover:bg-brand-700 text-white px-3 py-1.5 rounded text-sm flex-1"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => dispatch(clearFilters())}
            className="border border-brand-300 text-brand-600 px-3 py-1.5 rounded text-sm flex-1"
          >
            Clear
          </button>
        </div>
      </form>
    </aside>
  );
}
