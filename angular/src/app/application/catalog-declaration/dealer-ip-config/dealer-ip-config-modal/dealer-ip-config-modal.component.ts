import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';

import { LoadingService } from '../../../../shared/loading/loading.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { DealerIpConfigModel } from '../../../../core/models/sales/dealer-ip-config.model';
import { DealerApi } from '../../../../api/sales-api/dealer/dealer.api';
import { DealerIpConfigApi } from '../../../../api/sales-api/dealer-ip-config/dealer-ip-config.api';
import { DealerModel } from '../../../../core/models/sales/dealer.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dealer-ip-config-modal',
  templateUrl: './dealer-ip-config-modal.component.html',
  styleUrls: ['./dealer-ip-config-modal.component.scss']
})
export class DealerIpConfigModalComponent {
  @ViewChild('dealerIpConfigModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData: DealerIpConfigModel;
  form: FormGroup;
  dealerGridField;
  dealerList: Array<DealerModel>;
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private modalHeightService: SetModalHeightService,
    private swalAlertService: ToastService,
    private dealerApi: DealerApi,
    private dealerIpConfigService: DealerIpConfigApi,
  ) {
    this.dealerGridField = [
      {field: 'code'},
      {field: 'abbreviation'},
      {field: 'vnName'},
      {field: 'enName'},
      {field: 'province'},
    ];
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  getDealers() {
    this.loadingService.setDisplay(true);
    this.dealerApi.getAllAvailableDealers()
      .subscribe(dealers => {
        this.dealerList = dealers;
        this.loadingService.setDisplay(false);
      });
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.buildForm();
    this.getDealers();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
    this.dealerList = undefined;
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    const value = Object.assign({}, this.form.value, {
      dealerId: this.form.value.dealer ? this.form.value.dealer.id : this.selectedData.dealerId
    });
    const apiCall = this.selectedData
      ? this.dealerIpConfigService.updateDealerIp(value)
      : this.dealerIpConfigService.createNewDealerIp(value);

    this.loadingService.setDisplay(true);
    apiCall.subscribe(() => {
      this.close.emit(value.dealerId);
      this.modal.hide();
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessToast();
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: [undefined],
      dealer: [undefined, GlobalValidator.required],
      dealerId: [undefined],
      ipClass: [undefined, GlobalValidator.maxLength(50)],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
      this.form.patchValue({
        dealer: {
          id: this.selectedData.dealerId,
          abbreviation: this.selectedData.abbreviation,
        },
      });
    }
  }
}
