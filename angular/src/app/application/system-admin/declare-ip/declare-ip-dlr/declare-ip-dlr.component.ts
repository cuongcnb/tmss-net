import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {DealerIpConfigApi} from '../../../../api/sales-api/dealer-ip-config/dealer-ip-config.api';
import {ToastService} from '../../../../shared/swal-alert/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'declare-ip-dlr',
  templateUrl: './declare-ip-dlr.component.html',
  styleUrls: ['./declare-ip-dlr.component.scss']
})
export class DeclareIpDlrComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  type;
  selectedDlr;
  selectedDlrIp;

  constructor(
    private formBuilder: FormBuilder,
    private dealerIpConfigApi: DealerIpConfigApi,
    private swalAlertService: ToastService
  ) {
  }

  ngOnInit() {
  }

  open(selectedDlr, selectedDlrIp?, type?) {
    this.selectedDlr = selectedDlr;
    this.type = type;
    this.selectedDlrIp = selectedDlrIp;
    this.buildForm();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    const obj = this.form.value;
    obj.isLog = (obj.isLog) ? 'Y' : 'N';
    obj.isDealerIp = (obj.isDealerIp) ? 'Y' : 'N';
    if (this.type === 'add') {
      this.dealerIpConfigApi.createNewDealerIp(obj).subscribe(res => {
        this.swalAlertService.openSuccessToast();
        this.modal.hide();
        this.close.emit();
      });
    } else {
      obj.id = this.selectedDlrIp.id;
      this.dealerIpConfigApi.updateDealerIp(obj).subscribe(res => {
        this.swalAlertService.openSuccessToast();
        this.modal.hide();
        this.close.emit();
      });
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      dealerId: [undefined],
      ipClass: [undefined, GlobalValidator.required],
      status: [undefined],
      ordering: [undefined],
      isLog: [false],
      isDealerIp: [false]
    });
    this.form.get('dealerId').setValue(this.selectedDlr ? this.selectedDlr.id : null);
    if (this.selectedDlrIp) {
      this.form.patchValue(this.selectedDlrIp);
      this.form.get('isLog').setValue(this.selectedDlrIp.isLog === 'Y');
      this.form.get('isDealerIp').setValue(this.selectedDlrIp.isDealerIp === 'Y');
    }
  }

}
