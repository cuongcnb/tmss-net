import { Component, ViewChild } from '@angular/core';
import { ColorListService} from '../../../api/master-data/color-list.service';
import { LoadingService } from '../../../shared/loading/loading.service';
import { ToastService } from '../../../shared/common-service/toast.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'color-list',
  templateUrl: './color-list.component.html',
  styleUrls: ['./color-list.component.scss']
})
export class ColorListComponent {
  @ViewChild('colorListModal', {static: false}) colorListModal;

  fieldGrid;
  gridParamColorList;
  selectedColor;

  constructor(
    private colorListService: ColorListService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private confirmationService: ConfirmService,
  ) {
    this.fieldGrid = [
      {field: 'code'},
      {
        headerName: 'Vietnamese Name',
        field: 'vnName',
      },
      {
        headerName: 'English Name',
        field: 'enName',
      },
      {
        field: 'ordering',
        cellClass: ['cell-border', 'text-right'],
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'status', cellRenderer: params => {
          return `${params.value === 'Y' ? 'Enable' : 'Disable'}`;
        }
      },
      {
        field: 'description',
        cellClass: ['cell-border', 'cell-wrap-text'],
        autoHeight: true,
        minWidth: 300
      },
    ];
  }

  callbackGridColorList(params) {
    this.loadingService.setDisplay(true);
    this.colorListService.getColors()
      .subscribe((color) => {
        params.api.setRowData(color);
        this.loadingService.setDisplay(false);
      });
    this.gridParamColorList = params;
  }

  refreshList() {
    this.selectedColor = undefined;
    this.callbackGridColorList(this.gridParamColorList);
  }

  getParamsColorList(params) {
    this.gridParamColorList = params;
    const selectedColor = this.gridParamColorList.api.getSelectedRows();
    if (selectedColor) {
      this.selectedColor = selectedColor[0];
    }
  }

  updateColor() {
    if (this.selectedColor) {
      this.colorListModal.open(this.selectedColor);
    } else {
      this.swalAlertService.openWarningModal('You haven\'t selected any row, please select one to update', 'Select a row to update');
    }
  }

  deleteColor() {
    this.confirmationService.openConfirmModal('Are you sure?', 'Do you want to delete this data?')
      .subscribe(() => {
        this.loadingService.setDisplay(true);
        this.colorListService.deleteColor(this.selectedColor.id).subscribe(() => {
          this.refreshList();
          this.loadingService.setDisplay(false);
          this.swalAlertService.openSuccessModal();
        });
      });
  }
}
