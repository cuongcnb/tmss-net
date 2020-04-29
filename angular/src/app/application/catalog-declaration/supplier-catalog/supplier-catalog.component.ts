import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { SupplierCatalogModel } from '../../../core/models/catalog-declaration/supplier-catalog.model';
import { LoadingService } from '../../../shared/loading/loading.service';
import { SuppliersCommonApi } from '../../../api/common-api/suppliers-common.api';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'supplier-catalog',
  templateUrl: './supplier-catalog.component.html',
  styleUrls: ['./supplier-catalog.component.scss'],
})
export class SupplierCatalogComponent implements OnInit {
  @ViewChild('updateSupplierCatalog', {static: false}) updateSupplierCatalog;
  fieldGrid;
  gridParams;
  suppliers: Array<SupplierCatalogModel>;
  selectData: SupplierCatalogModel;

  constructor(
    private swalAlertService: ToastService,
    private loadingService: LoadingService,
    private suppliersApi: SuppliersCommonApi,
    private confirm: ConfirmService,
  ) {
    this.fieldGrid = [
      {
        headerName: 'Nhà cung cấp',
        headerTooltip: 'Nhà cung cấp',
        children: [
          {headerName: 'Mã NCC', headerTooltip: 'Mã NCC', field: 'supplierCode', pinned: true, resizable: true},
          {headerName: 'Tên NCC', headerTooltip: 'Tên NCC', field: 'supplierName', pinned: true, resizable: true},
        ],
      },
      {
        headerName: 'Thông tin nhà cung cấp',
        headerTooltip: 'Thông tin nhà cung cấp',
        children: [
          {headerName: 'Địa chỉ', headerTooltip: 'Địa chỉ', field: 'address', resizable: true},
          {headerName: 'Số ĐT', headerTooltip: 'Số ĐT', field: 'tel', resizable: true, cellClass: ['cell-border', 'cell-readonly', 'text-right']},
          {headerName: 'Fax', headerTooltip: 'Fax', field: 'fax', resizable: true, cellClass: ['cell-border', 'cell-readonly', 'text-right']},
          {headerName: 'Độ trễ', headerTooltip: 'Độ trễ', field: 'leadTime', resizable: true, cellClass: ['cell-border', 'cell-readonly', 'text-right']},
          {headerName: 'Mã số thuế', headerTooltip: 'Mã số thuế', field: 'taxCode', resizable: true, cellClass: ['cell-border', 'cell-readonly', 'text-right']},
          {headerName: 'Mã quốc gia', headerTooltip: 'Mã quốc gia', field: 'ctCode', resizable: true},
        ],
      },
      {
        headerName: 'Thông tin liên hệ',
        headerTooltip: 'Thông tin liên hệ',
        children: [
          {headerName: 'Email', headerTooltip: 'Email', field: 'email', resizable: true},
          {headerName: 'Số tài khoản', headerTooltip: 'Số tài khoản', field: 'accNo', resizable: true},
          {headerName: 'Mã ngân hàng', headerTooltip: 'Mã ngân hàng', field: 'bankCode', resizable: true},
          {headerName: 'Phụ trách', headerTooltip: 'Phụ trách', field: 'pic', resizable: true},
          {headerName: 'DĐ NLH', headerTooltip: 'DĐ NLH', field: 'pic_mobi', resizable: true},
          {headerName: 'ĐT NLH', headerTooltip: 'ĐT NLH', field: 'pic_tel', resizable: true},
        ],
      },
    ];
  }

  ngOnInit() {
  }

  refreshSupplier() {
    this.selectData = undefined;
    this.getSupplies();

  }

  callbackSupplier(params) {
    params.api.setRowData();
    this.gridParams = params;
    this.getSupplies();
  }

  private getSupplies() {
    this.loadingService.setDisplay(true);
    this.suppliersApi.getSuppliersByCurrentDealer().subscribe(res => {
      this.suppliers = res || [];
      this.gridParams.api.setRowData(this.suppliers);
      const allColumnIds = [];
      this.gridParams.columnApi.getAllColumns().forEach((column) => {
          allColumnIds.push(column.colId);
      });
      this.gridParams.columnApi.autoSizeColumns(allColumnIds);
      this.loadingService.setDisplay(false);
    });
  }

  getParamsSupplier() {
    const selected = this.gridParams.api.getSelectedRows();
    if (selected) {
      this.selectData = selected[0];
    }
  }

  updateSupplier() {
    this.selectData
      ? this.updateSupplierCatalog.open(this.selectData)
      : this.swalAlertService.openWarningToast('Chưa chọn dữ liệu, hãy chọn ít nhất một dòng');
  }

  deleteSupplier() {
    this.selectData
      ? this.confirm.openConfirmModal('Bạn có muốn xóa bản ghi này?').subscribe(() => {
        this.loadingService.setDisplay(true);
        this.suppliersApi.remove(this.selectData.id).subscribe(() => {
          this.loadingService.setDisplay(false);
          this.refreshSupplier();
          this.swalAlertService.openSuccessToast();
        });
      })
      : this.swalAlertService.openWarningToast('Chưa chọn dữ liệu, hãy chọn ít nhất một dòng');
  }
}
