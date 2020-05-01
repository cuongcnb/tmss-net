import { ComponentFactoryResolver, EmbeddedViewRef, Injectable, Injector } from '@angular/core';
import { LoadingComponent } from './loading.component';

@Injectable()
export class LoadingService {
  isLoading: boolean;

  constructor(
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
  ) {
  }

  setDisplay(val: boolean) {
    this.isLoading = val;

    if (val) {
      const elem = document.getElementById('loading-component');
      if (!elem) {
        const componentRef = this.resolver.resolveComponentFactory(LoadingComponent).create(this.injector);
        const newDiv = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

        const homeDiv = document.querySelector('dashboard');
        const authDiv = document.querySelector('auth');

        if (homeDiv) {
          homeDiv.appendChild(newDiv);
        } else {
          authDiv.appendChild(newDiv);
        }
      }
    } else {
      const elem = document.getElementById('loading-component');

      if (elem) {
        elem.parentNode.removeChild(elem);
      }
    }
  }

}
