import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {forkJoin} from 'rxjs';
import {concatMap} from 'rxjs/operators';

import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {LoadingService} from '../../../shared/loading/loading.service';
import {
  PartsExportCustomerInfo,
  PartsExportPartDetailPrepick,
  PartsExportPartDetailShipping,
  PartsExportPartOfRo,
  PartsExportPartsOfRoAndShip,
  PartsExportRoModel
} from '../../../core/models/parts-management/parts-export.model';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {PartsExportApi} from '../../../api/parts-management/parts-export.api';
import {GridTableService} from '../../../shared/common-service/grid-table.service';
import {AgDataValidateService} from '../../../shared/ag-grid-table/ag-data-validate/ag-data-validate.service';
import {AgSelectRendererComponent} from '../../../shared/ag-select-renderer/ag-select-renderer.component';
import {TMSSTabs} from '../../../core/constains/tabs';
import {EventBusService} from '../../../shared/common-service/event-bus.service';
import {StatusColor, StatusColorLabel} from '../status-color.enum';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parts-export',
  templateUrl: './parts-export.component.html',
  styleUrls: ['./parts-export.component.scss']
})
export class PartsExportComponent implements OnInit, OnChanges {
  @ViewChild('partsExportSingleSlipModal', {static: false}) partsExportSingleSlipModal;
  @ViewChild('partsExportViewSlipModal', {static: false}) partsExportViewSlipModal;
  @Input() partExportInitialData: {
    ro: string,
    type: number,
    plate: string,
    searchOnStart: boolean,
  };
  searchForm: FormGroup;
  roDetailForm: FormGroup;
  fieldGridRo;
  roParams;
  selectedRo: PartsExportRoModel;
  roData: PartsExportRoModel[] = [];
  paginationTotalsData: number;
  paginationParams;
  fieldGridPartsOfRo;
  partsOfRoParams;
  selectedPart: PartsExportPartOfRo;
  frameworkComponents;
  displayedParts: Array<PartsExportPartOfRo> = [];
  partsAndShipStatusOfRo: PartsExportPartsOfRoAndShip;
  customerInfo: PartsExportCustomerInfo;
  partShippingHistory: PartsExportPartDetailShipping[];
  prepickListOfRo: PartsExportPartDetailPrepick[];
  totalPriceBeforeTax;
  taxOnly;
  totalPriceIncludeTax;
  tabs: Array<any>;
  selectedTab: string;
  enableButtonOrderBO;

  exportTypeArr = [
    {key: 0, value: 'Lệnh sửa chữa'},
    {key: 1, value: 'Bán lẻ phụ tùng'},
    {key: 2, value: 'Đặt hẹn'}
  ];

