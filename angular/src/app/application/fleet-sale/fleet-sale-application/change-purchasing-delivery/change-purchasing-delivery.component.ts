import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GradeListModel} from '../../../../core/models/sales/model-list.model';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { FleetSaleApplicationService} from '../../../../api/fleet-sale/fleet-sale-application.service';
import { isEqual } from 'lodash';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'change-purchasing-delivery',
  templateUrl: './change-purchasing-delivery.component.html',
  styleUrls: ['./change-purchasing-delivery.component.scss']
})
export class ChangePurchasingDeliveryComponent implements OnInit {
  @ViewChild('changePurchasingDelivery', {static: false}) modal: ModalDirective;
  @Input() isDlrFleetSaleApplication;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedFleetApp;
  form: FormGroup;
  gradeList: Array<GradeListModel>;
  colorList;
  fleetIntentions;
  fleetDeliveries;
  displayedIntentionData;
  displayedDeliveryData;
  sendData = false;
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private fleetSaleApplicationService: FleetSaleApplicationService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private setModalHeightService: SetModalHeightService
  ) {
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  open(selectedFleetApp, gradeList, colorList, fleetIntentions, fleetDeliveries) {
    this.selectedFleetApp = selectedFleetApp;
    this.gradeList = gradeList;
    this.colorList = colorList;
    this.fleetIntentions = fleetIntentions;
    this.fleetDeliveries = fleetDeliveries;
    this.buildForm();
    this.modal.show();
  }

  hide() {
    this.modal.hide();
  }

  reset() {
    this.form = undefined;
  }

  getDisplayedIntention(displayedIntentionData) {
    this.displayedIntentionData = displayedIntentionData;
  }

  getDisplayedDelivery(displayedDeliveryData) {
    this.displayedDeliveryData = displayedDeliveryData;
  }

  convertToIdBeforeSend() {
    this.displayedIntentionData.forEach(data => {
      this.colorList.filter(color => {
        if (data.colorId === color.code) {
          data.colorId = color.id;
        }
      });
      this.gradeList.filter(grade => {
        if (data.gradeId === grade.marketingCode) {
          data.gradeId = grade.id;
        }
      });
    });
    this.displayedDeliveryData.forEach(data => {
      this.gradeList.filter(grade => {
        if (data.gradeId === grade.marketingCode) {
          data.gradeId = grade.id;
        }
      });
    });
  }

  get checkGridData() {
    // this.convertToIdBeforeSend();
    // Check if Grade in Delivery and Grade in Intention are match
    const intentionTotal = {};
    const deliveryTotal = {};

    let isBlankIntentionRow: boolean;
    let isBlankDeliveryRow: boolean;
    const blankIntention = {
      // fleetAppHistoryId: this.selectedFleetApp.id,
      gradeId: null,
      colorId: null,
      quantity: null,
      frsp: null,
      fwsp: null,
      discount: null
    };
    const blankDelivery = {
      // fleetAppHistoryId: this.selectedFleetApp.id,
      gradeId: null,
      quantity: null,
      month: null,
      year: null,
      quantityTmv: null,
      monthTmv: null,
      yearTmv: null,
    };
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.displayedIntentionData.length; i++) {
      isBlankIntentionRow = isEqual(this.displayedIntentionData[i], blankIntention);
      const currentGradeId = this.displayedIntentionData[i].gradeId;
      intentionTotal[currentGradeId] > 0
        ? intentionTotal[currentGradeId] += parseFloat(this.displayedIntentionData[i].quantity)
        : intentionTotal[currentGradeId] = parseFloat(this.displayedIntentionData[i].quantity);
    }
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.displayedDeliveryData.length; i++) {
      isBlankDeliveryRow = isEqual(this.displayedDeliveryData[i], blankDelivery);
      const currentGradeId = this.displayedDeliveryData[i].gradeId;
      deliveryTotal[currentGradeId] > 0
        ? deliveryTotal[currentGradeId] += parseFloat(this.displayedDeliveryData[i].quantity)
        : deliveryTotal[currentGradeId] = parseFloat(this.displayedDeliveryData[i].quantity);
    }
    if ((!this.displayedIntentionData.length || !this.displayedDeliveryData.length) || (isBlankIntentionRow || isBlankDeliveryRow)) {
      return 'Blank table';
    } else if (!isEqual(Object.entries(intentionTotal).sort(), Object.entries(deliveryTotal).sort())) {
      return 'Unmatch';
    }/* else {
      return true;
    }*/
  }

  sendToTmv() {
    // this.convertToIdBeforeSend();
    if (this.checkGridData === 'Unmatch') {
      this.swalAlertService.openFailModal('Intention and Delivery data is not match, please check before submit', 'Unmatch Intention and Delivery');
      return;
    } else if (this.checkGridData === 'Blank table') {
      this.swalAlertService.openFailModal('Either Intention or Delivery table is empty, please fill both tables before submit', 'Can not submit blank data');
      return;
    } else {
      this.loadingService.setDisplay(true);
      const value = {
        dealerAppDTLSList: this.displayedIntentionData,
        dealerAppDeliveriesList: this.displayedDeliveryData
      };
      this.fleetSaleApplicationService.changeFleetAppRequest(this.selectedFleetApp, value).subscribe(() => {
        this.loadingService.setDisplay(false);
        this.swalAlertService.openSuccessModal();
        this.close.emit();
        this.modal.hide();
      });
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      sendToTmv: ['', GlobalValidator.maxLength(2000)]
    });
  }
}
