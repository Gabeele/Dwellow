// Create a function to get the user and return a user 
function getUser(token) {
    const user = {
        id: 1,
        email: "",
    };

    return user

}

function generateCode() {
    const length = 6;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';  // Allows for 1402410240 unique codes
    let result = '';
    const isUnique = false;

    do {
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        // Add to db and check if unique
    } while (isUnique);

    return result;
}

module.exports = {
    getUser,
    generateCode

};