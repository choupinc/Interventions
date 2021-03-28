import { AbstractControl, ValidatorFn } from "@angular/forms";

export class ZonesValidator {

    static longueurMinimum(longueur: number): ValidatorFn {

        return (valeurControle: AbstractControl): { [key: string]: boolean } | null => {

            if (valeurControle.value == null || valeurControle.value.trim() == "") {
                return { 'nbreCaracteresInsuffisants': true };
            }

            if (valeurControle.value.trim().length < longueur) {
                return { 'nbreCaracteresInsuffisants': true };
            }
            return null;
        };
    }
}