"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getProjectDocuments, uploadDocument, getDocumentDownloadUrl, deleteDocument } from "@/services/documentService";

export default function ProjectDocuments() {
    const { id: projectId } = useParams();
    const router = useRouter();

    const [documents, setDocuments] = useState([]);
    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Récupère les documents au chargement
    useEffect(() => {
        async function fetchDocuments() {
            try {
                const docs = await getProjectDocuments(projectId);
                setDocuments(docs);
            } catch (err) {
                setError("Erreur lors de la récupération des documents.");
            }
        }
        fetchDocuments();
    }, [projectId]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!title || !file) return setError("Veuillez remplir tous les champs.");
        setLoading(true);

        try {
            const userId = "user-id"; // Remplace par l'ID de l'utilisateur connecté
            await uploadDocument(title, file, projectId, userId);
            setTitle("");
            setFile(null);
            setError("");
            setDocuments(await getProjectDocuments(projectId)); // Rafraîchir la liste
        } catch (err) {
            setError("Erreur lors de l'upload.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (documentId) => {
        if (!confirm("Voulez-vous vraiment supprimer ce document ?")) return;
        try {
            await deleteDocument(documentId);
            setDocuments(documents.filter(doc => doc.id !== documentId));
        } catch (err) {
            setError("Erreur lors de la suppression.");
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Documents du projet</h2>

            {error && <p className="text-red-500">{error}</p>}

            <form onSubmit={handleUpload} className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
                <input
                    type="text"
                    placeholder="Titre du document"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border p-2 w-full mb-2 rounded"
                    required
                />
                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="border p-2 w-full mb-2 rounded"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    disabled={loading}
                >
                    {loading ? "Envoi..." : "Uploader"}
                </button>
            </form>

            <ul className="space-y-4">
                {documents.map(doc => (
                    <li key={doc.id} className="flex justify-between items-center bg-white p-4 shadow-md rounded">
                        <span className="font-medium">{doc.get("title")}</span>
                        <div className="flex space-x-2">
                            <a
                                href={doc.get("file").url()}
                                target="_blank"
                                className="bg-green-500 text-white px-4 py-1 rounded"
                            >
                                Télécharger
                            </a>
                            <button
                                onClick={() => handleDelete(doc.id)}
                                className="bg-red-500 text-white px-4 py-1 rounded"
                            >
                                Supprimer
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            <button
                onClick={() => router.push(`/projects/${projectId}`)}
                className="mt-6 bg-gray-500 text-white px-4 py-2 rounded"
            >
                Retour au projet
            </button>
        </div>
    );
}
