import React, { useState, useEffect } from 'react';
import { NewsArticle } from '../types';
import { EditIcon, TrashIcon } from '../constants';
import NewsForm from './NewsForm';
import { getNews, createNews, updateNews, deleteNews } from '../services/api';

const NewsView: React.FC = () => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchArticles = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const fetchedArticles = await getNews();
            setArticles(fetchedArticles || []);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch news articles.';
            setError(errorMessage);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const handleAddArticle = () => {
        setEditingArticle(null);
        setIsFormOpen(true);
    };

    const handleEditArticle = (article: NewsArticle) => {
        setEditingArticle(article);
        setIsFormOpen(true);
    };

    const handleDeleteArticle = async (articleId: number) => {
        if (window.confirm('Are you sure you want to delete this article?')) {
            try {
                await deleteNews(articleId);
                await fetchArticles();
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to delete article.';
                setError(errorMessage);
                console.error(err);
            }
        }
    };

    const handleSaveArticle = async (articleToSave: NewsArticle & {id: number | null}) => {
        try {
            if (articleToSave.id === null) {
                const { id, ...newArticleData } = articleToSave;
                await createNews(newArticleData);
            } else {
                await updateNews({ ...articleToSave, id: articleToSave.id });
            }
            setIsFormOpen(false);
            setEditingArticle(null);
            await fetchArticles();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to save article.';
            setError(errorMessage);
            console.error(err);
        }
    };

    const handleCancel = () => {
        setIsFormOpen(false);
        setEditingArticle(null);
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <h3 className="text-3xl font-bold text-text-primary">News Management</h3>
                <button
                    onClick={handleAddArticle}
                    className="flex items-center justify-center px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-colors duration-200"
                >
                    <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Article
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6" role="alert">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}
            
            <div className="bg-card rounded-xl shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="p-6 text-center text-text-secondary">Loading articles...</div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Title</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider hidden md:table-cell">Summary</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Publish Date</th>
                                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                               {articles.length > 0 ? articles.map(article => (
                                   <tr key={article.id}>
                                       <td className="px-6 py-4 whitespace-normal text-sm font-medium text-text-primary max-w-sm">{article.title}</td>
                                       <td className="px-6 py-4 whitespace-normal text-sm text-text-secondary max-w-md hidden md:table-cell">{article.summary}</td>
                                       <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{new Date(article.publishDate).toLocaleDateString()}</td>
                                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                           <div className="flex items-center justify-end space-x-4">
                                                <button onClick={() => handleEditArticle(article)} className="text-primary hover:text-indigo-900" aria-label={`Edit ${article.title}`}>
                                                    <EditIcon className="h-5 w-5" />
                                                </button>
                                                <button onClick={() => handleDeleteArticle(article.id)} className="text-red-600 hover:text-red-900" aria-label={`Delete ${article.title}`}>
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                           </div>
                                       </td>
                                   </tr>
                               )) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-text-secondary">
                                        No news articles found.
                                    </td>
                                </tr>
                               )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {isFormOpen && <NewsForm article={editingArticle} onSave={handleSaveArticle} onCancel={handleCancel} />}
        </div>
    );
};

export default NewsView;
