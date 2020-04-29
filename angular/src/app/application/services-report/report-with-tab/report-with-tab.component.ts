import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetModalHeightService } from '../../../shared/common-service/set-modal-height.service';
import { ServicesReportDetail } from '../../../core/constains/services-report-detail';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'report-with-tab',
  templateUrl: './report-with-tab.component.html',
  styleUrls: ['./report-with-tab.component.scss'],
})
export class ReportWithTabComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  tabs: Array<any>;
  usingTab: Array<any> = [];
  selectedTab: string;
  filterMenu = ServicesReportDetail;
  headerName: string;
  selectedMenu: string;
  selectedDate: Date;
  form: FormGroup;
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private modalHeightService: SetModalHeightService,
  ) {
  }

  ngOnInit() {
    this.onResize();
    this.initTabs();
  }

  selectTab(tab) {
    this.selectedTab = tab;
  }

  open(selectedMenu?) {
    this.usingTab = [];
    this.selectedMenu = selectedMenu;
    this.buildForm();
    this.checkForm();
    this.fillMonthPicker();
    this.modal.show();
  }

  export() {
    if (this.form.invalid) {
      return;
    }
    this.modal.hide();
  }

  reset() {
    this.form = undefined;
  }

  private checkForm() {
    this.filterMenu[this.selectedMenu].displayTab.forEach(item => {
      this.usingTab.push(this.tabs.find(tab => tab.tab === item));
    });
    this.headerName = this.filterMenu[this.selectedMenu].title;
    this.selectedTab = this.usingTab[0].tab;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      dealerCode: [1],
      year: [(new Date()).getFullYear()],
      month: [undefined],
      date: [new Date()],
      fromDate: [new Date(new Date().getFullYear(), new Date().getMonth(), 1)],
      toDate: [new Date()],
    });
  }

  private initTabs() {
    this.tabs = [
      {name: 'Theo năm', tab: 'year'},
      {name: 'Theo tháng', tab: 'month'},
      {name: 'Theo ngày', tab: 'date'},
      {name: 'Từ ngày đến ngày', tab: 'rangeDate'},
    ];
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  private fillMonthPicker(selectedDate?) {
    this.selectedDate = this.selectedDate = selectedDate ? new Date(selectedDate) : new Date();
    this.form.patchValue({
      month: new Date(new Date(this.selectedDate).getFullYear(), new Date(this.selectedDate).getMonth()),
    });
  }

  downloadFile(event) {

  }
}

