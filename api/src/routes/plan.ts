import type { FastifyInstance } from "fastify";
import { DietPlanRequestSchema } from "../types/types.js";
import { generateDietPlanStream } from "../agent.js";

export async function planRoutes(app: FastifyInstance) {
    app.post("/plan", async (request, reply) => {

        const parse = DietPlanRequestSchema.safeParse(request.body);
        if (!parse.success) {
            return reply.status(400).send({
                error: "Validation Error",
                details: parse.error.flatten(issue => issue.message)
            })
        }

        try {
            await generateDietPlanStream(parse.data, reply)
            reply.raw.end();

        } catch (err: any) {
            request.log.error(err);

            // Verifica se já enviou algo ao servidor
            if (!reply.sent && !reply.raw.headersSent) {
                return reply.status(500).send({
                    error: "Internal Server Error",
                    message: err.message
                });
            }

            // Se já começou o stream, tenta fechar "corretamente"
            if(!reply.raw.writableEnded) {
                reply.raw.write(`event: error\ndata: ${JSON.stringify(err.message)}`)
                reply.raw.end();
            }
        }
        return reply;
    });
}