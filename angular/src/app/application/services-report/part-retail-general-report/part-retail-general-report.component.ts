import { Component, OnInit, ViewChild, ElementRef, Injector } from '@angular/core';
import { CurrentUserModel } from '../../../core/models/base.model';
import { LoadingService } from '../../../shared/loading/loading.service';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalValidator } from '../../../shared/form-validation/validators';
import { DealerApi } from '../../../api/sales-api/dealer/dealer.api';
import { DealerModel } from '../../../core/models/sales/dealer.model';
import { DownloadService } from '../../../shared/common-service/download.service';
import { SetModalHeightService } from '../../../shared/common-service/set-modal-height.service';
import { ServiceReportApi } from '../../../api/service-report/service-report.api';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'part-retail-general-report',
  templateUrl: './part-retail-general-report.component.html',
  styleUrls: ['./part-retail-general-report.component.scss']
})
export class PartRetailGeneralReportComponent extends AppComponentBase implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  form: FormGroup;
  modalHeight: number;

  // currentUser: CurrentUserModel = CurrentUser;
  dealerList: DealerModel[] = [];

  constructor(
    injector: Injector,
    private setModalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private serviceReportApi: ServiceReportApi,
    private downloadService: DownloadService,
    private dealerApi: DealerApi,
    private el: ElementRef
  ) {
    super(injector);
  }

  ngOnInit() {
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  open() {
    this.getDealers();
    this.modal.show();
    setTimeout(() => {
      this.el.nativeElement.querySelector('.btn-blue').focus();
    }, 200);
  }

  getDealers() {
    this.loadingService.setDisplay(true);
    this.dealerApi.getAllAvailableDealers().subscribe(res => {
      this.loadingService.setDisplay(false);
      this.dealerList = res;
      this.buildForm();
    });
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
    this.serviceReportApi.csOverAll(obj).subscribe(res => {
      this.downloadService.downloadFile(res);
      this.loadingService.setDisplay(false);
    });
  }

  private buildForm() {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const date = new Date().getDate();
    this.form = this.formBuilder.group({
      dlrID: [{
        value: !this.currentUser.isAdmin ? this.currentUser.dealerId : undefined,
        disabled: !this.currentUser.isAdmin,
      }, GlobalValidator.required],
      fromDate: [new Date(year, month, date, 0, 0, 0).getTime()],
      toDate: [new Date(year, month, date, 23, 59, 59).getTime()],
      isQuotation: [false],
      extension: ['xls']
    });
  }
}
