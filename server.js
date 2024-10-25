require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
// DB connection

if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGODB_URL, {})
    .then(() => console.log("MongoDB connected successfully..."))
    .catch((err) => console.log("Error connecting to MongoDB:", err));
}
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}... `);
});
