import "dotenv/config";
export const env = {
port: Number(process.env.PORT ?? 3000),
jwtSecret: process.env.JWT_SECRET ?? "dev-secret-change-me",
dbPath: process.env.DB_PATH ?? "./data/app.db",
clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
};
