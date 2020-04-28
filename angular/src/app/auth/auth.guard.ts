import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { StorageKeys } from '../core/constains/storageKeys';
import { FormStoringService } from '../shared/common-service/form-storing.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private formStoringService: FormStoringService,
  ) {
  }

  canActivate(): Promise<boolean> {
    if (this.formStoringService.get(StorageKeys.currentUser)) {
      this.router.navigate(['/']);
      return Promise.resolve(false);
    }

    return Promise.resolve(true);
  }

}
