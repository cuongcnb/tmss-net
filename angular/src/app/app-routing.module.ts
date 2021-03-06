import { NgModule } from '@angular/core';
import { NavigationEnd, RouteConfigLoadEnd, RouteConfigLoadStart, Router, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRouteGuard } from './shared/common/auth/auth-route-guard';
import { NotificationsComponent } from './shared/layout/notifications/notifications.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'environments/environment';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AppComponent,
                canActivate: [AppRouteGuard],
                canActivateChild: [AppRouteGuard],
                children: [
                    // {
                    //     path: '',
                    //     children: [
                    //         { path: 'notifications', component: NotificationsComponent },
                    //         { path: '', redirectTo: '/app/main/dashboard', pathMatch: 'full' }
                    //     ]
                    // },
                    {
                        path: '',
                        loadChildren: () => import('app/main/main.module').then(m => m.MainModule), //Lazy load main module
                        data: { preload: true }
                    },
                    {
                        path: 'admin',
                        loadChildren: () => import('app/admin/admin.module').then(m => m.AdminModule), //Lazy load admin module
                        data: { preload: true },
                        canLoad: [AppRouteGuard]
                    },
                    // {
                    //     path: '**', redirectTo: 'notifications'
                    // }
                ]
            },
            {
                path: 'auth',
                // loadChildren: './auth/auth.module#AuthModule',
                loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
                canActivate: environment.useOldBackend ? [] : [AppRouteGuard]
            }
        ])
    ],
    exports: [RouterModule]
})

export class AppRoutingModule {
    constructor(
        private router: Router,
        private spinnerService: NgxSpinnerService
    ) {
        router.events.subscribe((event) => {

            if (event instanceof RouteConfigLoadStart) {
                spinnerService.show();
            }

            if (event instanceof RouteConfigLoadEnd) {
                spinnerService.hide();
            }

            if (event instanceof NavigationEnd) {
                document.querySelector('meta[property=og\\:url').setAttribute('content', window.location.href);
            }
        });
    }
}
