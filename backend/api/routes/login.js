// app.post('/login', async (req, res) => {
//     console.log("Logging into account");
//     const { email, token } = req.body;

//     const decoded = jwt.decode(token, { complete: true });

//     console.log(token)
//     console.log("decoded:")
//     console.log(decoded)

//     const user = await getUser(decoded.payload.user_id);

//     if (user != null) {
//         res.status(200).json({ message: 'Logged ' });
//     }
//     else {
//         res.status(400).json({ message: 'No user found' });
//     }

// });