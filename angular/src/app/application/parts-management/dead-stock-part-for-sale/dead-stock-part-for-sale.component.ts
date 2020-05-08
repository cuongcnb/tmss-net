import { Component, OnInit, Injector } from '@angular/core';
import { DeadStockPartModel } from '../../../core/models/parts-management/dead-stock-part.model';
import { PartsInfoManagementApi } from '../../../api/parts-management/parts-info-management.api';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';
import { PaginationParamsModel } from '../../../core/models/base.model';
import { LoadingService } from '../../../shared/loading/loading.service';
import { DeadStockPartApi } from '../../../api/parts-management/dead-stock-part.api';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dead-stock-part-for-sale',
  templateUrl: './dead-stock-part-for-sale.component.html',
  styleUrls: ['./dead-stock-part-for-sale.component.scss']
})
export class DeadStockPartForSaleComponent extends AppComponentBase implements OnInit {
  partSearchGridField;
  gridField;
  gridParams;

  // currentUser = CurrentUser;
  paginationParams: PaginationParamsModel;
  paginationTotalsData: number;

  partSelected: DeadStockPartModel;
  deadStockParts: Array<DeadStockPartModel>;



  constructor(
    injector: Injector,
    private loading: LoadingService,
    private swalAlert: ToastService,
    private confirmService: ConfirmService,
    private partsInfoManagementApi: PartsInfoManagementApi,
    private deadStockPartApi: DeadStockPartApi,
  ) {
    super(injector);
  }

  ngOnInit() {
    this.gridField = [
      {
        headerName: 'STT', headerTooltip: 'Số thứ tự', width: 80,
        cellRenderer: params => params.rowIndex + 1
      },
      {headerName: 'Mã PT', headerTooltip: 'Mã phụ tùng', field: 'partsCode'},
      {headerName: 'Tên PT', headerTooltip: 'Tên phụ tùng', valueGetter: params => {
           return params.data && params.data.partsNameVn && !!params.data.partsNameVn
             ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '' ;
        }},
      {
        headerName: 'Số lượng', headerTooltip: 'Số lượng', field: 'qty',
        editable: true, type: 'number',
        validators: ['required', 'number'],
        cellClass: ['cell-clickable', 'cell-border'],
      },
      {
        headerName: 'Giá rao', headerTooltip: 'Giá rao', field: 'price',
        editable: true, type: 'number',
        validators: ['required', 'number'],
        cellClass: ['cell-clickable', 'cell-border'],
      },
    ];
    this.partSearchGridField = [
      {headerName: 'Mã PT', headerTooltip: 'Mã phụ tùng', field: 'partsCode'},
      {headerName: 'Tên PT', headerTooltip: 'Tên phụ tùng', valueGetter: params => {
           return params.data && params.data.partsNameVn && !!params.data.partsNameVn
             ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '' ;
        }},
      {headerName: 'Số lượng', headerTooltip: 'Số lượng', field: 'amount'},
      {headerName: 'Giá TMV', headerTooltip: 'Giá TMV', field: 'sellPrice'},
    ];
  }

  searchDeadStockPart() {
    this.partSelected = undefined;
    this.loading.setDisplay(true);
    this.deadStockPartApi.searchDeadStockPart(this.currentUser.dealerId, null, this.paginationParams)
      .subscribe(res => {
        this.loading.setDisplay(false);
        if (res) {
          this.deadStockParts = res.list;
          this.paginationTotalsData = res.total;
          this.gridParams.api.setRowData(res.list);
        }
      });
  }

  callbackGrid(params) {
    this.gridParams = params;
    this.resetPaginationParams();
    this.searchDeadStockPart();
  }

  getParams() {
    const selected = this.gridParams.api.getSelectedRows();
    if (selected) {
      this.partSelected = selected[0];
    }
  }

  changePaginationParams(paginationParams) {
    if (!this.deadStockParts) {
      return;
    }

    this.paginationParams = paginationParams;
    this.searchDeadStockPart();
  }

  apiPartsCall(val) {
    return this.partsInfoManagementApi.searchPartsInfo({partsCode: val || null});
  }

  saveDeadStockPart() {
    if (!this.deadStockParts || this.deadStockParts.length === 0) {
      return;
    }
    this.loading.setDisplay(true);
    this.deadStockPartApi.sellDeadStockPart(this.deadStockParts).subscribe(() => {
      this.loading.setDisplay(false);
      this.searchDeadStockPart();
    });
  }

  setPartsDataToRow(data) {
    this.deadStockParts.push(data);
    this.gridParams.api.updateRowData({add: [data]});
  }

  removePartDeadStockRow() {
    this.confirmService.openConfirmModal('Xác nhận xóa', 'Bạn có muốn xóa dữ liệu không?')
      .subscribe(() => {
        this.gridParams.api.updateRowData({remove: [this.partSelected]});
        this.partSelected = undefined;
      });
  }

  apiCallUpload(val) {
    return this.deadStockPartApi.importDeadStockPart(val);
  }

  uploadSuccess(response) {
    this.deadStockParts.concat(response.data);
    this.gridParams.api.updateRowData({add: response.data});
  }

  uploadFail(error) {
    this.swalAlert.openFailToast(error.message, 'Upload Fail!');
  }

  private resetPaginationParams() {
    if (this.paginationParams) {
      this.paginationParams.page = 1;
    }
    this.paginationTotalsData = 0;
  }
}

