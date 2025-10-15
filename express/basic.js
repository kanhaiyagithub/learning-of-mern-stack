const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello, World! i am kanhaiya kumar");
});
app.get("/users", (req, res) => {
  const users = [ "Alice", "Bob", "Charlie"];
  res.json(users);
});
app.get("/products/:id", (req, res) => {
  res.send(`Fetching product with ID: ${req.params.id}`);
});
app.get("/search", (req, res) => {
  res.send(`You searched for: ${req.query.q}`);
});
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});


app.listen(3000, () => console.log("Server running on 3000"));
