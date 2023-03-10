import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { HomeRoutingModule } from './home-routing.module';
import { ComponentsModule } from 'src/app/modules/components.module';
import { HomePage } from './home.page';

@NgModule({
    imports: [
        CommonModule,
        HomeRoutingModule,
        FormsModule,
        ComponentsModule,
    ],
    declarations: [HomePage],
})
export class HomeModule {}
