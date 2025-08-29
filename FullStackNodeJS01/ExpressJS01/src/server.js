require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { sequelize } = require("./config/db");
const apiRoutes = require("./routes/api");

const app = express();
app.use(cors());
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => res.render("index"));
app.use("/api", apiRoutes);

const PORT = process.env.PORT || 8080;

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // auto tạo bảng theo model
    app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
  } catch (e) {
    console.error("DB Error:", e);
    process.exit(1);
  }
})();
