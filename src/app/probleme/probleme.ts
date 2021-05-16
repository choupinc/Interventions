export interface IProbleme {
    id: number,
    prenom: string,
    nom: string,
    Typeprobleme?: number,
    typeNotification?: string,
    courriel?: string,
    //courrielConfirmation?: string,
    telephone?: string,
    descriptionProbleme: string,
    noUnite?: string,
    //dateProbleme?:Date
}