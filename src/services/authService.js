import Parse from '../config/parseConfig';
import {createUser} from "@/services/userService";

// Récupère l'utilisateur actuel
export const getCurrentUser = () => {
    const user = Parse.User.current();
    return user ? user : null;
};

// Inscription d'un utilisateur
export async function registerUser(username, email, password, avatarFile = null) {
    const user = createUser(username, email, password, avatarFile);
    console.log("Utilisateur créé :", user);
    console.log("Est-ce une instance de Parse.User ?", user instanceof Parse.User);

    try {
        return await user.signUp();
    } catch (error) {
        throw error;
    }
}

// Connexion d'un utilisateur
export async function logInUser(username, password) {
    try {
        return await Parse.User.logIn(username, password);
    } catch (error) {
        throw error;
    }
}

// Déconnexion
export async function logOutUser() {
    try {
        await Parse.User.logOut();
    } catch (error) {
        throw error;
    }
}
