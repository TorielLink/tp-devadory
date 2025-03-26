import Parse from "../config/parseConfig";
import { User } from "@/entities/User";

// Crée un nouvel utilisateur
export const createUser = (username, email, password, avatarFile = null) => {
    const user = new Parse.User();
    user.set("username", username);
    user.set("email", email);
    user.set("password", password);

    if (avatarFile) {
        const parseFile = new Parse.File(avatarFile.name, avatarFile);
        user.set("avatar", parseFile);
    }

    try {
        return user;
    } catch (error) {
        throw error;
    }
};

// Récupère un utilisateur par son ID
export const getUserById = async (userId) => {
    const query = new Parse.Query(User);
    try {
        return await query.get(userId);
    } catch (error) {
        throw error;
    }
};

// Récupère un utilisateur par email ou son nom
export const getUserByIdentifier = async (identifier) => {
    try {
        const queryEmail = new Parse.Query(User);
        queryEmail.equalTo("email", identifier);
        const userByEmail = await queryEmail.first();

        const queryUsername = new Parse.Query(User);
        queryUsername.equalTo("username", identifier);
        const userByUsername = await queryUsername.first();

        return userByEmail || userByUsername || null;
    } catch (error) {
        throw error;
    }
};
