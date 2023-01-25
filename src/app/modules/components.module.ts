import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';

import { PrimaryButtonComponent } from '../components/primary-button/primary-button.component';
import { PrimaryInputComponent } from '../components/primary-input/primary-input.component';
import { PrimaryModalComponent } from '../components/primary-modal/primary-modal.component';
import { PrimaryNumberInputComponent } from '../components/primary-number-input/primary-number-input.component';
import { PrimaryDateInputComponent } from '../components/primary-date-input/primary-date-input.component';
import { PrimarySelectComponent } from '../components/primary-select/primary-select.component';
import { PreviewModalComponent } from '../components/preview-modal/preview-modal.component';
import { PrimaryImageInputComponent } from '../components/primary-image-input/primary-image-input.component';

const modules = [
    /** Components Modules Here */
    PreviewModalComponent,
    PrimaryButtonComponent,
    PrimaryDateInputComponent,
    PrimaryImageInputComponent,
    PrimaryInputComponent,
    PrimaryModalComponent,
    PrimaryNumberInputComponent,
    PrimarySelectComponent
];

@NgModule({
    declarations: [
        ...modules
    ],
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule
    ],
    exports: [
        MaterialModule,
        ...modules
    ],
})
export class ComponentsModule { }
