import { 
    AUTH_API_ROUTES,
    USERS_API_ROUTES,
    NEWS_API_ROUTES, 
    COMPANY_PROFILE_API_ROUTES, 
    LOCATIONS_API_ROUTES, 
    PRIVACY_POLICY_API_ROUTES, 
    CATEGORY_API_ROUTES, 
    PRODUCT_API_ROUTES, 
    GOLD_QUALITY_API_ROUTES, 
    PRODUCT_TYPE_API_ROUTES 
} from '../config/apiRoutes';
import { 
    NewsArticle, 
    CompanyProfile, 
    Shop, 
    PrivacyPolicy, 
    Category, 
    GoldProduct, 
    GoldQuality, 
    ProductType,
    User,
    LoginResponse
} from '../types';

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
    authToken = token;
};

// A generic fetch wrapper to handle common logic
async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
    const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    if (authToken) {
        defaultHeaders['Authorization'] = `Bearer ${authToken}`;
    }

    const config: RequestInit = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            let errorText = 'An unknown error occurred.';
            try {
                // Try to parse the error response body
                const errorData = await response.json();
                errorText = errorData.message || errorData.error || JSON.stringify(errorData);
            } catch (e) {
                // Fallback if the error response is not JSON
                errorText = await response.text();
            }
             // Ensure it's not empty
            if (!errorText) {
                errorText = `API Error: ${response.status} ${response.statusText}`;
            }
            throw new Error(errorText);
        }

        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return null as T;
        }

        return response.json() as Promise<T>;
    } catch (error) {
        console.error('API operation failed:', error);
        throw error;
    }
}

// --- Auth API ---

