"use client";

import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface PasswordInputProps {
    withConfirm?: boolean;
}

export default function PasswordInput({
    withConfirm = false,
}: PasswordInputProps) {
    return (
        <div className="flex flex-col space-y-2">
            <label htmlFor="password" className="text-gray-700">
                Password
            </label>
            <PasswordField placeholder="Password" />
            {withConfirm && (
                <PasswordField
                    placeholder="Confirm Password"
                />
            )}
        </div>
    );
}

function PasswordField({
    placeholder,
}: {
    placeholder: string;
}) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="flex flex-col space-y-1">
            <div className="relative">
                <input
                    type={visible ? "text" : "password"}
                    id={placeholder.toLowerCase().replace(" ", "-")}
                    name={placeholder.toLowerCase().replace(" ", "-")}
                    placeholder={placeholder}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-green-200 focus:outline-none focus:ring focus:ring-green-400"
                    required
                />
                <button
                    type="button"
                    onClick={() => setVisible(!visible)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none">
                    {visible ? (
                        <EyeIcon className="h-5 w-5" />
                    ) : (
                        <EyeSlashIcon className="h-5 w-5" />
                    )}
                </button>
            </div>
        </div>
    );
}
