"use client";

import { useState } from "react";
import { createNewProject } from "@/services/projectService";
import Parse from "@/config/parseConfig";
import { useRouter } from "next/navigation";

export default function NewProject() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [status, setStatus] = useState("À faire");
    const [coverImage, setCoverImage] = useState(null);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setCoverImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        const currentUser = Parse.User.current();
        if (!currentUser) return;

        try {
            await createNewProject(name, description, new Date(dueDate), status, currentUser.id, coverImage);
            router.push("/projects");
        } catch (err) {
            setError("Erreur lors de la création du projet : " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center py-6 px-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
                <h2 className="text-3xl font-semibold text-gray-900 mb-6 text-center">
                    Créer un projet
                </h2>

                {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

                <form onSubmit={handleSubmit}>
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

                    <div className="mb-6">
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
                        <label htmlFor="coverImage" className="block text-gray-700 font-medium mb-2">
                            Image de couverture (optionnelle)
                        </label>
                        <input
                            id="coverImage"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-2 px-4 rounded-lg text-white ${
                            isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                        } focus:outline-none transition-colors`}
                    >
                        {isSubmitting ? "Création en cours..." : "Créer le projet"}
                    </button>
                </form>
            </div>
        </div>
    );
}
