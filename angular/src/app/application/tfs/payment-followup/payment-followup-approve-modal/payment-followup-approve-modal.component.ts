import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {DealerListService} from '../../../../api/master-data/dealer-list.service';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {PaymentFollowupService} from '../../../../api/tfs/payment-followup.service';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'payment-followup-approve-modal',
  templateUrl: './payment-followup-approve-modal.component.html',
  styleUrls: ['./payment-followup-approve-modal.component.scss']
})
export class PaymentFollowupApproveModalComponent implements OnInit {
  @ViewChild('paymentFollowupApproveModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  modalHeight: number;
  paymentFollowupData;
  selectedPaymentFollowup;
  dealerList = [];

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private modalHeightService: SetModalHeightService,
    private dealerListService: DealerListService,
    private paymentFollowupService: PaymentFollowupService,
  ) {
  }

  ngOnInit() {
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(dealerList, paymentFollowupData, selectedPaymentFollowup) {
    this.modalHeight = this.modalHeightService.onResize();
    this.dealerList = dealerList;
    this.paymentFollowupData = paymentFollowupData;
    this.selectedPaymentFollowup = selectedPaymentFollowup;
    this.buildForm();
    this.modal.show();
  }

  hide() {
    this.modal.hide();
  }

  reset() {
    this.dealerList = [];
    this.form = undefined;
  }

  approve() {
    let dealerIdArr = [];
    let vehicleId: number;
    let apiCall;
    // Nếu không tích form thì sẽ approve cho xe được click
    const approveOneVehicle = this.selectedPaymentFollowup.tfsProcess === 'Y' && (!this.form.value.all && !this.form.value.dealerOnly);
    if (this.form.invalid) {
      return;
    } else if (approveOneVehicle) {
      this.swalAlertService.openFailModal('This vehicle has already been approved');
      return;
    }

    if (this.form.value.all) {
      dealerIdArr = this.dealerList.map(dealer => dealer.id);
      apiCall = this.paymentFollowupService.approvePaymentFollowup(dealerIdArr);
    } else if (this.form.value.dealerOnly) {
      dealerIdArr.push(this.form.value.dealer);
      apiCall = this.paymentFollowupService.approvePaymentFollowup(dealerIdArr);
    } else {
      vehicleId = this.selectedPaymentFollowup.id;
      apiCall = this.paymentFollowupService.approvePaymentFollowup(dealerIdArr, vehicleId);
    }

    this.loadingService.setDisplay(true);
    apiCall.subscribe(() => {
      this.loadingService.setDisplay(false);
      this.close.emit();
      this.modal.hide();
      this.swalAlertService.openSuccessModal();
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      dealer: [{value: undefined, disabled: true}, Validators.required],
      all: [false],
      dealerOnly: [false],
    });

    this.form.get('all').valueChanges.subscribe(val => {
      if (val) {
        this.form.get('dealer').disable();
        this.form.patchValue({
          dealerOnly: false,
        });
      }
    });

    this.form.get('dealerOnly').valueChanges.subscribe(val => {
      if (val) {
        this.form.get('dealer').enable();
        this.form.patchValue({
          all: false,
        });
      } else {
        this.form.get('dealer').disable();
      }
    });
  }
}
