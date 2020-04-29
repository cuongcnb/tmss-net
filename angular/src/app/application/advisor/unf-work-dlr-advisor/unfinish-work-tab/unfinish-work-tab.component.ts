import { Component, ViewChild } from '@angular/core';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { EventBusService } from '../../../../shared/common-service/event-bus.service';
import { TMSSTabs } from '../../../../core/constains/tabs';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'unfinish-work-tab',
  templateUrl: './unfinish-work-tab.component.html',
  styleUrls: ['./unfinish-work-tab.component.scss'],
})
export class UnfinishWorkTabComponent {
  fieldGrid;
  params;
  selectedData;

  constructor(
    private swalAlertService: ToastService,
    private eventBus: EventBusService,
  ) {
    this.fieldGrid = [
      {headerName: 'Thời gian', headerTooltip: 'Thời gian', field: 'time'},
      {headerName: 'Số phiếu hẹn', headerTooltip: 'Số phiếu hẹn', field: 'appointNumber'},
      {headerName: 'Biến số xe', headerTooltip: 'Biến số xe', field: 'licensePlate'},
      {headerName: 'Tên khách hàng', headerTooltip: 'Tên khách hàng', field: 'customerName'},
      {headerName: 'Số điện thoại', headerTooltip: 'Số điện thoại', field: 'phoneNumber'},
      {headerName: 'Tình trạng hẹn', headerTooltip: 'Tình trạng hẹn', field: 'appointState'},
    ];
  }

  callbackGrid(params) {
    this.params = params;
  }

  getParams() {
    const selectedData = this.params.api.getSelectedRows();
    if (selectedData) {
      this.selectedData = selectedData[0];
    }
  }

  openProposal() {
    // if (!this.selectedData) {
    //   this.swalAlertService.openFailToast('Phải chọn 1 khách hẹn')
    //   return
    // } else {
    // }
    this.eventBus.emit({
      type: 'openComponent',
      functionCode: TMSSTabs.proposal,
    });
  }

}
