import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingService} from '../../../../shared/loading/loading.service';
import { SalesPersonService} from '../../../../api/dlr-master-data/sales-person.service';
import { FormStoringService } from '../../../../shared/common-service/form-storing.service';
import { StorageKeys } from '../../../../core/constains/storageKeys';
import { DataFormatService } from '../../../../shared/common-service/data-format.service';
import { ToastService } from '../../../../shared/common-service/toast.service';
import { ConfirmService } from '../../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sales-person',
  templateUrl: './sales-person.component.html',
  styleUrls: ['./sales-person.component.scss']
})
export class SalesPersonComponent implements OnInit {
  @ViewChild('salesPersonModal', {static: false}) salesPersonModal;
  fieldGrid;
  gridSalesPersonParam;
  selectedSalesPerson;

  constructor(
    private salesPersonService: SalesPersonService,
    private formStoringService: FormStoringService,
    private dataFormatService: DataFormatService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private confirmationService: ConfirmService,
  ) {
    this.fieldGrid = [
      {
        field: 'groupName',
        minWidth: 150
      },
      {
        field: 'teamName',
        minWidth: 150
      },
      {
        field: 'fullName',
        minWidth: 150
      },
      {
        field: 'ordering',
        cellClass: ['cell-border', 'text-right'],
        minWidth: 60
      },
      {
        field: 'birthday',
        minWidth: 100
      },
      {
        field: 'position',
        minWidth: 100
      },
      {
        field: 'abbreviation',
        minWidth: 150
      },
      {
        field: 'status',
        valueFormatter: params => {
          return `${params.value === 'Y' ? 'Enable' : 'Disable'}`;
        },
        minWidth: 60
      },
      {
        field: 'gender',
        valueFormatter: params => {
          return `${params.value === '1' ? 'Male' : (params.value === 'null') || (params.value === undefined) ? '' : 'Female'}`;
        },
        minWidth: 60
      },
      {
        field: 'phone',
        cellClass: ['cell-border', 'text-right'],
        minWidth: 130
      },
      {
        field: 'email',
        minWidth: 130
      },
      {
        field: 'address',
        minWidth: 130
      },
      {
        field: 'description',
        minWidth: 130
      },
    ];
  }

  ngOnInit() {
  }

  callbackGridSalesPerson(params) {
    this.gridSalesPersonParam = params;
    this.getSalesPersonByDealerId();
  }

  refreshList() {
    this.getSalesPersonByDealerId();
    this.selectedSalesPerson = undefined;
  }

  getSalesPersonByDealerId() {
    this.loadingService.setDisplay(true);
    const dealerId = this.formStoringService.get(StorageKeys.currentUser).dealerId;
    this.salesPersonService.getSalesPerson(dealerId).subscribe(salesPerson => {
      this.gridSalesPersonParam.api.setRowData(salesPerson);
      this.loadingService.setDisplay(false);
    });
  }

  getParamsSalesPerson() {
    const salesPersonData = this.gridSalesPersonParam.api.getSelectedRows();
    if (salesPersonData) {
      this.selectedSalesPerson = salesPersonData[0];
    }
  }

  updateSalesPerson() {
    if (this.selectedSalesPerson) {
      this.salesPersonModal.open(this.selectedSalesPerson);
    } else {
      this.swalAlertService.openWarningForceSelectData('You haven\'t selected any row, please select one to show Sales Person Detail', 'Select a row to show Sales Person Detail');
    }
  }

  deleteSalePerson() {
    this.confirmationService.openConfirmModal('Are you sure', 'Do you want to delete this data?')
      .subscribe(() => {
        this.loadingService.setDisplay(true);
        this.salesPersonService.deleteSalesPerson(this.selectedSalesPerson.id).subscribe(() => {
          this.refreshList();
          this.loadingService.setDisplay(false);
          this.swalAlertService.openSuccessModal();
        });
      });
  }
}
