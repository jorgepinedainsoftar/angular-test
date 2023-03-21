import { Component, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NgModel, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import * as moment from 'moment';

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

  constructor() { 
    this.disabled = false;
    this.required = false;
    this.panelVisible = false;
    this.minDate = new Date(-8640000000000000);
    this.maxDate = new Date(8640000000000000);
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
      if(this.esFechaValida(value)){
        this.value = value;
        console.log("event: ", value);
      }else{
        this.fecha?.control.setErrors({dateformaterror: true});
        this.onValidatorCallback(this.fecha?.control);
      }
    }
    
  }

  select(event:any):void{
    console.log("select: ", event);
    this.value = event;
  }

  show():void{
    this.panelVisible = true;
  }

  close():void{
    this.panelVisible = false;
  }

  public validarFormatoEscritoDeFecha(event:any){
    let v = event.target.value.replace(/\D/g,'').slice(0, 8);
    if(event.inputType != 'deleteContentBackward'){
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
    return moment(d, "DD/MM/YYYY").isValid() && moment(d).isSameOrAfter(this.minDate) && moment(d).isSameOrBefore(this.maxDate);
  }

  removerError(campo: FormControl | undefined, error:string){
    const errors = campo?.errors;
    if(errors){
      delete errors[error];
      campo.setErrors(errors);
    }
  }

}
