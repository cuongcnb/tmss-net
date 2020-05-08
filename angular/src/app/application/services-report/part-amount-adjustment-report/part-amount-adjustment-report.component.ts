import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, Injector } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DealerModel } from '../../../core/models/sales/dealer.model';
import { CurrentUserModel } from '../../../core/models/base.model';
import { SetModalHeightService } from '../../../shared/common-service/set-modal-height.service';
import { DealerApi } from '../../../api/sales-api/dealer/dealer.api';
import { LoadingService } from '../../../shared/loading/loading.service';
import { ServiceReportApi } from '../../../api/service-report/service-report.api';
import { DownloadService } from '../../../shared/common-service/download.service';
import { GlobalValidator } from '../../../shared/form-validation/validators';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'part-amount-adjustment-report',
  templateUrl: './part-amount-adjustment-report.component.html',
  styleUrls: ['./part-amount-adjustment-report.component.scss'],
})
export class PartAmountAdjustmentReportComponent extends AppComponentBase implements OnInit, AfterViewInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  form: FormGroup;
  modalHeight: number;


  dealerList: DealerModel[];
  // currentUser: CurrentUserModel = CurrentUser;

  constructor(
    injector: Injector,
    private setModalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
    private dealerApi: DealerApi,
    private loadingService: LoadingService,
    private serviceReportApi: ServiceReportApi,
    private downloadService: DownloadService,
    private el: ElementRef
  ) {
    super(injector);
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  getDealer() {
    this.loadingService.setDisplay(true);
    this.dealerApi.getAllAvailableDealers().subscribe(res => {
      this.loadingService.setDisplay(false);
      this.dealerList = res;
      this.buildForm();
    });
  }

  open() {
    this.getDealer();
    this.modal.show();
    setTimeout(() => {
      this.el.nativeElement.querySelector('.btn-blue').focus();
    }, 200);
  }

  reset() {
    this.form = undefined;
  }

  downloadFile() {
    if (this.form.invalid) {
      return;
    }
    const obj = this.form.getRawValue();
    this.loadingService.setDisplay(true);
    this.serviceReportApi.partAmountAdjustmentReport(obj).subscribe(res => {
      this.downloadService.downloadFile(res);
      this.loadingService.setDisplay(false);
    });
  }

  private buildForm() {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const date = new Date().getDate();
    this.form = this.formBuilder.group({
      dlrId: [{value: !this.currentUser.isAdmin ? this.currentUser.dealerId : undefined, disabled: !this.currentUser.isAdmin}, GlobalValidator.required],
      fromDate: [new Date(year, month, date, 0, 0, 0).getTime()],
      toDate: [new Date(year, month, date, 23, 59, 59).getTime()],
      extension: ['xls']
    });
  }
}