export const loginUser = async (credentials: { email: string, password: string }): Promise<LoginResponse> => {
    const response = await apiFetch<LoginResponse>(AUTH_API_ROUTES.LOGIN, {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
    if (response && response.token) {
        setAuthToken(response.token);
    }
    return response;
};

export const logoutUser = (): Promise<void> => {
    // We clear the token regardless of whether the API call succeeds
    const promise = apiFetch<void>(AUTH_API_ROUTES.LOGOUT, { method: 'POST' });
    setAuthToken(null);
    return promise;
};


// --- User API (CRUD) ---

export const getUsers = (): Promise<User[]> => {
    return apiFetch<User[]>(USERS_API_ROUTES.BASE);
};

// The "register" endpoint is used by the admin to create new users.
export const createUser = (user: Omit<User, 'id'>): Promise<User> => {
    return apiFetch<User>(AUTH_API_ROUTES.REGISTER, {
        method: 'POST',
        body: JSON.stringify(user),
    });
};

export const updateUser = (user: User): Promise<void> => {
    return apiFetch<void>(USERS_API_ROUTES.BY_ID(user.id), {
        method: 'PUT',
        body: JSON.stringify(user),
    });
};

export const deleteUser = (id: number): Promise<void> => {
    return apiFetch<void>(USERS_API_ROUTES.BY_ID(id), {
        method: 'DELETE',
    });
};

// --- News API ---

export const getNews = (pageNumber = 1, pageSize = 100, searchTerm = ''): Promise<NewsArticle[]> => {
    const params = new URLSearchParams({ pageNumber: String(pageNumber), pageSize: String(pageSize) });
    if (searchTerm) params.append('searchTerm', searchTerm);
    return apiFetch<NewsArticle[]>(`${NEWS_API_ROUTES.BASE}?${params.toString()}`);
};

export const createNews = (article: Omit<NewsArticle, 'id'>): Promise<NewsArticle> => {
    return apiFetch<NewsArticle>(NEWS_API_ROUTES.BASE, { method: 'POST', body: JSON.stringify(article) });
};

export const updateNews = (article: NewsArticle): Promise<void> => {
    return apiFetch<void>(NEWS_API_ROUTES.BY_ID(article.id), { method: 'PUT', body: JSON.stringify(article) });
};

export const deleteNews = (id: number): Promise<void> => {
    return apiFetch<void>(NEWS_API_ROUTES.BY_ID(id), { method: 'DELETE' });
};

// --- Company Profile API ---

export const getCompanyProfile = (): Promise<CompanyProfile> => {
    return apiFetch<CompanyProfile>(COMPANY_PROFILE_API_ROUTES.BASE);
};

export const createCompanyProfile = (profile: Omit<CompanyProfile, 'id'>): Promise<CompanyProfile> => {
    return apiFetch<CompanyProfile>(COMPANY_PROFILE_API_ROUTES.BASE, { method: 'POST', body: JSON.stringify(profile) });
};

export const updateCompanyProfile = (profile: CompanyProfile): Promise<void> => {
    return apiFetch<void>(COMPANY_PROFILE_API_ROUTES.BASE, { method: 'PUT', body: JSON.stringify(profile) });
};

export const deleteCompanyProfile = (): Promise<void> => {
    return apiFetch<void>(COMPANY_PROFILE_API_ROUTES.BASE, { method: 'DELETE' });
};

// --- Shops (Locations) API ---

export const getShops = (pageNumber = 1, pageSize = 100): Promise<Shop[]> => {
    const params = new URLSearchParams({ pageNumber: String(pageNumber), pageSize: String(pageSize) });
    return apiFetch<Shop[]>(`${LOCATIONS_API_ROUTES.BASE}?${params.toString()}`);
};

export const createShop = (shop: Omit<Shop, 'id'>): Promise<Shop> => {
    return apiFetch<Shop>(LOCATIONS_API_ROUTES.BASE, { method: 'POST', body: JSON.stringify(shop) });
};

export const updateShop = (shop: Shop): Promise<void> => {
    return apiFetch<void>(LOCATIONS_API_ROUTES.BY_ID(shop.id), { method: 'PUT', body: JSON.stringify(shop) });
};

export const deleteShop = (id: number): Promise<void> => {
    return apiFetch<void>(LOCATIONS_API_ROUTES.BY_ID(id), { method: 'DELETE' });
};

// --- Privacy Policy API ---

export const getPrivacyPolicy = (): Promise<PrivacyPolicy> => {
    return apiFetch<PrivacyPolicy>(PRIVACY_POLICY_API_ROUTES.BASE);
};

export const createPrivacyPolicy = (policy: Omit<PrivacyPolicy, 'id'>): Promise<PrivacyPolicy> => {
    return apiFetch<PrivacyPolicy>(PRIVACY_POLICY_API_ROUTES.BASE, { method: 'POST', body: JSON.stringify(policy) });
};

export const updatePrivacyPolicy = (policy: PrivacyPolicy): Promise<void> => {
    return apiFetch<void>(PRIVACY_POLICY_API_ROUTES.BASE, { method: 'PUT', body: JSON.stringify(policy) });
};

// --- Category API ---

export const getCategories = (): Promise<Category[]> => {
    return apiFetch<Category[]>(CATEGORY_API_ROUTES.BASE);
};

export const createCategory = (category: Omit<Category, 'id'>): Promise<Category> => {
    return apiFetch<Category>(CATEGORY_API_ROUTES.BASE, { method: 'POST', body: JSON.stringify(category) });
};

export const updateCategory = (category: Category): Promise<void> => {
    return apiFetch<void>(CATEGORY_API_ROUTES.BY_ID(category.id), { method: 'PUT', body: JSON.stringify(category) });
};

export const deleteCategory = (id: number): Promise<void> => {
    return apiFetch<void>(CATEGORY_API_ROUTES.BY_ID(id), { method: 'DELETE' });
};

// --- Product API ---

export const getProducts = (): Promise<GoldProduct[]> => {
    return apiFetch<GoldProduct[]>(PRODUCT_API_ROUTES.BASE);
};

export const createProduct = (product: Omit<GoldProduct, 'id'>): Promise<GoldProduct> => {
    return apiFetch<GoldProduct>(PRODUCT_API_ROUTES.BASE, { method: 'POST', body: JSON.stringify(product) });
};

export const updateProduct = (product: GoldProduct): Promise<void> => {
    return apiFetch<void>(PRODUCT_API_ROUTES.BY_ID(product.id), { method: 'PUT', body: JSON.stringify(product) });
};

export const deleteProduct = (id: number): Promise<void> => {
    return apiFetch<void>(PRODUCT_API_ROUTES.BY_ID(id), { method: 'DELETE' });
};

// --- Gold Quality API ---
export const getGoldQualities = (): Promise<GoldQuality[]> => {
    return apiFetch<GoldQuality[]>(GOLD_QUALITY_API_ROUTES.BASE);
};

// --- Product Type API ---
export const getProductTypes = (): Promise<ProductType[]> => {
    return apiFetch<ProductType[]>(PRODUCT_TYPE_API_ROUTES.BASE);
};
