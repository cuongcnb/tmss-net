import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetModalHeightService } from '../../../shared/common-service/set-modal-height.service';
import { CheckDisplay, ServicesReportDetail } from '../../../core/constains/services-report-detail';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'report-by-month',
  templateUrl: './report-by-month.component.html',
  styleUrls: ['./report-by-month.component.scss']
})
export class ReportByMonthComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  selectedDate: Date;
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
    this.buildForm();
    this.initCheckDisplay();
    this.checkForm();
    this.fillMonthPicker();
    this.modal.show();
  }

  private initCheckDisplay() {
    this.checkDisplay = {
      isDisableDealer: undefined,
      isHaveMonth: undefined,
      isHaveRepair: undefined,
    };
  }


  private checkForm() {
    this.filterMenu[this.selectedMenu].params.forEach(item => {
      this.checkDisplay[item] = true;
    });
    this.headerName = this.filterMenu[this.selectedMenu].title;
  }

  private fillMonthPicker(selectedDate?) {
    this.selectedDate = this.selectedDate = selectedDate ? new Date(selectedDate) : new Date();
    this.form.patchValue({
      month: new Date(new Date(this.selectedDate).getFullYear(), new Date(this.selectedDate).getMonth())
    });
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
      month: [undefined],
      repair: [undefined],
    });
  }

  downloadFile(event) {}
}

