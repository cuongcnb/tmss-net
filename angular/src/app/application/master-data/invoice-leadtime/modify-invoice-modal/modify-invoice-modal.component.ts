import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InvoiceLeadTimeService} from '../../../../api/master-data/invoice-lead-time.service';
import { DealerListService} from '../../../../api/master-data/dealer-list.service';
import { TransportTypeService} from '../../../../api/master-data/transport-type.service';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { LookupService} from '../../../../api/lookup/lookup.service';
import { LookupCodes } from '../../../../core/constains/lookup-codes';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'modify-invoice-modal',
  templateUrl: './modify-invoice-modal.component.html',
  styleUrls: ['./modify-invoice-modal.component.scss']
})
export class ModifyInvoiceModalComponent {
  @ViewChild('modifyInvoiceModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedInvoice;
  form: FormGroup;
  regions;
  dealers;
  departure;
  transportTypes;
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private modalHeightService: SetModalHeightService,
    private invoiceLeadtimeService: InvoiceLeadTimeService,
    private dealerService: DealerListService,
    private swalAlertService: ToastService,
    private transportTypeService: TransportTypeService,
    private lookupService: LookupService
  ) {
  }

  private getDealers() {
    this.loadingService.setDisplay(true);
    this.dealerService.getAvailableDealers().subscribe(dealers => {
      this.departure = dealers.filter(dealer => dealer.abbreviation === 'TMV' || dealer.abbreviation === 'TSC');
      this.dealers = dealers;
      this.loadingService.setDisplay(false);
    });
  }

  private getRegions() {
    this.loadingService.setDisplay(true);
    this.lookupService.getDataByCode(LookupCodes.regions).subscribe(regions => {
      this.regions = regions;
      this.loadingService.setDisplay(false);
    });
  }

  private getTransType() {
    this.loadingService.setDisplay(true);
    this.transportTypeService.getTransportTypeAvailable().subscribe(transType => {
      this.transportTypes = transType;
      this.loadingService.setDisplay(false);
    });
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(selectedInvoice?) {
    this.selectedInvoice = selectedInvoice;
    this.getDealers();
    this.getRegions();
    this.getTransType();
    this.buildForm();
    this.modalHeight = this.modalHeightService.onResize();
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
    const apiCall = !this.selectedInvoice
      ? this.invoiceLeadtimeService.createNewInvoice(this.form.value)
      : this.invoiceLeadtimeService.updateInvoice(this.form.value);

    this.loadingService.setDisplay(true);
    apiCall.subscribe(() => {
      this.close.emit();
      this.modal.hide();
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessModal();
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      id: [undefined],
      fromDealerId: [undefined],
      toDealerId: [undefined, GlobalValidator.required],
      dayAmount: [undefined, Validators.compose([GlobalValidator.numberFormat, GlobalValidator.maxLength(18)])],
      regionId: [undefined],
      transportationTypesId: [undefined],
    });
    if (this.selectedInvoice) {
      this.form.patchValue(this.selectedInvoice);
    }
  }
}
