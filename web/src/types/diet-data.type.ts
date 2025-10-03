export interface DietData {
  nome: string,
  idade: number,
  altura_cm: number,
  peso_kg: number,
  sexo: "masculino" | "feminino",
  nivel_atividade: "sedentario" | "leve" | "moderado" | "intenso",
  objetivo: "perder_peso" | "ganhar_massa" | "manter_peso"
}