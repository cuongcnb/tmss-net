import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DealerModel } from '../../../core/models/sales/dealer.model';
import { CurrentUserModel } from '../../../core/models/base.model';
import { CurrentUser } from '../../../home/home.component';
import { SetModalHeightService } from '../../../shared/common-service/set-modal-height.service';
import { LoadingService } from '../../../shared/loading/loading.service';
import { DealerApi } from '../../../api/sales-api/dealer/dealer.api';
import { ServiceReportApi } from '../../../api/service-report/service-report.api';
import { DownloadService } from '../../../shared/common-service/download.service';
import { GlobalValidator } from '../../../shared/form-validation/validators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'output-report',
  templateUrl: './output-report.component.html',
  styleUrls: ['./output-report.component.scss']
})
export class OutputReportComponent implements OnInit, AfterViewInit {

  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('btn', {static: false}) btn: ElementRef;
  form: FormGroup;
  modalHeight: number;
  dealerList: DealerModel[];
  currentUser: CurrentUserModel = CurrentUser;

  constructor(
    private formBuilder: FormBuilder,
    private modalHeightService: SetModalHeightService,
    private loadingService: LoadingService,
    private dealerApi: DealerApi,
    private serviceReportApi: ServiceReportApi,
    private downloadService: DownloadService,
  ) { }

  ngOnInit() {
  }
  ngAfterViewInit(): void {
  }
  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  getDealer() {
    this.loadingService.setDisplay(true);
    this.dealerApi.getAllAvailableDealers().subscribe(res => {
      this.loadingService.setDisplay(false);
      this.dealerList = res;
      this.buildForm();
    });
  }

  downloadFile() {
    this.loadingService.setDisplay(true);
    this.serviceReportApi.shipmentReport(this.form.getRawValue()).subscribe(res => {
      this.downloadService.downloadFile(res);
      this.loadingService.setDisplay(false);
    });
  }

  reset() {
    this.form = undefined;
  }

  open() {
    if (this.currentUser.isAdmin) {
      this.getDealer();
    } else {
      this.buildForm();
    }
    this.modal.show();
    setTimeout(() => {
      this.btn.nativeElement.focus();
    }, 200);
  }

  private buildForm() {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const date = new Date().getDate();
    this.form = this.formBuilder.group({
      dlrId: [{
        value: !this.currentUser.isAdmin ? this.currentUser.dealerId : undefined,
        disabled: !this.currentUser.isAdmin
      }, GlobalValidator.required],
      fromDate: [new Date(year, month, date, 0, 0, 0).getTime()],
      toDate: [new Date(year, month, date, 23, 59, 59).getTime()],
      partType: ['A'],
      extension: ['xls'],
    });
  }
}
