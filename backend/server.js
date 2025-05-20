import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import featureRoutes from "./routes/featureRoutes.js";
import integrationRoutes from "./routes/integrationRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";
import newsfeedRoutes from "./routes/newsfeedRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";



import cors from "cors";

//configure env
dotenv.config();

//databse config
connectDB();

//rest object
const app = express();

//middelwares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/feature", featureRoutes);
app.use("/api/v1/integration", integrationRoutes);
app.use("/api/v1/faq", faqRoutes);
app.use("/api/v1/newsfeed", newsfeedRoutes);
app.use("/api/v1/job", jobRoutes);


//rest api
app.get("/", (req, res) => {
  res.send("<h1>Welcome to crm tool app</h1>");
});

//PORT
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
  console.log(
    `Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
      .white
  );
});
