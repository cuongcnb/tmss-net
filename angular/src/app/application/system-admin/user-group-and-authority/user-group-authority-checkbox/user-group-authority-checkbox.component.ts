import { Component, EventEmitter, Output } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { IAfterGuiAttachedParams } from 'ag-grid-community';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dlr-vehicle-sell-checkbox',
  template: '<input type="checkbox" [(ngModel)]="params.value" [disabled]="disableInput" (change)="this.refresh(this.params)">',
  styles: ['']
})
export class UserGroupAuthorityCheckboxComponent implements AgRendererComponent {
  @Output() changeValue = new EventEmitter<boolean>();
  params;
  inputValue;

  constructor(
  ) {}

  agInit(params) {
    this.params = params;
  }

  get disableInput() {
    let isDisable: boolean;
    if (this.params.colDef.field === 'tmv' || this.params.colDef.field === 'active') {
      isDisable = true;
    }
    return isDisable;
  }

  afterGuiAttached(params?: IAfterGuiAttachedParams) {
  }

  refresh(params) {
    switch (params.colDef.field) {
      case 'tmv':
        params.tmv = params.value;
        break;
      case 'active':
        params.data.active = params.value;
        break;
      case 'add':
        params.data.add = params.value;
        break;
      case 'modify':
        params.data.modify = params.value;
        break;
      case 'delete':
        params.data.delete = params.value;
        break;
      case 'query':
        params.data.query = params.value;
        break;
    }
    // params.api.refreshCells(params);
    return false;
  }
}

