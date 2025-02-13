const express = require("express");

const app = express();

app.use((req, res) => {
  res.send("Hello from server");
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is connected http://localhost:${PORT}`);
});
