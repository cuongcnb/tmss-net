import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { ProgressForCustomersComponent } from '../application/queuing-system/progress-for-customers/progress-for-customers.component';
import {ScreenWaitReceptionComponent} from '../application/queuing-system/screen-wait-reception/screen-wait-reception.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'progress-customers',
    component: ProgressForCustomersComponent
  },
  {
    path: 'screen-wait-reception',
    component: ScreenWaitReceptionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
