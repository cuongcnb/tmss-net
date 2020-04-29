import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { PendingReasonApi } from '../../../../api/pending-reason/pending-reason.api';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { EmployeeCommonApi } from '../../../../api/common-api/employee-common.api';
import { VehicleHistoryApi } from '../../../../api/vehicle-history/vehicle-history.api';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { TechWshopApi } from '../../../../api/tech-wshop/tech-wshop.api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'job-arise-modal',
  templateUrl: './job-arise-modal.component.html',
  styleUrls: ['./job-arise-modal.component.scss']
})
export class JobAriseModalComponent {
  @Output() choose = new EventEmitter();
  @ViewChild('modal', {static: false}) modal;
  form: FormGroup;
  modalHeight: number;
  reasons: Array<any> = [];
  dsEmp;
  emp;

  constructor(
    private pendingReasonApi: PendingReasonApi,
    private formBuilder: FormBuilder,
    private swalAlertService: ToastService,
    private setModalHeight: SetModalHeightService,
    private empApi: EmployeeCommonApi,
    private vehicleHistoryApi: VehicleHistoryApi,
    private loadingService: LoadingService,
    private techWshopApi: TechWshopApi) {
  }

  open(dataPlan) {
    console.log(dataPlan)
    this.buildForm(dataPlan);
    this.getEmpByRoId(dataPlan.wpId);
    this.modal.show();
  }

  onResize() {
    this.modalHeight = this.setModalHeight.onResize();
  }


  private buildForm(dataPlan) {
    this.form = this.formBuilder.group({
      roId: [undefined],
      empId: [undefined],
      reasoncontent: [undefined],
      ctdate: [new Date()],
      extDuration: [undefined],


      registerno: [{value: null, disabled: true}],
      repairorderno: [{value: null, disabled: true}],

    });
    this.form.patchValue(dataPlan);
  }

  close() {
    this.modal.hide();
    this.reasons = [];

  }

  accept() {
    const data = this.form.value;
    const obj = {
      roId: data.roId,
      reasoncontent: data.reasoncontent,
      ctdate: new Date(data.ctdate).getTime(),
      empId: Number(data.empId),
      extDuration: Number(data.extDuration)
    };
    this.loadingService.setDisplay(true);
    this.vehicleHistoryApi.add(obj).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessToast();
      this.modal.hide();
    });
  }

  getEmpByRoId(wpId) {
    this.techWshopApi.getEmpByWpId(wpId).subscribe(res => {
      this.dsEmp = res;
      this.form.patchValue({
        empId: res ? res[0].id : null
    });
    });
  }
}
