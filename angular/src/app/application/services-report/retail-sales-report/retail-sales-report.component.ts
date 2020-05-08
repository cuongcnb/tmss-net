import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Injector } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SetModalHeightService } from '../../../shared/common-service/set-modal-height.service';
import { DealerModel } from '../../../core/models/sales/dealer.model';
import { DownloadService } from '../../../shared/common-service/download.service';
import { ServiceReportApi } from '../../../api/service-report/service-report.api';
import { CurrentUserModel } from '../../../core/models/base.model';
import { LoadingService } from '../../../shared/loading/loading.service';
import { DealerApi } from '../../../api/sales-api/dealer/dealer.api';
import { GlobalValidator } from '../../../shared/form-validation/validators';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'retail-sales-report',
  templateUrl: './retail-sales-report.component.html',
  styleUrls: ['./retail-sales-report.component.scss']
})
export class RetailSalesReportComponent extends AppComponentBase implements OnInit, AfterViewInit {
  @ViewChild('reportTypeModal', {static: false}) reportTypeModal;
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  form: FormGroup;
  modalHeight: number;
  dealerList: DealerModel[];
  // currentUser: CurrentUserModel = CurrentUser;

  constructor(
    injector: Injector,
    private formBuilder: FormBuilder,
    private modalHeightService: SetModalHeightService,
    private loadingService: LoadingService,
    private dealerApi: DealerApi,
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
    if (this.form.invalid) {
      return;
    }

    const obj = this.form.getRawValue();

    this.loadingService.setDisplay(true);
    this.serviceReportApi.reportRetailShipping(obj).subscribe(res => {
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
      this.el.nativeElement.querySelector('.btn-blue').focus();
    }, 200);
  }

  private buildForm() {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const date = new Date().getDate();
    this.form = this.formBuilder.group({
      dlrId: [{
        value: !this.currentUser.isAdmin ? this.currentUser.dealerId : undefined,
        disabled: !this.currentUser.isAdmin,
      }, GlobalValidator.required],
      fromDate: [new Date(year, month, date, 0, 0, 0).getTime()],
      toDate: [new Date(year, month, date, 23, 59, 59).getTime()],
      partType: ['A'],
      groupBy: ['groupByCounterSale'],
      extension: ['xls']
    });
  }

  report() {
    if (this.form.invalid) {
      return;
    }
    this.reportTypeModal.open();
  }
}
