import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { MainStepComponent } from './main-step/main-step.component';
import { ResizeStepComponent } from './resize-step/resize-step.component';
import { GroupingStepComponent } from './grouping-step/grouping-step.component';
import { FinishStepComponent } from './finish-step/finish-step.component';


const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: '/main',
  //   pathMatch: 'full'
  // },
  // {
  //   path: '',
  //   children: [
  //     {
  //       path: 'main',
  //       component: MainStepComponent,
  //     },
  //     {
  //       path: 'resize',
  //       component: ResizeStepComponent,
  //     },
  //     {
  //       path: 'grouped',
  //       component: GroupingStepComponent,
  //     },
  //     {
  //       path: 'finish',
  //       component: FinishStepComponent,
  //     },
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
