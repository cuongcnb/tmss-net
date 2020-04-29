import {Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ToastService} from '../swal-alert/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ag-in-cell-button',
  templateUrl: './ag-in-cell-button.component.html',
  styleUrls: ['./ag-in-cell-button.component.scss']
})
export class AgInCellButtonComponent implements ICellRendererAngularComp {
  public params: any;
  field: string;
  buttonDef: {
    text: string, // Button display text
    iconName: string, // 'fa fa-pencil'
    // tslint:disable-next-line:ban-types
    disabled: boolean | Function, // true => disable button, false => enable button
    message: string,
    // tslint:disable-next-line:ban-types
    function: Function,
  };

  buttonDefTwo: {
    text: string, // Button display text
    iconName: string, // 'fa fa-pencil'
    // tslint:disable-next-line:ban-types
    disabled: boolean | Function, // true => disable button, false => enable button
    message: string,
    // tslint:disable-next-line:ban-types
    function: Function,
  };

  constructor(
    private toastService: ToastService
  ) {
  }

  agInit(params) {
    this.params = params;
    this.field = this.params.colDef.field;
    this.buttonDef = this.params.colDef.buttonDef;
    this.buttonDefTwo = this.params.colDef.buttonDefTwo;
  }

  get disableButton() {
    // Execute if type is function
    if (typeof this.buttonDef.disabled === 'function') {
      return this.buttonDef.disabled(this.params);
    } else {
      return this.buttonDef.disabled;
    }
  }

  get disableButtonTwo() {
    // Execute if type is function
    if (typeof this.buttonDefTwo.disabled === 'function') {
      return this.buttonDefTwo.disabled(this.params);
    } else {
      return this.buttonDefTwo.disabled;
    }
  }

  customFunction() {
    // Execute function when button is clicked
    if (this.disableButton) {
      this.toastService.openWarningToast(this.buttonDef.message || 'Dữ liệu không đủ điều kiện để thực hiện thao tác');
      return;
    }
    this.buttonDef.function(this.params);
  }

  customFunctionTwo() {
    // Execute function when button is clicked
    if (this.disableButtonTwo) {
      this.toastService.openWarningToast(this.buttonDefTwo.message || 'Dữ liệu không đủ điều kiện để thực hiện thao tác');
      return;
    }
    this.buttonDefTwo.function(this.params);
  }

  refresh(): boolean {
    return false;
  }
}
