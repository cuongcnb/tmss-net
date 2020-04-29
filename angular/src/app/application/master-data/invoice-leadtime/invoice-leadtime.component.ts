import { Component, ViewChild } from '@angular/core';
import { InvoiceLeadTimeService} from '../../../api/master-data/invoice-lead-time.service';
import { LoadingService } from '../../../shared/loading/loading.service';
import { ToastService } from '../../../shared/common-service/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'invoice-leadtime',
  templateUrl: './invoice-leadtime.component.html',
  styleUrls: ['./invoice-leadtime.component.scss']
})
export class InvoiceLeadtimeComponent {
  @ViewChild('modifyInvoiceModal', {static: false}) modifyInvoiceModal;
  fieldGrid;
  params;
  invoices;
  selectedInvoice;

  constructor(
    private invoiceLeadTimeService: InvoiceLeadTimeService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private confirmationService: ConfirmService,
  ) {
    this.fieldGrid = [
      {
        headerName: 'Departure',
        field: 'departureFrom',
      },
      {
        headerName: 'Dealer',
        field: 'dealerAbbreviation'
      },
      {
        headerName: 'Lead Time',
        field: 'dayAmount',
        cellClass: ['cell-border', 'text-right'],
        filter: 'agNumberColumnFilter'
      },
      {field: 'region'},
      {
        headerName: 'Transport Type',
        field: 'transportType'
      },
    ];
  }

  callbackGrid(params) {
    this.loadingService.setDisplay(true);
    this.invoiceLeadTimeService.getInvoice().subscribe(invoices => {
      this.invoices = invoices;
      params.api.setRowData(this.invoices);
      this.loadingService.setDisplay(false);
    });
    this.params = params;
  }

  getParams() {
    const selectedInvoice = this.params.api.getSelectedRows();
    if (selectedInvoice) {
      this.selectedInvoice = selectedInvoice[0];
    }
  }

  refreshList() {
    this.callbackGrid(this.params);
    this.selectedInvoice = undefined;
  }

  updateData() {
    if (this.selectedInvoice) {
      this.modifyInvoiceModal.open(this.selectedInvoice);
    } else {
      this.swalAlertService.openWarningForceSelectData();
    }
  }

  deleteInvoiceLeadTime() {
    this.confirmationService.openConfirmModal('Are you sure?', 'Do you want to delete this data?')
      .subscribe(() => {
        this.loadingService.setDisplay(true);
        this.invoiceLeadTimeService.deleteInvoiceLeadTime(this.selectedInvoice.id).subscribe(() => {
          this.refreshList();
          this.loadingService.setDisplay(false);
          this.swalAlertService.openSuccessModal();
        });
      });
  }
}
