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
        <div>
            <h2>Mes projets</h2>
            <button onClick={() => router.push("/projects/new")}>Créer un projet</button>
            <ul>
                {projects.map((project) => (
                    <li key={project.id} onClick={() => router.push(`/projects/${project.id}`)}>
                        {project.get("name")} - {project.get("status")}
                    </li>
                ))}
                {/*TODO: le onClick n'est pas intuitif, vaut mieux mettre un bouton'*/}
            </ul>
        </div>
    );
}
