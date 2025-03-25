import Parse from '../config/parseConfig';

export const Project = Parse.Object.extend("Project");

export const createProject = (name, description, dueDate, status, ownerId) => {
    const project = new Project();

    // On vérifie si le statut est valides
    const validStatus = ["À faire", "En cours", "Terminé"];
    if (!validStatus.includes(status)) {
        throw new Error("Invalid Status");
    }

    // Le champ 'owner' doit pointer vers un objet utilisateur ('user').
    const owner = new Parse.User();
    owner.id = ownerId; // L'ID est généré automatiquement.

    project.set("name", name);
    project.set("description", description);
    project.set("dueDate", dueDate);
    project.set("status", status);
    project.set("owner", owner);

    return project;
};
