import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { IAfterGuiAttachedParams } from 'ag-grid-community';

import { NationwideSellingListService} from '../../../../api/swapping/nationwide-selling-list.service';
import { FormStoringService } from '../../../../shared/common-service/form-storing.service';
import { StorageKeys } from '../../../../core/constains/storageKeys';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { EventBusService } from '../../../../shared/common-service/event-bus.service';
import { EventBusType } from '../../../../core/constains/eventBusType';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dlr-vehicle-sell-checkbox',
  template: '<input type="checkbox" #checkbox [(ngModel)]="params.value" (change)="onChange()">',
  styles: []
})
export class DlrVehicleSellCheckboxComponent implements AgRendererComponent {
  @ViewChild('checkbox', {static: false}) checkbox: ElementRef;
  @Output() changeValue = new EventEmitter<boolean>();
  params;
  inputValue;

  constructor(
    private nationwideSellingListService: NationwideSellingListService,
    private formStoringService: FormStoringService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private eventBusService: EventBusService,
  ) {
  }

  agInit(params) {
    this.params = params;
  }

  afterGuiAttached(params?: IAfterGuiAttachedParams) {
  }

  onChange() {
    let message: string;

    if (this.params.data.swapDealer) {
      message = 'Xe đã được swap';
    } else if (!this.params.data.lineOffDate) {
      message = 'Xe chưa có Line Off Date';
    } else if (this.params.data.salesDate) {
      message = 'Xe đã có Sale Date';
    }
    if (message) {
      this.swalAlertService.openFailModal(message);
      this.checkbox.nativeElement.checked = this.params.data.isSell;
      return;
    }

    const currentDealer = this.formStoringService.get(StorageKeys.currentUser);
    let vehicleToSell: object;
    if (currentDealer) {
      this.loadingService.setDisplay(true);
      vehicleToSell = { dealerId: currentDealer.dealerId, vehicleId: this.params.data.id };
      const apiCall = this.params.value ? this.nationwideSellingListService.addVehicleToSell(vehicleToSell) : this.nationwideSellingListService.removeVehicleToSell(vehicleToSell);
      apiCall.subscribe(() => {
        this.loadingService.setDisplay(false);
        this.eventBusService.emit({
          type: EventBusType.dlrVehicleSellCheckbox
        });
      });
    }
  }

  refresh() {
    return false;
  }
}
