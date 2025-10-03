"use client"

import z from "zod";
import { Card } from "@/components/ui/card";
import { Utensils } from "lucide-react";
import { Form, FormItem, FormField, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const dietSchema = z.object({
    nome: z.string().min(2, "O nome é obrigatório"),
    idade: z.number().int().positive(),
    altura_cm: z.number().positive(),
    peso_kg: z.number().positive(),
    sexo: z.enum(["masculino", "feminino"], { error: "Selecione o sexo" }),
    nivel_atividade: z.enum(["sedentario", "leve", "moderado", "intenso"], { error: "Selecione o nível de atividade" }),
    objetivo: z.enum(["perder_peso", "ganhar_massa", "manter_peso"], { error: "Selecione o objetivo" }),
})

type DietSchemaFormData = z.infer<typeof dietSchema>;

interface DietFormProps {
    onSubmit: (data: DietSchemaFormData) => void
}

// Ao clicar em 'Cadastrar', a função recebe uma propriedade do componente 
export function DietForm({ onSubmit }: DietFormProps) {

    const form = useForm<DietSchemaFormData>({
        resolver: zodResolver(dietSchema),
        defaultValues: {
            nome: "",
            idade: undefined,
            altura_cm: undefined,
            peso_kg: undefined,
            sexo: undefined,
            nivel_atividade: undefined,
            objetivo: undefined
        },
    })

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl border-0">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-4 mx-auto">
                            <Utensils className="w-14 h-14 text-green-500" />
                        </div>
                        <h1 className="text-3xl text-green-500 font-bold mb-2">NutriAI <br/> Descubra a dieta ideal para você</h1>
                    </div>

                    <Form {...form}>
                        {/* Faz com que uma função seja executada ao enviar o formulário */}
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center">Dados pessoais</h3>
                            </div>

                            {/* CAMPOS NOME E IDADE  */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="nome"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Digite seu nome..."
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="idade"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Idade</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="any"
                                                    {...form.register("idade", {
                                                        setValueAs: (value) => value === "" ? undefined : Number(value),
                                                    })}
                                                    placeholder="Ex: 28"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                            </div>

                            {/* CAMPOS PESO, SEXO E ALTURA */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="peso_kg"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Peso em Kg</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="any"
                                                    {...form.register("peso_kg", {
                                                        setValueAs: (value) => value === "" ? undefined : parseFloat(value),
                                                    })}
                                                    placeholder="Ex: 28"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="altura_cm"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Altura em CM</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="any"
                                                    {...form.register("altura_cm", {
                                                        setValueAs: (value) => value === "" ? undefined : parseFloat(value),
                                                    })}
                                                    placeholder="Ex: 28"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="sexo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sexo</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Selecione o sexo" />
                                                    </SelectTrigger>
                                                </FormControl>

                                                <SelectContent>
                                                    <SelectItem value="masculino">Masculino</SelectItem>
                                                    <SelectItem value="feminino">Feminino</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                            </div>

                            {/* CAMPOS ATIVIDADE E OBJETIVO */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="nivel_atividade"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nível de atividade física</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Selecione o nível de atividade" />
                                                    </SelectTrigger>
                                                </FormControl>

                                                <SelectContent>
                                                    <SelectItem value="sedentario">Sedentário (0x na semana)</SelectItem>
                                                    <SelectItem value="leve">Leve (1-2x na semana)</SelectItem>
                                                    <SelectItem value="moderado">Moderado (3-5x na semana)</SelectItem>
                                                    <SelectItem value="intenso">Intenso (6-7x na semana)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="objetivo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Objetivo da dieta</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Selecione o objetivo da dieta" />
                                                    </SelectTrigger>
                                                </FormControl>

                                                <SelectContent>
                                                    <SelectItem value="perder_peso">Perda de peso</SelectItem>
                                                    <SelectItem value="ganhar_massa">Ganho de massa muscular (Hipertrofia)</SelectItem>
                                                    <SelectItem value="manter_peso">Manter peso</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button className="w-full mt-8 hover:opacity-95 cursor-pointer h-12 text-lg">
                                Gerar minha dieta
                            </Button>
                        </form>
                    </Form>
                </div>
            </Card>
        </div>
    )
}