const API_BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}){
  const res = await fetch(`${API_BASE}${path}`, options);
  const data = await res.json();
  if(!res.ok){
    const err = new Error(data.message || 'API Error');
    err.response = data;
    throw err;
  }
  return data;
}

export default {
  getListings: async (params = {}) => {
    // build query
    const q = new URLSearchParams();
    if (params.keyword) q.set('searchTerm', params.keyword);
    if (params.category && params.category !== 'all') q.set('category', params.category);
    if (params.subCategory && params.subCategory !== 'all') q.set('subCategory', params.subCategory);
    if (params.type) q.set('type', params.type);
    if (typeof params.offer !== 'undefined') q.set('offer', String(params.offer));
    if (params.limit) q.set('limit', params.limit);
    if (typeof params.startIndex !== 'undefined') q.set('startIndex', params.startIndex);
    if (params.sort) q.set('sort', params.sort);
    if (params.order) q.set('order', params.order);
    if (params.furnished) q.set('furnished', String(params.furnished));
    // include any filters
    if (params.filters) {
      Object.entries(params.filters).forEach(([k,v]) => {
        if (v !== null && typeof v !== 'undefined') q.set(k, v);
      });
    }

    return request(`/api/listing/get/?${q.toString()}`);
  },
  getListing: async (id) => request(`/api/listing/get/${id}`),
  uploadImages: async (formData, token) => {
    const res = await fetch(`${API_BASE}/api/listing/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token || ''}`,
      },
      body: formData,
    });
    const data = await res.json();
    if(!res.ok) throw new Error(data.message || 'Upload failed');
    return data;
  },
};
