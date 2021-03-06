import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HttpTokenInterceptor } from './interceptors/http.token.interceptor';
import { environment } from 'environments/environment';

const providers = [];
if(environment.useOldBackend) {
  providers.push({provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true});
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  // providers: [
  //   // Khai bao API chay qua Interceptor
  //   // Bat request truoc khi ban len va truoc khi tra ve
  //   {provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true},
  // ],
  providers,
  declarations: [],
  exports: [],
  entryComponents: []
})
export class CoreModule {
}
