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

    if (loading) return <p>Chargement...</p>;

    return (
        <div>
            <h2>{project.get("name")}</h2>
            <p>{project.get("description")}</p>
            <p>Statut: {project.get("status")}</p>
            <p>Date limite: {project.get("dueDate")?.toLocaleDateString()}</p>
            <button onClick={() => router.push(`/projects/${id}/edit`)}>Modifier</button>
            <button
                onClick={async () => {
                    await deleteProject(id);
                    router.push("/projects");
                }}
                style={{color: "red"}}
            >
                Supprimer
            </button>
            <button onClick={() => router.push(`/projects/${id}/members`)}>Gérer les membres</button>
        </div>
    );
}
