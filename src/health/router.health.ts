// Path: src/messages/messages.router.ts
import { Router } from "express";

export const healthRouter = Router();

healthRouter.all("/", (_, res) => {
    res.status(200).json({ message: "OK" });
});

export default healthRouter;