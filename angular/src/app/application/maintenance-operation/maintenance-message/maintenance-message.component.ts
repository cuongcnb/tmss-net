import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MaintenanceMessageModel } from '../../../core/models/maintenance-operation/maintenance-message.model';
import { GridTableService } from '../../../shared/common-service/grid-table.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'maintenance-message',
  templateUrl: './maintenance-message.component.html',
  styleUrls: ['./maintenance-message.component.scss'],
})
export class MaintenanceMessageComponent implements OnInit {

  @Input() letter;
  @ViewChild('maintenanceMessageModal', {static: false}) modal;
  selectedRowGrid: MaintenanceMessageModel;
  selectedData: MaintenanceMessageModel;
  gridParams;
  fieldGrid;

  form: FormGroup;
  dataSearch = [
    {
      bks: 'bks123456',
      remindDate: '',
      toDate: '',
      //
      licensePlate: '45 65412',
      model: 'Vss_123',
      estimatedDay: '23/12/2018',
      vinno: 'VC45X448QCK44976',
      driversName: 'Tang Van Tit',
      driversAddress: 'Ha Noi',
      driversPhone: '0986125846',
      driversEmail: 'tangvantit@gmail.com',
      companyName: '',
      companyAddress: '',
      companyPhone: '',
      carrierName: 'Tang Van Kheo',
      carrierAddress: 'TPHCM',
      carrierPhone: '0345789152',
      carrierEmail: 'tangvankheo@gmail.com',
      //
      dateIn: '5/21/2018',
      km: '15069',
      milestonesBD: '16000',
      expectedDateBD: '10/9/2018',
      cvdv: 'Nguyen Quang Teo',
      contentSC1: 'fix 1 fix2 fix3',
      //
      dateInContent: '22/11/2018',
      supplier: 'TGP-ND',
      kmContent: '0',
      contentSC2: 'fix fix fix',
      //
      numberSC: '546879216789',
      dateCarIn: '15/6/2015',
      dateCarOut: '17/10/2016',
      technicians: '',
      lhsc: 'bsd',
      contentSC: 'fix everything',
    },
    {
      bks: 'bks789456',
      remindDate: '',
      toDate: '',
      //
      licensePlate: '65 8731',
      model: 'AK_47',
      estimatedDay: '1/12/2018',
      vinno: 'HSAG564SSCAAC5',
      driversName: 'Le Van Tit',
      driversAddress: 'Viet Nam',
      driversPhone: '08758465467',
      driversEmail: 'levantit@gmail.com',
      companyName: '',
      companyAddress: '',
      companyPhone: '',
      carrierName: 'Nguyen Van Kheo',
      carrierAddress: 'TPHCM',
      carrierPhone: '0345789152',
      carrierEmail: 'nguyenvankheo@gmail.com',
      //
      dateIn: '9/12/2018',
      km: '12069',
      milestonesBD: '13000',
      expectedDateBD: '07/12/2018',
      cvdv: 'Nguyen Quang Teo',
      contentSC1: 'ákdhkasdhkjsahdkahsk',
      //
      dateInContent: '5/11/2018',
      supplier: 'TGP-ND',
      kmContent: '0',
      contentSC2: 'áodoisauioduoqwwuouuuu',
      //
      numberSC: '587911544489',
      dateCarIn: '4/11/2015',
      dateCarOut: '25/6/2016',
      technicians: '',
      lhsc: 'bccd',
      contentSC: 'fix all',
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private gridTableService: GridTableService,
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {headerName: 'Biển số xe', headerTooltip: 'Biển số xe', field: 'licensePlate'},
      {headerName: 'Model', headerTooltip: 'Model', field: 'model'},
      {headerName: 'Ngày dự tính', headerTooltip: 'Ngày dự tính', field: 'estimatedDay'},
    ];

    this.buildForm();
  }

  onSubmit() {
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
    this.gridParams.api.setRowData(this.dataSearch);
    this.selectFirstRow();
  }

  openLSSCModal() {
    this.modal.open(this.selectedRowGrid);
  }

  refresh() {
    this.gridParams.api.setRowData();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      supplier: [undefined],
      bks: [undefined],
      vin: [undefined],
      remindDate: [undefined],
      toDate: [undefined],
    });
  }
}
