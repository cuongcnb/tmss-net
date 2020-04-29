import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { ConfirmService } from '../../../shared/confirmation/confirm.service';
import { LoadingService } from '../../../shared/loading/loading.service';
import { WarrantyTimeSheetModel } from '../../../core/models/warranty/warranty-time-sheet.model';
import { WarrantyTimeSheetApi } from '../../../api/master-data/warranty/warranty-time-sheet.api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'warranty-time-sheet-declare',
  templateUrl: './warranty-time-sheet-declare.component.html',
  styleUrls: ['./warranty-time-sheet-declare.component.scss']
})
export class WarrantyTimeSheetDeclareComponent implements OnInit {
  @ViewChild('updateWarrantyTimeSheetModal', {static: false}) updateWarrantyTimeSheetModal;
  fieldGrid;
  params;
  selectedData: WarrantyTimeSheetModel;

  constructor(
    private loadingService: LoadingService,
    private confirmService: ConfirmService,
    private toast: ToastrService,
    private warrantyTimeSheetApi: WarrantyTimeSheetApi,
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {headerName: 'Dealer Code', headerTooltip: 'Dealer Code', field: 'dealercode', width: 200},
      {headerName: 'Labor Rate', headerTooltip: 'Labor Rate', field: 'laborRate', width: 200},
      {headerName: 'Desc VN', headerTooltip: 'Desc VN', field: 'descvn', width: 500},
      {headerName: 'PWRDLR', headerTooltip: 'PWRDLR', field: 'pwrdlr', width: 200, cellClass: ['cell-readonly', 'cell-border', 'text-right']},
      {headerName: 'PRRDLR', headerTooltip: 'PRRDLR', field: 'prr', width: 200, cellClass: ['cell-readonly', 'cell-border', 'text-right']},
      {headerName: 'FREE PM', headerTooltip: 'FREE PM', field: 'freePm', width: 200}
    ];
  }

  callbackGrid(params) {
    this.params = params;
    this.getLists();
  }

  refreshList() {
    this.selectedData = undefined;
    this.getLists();
  }

  getParams() {
    const selectedData = this.params.api.getSelectedRows();
    if (selectedData) {
      this.selectedData = selectedData[0];
    }
  }

  update() {
    this.selectedData
      ? this.updateWarrantyTimeSheetModal.open(this.selectedData)
      : this.toast.warning('Chưa chọn dữ liệu, hãy chọn ít nhất một dòng', 'Cảnh báo');
  }

  deleteData() {
    if (this.selectedData) {
      this.confirmService.openConfirmModal('Bạn có muốn xóa bản ghi này?')
        .subscribe(() => {
          this.loadingService.setDisplay(true);
          this.warrantyTimeSheetApi.remove(this.selectedData.id).subscribe(() => {
            this.loadingService.setDisplay(false);
            this.refreshList();
            this.toast.success('Thành Công', 'Thực hiện thành công');
          });
        });
    } else {
      this.toast.warning('Chưa chọn dữ liệu, hãy chọn ít nhất một dòng', 'Cảnh báo');
    }
  }

  private getLists() {
    this.loadingService.setDisplay(true);
    this.warrantyTimeSheetApi.getAll().subscribe(warrs => {
      this.params.api.setRowData(warrs);
      this.loadingService.setDisplay(false);
    });
  }
}
