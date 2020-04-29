import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CurrentUser} from '../../../home/home.component';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {SetModalHeightService} from '../../../shared/common-service/set-modal-height.service';
import {LoadingService} from '../../../shared/loading/loading.service';
import {DownloadService} from '../../../shared/common-service/download.service';
import {ServiceReportApi} from '../../../api/service-report/service-report.api';

@Component({
  selector: 'user-list-function-report',
  templateUrl: './user-list-function.component.html',
  styleUrls: ['./user-list-function.component.scss']
})
export class UserListFunctionComponent implements OnInit {

  @ViewChild('modal', {static: false}) modal: ModalDirective;
  form: FormGroup;
  modalHeight: number;
  currentUser = CurrentUser;

  constructor(
    private formBuilder: FormBuilder,
    private dataFormatService: DataFormatService,
    private swalAlert: ToastService,
    private setModalHeight: SetModalHeightService,
    private loading: LoadingService,
    private downloadService: DownloadService,
    private reportApi: ServiceReportApi
  ) { }

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
    if (this.form.value.typeUser === null || !this.form.value.typeUser) {
      this.swalAlert.openWarningToast('Bạn chưa chọn trạng thái người dùng');
      return;
    }
    const obj = this.form.value;
    this.loading.setDisplay(true);
    this.reportApi.userListFunction(obj).subscribe(res => {
      this.loading.setDisplay(false);
      this.downloadService.downloadFile(res);
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      typeUser: [null],
      extension: ['xls']
    });
  }

}
