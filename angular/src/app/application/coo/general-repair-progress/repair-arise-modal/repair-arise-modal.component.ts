import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

import {ToastService} from '../../../../shared/swal-alert/toast.service';
import {PendingReasonApi} from '../../../../api/pending-reason/pending-reason.api';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {EmployeeCommonApi} from '../../../../api/common-api/employee-common.api';
import {VehicleHistoryApi} from '../../../../api/vehicle-history/vehicle-history.api';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {TechWshopApi} from '../../../../api/tech-wshop/tech-wshop.api';
import { RoType } from '../../../../core/constains/progress-state';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'repair-arise-modal',
  templateUrl: './repair-arise-modal.component.html',
  styleUrls: ['./repair-arise-modal.component.scss']
})
export class RepairAriseModalComponent {
  @Output() choose = new EventEmitter();
  @ViewChild('modal', {static: false}) modal;
  form: FormGroup;
  modalHeight: number;
  reasons: Array<any> = [];
  dsEmp;

  constructor(
    private pendingReasonApi: PendingReasonApi,
    private formBuilder: FormBuilder,
    private swalAlertService: ToastService,
    private setModalHeight: SetModalHeightService,
    private empApi: EmployeeCommonApi,
    private vehicleHistoryApi: VehicleHistoryApi,
    private loadingService: LoadingService,
    private techWshopApi: TechWshopApi
  ) {
  }

  open(dataPlan, wshopId) {
    this.buildForm(dataPlan, wshopId);
    // this.getHistoryRepairArise(dataPlan)
    this.getTechByWshopId(wshopId, RoType.SCC);
    this.modal.show();
  }

  onResize() {
    this.modalHeight = this.setModalHeight.onResize();
  }

  private buildForm(dataPlan, wshopId) {
    this.form = this.formBuilder.group({
      wshopId: [undefined],
      roId: [undefined],
      empId: [undefined],
      reasoncontent: [undefined],
      ctdate: [new Date()],
      extDuration: [undefined],
      registerno: [{value: null, disabled: true}],
      repairorderno: [{value: null, disabled: true}]

    });
    this.form.patchValue(dataPlan);
    if (wshopId) {
      this.form.patchValue({
        wshopId
      });
    }
  }

  close() {
    this.modal.hide();
    this.reasons = [];
  }

  getTechByWshopId(id, roType) {
    if (id) {
      this.techWshopApi.getTechByWshopId(id, roType).subscribe(emps => {
        if (emps && emps.length) {
          this.dsEmp = emps;
          this.form.patchValue({empId: emps ? emps[0].empId : null});
        }
      });
    }
  }

  accept() {
    const data = this.form.value;
    const obj = {
      roId: data.roId,
      wshopId: data.wshopId,
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

  getHistoryRepairArise(dataPlan) {
    this.vehicleHistoryApi.getUnexpectJob(dataPlan.roId).subscribe(res => {
      if (res.length > 0) {
        this.form.patchValue(res[res.length - 1])
      }
    })
  }
}
