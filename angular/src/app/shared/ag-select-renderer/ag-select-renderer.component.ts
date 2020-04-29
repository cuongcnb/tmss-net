import {Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ag-select-renderer',
  templateUrl: './ag-select-renderer.component.html',
  styleUrls: ['./ag-select-renderer.component.scss']
})
export class AgSelectRendererComponent implements ICellRendererAngularComp {
  params: any;
  selectForm: FormGroup;
  field;
  // tslint:disable-next-line:ban-types
  disableSelect: boolean | Function;
  selectList = [
    {
      key: 1,
      value: 1
    },
    {
      key: 2,
      value: 2
    },
    {
      key: 3,
      value: 3
    }
  ];

  constructor(private formBuilder: FormBuilder) {
  }

  buildForm() {
    this.selectForm = this.formBuilder.group({
      select: [{value: undefined, disabled: this.disableSelect}]
    });
    this.selectForm.get('select').setValue(this.params.data[this.field]);
    this.selectForm.get('select').valueChanges.subscribe(val => {
      if (this.params.data[this.field] !== val) {
        this.params.column.editingStartedValue = this.params.data[this.field];
        this.params.node.setDataValue(this.field, val);
        this.params.api.stopEditing();
      }
    });
  }

  agInit(params: any): void {
    this.params = params;
    this.field = this.params.colDef.field;
    if (typeof this.params.colDef.disableSelect === 'function') {
      this.disableSelect = this.params.colDef.disableSelect(params);
    } else {
      this.disableSelect = this.params.colDef.disableSelect || false;
    }
    if (this.params.colDef.list) {
      this.selectList = this.params.colDef.list;
    }
    if (this.params.colDef.api) {
      this.params.colDef.api().subscribe((val) => {
        if (val) {
          this.selectList = val;
        }
      });
    }
    this.buildForm();
    if (this.params && this.params.api) {
      this.params.api.stopEditing();
    }

  }

  refresh(): boolean {
    return false;
  }
}
