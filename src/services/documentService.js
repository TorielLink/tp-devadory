import Parse from "parse";
import { Document } from "@/entities/Document";
import { getUserById } from "@/services/userService";
import { getProjectById } from "@/services/projectService";

// Crée un document et l'attache à un projet
export async function uploadDocument(title, file, projectId, userId) {
    if (!title || !file || !projectId || !userId) {
        throw new Error("Tous les champs sont requis.");
    }

    const project = await getProjectById(projectId);
    if (!project) throw new Error("Projet non trouvé.");

    const user = await getUserById(userId);
    if (!user) throw new Error("Utilisateur non trouvé.");

    const parseFile = new Parse.File(file.name, file);
    await parseFile.save();

    const document = new Document();

    document.set("title", title);
    document.set("file", parseFile);
    document.set("project", project);
    document.set("uploadedBy", user);
    document.set("uploadDate", new Date());

    return document.save();
}

// Récupère tous les documents d'un projet
export async function getProjectDocuments(projectId) {
    const project = await getProjectById(projectId);
    if (!project) throw new Error("Projet non trouvé.");

    const query = new Parse.Query(Document);
    query.equalTo("project", project);
    query.ascending("uploadDate");

    return query.find();
}

// Génère l'URL de téléchargement d'un document
export async function getDocumentDownloadUrl(documentId) {
    const query = new Parse.Query(Document);
    const document = await query.get(documentId);
    if (!document) throw new Error("Document non trouvé.");

    return document.get("file").url(); // retourne l'URL du fichier
}

// Supprime un document
export async function deleteDocument(documentId) {
    const query = new Parse.Query(Document);
    const document = await query.get(documentId);

    if (!document) throw new Error("Document non trouvé.");

    return document.destroy();
}
