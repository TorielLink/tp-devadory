import Parse from '../config/parseConfig';
import {createUser} from "@/services/userService";

// Inscription d'un utilisateur
export async function registerUser(username, email, password) {
    const user = createUser(username, email, password);

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
