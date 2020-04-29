import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { isFunction } from 'util';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ag-checkbox-renderer',
  templateUrl: './ag-checkbox-renderer.component.html',
  styleUrls: ['./ag-checkbox-renderer.component.scss'],
})
export class AgCheckboxRendererComponent implements ICellRendererAngularComp {
  params: any;
  field;
  value;
  class;
  data;
  disableCheckbox;

  constructor() {
  }

  agInit(params: any): void {
    this.params = params;
    this.data = this.params.colDef.data;
    this.field = this.params.colDef.field;
    // this.disableCheckbox = this.params.colDef.disableCheckbox
    if (isFunction(this.params.colDef.disableCheckbox)) {
      this.params.colDef.disableCheckbox().subscribe(val => {
        this.disableCheckbox = val === true ? true : null;
      });
    } else {
      this.disableCheckbox = this.params.colDef.disableCheckbox;
    }

    this.value = this.params.data[this.field];
    if (this.value === null || this.value === undefined) {
      this.params.node.setDataValue(this.field, this.data ? this.data[1] : false);
    }
    if ((this.data && this.data.indexOf(this.value) === 0) || (!this.data && this.value === true)) {
      this.class = 'ag-icon-checkbox-checked';
    } else {
      this.class = 'ag-icon-checkbox-unchecked';
    }
  }

  changeValue(val) {
    if (this.data) {
      val ? val = this.data[0] : val = this.data[1];
    }
    this.params.node.setDataValue(this.field, val);
  }

  refresh(): boolean {
    return false;
  }
}
