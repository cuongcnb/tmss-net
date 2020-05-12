import { AbpMultiTenancyService } from '@abp/multi-tenancy/abp-multi-tenancy.service';
import { Injectable } from '@angular/core';
import { ApplicationInfoDto, GetCurrentLoginInformationsOutput, SessionServiceProxy, TenantLoginInfoDto, UserLoginInfoDto, UiCustomizationSettingsDto } from '@shared/service-proxies/service-proxies';
import { of } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable()
export class AppSessionService {

    private _user: UserLoginInfoDto;
    private _tenant: TenantLoginInfoDto;
    private _application: ApplicationInfoDto;
    private _theme: UiCustomizationSettingsDto;

    constructor(
        private _sessionService: SessionServiceProxy,
        private _abpMultiTenancyService: AbpMultiTenancyService) {
    }

    get application(): ApplicationInfoDto {
        return this._application;
    }

    set application(val: ApplicationInfoDto) {
        this._application = val;
    }

    get user(): UserLoginInfoDto {
        return this._user;
    }

    get userId(): number {
        return this.user ? this.user.id : null;
    }

    get tenant(): TenantLoginInfoDto {
        return this._tenant;
    }

    get tenancyName(): string {
        return this._tenant ? this.tenant.tenancyName : '';
    }

    get tenantId(): number {
        return this.tenant ? this.tenant.id : null;
    }

    getShownLoginName(): string {
        const userName = this._user.userName;
        if (!this._abpMultiTenancyService.isEnabled) {
            return userName;
        }

        return (this._tenant ? this._tenant.tenancyName : '.') + '\\' + userName;
    }

    get theme(): UiCustomizationSettingsDto {
        return this._theme;
    }

    set theme(val: UiCustomizationSettingsDto) {
        this._theme = val;
    }

    init(): Promise<UiCustomizationSettingsDto> {
        return new Promise<UiCustomizationSettingsDto>((resolve, reject) => {
            // cuongnm
            (environment.useOldBackend ? this.getCurrentLoginInformationsTTMS() : this._sessionService.getCurrentLoginInformations())
                .toPromise().then((result: GetCurrentLoginInformationsOutput) => {
                    this._application = result.application;
                    this._user = result.user;
                    this._tenant = result.tenant;
                    this._theme = result.theme;

                    resolve(result.theme);
                }, (err) => {
                    reject(err);
                });
        });
    }

    getCurrentLoginInformationsTTMS() {
        // cuongnm
        return of(JSON.parse(`{
            "user": {
              "name": "admin",
              "surname": "admin",
              "userName": "admin",
              "emailAddress": "admin@aspnetzero.com",
              "profilePictureId": null,
              "id": 1
            },
            "application": {
              "version": "8.1.0.0",
              "releaseDate": "2020-04-27T23:21:13+07:00",
              "currency": "USD",
              "currencySign": "$",
              "allowTenantsToChangeEmailSettings": false,
              "features": {}
            },
            "theme": {
              "baseSettings": {
                "theme": "default",
                "layout": {
                  "layoutType": "fluid"
                },
                "header": {
                  "desktopFixedHeader": true,
                  "mobileFixedHeader": false,
                  "headerSkin": "light",
                  "minimizeDesktopHeaderType": null,
                  "headerMenuArrows": false
                },
                "subHeader": {
                  "fixedSubHeader": true,
                  "subheaderStyle": "solid"
                },
                "menu": {
                  "position": "left",
                  "asideSkin": "light",
                  "fixedAside": true,
                  "allowAsideMinimizing": true,
                  "defaultMinimizedAside": false,
                  "submenuToggle": "false",
                  "searchActive": false
                },
                "footer": {
                  "fixedFooter": false
                }
              },
              "isLeftMenuUsed": true,
              "isTopMenuUsed": false,
              "isTabMenuUsed": false,
              "allowMenuScroll": true
            }
          }`));
    }

    changeTenantIfNeeded(tenantId?: number): boolean {
        if (this.isCurrentTenant(tenantId)) {
            return false;
        }

        abp.multiTenancy.setTenantIdCookie(tenantId);
        location.reload();
        return true;
    }

    private isCurrentTenant(tenantId?: number) {
        let isTenant = tenantId > 0;

        if (!isTenant && !this.tenant) { // this is host
            return true;
        }

        if (!tenantId && this.tenant) {
            return false;
        } else if (tenantId && (!this.tenant || this.tenant.id !== tenantId)) {
            return false;
        }

        return true;
    }
}
