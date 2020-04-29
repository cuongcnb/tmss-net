import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { MaintenanceMessageModel } from '../../../../core/models/maintenance-operation/maintenance-message.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'maintenance-message-modal',
  templateUrl: './maintenance-message-modal.component.html',
  styleUrls: ['./maintenance-message-modal.component.scss'],
})
export class MaintenanceMessageModalComponent implements OnInit {

  @ViewChild('modal', {static: false}) modal: ModalDirective;
  selectedData: MaintenanceMessageModel;
  form: FormGroup;
  modalHeight: number;
  fieldGrid;
  gridParams;

  constructor(
    private modalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
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

  reset() {
    this.form = undefined;
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
