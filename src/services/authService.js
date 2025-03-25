import Parse from '../config/parseConfig';

// Inscription d'un utilisateur
export async function registerUser(username, email, password) {
    const user = new Parse.User();
    user.set("username", username);
    user.set("email", email);
    user.set("password", password);

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
