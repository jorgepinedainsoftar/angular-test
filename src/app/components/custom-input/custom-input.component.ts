import { AfterViewInit, ChangeDetectorRef, Component, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NgModel, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CustomInputComponent),
  multi: true
}

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.css'],
  providers: [
    CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR,
    {
      provide: NG_VALIDATORS,
      multi:true,
      useExisting: CustomInputComponent
    }
  ]
})
export class CustomInputComponent implements OnInit, ControlValueAccessor, Validator, AfterViewInit {

  private innerIdValue: any = null;
  private control?:AbstractControl;
  @Input() disabled:boolean;
  @Input() required:boolean;
  @ViewChild("campo") campo?:NgModel;

  onChangeCallback = (_:any) =>  {

  }
  onTouchedCallback = (_:any) =>  {

  }
  onValidatorCallback = (_:any) =>  {

  }
  

  constructor(
    private cd:ChangeDetectorRef
  ) { 
    this.disabled = false;
    this.required = false;
  }
  ngAfterViewInit(): void {
    this.establecerPropiedadesCampo();
    this.cd.detectChanges();
  }

  ngOnInit(): void {
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

  validate(control: AbstractControl):ValidationErrors | null {
    this.required = control.hasValidator(Validators.required) || false;
    this.control = control;
    this.establecerPropiedadesCampo();
    return {...this.campo?.errors}
  }

  establecerPropiedadesCampo():void{
    if(this.campo && this.control){
      if(this.control.dirty){
        this.campo.control.markAsDirty();
      }else{
        this.campo.control.markAsPristine();
      }
      if(this.control.touched){
        this.campo.control.markAsTouched();
      }else{
        this.campo.control.markAsUntouched();
      }
    }
  }

  registerOnValidatorChange(fn: () => void): void {
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
  
  errorManual():void{
    if(this.campo?.value && this.campo?.value.length > 5){
      this.campo?.control.setErrors({lengthError: true});
    }else{
      this.removerError(this.campo?.control, "lengthError");
    }
    this.onValidatorCallback(this.campo?.control);
  }

  removerError(campo: FormControl | undefined, error:string){
    const errors = campo?.errors;
    if(errors){
      delete errors[error];
      campo.setErrors(errors);
    }
  }

}
