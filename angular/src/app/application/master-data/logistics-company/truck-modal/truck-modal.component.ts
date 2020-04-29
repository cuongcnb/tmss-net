import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TruckService} from '../../../../api/master-data/truck.service';
import { TransportTypeService} from '../../../../api/master-data/transport-type.service';
import { MeansOfTransportationService} from '../../../../api/master-data/means-of-transportation.service';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { StorageKeys } from '../../../../core/constains/storageKeys';
import { FormStoringService } from '../../../../shared/common-service/form-storing.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'truck-modal',
  templateUrl: './truck-modal.component.html',
  styleUrls: ['./truck-modal.component.scss']
})
export class TruckModalComponent {
  @ViewChild('truckModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  companyId;
  selectedData;
  form: FormGroup;
  truckId: number;
  transportTypes;
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private truckService: TruckService,
    private transportTypeService: TransportTypeService,
    private modalHeightService: SetModalHeightService,
    private formStoringService: FormStoringService,
    private swalAlertService: ToastService,
    private meansOfTransportService: MeansOfTransportationService,
    private loadingService: LoadingService
  ) {
  }

  private getTruckId() {
    this.loadingService.setDisplay(true);
    this.meansOfTransportService.getTransportMean().subscribe(means => {
      means.forEach(mean => {
        if (mean.name.toLowerCase() === 'truck') {
          this.truckId = mean.id;
        }
      });
    });
    this.transportTypeService.getAllTransportType().subscribe(transportTypes => {
      this.transportTypes = transportTypes;
      this.loadingService.setDisplay(false);
    });
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(companyId?, selectedData?) {
    this.selectedData = selectedData;
    this.companyId = companyId;
    this.getTruckId();
    this.onResize();
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
    const value = Object.assign({}, this.form.value, {
      logisticCompanyId: this.companyId,
    });
    const apiCall = !this.selectedData
      ? this.truckService.createNewTruck(value)
      : this.truckService.updateTruck(value);
    this.loadingService.setDisplay(true);

    apiCall.subscribe(() => {
      this.formStoringService.clear(StorageKeys.truck);
      this.close.emit();
      this.modal.hide();
      this.loadingService.setDisplay(false);
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessModal();
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: [undefined],
      registerNo: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(20)])],
      transportationTypeId: [undefined, GlobalValidator.required],
      productionYear: [undefined, Validators.compose([GlobalValidator.numberFormat, GlobalValidator.maxLength(4)])],
      ownerType: ['O'],
      driverName: [undefined, GlobalValidator.maxLength(50)],
      driverPhone: [undefined, GlobalValidator.phoneFormat],
      ordering: [undefined, Validators.compose([GlobalValidator.numberFormat, GlobalValidator.maxLength(4)])],
      status: ['Y'],
      description: [undefined, GlobalValidator.maxLength(255)],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    } else {
      const val = this.formStoringService.get(StorageKeys.truck);
      if (val) {
        this.form.patchValue(val);
      }
    }

    this.form.valueChanges.subscribe(data => {
      if (data) { this.formStoringService.set(StorageKeys.truck, data); }
    });
  }
}

