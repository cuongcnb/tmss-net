import { Component, OnInit, ViewChild, ElementRef, Injector } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetModalHeightService } from '../../../shared/common-service/set-modal-height.service';
import { GlobalValidator } from '../../../shared/form-validation/validators';
import { CurrentUserModel } from '../../../core/models/base.model';
import { ServiceReportApi } from '../../../api/service-report/service-report.api';
import { DownloadService } from '../../../shared/common-service/download.service';
import { LoadingService } from '../../../shared/loading/loading.service';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'service-rate-and-ro-fill-report',
  templateUrl: './service-rate-and-ro-fill-report.component.html',
  styleUrls: ['./service-rate-and-ro-fill-report.component.scss']
})
export class ServiceRateAndRoFillReportComponent extends AppComponentBase implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  modalHeight: number;
  form: FormGroup;
  tabs: Array<any>;
  selectedTab: string;
  // currentUser: CurrentUserModel = CurrentUser;
  selectedDate: Date;

  constructor(
    injector: Injector,
    private formBuilder: FormBuilder,
    private setModalHeightService: SetModalHeightService,
    private serviceReportApi: ServiceReportApi,
    private downloadService: DownloadService,
    private loadingService: LoadingService,
    private el: ElementRef
  ) {
    super(injector);
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  ngOnInit() {
    this.initTabs();
  }

  open() {
    this.onResize();
    this.buildForm();
    this.modal.show();
    this.selectedTab = this.tabs[0].tab;
    setTimeout(() => {
      this.el.nativeElement.querySelector('.btn-blue').focus();
    }, 200);
  }

  downloadFile() {
    if (this.form.invalid) {
      return;
    }
    const obj = Object.assign({}, this.form.getRawValue(), {
      year: new Date(new Date(this.form.getRawValue().year).getFullYear(), 1, 1).getTime(),
      isMonth: this.selectedTab === 'month',
      date: this.selectedTab === 'month'
        ? this.form.getRawValue().month
        : new Date(new Date(this.form.getRawValue().year).getFullYear(), 1, 1).getTime()
    });

    this.loadingService.setDisplay(true);
    this.serviceReportApi.reportServiceRate(obj).subscribe(res => {
      this.downloadService.downloadFile(res);
      this.loadingService.setDisplay(false);
    });
  }

  changeSelectedTab(item) {
    this.selectedTab = item;
    this.form.patchValue({year: new Date().getTime(), month: new Date().getTime()});
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      dlrId: [{
        value: !this.currentUser.isAdmin ? this.currentUser.dealerId : undefined,
        disabled: !this.currentUser.isAdmin,
      }, GlobalValidator.required],
      year: [new Date().getTime()],
      month: [new Date().getTime()],
      extension: ['xls']
    });
  }

  private initTabs() {
    this.tabs = [
      {name: 'Theo năm', tab: 'year'},
      {name: 'Theo tháng', tab: 'month'},
    ];
  }
}
