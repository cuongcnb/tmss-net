import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {LoadingService} from '../../../shared/loading/loading.service';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {GridTableService} from '../../../shared/common-service/grid-table.service';
import {BoOrderFollowupApi} from '../../../api/parts-management/bo-order-followup.api';
import {BoPartsFollowupNvptModel} from '../../../core/models/parts-management/bo-parts-followup-nvpt.model';
import {DownloadService} from '../../../shared/common-service/download.service';
import {ValidateBeforeSearchService} from '../../../shared/common-service/validate-before-search.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'bo-order-followup-nvpt',
  templateUrl: './bo-order-followup-nvpt.component.html',
  styleUrls: ['./bo-order-followup-nvpt.component.scss']
})
export class BoOrderFollowupNvptComponent implements OnInit {
  @ViewChild('editModal', {static: false}) editModal;
  form: FormGroup;

  fieldGrid;
  params;
  selectedPart: BoPartsFollowupNvptModel;
  data: Array<BoPartsFollowupNvptModel>;

  paginationParams;
  paginationTotalsData: number;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private dataFormatService: DataFormatService,
    private gridTableService: GridTableService,
    private boOrderFollowupApi: BoOrderFollowupApi,
    private downloadService: DownloadService,
    private validateBeforeSearchService: ValidateBeforeSearchService
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.fieldGrid = [
      {
        headerName: 'Biển số',
        headerTooltip: 'Biển số',
        field: 'bienso',
        pinned: true,
        width: 50,
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'}
      },
      {
        headerName: 'Cố vấn dịch vụ',
        headerTooltip: 'Cố vấn dịch vụ',
        field: 'cvdv',
        pinned: true,
        width: 50,
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'}

      },
      {
        headerName: 'Lệnh sửa chữa',
        headerTooltip: 'Lệnh sửa chữa',
        field: 'lenhsuachua',
        pinned: true,
        width: 50,
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'}

      },
      {
        headerName: 'Số đơn hàng',
        headerTooltip: 'Số đơn hàng',
        field: 'orderNo',
        pinned: true,
        width: 100,
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'}

      },
      {
        headerName: 'Mã phụ tùng',
        headerTooltip: 'Mã phụ tùng',
        field: 'custOrdPartNo',
        pinned: true,
        width: 100,
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'}

      },
      {
        headerName: 'Mã TMV xử lý',
        headerTooltip: 'Mã TMV xử lý',
        field: 'matmvxuly',
        pinned: true,
        width: 100,
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'}

      },
      {
        headerName: 'SL Đặt',
        headerTooltip: 'Số lượng Đặt',
        field: 'originalQty',
        pinned: true,
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'},

        width: 50
      },
      {
        headerName: 'Nguồn',
        headerTooltip: 'Nguồn',
        field: 'supplierName',
        pinned: true,
        width: 100,
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'}

      },
      {
        headerName: 'ETA Tiêu chuẩn',
        headerTooltip: 'ETA Tiêu chuẩn',
        field: 'standardEta',
        width: 80,
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'}

      },
      {
        headerName: 'Thời gian ĐH',
        headerTooltip: 'Thời gian đặt hàng',
        field: 'overdue',
        width: 50,
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'}

      },
      {
        headerName: 'Ngày CVDV y/c ĐH',
        headerTooltip: 'Ngày CVDV y/c ĐH',
        field: 'requestDate',
        width: 80,
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'},

        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value)
      },
      {
        headerName: 'ĐL đặt hàng',
        headerTooltip: 'ĐL đặt hàng',
        field: 'custOrderDate',
        width: 80,
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'},

        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value)
      },
      {
        headerName: 'TMV đặt hàng',
        headerTooltip: 'TMV đặt hàng',
        field: 'tmvOrderDate',
        width: 80,
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'},

        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value)
      },
      {
        headerName: 'ETD',
        headerTooltip: 'ETD',
        field: 'boEtd1',
        width: 80,
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'},

        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value)
      },
      {
        headerName: 'ETA VN',
        headerTooltip: 'ETA VN',
        field: 'etaVn',
        width: 80,
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'},

        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value)
      },
      {
        headerName: 'Thủ tục hải quan',
        headerTooltip: 'Thủ tục hải quan',
        field: 'cclearance',
        width: 80,
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'},

        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value)
      },
      {
        headerName: 'ETA TMV',
        headerTooltip: 'ETA TMV',
        field: 'eta1',
        width: 80,
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'},

        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value)
      },
      {
        headerName: 'ATA Đại lý',
        headerTooltip: 'ATA Đại lý',
        field: 'ataTmv',
        width: 80,
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'},

        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value)
      },
      {
        headerName: 'Đã có Invoice hàng về',
        headerTooltip: 'Đã có Invoice hàng về',
        field: 'supplierInvoiceNo',
        width: 50,
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'}

      },
      {
        headerName: 'Quá hạn tại DLR',
        headerTooltip: 'Quá hạn tại DLR',
        field: 'ptQuahan',
        width: 50,
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'}

      },
      {
        headerName: 'Lý do chậm',
        headerTooltip: 'Lý do chậm',
        field: 'reasonDelay',
        width: 100,
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'}

      },
      {
        headerName: 'Mới cập nhật trong 2 ngày',
        headerTooltip: 'Mới cập nhật trong 2 ngày',
        field: 'news',
        width: 50,
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'}

      },
      {
        headerName: 'Vị trí giá hàng SOP',
        headerTooltip: 'Vị trí giá hàng SOP',
        field: 'vitrigiahangsop',
        width: 50,
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'}

      },
      {
        headerName: 'Thời gian hẹn khách',
        headerTooltip: 'Thời gian hẹn khách',
        field: 'ngayDatHen',
        width: 80,
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'},

        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value)
      },
      {
        headerName: 'Ghi chú',
        headerTooltip: 'Ghi chú',
        field: 'ghichu',
        width: 100,
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'}

      }
    ];
  }

  callbackGrid(params) {
    this.params = params;
  }

  getParams() {
    const selectedPart = this.params.api.getSelectedRows();
    if (selectedPart) {
      this.selectedPart = selectedPart[0];
    }
  }

  changePaginationParams(paginationParams) {
    if (!this.data) {
      return;
    }
    this.paginationParams = paginationParams;
    this.search();
  }

  search() {
    const formValue = this.validateBeforeSearchService.setBlankFieldsToNull(this.form.value);
    this.loadingService.setDisplay(true);
    this.boOrderFollowupApi.searchPartForNvpt(formValue, this.paginationParams).subscribe(data => {
      this.data = data.list;
      this.paginationTotalsData = data.total;
      this.params.api.setRowData(this.gridTableService.addSttToData(this.data));
      this.gridTableService.selectFirstRow(this.params);
      this.loadingService.setDisplay(false);
      const allColumnIds = [];
      this.params.columnApi.getAllColumns().forEach((column) => allColumnIds.push(column.colId));
      setTimeout(() => {
        this.params.columnApi.autoSizeColumns(allColumnIds);
      });
    });
  }

  editPart() {
    if (!this.selectedPart) {
      this.swalAlertService.openWarningToast('Bạn chưa chọn phụ tùng, hãy chọn một phụ tùng để xem chi tiết');
      return;
    }
    this.editModal.open(this.selectedPart);
  }

  exportExcel() {
    const formValue = this.validateBeforeSearchService.setBlankFieldsToNull(this.form.value);
    this.loadingService.setDisplay(true);
    this.boOrderFollowupApi.exportDataNvpt(formValue).subscribe((data) => {
      this.downloadService.downloadFile(data);
      this.loadingService.setDisplay(false);
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      ata: [0],
      orderNo: [undefined],
      partsCode: [undefined],
      ro: [undefined],
      advisor: [undefined],
      plateNo: [undefined],
      today: [{value: this.dataFormatService.parseTimestampToDate(new Date().getTime()), disabled: true}]
    });
  }
}
