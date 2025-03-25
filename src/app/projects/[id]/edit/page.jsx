"use client";

import { useEffect, useState } from "react";
import { getProjectById, updateProject } from "@/services/projectService";
import { useRouter, useParams } from "next/navigation";

export default function EditProject() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [status, setStatus] = useState("À faire");
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { id } = useParams();

    useEffect(() => {
        async function fetchProject() {
            try {
                const project = await getProjectById(id);
                if (!project) {
                    router.push("/projects");
                    return;
                }
                setName(project.get("name"));
                setDescription(project.get("description"));
                setDueDate(project.get("dueDate")?.toISOString().split("T")[0]);
                setStatus(project.get("status"));
            } catch (error) {
                console.error("Erreur lors du chargement du projet : ", error);
            } finally {
                setLoading(false);
            }
        }

        fetchProject();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateProject(id, { name, description, dueDate: new Date(dueDate), status });
            router.push(`/projects/${id}`);
        } catch (error) {
            console.error("Erreur lors de la mise à jour : ", error);
        }
    };

    if (loading) return <p>Chargement...</p>;

    return (
        <div>
            <h2>Modifier le projet</h2>
            <form onSubmit={handleUpdate}>
                <input type="text" placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} required />
                <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option>À faire</option>
                    <option>En cours</option>
                    <option>Terminé</option>
                </select>
                <button type="submit">Mettre à jour</button>
            </form>
        </div>
    );
}
