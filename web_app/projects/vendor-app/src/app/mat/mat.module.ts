import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule
  ],
  exports: [
    BrowserAnimationsModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule
  ],
})
export class MatModule { }
