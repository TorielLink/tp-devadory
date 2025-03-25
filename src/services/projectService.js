import Parse from '../config/parseConfig';
import { createProject } from '@/entities/Project';

// Récupérer les projets de l'utilisateur connecté
export async function getProjectsByUser(userId) {
    const query = new Parse.Query('Project');
    query.equalTo('owner', { __type: 'Pointer', className: '_User', objectId: userId });

    try {
        return await query.find();
    } catch (error) {
        throw error;
    }
}

// Récupérer un projet par ID
export async function getProjectById(projectId) {
    const query = new Parse.Query('Project');
    try {
        return await query.get(projectId);
    } catch (error) {
        throw error;
    }
}

// Créer un nouveau projet
export async function createNewProject(name, description, dueDate, status, ownerId) {
    const project = createProject(name, description, dueDate, status, ownerId);
    try {
        return await project.save();
    } catch (error) {
        throw error;
    }
}

// Mettre à jour un projet
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

// Supprimer un projet
export async function deleteProject(projectId) {
    const query = new Parse.Query('Project');
    try {
        const project = await query.get(projectId);
        await project.destroy();
    } catch (error) {
        throw error;
    }
}
