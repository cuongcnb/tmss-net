import { Component } from '@angular/core';
// import { IHeaderGroupComp } from 'ag-grid/dist/lib/headerRendering/headerGroup/headerGroupComp';
import { IHeaderGroupComp } from 'ag-grid-community/dist/lib/headerRendering/headerGroup/headerGroupComp';
import { IHeaderAngularComp } from 'ag-grid-angular';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ag-checkbox-header-renderer',
  templateUrl: './ag-checkbox-header-renderer.component.html',
  styleUrls: ['./ag-checkbox-header-renderer.component.scss']
})
export class AgCheckboxHeaderRendererComponent implements IHeaderGroupComp, IHeaderAngularComp {
  class = 'ag-icon-checkbox-unchecked';
  params;
  getGui;
  checkBoxField;
  constructor() {
  }

  agInit(params: any): void {
    this.params = params;

    // Get checkbox field in each row
    this.checkBoxField = this.params.column.colDef.field;
    // if (this.params.checked === true) {
    //   this.class = 'ag-icon-checkbox-checked'
    // } else {
    //   this.class = 'ag-icon-checkbox-unchecked'
    // }
  }

  changeValue(val) {
    this.params.checked = val;
    // check/uncheck all "checkBoxField" in each row
    if (this.params.column.colDef.checkboxSelection) {
      this.params.api.forEachNode(node => {
        node.setDataValue(this.checkBoxField, val);
      });
    } else {
      val ? this.params.api.selectAll() : this.params.api.deselectAll();
    }
  }
}
