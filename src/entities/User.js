import Parse from '../config/parseConfig';

export const User = Parse.Object.extend("User");

export const createUser = (username, email, password) => {
    const user = new User();
    user.set("username", username);
    user.set("email", email);
    user.set("password", password);
    return user;
};