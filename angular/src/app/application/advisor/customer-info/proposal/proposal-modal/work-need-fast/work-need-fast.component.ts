import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SetModalHeightService} from '../../../../../../shared/common-service/set-modal-height.service';
import {RepairOrderApi} from '../../../../../../api/quotation/repair-order.api';
import {LoadingService} from '../../../../../../shared/loading/loading.service';
import {ToastService} from '../../../../../../shared/swal-alert/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'work-need-fast',
  templateUrl: './work-need-fast.component.html',
  styleUrls: ['./work-need-fast.component.scss']
})
export class WorkNeedFastComponent {
  @ViewChild('modal', {static: false}) modal;
  form: FormGroup;
  modalHeight: number;
  selectedData;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  data;

  constructor(private formBuilder: FormBuilder,
              private setModalHeightService: SetModalHeightService,
              private repairOrderApi: RepairOrderApi,
              private loadingService: LoadingService,
              private swalAlertService: ToastService) {
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  reset() {
    this.form = undefined;
  }

  open(data) {
    this.getWorkSoon(data.roId);
    this.data = data;
    this.buildForm();
    this.modal.show();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      notes: [undefined],
      id: [{value: undefined, disabled: true}],
      roId: [undefined]
    });
    this.form.patchValue(this.data);
  }

  addNotes() {
    this.loadingService.setDisplay(true);
    this.repairOrderApi.addWorkSoon(this.form.getRawValue()).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessToast();
      this.modal.hide();
    });
  }

  getWorkSoon(roId) {
    this.repairOrderApi.getWorkSoon(roId).subscribe(res => {
      this.form.patchValue({
        notes: res ? res.notes : ''
      });
    });
  }
}
