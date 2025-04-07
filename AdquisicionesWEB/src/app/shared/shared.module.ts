import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ButtonComponent } from './components/ui/button/button.component';
import { InputComponent } from './components/ui/input/input.component';
import { DropdownComponent } from './components/ui/dropdown/dropdown.component';
import { TableComponent } from './components/ui/table/table.component';
import { ModalComponent } from './components/ui/modal/modal.component';

const COMPONENTS = [
  ButtonComponent,
  InputComponent,
  DropdownComponent,
  TableComponent,
  ModalComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...COMPONENTS
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...COMPONENTS
  ]
})
export class SharedModule { }
