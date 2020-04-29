import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { IAfterGuiAttachedParams } from 'ag-grid-community';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'checkbox-user',
  templateUrl: './checkbox-user.component.html',
  styleUrls: ['./checkbox-user.component.scss'],
})
export class CheckboxUserComponent implements AgRendererComponent {
  params: any;

  agInit(params: any) {
    this.params = params;
  }

  afterGuiAttached(params?: IAfterGuiAttachedParams): void {
  }

  refresh(params: any) {
    params.data.checked = (params.value === true);
    params.api.refreshCells(params);
    return false;
  }
}
