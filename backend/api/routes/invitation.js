// app.get('/invitation/:id', (req, res) => {
//     console.log("Getting invitation information");
//     const { id } = req.params;
//     // const { token } = req.headers;
//     const token = 1;
//     const user = getUser(token);

//     if (user.id !== Number(id)) {
//         res.status(401).send("Unauthorized");
//     }
//     else {
//         // TODO make the assosication with the code and user in the database
//         res.send("Invitation information");
//     }
// });

// app.post('/invitation', (req, res) => {
//     // const { email, token } = req.body;
//     // const user = getUser(token);

//     const email = "abeee.s.gavin@icloud.com";

//     const code = generateCode();

//     sendCodeByEmail(email, code);

//     // TODO make association with code and user in the database
//     // Email the code to the user

//     res.send("Invitation sent", email, code);
// });