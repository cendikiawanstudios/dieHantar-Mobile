const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.static(__dirname));
app.get('/api/data', (req, res) => res.json(JSON.parse(fs.readFileSync('data.json'))));
app.listen(3000, '0.0.0.0', () => console.log('👤 User App: http://localhost:3000'));