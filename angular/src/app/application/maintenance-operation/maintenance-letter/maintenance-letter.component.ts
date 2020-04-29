import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MaintenanceLetterModel } from '../../../core/models/maintenance-operation/maintenance-letter.model';
import { GridTableService } from '../../../shared/common-service/grid-table.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'maintenance-letter',
  templateUrl: './maintenance-letter.component.html',
  styleUrls: ['./maintenance-letter.component.scss'],
})
export class MaintenanceLetterComponent implements OnInit {

  @ViewChild('maintenanceLetterModal', {static: false}) modal;
  fieldGrid;
  form: FormGroup;
  gridParams;
  selectedData: MaintenanceLetterModel;

  dataSearch = [
    {
      bks: 'bks123456',
      remindDate: '',
      toDate: '',
      //
      licensePlate: '29A1 5715',
      model: 'Model ver 9.5.2',
      estimatedDay: '4/9/2017',
      vinno: 'zzzz7894dsadasd1',
      driversName: 'Nguyen Van Khanh',
      driversAddress: 'Viet Nam',
      driversPhone: '0845117653',
      driversEmail: 'khanh@gmail.com',
      companyName: '',
      companyAddress: '',
      companyPhone: '',
      companyEmail: '',
      carrierName: 'Nguyen Vong Veo',
      carrierAddress: 'Da Nang',
      carrierPhone: '0745996185',
      carrierEmail: 'vongveo@gmail.com',
      //
      dateIn: '11/7/2018',
      km: '5069',
      milestonesBD: '10000',
      expectedDateBD: '12/9/2018',
      cvdv: 'Nguyen Quang Teo',
      contentSC1: 'fix 1 fix2 fix3',
      //
      dateInContent: '26/12/2018',
      supplier: 'TGP-ND',
      kmContent: '50',
      contentSC2: 'fix fix fixxxx',
      //
      numberSC: '546879216789',
      dateCarIn: '15/6/2015',
      dateCarOut: '17/10/2016',
      technicians: '',
      lhsc: 'bsd',
      contentSC: 'fix everything',
    }, {
      bks: 'bks bks',
      remindDate: '26/05/96',
      toDate: '',
      //
      licensePlate: '30F1 1419',
      model: 'Model ver 5.7.1',
      estimatedDay: '6/10/2017',
      vinno: 'abc789xyz654nm',
      driversName: 'Nguyen Thi Nam',
      driversAddress: 'My Dinh',
      driversPhone: '0168486553',
      driversEmail: 'nam@gmail.com',
      companyName: '',
      companyAddress: '',
      companyPhone: '',
      companyEmail: '',
      carrierName: 'Nguyen Vong Veo',
      carrierAddress: 'Da Nang',
      carrierPhone: '0745996185',
      carrierEmail: 'vongveo@gmail.com',
      //
      dateIn: '11/7/2018',
      km: '3209',
      milestonesBD: '10000',
      expectedDateBD: '25/9/2018',
      cvdv: 'Nguyen Quang Teo',
      contentSC1: 'fix 66 fix 159422',
      //
      dateInContent: '15/3/2018',
      supplier: 'TGP-BB',
      kmContent: '99',
      contentSC2: 'fix 1 + 5 + 6 + 9',
      //
      numberSC: '11458864629',
      dateCarIn: '17/5/2017',
      dateCarOut: '27/6/2017',
      technicians: '',
      lhsc: 'bsd',
      contentSC: 'fix everything ver 2.0.1',
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

  selectFirstRow() {
    this.gridTableService.selectFirstRow(this.gridParams);
  }

  clickLSSC() {
    this.modal.open(this.selectedData);
  }

  search() {
    this.gridParams.api.setRowData(this.dataSearch);
    this.selectFirstRow();
  }

  onSubmit() {
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      supplier: [undefined],
      BKS: [undefined],
      VIN: [undefined],
      remindDate: [undefined],
      toDate: [undefined],
    });
  }
}
