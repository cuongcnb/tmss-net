import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { IAfterGuiAttachedParams } from 'ag-grid-community';

import { UpdateCheckboxUserColumnService } from './update-checkbox-user-column.service';
import { EventBusService } from '../../../shared/common-service/event-bus.service';
import { EventBusType } from '../../../core/constains/eventBusType';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ag-grid-checkbox',
  template: '<input *ngIf="params.value !== undefined" type="checkbox" [(ngModel)]="params.value" (change)="this.refresh(this.params)">',
  styles: ['']
})
export class IsUpdateCheckboxComponent implements AgRendererComponent {
  params: any;

  constructor(
    private updateCheckboxUserColumnService: UpdateCheckboxUserColumnService,
    private eventBusService: EventBusService,
  ) {
  }

  agInit(params: any) {
    if (params.value === '0') {
      params.value = false;
    }
    if (params.value === '1') {
      params.value = true;
    }
    this.params = params;
  }

  afterGuiAttached(params?: IAfterGuiAttachedParams): void {
  }

  refresh(params: any) {
    params.data.isUpdate = params.value;
    this.updateCheckboxUserColumnService.setParamsData(params.data);
    this.updateCheckboxUserColumnService.isUpdateChange(params.value);
    params.api.refreshCells(params);
    this.eventBusService.emit({
      type: EventBusType.isChangedUserColumn
    });
    return false;
  }
}
