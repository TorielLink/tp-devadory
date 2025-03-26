import Parse from '../config/parseConfig';
import {Project} from '@/entities/Project';
import {getUserById, getUserByIdentifier} from "@/services/userService";

// Crée un projet
export async function createProject (name, description, dueDate, status, ownerId, teamMemberIds = [])  {
    const project = new Project();

    // On vérifie si le statut est valide
    const validStatus = ["À faire", "En cours", "Terminé"];
    if (!validStatus.includes(status)) {
        throw new Error("Statut invalide");
    }

    // Si l'utilisateur existe, on le récupère ; sinon, on le crée
    const owner = getUserById(ownerId);
    if (!owner) throw new Error("Utilisateur inconnu");

    project.set("name", name);
    project.set("description", description);
    project.set("dueDate", dueDate);
    project.set("status", status);
    project.set("owner", owner);

    // Ajout des membres de l'équipe
    if (teamMemberIds.length > 0) {
        const relation = project.relation("teamMembers");
        const userQuery = new Parse.Query(Parse.User);
        userQuery.containedIn("objectId", teamMemberIds);
        const users = await userQuery.find();
        users.forEach(user => relation.add(user));
        //TODO: les créer s'ils n'existent pas
    }

    return project.save();
}

// Récupère les projets de l'utilisateur connecté
export async function getProjectsByUser(userId) {
    const query = new Parse.Query('Project');
    query.equalTo('owner', { __type: 'Pointer', className: '_User', objectId: userId });

    try {
        return await query.find();
    } catch (error) {
        throw error;
    }
}

// Récupère un projet par ID
export async function getProjectById(projectId) {
    const query = new Parse.Query('Project');
    try {
        return await query.get(projectId);
    } catch (error) {
        throw error;
    }
}

// Crée un nouveau projet
export async function createNewProject(name, description, dueDate, status, ownerId, teamMemberIds) {
    const project = createProject(name, description, dueDate, status, ownerId, teamMemberIds);
    try {
        return await project.save();
    } catch (error) {
        throw error;
    }
}

// Met à jour un projet
export async function updateProject(projectId, updates) {
    const query = new Parse.Query('Project');
    try {
        const project = await query.get(projectId);
        Object.keys(updates).forEach((key) => project.set(key, updates[key]));
        return await project.save();
    } catch (error) {
        throw error;
    }
}

// Supprime un projet
export async function deleteProject(projectId) {
    const query = new Parse.Query('Project');
    try {
        const project = await query.get(projectId);
        await project.destroy();
    } catch (error) {
        throw error;
    }
}


// Ajoute un membre à un projet via son email ou nom d'utilisateur
export const addMemberToProject = async (projectId, identifier) => {
    try {
        const user = await getUserByIdentifier(identifier);
        if (!user) {
            throw new Error("Utilisateur inconnu");
        }

        const project = getProjectById(projectId);

        // Ajoute l'utilisateur à la liste des membres de l'équipe du projet
        const relation = project.relation("teamMembers");
        await relation.add(user);

        return await project.save();
    } catch (error) {
        throw error;
    }
};

// Liste les membres d’un projet
export const getProjectMembers = async (projectId) => {
    try {
        const project = await getProjectById(projectId);
        const relation = project.relation("teamMembers");
        // On récupère tous les utilisateurs dans la relation "teamMembers".
        return await relation.query().find();
    } catch (error) {
        throw error;
    }
};

// Supprime un membre d’un projet
export const removeMemberFromProject = async (projectId, userId) => {
    try {
        const project = getProjectById(projectId);

        // Récupère l'utilisateur…
        const user = await getUserById(userId);
        if (!user) {
            throw new Error("Utilisateur introuvable.");
        }

        // … et le retire de la relation "teamMembers"
        const relation = project.relation("teamMembers");
        relation.remove(user);

        return await project.save();
    } catch (error) {
        throw error;
    }
};
