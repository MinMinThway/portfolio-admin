import { AUTH_API_ROUTES, USERS_API_ROUTES, NEWS_API_ROUTES, COMPANY_PROFILE_API_ROUTES, LOCATIONS_API_ROUTES, PRIVACY_POLICY_API_ROUTES, CATEGORY_API_ROUTES, PRODUCT_API_ROUTES, GOLD_QUALITY_API_ROUTES, PRODUCT_TYPE_API_ROUTES } from '../config/apiRoutes';
import { User, NewsArticle, CompanyProfile, Shop, PrivacyPolicy, Category, GoldProduct, GoldQuality, ProductType } from '../types';

// A generic fetch wrapper to handle common logic
async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('authToken');
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const defaultOptions: RequestInit = {
        headers: headers,
    };

    const config: RequestInit = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return null as T;
        }

        return response.json() as Promise<T>;
    } catch (error) {
        console.error('Fetch operation failed:', error);
        throw error;
    }
}

// --- User API ---

export const registerUser = (user: Omit<User, 'id' | 'avatar'>): Promise<User> => {
    return apiFetch<User>(AUTH_API_ROUTES.REGISTER, {
        method: 'POST',
        body: JSON.stringify(user),
    });
};

export const getUsers = (): Promise<User[]> => {
    return apiFetch<User[]>(USERS_API_ROUTES.BASE);
};

export const updateUser = (user: User): Promise<void> => {
    const { id, ...userData } = user;
    // Don't send empty password
    if (userData.password === '' || userData.password === null || userData.password === undefined) {
        delete userData.password;
    }
    return apiFetch<void>(USERS_API_ROUTES.BY_ID(id), {
        method: 'PUT',
        body: JSON.stringify(userData),
    });
};

export const deleteUser = (id: number): Promise<void> => {
    return apiFetch<void>(USERS_API_ROUTES.BY_ID(id), {
        method: 'DELETE',
    });
};


// --- News API ---

/**
 * Fetches news articles from the API.
 * NOTE: This assumes the API returns an array of NewsArticle. If it returns a paginated object
 * like { items: [], ... }, this function will need to be adjusted to return response.items.
 */
export const getNews = (pageNumber = 1, pageSize = 100, searchTerm = ''): Promise<NewsArticle[]> => {
    const params = new URLSearchParams({
        pageNumber: String(pageNumber),
        pageSize: String(pageSize),
    });
    if (searchTerm) {
        params.append('searchTerm', searchTerm);
    }
    return apiFetch<NewsArticle[]>(`${NEWS_API_ROUTES.BASE}?${params.toString()}`);
};

export const createNews = (article: Omit<NewsArticle, 'id'>): Promise<NewsArticle> => {
    return apiFetch<NewsArticle>(NEWS_API_ROUTES.BASE, {
        method: 'POST',
        body: JSON.stringify(article),
    });
};

export const updateNews = (article: NewsArticle): Promise<void> => {
    return apiFetch<void>(NEWS_API_ROUTES.BY_ID(article.id), {
        method: 'PUT',
        body: JSON.stringify(article),
    });
};

export const deleteNews = (id: number): Promise<void> => {
    return apiFetch<void>(NEWS_API_ROUTES.BY_ID(id), {
        method: 'DELETE',
    });
};

// --- Company Profile API ---

export const getCompanyProfile = (): Promise<CompanyProfile> => {
    return apiFetch<CompanyProfile>(COMPANY_PROFILE_API_ROUTES.BASE);
};

export const createCompanyProfile = (profile: Omit<CompanyProfile, 'id'>): Promise<CompanyProfile> => {
    return apiFetch<CompanyProfile>(COMPANY_PROFILE_API_ROUTES.BASE, {
        method: 'POST',
        body: JSON.stringify(profile),
    });
};

export const updateCompanyProfile = (profile: CompanyProfile): Promise<void> => {
    return apiFetch<void>(COMPANY_PROFILE_API_ROUTES.BASE, {
        method: 'PUT',
        body: JSON.stringify(profile),
    });
};

