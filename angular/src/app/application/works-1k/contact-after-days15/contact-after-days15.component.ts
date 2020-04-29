import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetModalHeightService } from '../../../shared/common-service/set-modal-height.service';
import { ContactCustomerModel } from '../../../core/models/works-1k/contact-customer.model';
import { GridTableService } from '../../../shared/common-service/grid-table.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'contact-after-days15',
  templateUrl: './contact-after-days15.component.html',
  styleUrls: ['./contact-after-days15.component.scss'],
})
export class ContactAfterDays15Component implements OnInit {
  @Input() isContactAfterDays55: boolean;
  @Input() isContactAfterDays15: boolean;
  @Input() isContactMaintenanceRemind: boolean;
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  fieldGrid;
  form: FormGroup;
  gridParams;
  modalHeight: number;
  selectedRowGrid: ContactCustomerModel;
  dataGrid = [
    {
      customertype: 'KHTN',
      expecteddate: '29-03',
      licensePlates: '29-S6.65222',
      errorModel: 'F29',
      errorVin: 'S1996',
      nextBD: '',
      ownerName: 'Vũ Thị M',
      errorAddress: 'Việt Nam',
      errorPhone: '0869361997',
      errorEmail: 'vtm@gmail.com',
      companyName: 'TDT',
      carCarrier: 'Nguyễn Văn A',
      errorContact: 'test2',
      dateTime: '',
      errorCVDV: 'Trần Văn H',
      errorKm: '40km',
      repairContent: 'content',
      sortAgency: 'DL',
    },
    {
      customertype: 'KHTN',
      expecteddate: '29-03',
      licensePlates: '29-S6.65222',
      errorModel: 'F20',
      errorVin: 'S1997',
      nextBD: 'KHTN',
      ownerName: 'Nguyễn Văn A',
      errorAddress: 'Hà Nội',
      errorPhone: '0869042483',
      errorEmail: 'abc@gmail.com',
      companyName: 'IOT',
      carCarrier: 'Vũ Thị M',
      errorContact: 'Nguyễn Thị C',
      dateTime: '',
      errorCVDV: 'test1',
      errorKm: '25km',
      repairContent: 'not content',
      sortAgency: 'DL',
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
      {headerName: 'Số vin', headerTooltip: 'Số vin', field: 'errorVin'},
      {headerName: 'Model', headerTooltip: 'Model', field: 'errorModel'},
      {headerName: 'Ngày giao xe', headerTooltip: 'Ngày giao xe', field: 'dateTime'},
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

  search() {
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