  statusArr = [
    {key: 2, value: 'Trả lại'},
    {key: 0, value: 'Pre-pick'},
    {key: 3, value: 'Xuất'}
  ];

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private dataFormatService: DataFormatService,
    private partsExportApi: PartsExportApi,
    private gridTableService: GridTableService,
    private agDataValidateService: AgDataValidateService,
    private eventBus: EventBusService
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.searchForm && this.roParams) {
      this.searchForm.patchValue(changes.partExportInitialData.currentValue);
      if (changes.partExportInitialData.currentValue.searchOnStart) {
        this.searchRo();
      }
    }
  }

  ngOnInit() {
    this.frameworkComponents = {
      agSelectRendererComponent: AgSelectRendererComponent
    };
    this.fieldGridRo = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        field: 'stt',
        width: 80
      },
      {
        headerName: 'RO',
        headerTooltip: 'RO',
        field: 'ro'
      },
      {
        headerName: 'Biển số xe',
        headerTooltip: 'Biển số xe',
        field: 'plate'
      }
    ];
    this.fieldGridPartsOfRo = [
      {
        headerName: '',
        headerTooltip: '',
        children: [
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
            width: 90,
            cellStyle: params => (params.data.slCon === 0 && params.data.slThucXuat === params.data.slDaXuat)
              ? ({'background-color': `${StatusColor.COMPLETE} !important`}) : this.backgroundColorForGrid(params)
          },
          {
            headerName: 'Tên PT',
            headerTooltip: 'Tên phụ tùng',
            valueGetter: params => {
               return params.data && params.data.partsNameVn && !!params.data.partsNameVn
                 ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '' ;
            },
            cellStyle: params => (params.data.slCon === 0 && params.data.slThucXuat === params.data.slDaXuat)
              ? ({'background-color': `${StatusColor.COMPLETE} !important`}) : this.backgroundColorForGrid(params)
          },
          {
            headerName: 'ĐVT',
            headerTooltip: 'Đơn vị tính',
            field: 'unit',
            width: 50
          }
        ]
      },
      {
        headerName: 'Số lượng',
        headerTooltip: 'Số lượng',
        children: [
          {
            headerName: 'Tồn',
            headerTooltip: 'Tồn',
            field: 'slTon',
            width: 40,
            cellClass: ['cell-border', 'cell-readonly', 'text-right'],
            tooltip: params => this.dataFormatService.numberFormat(params.value),
            valueFormatter: params => this.dataFormatService.numberFormat(params.value)
          },
          {
            headerName: 'Đã đặt',
            headerTooltip: 'Đã đặt',
            field: 'slConDatBo',
            width: 60,
            cellClass: ['cell-border', 'cell-readonly', 'text-right'],
            tooltip: params => this.dataFormatService.numberFormat(params.value),
            valueFormatter: params => this.dataFormatService.numberFormat(params.value)
          },
          {
            headerName: 'Cần',
            headerTooltip: 'Cần',
            field: 'slCan',
            width: 40,
            cellClass: ['cell-border', 'cell-readonly', 'text-right'],
            tooltip: params => this.dataFormatService.numberFormat(params.value),
            valueFormatter: params => this.dataFormatService.numberFormat(params.value)
          },
          {
            headerName: 'Xuất',
            headerTooltip: 'Xuất',
            field: 'slXuat',
            width: 40,
            cellClass: ['cell-border', 'cell-readonly', 'text-right'],
            validators: ['floatNumber'],
            editable: true,
            tooltip: params => this.dataFormatService.numberFormat(params.value),
            valueFormatter: params => this.dataFormatService.numberFormat(this.dataFormatService.roundNumber(params.value, 2))
          },
          {
            headerName: 'Đã Xuất',
            headerTooltip: 'Đã Xuất',
            field: 'slDaXuat',
            width: 60,
            cellClass: ['cell-border', 'cell-readonly', 'text-right'],
            tooltip: params => this.dataFormatService.numberFormat(params.value),
            valueFormatter: params => this.dataFormatService.numberFormat(params.value)
          },
          {
            headerName: 'Nợ',
            headerTooltip: 'Nợ',
            field: 'slCon',
            width: 40,
            cellClass: ['cell-border', 'cell-readonly', 'text-right'],
            tooltip: params => this.dataFormatService.numberFormat(params.value),
            valueFormatter: params => this.dataFormatService.numberFormat(params.value)
          }
        ]
      },
      {
        headerName: '',
        headerTooltip: '',
        children: [
          {
            headerName: 'Đơn giá',
            headerTooltip: 'Đơn giá',
            field: 'price',
            width: 70,
            cellClass: ['cell-border', 'cell-readonly', 'text-right'],
            tooltip: params => this.dataFormatService.formatMoney(params.value),
            valueFormatter: params => this.dataFormatService.formatMoney(params.value)
          },
          {
            headerName: 'Thành tiền',
            headerTooltip: 'Thành tiền',
            field: 'sumPrice',
            width: 80,
            cellClass: ['cell-border', 'cell-readonly', 'text-right'],
            tooltip: params => this.dataFormatService.formatMoney(Math.round(params.value)),
            valueFormatter: params => this.dataFormatService.formatMoney(Math.round(params.value))
          },
          {
            headerName: 'Thuế (%)',
            headerTooltip: 'Thuế (%)',
            field: 'rate',
            width: 70,
            cellClass: ['cell-border', 'cell-readonly', 'text-right']
          },
          {
            headerName: 'Vị trí',
            headerTooltip: 'Vị trí',
            field: 'locationNo',
            width: 50,
            editable: true,
            cellClass: ['cell-border']
          },
          {
            headerName: 'Trạng thái',
            headerTooltip: 'Trạng thái',
            field: 'statusName',
            width: 80,
            cellEditor: 'agRichSelectCellEditor',
            cellEditorParams: {
              values: this.statusArr.map(status => status.value)
            },
            editable: true,
            cellClass: ['cell-border']
            // cellRenderer: 'agSelectRendererComponent',
            // required: true,
            // cellClass: ['p-0', 'cell-border'],
            // list: [
            //   { key: 2, value: 'Trả lại' },
            //   { key: 0, value: 'Pre-pick' },
            //   { key: 3, value: 'Xuất' },
            // ],
          },
          {
            headerName: 'Vị trí SOP',
            headerTooltip: 'Vị trí SOP',
            field: 'prepickLocationNo',
            width: 100,
            editable: true,
            cellClass: ['cell-border']
          },
          {
            headerName: 'Loại PT',
            headerTooltip: 'Loại phụ tùng',
            field: 'genuine',
            width: 120,
            valueFormatter: params => params.value === 'Y' ? 'Chính hãng' : params.value === 'N' ? 'Không chính hãng' : ''
          },
        ]
      }
    ];
    this.initTabs();
    this.selectedTab = this.tabs[0].tab;
    this.buildForm();
    if (this.roParams && this.partExportInitialData && this.partExportInitialData.searchOnStart) {
      this.searchRo();
    }
  }

  backgroundColorForGrid(params) {
    if (params.data.color && params.data.color.shippingStatusName) {
      switch (params.data.color.shippingStatusName) {
        case StatusColorLabel.PREPICK:
          return {'background-color': `${StatusColor.PREPICK} !important`};
        case StatusColorLabel.PREPICK_OLD:
          return {'background-color': `${StatusColor.CANCEL_PREPICK_OLD} !important`};
        case StatusColorLabel.CANCEL_PREPICK:
          return {'background-color': `${StatusColor.CANCEL_PREPICK} !important`};
        case StatusColorLabel.CANCEL_PREPICK_OLD:
          return {'background-color': `${StatusColor.CANCEL_PREPICK_OLD} !important`};
        case StatusColorLabel.COMPLETE:
          return {'background-color': `${StatusColor.COMPLETE} !important`};
        case StatusColorLabel.RETURN:
          return {'background-color': `${StatusColor.RETURN} !important`};
      }
    }
    return {};
  }

  // =====**** RO INFO GRID ****=====
  callbackRoInfo(params) {
    this.roParams = params;

    this.searchRo();
  }

  getParamsRoInfo() {
    const selectedRo = this.roParams.api.getSelectedRows();
    if (selectedRo) {
      this.selectedRo = selectedRo[0];
      this.selectedPart = undefined;
      this.getRoDetail();
    }
  }

  changePaginationParams(paginationParams) {
    if (!this.roData) {
      return;
    }
    this.paginationParams = paginationParams;
    this.searchRo();
  }

  searchRo() {
    this.loadingService.setDisplay(true);
    this.partsExportApi.searchRo(this.searchForm.value, this.paginationParams).subscribe(roData => {
      this.loadingService.setDisplay(false);
      this.roData = roData.list;
      this.paginationTotalsData = roData.total;
      if (this.roParams) {
        this.roParams.api.setRowData(this.gridTableService.addSttToData(this.roData));
      }

      // Clear detail data nếu api trả về rỗng
      if (this.roData.length) {
        // this.gridTableService.autoSelectRow(this.roParams, this.roData, this.selectedRo, 'reqId');
        this.gridTableService.selectFirstRow(this.roParams);
        this.gridTableService.setFocusCellDontEdit(this.roParams, 'stt', 0);
      } else {
        this.customerInfo = {
          plate: null,
          customerName: null,
          model: null,
          taxNo: null,
          advisor: null,
          address: null
        };
        this.selectedRo = undefined;
        this.partsAndShipStatusOfRo = {parts: [], ship: false};
        this.partShippingHistory = [];

        this.roDetailForm.patchValue(this.customerInfo);
        this.partsOfRoParams.api.setRowData(this.partsAndShipStatusOfRo.parts);
      }
    });
  }

  // =====**** PARTS OF RO GRID ****=====
  getRoDetail() {
    this.loadingService.setDisplay(true);
    forkJoin([
        this.partsExportApi.getCustomerDetail(this.selectedRo),
        this.partsExportApi.getPartOfRo(this.selectedRo),
        this.partsExportApi.getPrepickOfRo(this.selectedRo)
      ]
    ).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.customerInfo = res[0];
      this.partsAndShipStatusOfRo = res[1];
      this.prepickListOfRo = res[2];
      this.roDetailForm.patchValue(this.customerInfo);
      this.setPartsOfRo();

      if (this.partsAndShipStatusOfRo.parts && this.partsAndShipStatusOfRo.parts.length) {
        this.enableButtonOrderBO = (this.partsAndShipStatusOfRo.parts.find(it => it.slTon < it.slCan));
      }
    });
  }

  setPartsOfRo() {
    this.partsOfRoParams.api.setRowData(this.gridTableService.addSttToData(this.partsAndShipStatusOfRo.parts));
    // Clear detail data nếu api trả về rỗng
    if (this.partsAndShipStatusOfRo.parts.length) {
      this.gridTableService.selectFirstRow(this.partsOfRoParams);
    } else {
      this.partShippingHistory = [];
    }
    this.getDisplayedParts();
    this.calculateFooterDetail();
  }

  callbackPartsOfRo(params) {
    this.partsOfRoParams = params;
  }

  getParamsPartsOfRo() {
    const selectedPart = this.partsOfRoParams.api.getSelectedRows();
    if (selectedPart) {
      this.selectedPart = selectedPart[0];
      this.getPartShippingHistory();
    }
  }

  getPartShippingHistory() {
    this.loadingService.setDisplay(true);
    this.partsExportApi.getPartShippingHistory(this.selectedPart).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.partShippingHistory = res;
    });
  }

  cellEditingStopped(params) {
    params.data.slXuat = this.dataFormatService.roundNumber(params.data.slXuat, 2);
    const field = params.colDef.field;
    const slTon = params.data.slTon;
    const slXuat = +params.data.slXuat;
    const slDaXuat = +params.data.slDaXuat;
    const slCon = params.data.slCon;
    if (field === 'statusName') {
      const matchStatus = this.statusArr.find(status => status.value === params.value);
      params.data.status = matchStatus.key;
      params.api.refreshCells();
    }
    if (field === 'slXuat') {
      if (slXuat > slTon) {
        this.swalAlertService.openWarningToast('Số lượng trong kho không đủ để thực hiện lệnh xuất này');
        this.gridTableService.startEditCell(params);
      } else if (slXuat > slCon) {
        this.swalAlertService.openWarningToast('Số lượng xuất phải nhỏ hơn hoặc bằng số lượng còn thiếu');
        this.gridTableService.startEditCell(params);
        /*} else if (slXuat < -slCon) {
          this.swalAlertService.openWarningToast('Số lượng xuất âm phải lớn hơn hoặc bằng Số lượng còn thiếu');
          this.gridTableService.startEditCell(params);*/
      } else {
        params.data.slXuat = +params.data.slXuat;
        params.data.sumPrice = (params.data.slXuat + slDaXuat) * +params.data.price;
        params.api.refreshCells();
        this.calculateFooterDetail();
      }
    }
    this.getDisplayedParts();
    this.selectedPart = params.data;
  }

  // =====***** EXPORT ORDER *****=====
  export() {
    if (!this.selectedPart) {
      this.swalAlertService.openWarningToast('Bạn chưa chọn phụ tùng');
      return;
    } else if (!this.selectedPart.slXuat && this.selectedPart.status === 3) {
      this.swalAlertService.openWarningToast('Phụ tùng đã chọn chưa có số lượng xuất');
      return;
    }
    if (this.selectedPart.status === 0 && !this.selectedPart.prepickLocationNo) {
      this.swalAlertService.openWarningToast('Trạng thái là "Pre-pick". Yêu cầu nhập "Vị trí Pre-pick"');
      return;
    }
    const val = {
      customer: this.customerInfo,
      partShippingDetail: [this.selectedPart],
      ro: this.selectedRo
    };
    this.loadingService.setDisplay(true);
    this.partsExportApi.exportSinglePart(val)
      .pipe(concatMap(() => this.partsExportApi.getPartOfRo(this.selectedRo)))
      .subscribe(() => {
        this.loadingService.setDisplay(false);
        this.getRoDetail();
        if (this.selectedPart.status === 3) {
          this.partsExportSingleSlipModal.open(this.customerInfo, this.partsAndShipStatusOfRo);
        }
      });
  }

  get rowToExport() {
    const editedRow = [];
    let validPrepick = true;
    if (this.agDataValidateService.validateDataGrid(this.partsOfRoParams, this.fieldGridPartsOfRo, this.displayedParts)) {
      let i = 0;
      while (i < this.displayedParts.length) {
        if (this.displayedParts[i].status === 0 && !this.displayedParts[i].prepickLocationNo) {
          this.swalAlertService.openWarningToast(`Dòng ${i + 1}, Trạng thái là "Pre-pick". Yêu cầu nhập "Vị trí Pre-pick"`);
          validPrepick = false;
          break;
        } else {
          if (this.displayedParts[i].slXuat) {
            editedRow.push(this.displayedParts[i]);
          }
          i++;
        }
      }
    }
    return validPrepick ? editedRow : validPrepick;
  }

  exportAllParts() {
    if (!this.selectedRo) {
      this.swalAlertService.openWarningToast('Bạn chưa chọn RO');
      return;
    }
    if (!this.rowToExport) {
      return;
    }
    const val = {
      customer: this.customerInfo,
      partShippingDetail: this.rowToExport,
      ro: this.selectedRo
    };
    this.loadingService.setDisplay(true);
    this.partsExportApi.exportAllPart(val)
      .pipe(concatMap(() => this.partsExportApi.getPartOfRo(this.selectedRo)))
      .subscribe(() => {
        this.loadingService.setDisplay(false);
        this.getRoDetail();
        this.partsExportSingleSlipModal.open(this.customerInfo);
      });

    // forkJoin(
    //   this.partsExportApi.exportAllPart(val),
    //   this.partsExportApi.getPartOfRo(this.selectedRo),
    // ).subscribe(res => {
    //   this.loadingService.setDisplay(false);
    //   this.partsAndShipStatusOfRo = res[1];
    //   this.partsOfRoParams.api.setRowData(this.gridTableService.addSttToData(this.partsAndShipStatusOfRo.parts));
    //   this.gridTableService.selectFirstRow(this.partsOfRoParams);
    //   this.partsExportSingleSlipModal.open(this.customerInfo);
    // });
  }

  // =====****  ****=====

  getDisplayedParts() {
    this.displayedParts = this.gridTableService.getAllData(this.partsOfRoParams);
  }

  calculateFooterDetail() {
    const footerDetail = this.gridTableService.calculateFooterDetail(this.displayedParts);
    this.totalPriceBeforeTax = footerDetail.totalPriceBeforeTax;
    this.taxOnly = footerDetail.taxOnly;
    this.totalPriceIncludeTax = footerDetail.totalPriceIncludeTax;
  }

  viewExportSlip() {
    if (!this.selectedRo) {
      this.swalAlertService.openWarningToast('Bạn chưa chọn RO');
      return;
    }
    this.partsExportViewSlipModal.open(this.customerInfo);
  }

  // get exportedParts(): Array<PartsExportPartOfRo> {
  //   const exportedParts = [];
  //   this.partsAndShipStatusOfRo.parts.forEach(part => {
  //     if (part.slDaXuat) {
  //       exportedParts.push(part);
  //     }
  //   });
  //   return exportedParts;
  // }

  private initTabs() {
    this.tabs = [
      {name: 'Chi tiết xuất phụ tùng', tab: 'boPartsExportDetail'},
      {name: 'Danh sách Prepick', tab: 'prepickInfo'}
    ];
  }

  selectTab(tab) {
    this.selectedTab = tab;
  }

  get disableXuatBtn(): boolean {
    if (!this.selectedPart) {
      return true;
    } else {
      if (this.selectedPart.status !== 2) {
        return (!this.selectedPart.slCon || !this.selectedPart.slXuat);
      }
      if (this.selectedPart.status !== 2) {
        return this.selectedPart.slXuat < 0;
      }
    }
  }

  get disableXuatTatCaBtn(): boolean {
    if (!this.partsOfRoParams) {
      return true;
    }
    if (!this.displayedParts.length) {
      return true;
    } else {
      let disabled = true;
      for (const value of this.displayedParts) {
        if (value.slXuat) {
          disabled = false;
        }
      }
      return disabled;
    }
  }

  get disableXemPhieuXuatBtn() {
    if (!this.selectedRo || !this.partsAndShipStatusOfRo) {
      return true;
    } else {
      return !this.partsAndShipStatusOfRo.ship;
    }
  }

  private buildForm() {
    this.searchForm = this.formBuilder.group({
      ro: [this.partExportInitialData ? this.partExportInitialData.ro : null],
      type: [this.partExportInitialData && this.partExportInitialData.type ? this.partExportInitialData.type : 0],
      plate: [this.partExportInitialData ? this.partExportInitialData.plate : null]
    });

    this.roDetailForm = this.formBuilder.group({
      plate: [undefined],
      customerName: [undefined],
      model: [undefined],
      taxNo: [undefined],
      advisor: [undefined],
      address: [undefined]
    });
    this.roDetailForm.disable();
  }

  orderPartBo() {
    this.eventBus.emit({
      type: 'openComponent',
      functionCode: TMSSTabs.dlrBoPartsRequest,
      data: {
        type: this.searchForm.value.type,
        ro: this.selectedRo.ro
      }
    });
  }
}
