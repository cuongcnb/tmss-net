import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { MaintenanceLetterModel } from '../../../../core/models/maintenance-operation/maintenance-letter.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'maintenance-letter-modal',
  templateUrl: './maintenance-letter-modal.component.html',
  styleUrls: ['./maintenance-letter-modal.component.scss']
})
export class MaintenanceLetterModalComponent implements OnInit {

  @ViewChild('modal', {static: false}) modal: ModalDirective;
  form: FormGroup;
  modalHeight: number;
  selectedData: MaintenanceLetterModel;
  fieldGrid;
  gridParams;

  constructor(
    private formBuilder: FormBuilder,
    private modalHeightService: SetModalHeightService,
  ) {
    this.fieldGrid = [
      {headerName: 'Đại lý', headerTooltip: 'Đại lý', field: 'supplier'},
      {headerName: 'Số lệnh SC', headerTooltip: 'Số lệnh SC', field: 'numberSC'},
      {headerName: 'Số Vin', headerTooltip: 'Số Vin', field: 'vinno'},
      {headerName: 'BKS', headerTooltip: 'BKS', field: 'bks'},
      {headerName: 'Ngày xe đến', headerTooltip: 'Ngày xe đến', field: 'dateCarIn'},
      {headerName: 'Ngày ra xe', headerTooltip: 'Ngày ra xe', field: 'dateCarOut'},
      {headerName: 'Số km vào', headerTooltip: 'Số km vào', field: 'km'},
      {headerName: 'CVDV', headerTooltip: 'Cố vấn dịch vụ', field: 'cvdv'},
      {headerName: 'Kĩ thuật viên', headerTooltip: 'Kĩ thuật viên', field: 'technicians'},
      {headerName: 'LHSC', headerTooltip: 'LHSC', field: 'lhsc'},
      {headerName: 'Nội dung SC', headerTooltip: 'Nội dung SC', field: 'contentSC'},
    ];
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.buildForm();
    this.modal.show();
  }

  callbackGrid(params) {
    this.gridParams = params;
    this.gridParams.api.setRowData([this.selectedData]);
  }

  reset() {
    this.form = undefined;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      vin: [undefined],
      checkup: [undefined],
      dateOutCar: [undefined],
      toDate: [undefined],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }

}
