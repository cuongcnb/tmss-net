import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SetModalHeightService } from '../../../shared/common-service/set-modal-height.service';
import { CheckDisplay, ServicesReportDetail } from '../../../core/constains/services-report-detail';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'report-by-accessory',
  templateUrl: './report-by-accessory.component.html',
  styleUrls: ['./report-by-accessory.component.scss']
})
export class ReportByAccessoryComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  selectedMenu: string;
  headerName: string;
  filterMenu = ServicesReportDetail;
  checkDisplay: CheckDisplay;
  form: FormGroup;
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private modalHeightService: SetModalHeightService,
  ) {
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(selectedMenu?) {
    this.selectedMenu = selectedMenu;
    this.initCheckDisplay();
    this.checkForm();
    this.modal.show();
  }

  private initCheckDisplay() {
    this.checkDisplay = {
      isDisableDealer: undefined,
      isHaveAccessoryCodeWithRequired: undefined,
      isHaveAccessoryCode: undefined,
      isHaveAccessoryType: undefined,
      isHaveFormatHTML: undefined,
      isHaveFormatFile: undefined,
      isHaveOrderNo: undefined,
      isHaveGroupBy: undefined,
    };
  }

  private checkForm() {
    this.filterMenu[this.selectedMenu].params.forEach(item => {
      this.checkDisplay[item] = true;
    });
    this.headerName = this.filterMenu[this.selectedMenu].title;
    this.buildForm();
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

  private buildForm() {
    this.form = this.formBuilder.group({
      dealerCode: [1],
      fromDate: [new Date()],
      toDate: [new Date()],
      formatFile: ['pdf'],
      accessoryCode: [undefined],
      accessoryType: [''],
      orderNo: [undefined],
      groupBy: [undefined],
    });

    if (this.checkDisplay.isHaveAccessoryCodeWithRequired) {
      this.form.get('accessoryCode').setValidators([Validators.required]);
    }
  }

  downloadFile(event) {}
}

