import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetModalHeightService } from '../../../shared/common-service/set-modal-height.service';
import { ModalDirective } from 'ngx-bootstrap';
import { MaintenanceCallingModel } from '../../../core/models/maintenance-operation/maintenance-calling.model';
import { GridTableService } from '../../../shared/common-service/grid-table.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'maintenance-calling',
  templateUrl: './maintenance-calling.component.html',
  styleUrls: ['./maintenance-calling.component.scss'],
})
export class MaintenanceCallingComponent implements OnInit {
  @Input() isCallingNotContact: boolean;
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  fieldGrid;
  form: FormGroup;
  gridParams;
  modalHeight: number;
  selectedRowGrid: MaintenanceCallingModel;
  dataGrid = [
    {
      customertype: 'KHTN',
      expecteddate: '29-03-2019',
      licensePlates: '29-S6.65222',
      errorModel: '29-S6.65222',
      errorVin: '29-S6.65222',
      nextBD: '29-S6.65222',
      ownerName: '29-S6.65222',
      errorAddress: '29-S6.65222',
      errorPhone: '0869042483',
      errorEmail: 'abc@gmail.com',
      companyName: '29-S6.65222',
      carCarrier: '29-S6.65222',
      errorContact: '29-S6.65222',
      dateTime: '',
      errorCVDV: '29-S6.65222',
      errorKm: '29-S6.65222',
      repairContent: '29-S6.65222',
      sortAgency: '29-S6.65222',
    },
    {
      customertype: 'KHTN',
      expecteddate: '29-03',
      licensePlates: 'KHTN',
      errorModel: '29-S6.65222',
      errorVin: '29-S6.65222',
      nextBD: 'KHTN',
      ownerName: 'KHTN',
      errorAddress: 'KHTN',
      errorPhone: '0869042483',
      errorEmail: 'abc@gmail.com',
      companyName: 'KHTN',
      carCarrier: '29-S6.65222',
      errorContact: '29-S6.65222',
      dateTime: '',
      errorCVDV: '29-S6.65222',
      errorKm: '29-S6.65222',
      repairContent: '29-S6.65222',
      sortAgency: '29-S6.65222',
    },
  ];

  constructor(
    private modalHeightService: SetModalHeightService,
    private gridTableService: GridTableService,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {headerName: 'Biển số xe', headerTooltip: 'Biển số xe', field: 'licensePlates'},
      {headerName: 'Loại KH', headerTooltip: 'Loại khách hàng', field: 'customertype'},
      {headerName: 'Ngày dự tính', headerTooltip: 'Ngày dự tính', field: 'expecteddate'},
    ];
    this.buildForm();
    this.onResize();
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
      this.selectedRowGrid = selectedData[0];
    }
  }

  selectFirstRow() {
    this.gridTableService.selectFirstRow(this.gridParams);
  }

  searchMaintenance() {
    this.gridParams.api.setRowData(this.dataGrid);
    this.selectFirstRow();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      sortAgency: [undefined],
      licensePlates: [undefined],
      errorVin: [undefined],
      errorStatus: [undefined],
      serviceAdvisor: [undefined],
      dateTime: [undefined],
    });
  }
}
