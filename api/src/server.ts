import Fastify from "fastify";
import { planRoutes } from "./routes/plan.js";
import cors from "@fastify/cors";

const app = Fastify({
    logger: true,
});

await app.register(cors, {
    origin: "*",
    methods: ["GET", "POST"]
})

const PORT = process.env.PORT;

app.get('/teste', (req, res) => {
    res.send("Hello, World!");
});

app.register(planRoutes);
 
app.listen({ port: Number(PORT) || 5000, host: "0.0.0.0"}, (req, res) => {
    try {
        console.log("Server is running on port 5000");

    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
} )

