import Parse from '../config/parseConfig';

export const Project = Parse.Object.extend("Project");

export const createProject = (name, description, dueDate, status, ownerEmail) => {
    const project = new Project();

    // On vérifie si le statut est valides
    const validStatus = ["À faire", "En cours", "Terminé"];
    if (!validStatus.includes(status)) {
        throw new Error("Invalid Status");
    }

    // Le champ 'owner' doit pointer vers un objet utilisateur ('user').
    const owner = new Parse.User();
    owner.setEmail(ownerEmail); // Je pars du principe que l'identifiant de l'utilisateur est l'email.

    project.set("name", name);
    project.set("description", description);
    project.set("dueDate", dueDate);
    project.set("status", status);
    project.set("owner", owner);

    return project;
};
