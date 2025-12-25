const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(express.static(__dirname));
app.get("/api/data", (req, res) => {
  const data = JSON.parse(fs.readFileSync("data.json", "utf8"));
  res.json(data);
});

app.listen(PORT, "0.0.0.0", () =>
  console.log(`👤 USER: http://localhost:${PORT}`),
);
