import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ag-datepicker-renderer',
  templateUrl: './ag-datepicker-renderer.component.html',
  styleUrls: ['./ag-datepicker-renderer.component.scss']
})
export class AgDatepickerRendererComponent implements ICellRendererAngularComp {
  public params: any;
  public datepickerForm: FormGroup;
  field: string;
  // tslint:disable-next-line:ban-types
  disableSelect: boolean | Function;

  constructor(private formBuilder: FormBuilder) {
  }

  buildForm() {
    this.datepickerForm = this.formBuilder.group({
      datepicker: [{value: undefined, disabled: this.disableSelect}]
    });
    if (this.params.data[this.field]) {
      this.datepickerForm.get('datepicker').setValue(new Date(this.params.data[this.field]));
    }
    this.datepickerForm.get('datepicker').valueChanges.subscribe(val => {
      if (!this.params.data[this.field] || ((this.params.data[this.field] && val) && this.params.data[this.field] !== val)) {
        this.params.column.editingStartedValue = this.params.data[this.field];
        this.params.node.setDataValue(this.params.colDef.field, val);
      }
    });
  }

  agInit(params: any): void {
    this.params = params;
    if (typeof this.params.colDef.disableSelect === 'function') {
      this.disableSelect = this.params.colDef.disableSelect(params);
    } else {
      this.disableSelect = this.params.colDef.disableSelect || false;
    }
    this.field = this.params.colDef.field;
    this.buildForm();
  }

  refresh(): boolean {
    return false;
  }

}
