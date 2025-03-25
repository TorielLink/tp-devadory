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
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const currentUser = Parse.User.current();
        if (!currentUser) return;

        try {
            await createNewProject(name, description, new Date(dueDate), status, currentUser.id);
            router.push("/projects");
        } catch (error) {
            console.error("Erreur lors de la création du projet : ", error);
        }
    };

    return (
        <div>
            <h2>Créer un projet</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} required />
                <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
                <button type="submit">Créer</button>
            </form>
        </div>
    );
}
