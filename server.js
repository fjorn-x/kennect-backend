require("dotenv").config();
const express = require("express");
const cors = require("cors");
const colors = require("colors");
const mongoose = require("mongoose");
const postRoutes = require("./routes/postsRoutes");
const userRoutes = require("./routes/userRoutes");

const {errorHandler} = require("./middleware/errorMiddleware");
const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(errorHandler);
app.use(express.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/kennect");
const db = mongoose.connection;
db.on("connected", () => {
  console.log(`Database connected: ${db.host}`.cyan.underline);
});
db.on("error", (err) => {
  console.log(`Database err ${err}`);
});
db.on("disconnected", () => {
  console.log("Database disconnected");
});
const port = process.env.PORT || 3001;

app.use("/api/posts", postRoutes);
app.use("/auth", userRoutes);

app.listen(port, () => console.log(`server started on port ${port}`));
