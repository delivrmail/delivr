const express = require('express');
const { verifyAPIKey } = require('./model/authentication');
const { validUUID } = require('./model/helpers');

const app = express();
const port = 6969;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World, from Delivr!');
});

app.post('/send', (req, res) => {
    const { key } = req.headers;
    const { project, to, from, subject, body } = req.body;

    // Make sure all the required fields are present
    if (!key || !to || !from || !subject || !body) {
        res.status(400).send({"status": "error", "message": "Missing parameters"});
        return;
    }

    // Ensure the project ID is a valid UUID
    if (!validUUID(project)) {
        res.status(400).send({"status": "error", "message": "Please pass in the project ID as a UUID"});
        return;
    }

    // Ensure the API key is valid
    verifyAPIKey(key, project).then(valid => {
        if (!valid) {
            res.status(400).send({"status": "error", "message": "API Key is invalid"});
            return;
        }

        res.send({"status": "success", "message": "Message sent"});
        
    }).catch(err => {
        console.log(err)
        res.status(401).send({"status": "error", "message": "Something went wrong"});
        return;
    });

	// res.send(request);
});

app.listen(port, () => console.log(`Delivr listening on port ${port}!`))

const result = async() => {
    const valid = await verifyAPIKey('sk_cm03ed0snc3vw5s9053yr', "f8fd3cf3-f7d4-4388-9cad-bac168454b92")
    console.log(valid)
}