"use client";

import { useEffect, useState } from "react";
import { getProjectsByUser } from "@/services/projectService";
import Parse from "@/config/parseConfig";
import { useRouter } from "next/navigation";

export default function ProjectList() {
    const [projects, setProjects] = useState([]);
    const router = useRouter();

    useEffect(() => {
        async function fetchProjects() {
            const currentUser = Parse.User.current();
            if (!currentUser) {
                router.push("/login");
                return;
            }
            try {
                const data = await getProjectsByUser(currentUser.id);
                setProjects(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des projets : ", error);
            }
        }
        fetchProjects();
    }, []);

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                {/* Titre de la page */}
                <h2 className="text-3xl font-semibold text-center text-gray-900 mb-6">Mes projets</h2>

                <div className="flex justify-end mb-6">
                    <button
                        onClick={() => router.push("/projects/new")}
                        className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
                    >
                        Créer un projet
                    </button>
                </div>

                {/* Liste des projets */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => router.push(`/projects/${project.id}`)}
                        >
                            <h3 className="text-xl font-semibold text-gray-900">{project.get("name")}</h3>
                            <p className="text-gray-600">{project.get("status")}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
