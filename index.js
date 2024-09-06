const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const errorHandler = require("./Middleware/errorMiddleware");
const cookieParser = require("cookie-parser");
const serviceRoute = require("./routes/servicesRoute");
const propertyRoutes = require("./routes/propertyRoute");
const NewPropController = require("./routes/NewPropRoute");
const testimonialsRoute = require("./routes/testimonialsRoute");
const blogRoute = require("./routes/blogRoutes");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const localityRoute = require("./routes/localityRoutes");
const FAQRoute = require("./routes/FaqRoutes");
const ReviewRoute = require("./routes/reviewRoute");
const AgentQuestion = require("./routes/AgentQuestionsRoute");
const ProjectRoute = require("./routes/ProjectRoute");
const LocationRoute = require("./routes/LocationRoute");
const PropSingle = require("./routes/propSingleRoute");
const Guide = require("./routes/guideRoutes");
const multer = require("multer");

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

const app = express();

const PORT = process.env.PORT || 5002;

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(upload.any());

//routesmiddleware
app.use("/api/services", serviceRoute);
app.use("/api/property", propertyRoutes);
app.use("/api/testimonials", testimonialsRoute);
app.use("/api/blogs", blogRoute);
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/locality", localityRoute);
app.use("/api/localityfaq", FAQRoute);
app.use("/api/localityreview", ReviewRoute);
app.use("/api/agent", AgentQuestion);
app.use("/api/project", ProjectRoute);
app.use("/api/location", LocationRoute);
app.use("/api/propsingle", PropSingle);
app.use("/api/guide", Guide);
app.use("/api/newproperty", NewPropController);

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
