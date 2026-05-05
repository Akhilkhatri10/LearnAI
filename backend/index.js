// index.js
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { connectDB } from "./db.js";
import apiRoutes from "./routes/apiRoutes.js";

const port = process.env.PORT || 3000;
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    // credentials: true,
  })
);

app.use(express.json());
app.use(clerkMiddleware());

app.use("/api", apiRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send("Unauthenticated!");
});

app.listen(port, async () => {
  await connectDB();
  console.log(`Server running on ${port}`);
});