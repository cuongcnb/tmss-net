import {Component, Input, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoadingService} from '../../../shared/loading/loading.service';
import {FormStoringService} from '../../../shared/common-service/form-storing.service';
import {StorageKeys} from '../../../core/constains/storageKeys';
import {DealerListService} from '../../../api/master-data/dealer-list.service';
import {ReportService} from '../../../api/dlr-master-data/report-service.service';
import {GlobalValidator} from '../../../shared/form-validation/validators';
import {ToastService} from '../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dlr-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @Input() reportFunction;
  form: FormGroup;
  dealerList;
  currentUser;
  currentDealer;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private formStoringService: FormStoringService,
    private dealerListService: DealerListService,
    private reportService: ReportService
  ) {
    this.currentUser = this.formStoringService.get(StorageKeys.currentUser);
  }

  getGradeList() {
    this.loadingService.setDisplay(true);
    this.dealerListService.getDealers().subscribe(dealerList => {
      this.dealerList = dealerList;
      this.currentDealer = this.dealerList.find(dealer => dealer.id === this.currentUser.dealerId);
      this.loadingService.setDisplay(false);
    });
  }

  open() {
    if (this.reportFunction.indexOf('Date') >= 0) {
      this.getGradeList();
    }
    this.buildForm();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
  }

  submit() {
    if (this.form.invalid) {
      return;
    } else if (new Date(this.form.value.toDate) < new Date(this.form.value.fromDate)) {
      this.swalAlertService.openFailModal('To date must be greater than from date');
      return;
    }

    let apiCall;
    if (this.reportFunction.indexOf('SpecialCases') >= 0) {
      apiCall = this.reportService.specialCase(this.form.value);
    } else if (this.reportFunction.indexOf('WrongDeliveryDate') >= 0) {
      apiCall = this.reportService.vehicleDiffDelivery(this.form.value);
    } else {
      apiCall = this.reportService.vehicleNoDelivery(this.form.value);
    }

    apiCall.subscribe((data) => {
      this.downloadFile(data);
    });
  }

  downloadFile(data) {
    const fileName = data.headers.get('content-disposition').replace('attachment;filename=', '');
    const link = document.createElement('a');
    const url = URL.createObjectURL(data.body);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      dealerId: [{
        value: this.currentDealer ? this.currentDealer.id : undefined,
        disabled: this.reportFunction.indexOf('Date') < 0
      }, GlobalValidator.required],
      fromDate: [undefined, GlobalValidator.required],
      toDate: [undefined, GlobalValidator.required],
    });
  }

}
