const express = require('express');

const app = express();
const port = 6969;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World, from Delivr!');
});

app.post('/send', (req, res) => {
    let request = req.body;
    console.log(request)
	res.send(request);
});

app.listen(port, () => console.log(`Delivr listening on port ${port}!`))