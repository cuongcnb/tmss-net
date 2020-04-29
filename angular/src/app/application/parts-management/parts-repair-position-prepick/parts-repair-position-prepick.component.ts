import { Component, OnInit } from '@angular/core';
import { PartsRepairPositionPrepickApi } from '../../../api/parts-management/parts-repair-position-prepick.api';
import { LoadingService } from '../../../shared/loading/loading.service';
import { DataFormatService } from '../../../shared/common-service/data-format.service';
import { PartsModifyPrepickApi } from '../../../api/parts-management/parts-modify-prepick.api';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GridTableService } from '../../../shared/common-service/grid-table.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parts-repair-position-prepick',
  templateUrl: './parts-repair-position-prepick.component.html',
  styleUrls: ['./parts-repair-position-prepick.component.scss'],
})
export class PartsRepairPositionPrepickComponent implements OnInit {
  form: FormGroup;

  fieldInvoice;
  invoiceList;
  invoiceParams;

  selectedInvoice;

  fieldParts;
  partsList;
  partsParams;

  constructor(
    private partsRepairPositionPrepickApi: PartsRepairPositionPrepickApi,
    private loadingService: LoadingService,
    private dataFormatService: DataFormatService,
    private partsModifyPrepickApi: PartsModifyPrepickApi,
    private toastService: ToastService,
    private formbuilder: FormBuilder,
    private gridTableService: GridTableService,
  ) {
  }

  ngOnInit() {
    this.fieldInvoice = [
      {headerName: 'Số phiếu', headerTooltip: 'Số phiếu', field: 'soPhieuGh'},
      {headerName: 'Số ĐH', headerTooltip: 'Số đơn hàng', field: 'soDh'},
      {
        headerName: 'Ngày nhận',
        headerTooltip: 'Ngày nhận',
        field: 'ngayNhan',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
      },
      {headerName: 'Người nhận', headerTooltip: 'Người nhận', field: 'nguoiNhan'},
      {headerName: 'Số RO', headerTooltip: 'Số RO', field: 'soRo'},
      {headerName: 'BSX', headerTooltip: 'Biển số xe', field: 'bienSoXe'},
      {headerName: 'CVDV', headerTooltip: 'Cố vấn dịch vụ', field: 'tenCvdv'},
    ];
    this.fieldParts = [
      {headerName: 'Mã phụ tùng', headerTooltip: 'Mã phụ tùng', field: 'partscode'},
      {headerName: 'Tên phụ tùng', headerTooltip: 'Tên phụ tùng', field: 'partsname'},
      {headerName: 'SL', headerTooltip: 'Số lượng', field: 'qty'},
      {
        headerName: 'Vị trí Prepick',
        headerTooltip: 'Vị trí Prepick',
        field: 'locationno',
        editable: true,
        cellClass: ['cell-clickable', 'cell-border'],
      },
    ];
    this.buildForm();
  }

  callbackInvoice(params) {
    this.invoiceParams = params;
    this.search();
  }

  getParamsInvoice() {
    const selectedInvoice = this.invoiceParams.api.getSelectedRows();
    if (selectedInvoice) {
      this.selectedInvoice = selectedInvoice[0];
      this.searchParts();
    }
  }

  callbackParts(params) {
    this.partsParams = params;
  }

  search() {
    this.loadingService.setDisplay(true);
    this.partsModifyPrepickApi.search(this.form.value.keySearch).subscribe(val => {
      if (val) {
        this.invoiceList = val;
        this.invoiceParams.api.setRowData(this.invoiceList);
        this.gridTableService.selectFirstRow(this.invoiceParams);
      }
      this.loadingService.setDisplay(false);
    });
  }

  saveLocation() {
    this.loadingService.setDisplay(true);
    this.partsModifyPrepickApi.saveLocation(this.partsList).subscribe(val => {
      if (val) {
        this.toastService.openSuccessToast('Lưu thành công');
        this.searchParts();
      }
    });
    this.loadingService.setDisplay(false);
  }

  searchParts() {
    if (this.selectedInvoice) {
      this.loadingService.setDisplay(true);
      this.partsModifyPrepickApi.searchDetail(this.selectedInvoice.reqId, this.selectedInvoice.reqtype).subscribe((value) => {
        if (value) {
          this.partsList = value;
          this.partsParams.api.setRowData(this.partsList);
        }
        this.loadingService.setDisplay(false);
      });
    }
  }

  private buildForm() {
    this.form = this.formbuilder.group({ keySearch: [undefined], });
  }
}
