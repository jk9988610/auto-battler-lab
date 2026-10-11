import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { env } from "./env";
import { verifyToken, type AuthUser } from "./auth";
export function attachSocket(http: HttpServer) {
const io = new Server(http, {
cors: { origin: env.clientOrigin, credentials: true },
});
io.use(function (socket, next) {
const token = socket.handshake.auth && socket.handshake.auth.token;
if (!token) return next(new Error("no token"));
try {
(socket.data as any).user = verifyToken(token) as AuthUser;
next();
} catch {
next(new Error("bad token"));
}
});
io.on("connection", function (socket) {
const user = (socket.data as any).user as AuthUser;
console.log("[socket] connected uid=" + user.uid + " name=" + user.username);
socket.emit("hello", { ok: true, user });
socket.on("ping", function (cb?: (r: unknown) => void) {
if (cb) cb({ t: Date.now() });
});
socket.on("disconnect", function (reason) {
console.log("[socket] disconnect uid=" + user.uid + " reason=" + reason);
});
});
return io;
}
