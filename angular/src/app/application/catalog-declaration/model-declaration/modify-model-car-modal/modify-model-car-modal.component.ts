import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { ModalDirective } from 'ngx-bootstrap';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { ModelCarModel } from '../../../../core/models/catalog-declaration/model-car.model';
import { CarModelApi } from '../../../../api/common-api/car-model.api';
import { CarFamilyModel } from '../../../../core/models/catalog-declaration/car-family.model';
import { DataFormatService } from '../../../../shared/common-service/data-format.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'modify-model-car-modal',
  templateUrl: './modify-model-car-modal.component.html',
  styleUrls: ['./modify-model-car-modal.component.scss']
})
export class ModifyModelCarModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData: ModelCarModel;
  form: FormGroup;
  modalHeight: number;
  carFamily: CarFamilyModel;

  constructor(
    private formBuilder: FormBuilder,
    private dataFormatService: DataFormatService,
    private modalHeightService: SetModalHeightService,
    private loading: LoadingService,
    private swalAlert: ToastService,
    private carModelApi: CarModelApi,
  ) {
  }

  ngOnInit() {
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(carFamily, selectedData?) {
    this.carFamily = carFamily;
    this.selectedData = selectedData;
    this.buildForm();
    this.onResize();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
    this.selectedData = undefined;
    this.carFamily = undefined;
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    const value = Object.assign({}, this.form.value, {
      cmYear: this.form.value.cmYear ? this.dataFormatService.formatDate(new Date(this.form.value.cmYear.toString())) : '',
      cmType: this.carFamily.cfType,
    });
    const apiCall = this.selectedData
      ? this.carModelApi.update(value)
      : this.carModelApi.create(value);

    this.loading.setDisplay(true);
    apiCall.subscribe(() => {
      this.close.emit();
      this.modal.hide();
      this.loading.setDisplay(false);
      this.swalAlert.openSuccessToast();
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      cmCode: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(20), GlobalValidator.specialCharacter])],
      id: [undefined],
      status: ['Y'],
      cfId: [this.carFamily.id],
      cmName: [undefined, Validators.compose([GlobalValidator.maxLength(50), GlobalValidator.specialCharacter])],
      doixe: [undefined, [GlobalValidator.required, GlobalValidator.maxLength(50)]],
      cmYear: [undefined, Validators.compose([GlobalValidator.maxLength(4), GlobalValidator.numberFormat, Validators.min(1760)])],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
      this.form.patchValue({cmYear: this.dataFormatService.parseTimestampToYear(this.selectedData.cmYear)});
    }
  }
}
