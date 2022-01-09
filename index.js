const express = require('express');

const app = express();
const port = 6969;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World, from Delivr!');
});

app.post('/send', (req, res) => {
    const { key, to, from, subject, body } = req.body;

    if (!key || !to || !from || !subject || !body) {
        res.status(400).send({"status": "error", "message": "Missing parameters"});
        return;
    }

	res.send(request);
});

app.listen(port, () => console.log(`Delivr listening on port ${port}!`))