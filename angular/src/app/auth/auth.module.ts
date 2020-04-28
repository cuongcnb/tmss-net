import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login/login.component';
import {AuthComponent} from './auth.component';
import {AuthRoutingModule} from './auth-routing.module';
// import {SharedModule} from '../shared/shared.module';
import {CoreModule} from '../core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormValidationModule } from '../shared/form-validation/form-validation.module';
import { ApiModule } from '../api/api.module';

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    // SharedModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    FormValidationModule,
    ApiModule
  ],
  declarations: [
    LoginComponent,
    AuthComponent
  ]
})
export class AuthModule {
}
