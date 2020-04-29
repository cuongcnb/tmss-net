import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { MaintenanceCallingModel } from '../../../../core/models/maintenance-operation/maintenance-calling.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'maintenance-detail',
  templateUrl: './maintenance-detail.component.html',
  styleUrls: ['./maintenance-detail.component.scss']
})
export class MaintenanceDetailComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('contactHistory', {static: false}) contactHistory;
  @ViewChild('reparHistory', {static: false}) reparHistory;
  @ViewChild('newCar', {static: false}) newCar;
  @ViewChild('oldCar', {static: false}) oldCar;
  @ViewChild('insurance', {static: false}) insurance;
  @ViewChild('accessaryCar', {static: false}) accessaryCar;
  gridParams;
  fieldGrid;
  selectedData: MaintenanceCallingModel;
  data = [
    {
      contactInfo: 'A1',
      typeCar: 'Kiểu 1',
      licensePlate: '29-s6.5545',
      erKm: '9696 km',
      expectedDate: '121',
      appointmentCar: '1231',
      appointmentDay: '102',
      appointmentTime: '20',
      cvdvCar: '1994',
      complainCar: 'Không có',
      contentCall: 'Nhắc nhở',
      reasonCar: 'Do hay quên',
      noteCar: 'Không có ghi chú',
      peopleContact: 'Thuyền phó',
      dayContact: '235',
      hoursContact: '24',
    },

    {
      contactInfo: 'A2',
      typeCar: 'Kiểu 2',
      licensePlate: '29-s6.5545',
      erKm: '9696 km',
      expectedDate: '121',
      appointmentCar: '1231',
      appointmentDay: '102',
      appointmentTime: '20',
      cvdvCar: '1994',
      complainCar: 'Không có',
      contentCall: 'Nhắc nhở',
      reasonCar: 'Do hay quên',
      noteCar: 'Không có ghi chú',
      peopleContact: 'Thuyền phó',
      dayContact: '235',
      hoursContact: '24',
    },
  ];

  constructor() {
  }

  ngOnInit() {
    this.fieldGrid = [
      {headerName: 'TT liên hệ', headerTooltip: 'TT liên hệ', field: 'contactInfo'},
      {headerName: 'Loại hình', headerTooltip: 'Loại hình', field: 'typeCar'},
      {headerName: 'Biển số', headerTooltip: 'Biển số', field: 'licensePlate'},
      {headerName: 'Số Km', headerTooltip: 'Số Km', field: 'erKm'},
      {headerName: 'Ngày dự kiến', headerTooltip: 'Ngày dự kiến', field: 'expectedDate'},
      {headerName: 'TT đã hẹn', headerTooltip: 'TT đã hẹn', field: 'appointmentCar'},
      {headerName: 'Ngày hẹn', headerTooltip: 'Ngày hẹn', field: 'appointmentDay'},
      {headerName: 'Giờ hẹn', headerTooltip: 'Giờ hẹn', field: 'appointmentTime'},
      {headerName: 'CVDV', headerTooltip: 'Cố vấn dịch vụ', field: 'cvdvCar'},
      {headerName: 'Phàn nàn', headerTooltip: 'Phàn nàn', field: 'complainCar'},
      {headerName: 'ND gọi', headerTooltip: 'ND gọi', field: 'contentCall'},
      {headerName: 'Lý do', headerTooltip: 'Lý do', field: 'reasonCar'},
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'noteCar'},
      {headerName: 'Người liên hệ', headerTooltip: 'Người liên hệ', field: 'peopleContact'},
      {headerName: 'Ngày liên hệ', headerTooltip: 'Ngày liên hệ', field: 'dayContact'},
      {headerName: 'Giờ liên hệ', headerTooltip: 'Giờ liên hệ', field: 'hoursContact'},
    ];
  }

  callbackGrid(params) {
    this.gridParams = params;
    this.gridParams.api.setRowData(this.data);
  }

  getParams() {
    const selectedData = this.gridParams.api.getSelectedRows();
    if (selectedData) {
      this.selectedData = selectedData[0];

    }
  }
}
