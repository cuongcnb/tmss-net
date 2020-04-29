import {Component, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {ContractManagementService} from '../../../../api/daily-sale/contract-management.service';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'delivery-log',
  templateUrl: './delivery-log.component.html',
  styleUrls: ['./delivery-log.component.scss']
})
export class DeliveryLogComponent {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  gridField;
  params;
  contractFollowupId: number;

  constructor(
    private dataFormatService: DataFormatService,
    private swalAlertService: ToastService,
    private contractManagementService: ContractManagementService,
    private loadingService: LoadingService,
  ) {
    this.gridField = [
      {field: 'contractNo', minWidth: 120},
      {headerName: 'FrameNo', field: 'frameNo', minWidth: 100},
      {headerName: 'Delivery Date Old', field: 'deliveryDateOld', minWidth: 140},
      {headerName: 'Contact Name Old', field: 'contactNameOld', minWidth: 150},
      {headerName: 'Contact Address Old', field: 'contactAddressOld', minWidth: 170},
      {headerName: 'Contact Tel Old', field: 'contactTelOld', minWidth: 170},
      {
        field: 'deliveryDateNew',
        minWidth: 170,
        cellRenderer: params => `<span>${this.dataFormatService.formatDateSale(params.value)}</span>`
      },
      {field: 'contactNameNew', minWidth: 170},
      {field: 'contactAddressNew', minWidth: 170},
      {field: 'contactTelNew', minWidth: 170},
      {field: 'modifiedBy', minWidth: 140},
      {
        field: 'modifyDate',
        minWidth: 140,
        cellRenderer: params => `<span>${this.dataFormatService.formatDateSale(params.value)}</span>`
      },
    ];
  }

  open(contractFollowupId) {
    this.contractFollowupId = contractFollowupId;
  }

  callbackGrid(params) {
    this.params = params;
    this.loadingService.setDisplay(true);
    this.contractManagementService.findAllChangeDeliveryLogs(this.contractFollowupId).subscribe(contracts => {
      if (contracts && contracts.length) {
        this.params.api.setRowData(contracts);
        this.loadingService.setDisplay(false);
        this.modal.show();
      } else {
        this.contractFollowupId = null;
        this.loadingService.setDisplay(false);
        this.swalAlertService.openFailModal('Hợp đồng này chưa thay đổi delivery date lần nào');
      }
    });
  }

}
