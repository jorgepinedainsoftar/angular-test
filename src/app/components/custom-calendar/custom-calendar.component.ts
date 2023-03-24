import { Component, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NgModel, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import * as moment from 'moment';
import { PrimeNGConfig } from 'primeng/api';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CustomCalendarComponent),
  multi: true
}

@Component({
  selector: 'app-custom-calendar',
  templateUrl: './custom-calendar.component.html',
  styleUrls: ['./custom-calendar.component.css'],
  providers: [
    CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR,
    {
      provide: NG_VALIDATORS,
      multi:true,
      useExisting: CustomCalendarComponent
    }
  ]
})
export class CustomCalendarComponent implements OnInit, ControlValueAccessor, Validator {

  private innerIdValue: any = null;
  private control?:AbstractControl;
  private panelVisible:boolean;
  @ViewChild("fecha") fecha?:NgModel;
  @Input() disabled:boolean;
  @Input() required:boolean;
  @Input() minDate:Date;
  @Input() maxDate:Date;

  onChangeCallback = (_:any) =>  {

  }
  onTouchedCallback = (_:any) =>  {

  }
  onValidatorCallback = (_:any) =>  {

  }

  constructor(
    private config: PrimeNGConfig
  ) { 
    this.disabled = false;
    this.required = false;
    this.panelVisible = false;
    this.minDate = new Date(-8640000000000000);
    this.maxDate = new Date(8640000000000000);
    this.config.setTranslation({
      "dayNames": ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"],
      "dayNamesShort": ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
      "dayNamesMin": ["Do","Lu","Ma","Mi","Ju","Vi","Sa"],
      "monthNames": ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
      "monthNamesShort": ["Ene", "Feb", "Mar", "Abr", "May", "Jun","Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
      "emptyMessage": 'Resultados no encontrados',
      "emptyFilterMessage": 'Resultados no encontrados',
      "today": "Hoy"
    });
  }

  get value(): any {
    return this.innerIdValue;
  }

  set value(v: any){
    if(v !== this.innerIdValue){
      this.innerIdValue = v;
      this.onChangeCallback(v);
    }
  }

  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    this.control = control;
    this.required = this.fecha?.control.hasValidator(Validators.required) || this.required;
    return this.fecha?.errors ? this.fecha?.errors : null;
  }
  registerOnValidatorChange?(fn: () => void): void {
    this.onValidatorCallback = fn;
  }
  writeValue(obj: any): void {
    if(obj !== this.innerIdValue){
      this.innerIdValue = obj;
    }
  }
  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnInit(): void {
  }

  blur(event:any):void{
    this.removerError(this.fecha?.control, "dateformaterror");
    const value = event.target.value;
    if(value != null && value != "" && !this.panelVisible){
      console.log("esFechaValida: ", this.esFechaValida(value), " - value: ", value);
      if(!this.esFechaValida(value)){
        this.fecha?.control.setErrors({dateformaterror: true});
      }else if(!this.esMayorOIgualAFechaMinima(value)){
        this.fecha?.control.setErrors({mindate: true});
      }else if(!this.esMenorOIgualAFechaMaxima(value)){
        this.fecha?.control.setErrors({maxdate: true});
      }else{
        if(typeof value == "string"){
          console.log("value es string");
          this.value = new Date(value)
        }
      }
    }
    this.onValidatorCallback(this.fecha?.control);
    
  }

  select(event:any):void{
    console.log("select: ", event);
    //this.value = event;
  }

  show():void{
    console.log("panelVisible: on");
    this.panelVisible = true;
  }

  close():void{
    console.log("panelVisible: off");
    this.panelVisible = false;
  }

  public validarFormatoEscritoDeFecha(event:any){
    let v = event.target.value.replace(/\D/g,'').slice(0, 8);
    if(event.inputType != 'deleteContentBackward' && v.length <= 8){
      if (v.length >= 4) {
        v = `${v.slice(0,2)}/${v.slice(2,4)}/${v.slice(4)}`;
      }
      else if (v.length >= 2) {
        v = `${v.slice(0,2)}/${v.slice(2)}`;
      }
      event.target.value = v;
    }
  }

  public esFechaValida(d:any) {
    const formatDate = d.split("/").reverse().join("-");
    console.log("esFechaValida: ", d, "- reorder: ", formatDate);
    return d.length >= 10 && moment(d, "DD/MM/YYYY").isValid();
  }

  public esMayorOIgualAFechaMinima(date:string){
    const formatDate = date.split("/").reverse().join("-");
    return moment(formatDate).isSameOrAfter(this.minDate);
  }

  public esMenorOIgualAFechaMaxima(date:string){
    const formatDate = date.split("/").reverse().join("-");
    return moment(formatDate).isSameOrBefore(this.maxDate);
  }

  removerError(campo: FormControl | undefined, error:string){
    const errors = campo?.errors;
    if(errors){
      delete errors[error];
      campo.setErrors(errors);
    }
  }

}
