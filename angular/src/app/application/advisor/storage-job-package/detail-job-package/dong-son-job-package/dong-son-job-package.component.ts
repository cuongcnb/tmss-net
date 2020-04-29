import {
  Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ToastService } from '../../../../../shared/swal-alert/toast.service';
import { DataFormatService } from '../../../../../shared/common-service/data-format.service';
import { SrvDRcJobsApi } from '../../../../../api/master-data/warranty/srv-d-rc-jobs.api';
import { LoadingService } from '../../../../../shared/loading/loading.service';
import { GridTableService } from '../../../../../shared/common-service/grid-table.service';
import { AgSelectRendererComponent} from '../../../../../shared/ag-select-renderer/ag-select-renderer.component';
import { SubletApi } from '../../../../../api/common-api/sublet.api';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { InsuranceApi } from '../../../../../api/sales-api/insurance/insurance.api';
import { DlrConfigApi } from '../../../../../api/common-api/dlr-config.api';
import { state } from '../../../../../core/constains/ro-state';
import { ConfirmService } from '../../../../../shared/confirmation/confirm.service';
import { AgCheckboxRendererComponent } from '../../../../../shared/ag-checkbox-renderer/ag-checkbox-renderer.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dong-son-job-package',
  templateUrl: './dong-son-job-package.component.html',
  styleUrls: ['./dong-son-job-package.component.scss'],
})
export class DongSonJobPackageComponent implements OnInit, OnChanges {
  @Output() countMoney = new EventEmitter();
  @Output() chosenJob = new EventEmitter();
  @Input() proposalForm: FormGroup;
  @Input() isRefresh: boolean;
  @Input() cmId: string;
  @Input() data: Array<any>;
  @Input() tabDisplay;
  @Input() curredJob;
  @Input() roState;
  @Input() state;
  @ViewChild('searchWorkCodeModal', {static: false}) searchWorkCodeModal;
  @ViewChild('gridTable', {static: false}) gridTable;
  @ViewChild('discountModal', {static: false}) discountModal;
  fieldGrid;
  selectedNode;
  params;
  // tslint:disable-next-line:variable-name
  _isRepair;
  isCollapsed = false;
  isRepairObs;
  observer;
  disabledBtnAdd = [state.complete, state.settlement, state.cancel];
  works: Array<any> = [];
  footerData;
  fieldGridWorkCode;
  frameworkComponents;
  subletTypeList = [];
  costDealer;
  focusCellIndex = 0;
  doubleClickParams;
  disableBtnDel = [state.quotation, state.quotationTmp];

