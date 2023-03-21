import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { CustomCalendarComponent } from './components/custom-calendar/custom-calendar.component';
import {CalendarModule} from 'primeng/calendar';

@NgModule({
  declarations: [
    AppComponent,
    CustomInputComponent,
    CustomCalendarComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
