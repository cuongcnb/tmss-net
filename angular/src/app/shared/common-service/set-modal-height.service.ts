import { Injectable } from '@angular/core';

@Injectable()
export class SetModalHeightService {

  onResize() {
    return window.innerHeight - 200;
  }

  onResizeTab() {
    return window.innerHeight - 230;
  }

  onResizeWithoutFooter() {
    return window.innerHeight - 120;
  }

  setMenuHeight() {
    return window.innerHeight - 100;
  }
}
