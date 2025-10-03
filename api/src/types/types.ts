import z from "zod";

export const DietPlanRequestSchema = z.object({
    nome: z.string().min(2),
    idade: z.number().positive(),
    altura_cm: z.number().positive(),
    peso_kg: z.number().positive(),
    sexo: z.enum(["masculino", "feminino"]),
    nivel_atividade: z.enum(["sedentario", "leve", "moderado", "intenso"]),
    objetivo: z.enum(["perder_peso", "ganhar_massa", "manter_peso"]),
    intolerancias: z.array(z.string()).optional(),
    restricoes: z.array(z.string()).optional()
});

export type DietPlanRequest = z.infer<typeof DietPlanRequestSchema>;