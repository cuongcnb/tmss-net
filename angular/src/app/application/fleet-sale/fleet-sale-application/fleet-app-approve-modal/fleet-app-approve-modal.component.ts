import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FleetSaleApplicationService} from '../../../../api/fleet-sale/fleet-sale-application.service';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'fleet-app-approve-modal',
  templateUrl: './fleet-app-approve-modal.component.html',
  styleUrls: ['./fleet-app-approve-modal.component.scss']
})
export class FleetAppApproveModalComponent implements OnInit {
  @ViewChild('fleetAppApprovalModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  isRejectForm: boolean;
  selectedFleetApp;
  form: FormGroup;
  dataToApprove;

  constructor(
    private formBuilder: FormBuilder,
    private fleetSaleApplicationService: FleetSaleApplicationService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
  ) {
  }

  ngOnInit() {
  }

  open(text?: string, selectedFleetApp?, dataToApprove?) {
    this.isRejectForm = text === 'reject';
    this.selectedFleetApp = selectedFleetApp;
    this.dataToApprove = dataToApprove ? dataToApprove : {};
    this.buildForm();
    this.getFleetApprovedNumber();
    this.modal.show();
  }

  hide() {
    this.modal.hide();
  }

  reset() {
    this.form = undefined;
  }

  getFleetApprovedNumber() {
    this.loadingService.setDisplay(true);
    this.fleetSaleApplicationService.getTmvRefNo().subscribe(tmvRefNo => {
      this.form.patchValue({
        tmvRefNo
      });
      this.loadingService.setDisplay(false);
    });
  }

  sendToDlr() {
    if (!this.isRejectForm && this.form.invalid) {
      return;
    }
    this.loadingService.setDisplay(true);
    if (this.isRejectForm) {
      const value = Object.assign({}, this.form.value, {
        fleetApplicationId: this.selectedFleetApp.id
      });
      this.fleetSaleApplicationService.rejectFleetApp(value).subscribe(() => {
        this.close.emit();
        this.modal.hide();
        this.loadingService.setDisplay(false);
        this.swalAlertService.openSuccessModal();
      });
    } else {
      let fleetAppDeliveriesList;

      if (this.dataToApprove.fleetAppDeliveriesList && this.dataToApprove.fleetAppDeliveriesList.length) {
        this.removeNullElem(this.dataToApprove.fleetAppDeliveriesList);
        fleetAppDeliveriesList = this.dataToApprove.fleetAppDeliveriesList.map(item => {
          const matchData = this.dataToApprove.fleetAppDeliveriesList.find(data => data.id === item.id);

          return Object.assign({}, matchData, item);
        });
      }
      const dataToApprove = Object.assign({}, this.dataToApprove, {
        refNoTmv: this.form.value.tmvRefNo,
        approverDate: this.form.value.approvedDate,
        expiryDate: this.form.value.expiryDate,
        noteTmv: this.form.value.description,
        fleetAppDeliveriesList,
      });
      this.fleetSaleApplicationService.approveFleetApp(this.selectedFleetApp.id, dataToApprove, true).subscribe(() => {
        this.close.emit();
        this.modal.hide();
        this.loadingService.setDisplay(false);
        this.swalAlertService.openSuccessModal();
      });
    }
  }

  private buildForm() {
    const year = (new Date()).getFullYear();
    const month = new Date().getMonth();
    const date = new Date().getDate();
    this.form = this.formBuilder.group({
      tmvRefNo: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(50)])],
      approvedDate: [new Date(), GlobalValidator.required],
      expiryDate: [new Date(year + 3, month, date), GlobalValidator.required],
      description: ['', GlobalValidator.maxLength(2000)],
    });
  }

  private removeNullElem(arr: Array<object>) {
    return arr.map(item => {
      Object.keys(item).forEach(key => {
        if (!item[key] && item[key] !== 0) {
          delete item[key];
        }
        return item;
      });
    });
  }
}
