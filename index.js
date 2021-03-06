const express = require('express');
const { verifyAPIKey } = require('./model/authentication');
const { validUUID, validEmail } = require('./model/helpers');
const { createLog, updateLog } = require('./model/logging');
const { processEmail } = require('./model/send');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World, from Delivr!');
});

app.post('/email', (req, res) => {
    const { key } = req.headers;
    const { to, from, subject, body } = req.body;

    // Make sure all the required fields are present
    if (!key || !to || !from || !body) {
        res.status(400).send({"status": "error", "message": "Missing parameters"});
        return;
    }

    // Determine project ID and API Key from api key (which contains both)
    const key_list = key.split(".")
    const api_key = key_list[0]
    const project = key_list[1]

    // Ensure the emails are valid
    if (!validEmail(from)) {
        res.status(400).send({"status": "error", "message": "Invalid email address"});
        return;
    }

    if (typeof(to) == "string") {
        if (!validEmail(to)) {
            res.status(400).send({"status": "error", "message": "Invalid email address"});
            return;
        }
    } else if (Array.isArray(to)) {
        for (const recipient of to) {
            if (!validEmail(recipient)) {
                res.status(400).send({"status": "error", "message": "Invalid email address"});
                return;
            }
        }
    } else {
        res.status(400).send({"status": "error", "message": "Please pass in the emails as either a list or string"});
        return;
    }

    // Ensure the API key is valid
    verifyAPIKey(api_key, project).then(async (response) => {
        if (!response.valid) {
            res.status(400).send({"status": "error", "message": "API Key is invalid"});
            return;
        }

        // Should perhaps implement promise.all here?
        const logResponse = await createLog(response.user, subject, body, 'TEXT', to, from, response.project_internal_id);
        await processEmail(subject, body, to, from).then(
            async (sendResult) => {
                if (sendResult.status === "success") {
                    // If the sending succeeded, create a log in DB
                    // Perhaps do this after returning the response?
                    await updateLog('SUCCEEDED', logResponse[0]);
                    res.send({"status": "success", "message": logResponse});
                } else {
                    await updateLog("FAILED", logResponse[0]);
                    res.status(400).send({"status": "error", "message": "Email failed to send", "output": sendResult});
                }
            }
        );
        
    }).catch(err => {
        console.log(err)
        res.status(401).send({"status": "error", "message": "Something went wrong"});
        return;
    });

});

app.listen(port, () => console.log(`Delivr listening on port ${port}!`))