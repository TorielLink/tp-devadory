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
        <div className="bg-gray-100 min-h-screen flex items-center justify-center py-6 px-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full">
                <h1 className="text-4xl font-semibold text-gray-900 mb-6">Membres du projet</h1>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <ul className="space-y-4 mb-6">
                    {members.map((member) => (
                        <li key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-md">
                            <div>
                                <p className="font-semibold text-gray-800">{member.get("username")}</p>
                                <p className="text-sm text-gray-600">{member.get("email")}</p>
                            </div>
                            <button
                                onClick={() => handleRemoveMember(member.id)}
                                className="text-red-500 hover:text-red-600"
                            >
                                Supprimer
                            </button>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Email ou nom d'utilisateur"
                        value={newMember}
                        onChange={(e) => setNewMember(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md w-full"
                    />
                    <button
                        onClick={handleAddMember}
                        className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Ajouter
                    </button>
                </div>
            </div>
        </div>
    );
}
