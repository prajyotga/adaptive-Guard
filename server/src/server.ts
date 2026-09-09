import express from "express";
import redis from "./config/redis.js";
import { rateLimiter } from "./middleware/rateLimiter.middleware.js";
import { apiKeyMiddleware } from "./middleware/apiKey.middleware.js";
import connectDB from "./config/db.js";
import apiKeyRoutes from "./routes/apiKey.route.js";
import { requestLogger } from "./middleware/requestLogger.middleware.js";

const app = express();

const PORT = 5000;

app.use(express.json());
app.use(requestLogger);

app.use("/api/keys", apiKeyRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "AdaptiveGuard API is running!"
    });
});

app.get("/api/test",apiKeyMiddleware, rateLimiter, (req, res) => {
    res.json({
        success: true,
        message: "Request accepted!"
    });
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});