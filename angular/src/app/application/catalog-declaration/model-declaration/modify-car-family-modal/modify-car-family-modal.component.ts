import { Component, EventEmitter, OnInit, Output, ViewChild, Injector } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarFamilyModel } from '../../../../core/models/catalog-declaration/car-family.model';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { CarFamilyApi } from '../../../../api/common-api/car-family.api';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { CarFamilyTypes } from '../../../../core/constains/car-type';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'modify-car-family-modal',
  templateUrl: './modify-car-family-modal.component.html',
  styleUrls: ['./modify-car-family-modal.component.scss']
})
export class ModifyCarFamilyModalComponent extends AppComponentBase implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData: CarFamilyModel;
  form: FormGroup;
  modalHeight: number;
  carTypes = CarFamilyTypes;

  constructor(
    injector: Injector,
    private formBuilder: FormBuilder,
    private modalHeightService: SetModalHeightService,
    private loading: LoadingService,
    private swalAlert: ToastService,
    private carFamilyApi: CarFamilyApi,
  ) {
    super(injector);
  }

  ngOnInit() {
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.buildForm();
    this.onResize();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    const value = this.form.value;
    const apiCall = this.selectedData
      ? this.carFamilyApi.update(value)
      : this.carFamilyApi.create(value);

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
      cfCode: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(20), GlobalValidator.specialCharacter])],
      id: [undefined],
      status: ['Y'],
      dlrId: [this.currentUser.dealerId],
      cfName: [undefined, Validators.compose([GlobalValidator.maxLength(50), GlobalValidator.specialCharacter])],
      cfType: [this.carTypes[0].id],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }
}
