import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { SetModalHeightService } from '../../../shared/common-service/set-modal-height.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'progress-report',
  templateUrl: './progress-report.component.html',
  styleUrls: ['./progress-report.component.scss'],
})
export class ProgressReportComponent {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('teamModal', {static: false}) teamModal;
  form: FormGroup;
  modalHeight: number;
  fieldGrid;

  constructor(
    private formBuilder: FormBuilder,
    private setModalHeightService: SetModalHeightService,
  ) {
    this.fieldGrid = [
      {headerName: 'Div_code', headerTooltip: 'Div_code', field: 'divCode'},
      {headerName: 'Div_Name', headerTooltip: 'Div_Name', field: 'divName'},
    ];
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  open() {
    this.builForm();
    this.modal.show();
  }

  builForm() {
    this.form = this.formBuilder.group({
      dealerName: [{value: undefined, disabled: true}],
      fromDate: [undefined],
      toDate: [undefined],
      team: [undefined],
      factory: ['SCC'],
      efficient: ['effTech'],
    });
  }

}
