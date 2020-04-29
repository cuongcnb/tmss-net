import { Component, ViewChild, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { QueuingApi } from '../../../../api/queuing-system/queuing.api';
import { DeskAdvisorApi } from '../../../../api/master-data/catalog-declaration/desk-advisor.api';
import { DeskAdvisorModel } from '../../../../core/models/catalog-declaration/desk-advisor.model';
import { DataFormatService } from '../../../../shared/common-service/data-format.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'advisor-desk-change',
  templateUrl: './advisor-desk-change.component.html',
  styleUrls: ['./advisor-desk-change.component.scss'],
})
export class AdvisorDeskChangeComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData;
  list: Array<DeskAdvisorModel>;
  form: FormGroup;
  modalHeight: number;


  constructor(
    private modalHeightService: SetModalHeightService,
    private dataFormatService: DataFormatService,
    private loadingService: LoadingService,
    private formBuilder: FormBuilder,
    private swalAlertService: ToastService,
    private queuingApi: QueuingApi,
    private deskAdvisorApi: DeskAdvisorApi,
  ) {
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  ngOnInit() {
    this.getDeskAdvisor();
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.onResize();
    this.modal.show();
    this.buildForm();
  }

  reset() {
    this.form = undefined;
    this.selectedData = undefined;
  }

  getDeskAdvisor() {
    this.deskAdvisorApi.getDeskByCurrentDealer(true).subscribe(list => this.list = list || []);
  }

  save() {
    const formValue = this.form.getRawValue();
    const value = Object.assign({}, this.selectedData, {
      advisorId: formValue.deskAdvisor.advisorId,
      deskId: formValue.deskAdvisor.id,
    });

    this.loadingService.setDisplay(true);
    this.queuingApi.update(value).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessToast();
      this.close.emit();
      this.modal.hide();
    });
  }

  private getCustomerType(val) {
    if (val.isAppointment === 'Y') {
      return 'Hẹn';
    }
    if (val.isWarranty === 'Y') {
      return 'Bảo hành';
    }
    if (val.isReRepair === 'Y') {
      return 'Sửa chữa lại';
    }
    if (val.is1K === 'Y') {
      return '1K';
    }
    return 'KHDV';
  }

  private getRepairRequest(val) {
    let result = '';
    if (val.isMa === 'Y') {
      result += 'BD';
    }
    if (val.isGj === 'Y') {
      result += result.length ? ' + GJ' : 'GJ';
    }
    if (val.isBp === 'Y') {
      result += result.length ? ' + BP' : 'BP';
    }
    return result;
  }

  private buildForm() {
    const value = this.selectedData || {};
    const deskAdvisor = this.list.find(item => item.advisorId === value.advisorId && item.id === value.deskId);

    this.form = this.formBuilder.group({
      id: [value.id],
      registerNo: [{value: value.registerNo, disabled: true}],
      inDate: [{value: this.dataFormatService.parseTimestampToFullDate(value.inDate), disabled: true}],
      customerType: [{value: this.getCustomerType(value), disabled: true}],
      repairRequest: [{value: this.getRepairRequest(value), disabled: true}],
      deskAdvisor: [deskAdvisor],
    });
  }

}
