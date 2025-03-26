"use client";

import { useEffect, useState } from "react";
import { getProjectById, updateProject } from "@/services/projectService";
import { useRouter, useParams } from "next/navigation";

export default function EditProject() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [status, setStatus] = useState("À faire");
    const [coverImage, setCoverImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
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
        setIsSubmitting(true);

        setError("");
        try {
            await updateProject(id, { name, description, dueDate: new Date(dueDate), status });
            router.push(`/projects/${id}`);
        } catch (err) {
            setError("Erreur lors de la mise à jour du projet : " + err.message);
        } finally {
            setIsSubmitting(false);
        }

    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setCoverImage(e.target.files[0]);
        }
    };

    const handleUpdateCover = async () => {
        if (coverImage) {
            await updateProjectCoverImage(project.id, coverImage);
            alert("Image mise à jour !");
        }
    };

    if (loading) return <p>Chargement...</p>;

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center py-6 px-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
                <h2 className="text-3xl font-semibold text-gray-900 mb-6 text-center">
                    Modifier le projet
                </h2>

                {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

                <form onSubmit={handleUpdate}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                            Nom du projet
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Nom du projet"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                            Description du projet
                        </label>
                        <textarea
                            id="description"
                            placeholder="Description du projet"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="dueDate" className="block text-gray-700 font-medium mb-2">
                            Date d'échéance
                        </label>
                        <input
                            id="dueDate"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="status" className="block text-gray-700 font-medium mb-2">
                            Statut du projet
                        </label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option>À faire</option>
                            <option>En cours</option>
                            <option>Terminé</option>
                        </select>
                    </div>

                    <input type="file" accept="image/*" onChange={handleFileChange} className="my-2"/>
                    <button onClick={handleUpdateCover} className="bg-blue-500 text-white px-4 py-2 rounded">
                        Mettre à jour l’image
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-2 px-4 rounded-lg text-white ${
                            isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                        } focus:outline-none transition-colors`}
                    >
                        {isSubmitting ? "Mise à jour en cours..." : "Mettre à jour"}
                    </button>
                </form>
            </div>
        </div>
    );
}
