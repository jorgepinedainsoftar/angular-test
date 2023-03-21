import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'controlsapp';
  formulario:FormGroup;

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ){
    this.formulario = this.crearFormulario();
    this.identificacion?.setValue("1234567");
  }
  ngAfterViewInit(): void {
    //this.cd.detectChanges();
  }

  ngOnInit(): void {
    this.identificacion?.markAsTouched();
  }



  crearFormulario():FormGroup{
    return this.fb.group({
      identificacion: new FormControl('', {validators: [Validators.required]})
    })
  }

  toogleDirty(){
    if (this.identificacion?.dirty) { 
      this.identificacion?.markAsPristine();
    } else {
      this.identificacion?.markAsDirty();
    }
  }

  toogleTouched(){
    if (this.identificacion?.touched) { 
      this.identificacion?.markAsUntouched();
    } else {
      this.identificacion?.markAsTouched();
    }
  }

  alternarValidacionRequerido():void{
    console.log(this.identificacion?.hasValidator(Validators.required));
    if(this.identificacion?.hasValidator(Validators.required)){
      this.identificacion.removeValidators(Validators.required);
    }else{
      this.identificacion?.addValidators(Validators.required);
    }
  }

  get identificacion(){
    return this.formulario.get("identificacion");
  }
}
