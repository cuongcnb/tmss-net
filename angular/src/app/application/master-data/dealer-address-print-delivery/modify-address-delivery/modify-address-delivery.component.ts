import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {DealerAddressDeliveryService} from '../../../../api/master-data/dealer-address-delivery.service';
import {DealerListService} from '../../../../api/master-data/dealer-list.service';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'modify-address-delivery',
  templateUrl: './modify-address-delivery.component.html',
  styleUrls: ['./modify-address-delivery.component.scss']
})
export class ModifyAddressDeliveryComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData;
  form: FormGroup;
  dealers;
  dealerChild;
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private modalHeightService: SetModalHeightService,
    private dealerAddressDeliveryService: DealerAddressDeliveryService,
    private dealerListService: DealerListService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService
  ) {
  }

  ngOnInit() {
    this.dealerListService.getDealers().subscribe(dealers => {
      this.dealers = dealers;
    });
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.buildForm();
    this.onResize();
    this.modal.show();
  }

  getDealerChild() {
    const dealerId = this.form.value.dealerId;
    if (!dealerId) {
      this.dealerChild = [];
      return;
    }
    this.dealerListService.getDealerChild(this.form.value.dealerId).subscribe(res => {
      this.dealerChild = res;
    });
  }

  reset() {
    this.form = undefined;
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    const apiCall = this.selectedData ?
      this.dealerAddressDeliveryService.updateData(this.form.value) : this.dealerAddressDeliveryService.createNewData(this.form.value);

    this.loadingService.setDisplay(true);
    apiCall.subscribe(() => {
      this.close.emit();
      this.modal.hide();
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessModal();
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: [undefined],
      dealerId: [undefined, GlobalValidator.required],
      otherDealerId: [undefined],
      priority: [undefined, GlobalValidator.positiveAndNegInteger],
      address: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(2000)])],
      status: ['Y']
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
    this.form.get('dealerId').valueChanges.subscribe(val => {
      this.form.patchValue({
        otherDealerId: undefined
      });
      this.getDealerChild();
    });
  }


}
