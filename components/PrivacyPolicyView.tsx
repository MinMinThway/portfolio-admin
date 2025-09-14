import React, { useState, useEffect } from 'react';
import { PrivacyPolicy } from '../types';
import { getPrivacyPolicy, createPrivacyPolicy, updatePrivacyPolicy } from '../services/api';

const emptyPolicy: PrivacyPolicy = {
    id: 0,
    policyName1: '',
    description1: '',
    policyName2: '',
    description2: '',
    policyName3: '',
    description3: '',
    policyName4: '',
    description4: '',
    policyName5: '',
    description5: '',
};

const FormField: React.FC<{ label: string, name: keyof Omit<PrivacyPolicy, 'id'>, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void, isEditing: boolean, as?: 'textarea' }> =
({ label, name, value, onChange, isEditing, as }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-text-secondary">{label}</label>
        {isEditing ? (
            as === 'textarea' ? (
                <textarea
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
            ) : (
                <input
                    type="text"
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
            )
        ) : (
            <p className="mt-1 text-sm text-text-primary bg-gray-50 p-2 rounded-md min-h-[38px] whitespace-pre-wrap">{value || '-'}</p>
        )}
    </div>
);


const PrivacyPolicyView: React.FC = () => {
    const [policy, setPolicy] = useState<PrivacyPolicy | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<PrivacyPolicy>(emptyPolicy);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [policyExists, setPolicyExists] = useState(false);

    const fetchPolicy = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const fetchedPolicy = await getPrivacyPolicy();
            if (fetchedPolicy) {
                setPolicy(fetchedPolicy);
                setFormData(fetchedPolicy);
                setPolicyExists(true);
            } else {
                 setPolicy(emptyPolicy);
                 setFormData(emptyPolicy);
                 setPolicyExists(false);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch privacy policy.';
            setError(errorMessage);
            setPolicy(emptyPolicy);
            setFormData(emptyPolicy);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPolicy();
    }, []);


    const handleEditToggle = () => {
        if (isEditing && policy) {
            // Cancel editing
            setFormData(policy);
        }
        setIsEditing(!isEditing);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            if (policyExists) {
                await updatePrivacyPolicy(formData);
            } else {
                const { id, ...newPolicyData } = formData;
                await createPrivacyPolicy(newPolicyData);
            }
            await fetchPolicy();
            setIsEditing(false);
        } catch(err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to save policy.';
            setError(errorMessage);
        }
    };

    const policySections: { nameKey: keyof Omit<PrivacyPolicy, 'id'>, descKey: keyof Omit<PrivacyPolicy, 'id'>, number: number }[] = [
        { nameKey: 'policyName1', descKey: 'description1', number: 1 },
        { nameKey: 'policyName2', descKey: 'description2', number: 2 },
        { nameKey: 'policyName3', descKey: 'description3', number: 3 },
        { nameKey: 'policyName4', descKey: 'description4', number: 4 },
        { nameKey: 'policyName5', descKey: 'description5', number: 5 },
    ];

    if (isLoading) {
        return <div className="p-6 text-center text-text-secondary">Loading privacy policy...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-bold text-text-primary">Privacy and Policy</h3>
                <div className="flex space-x-2">
                    <button
                        onClick={handleEditToggle}
                        className={`px-4 py-2 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 transition-colors duration-200 ${isEditing ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400' : 'bg-primary text-white hover:bg-indigo-700 focus:ring-indigo-500'}`}
                    >
                        {isEditing ? 'Cancel' : (policyExists ? 'Edit Policy' : 'Create Policy')}
                    </button>
                    {isEditing && (
                         <button
                            type="submit"
                            form="privacy-policy-form"
                            className="px-4 py-2 bg-secondary text-white font-semibold rounded-lg shadow-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-75 transition-colors duration-200"
                        >
                            Save Changes
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6" role="alert">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}

            <form id="privacy-policy-form" onSubmit={handleSubmit}>
                 <div className="bg-card p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="space-y-8">
                        {policySections.map((section, index) => (
                            <div key={section.number} className={`space-y-4 ${index < policySections.length - 1 ? 'border-b pb-8' : ''}`}>
                                <FormField label={`Policy Name ${section.number}`} name={section.nameKey} value={formData[section.nameKey]} onChange={handleChange} isEditing={isEditing} />
                                <FormField label={`Description ${section.number}`} name={section.descKey} value={formData[section.descKey]} onChange={handleChange} isEditing={isEditing} as="textarea" />
                            </div>
                        ))}
                    </div>
                 </div>
            </form>
        </div>
    );
};

export default PrivacyPolicyView;