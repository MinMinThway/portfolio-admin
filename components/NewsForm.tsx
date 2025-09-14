
import React, { useState, useEffect } from 'react';
import { NewsArticle } from '../types';

interface NewsFormProps {
    article: NewsArticle | null;
    onSave: (article: NewsArticle & {id: number | null}) => void;
    onCancel: () => void;
}

const emptyArticle: Omit<NewsArticle, 'id'> = {
    title: '',
    summary: '',
    contentBody: '',
    imagesUrl: [],
    publishDate: new Date().toISOString().split('T')[0], // Defaults to today
};

const NewsForm: React.FC<NewsFormProps> = ({ article, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<NewsArticle, 'id'> & {id: number | null, imagesUrlString: string}>({
        ...emptyArticle,
        id: null,
        imagesUrlString: ''
    });

    useEffect(() => {
        if(article) {
            setFormData({ ...article, imagesUrlString: article.imagesUrl.join(', ') });
        } else {
            setFormData({ 
                ...emptyArticle, 
                id: null,
                imagesUrlString: ''
            });
        }
    }, [article]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const articleToSave = {
            ...formData,
            imagesUrl: formData.imagesUrlString.split(',').map(url => url.trim()).filter(url => url),
        };
        // remove imagesUrlString before saving
        const { imagesUrlString, ...finalArticle } = articleToSave;
        onSave(finalArticle);
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center"
            aria-modal="true"
            role="dialog"
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto" role="document">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h3 className="text-2xl font-semibold text-text-primary mb-6">{article ? 'Edit Article' : 'Add New Article'}</h3>
                        <div className="space-y-4">
                             <div>
                                <label htmlFor="title" className="block text-sm font-medium text-text-secondary">Title</label>
                                <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                             <div>
                                <label htmlFor="publishDate" className="block text-sm font-medium text-text-secondary">Publish Date</label>
                                <input type="date" name="publishDate" id="publishDate" value={formData.publishDate} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="summary" className="block text-sm font-medium text-text-secondary">Summary</label>
                                <textarea name="summary" id="summary" value={formData.summary} onChange={handleChange} rows={3} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                             <div>
                                <label htmlFor="contentBody" className="block text-sm font-medium text-text-secondary">Content Body</label>
                                <textarea name="contentBody" id="contentBody" value={formData.contentBody} onChange={handleChange} rows={8} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                             <div>
                                <label htmlFor="imagesUrlString" className="block text-sm font-medium text-text-secondary">Image URLs</label>
                                <textarea name="imagesUrlString" id="imagesUrlString" value={formData.imagesUrlString} onChange={handleChange} rows={3} placeholder="Enter image URLs, separated by commas" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                                <p className="mt-1 text-xs text-text-secondary">Separate multiple URLs with a comma (e.g., https://.../img1.jpg, https://.../img2.jpg).</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg sticky bottom-0">
                         <button 
                            type="button" 
                            onClick={onCancel}
                            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            Save Article
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewsForm;
