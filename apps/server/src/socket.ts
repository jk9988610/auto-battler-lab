import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { env } from "./env";
import { verifyToken, type AuthUser } from "./auth";
export function attachSocket(http: HttpServer) {
const io = new Server(http, {
cors: { origin: env.clientOrigin, credentials: true },
});
io.use((socket, next) => {
const token = socket.handshake.auth?.token as string | undefined;
if (!token) return next(new Error("no token"));
try {
(socket.data as any).user = verifyToken(token) as AuthUser;
next();
} catch {
next(new Error("bad token"));
}
});
io.on("connection", (socket) => {
const user = (socket.data as any).user as AuthUser;
console.log([socket] connected uid=${user.uid} name=${user.username});
socket.emit("hello", { ok: true, user });
socket.on("ping", (cb?: (r: unknown) => void) => {
cb?.({ t: Date.now() });
});
socket.on("disconnect", (reason) => {
console.log([socket] disconnect uid=${user.uid} reason=${reason});
});
});
return io;
}
