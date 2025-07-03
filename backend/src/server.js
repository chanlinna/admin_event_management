import express from "express";
import userRoutes from "./routes/userRoute.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json()); // parse JSON

app.use("/api", userRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