  constructor(private dataFormatService: DataFormatService,
              private gridTableService: GridTableService,
              private swalAlertService: ToastService,
              private confirmService: ConfirmService,
              private rcJobApi: SrvDRcJobsApi,
              private subletApi: SubletApi,
              private loadingService: LoadingService,
              private insuranceApi: InsuranceApi,
              private dlrConfigApi: DlrConfigApi) {
    this.fieldGridWorkCode = [
      {headerName: 'Mã CV', headerTooltip: 'Mã CV', field: 'rccode'},
      {headerName: 'Tên CV', headerTooltip: 'Tên CV', field: 'rcname'},
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'remark'},
      {headerName: 'Đ/mức giờ công', headerTooltip: 'Đ/mức giờ công', field: 'jobtime'},
      {headerName: 'H công thực tế', headerTooltip: 'H công thực tế', field: 'actualJobTime'},
    ];
    this.fieldGrid = [
      {
        headerName: 'Mã CV',
        headerTooltip: 'Mã CV',
        field: 'rccode',
        editable: true,
        cellClass: params => !params.data.subletTypeCode ? ['cell-clickable', 'cell-border', 'rccode'] : ['cell-readonly', 'cell-border'],
      },
      {
        headerName: 'Tên CV',
        headerTooltip: 'Tên CV',
        field: 'jobsname',
        width: 350,
        editable: true,
        cellClass: ['cell-clickable', 'cell-border'],
        validators: ['required'],
      },
      {
        headerName: 'Nhóm CV', headerTooltip: 'Nhóm CV', field: 'bpType',
        cellRenderer: 'agSelectRendererComponent',
        cellClass: ['cell-clickable', 'cell-border'],
        width: 300,
        list: [
          {key: 1, value: 'Sửa vết lõm'},
          {key: 2, value: 'Tháo lắp thay thế'},
          {key: 3, value: 'Nắn khung xe'},
          {key: 4, value: 'Sơn Tấm trong'},
          {key: 5, value: 'Sơn Tấm ngoài'},
          {key: 6, value: 'Sơn Cản xe'},
          {key: 7, value: 'Sơn Sơn đặc biệt'},
          {key: 8, value: 'Công việc mở rộng'},
        ],
        disableSelect: () => {
          // return !(this.roState && this.roState.toString() > 2)
        },
      },
      {
        headerName: 'Kiểu CV thuê ngoài',
        headerTooltip: 'Kiểu CV thuê ngoài',
        field: 'subletTypeCode',
        cellRenderer: 'agSelectRendererComponent',
        list: this.subletTypeList,
        disableSelect: () => {
          // return !(this.roState && this.roState.toString() > 2)
        },
        cellClass: ['cell-clickable', 'cell-border', 'p-0'],
      },
      {
        headerName: 'GC ĐM', headerTooltip: 'GC ĐM', field: 'timework', cellClass: ['text-right', 'cell-border'],
      },
      {
        headerName: 'GC TT',
        headerTooltip: 'GC TT',
        field: 'actualtime',
        validators: ['required'],
        cellClass: ['text-right', 'cell-border'],

      },
      {
        headerName: 'Thành tiền',
        headerTooltip: 'Thành tiền',
        field: 'costs',
        width: 250,
        editable: true,
        cellClass: ['cell-clickable', 'cell-border', 'text-right'],
        validators: ['required', 'number', 'positiveNumber'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
      },
      {
        headerName: 'CPVT ĐM',
        headerTooltip: 'CPVT ĐM',
        field: 'bpcost',
        cellClass: ['cell-readonly', 'cell-border', 'text-right'],
      },
      {
        headerName: 'CPVT TT',
        headerTooltip: 'CPVT TT',
        field: 'actualcost',
        cellStyle: params => !params.data.subletTypeCode ? {backgroundColor: '#FFFFCC'} : {backgroundColor: '#F5F5F5'},
        validators: ['required', 'floatPositiveNum1'],
      },
      {
        headerName: 'Ghi chú',
        headerTooltip: 'Ghi chú',
        field: 'notes',
        editable: true,
        width: 250,
      },
    ]
    ;
    this.frameworkComponents = {
      agSelectRendererComponent: AgSelectRendererComponent,
      agCheckboxRendererComponent: AgCheckboxRendererComponent,
    };
    this.isRepairObs = new Observable(observer => this.observer = observer);
  }

