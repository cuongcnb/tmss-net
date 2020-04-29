import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoadingService} from '../../../shared/loading/loading.service';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {PartsInStockStatusModel} from '../../../core/models/parts-management/parts-in-stock-status.model';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {PartsInStockStatusApi} from '../../../api/parts-management/parts-in-stock-status.api';
import {GridTableService} from '../../../shared/common-service/grid-table.service';
import {AgSelectRendererComponent} from '../../../shared/ag-select-renderer/ag-select-renderer.component';
import {ConfirmService} from '../../../shared/confirmation/confirm.service';
import {DownloadService} from '../../../shared/common-service/download.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parts-in-stock-status',
  templateUrl: './parts-in-stock-status.component.html',
  styleUrls: ['./parts-in-stock-status.component.scss']
})
export class PartsInStockStatusComponent implements OnInit {
  form: FormGroup;
  partsForm: FormGroup;

  fieldGrid;
  params;
  selectedData: PartsInStockStatusModel;
  dataArr: Array<PartsInStockStatusModel>;
  listOfModifiedParts: Array<PartsInStockStatusModel> = [];

  paginationTotalsData: number;
  paginationParams;
  frameworkComponents;

  inStockTypeArr = [
    {key: 'Y', value: 'Dự trữ'},
    {key: 'N', value: 'Không dự trữ'}
  ];
  searchPartOnly: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private dataFormatService: DataFormatService,
    private partsInStockStatusApi: PartsInStockStatusApi,
    private gridTableService: GridTableService,
    private confirmService: ConfirmService,
    private downloadService: DownloadService
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.fieldGrid = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        field: 'stt',
        width: 40
      },
      {
        headerName: 'Mã PT',
        headerTooltip: 'Mã phụ tùng',
        field: 'partsCode',
        width: 100
      },
      {
        headerName: 'Tên PT',
        headerTooltip: 'Tên phụ tùng',
        field: 'partsNameVn',
        // valueGetter: params => {
        //   return params.data && params.data.partsNameVn ? params.data.partsNameVn : '';
        // },
        width: 120
      },
      {
        headerName: 'ĐVT',
        headerTooltip: 'Đơn vị tính',
        field: 'unit',
        width: 50
      },
      {
        headerName: 'Giá nhập',
        headerTooltip: 'Giá nhập',
        field: 'price',
        cellClass: ['cell-readonly', 'cell-border', 'text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
        width: 100
      },
      {
        headerName: 'Giá bán',
        headerTooltip: 'Giá bán',
        field: 'sellPrice',
        cellClass: ['cell-readonly', 'cell-border', 'text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
        width: 100
      },
      {
        headerName: 'Thuế',
        headerTooltip: 'Thuế',
        field: 'rate',
        cellClass: ['cell-readonly', 'cell-border', 'text-right'],
        width: 50
      },
      {
        headerName: 'SL Tồn',
        headerTooltip: 'Số lượng Tồn',
        field: 'qty',
        cellClass: ['cell-readonly', 'cell-border', 'text-right'],
        tooltip: params => this.dataFormatService.numberFormat(params.value),
        valueFormatter: params => this.dataFormatService.numberFormat(params.value),
        width: 50
      },
      {
        headerName: 'Tình trạng',
        headerTooltip: 'Tình trạng',
        field: 'instocktype',
        cellClass: ['cell-border', 'p-0'],
        cellRenderer: 'agSelectRendererComponent',
        list: this.inStockTypeArr,
        width: 100
      },
      {
        headerName: 'DAD',
        headerTooltip: 'DAD',
        field: 'dad',
        cellClass: ['cell-readonly', 'cell-border', 'text-right'],
        tooltip: params => this.dataFormatService.numberFormat(params.value),
        valueFormatter: params => this.dataFormatService.numberFormat(params.value),
        width: 50
      },
      {
        headerName: 'MIP TT',
        headerTooltip: 'MIP TT',
        field: 'mipTT',
        cellClass: ['cell-readonly', 'cell-border', 'text-right'],
        tooltip: params => this.dataFormatService.numberFormat(params.value),
        valueFormatter: params => this.dataFormatService.numberFormat(params.value),
        width: 50

      },
      {
        headerName: 'MIP LT',
        headerTooltip: 'MIP LT',
        field: 'mipLt',
        cellClass: ['cell-readonly', 'cell-border', 'text-right'],
        tooltip: params => this.dataFormatService.numberFormat(params.value),
        valueFormatter: params => this.dataFormatService.numberFormat(params.value),
        width: 50

      },
      {
        headerName: 'MIP',
        headerTooltip: 'MIP',
        field: 'mip',
        editable: true,
        type: 'number',
        validators: ['floatPositiveNum'],
        cellClass: ['cell-border', 'cell-border', 'text-right'],
        tooltip: params => this.dataFormatService.numberFormat(params.value),
        valueFormatter: params => this.dataFormatService.numberFormat(params.value),
        width: 50

      },
      {
        headerName: 'Vị trí',
        headerTooltip: 'Vị trí',
        field: 'locationNo',
        editable: true,
        type: 'text',
        cellClass: ['cell-border'],
        validators: ['maxLength'],
        maxLength: 10,
        width: 100
      }
    ];
    this.frameworkComponents = {
      agSelectRendererComponent: AgSelectRendererComponent
    };
  }

  // =====***** AG GRID *****=====
  callBackGrid(params) {
    this.params = params;
  }

  getParams() {
    const selectedData = this.params.api.getSelectedRows();
    if (selectedData) {
      this.selectedData = selectedData[0];
    }
  }

  changePaginationParams(paginationParams) {
    if (!this.dataArr) {
      return;
    }
    this.paginationParams = paginationParams;
    this.checkEditingBeforeSearch(this.searchPartOnly, true);
  }

  resetPaginationParams() {
    if (this.paginationParams) {
      this.paginationParams.page = 1;
    }
    this.paginationTotalsData = 0;
  }

  // =====***** SEARCH *****=====
  searchAndResetPagination(partsOnly, changePage) {
    if (!changePage) {
      this.resetPaginationParams();
    }
    this.search(partsOnly);
  }

  checkEditingBeforeSearch(partsOnly?, changePage?) {
    const message = 'Thao tác của bạn có thể làm mất toàn bộ dữ liệu đã được thay đổi, bạn có muốn tiếp tục?';
    if (this.listOfModifiedParts.length) {
      this.confirmService.openConfirmModal('Cảnh báo', message).subscribe(() => {
        this.searchAndResetPagination(partsOnly, changePage);
      }, () => {
      });
    } else {
      // this.resetPaginationParams();
      // this.search(partsOnly);
      this.searchAndResetPagination(partsOnly, changePage);
    }
  }

  getSearchDetail(partsOnly) {
    let searchDetail;
    this.searchPartOnly = partsOnly;
    if (partsOnly) {
      const partsForm = Object.assign({}, {
        partsCodes: this.partsForm.value.partsCodes.length > 0 ? this.partsForm.value.partsCodes.trim().split(/\s*[,]\s*/) : [],
        searchType: 2
      });
      searchDetail = partsForm;
    } else {
      const form = Object.assign({}, {
        instocktype: this.form.value.instocktype,
        partsCodes: this.form.value.partsCodes.length > 0 ? this.form.value.partsCodes.trim().split(/\s*[,]\s*/) : [],
        toyota: this.form.value.toyota,
        partsNameVn: this.form.value.partsNameVn,
        searchType: 1
      });
      searchDetail = form;
    }
    return searchDetail;
  }

  search(partsOnly?) {
    const searchDetail = this.getSearchDetail(partsOnly);
    this.loadingService.setDisplay(true);
    this.partsInStockStatusApi.searchPartInStock(searchDetail, this.paginationParams).subscribe(dataArr => {
      this.loadingService.setDisplay(false);
      this.dataArr = dataArr.list;
      this.paginationTotalsData = dataArr.total;
      this.params.api.setRowData(this.gridTableService.addSttToData(this.dataArr, this.paginationParams));
    });
  }

  // =====***** CELL EDITING *****=====
  cellValueChanged(params) {
    const field = params.colDef.field;
    if (field === 'instocktype' || field === 'mip' || field === 'locationNo') {
      if (field === 'mip') {
        params.data.mip = parseFloat(params.data.mip);
      }
      if (params.column.editingStartedValue !== params.data[field]) {
        this.getModifiedParts(params.data);
      }
    }
  }

  getModifiedParts(rowData) {
    const index = this.listOfModifiedParts.indexOf(rowData);
    if (index > -1) {
      this.listOfModifiedParts[index] = rowData;
    } else {
      this.listOfModifiedParts.push(rowData);
    }
  }

  // =====***** SUBMIT DATA *****=====
  saveChanges() {
    if (!this.listOfModifiedParts.length) {
      this.toastService.openWarningToast('Chưa có phụ tùng nào được điều chỉnh');
      return;
    }
    this.loadingService.setDisplay(true);
    this.partsInStockStatusApi.updatePart(this.listOfModifiedParts).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.toastService.openSuccessToast();
      this.listOfModifiedParts = [];
      this.checkEditingBeforeSearch(this.searchPartOnly);
    });
  }

  exportExcel() {
    const exportDetail = this.getSearchDetail(this.searchPartOnly);
    this.loadingService.setDisplay(true);
    this.partsInStockStatusApi.exportExcel(exportDetail, this.paginationParams).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.downloadService.downloadFile(res);
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      instocktype: [undefined],
      partsCodes: [[]],
      toyota: [undefined],
      partsNameVn: [undefined],
      searchType: [1]
    });
    this.partsForm = this.formBuilder.group({
      partsCodes: [[]],
      searchType: [2]
    });
  }

  deleteCharacterSpecial(idx, val) {
    if (val && idx === 0) {
      this.form.get('partsCodes').setValue(val.replace(/[^a-zA-Z0-9]/g, ''));
      return;
    }
    if (val && idx === 1) {
      this.partsForm.get('partsCodes').setValue(val.replace(/[^a-zA-Z0-9,]/g, ''));
      return;
    }
  }

}
