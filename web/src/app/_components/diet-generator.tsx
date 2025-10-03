"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { DietData } from "@/types/diet-data.type"
import { useRef, useState } from "react"
import ReactMarkdown from 'react-markdown'

export function DietGenerator({ data }: { data: DietData }) {
    const [output, setOutput] = useState("")
    const [isStreaming, setIsStreaming] = useState(false)

    const controllerRef = useRef<AbortController | null>(null)

    async function startStreaming() {
        const controller = new AbortController();
        controllerRef.current = controller

        setOutput("")
        setIsStreaming(true);

        try {
            const response = await fetch("http://localhost:5000/plan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: data.nome,
                    idade: data.idade,
                    altura_cm: data.altura_cm,
                    peso_kg: data.peso_kg,
                    sexo: data.sexo,
                    nivel_atividade: data.nivel_atividade,
                    objetivo: data.objetivo
                }),
                signal: controller.signal
            })

            const reader = response.body?.getReader();
            const decoder = new TextDecoder("utf-8")

            while (true) {
                const { done, value } = await reader!.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');
                
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.slice(6);
                        
                        if (dataStr === '[DONE]') continue;
                        
                        try {
                            const parsed = JSON.parse(dataStr);
                            setOutput(prev => prev + parsed.text);
                        } catch (e) {
                            console.warn('Erro ao processar chunk:', e);
                        }
                    }
                }
            }
        } catch (err: any) {
            if (err.name === "AbortError") {
                return;
            }
            console.error('Erro ao gerar dieta:', err);
        } finally {
            setIsStreaming(false);
            controllerRef.current = null;
        }
    }

    async function handleGenerate() {
        if (isStreaming) {
            controllerRef.current?.abort()
            setIsStreaming(false)
            return
        }

        await startStreaming();
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-4xl border-0 p-4 md:p-6">
                <div className="flex justify-center gap-4">
                    <Button
                        className="cursor-pointer gap-2"
                        size="lg"
                        onClick={handleGenerate}
                        disabled={isStreaming}
                    >
                        <Sparkles className="w-6 h-6" />
                        {isStreaming ? "Gerando..." : "Gerar minha dieta"}
                    </Button>
                </div>

                {output && (
                    <div className="bg-card rounded-lg p-6 border border-border max-h-[500px] overflow-y-auto mt-4">
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                            <ReactMarkdown
                                components={{
                                    h2: ({ node, ...props }) => (
                                        <h2
                                            className="text-xl font-bold text-green-600 my-3"
                                            {...props}
                                        />
                                    ),
                                    h1: ({ node, ...props }) => (
                                        <h1
                                            className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3"
                                            {...props}
                                        />
                                    ),
                                    h3: ({ node, ...props }) => (
                                        <h3
                                            className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 my-2"
                                            {...props}
                                        />
                                    ),
                                    ul: ({ node, ...props }) => (
                                        <ul className="list-disc pl-6 my-2" {...props} />
                                    ),
                                    ol: ({ node, ...props }) => (
                                        <ol className="list-decimal pl-6 my-2" {...props} />
                                    ),
                                    p: ({ node, ...props }) => (
                                        <p className="my-2" {...props} />
                                    ),
                                }}
                            >
                                {output}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    )
}