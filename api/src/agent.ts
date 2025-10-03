import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildSystemPrompt, buildUserPrompt, buildDocsSystemPrompt } from "./prompt.js";
import type { DietPlanRequest } from "./types/types.js";
import fs from 'fs'
import path from "path";
import { fileURLToPath } from "url";
import type { FastifyReply } from "fastify";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Função helper para delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Configuração do delay (em milissegundos)
const STREAM_DELAY_MS = 30; // Ajuste este valor: 0 = sem delay, 30 = natural, 50+ = lento
const CHARS_PER_CHUNK = 8; // Quantos caracteres enviar por vez (opcional)

// Função generator que retorna os chunks
// Uma função generator utiliza o 'yield' para pausar a execução 
// e conseguir retornar de onde parou
// Ao contrário do return, ela é capaz de pausar a função, ao invés de encerrá-la
export async function* generateDietPlanChunks(input: DietPlanRequest) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Constrói o caminho de forma segura
    const filePath = path.join(__dirname, 'documents', 'diretrizes.md');

    const diretrizes = fs.readFileSync(filePath, "utf-8");
    const baseSystemPrompt = buildSystemPrompt();
    const fullSystemPrompt = `${baseSystemPrompt}\n\n## Diretrizes\n${diretrizes}`

    const prompts = [
        {
            role: "user",
            parts: [
                { text: buildUserPrompt(input) }
            ]
        }
    ]

    // Chama a API
    const result = await model.generateContentStream({
        systemInstruction: fullSystemPrompt,
        contents: prompts as any,
        generationConfig: {
            temperature: 0.7,
        },
    });

    // Faz o yield (pausa e retorna a execução) de cada chunk conforme chegam
    for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        yield chunkText;
    }
}

// Função para enviar via SSE ao front-end
// Cada mensagem do servidor começa com data: e termina com duas quebras de linha
export async function generateDietPlanStream(input: DietPlanRequest, reply: FastifyReply) {

    // Permite acesso à API por qualquer domínio
    // O servidor mantém a conexão aberta para que as mensagens cheguem em partes
    reply.raw.setHeader('Access-Control-Allow-Origin', "*");
    reply.raw.setHeader('Content-Type', 'text/event-stream');
    reply.raw.setHeader('Cache-Control', 'no-cache');
    reply.raw.setHeader('Connection', 'keep-alive');

    console.log('\n🤖 Iniciando geração de plano de dieta...\n');

    try {
        // Itera sobre os chunks (pedaços) vindos da função generator para o stream
        for await (const chunk of generateDietPlanChunks(input)) {

                // Efeito de digitação
                for (let i = 0; i < chunk.length; i += CHARS_PER_CHUNK) {
                    const miniChunk = chunk.slice(i, i + CHARS_PER_CHUNK);
                    reply.raw.write(`data: ${JSON.stringify({ text: miniChunk })}\n\n`);
                    
                    if (STREAM_DELAY_MS > 0) {
                        await sleep(STREAM_DELAY_MS);
                    }
                }
            }

        reply.raw.write('data: [DONE]\n\n');
        reply.raw.end();
        
        console.log('\n✅ Plano de dieta gerado com sucesso!\n');
    } catch (err) {
        console.error('Erro durante o streaming: ', err);
        throw err;
    }
}