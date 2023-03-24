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
  minDate:Date;
  maxDate:Date;

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ){
    this.formulario = this.crearFormulario();
    this.identificacion?.setValue("1234567");
    this.minDate = new Date("2000-02-05T00:00:00");
    this.maxDate = new Date("2025-04-30T00:00:00");
  }
  ngAfterViewInit(): void {
    //this.cd.detectChanges();
  }

  ngOnInit(): void {
    this.identificacion?.markAsTouched();
  }



  crearFormulario():FormGroup{
    return this.fb.group({
      identificacion: new FormControl('', {validators: [Validators.required]}),
      fecha: new FormControl(),
      fecha2: new FormControl()
    })
  }

  toogleDirty(){
    if (this.fecha?.dirty) { 
      this.fecha?.markAsPristine();
    } else {
      this.fecha?.markAsDirty();
    }
  }

  toogleTouched(){
    if (this.fecha?.touched) { 
      this.fecha?.markAsUntouched();
    } else {
      this.fecha?.markAsTouched();
    }
  }

  alternarValidacionRequerido():void{
    console.log(this.fecha?.hasValidator(Validators.required));
    if(this.fecha?.hasValidator(Validators.required)){
      this.fecha.removeValidators(Validators.required);
    }else{
      this.fecha?.addValidators(Validators.required);
    }
  }

  get identificacion(){
    return this.formulario.get("identificacion");
  }
  get fecha(){
    return this.formulario.get("fecha");
  }
}
