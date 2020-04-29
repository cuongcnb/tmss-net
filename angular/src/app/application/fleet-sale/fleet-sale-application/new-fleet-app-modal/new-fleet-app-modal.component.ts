import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FleetSaleApplicationService} from '../../../../api/fleet-sale/fleet-sale-application.service';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'new-fleet-app-modal',
  templateUrl: './new-fleet-app-modal.component.html',
  styleUrls: ['./new-fleet-app-modal.component.scss']
})
export class NewFleetAppModalComponent {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  @Input() currentUser;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private fleetSaleApplicationService: FleetSaleApplicationService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
  ) {
  }

  getDlrRefNo() {
    this.loadingService.setDisplay(true);
    this.fleetSaleApplicationService.getDlrRefNo(this.currentUser.dealerId).subscribe(dlrRefNo => {
      this.form.patchValue({
        refNo: dlrRefNo
      });
      this.loadingService.setDisplay(false);
    });
  }

  open() {
    this.buildForm();
    this.getDlrRefNo();
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
    this.loadingService.setDisplay(true);
    const value = Object.assign({}, this.form.value, {
      dealerId: this.currentUser.dealerId
    });
    this.loadingService.setDisplay(false);
    this.fleetSaleApplicationService.createNewFleetApp(value).subscribe(() => {
      this.close.emit();
      this.modal.hide();
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessModal();
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      refNo: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(50)])],
      fleetAppDate: [new Date()]
    });
  }
}
