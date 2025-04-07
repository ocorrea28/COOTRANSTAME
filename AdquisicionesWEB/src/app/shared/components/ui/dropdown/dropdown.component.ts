import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dropdown-container" [class.dropdown-disabled]="disabled">
      <label *ngIf="label" [for]="id">{{ label }}</label>
      <select 
        [id]="id"
        [required]="required"
        [disabled]="disabled"
        [(ngModel)]="value"
        (blur)="onTouched()"
        (change)="onChange($event)"
      >
        <option *ngIf="showEmptyOption" [value]="''" [disabled]="required">{{ emptyOptionText }}</option>
        <option *ngFor="let option of options" [value]="getOptionValue(option)">
          {{ getOptionLabel(option) }}
        </option>
      </select>
      <div class="select-arrow">
        <i class="fas fa-chevron-down"></i>
      </div>
      <small *ngIf="helpText" class="help-text">{{ helpText }}</small>
      <small *ngIf="error" class="error-text">{{ error }}</small>
    </div>
  `,
  styles: [`
    .dropdown-container {
      margin-bottom: 15px;
      width: 100%;
      position: relative;
    }
    
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      color: var(--color-text);
    }
    
    select {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      color: var(--color-text);
      appearance: none;
      background-color: white;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    
    select:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
    }
    
    select:disabled {
      background-color: #f8f9fa;
      cursor: not-allowed;
      opacity: 0.7;
    }
    
    .select-arrow {
      position: absolute;
      right: 10px;
      top: calc(50% + 10px);
      transform: translateY(-50%);
      pointer-events: none;
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
    
    .dropdown-disabled label {
      opacity: 0.7;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true
    }
  ]
})
export class DropdownComponent implements ControlValueAccessor {
  @Input() id = '';
  @Input() label = '';
  @Input() options: any[] = [];
  @Input() valueField = 'id';
  @Input() labelField = 'name';
  @Input() required = false;
  @Input() disabled = false;
  @Input() helpText = '';
  @Input() error = '';
  @Input() showEmptyOption = true;
  @Input() emptyOptionText = 'Seleccione una opción';
  
  @Output() valueChange = new EventEmitter<any>();
  
  private _value: any = '';
  
  get value(): any {
    return this._value;
  }
  
  set value(val: any) {
    this._value = val;
    this.onChange(val);
    this.valueChange.emit(val);
  }
  
  onChange: any = (_: any) => {};
  onTouched: any = () => {};
  
  writeValue(value: any): void {
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
  
  getOptionValue(option: any): any {
    if (typeof option === 'object' && option !== null) {
      return option[this.valueField];
    }
    return option;
  }
  
  getOptionLabel(option: any): string {
    if (typeof option === 'object' && option !== null) {
      return option[this.labelField] || '';
    }
    return String(option);
  }
}
