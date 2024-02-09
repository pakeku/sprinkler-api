import cors from "cors";
import * as dotenv from "dotenv";
import express, { json } from "express";
import helmet from "helmet";
import nocache from "nocache";
import { messagesRouter } from "./messages/messages.router";
import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/not-found.middleware";
import { healthRouter } from "./health/router.health";

dotenv.config();

// Check for required environment variables
const { PORT, CLIENT_ORIGIN_URL } = process.env;
if (!PORT || !CLIENT_ORIGIN_URL) {
  console.error("Missing required environment variables. Please check your configuration.");
  process.exit(1);
}

const app = express();
const apiRouter = express.Router();

// Middleware
app.use(json());
app.set("json spaces", 2);
app.use(helmet());
app.use((_, res, next) => {
  res.contentType("application/json; charset=utf-8");
  next();
});
app.use(nocache());
app.use(
  cors({
    origin: CLIENT_ORIGIN_URL.split(","),
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
    maxAge: 86400,
  })
);

// Routes
app.use("/api", apiRouter);
apiRouter.use("/messages", messagesRouter);
apiRouter.use('/health', healthRouter);

// Error handling
app.use(errorHandler);
app.use(notFoundHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
