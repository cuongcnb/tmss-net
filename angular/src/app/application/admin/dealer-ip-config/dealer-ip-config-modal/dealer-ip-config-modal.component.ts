import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DealerIpConfigService} from '../../../../api/master-data/dealer-ip-config.service';
import {DealerListService} from '../../../../api/master-data/dealer-list.service';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {ToastService} from '../../../../shared/common-service/toast.service';
import {DealerIpConfigModel} from '../../../../core/models/sales/dealer-ip-config.model';

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
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private modalHeightService: SetModalHeightService,
    private swalAlertService: ToastService,
    private dealerListService: DealerListService,
    private dealerIpConfigService: DealerIpConfigService,
  ) {
    this.dealerGridField = [
      {
        field: 'code'
      },
      {
        field: 'abbreviation'
      },
      {
        field: 'vnName'
      },
      {
        field: 'enName'
      },
      {
        field: 'province'
      },
    ];
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  getDealers(params) {
    params.api.setRowData();
    this.loadingService.setDisplay(true);
    this.dealerListService.getAvailableDealers()
      .subscribe(dealers => {
        params.api.setRowData(dealers);
        this.loadingService.setDisplay(false);
      });
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.buildForm();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
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
      this.swalAlertService.openSuccessModal();
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
