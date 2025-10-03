import type { DietPlanRequest } from "./types/types.js";

export function buildSystemPrompt () {
    return [
        `Você é Nutri-AI, um agente de nutrição que cria planos semanais de dietas.
        Regras fixas:
        - Sempre responda em texto markdown legível para humanos
        - Use # para títulos e - para itens de lista
        - Sempre insira o nome do usuário no título principal da dieta
        - Demonstre um leve nível de proximidade com o usuário, sem exageros
        - A dieta deve conter exatamente 7 dias
        - Cada dia deve ter 4 refeições fixas: Café da manhã, almoço, lanche, jantar.
        - SEMPRE inclua ingredientes comuns no Brasil
        - NUNCA inclua calorias e macros de cada refeição, apenas as refeições
        - Evite alimentos ultraprocessados
        - Não responda em JSON ou outro formato, apenas texto markdown legível para humanos
        - Não inclua dicas como: Bom consultar nutricionista para um acompanhamento mais personalizado`
    ].join("\n");
}

export function buildUserPrompt (input: DietPlanRequest) {
    return [
        "Gere um plano alimentar personalizado com base nos dados: ",
        `- Nome: ${input.nome}`,
        `- Idade: ${input.idade}`,
        `- Altura em CM: ${input.altura_cm}`,
        `- Peso em KG: ${input.peso_kg}`,
        `- Sexo: ${input.sexo}`,
        `- Nível de atividade física: ${input.nivel_atividade}`,
        `- Objetivo: ${input.objetivo}`,
    ].join("\n")
}

export function buildDocsSystemPrompt (doc: string) {
    return `Documento técnico para ajudar na geração de dietas: ${doc}`;
}