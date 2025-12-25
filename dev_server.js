const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 5000;

app.use(express.static(__dirname));
app.get("/api/stats", (req, res) => {
  const data = JSON.parse(fs.readFileSync("data.json", "utf8"));
  res.json(data);
});

app.listen(PORT, "0.0.0.0", () =>
  console.log(`💻 DEV: http://localhost:${PORT}`),
);
