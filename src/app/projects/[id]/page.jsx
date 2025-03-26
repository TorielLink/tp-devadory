"use client";

import { useEffect, useState } from "react";
import { getProjectById, deleteProject } from "@/services/projectService";
import { useRouter, useParams } from "next/navigation";

export default function ProjectDetail() {
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { id } = useParams();

    useEffect(() => {
        async function fetchProject() {
            try {
                const data = await getProjectById(id);
                if (!data) {
                    router.push("/projects"); // Redirige si le projet n'existe pas
                    return;
                }
                setProject(data);
            } catch (error) {
                console.error("Erreur lors du chargement du projet", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProject();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
            try {
                await deleteProject(id);
                router.push("/projects");
            } catch (error) {
                alert('Erreur lors de la suppression du projet.');
            }
        }
    };

    if (loading) return <p>Chargement...</p>;

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center py-6 px-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full">
                <h2 className="text-4xl font-semibold text-gray-900 mb-4">{project.get("name")}</h2>

                <p className="text-lg text-gray-700 mb-4">{project.get("description")}</p>

                <p className="text-sm text-gray-600 mb-4">
                    <strong>Statut :</strong> {project.get("status")}
                </p>

                <p className="text-sm text-gray-600 mb-6">
                    <strong>Date limite :</strong> {new Date(project.get("dueDate")).toLocaleDateString()}
                </p>

                <div className="flex justify-between gap-4">
                    <button
                        onClick={() => router.push(`/projects/${id}/edit`)}
                        className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Modifier
                    </button>

                    <button
                        onClick={handleDelete}
                        className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Supprimer
                    </button>

                    <button
                        onClick={() => router.push(`/projects/${id}/members`)}
                        className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition-colors"
                    >
                        Gérer les membres
                    </button>
                </div>
            </div>
        </div>
    );
}
