import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { emailMatcherValidator } from '../shared/email-matcher/email-matcher.component';
import { ZonesValidator } from '../shared/longueur-minimum/longueur-minimum.component';
import { IProbleme } from './probleme';
import { ProblemeService } from './probleme.service';
import { ITypeProbleme } from './typeprobleme';
import { TypeProblemeService } from './typeprobleme.service';

@Component({
  selector: 'stk-probleme',
  templateUrl: './probleme.component.html',
  styleUrls: ['./probleme.component.css']
})
export class ProblemeComponent implements OnInit {
  problemeForm: FormGroup;
  typesProblemes: ITypeProbleme[];
  errorMessage: string;
  probleme: IProbleme;

  constructor(private fb: FormBuilder, private typeprobleme: TypeProblemeService, private problemeService: ProblemeService, private route : Router) { }

  ngOnInit(): void {
    this.problemeForm = this.fb.group({

      prenom: ['', [ZonesValidator.longueurMinimum(3), Validators.required]],
      nom: ['', [Validators.maxLength(50), Validators.required]],
      Typeprobleme: [''],
      typeNotification: [{ value: 'NePasNotifier', disabled: false }],
      courrielGroup: this.fb.group({
        courriel: [{ value: '', disabled: true }],
        courrielConfirmation: [{ value: '', disabled: true }]
      }),
      telephone: [{ value: '', disabled: true }],
      descriptionProbleme: ['', [Validators.required, Validators.minLength(5)]],
      noUnite: '',
      dateProbleme: { value: Date(), disabled: true }

    });


    this.typeprobleme.obtenirProblemes()
      .subscribe(cat => this.typesProblemes = cat,
        error => this.errorMessage = <any>error)

    this.problemeForm.get('typeNotification').valueChanges
      .subscribe(value => this.appliquerNotifications(value));
  };


  appliquerNotifications(typeNotification: string): void {

    const courrielControl = this.problemeForm.get('courrielGroup.courriel');
    const confirmerCourrielControl = this.problemeForm.get('courrielGroup.courrielConfirmation');
    const courrielGroupControl = this.problemeForm.get('courrielGroup');
    const telephoneControl = this.problemeForm.get('telephone');
    const pattern = "[a-z0-9._%+-]+@[a-z0-9.-]+";
    const pattern1 = "[0-9]+";

    courrielControl.clearValidators();
    courrielControl.reset();
    courrielControl.disable();

    confirmerCourrielControl.clearValidators();
    confirmerCourrielControl.reset();
    confirmerCourrielControl.disable();

    telephoneControl.clearValidators();
    telephoneControl.reset();
    telephoneControl.disable();

    courrielControl.updateValueAndValidity();
    confirmerCourrielControl.updateValueAndValidity();
    telephoneControl.updateValueAndValidity();

    if (typeNotification === 'NePasNotifier') {

      courrielControl.disable();
      confirmerCourrielControl.disable();
      telephoneControl.disable();

    } else if (typeNotification === 'courriel') {

      courrielControl.enable();
      courrielControl.setValidators([Validators.pattern(pattern), Validators.required]);

      confirmerCourrielControl.enable();
      confirmerCourrielControl.setValidators([Validators.required]);

      courrielGroupControl.setValidators([Validators.compose([emailMatcherValidator.courrielDifferents()])]);

    } else if (typeNotification === 'telephone') {

      telephoneControl.enable();
      telephoneControl.setValidators([Validators.minLength(10), Validators.maxLength(10), Validators.pattern(pattern1), Validators.required]);
    }

    courrielControl.updateValueAndValidity();
    confirmerCourrielControl.updateValueAndValidity();
    courrielGroupControl.updateValueAndValidity();
    telephoneControl.updateValueAndValidity();
  }

  save(): void {
    if (this.problemeForm.dirty && this.problemeForm.valid) {
        // Copy the form values over the problem object values
        this.probleme = this.problemeForm.value;
        this.probleme.id = 0;
        this.probleme.courriel = this.problemeForm.get('courrielGroup.courriel').value;
        //this.probleme.dateProbleme = new Date();
        this.problemeService.saveProbleme(this.probleme)
            .subscribe( // on s'abonne car on a un retour du serveur à un moment donné avec la callback fonction
                () => this.onSaveComplete(),  // Fonction callback
                (error: any) => this.errorMessage = <any>error
            );
    } else if (!this.problemeForm.dirty) {
        this.onSaveComplete();
    }
  }
  
  onSaveComplete(): void { 
    // Reset the form to clear the flags
    this.problemeForm.reset();  // Pour remettre Dirty à false.  Autrement le Route Guard va dire que le formulaire n'est pas sauvegardé
    this.route.navigate(['/accueil']);
  }
}