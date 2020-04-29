import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SetModalHeightService } from '../../../../../../shared/common-service/set-modal-height.service';
import { GlobalValidator } from '../../../../../../shared/form-validation/validators';
import { DataFormatService } from '../../../../../../shared/common-service/data-format.service';
import { ToastService } from '../../../../../../shared/swal-alert/toast.service';
import { RepairPlanApi } from '../../../../../../api/repair-plan/repair-plan.api';
import { LoadingService } from '../../../../../../shared/loading/loading.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'working-plan',
  templateUrl: './working-plan.component.html',
  styleUrls: ['./working-plan.component.scss']
})
export class WorkingPlanComponent {
  @ViewChild('modal', {static: false}) modal;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  @Input() advisors;
  form: FormGroup;
  modalHeight: number;
  selectedData;
  formValue;
  repairPlan;

  constructor(private formBuilder: FormBuilder,
              private setModalHeightService: SetModalHeightService,
              private swalAlertService: ToastService,
              private dataFormatService: DataFormatService,
              private repairPlanApi: RepairPlanApi,
              private loadingService: LoadingService) {
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  reset() {
    this.form = undefined;
  }

  open(formValue) {
    this.formValue = formValue;
    this.buildForm();
    this.getRepairPlan();
    this.modal.show();
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    if (this.form.getRawValue().dkgx < new Date().getTime()) {
      this.swalAlertService.openWarningToast('DKGX phải nhập khoảng thời gian trong tương lai');
      return;
    }
    const requestData = Object.assign({}, {
      roId: this.formValue.roId,
      id: this.repairPlan ? this.repairPlan.id : null,
      cardelivery: this.form.value.dkgx,
      repairbegin: this.form.value.openroDate,
      repairend: this.form.value.closeroDate,
      state: this.formValue.rostate,
    });

    const apiCall = this.repairPlan && this.repairPlan.id
      ? this.repairPlanApi.update(requestData)
      : this.repairPlanApi.create(requestData);

    this.loadingService.setDisplay(true);
    apiCall.subscribe(() => {
      this.loadingService.setDisplay(false);
      this.close.emit(this.form.getRawValue());
      this.modal.hide();
      this.swalAlertService.openSuccessToast();
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      cvdv: [{value: undefined, disabled: true}],
      roNo: [{value: undefined, disabled: true}],
      registerno: [{value: undefined, disabled: true}],
      cmName: [{value: undefined, disabled: true}],
      openroDate: [{value: undefined, disabled: true}],
      closeroDate: [{value: undefined, disabled: true}],
      dkgx: [undefined, GlobalValidator.required],
      status: [{value: 'Chờ sửa chữa', disabled: true}],
      isConfirmPlan: [{value: undefined, disabled: true}],
      khoang: [{value: undefined, disabled: true}],
      ktv: [{value: undefined, disabled: true}],
    });
    this.form.patchValue(this.formValue);
  }

  private getRepairPlan() {
    if (this.formValue.roId) {
      this.loadingService.setDisplay(true);
      this.repairPlanApi.repairOrderRoId(this.formValue.roId).subscribe(res => {
        this.loadingService.setDisplay(false);
        if (res && res.length) {
          this.repairPlan = res[0];
          this.form.get('dkgx').setValue(this.repairPlan.cardelivery);
          this.form.get('khoang').setValue(this.repairPlan.wsName);
        }
      });
    } else {
      this.repairPlan = null;
    }
  }
}
