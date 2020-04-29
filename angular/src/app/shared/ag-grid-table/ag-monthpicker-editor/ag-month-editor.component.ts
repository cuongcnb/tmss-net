import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {ICellEditorAngularComp} from 'ag-grid-angular';
import {ICellEditorParams} from 'ag-grid-community';
import {InputMask} from 'primeng/inputmask';
import * as moment from 'moment';

const srcFormat = 'DD-MMM-YYYY';
const desFormat = 'MM-YYYY';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ag-monthpicker-editor',
  templateUrl: './ag-month-editor.component.html',
  styleUrls: ['./ag-month-editor.component.scss']
})
export class AgMonthEditorComponent implements AfterViewInit, ICellEditorAngularComp {
  @ViewChild('monthInput', {read: InputMask, static: false}) private monthInput: InputMask;
   params: ICellEditorParams;
   monthValue: string | null;

  constructor() { }

  ngAfterViewInit(): void {
    setTimeout(() => this.monthInput.focus());
  }

  agInit(params: ICellEditorParams): void {
    this.params = params;
    const month = moment(params.value, srcFormat);
    this.monthValue = month.isValid() ? month.format(desFormat) : null;
  }

  getValue(): any {
    const month = moment(this.monthValue, desFormat);
    return month.isValid() ? month.format(srcFormat) : null;
  }

  isCancelBeforeStart(): boolean {
    return false;
  }

  isCancelAfterEnd(): boolean {
    return false;
  }

  isPopup(): boolean {
    return false;
  }

}
