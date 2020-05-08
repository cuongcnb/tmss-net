import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, Injector} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CurrentUserModel} from '../../../core/models/base.model';
import {DealerModel} from '../../../core/models/sales/dealer.model';
import {LoadingService} from '../../../shared/loading/loading.service';
import {ServiceReportApi} from '../../../api/service-report/service-report.api';
import {DownloadService} from '../../../shared/common-service/download.service';
import {DealerApi} from '../../../api/sales-api/dealer/dealer.api';
import {GlobalValidator} from '../../../shared/form-validation/validators';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'part-supply-rate-by-part-code-report',
  templateUrl: './part-supply-rate-by-part-code-report.component.html',
  styleUrls: ['./part-supply-rate-by-part-code-report.component.scss']
})
export class PartSupplyRateByPartCodeReportComponent extends AppComponentBase implements OnInit, AfterViewInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('btn', {static: false}) btn: ElementRef;
  form: FormGroup;
  modalHeight: number;

  // currentUser: CurrentUserModel = CurrentUser;
  dealerList: DealerModel[] = [];
  selectedDate;

  constructor(
    injector: Injector,
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private serviceReportApi: ServiceReportApi,
    private downloadService: DownloadService,
    private dealerApi: DealerApi
  ) {
    super(injector);
  }

  ngOnInit() {
  }
  ngAfterViewInit(): void {

  }
  open() {
    if (this.currentUser.isAdmin) {
      this.getDealers();
    }
    this.buildForm();
    this.fillMonthPicker();
    this.modal.show();
    setTimeout(() => {
      this.btn.nativeElement.focus();
    }, 200);
  }

  getDealers() {
    this.loadingService.setDisplay(true);
    this.dealerApi.getAllAvailableDealers().subscribe(res => {
      this.loadingService.setDisplay(false);
      this.dealerList = res;
    });
  }

  reset() {
    this.form = undefined;
  }

  private fillMonthPicker(selectedDate?) {
    this.selectedDate = selectedDate ? new Date(selectedDate) : new Date();
    this.form.patchValue({
      fromDate: new Date(new Date(this.selectedDate).getFullYear(), new Date(this.selectedDate).getMonth()).getTime()
    });
  }

  downloadFile() {
    if (this.form.invalid) {
      return;
    }
    const obj = this.form.getRawValue();
    this.loadingService.setDisplay(true);
    this.serviceReportApi.partSupplyRateByPartCodeReport(obj).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.downloadService.downloadFile(res);
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      dlrId: [{
        value: !this.currentUser.isAdmin ? this.currentUser.dealerId : undefined,
        disabled: !this.currentUser.isAdmin
      }, GlobalValidator.required],
      fromDate: [undefined], // month-picker
      extension: ['xls']
    });
  }
}