export const deleteCompanyProfile = (): Promise<void> => {
    return apiFetch<void>(COMPANY_PROFILE_API_ROUTES.BASE, {
        method: 'DELETE',
    });
};

// --- Shops (Locations) API ---

export const getShops = (pageNumber = 1, pageSize = 100): Promise<Shop[]> => {
    const params = new URLSearchParams({
        pageNumber: String(pageNumber),
        pageSize: String(pageSize),
    });
    return apiFetch<Shop[]>(`${LOCATIONS_API_ROUTES.BASE}?${params.toString()}`);
};

export const createShop = (shop: Omit<Shop, 'id'>): Promise<Shop> => {
    return apiFetch<Shop>(LOCATIONS_API_ROUTES.BASE, {
        method: 'POST',
        body: JSON.stringify(shop),
    });
};

export const updateShop = (shop: Shop): Promise<void> => {
    return apiFetch<void>(LOCATIONS_API_ROUTES.BY_ID(shop.id), {
        method: 'PUT',
        body: JSON.stringify(shop),
    });
};

export const deleteShop = (id: number): Promise<void> => {
    return apiFetch<void>(LOCATIONS_API_ROUTES.BY_ID(id), {
        method: 'DELETE',
    });
};

// --- Privacy Policy API ---

export const getPrivacyPolicy = (): Promise<PrivacyPolicy> => {
    return apiFetch<PrivacyPolicy>(PRIVACY_POLICY_API_ROUTES.BASE);
};

export const createPrivacyPolicy = (policy: Omit<PrivacyPolicy, 'id'>): Promise<PrivacyPolicy> => {
    return apiFetch<PrivacyPolicy>(PRIVACY_POLICY_API_ROUTES.BASE, {
        method: 'POST',
        body: JSON.stringify(policy),
    });
};

export const updatePrivacyPolicy = (policy: PrivacyPolicy): Promise<void> => {
    return apiFetch<void>(PRIVACY_POLICY_API_ROUTES.BASE, {
        method: 'PUT',
        body: JSON.stringify(policy),
    });
};

// --- Category API ---

export const getCategories = (): Promise<Category[]> => {
    return apiFetch<Category[]>(CATEGORY_API_ROUTES.BASE);
};

export const createCategory = (category: Omit<Category, 'id'>): Promise<Category> => {
    return apiFetch<Category>(CATEGORY_API_ROUTES.BASE, {
        method: 'POST',
        body: JSON.stringify(category),
    });
};

export const updateCategory = (category: Category): Promise<void> => {
    return apiFetch<void>(CATEGORY_API_ROUTES.BY_ID(category.id), {
        method: 'PUT',
        body: JSON.stringify(category),
    });
};

export const deleteCategory = (id: number): Promise<void> => {
    return apiFetch<void>(CATEGORY_API_ROUTES.BY_ID(id), {
        method: 'DELETE',
    });
};

// --- Product API ---

export const getProducts = (): Promise<GoldProduct[]> => {
    return apiFetch<GoldProduct[]>(PRODUCT_API_ROUTES.BASE);
};

export const createProduct = (product: Omit<GoldProduct, 'id'>): Promise<GoldProduct> => {
    return apiFetch<GoldProduct>(PRODUCT_API_ROUTES.BASE, {
        method: 'POST',
        body: JSON.stringify(product),
    });
};

export const updateProduct = (product: GoldProduct): Promise<void> => {
    return apiFetch<void>(PRODUCT_API_ROUTES.BY_ID(product.id), {
        method: 'PUT',
        body: JSON.stringify(product),
    });
};

export const deleteProduct = (id: number): Promise<void> => {
    return apiFetch<void>(PRODUCT_API_ROUTES.BY_ID(id), {
        method: 'DELETE',
    });
};

// --- Gold Quality API ---
export const getGoldQualities = (): Promise<GoldQuality[]> => {
    return apiFetch<GoldQuality[]>(GOLD_QUALITY_API_ROUTES.BASE);
};

// --- Product Type API ---
export const getProductTypes = (): Promise<ProductType[]> => {
    return apiFetch<ProductType[]>(PRODUCT_TYPE_API_ROUTES.BASE);
};