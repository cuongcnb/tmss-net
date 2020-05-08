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
  selector: 'ro-unfinished-report',
  templateUrl: './ro-unfinished-report.component.html',
  styleUrls: ['./ro-unfinished-report.component.scss']
})
export class RoUnfinishedReportComponent extends AppComponentBase implements OnInit {

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
    const obj = Object.assign({}, this.form.getRawValue(), {
      option: this.form.getRawValue().option ? 1 : 0
    });
    this.loadingService.setDisplay(true);
    this.serviceReportApi.reportRoUnfinished(obj).subscribe(res => {
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
    this.form = this.formBuilder.group({
      dlrId: [{
        value: !this.currentUser.isAdmin ? this.currentUser.dealerId : undefined,
        disabled: !this.currentUser.isAdmin,
      }, GlobalValidator.required],
      option: [undefined],
      extension: ['xls']
    });
  }
}

