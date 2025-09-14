import { NEWS_API_ROUTES, COMPANY_PROFILE_API_ROUTES, LOCATIONS_API_ROUTES, PRIVACY_POLICY_API_ROUTES } from '../config/apiRoutes';
import { NewsArticle, CompanyProfile, Shop, PrivacyPolicy } from '../types';

// A generic fetch wrapper to handle common logic
async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
    const defaultOptions: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
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
