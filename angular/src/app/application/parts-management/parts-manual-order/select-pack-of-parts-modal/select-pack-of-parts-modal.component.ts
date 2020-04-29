import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { DataFormatService } from '../../../../shared/common-service/data-format.service';
import { PackOfPartsApi } from '../../../../api/parts-management/pack-of-part/pack-of-parts.api';
import { PackOfPartDetailApi } from '../../../../api/parts-management/pack-of-part/pack-of-part-detail.api';
import { PackOfPartModel, PartOfPackModel } from '../../../../core/models/parts-management/pack-of-part.model';
import { GridTableService } from '../../../../shared/common-service/grid-table.service';
import { PartsOrderForStoringModel } from '../../../../core/models/parts-management/parts-order-for-storing.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'select-pack-of-parts-modal',
  templateUrl: './select-pack-of-parts-modal.component.html',
  styleUrls: ['./select-pack-of-parts-modal.component.scss']
})
export class SelectPackOfPartsModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  modalHeight: number;

  fieldGridPack;
  packParams;
  selectedPack;

  fieldGridPart;
  partParams;
  selectedPart;

  packArr: Array<PackOfPartModel>;
  partArr: Array<PartOfPackModel>;

  displayedData: Array<PackOfPartModel>;

  constructor(
    private setModalHeightService: SetModalHeightService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private dataFormatService: DataFormatService,
    private packOfPartsApi: PackOfPartsApi,
    private packOfPartDetailApi: PackOfPartDetailApi,
    private gridTableService: GridTableService,
  ) {
    this.fieldGridPack = [
      {
        headerName: 'Mã BLK',
        headerTooltip: 'Mã BLK',
        field: 'partsgroupcode',
        checkboxSelection: true,
        headerCheckboxSelection: true,
      },
      {
        headerName: 'Tên BLK',
        headerTooltip: 'Tên BLK',
        field: 'partsgroupname'
      },
      {
        headerName: 'Từ ngày',
        headerTooltip: 'Từ ngày',
        field: 'efffrom',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
      },
      {
        headerName: 'Đến ngày',
        headerTooltip: 'Đến ngày',
        field: 'effto',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
      },
      {
        headerName: 'Giá BLK',
        headerTooltip: 'Giá BLK',
        field: 'partgroupprice',
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
        cellClass: ['text-right', 'cell-border'],
      },
      {
        headerName: 'Giảm giá',
        headerTooltip: 'Giảm giá',
        field: 'pgDiscount',
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
        cellClass: ['text-right', 'cell-border'],
      },
      {
        headerName: 'SL Đặt',
        headerTooltip: 'Số lượng Đặt',
        field: 'qty',
        validators: ['required', 'number'],
        editable: true,
        cellClass: ['cell-clickable', 'text-right', 'cell-border'],
      }
    ];
    this.fieldGridPart = [
      {
        headerName: 'Mã PT',
        headerTooltip: 'Mã phụ tùng',
        field: 'partsCode'
      },
      {
        headerName: 'Tên PT',
        headerTooltip: 'Tên phụ tùng',
        valueGetter: params => {
           return params.data && params.data.partsNameVn && !!params.data.partsNameVn
             ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '' ;
        }
      },
      {
        headerName: 'ĐVT',
        headerTooltip: 'Đơn vị tính',
        field: 'unit'
      },
      {
        headerName: 'Đơn giá',
        headerTooltip: 'Đơn giá',
        field: 'price',
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
        cellClass: ['text-right', 'cell-border'],
      },
      {
        headerName: 'Số lượng',
        headerTooltip: 'Số lượng',
        field: 'qty',
        cellClass: ['text-right', 'cell-border'],
      },
      {
        headerName: 'Thành tiền',
        headerTooltip: 'Thành tiền',
        field: 'sumPrice',
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
        cellClass: ['text-right', 'cell-border'],
      },
      {
        headerName: 'Thuế',
        headerTooltip: 'Thuế',
        field: 'rate',
        cellClass: ['text-right', 'cell-border'],
      }
    ];
  }

  ngOnInit() {
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  getActivePack() {
    this.loadingService.setDisplay(true);
    this.packOfPartsApi.getAll(false).subscribe(packArr => {
      this.loadingService.setDisplay(false);
      this.packArr = packArr;
      this.packParams.api.setRowData(this.packArr);
      if (this.partArr) {
        this.gridTableService.selectFirstRow(this.packParams);
      } else {
        this.partArr = [];
        this.partParams.api.setRowData(this.partArr);
      }
    });
  }

  getPartsOfPack() {
    if (!this.selectedPack) {
      this.swalAlertService.openWarningToast('Chưa chọn Bộ linh kiện');
      return;
    }
    this.loadingService.setDisplay(true);
    this.packOfPartDetailApi.getPartOfPack(this.selectedPack.id).subscribe(partArr => {
      this.partArr = partArr;
      this.partParams.api.setRowData(this.partArr);
      this.loadingService.setDisplay(false);
    });
  }

  open() {
    this.modal.show();
  }

  reset() {
    this.packArr = [];
    this.partArr = [];
    this.packParams.api.setRowData([]);
    this.partParams.api.setRowData([]);
  }

  callBackGridPack(params) {
    this.packParams = params;
    this.getActivePack();
  }

  getParamsPack() {
    const selectedPack = this.packParams.api.getSelectedRows();
    if (selectedPack) {
      this.selectedPack = selectedPack[0];
      this.getPartsOfPack();
    }
  }

  cellEditingStopped(params) {
    const field = params.colDef.field;
    this.selectedPack = params.data;
    if (field === 'qty') {
      params.data.qty = Number(params.data.qty);
    }
  }

  callBackGridPartsOfPack(params) {
    this.partParams = params;
  }

  getParamsPartsOfPack() {
    const selectedPart = this.partParams.api.getSelectedRows();
    if (selectedPart) {
      this.selectedPart = selectedPart;
    }
  }

  getDisplayedData() {
    this.displayedData = this.gridTableService.getAllData(this.packParams);
  }

  get editedRow(): Array<PartsOrderForStoringModel> {
    this.getDisplayedData();
    const editedRow = [];
    this.displayedData.forEach(part => {
      if (part.qty > 0) {
        editedRow.push(part);
      }
    });
    return editedRow;
  }

  selectPackOfPart() {
    if (this.selectedPack) {
      this.swalAlertService.openWarningToast('Chưa chọn bộ linh kiện, hãy chọn ít nhất một bộ để tiếp tục');
    }
    this.close.emit(this.editedRow);
  }
}
