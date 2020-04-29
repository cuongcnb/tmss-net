import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { WarrantyTimeSheetModel } from '../../../../core/models/warranty/warranty-time-sheet.model';
import { WarrantyTimeSheetApi } from '../../../../api/master-data/warranty/warranty-time-sheet.api';
import { DealerApi } from '../../../../api/sales-api/dealer/dealer.api';
import { DealerModel } from '../../../../core/models/sales/dealer.model';
import { GlobalValidator } from '../../../../shared/form-validation/validators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'modify-warranty-time-sheet',
  templateUrl: './modify-warranty-time-sheet.component.html',
  styleUrls: ['./modify-warranty-time-sheet.component.scss']
})
export class ModifyWarrantyTimeSheetComponent {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData: WarrantyTimeSheetModel;
  form: FormGroup;
  modalHeight: number;
  dealers: DealerModel;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private toast: ToastrService,
    private modalHeightService: SetModalHeightService,
    private warrantyTimeSheetApi: WarrantyTimeSheetApi,
    private dealerApi: DealerApi,
  ) {
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.onResize();
    this.getDealers();
    this.buildForm();
    this.modal.show();
  }

  hide() {
    this.modal.hide();
  }

  reset() {
    this.form = undefined;
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    const apiCall = !this.selectedData ?
      this.warrantyTimeSheetApi.create(this.form.value) : this.warrantyTimeSheetApi.update(this.form.value);

    this.loadingService.setDisplay(true);
    apiCall.subscribe(() => {
      this.close.emit();
      this.modal.hide();
      this.loadingService.setDisplay(false);
      this.toast.success('Thực hiện thành công', 'Thành công');
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      dealercode: [undefined, GlobalValidator.required],
      laborRate: [undefined, [GlobalValidator.required, GlobalValidator.floatNumberFormat, GlobalValidator.maxLength(53)]],
      descvn: [undefined, GlobalValidator.maxLength(100)],
      pwrdlr: [undefined, [GlobalValidator.floatNumberFormat, GlobalValidator.maxLength(53)]],
      prr: [undefined, [GlobalValidator.floatNumberFormat, GlobalValidator.maxLength(53)]],
      freePm: [undefined, [GlobalValidator.floatNumberFormat, GlobalValidator.maxLength(53)]],
      id: [undefined],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }

  private getDealers() {
    this.loadingService.setDisplay(true);
    this.dealerApi.getAllAvailableDealers().subscribe(dlrs => {
      this.dealers = dlrs || [];
      this.loadingService.setDisplay(false);
    });
  }
}
