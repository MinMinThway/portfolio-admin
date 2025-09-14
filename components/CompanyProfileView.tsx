import React, { useState, useEffect } from 'react';
import { CompanyProfile } from '../types';
import { getCompanyProfile, updateCompanyProfile, createCompanyProfile } from '../services/api';

const initialProfile: CompanyProfile = {
    id: 0,
    companyName: '',
    description: '',
    address1: '',
    address2: '',
    facebookLink: '',
    youtubeLink: '',
    instagramLink: '',
    tiktokLink: '',
    infoMail: '',
    headOfficeAddress: '',
    hrMail: '',
    hotlinePhoneNumber: '',
    phone1: '',
    phone2: '',
    email: '',
    photoUrl: '',
    aboutUs: ''
};

const FormRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">{children}</div>
);

const FormField: React.FC<{ label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void, type?: string, required?: boolean, isEditing: boolean, as?: 'textarea' }> = 
({ label, name, value, onChange, type = 'text', required = false, isEditing, as }) => (
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
                    required={required}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
            ) : (
                <input
                    type={type}
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
            )
        ) : (
            <p className="mt-1 text-sm text-text-primary bg-gray-50 p-2 rounded-md min-h-[38px] whitespace-pre-wrap">{value || '-'}</p>
        )}
    </div>
);


const CompanyProfileView: React.FC = () => {
    const [profile, setProfile] = useState<CompanyProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<CompanyProfile>(initialProfile);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [profileExists, setProfileExists] = useState(false);

    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const fetchedProfile = await getCompanyProfile();
            if (fetchedProfile) {
                setProfile(fetchedProfile);
                setFormData(fetchedProfile);
                setProfileExists(true);
            } else {
                 setProfile(initialProfile);
                 setFormData(initialProfile);
                 setProfileExists(false);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch company profile.';
            setError(errorMessage);
            setProfile(initialProfile);
            setFormData(initialProfile);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleEditToggle = () => {
        if (isEditing && profile) {
            // Cancel editing
            setFormData(profile);
        }
        setIsEditing(!isEditing);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (profileExists) {
                await updateCompanyProfile(formData);
            } else {
                const { id, ...newProfileData } = formData;
                await createCompanyProfile(newProfileData);
            }
            await fetchProfile();
            setIsEditing(false);
        } catch (err) {
             const errorMessage = err instanceof Error ? err.message : 'Failed to save profile.';
            setError(errorMessage);
        }
    };

    if (isLoading) {
        return <div className="p-6 text-center text-text-secondary">Loading company profile...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-bold text-text-primary">Company Profile</h3>
                <div className="flex space-x-2">
                    <button
                        onClick={handleEditToggle}
                        className={`px-4 py-2 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 transition-colors duration-200 ${isEditing ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400' : 'bg-primary text-white hover:bg-indigo-700 focus:ring-indigo-500'}`}
                    >
                        {isEditing ? 'Cancel' : (profileExists ? 'Edit Profile' : 'Create Profile')}
                    </button>
                    {isEditing && (
                         <button
                            type="submit"
                            form="company-profile-form"
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

            <form id="company-profile-form" onSubmit={handleSubmit}>
                 <div className="bg-card p-6 rounded-xl shadow-sm border border-gray-200 space-y-8">
                    
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h4 className="text-xl font-semibold text-text-primary border-b pb-2">Basic Information</h4>
                        <FormRow>
                            <FormField label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} isEditing={isEditing} required />
                            <FormField label="Main Email" name="email" value={formData.email} onChange={handleChange} type="email" isEditing={isEditing} required />
                        </FormRow>
                         <FormField label="Company Slogan / Short Description" name="description" value={formData.description} onChange={handleChange} isEditing={isEditing} as="textarea" />
                         <FormField label="Profile Photo URL" name="photoUrl" value={formData.photoUrl} onChange={handleChange} isEditing={isEditing} />
                    </div>

                     {/* Contact Details */}
                    <div className="space-y-4">
                        <h4 className="text-xl font-semibold text-text-primary border-b pb-2">Contact Details</h4>
                        <FormRow>
                           <FormField label="Address Line 1" name="address1" value={formData.address1} onChange={handleChange} isEditing={isEditing} />
                           <FormField label="Address Line 2" name="address2" value={formData.address2} onChange={handleChange} isEditing={isEditing} />
                           <FormField label="Hotline Phone Number" name="hotlinePhoneNumber" value={formData.hotlinePhoneNumber} onChange={handleChange} type="tel" isEditing={isEditing} />
                           <FormField label="Phone 1" name="phone1" value={formData.phone1} onChange={handleChange} type="tel" isEditing={isEditing} />
                           <FormField label="Phone 2" name="phone2" value={formData.phone2} onChange={handleChange} type="tel" isEditing={isEditing} />
                           <FormField label="Info Email" name="infoMail" value={formData.infoMail} onChange={handleChange} type="email" isEditing={isEditing} />
                           <FormField label="HR Email" name="hrMail" value={formData.hrMail} onChange={handleChange} type="email" isEditing={isEditing} />
                        </FormRow>
                        <FormField label="Head Office Address" name="headOfficeAddress" value={formData.headOfficeAddress} onChange={handleChange} as="textarea" isEditing={isEditing} />
                    </div>

                    {/* Social Media */}
                    <div className="space-y-4">
                        <h4 className="text-xl font-semibold text-text-primary border-b pb-2">Social Media</h4>
                        <FormRow>
                            <FormField label="Facebook URL" name="facebookLink" value={formData.facebookLink} onChange={handleChange} type="url" isEditing={isEditing} />
                            <FormField label="YouTube URL" name="youtubeLink" value={formData.youtubeLink} onChange={handleChange} type="url" isEditing={isEditing} />
                            <FormField label="Instagram URL" name="instagramLink" value={formData.instagramLink} onChange={handleChange} type="url" isEditing={isEditing} />
                            <FormField label="TikTok URL" name="tiktokLink" value={formData.tiktokLink} onChange={handleChange} type="url" isEditing={isEditing} />
                        </FormRow>
                    </div>

                    {/* About Us */}
                     <div className="space-y-4">
                        <h4 className="text-xl font-semibold text-text-primary border-b pb-2">About Us</h4>
                        <FormField label="About Us Section" name="aboutUs" value={formData.aboutUs} onChange={handleChange} isEditing={isEditing} as="textarea" />
                    </div>

                 </div>
            </form>
        </div>
    );
};

export default CompanyProfileView;
