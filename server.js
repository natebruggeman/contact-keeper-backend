const express = require("express"); //can't use import without babel or typescript
const connectDB = require("./config/db");
const app = express();

connectDB();

app.get("/", (req, res) =>
  res.json({ msg: "Welcome to the Contact Keeper API..." })
);

//define routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/contacts", require("./routes/contacts"));

const PORT = process.env.PORT || 5000; //using 5000 in development, process.env is for production

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
