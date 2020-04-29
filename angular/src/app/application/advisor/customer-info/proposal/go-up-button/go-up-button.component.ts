// Author: T4professor

import {Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';

// import {ICellRendererParams, IAfterGuiAttachedParams} from 'ag-grid';

@Component({
  selector: 'go-up-button',
  template: `
    <a href="#" style="font-size: 1.8em !important;" (click)="onUpClick($event)">&uarr;</a>
    &nbsp;
    <a href="#" style="font-size: 1.8em !important;" (click)="onDownClick($event)">&darr;</a>
  `
})

export class GoUpButtonComponent implements ICellRendererAngularComp {

  params;

  agInit(params): void {
    this.params = params;
  }

  refresh(params?: any): boolean {
    return true;
  }

  onUpClick($event) {
    if (this.params.onUpClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params //.node.data
        // ...something
      }
      this.params.onUpClick(params);
    }
  }

  onDownClick($event) {
    if (this.params.onDownClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params //.node.data
        // ...something
      }
      this.params.onDownClick(params);
    }
  }
}
