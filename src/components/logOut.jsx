"use client"; // Nécessaire pour utiliser useRouter qui est un hook qui ne fonctionne que dans un composant client

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logOutUser } from '@/services/authService';

export default function Logout() {
    const router = useRouter();

    useEffect(() => {
        const logOut = async () => {
            await logOutUser();
            router.push('/login'); // Redirige vers la page de connexion après déconnexion
        };
        logOut();
    }, [router]);

    return (
        <div>
            <h2>Déconnexion...</h2>
        </div>
    );
}
