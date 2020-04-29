import { Component, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LoadingService } from '../../../../../../shared/loading/loading.service';
import { RepairOrderApi } from '../../../../../../api/quotation/repair-order.api';
import { ToastService } from '../../../../../../shared/swal-alert/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'storage-modal',
  templateUrl: './storage-modal.component.html',
  styleUrls: ['./storage-modal.component.scss'],
})
export class StorageModalComponent {
  @ViewChild('modal', {static: false}) modal;
  @Input() form: FormGroup;
  modalHeight: number;
  reasons: Array<any> = [];
  content;

  constructor(
    private loadingService: LoadingService,
    private repairOrderApi: RepairOrderApi,
    private swalAlertService: ToastService,
  ) {
  }

  open() {
    // this.content = null;
    this.modal.show();
  }

  onResize() {
  }

  confirm() {
    this.loadingService.setDisplay(true);
    this.repairOrderApi.createQuotationVersion((this.content) ? this.content : '', this.form.getRawValue().roId).subscribe(() => {
      this.swalAlertService.openSuccessToast('Lưu trữ báo giá thành công');
      this.loadingService.setDisplay(false);
      this.modal.hide();
    });
  }

  close() {
    this.modal.hide();
    this.reasons = [];

  }

}
