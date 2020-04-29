import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MaintenanceCallingModel } from '../../../../core/models/maintenance-operation/maintenance-calling.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'contact-history',
  templateUrl: './contact-history.component.html',
  styleUrls: ['./contact-history.component.scss'],
})
export class ContactHistoryComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  form: FormGroup;
  fieldGrid;
  gridParams;
  selectedData: MaintenanceCallingModel;
  modalHeight: number;

  constructor(
    private modalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {headerName: 'TT liên hệ', headerTooltip: 'TT liên hệ', field: 'contact'},
      {headerName: 'Loại hình', headerTooltip: 'Loại hình', field: 'type'},
      {headerName: 'Biển số', headerTooltip: 'Biển số', field: 'licenseplate'},
      {headerName: 'Số Km', headerTooltip: 'Số Km', field: 'km'},
      {headerName: 'Ngày dự kiến', headerTooltip: 'Ngày dự kiến', field: 'expecteddate'},
      {headerName: 'TT đã hẹn', headerTooltip: 'TT đã hẹn', field: 'appointment'},
      {headerName: 'Ngày hẹn', headerTooltip: 'Ngày hẹn', field: 'appointmentday'},
      {headerName: 'Giờ hẹn', headerTooltip: 'Giờ hẹn', field: 'appointmenttime'},
      {headerName: 'CVDV', headerTooltip: 'Cố vấn dịch vụ', field: 'cvdv'},
      {headerName: 'Phàn nàn', headerTooltip: 'Phàn nàn', field: 'complain'},
      {headerName: 'ND gọi', headerTooltip: 'ND gọi', field: 'contentcall'},
      {headerName: 'Lý do', headerTooltip: 'Lý do', field: 'reason'},
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'note'},
      {headerName: 'Người liên hệ', headerTooltip: 'Người liên hệ', field: 'peoplecontact'},
      {headerName: 'Ngày liên hệ', headerTooltip: 'Ngày liên hệ', field: 'daycontact'},
      {headerName: 'Giờ liên hệ', headerTooltip: 'Giờ liên hệ', field: 'hourscontact'},
    ];
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  callbackGrid(params) {
    this.gridParams = params;
    this.gridParams.api.setRowData();
  }

  getParams() {
    const selectedData = this.gridParams.api.getSelectedRows();
    if (selectedData) {
      this.selectedData = selectedData[0];
    }
  }

  open(selectedData?) {
    this.buildForm();
    this.modal.show();
    this.onResize();
  }

  reset() {
    this.form = undefined;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      sortAgency: [{value: undefined, disabled: true}],
      errorVin: [{value: undefined, disabled: true}],
      errorStatus: [{value: undefined, disabled: true}],
      licensePlates: [{value: undefined, disabled: true}],
      dateTime: [{value: undefined, disabled: true}],
    });
  }
}
