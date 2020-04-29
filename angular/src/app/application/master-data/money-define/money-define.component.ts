import {Component, ViewChild} from '@angular/core';
import {LoadingService} from '../../../shared/loading/loading.service';
import {MoneyDefineService} from '../../../api/master-data/money-define.service';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {ToastService} from '../../../shared/common-service/toast.service';
import {ConfirmService} from '../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'money-define',
  templateUrl: './money-define.component.html',
  styleUrls: ['./money-define.component.scss']
})
export class MoneyDefineComponent {
  @ViewChild('moneyModifyModal', {static: false}) moneyModifyModal;
  fieldGrid;
  params;
  selectedData;

  constructor(
    private loadingService: LoadingService,
    private dataFormatService: DataFormatService,
    private confirmationService: ConfirmService,
    private moneyDefineService: MoneyDefineService,
    private swalAlertService: ToastService
  ) {
    this.fieldGrid = [
      {
        field: 'grade',
        minWidth: 70
      },
      {
        headerName: 'Grade production',
        field: 'gradeProduction',
        minWidth: 100
      },
      {
        field: 'color',
        minWidth: 70
      },
      {
        field: 'interiorColor',
        minWidth: 70
      },
      {
        field: 'priceAmount',
        cellClass: ['cell-border', 'text-right'],
        filter: 'agNumberColumnFilter',
        valueFormatter: params => this.dataFormatService.numberFormat(params.value)
      },
      {
        field: 'orderPriceAmount',
        cellClass: ['cell-border', 'text-right'],
        filter: 'agNumberColumnFilter',
        valueFormatter: params => this.dataFormatService.numberFormat(params.value)
      }
    ];
  }

  callbackGrid(params) {
    this.loadingService.setDisplay(true);
    this.moneyDefineService.getAll().subscribe(list => {
      params.api.setRowData(list);
      this.loadingService.setDisplay(false);
    });
    this.params = params;
  }

  refreshList() {
    this.selectedData = undefined;
    this.loadingService.setDisplay(true);
    this.moneyDefineService.getAll().subscribe(list => {
      this.params.api.setRowData(list);
      this.loadingService.setDisplay(false);
    });
  }

  getParams() {
    const selectedData = this.params.api.getSelectedRows();
    if (selectedData) {
      this.selectedData = selectedData[0];
    }
  }

  updateData() {
    if (this.selectedData) {
      this.moneyModifyModal.open(this.selectedData);
    } else {
      this.swalAlertService.openWarningForceSelectData();
    }
  }

  deleteMoney() {
    this.confirmationService.openConfirmModal('Are you sure?', 'Do you want to delete this data?')
      .subscribe(() => {
        this.loadingService.setDisplay(true);
        this.moneyDefineService.deleteMoney(this.selectedData.id).subscribe(() => {
          this.refreshList();
          this.loadingService.setDisplay(false);
          this.swalAlertService.openSuccessModal();
        });
      });
  }
}
