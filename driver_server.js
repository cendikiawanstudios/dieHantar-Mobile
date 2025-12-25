const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 4000;

app.use(express.json());
app.use(express.static(__dirname));

app.get('/api/data', (req, res) => {
    const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    res.json(data);
});

// API khusus Driver untuk ganti status
app.post('/api/toggle-status', (req, res) => {
    let data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    data.driver.status = data.driver.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
    res.json({ success: true, status: data.driver.status });
});

app.listen(PORT, '0.0.0.0', () => console.log(`🛵 DRIVER: http://localhost:${PORT}`));