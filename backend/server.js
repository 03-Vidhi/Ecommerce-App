import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/database.js";
import authRoute from "./routes/authRoute.js";
import Categoryroute from "./routes/Categoryroute.js"
import Productroute from "./routes/Productroute.js"
import cors from "cors"
import path from "path"



dotenv.config();
// connect database
connectDB();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, '../frontend/dist')))

// routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", Categoryroute);
app.use("/api/v1/product", Productroute);

// rest api
app.use('*', function(req,res){
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
})

//port
const PORT = process.env.PORT || 8080;

// run listen
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`.bgCyan.white);
});
