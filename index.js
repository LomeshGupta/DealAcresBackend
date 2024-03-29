const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const errorHandler = require("./Middleware/errorMiddleware");
const cookieParser = require("cookie-parser");
const serviceRoute = require("./routes/servicesRoute");
const propertyRoutes = require("./routes/propertyRoute");
const testimonialsRoute = require("./routes/testimonialsRoute");
const blogRoute = require("./routes/blogRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: "*",
};

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//routesmiddleware
app.use("/api/services", serviceRoute);
app.use("/api/property", propertyRoutes);
app.use("/api/testimonials",testimonialsRoute);
app.use("/api/blogs",blogRoute);

app.get("/", (req, res) => {
  res.send("Home");
});

//error
app.use(errorHandler);

mongoose
  .connect(process.env.MOGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
