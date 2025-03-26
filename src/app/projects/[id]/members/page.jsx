"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProjectMembers, addMemberToProject, removeMemberFromProject } from "@/services/projectService";

export default function ProjectMembersPage() {
    const { id: projectId } = useParams();
    const [members, setMembers] = useState([]);
    const [newMember, setNewMember] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchMembers() {
            try {
                const fetchedMembers = await getProjectMembers(projectId);
                setMembers(fetchedMembers);
            } catch (err) {
                setError("Erreur lors du chargement des membres.");
            }
        }
        fetchMembers();
    }, [projectId]);

    async function handleAddMember() {
        if (!newMember) return;
        try {
            await addMemberToProject(projectId, newMember);
            setNewMember("");
            setMembers(await getProjectMembers(projectId));
        } catch (err) {
            setError("Impossible d'ajouter ce membre.");
        }
    }

    async function handleRemoveMember(userId) {
        try {
            await removeMemberFromProject(projectId, userId);
            setMembers(await getProjectMembers(projectId));
        } catch (err) {
            setError("Erreur lors de la suppression du membre.");
        }
    }

    return (
        <div>
            <h1>Membres du projet</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <ul>
                {members.map(member => (
                    <li key={member.id}>
                        {member.get("username")} ({member.get("email")})
                        <button onClick={() => handleRemoveMember(member.id)}>Supprimer</button>
                    </li>
                ))}
            </ul>
            <input
                type="text"
                placeholder="Email ou nom d'utilisateur"
                value={newMember}
                onChange={(e) => setNewMember(e.target.value)}
            />
            <button onClick={handleAddMember}>Ajouter</button>
        </div>
    );
}
