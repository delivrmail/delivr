const express = require('express');
const { verifyAPIKey } = require('./model/authentication');
const { validUUID, validEmail } = require('./model/helpers');
const { createLog } = require('./model/logging');
const { sendEmail } = require('./model/send');

const app = express();
const port = 6969;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World, from Delivr!');
});

app.post('/email', (req, res) => {
    const { key } = req.headers;
    const { project, to, from, subject, body } = req.body;
    let result;

    // Make sure all the required fields are present
    if (!key || !to || !from || !body) {
        res.status(400).send({"status": "error", "message": "Missing parameters"});
        return;
    }

    // Ensure the emails are valid
    if (!validEmail(to) || !validEmail(from)) {
        res.status(400).send({"status": "error", "message": "Invalid email address"});
        return;
    }

    // Ensure the project ID is a valid UUID
    if (!validUUID(project)) {
        res.status(400).send({"status": "error", "message": "Please pass in the project ID as a UUID"});
        return;
    }

    // Ensure the API key is valid
    verifyAPIKey(key, project).then(async (response) => {
        if (!response.valid) {
            res.status(400).send({"status": "error", "message": "API Key is invalid"});
            return;
        }

        const result = await sendEmail()

        if (result != null) {
            // If the sending succeeded, create a log in DB
            const logResponse = await createLog(response.user, subject, body, 'TEXT', to, from, project);
            res.send({"status": "success", "message": logResponse});
        } else {
            res.status(400).send({"status": "error", "message": "Email failed to send"})
        }
        

        
    }).catch(err => {
        console.log(err)
        res.status(401).send({"status": "error", "message": "Something went wrong"});
        return;
    });

});

app.listen(port, () => console.log(`Delivr listening on port ${port}!`))