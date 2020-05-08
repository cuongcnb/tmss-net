import {Component, OnInit, ViewChild, Injector} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {SetModalHeightService} from '../../../shared/common-service/set-modal-height.service';
import {LoadingService} from '../../../shared/loading/loading.service';
import {DownloadService} from '../../../shared/common-service/download.service';
import {ModalDirective} from 'ngx-bootstrap';
import {ServiceReportApi} from '../../../api/service-report/service-report.api';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'warranty-daily-claim-report',
  templateUrl: './warranty-daily-claim-report.component.html',
  styleUrls: ['./waranty-daily-claim-report.component.scss']
})
export class WarrantyDailyClaimReportComponent extends AppComponentBase implements OnInit {

  @ViewChild('modal', {static: false}) modal: ModalDirective;
  form: FormGroup;
  modalHeight: number;
  // currentUser = CurrentUser;

  constructor(
    injector: Injector,
    private formBuilder: FormBuilder,
    private dataFormatService: DataFormatService,
    private swalAlert: ToastService,
    private setModalHeight: SetModalHeightService,
    private loading: LoadingService,
    private downloadService: DownloadService,
    private reportApi: ServiceReportApi
  ) {
    super(injector);
   }

  ngOnInit() {

  }

  onResize() {
    this.modalHeight = this.setModalHeight.onResize();
  }

  open() {
    this.buildForm();
    this.onResize();
    this.modal.show();
  }

  exportXls() {
    if (this.form.invalid) { return; }
    if (this.form.value.fromDate > this.form.value.toDate) {
      this.swalAlert.openWarningToast('Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc');
      return;
    }
    const obj = this.form.value;
    this.loading.setDisplay(true);
    this.reportApi.dailyClaimReport(obj).subscribe(res => {
      this.loading.setDisplay(false);
      this.downloadService.downloadFile(res);
    });
  }

  private buildForm() {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const date = new Date().getDate();
    this.form = this.formBuilder.group({
      fromDate: [new Date(year, month, date, 0, 0, 0).getTime()],
      toDate: [new Date(year, month, date, 23, 59, 59).getTime()],
      extension: ['xls']
    });
  }
}
