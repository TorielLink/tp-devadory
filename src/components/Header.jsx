"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function fetchUser() {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        }
        fetchUser();
    }, []);

    return (
        <header className="w-full bg-gray-900 text-white flex justify-between items-center p-4">
            {user && (
                <div className="relative">
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
                        {/* Affichage de l'avatar */}
                        {user.get("avatar") ? (
                            <img
                                src={user.get("avatar").url()}
                                alt="Avatar"
                                className="w-10 h-10 rounded-full border-2 border-white"
                            />
                        ) : (
                            <></>
                        )}
                        <span>{user.get("username")}</span>
                    </div>

                    {/* Menu déroulant */}
                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-md">
                            <button
                                onClick={() => router.push("/logout")}
                                className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                            >
                                Déconnexion
                            </button>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}
