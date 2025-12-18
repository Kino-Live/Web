"use client";

import { useState, useEffect } from "react";
import { useProfile } from "@/app/lib/hooks/useProfile";
import Button from "@/app/components/ui/button";

/**
 * Компонент формы редактирования профиля
 */
export default function ProfileForm() {
    const { profile, loading, error, updateProfile } = useProfile();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        city: "",
        phone: "",
        dateOfBirth: "",
        email: "",
    });
    const [saveLoading, setSaveLoading] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Заполняем форму данными профиля
    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || "",
                lastName: profile.lastName || "",
                city: profile.city || "",
                phone: profile.phone || "",
                dateOfBirth: profile.dateOfBirth || "",
                email: profile.email || "",
            });
        }
    }, [profile]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            setSaveLoading(true);
            setSaveError(null);
            setSaveSuccess(false);
            await updateProfile(formData);
            setSaveSuccess(true);
            setIsEditing(false);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            setSaveError(err instanceof Error ? err.message : "Failed to save");
        } finally {
            setSaveLoading(false);
        }
    };

    const handleCancel = () => {
        if (profile) {
            setFormData({
                name: profile.name || "",
                lastName: profile.lastName || "",
                city: profile.city || "",
                phone: profile.phone || "",
                dateOfBirth: profile.dateOfBirth || "",
                email: profile.email || "",
            });
        }
        setIsEditing(false);
        setSaveError(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-white text-lg">Loading profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-red-400 text-lg">{error}</p>
            </div>
        );
    }

    if (!profile) {
        return null;
    }

    const displayName = profile.name && profile.lastName 
        ? `${profile.name} ${profile.lastName}` 
        : profile.email.split("@")[0];
    const displayEmail = profile.email;

    return (
        <div className="border-2 border-green-400 rounded-lg p-8 shadow-[0_0_20px_rgba(74,222,128,0.3)] bg-black/40">
            {/* Верхняя секция с аватаром и основной информацией */}
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    {profile.avatar ? (
                        <img
                            src={profile.avatar}
                            alt={displayName}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <span>{displayName.charAt(0).toUpperCase()}</span>
                    )}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">{displayName}</h2>
                    <p className="text-gray-400 text-sm">{displayEmail}</p>
                </div>
            </div>

            {/* Секция Contact Information */}
            <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Your City</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="Your City"
                            className="w-full px-4 py-2 rounded-lg bg-white text-gray-900 placeholder-gray-400 border-none focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Your Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="Your Phone"
                            className="w-full px-4 py-2 rounded-lg bg-white text-gray-900 placeholder-gray-400 border-none focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Your Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="Your Email"
                            className="w-full px-4 py-2 rounded-lg bg-white text-gray-900 placeholder-gray-400 border-none focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>
                </div>
            </div>

            {/* Секция Personal Information */}
            <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Your Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="Your Name"
                            className="w-full px-4 py-2 rounded-lg bg-white text-gray-900 placeholder-gray-400 border-none focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Your Surname</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="Your Surname"
                            className="w-full px-4 py-2 rounded-lg bg-white text-gray-900 placeholder-gray-400 border-none focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Date of birth</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="Date of birth"
                            className="w-full px-4 py-2 rounded-lg bg-white text-gray-900 placeholder-gray-400 border-none focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>
                </div>
            </div>

            {/* Кнопки управления */}
            <div className="flex gap-4 justify-end">
                {!isEditing ? (
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => setIsEditing(true)}
                    >
                        Edit Profile
                    </Button>
                ) : (
                    <>
                        <Button
                            variant="outline"
                            size="md"
                            onClick={handleCancel}
                            disabled={saveLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            size="md"
                            onClick={handleSave}
                            disabled={saveLoading}
                        >
                            {saveLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </>
                )}
            </div>

            {/* Сообщения об ошибках и успехе */}
            {saveError && (
                <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <p className="text-red-400 text-sm">{saveError}</p>
                </div>
            )}
            {saveSuccess && (
                <div className="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                    <p className="text-green-400 text-sm">Profile updated successfully!</p>
                </div>
            )}
        </div>
    );
}
