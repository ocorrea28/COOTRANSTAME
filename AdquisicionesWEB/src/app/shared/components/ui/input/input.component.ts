import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="input-container" [class.input-disabled]="disabled">
      <label *ngIf="label" [for]="id">{{ label }}</label>
      <div class="input-field">
        <input 
          [type]="type" 
          [id]="id" 
          [placeholder]="placeholder"
          [required]="required"
          [disabled]="disabled"
          [min]="min"
          [max]="max"
          [step]="step"
          [(ngModel)]="value"
          (blur)="onTouched()"
          (input)="onInputChange($event)"
          (change)="onChange($event)"
        />
        <div *ngIf="icon" class="input-icon">
          <i [class]="icon"></i>
        </div>
      </div>
      <small *ngIf="helpText" class="help-text">{{ helpText }}</small>
      <small *ngIf="error" class="error-text">{{ error }}</small>
    </div>
  `,
  styles: [`
    .input-container {
      margin-bottom: 15px;
      width: 100%;
    }
    
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      color: var(--color-text);
    }
    
    .input-field {
      position: relative;
      display: flex;
      align-items: center;
    }
    
    input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      color: var(--color-text);
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    
    input:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
    }
    
    input:disabled {
      background-color: #f8f9fa;
      cursor: not-allowed;
      opacity: 0.7;
    }
    
    .input-icon {
      position: absolute;
      right: 10px;
      color: #6c757d;
    }
    
    .help-text {
      display: block;
      margin-top: 5px;
      color: #6c757d;
      font-size: 0.85rem;
    }
    
    .error-text {
      display: block;
      margin-top: 5px;
      color: var(--color-danger);
      font-size: 0.85rem;
    }
    
    .input-disabled label {
      opacity: 0.7;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  @Input() type: 'text' | 'number' | 'email' | 'password' | 'date' | 'tel' = 'text';
  @Input() id = '';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() helpText = '';
  @Input() error = '';
  @Input() icon = '';
  @Input() min: string = '';
  @Input() max: string = '';
  @Input() step: string = '';
  
  @Output() valueChange = new EventEmitter<any>();
  
  private _value: string | number = '';
  
  get value(): string | number {
    return this._value;
  }
  
  set value(val: string | number) {
    this._value = val;
    this.onChange(val);
    this.valueChange.emit(val);
  }
  
  onChange: any = (_: any) => {};
  onTouched: any = () => {};
  
  writeValue(value: string | number): void {
    if (value !== undefined) {
      this._value = value;
    }
  }
  
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  
  onInputChange(event: Event): void {
    const element = event.target as HTMLInputElement;
    let val: string | number = element.value;
    
    // Para inputs numéricos, convertimos el valor a number para la lógica interna
    // pero aseguramos que se maneje correctamente para el binding bidireccional
    if (this.type === 'number' && val !== '') {
      val = parseFloat(val);
    }
    
    this.value = val;
  }
}
