import {Component, OnInit, ViewChild, Injector} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap';
import {SetModalHeightService} from '../../../shared/common-service/set-modal-height.service';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {CasOutGateApi} from '../../../api/dlr-cashier/cas-out-gate.api';
import {LoadingService} from '../../../shared/loading/loading.service';
import {DownloadService} from '../../../shared/common-service/download.service';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'in-out-gate-report',
  templateUrl: './in-out-gate-report.component.html',
  styleUrls: ['./in-out-gate-report.component.scss']
})
export class InOutGateReportComponent extends AppComponentBase implements OnInit {
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
    private casOutGateApi: CasOutGateApi
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
    this.casOutGateApi.printReportOutGate(obj).subscribe(res => {
      this.loading.setDisplay(false);
      this.downloadService.downloadFile(res);
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      dealerId: [{value: this.currentUser.dealerId, disabled: true}],
      fromDate: [this.dataFormatService.formatDate(new Date())],
      toDate: [this.dataFormatService.formatDate(new Date())],
      extension: ['doc']
    });
  }
}
