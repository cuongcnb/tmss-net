import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ContactCustomModel } from '../../../core/models/fir/contact-custom.model';
import { GridTableService } from '../../../shared/common-service/grid-table.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'contact-after-repair',
  templateUrl: './contact-after-repair.component.html',
  styleUrls: ['./contact-after-repair.component.scss']
})
export class ContactAfterRepairComponent implements OnInit {
  @ViewChild('updateContactModal', {static: false}) modal;
  fieldGrid;
  selectRowGrid;
  tabs: Array<any>;
  selectedTab;
  form: FormGroup;
  selectedData: ContactCustomModel;
  gridParams;
  data = [
    {
      licensePlate: '29A2-12345',
      dayIn: '20/11',
      dayOut: '21/11',
      historyContact: 'abc',
      carownerName: 'Hai',
      phoneNumber: '012365499',
      companyName: 'abc',
      email: 'abc@gmail.com',
      address: 'Ha Noi',
      moDel: 'aaa2',
      carName: 'audi',
      namecarCome: 'Son',
      sumKm: '5000',
      roleName: 'chu xe',
      vinNo: '1716782618',
      typeRepair: 'thay mới',
      commandRepair: 'lenh1',
      serviceAdvisor: 'Son',
      workContent: 'yêu cầu thay mới',
      priceRepair: '1000000đ',
      taxRepair: '10%',
      accessaryCode: 'phutung1',
      accessaryName: 'xích',
      aMount: '10',
      accessaryPrice: '100000đ',
      accessaryPriceTotal: '10000000đ',
      taxAccessary: '8%',
      agency: 'TMV',
      contentService: 'thay mới toàn bộ',
      techniciansName: 'KEM8',
      dayContact: '30/11',
      hourContact: '10:30',
      nameContact: 'Sơn',
      statusContact: 'thành công',
      comment: 'abcvdd',
      reason: 'abcnmmnmnmnm',
      contactTrue: 'tyqwquwyeuqywue',
      contactFalse: 'ádasdjajshdkaksd',
      notContact: 'không thích',
      typeCar: 'thể thao',
    },
    {
      licensePlate: '30A2-12345',
      dayIn: '20/11',
      dayOut: '21/11',
      historyContact: 'abc',
      carownerName: 'Hưng',
      phoneNumber: '012365499',
      companyName: 'abc',
      email: 'abc@gmail.com',
      address: 'Ha Noi',
      moDel: 'aaa2',
      carName: 'audi',
      namecarCome: 'Son',
      sumKm: '5000',
      roleName: 'chu xe',
      vinNo: '1716782618',
      typeRepair: 'thay mới',
      commandRepair: 'lenh1',
      serviceAdvisor: 'Son',
      workContent: 'yêu cầu thay mới',
      priceRepair: '1000000đ',
      taxRepair: '10%',
      accessaryCode: 'phutung1',
      accessaryName: 'xích',
      aMount: '10',
      accessaryPrice: '100000đ',
      accessaryPriceTotal: '10000000đ',
      taxAccessary: '8%',
      agency: 'TMV',
      contentService: 'thay mới toàn bộ',
      techniciansName: 'KEM10',
      dayContact: '20/11',
      hourContact: '10:30',
      nameContact: 'Sơn',
      statusContact: 'không thành công',
      comment: 'assacacaca',
      reason: 'hehe',
      contactTrue: 'haha',
      contactFalse: 'hihi',
      notContact: 'không thích',
      typeCar: 'thể thao',
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private gridTableService: GridTableService,
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {headerName: ' Biển số xe', headerTooltip: ' Biển số xe', field: 'licensePlate'},
      {headerName: ' Ngày vào ', headerTooltip: ' Ngày vào ', field: 'dayIn'},
      {headerName: 'Ngày ra ', headerTooltip: 'Ngày ra ', field: 'dayOut'},
      {headerName: ' LSLH ', headerTooltip: ' LSLH ', field: 'historyContact'},
    ];
    this.initTabs();
    this.buildForm();
    this.selectedTab = this.tabs[0];
  }

  callbackGrid(params) {
    this.gridParams = params;
    this.gridParams.api.setRowData();
  }

  inputData() {
    this.gridParams.api.setRowData(this.data);
    this.selectFirstRow();
  }

  getParams() {
    const selectedData = this.gridParams.api.getSelectedRows();
    if (selectedData) {
      this.selectRowGrid = selectedData[0];
    }
  }

  selectFirstRow() {
    this.gridTableService.selectFirstRow(this.gridParams);
  }

  selectTab(tab) {
    this.selectedTab = tab;
  }

  private initTabs() {
    this.tabs = ['Yêu cầu sửa chữa', 'CV đã làm', 'Phụ tùng '];
  }

  onSubmit() {
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      bsx: [undefined],
      cvDV: [undefined],
      lcs: [undefined],
      vin: [undefined],
      dayIn: [undefined],
      dayOut: [undefined],
      agency: [undefined],
      licensePlate: [undefined],
      serviceAdvisor: [undefined],
      status: [undefined],
    });
  }
  refresh() {
    this.form = undefined;
  }

}
