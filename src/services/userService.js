import Parse from "../config/parseConfig";
import { User } from "@/entities/User";

// Crée un nouvel utilisateur
export const createUser = async (username, email, password) => {
    const user = new User();
    user.set("username", username);
    user.set("email", email);
    user.set("password", password);

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
