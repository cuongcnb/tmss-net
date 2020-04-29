import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {ArrivalLeadtimeService} from '../../../../api/master-data/arrival-leadtime.service';
import {TransportTypeService} from '../../../../api/master-data/transport-type.service';
import {DealerListService} from '../../../../api/master-data/dealer-list.service';
import {ToastService} from '../../../../shared/common-service/toast.service';
import {ExchangeRateMaintenanceApi} from '../../../../api/warranty/exchange-rate-maintenance.api';
import {GlobalValidator} from '../../../../shared/form-validation/validators';

@Component({
  selector: 'update-sold-vehicle-maintenance-modal',
  templateUrl: './update-sold-vehicle-maintenance-modal.component.html',
  styleUrls: ['./update-sold-vehicle-maintenance-modal.component.scss']
})
export class UpdateSoldVehicleMaintenanceModalComponent implements OnInit {

  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  selectedData;
  @Input() currencyList;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private modalHeightService: SetModalHeightService,
    private arrivalLeadtimeService: ArrivalLeadtimeService,
    private transportTypeService: TransportTypeService,
    private dealerListService: DealerListService,
    private toastService: ToastService,
    private exchangeRateMaintenanceApi: ExchangeRateMaintenanceApi
  ) { }

  ngOnInit() {
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.buildForm();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
  }

  hide() {
    this.modal.hide();
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    // find currency name
    const value = {
      dlrId: -1.0,
      updatecount: 0,
      deleteflag: 'N',
      createdBy: this.selectedData && this.selectedData.createdBy ? this.selectedData.createdBy : -1,
      createDate: this.selectedData && this.selectedData.createDate ? this.selectedData.createDate : new Date(),
      modifyDate: new Date()
    };

    const exchangeRate = Object.assign({}, this.form.value, value, {id: this.selectedData
        ? this.selectedData.id : null});
    this.exchangeRateMaintenanceApi.saveExchangeRate(exchangeRate).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.toastService.openSuccessModal();
      this.close.emit();
      this.modal.hide();
    });
  }
  private buildForm() {
    const index = this.selectedData
      ? this.currencyList.findIndex(c => c.currencyCode === this.selectedData.currencycode)
      : -1;
    this.form = this.formBuilder.group({
      model: [this.selectedData ? this.selectedData.model : undefined, GlobalValidator.required],
      color: [this.selectedData ? this.selectedData.color : undefined, GlobalValidator.required],
      lineOffDate: [this.selectedData ? this.selectedData.lineOffDate : new Date(), GlobalValidator.required],
      saleDate: [this.selectedData ? this.selectedData.saleDate : new Date(), GlobalValidator.required],
    });
  }


}
