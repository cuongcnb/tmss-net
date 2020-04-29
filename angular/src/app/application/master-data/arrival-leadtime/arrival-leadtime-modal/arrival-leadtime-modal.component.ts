import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ArrivalLeadtimeService} from '../../../../api/master-data/arrival-leadtime.service';
import {TransportTypeService} from '../../../../api/master-data/transport-type.service';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {DealerListService} from '../../../../api/master-data/dealer-list.service';
import {LookupService} from '../../../../api/lookup/lookup.service';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'arrival-leadtime-modal',
  templateUrl: './arrival-leadtime-modal.component.html',
  styleUrls: ['./arrival-leadtime-modal.component.scss']
})
export class ArrivalLeadtimeModalComponent {
  @ViewChild('arrivalLeadtimeModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  dealerList;
  selectedData;
  form: FormGroup;
  transportTypeList;
  modalHeight: number;
  transportFormList;

  constructor(
              private formBuilder: FormBuilder,
              private loadingService: LoadingService,
              private modalHeightService: SetModalHeightService,
              private arrivalLeadtimeService: ArrivalLeadtimeService,
              private transportTypeService: TransportTypeService,
              private swalAlertService: ToastService,
              private dealerListService: DealerListService,
              private lookupService: LookupService) {
  }

  private getTransportType() {
    this.loadingService.setDisplay(true);
    this.transportTypeService.getTransportTypeAvailable().subscribe(transportType => {
      this.transportTypeList = transportType;
      this.lookupService.getDataByCode('transport_from').subscribe(transportFormList => {
        this.transportFormList = transportFormList;
        this.loadingService.setDisplay(false);
      });

    });

  }

  private getDealerList() {
    this.loadingService.setDisplay(true);
    this.dealerListService.getAvailableDealers().subscribe(dealerList => {
      this.dealerList = dealerList;
      this.loadingService.setDisplay(false);
    });
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(selectedData ?) {
    this.selectedData = selectedData;
    this.onResize();
    this.getDealerList();
    this.getTransportType();
    this.buildForm();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
  }

  save() {
    const fromDealerId = this.form.value.fromDealerId;
    const toDealerId = this.form.value.toDealerId;
    if (this.form.invalid) {
      return;
    } else if (fromDealerId === toDealerId) {
      this.swalAlertService.openWarningForceSelectData(
        'You have selected the same Dealer in "From Dealer" and "To Dealer". Please choose different ones before Save',
        'Same Dealer is selected'
      );
      return;
    } else {
      const apiCall = !this.selectedData
        ? this.arrivalLeadtimeService.createArrivalLeadtime(this.form.value)
        : this.arrivalLeadtimeService.updateArrivalLeadtime(this.form.value);

      this.loadingService.setDisplay(true);
      apiCall.subscribe(() => {
        this.close.emit();
        this.modal.hide();
        this.loadingService.setDisplay(false);
        this.swalAlertService.openSuccessModal();
      });
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: [undefined],
      dealerFrom: [undefined, GlobalValidator.required],
      toDealerId: [undefined, GlobalValidator.required],
      transportationTypesId: [undefined, GlobalValidator.required],
      dayAmount: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.numberFormatAcceptZero, GlobalValidator.maxLength(4)])],
      timeAmount: [undefined, Validators.compose([GlobalValidator.floatNumberFormat, GlobalValidator.maxLength(4)])],
      fromExceptionAmount: [undefined, Validators.compose([GlobalValidator.floatNumberFormat, GlobalValidator.maxLength(4)])],
      toExceptionAmount: [undefined, Validators.compose([GlobalValidator.floatNumberFormat, GlobalValidator.maxLength(4)])],
      status: ['Y']
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }
}
