import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MainStepComponent } from './main-step/main-step.component';
import { ResizeStepComponent } from './resize-step/resize-step.component';
import { GroupingStepComponent } from './grouping-step/grouping-step.component';
import { FinishStepComponent } from './finish-step/finish-step.component';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MainStepComponent,
    ResizeStepComponent,
    GroupingStepComponent,
    FinishStepComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    InputTextModule,
    InputTextareaModule,
    BrowserAnimationsModule,
    ButtonModule,
    PaginatorModule,
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