  ngOnInit() {
    this.getSubletTypeList();
    this.getDealerConfig();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.tabDisplay) {
      if (this.isRefresh && this.params) {
        this.params.api.setRowData([]);
      }
      if (this.params) {
        this.params.api.sizeColumnsToFit();
        this.calculateInfo();
      }
      if (changes.curredJob && changes.curredJob.currentValue) {
        changes.curredJob.currentValue.forEach(item => {
          this.addWork(item.reasoncontent);
        });
      }
      if (this.params && this.data) {
        this.params.api.setRowData(this.data);
        this.selectedNode = undefined;
        this.calculateInfo();
      }
      if (changes.roState && changes.roState.currentValue && Number(changes.roState.currentValue) >= 2 && this.params) {
        // disable chọn kiểu cv khi tạo lệnh sửa chữa
        this.fieldGrid[2].disableSelect = true;
        this.params.api.setColumnDefs(this.fieldGrid);
        this.params.api.sizeColumnsToFit();
      }
    }

  }

  @Input()
  set isRepair(value) {
    this._isRepair = value;
    if (this.observer) {
      this.observer.next(value);
    }
  }

  @Input()
  get isRepairSet() {
    return this._isRepair;
  }

  getDealerConfig() {
    // this.dlrConfigApi.getByCurrentDealer().subscribe(res => {this.costDealer = (res) ? res[0].cost : 0;});
    this.dlrConfigApi.getCurrentByDealer().subscribe(res => {this.costDealer = (res) ? (res.cost || 0) : 0;});
  }

  getSubletTypeList() {
    this.loadingService.setDisplay(true);
    this.subletApi.getAll().subscribe(subletTypeList => {
      subletTypeList.forEach(subletType => {
        this.subletTypeList.push({
          key: subletType.id,
          value: subletType.desceng,
        });
      });
      this.loadingService.setDisplay(false);
    });
  }

  callbackGrid(params) {
    this.params = params;
    if (this.data && this.data.length > 0) {
      this.params.api.setRowData(this.data);
      this.calculateInfo();
    }
  }

  getParams() {
    const selectedNode = this.params.api.getSelectedNodes();
    if (selectedNode) {
      this.selectedNode = selectedNode[0];
    }
  }

  calculateInfo() {
    if (this.params) {
      let costs = 0;
      let discount = 0;
      let taxRate = 0;

      this.works = [];
      this.params.api.forEachNode(node => {
        const data = node.data;
        this.works.push(data);
        costs += typeof data.costs === 'string' ? this.dataFormatService.parseMoneyToValue(data.costs) : data.costs;
        discount += data.discount ? this.dataFormatService.parseMoneyToValue(data.discount) : 0;
        taxRate += (data.costs - (data.discount ? data.discount : 0)) * data.taxRate / 100;
      });
      this.footerData = {
        beforeTax: costs,
        discount,
        taxRate,
        total: costs - discount + taxRate,
      };
      this.countMoney.emit(this.footerData);
    }

    const dataObj = this.gridTableService.getAllData(this.params).map(it => {
      // return Object.assign({}, it, {id: null, readjust: it.readjust ? 'Y' : 'N'})
      it.id = null;
      return it;
    });
    this.proposalForm.get('jobListDs').setValue(dataObj);
  }

  addWork(jobsname?) {
    const lastIndex = this.params.api.getLastDisplayedRow();
    if (lastIndex >= 0) {
      const lastItem = this.params.api.getDisplayedRowAtIndex(lastIndex).data;
      if ((!lastItem.jobsname || !lastItem.costs) && !jobsname) {
        return;
      }
    }
    const newVal = {
      rccode: null,
      jobsname: jobsname || null,
      bpType: 1,
      subletTypeCode: null,
      timework: null,
      actualtime: null,
      costs: null,
      bpcost: null,
      actualcost: null,
      taxRate: 0,
      discountPercent: 0,
      discount: 0,
      notes: null,
      version: (this.proposalForm.getRawValue().quotationprint || 0) + 1,
      fix: null,
      jobtime: null,
    };

    this.params.api.updateRowData({add: [newVal]});
    this.params.api.getModel().rowsToDisplay[lastIndex + 1].setSelected(true);
    this.params.api.startEditingCell({
      rowIndex: lastIndex + 1,
      colKey: 'rccode',
    });
    this.calculateInfo();
  }

  modifyWork(val) {
    const oldData = this.selectedNode && this.selectedNode.data.rccode
      ? this.gridTableService.getAllData(this.params).filter(data => data.rccode !== this.selectedNode.data.rccode)
      : this.gridTableService.getAllData(this.params);
    const matchData = oldData.find(data => data.rccode === val.rccode);
    if (matchData) {
      this.swalAlertService.openWarningToast('Công việc đã tồn tại');
    } else {
      const rowData = Object.assign({}, val, {
        timework: val.jobtime,
        actualtime: val.actualJobTime || val.jobtime,
        jobsname: val.rcname,
        costs: (val.actualJobTime || val.jobtime) * val.dealerCost,
        taxRate: 0,
        discountPercent: 0,
        bpType: 1,
        jobtime: val.jobtime,
      });
      this.selectedNode.updateData(rowData);
      if (!rowData.discountPercent) {
        this.selectedNode.setDataValue('discountPercent', 0);
      }
      this.params.api.startEditingCell({
        rowIndex: this.selectedNode.rowIndex,
        colKey: 'costs',
      });
      this.chosenJob.emit(rowData.id || rowData.rcjId);
      this.calculateInfo();
    }
  }

  removeWork() {
    if (!this.selectedNode) {
      this.swalAlertService.openWarningToast('Cần chọn 1 công việc');
    } else {
      this.confirmService.openConfirmModal('Bạn có chắc muốn xóa bản ghi được chọn').subscribe(res => {
        this.params.api.updateRowData({remove: [this.selectedNode.data]});
        this.calculateInfo();
      });

    }
  }

  getWorkCodeList(searchKey, paginationParams?) {
    return this.rcJobApi.getAllRcJobsData(Object.assign({
      jobgroup: 5, // JobGroup=5: Sửa chữa đồng sơn
    }, searchKey), paginationParams);
  }

  tabToNextCell(params) {
    if (params.previousCellDef && params.nextCellDef && params.previousCellDef.column.colId === 'discount' && params.nextCellDef.column.colId === 'discountPercent') {
      const data = this.params.api.getModel().rowsToDisplay[params.nextCellDef.rowIndex].data;
      if (data.costs && data.discount) {
        data.discountPercent = (Number(data.discount) / Number(data.costs) * 100).toFixed(2);
        this.params.api.getRowNode(params.nextCellDef.rowIndex).setData(data);
      }
    }
    if (params.previousCellDef && params.nextCellDef && params.nextCellDef.column.colId === 'discount' && params.previousCellDef.column.colId === 'discountPercent') {
      const data = this.params.api.getModel().rowsToDisplay[params.previousCellDef.rowIndex].data;
      if (data.costs && data.discountPercent) {
        data.discount = Number(data.discountPercent) * Number(data.costs) / 100;
        this.params.api.getRowNode(params.previousCellDef.rowIndex).setData(data);
      }
    }
    return params.nextCellDef;
  }

  cellDoubleClicked(params) {
    const col = params.colDef.field;
    if (this.state && this.state.toString() !== '1' && this.selectedNode && this.selectedNode.data.quotationprintVersion && col === 'rccode') {
      return;
    }
    const data = params.data;
    if (col === 'rccode' && !data.subletTypeCode) {
      this.searchJobInfo({searchKeyword: params.value});
    }

    if (col === 'discountPercent') {
      this.discountModal.open(params.data.discountPercent);
    }

    this.doubleClickParams = params;
  }

  patchDiscount(data) {
    if (data.forAll) {
      this.params.api.forEachNode(rowNode => {
        rowNode.setDataValue('discountPercent', Number(data.discountPercent));
        rowNode.setDataValue('discount', Number(data.discountPercent * rowNode.data.costs / 100));
        this.calculateInfo();
      });
    } else {
      this.selectedNode.setDataValue('discountPercent', Number(data.discountPercent));
      this.selectedNode.setDataValue('discount', Number(data.discountPercent * this.doubleClickParams.data.costs / 100));
      this.calculateInfo();
    }
  }

  cellEditingStarted(params) {

  }

  cellValueChanged(params) {
    const col = params.colDef.field;
    const data = params.data;
    switch (col) {
      case 'subletTypeCode':
        data.rccode = null;
        data.timework = 0;
        if (data.subletTypeCode) {
          data.actualtime = 0;
        } else {
          data.actualtime = data.jobtime;
        }
        this.params.api.refreshCells();
        params.node.setData(data);
        break;
      case 'taxRate':
        this.calculateInfo();
        break;
    }

    if (params.column.colId === 'costs') {
      const costDealer = this.costDealer;
      this.params.api.forEachNode(rowNode => {
        if (params.rowIndex === rowNode.rowIndex && !params.data.subletTypeCode) {
          rowNode.setDataValue('actualtime', (!costDealer || costDealer === 0) ? 0 : (Number(params.newValue) / costDealer).toFixed(2));
          rowNode.setDataValue('discount', (Number(params.newValue) * Number(params.data.discountPercent || 0) / 100).toFixed(2));
        }
      });
    }
    if (params.column.colId === 'discountPercent') {
      if (Number(params.newValue) === Number(params.oldValue)) {
        return;
      }
    }
  }

  cellEditingStopped(params) {
    const col = params.colDef.field;
    const data = params.data;
    switch (col) {
      case 'actualtime':
        data.costs = (parseFloat(data.dealerCost) || 0) * (parseFloat(data.actualtime) || 0);
        break;
      case 'costs':
        if (data.dealerCost) {
          data.actualtime = ((parseFloat(data.costs) || 0) / (parseFloat(data.dealerCost) || 1)).toFixed(2);
        }
        break;
      case 'discountPercent':
        if (Number(params.newValue) === Number(params.oldValue)) {
          return;
        }
        if (Number(data.discountPercent) > 100 || Number(data.discountPercent) < 0) {
          this.swalAlertService.openWarningToast('Phần trăm phải trong khoảng 1 - 100', 'Số không hợp lệ');
          this.gridTable.focusAfterEdit(params);
          break;
        }

        if (params.column.editingStartedValue !== params.value) {
          params.data.discount = (Number(params.data.costs) || 0) * (Number(params.data.discountPercent) || 0) / 100;
          params.data.discountPercent = (Number(params.data.discountPercent) || 0);
        }
        break;
      case 'discount':
        if (Number(data.discount) > Number(data.costs) || Number(data.discount) < 0 || !data.discount) {
          this.swalAlertService.openWarningToast('Nhập số TIỀN GIẢM. TIỀN GIẢM không thể lớn hơn THÀNH TIỀN hoặc nhỏ hơn 0', 'Số không hợp lệ');
          this.gridTable.focusAfterEdit(params);
          data.discount = params.column.editingStartedValue;
          break;
        }
        if (params.column.editingStartedValue !== params.value) {
          params.data.discountPercent = (Number(params.data.discount) !== 0) ? (parseFloat(params.data.discount) / (Number(params.data.costs) || 1) * 100).toFixed(2) : 0;
        }
        break;
      case 'taxRate':
        break;
    }
    params.node.setData(data);
    this.calculateInfo();
  }

  moneyFormat(val) {
    return this.dataFormatService.moneyFormat(val);
  }

  agKeyUp(event: KeyboardEvent) {
    event.stopPropagation();
    event.preventDefault();
    const keyCode = event.key;
    const srcElement = event.target as HTMLInputElement;
    const KEY_ENTER = 'Enter';
    const KEY_UP = 'ArrowUp';
    const KEY_DOWN = 'ArrowDown';
    const displayedData = this.gridTableService.getAllData(this.params);

    // Press enter to search with modal
    if (srcElement.classList.contains('rccode') && keyCode === KEY_ENTER) {
      this.searchJobInfo({searchKeyword: srcElement.innerHTML});
    }

    // Add new row with hot keys
    const focusCell = this.params.api.getFocusedCell();
    if (keyCode === KEY_DOWN) {
      if (focusCell.rowIndex === this.focusCellIndex && focusCell.rowIndex === displayedData.length - 1) {
        this.addWork();
      }
      this.focusCellIndex = focusCell.rowIndex;
    }
    if (keyCode === KEY_UP) {
      this.focusCellIndex = focusCell.rowIndex;
    }
  }

  private searchJobInfo(val, paginationParams?) {
    if (val.searchKeyword) {
      this.loadingService.setDisplay(true);
      this.rcJobApi.getAllRcJobsData(Object.assign({
        jobgroup: 5, // JobGroup=5: Sửa chữa đồng sơn
      }, val, paginationParams)).subscribe(job => {
        this.loadingService.setDisplay(false);
        if (job.list.length === 1) {
          this.modifyWork(job.list[0]);
        } else {
          this.searchWorkCodeModal.open(val, job.list, job.total);
        }
      });
    } else {
      this.searchWorkCodeModal.open(val);
    }
  }
}
