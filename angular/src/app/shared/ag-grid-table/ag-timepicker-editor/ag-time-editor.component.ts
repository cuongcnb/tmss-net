import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {ICellEditorParams} from 'ag-grid-community';
import {ICellEditorAngularComp} from 'ag-grid-angular';
import {InputMask} from 'primeng/inputmask';

import {DataFormatService} from '../../common-service/data-format.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ag-timepicker-editor',
  templateUrl: './ag-time-editor.component.html',
  styleUrls: ['./ag-time-editor.component.scss']
})
export class AgTimeEditorComponent implements AfterViewInit, ICellEditorAngularComp {
  @ViewChild('timeInput', {read: InputMask, static: false}) private timeInput: InputMask;
   params: ICellEditorParams;
   timeValue: string | null;

  constructor(private dataFormatService: DataFormatService) { }

  ngAfterViewInit(): void {
    setTimeout(() => this.timeInput.focus());
  }

  agInit(params: ICellEditorParams): void {
    this.params = params;
    this.timeValue = !!params.value ? this.dataFormatService.formatHoursSecond(params.value) : null;
  }

  getValue(): any {
    return !!this.timeValue ? this.dataFormatService.consvertTimeToSeconnds(`${this.timeValue}:00`) : null;
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
