import path from "node:path";
import fs from "node:fs";
import http from "node:http";
import express from "express";
import cors from "cors";
import { env } from "./env";
import "./db";
import { authRouter, authMiddleware } from "./auth";
import { attachSocket } from "./socket";
const app = express();
app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(express.json());
app.get("/health", (_req, res) => res.json({ ok: true, t: Date.now() }));
app.use("/api/auth", authRouter);
app.get("/api/me", authMiddleware, (req, res) => {
res.json({ user: (req as any).user });
});
// 可选：如果前端已经 build 到 apps/web/dist，则由本服务直接托管
const webDist = path.resolve(__dirname, "../../web/dist");
if (fs.existsSync(webDist)) {
app.use(express.static(webDist));
app.get(/^/(?!api|socket.io|health).*/, (_req, res) => {
res.sendFile(path.join(webDist, "index.html"));
});
console.log([server] serving web from ${webDist});
}
const server = http.createServer(app);
attachSocket(server);
server.listen(env.port, () => {
console.log([server] listening on :${env.port});
});
