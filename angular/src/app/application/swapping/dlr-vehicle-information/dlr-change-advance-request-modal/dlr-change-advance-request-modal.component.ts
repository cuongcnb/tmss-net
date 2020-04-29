import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DlrVehicleInformationService} from '../../../../api/swapping/dlr-vehicle-information.service';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {DealerListService} from '../../../../api/master-data/dealer-list.service';
import {SwappingVehicleService} from '../../../../api/swapping/swapping-vehicle.service';
import {StorageKeys} from '../../../../core/constains/storageKeys';
import {FormStoringService} from '../../../../shared/common-service/form-storing.service';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dlr-advance-change-request-modal',
  templateUrl: './dlr-change-advance-request-modal.component.html',
  styleUrls: ['./dlr-change-advance-request-modal.component.scss']
})
export class DlrChangeAdvanceRequestModalComponent implements OnInit {
  @ViewChild('dlrAdvanceChangeRequestModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native no-output-rename
  @Output('close') close = new EventEmitter();
  @Input() currentUser;
  selectedDlrVehicle;
  form: FormGroup;

  dealerList;
  currentDealer;

  column: { fieldName: string, headerName: string };
  agColEditable = {
    swapDealer: {
      fieldName: 'swapDealer',
      headerName: 'Swap Dealer'
    },
    dispatchChangeReqDate: {
      fieldName: 'dispatchChangeReqDate',
      headerName: 'Change Request'
    },
    advanceRequestDate: {
      fieldName: 'advanceRequestDate',
      headerName: 'Advance Request'
    }
  };

  constructor(
    private formBuilder: FormBuilder,
    private dlrVehicleInformationService: DlrVehicleInformationService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private dealerListService: DealerListService,
    private swappingVehicleService: SwappingVehicleService,
    private formStoringService: FormStoringService,
  ) {
  }

  ngOnInit() {
  }

  open(selectedDlrVehicle, column) {
    this.column = column;
    this.selectedDlrVehicle = selectedDlrVehicle;
    if (this.column.fieldName === this.agColEditable.swapDealer.fieldName) {
      this.getDealerList();
    }
    this.modal.show();
    this.buildForm();
  }

  getDealerList() {
    this.loadingService.setDisplay(true);
    this.currentUser = this.formStoringService.get(StorageKeys.currentUser);
    this.dealerListService.getAvailableDealers().subscribe(dealerList => {
      this.dealerList = dealerList;
      this.currentDealer = this.dealerList.find(dealer => dealer.id === this.currentUser.dealerId);
      this.dealerList.splice(this.dealerList.indexOf(this.currentDealer), 1);
      this.loadingService.setDisplay(false);
    });
  }

  reset() {
    this.form = undefined;
  }

  save() {
    if (this.form.invalid || !this.selectedDlrVehicle) {
      return;
    }
    if (this.column.fieldName === this.agColEditable.advanceRequestDate.fieldName) {
      if (!this.form.getRawValue().changeDate && this.form.getRawValue().advanceDate) {
        this.swalAlertService.openFailModal('Xe chưa có Change Request, bạn phải nhập Change Request trước');
        return;
      }
    }

    if (this.column.fieldName !== this.agColEditable.swapDealer.fieldName) {
      this.loadingService.setDisplay(true);
      const value = Object.assign({}, this.form.getRawValue(), {
        vehicleId: this.selectedDlrVehicle.id,
      });

      this.dlrVehicleInformationService.changeAdvanceRequest(value).subscribe(() => {
        this.close.emit();
        this.modal.hide();
        this.swalAlertService.openSuccessModal();
        this.loadingService.setDisplay(false);
      });
    } else {
      const swappingInfo = {
        dealerId: this.currentUser.dealerId,
        swapDealerId: this.form.value.swapDealerId ? this.form.value.swapDealerId : null,
        vehicleId: this.selectedDlrVehicle.id,
        vehicleSwapIn: this.selectedDlrVehicle.vehicleSwapIn,
        vehicleSwapOut: this.selectedDlrVehicle.vehicleSwapOut
      };
      this.swappingVehicleService.addSwappingVehicle(swappingInfo).subscribe(() => {
        this.close.emit();
        this.modal.hide();
        this.swalAlertService.openSuccessModal();
        this.loadingService.setDisplay(false);
      });
    }
  }

  forFireFox(date: string) {
    const isFirefox = /Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent);
    let val = date;
    if (isFirefox) {
      const dateArr = val.split('-');
      val = `${dateArr[1]} ${dateArr[0]}, ${dateArr[2]}`;
    }
    return val;
  }

  private buildForm() {
    let changeDate;
    let advanceDate;
    const swapDealerId = this.selectedDlrVehicle.swapDealerId;
    if (this.column.fieldName === this.agColEditable.advanceRequestDate.fieldName) {
      advanceDate = this.selectedDlrVehicle.advanceRequestDate ? new Date(this.forFireFox(this.selectedDlrVehicle.advanceRequestDate)) : undefined;
      changeDate = this.selectedDlrVehicle.dispatchChangeReqDate ? new Date(this.forFireFox(this.selectedDlrVehicle.dispatchChangeReqDate)) : undefined;
    } else if (this.column.fieldName === this.agColEditable.dispatchChangeReqDate.fieldName) {
      changeDate = this.selectedDlrVehicle.dispatchChangeReqDate ? new Date(this.forFireFox(this.selectedDlrVehicle.dispatchChangeReqDate)) : undefined;
    }
    this.form = this.formBuilder.group({
      changeType: [{
        value: this.column.fieldName === this.agColEditable.advanceRequestDate.fieldName
          ? 'Dispatch_advance_request' : 'Dispatch_change_request',
        disabled: true
      }],
      changeDate: [{value: changeDate, disabled: this.column.fieldName === this.agColEditable.swapDealer.fieldName}],
      advanceDate: [{
        value: advanceDate,
        disabled: this.column.fieldName !== this.agColEditable.advanceRequestDate.fieldName
      }],
      swapDealerId: [{
        value: swapDealerId,
        disabled: this.column.fieldName !== this.agColEditable.swapDealer.fieldName
      }]
    });
  }
}
