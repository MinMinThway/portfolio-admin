const API_BASE_URL = 'http://localhost:5026/api';

export const NEWS_API_ROUTES = {
    BASE: `${API_BASE_URL}/news`,
    BY_ID: (id: number | string) => `${API_BASE_URL}/news/${id}`,
};

export const COMPANY_PROFILE_API_ROUTES = {
    BASE: `${API_BASE_URL}/company-profile`,
};

export const LOCATIONS_API_ROUTES = {
    BASE: `${API_BASE_URL}/locations`,
    BY_ID: (id: number | string) => `${API_BASE_URL}/locations/${id}`,
};

export const PRIVACY_POLICY_API_ROUTES = {
    BASE: `${API_BASE_URL}/privacy-policy`,
};

export const CATEGORY_API_ROUTES = {
    BASE: `${API_BASE_URL}/category`,
    BY_ID: (id: number | string) => `${API_BASE_URL}/category/${id}`,
};

export const PRODUCT_API_ROUTES = {
    BASE: `${API_BASE_URL}/products`,
    BY_ID: (id: number | string) => `${API_BASE_URL}/products/${id}`,
};

export const GOLD_QUALITY_API_ROUTES = {
    BASE: `http://localhost:5226/api/gold-quality`,
};

export const PRODUCT_TYPE_API_ROUTES = {
    BASE: `http://localhost:5226/api/product-type`,
};
