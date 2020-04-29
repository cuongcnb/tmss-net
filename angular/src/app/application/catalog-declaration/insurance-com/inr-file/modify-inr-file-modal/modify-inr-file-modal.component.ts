import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { InsuranceFileModel } from '../../../../../core/models/catalog-declaration/insurance-file.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { SetModalHeightService } from '../../../../../shared/common-service/set-modal-height.service';
import { GlobalValidator } from '../../../../../shared/form-validation/validators';
import { InsuranceDoctypeApi } from '../../../../../api/common-api/insurance-doctype.api';
import { LoadingService } from '../../../../../shared/loading/loading.service';
import { ToastService } from '../../../../../shared/swal-alert/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'modify-inr-file-modal',
  templateUrl: './modify-inr-file-modal.component.html',
  styleUrls: ['./modify-inr-file-modal.component.scss'],
})
export class ModifyInrFileModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData: InsuranceFileModel;
  form: FormGroup;
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private modalHeightService: SetModalHeightService,
    private insuranceDocApi: InsuranceDoctypeApi,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
  ) {
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(selectData?) {
    this.selectedData = selectData;
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

    const apiCall = this.selectedData
      ? this.insuranceDocApi.update(this.form.value)
      : this.insuranceDocApi.create(this.form.value);

    this.loadingService.setDisplay(true);
    apiCall.subscribe(() => {
      this.close.emit();
      this.modal.hide();
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessToast();
    });

    this.close.emit();
    this.modal.hide();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      doctypeCode: [undefined, GlobalValidator.required],
      doctypeName: [undefined],
      id: [undefined],
      daleteflag: [undefined],
      dlrId: [undefined],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }
}
