import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {ToastService} from '../../../../shared/common-service/toast.service';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {WarrCheckWmiApi} from '../../../../api/warranty/warr-check-wmi.api';

@Component({
  selector: 'update-warranty-check-wmi',
  templateUrl: './update-warranty-check-wmi-modal.component.html',
  styleUrls: ['./update-warranty-check-wmi-modal.component.scss']
})
export class UpdateWarrantyCheckWmiModalComponent implements OnInit {

  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  selectedData;
  constructor(
    private loadingService: LoadingService,
    private warrCheckWmiApi: WarrCheckWmiApi,
    private toastService: ToastService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.buildForm();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
  }

  hide() {
    this.modal.hide();
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    const data = this.form.value;
    this.warrCheckWmiApi.saveWarrCheckWmi(data).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.toastService.openSuccessModal();
      this.close.emit();
      this.modal.hide();
    });
  }
  private buildForm() {
    this.form = this.formBuilder.group({
      id: [this.selectedData ? this.selectedData.id : null],
      vds: [this.selectedData ? this.selectedData.vds : null, GlobalValidator.required],
      jobsCode: [this.selectedData ? this.selectedData.jobsCode : null, GlobalValidator.required],
      wmi: [this.selectedData ? this.selectedData.wmi : null, GlobalValidator.required],
      workRate: [this.selectedData ? this.selectedData.workRate : null, GlobalValidator.required]
    });
  }

}
