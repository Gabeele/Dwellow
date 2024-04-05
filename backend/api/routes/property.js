// app.get('/properties', (req, res) => {
//     console.log("Getting properties");
//     // const { token } = req.headers;
//     const token = 1;
//     const user = getUser(token);

//     // TODO get the properties from the database

//     res.send("Properties");

// });

// app.get('/property/:id', (req, res) => {
//     console.log("Getting property information");
//     const { id } = req.params;
//     // const { token } = req.headers;
//     const token = 1;
//     const user = getUser(token);

//     // TODO get the property information from the database

//     res.send("Property information");
// });

// app.delete('/property/:id', (req, res) => {
//     console.log("Deleting property");
//     const { id } = req.params;
//     // const { token } = req.headers;
//     const token = 1;
//     const user = getUser(token);

//     // TODO delete the property from the database

//     res.send("Property deleted");
// });

// app.post('/property', (req, res) => {
//     const { name, token } = req.body;
//     const user = getUser(token);

//     // TODO add the property to the database

//     res.send("Property created", name);
// });

// app.put('/property/:id', (req, res) => {
//     console.log("Updating property information");
//     const { id } = req.params;
//     const { name, token } = req.body;
//     const user = getUser(token);

//     // TODO update the property in the database

//     res.send("Property updated", name);
// });
