import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ToastService } from '../../../../../shared/swal-alert/toast.service';
import { DataFormatService } from '../../../../../shared/common-service/data-format.service';
import { GridTableService } from '../../../../../shared/common-service/grid-table.service';
import { SrvDRcJobsApi } from '../../../../../api/master-data/warranty/srv-d-rc-jobs.api';
import { FormGroup } from '@angular/forms';
import { SubletApi } from '../../../../../api/common-api/sublet.api';
import { LoadingService } from '../../../../../shared/loading/loading.service';
import { ConfirmService } from '../../../../../shared/confirmation/confirm.service';
import { DlrConfigApi } from '../../../../../api/common-api/dlr-config.api';
import { InsuranceApi } from '../../../../../api/sales-api/insurance/insurance.api';
import { AgSelectRendererComponent } from '../../../../../shared/ag-select-renderer/ag-select-renderer.component';
import { AgCheckboxRendererComponent } from '../../../../../shared/ag-checkbox-renderer/ag-checkbox-renderer.component';
import { Observable } from 'rxjs';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'general-repair-storage-job',
  templateUrl: './general-repair-storage-job.component.html',
  styleUrls: ['./general-repair-storage-job.component.scss'],
})
export class GeneralRepairStorageJobComponent implements OnInit, OnChanges {
  @Output() countMoney = new EventEmitter();
  @Output() chosenJob = new EventEmitter();
  @Input() proposalForm: FormGroup;
  @Input() isRefresh: boolean;
  @Input() state;
  @Input() cmId: string;
  @Input() data: Array<any>;
  @Input() tabDisplay: boolean;
  @Input() curredJob;
  @Input() roState;
  @ViewChild('searchWorkCodeModal', {static: false}) searchWorkCodeModal;
  @ViewChild('gridTable', {static: false}) gridTable;
  @ViewChild('discountModal', {static: false}) discountModal;
  fieldGrid;
  selectedNode;
  params;
  isCollapsed = false;
  // tslint:disable-next-line:variable-name
  _isRepair;
  isRepairObs;
  observer;
  works = [];
  footerData;
  fieldGridWorkCode;
  frameworkComponents;
  subletTypeList = [];
  costDealer;
  focusCellIndex = 0;
  doubleClickParams;

  constructor(private dataFormatService: DataFormatService,
              private gridTableService: GridTableService,
              private swalAlertService: ToastService,
              private rcJobApi: SrvDRcJobsApi,
              private subletApi: SubletApi,
              private loadingService: LoadingService,
              private confirmService: ConfirmService,
              private insuranceApi: InsuranceApi,
              private dlrConfigApi: DlrConfigApi) {
    this.fieldGridWorkCode = [
      {
        headerName: 'Mã CV',
        headerTooltip: 'Mã CV',
        field: 'rccode',
      },
      {
        headerName: 'Tên CV',
        headerTooltip: 'Tên CV',
        field: 'rcname',
      },
      {
        headerName: 'Ghi chú',
        headerTooltip: 'Ghi chú',
        field: 'remark',
      },
      {
        headerName: 'Đ/mức giờ công',
        headerTooltip: 'Đ/mức giờ công',
        field: 'jobtime',
      },
      {
        headerName: 'H công thực tế',
        headerTooltip: 'H công thực tế',
        field: 'actualJobTime',
      },
    ];
    this.fieldGrid = [
      {
        headerName: 'Mã CV',
        headerTooltip: 'Mã CV',
        field: 'rccode',
        editable: true,
        width: 70,
        cellStyle: params => !params.data.subletTypeCode ? {backgroundColor: '#FFFFCC'} : {backgroundColor: '#F5F5F5'},
        cellClass: params => params.data.subletTypeCode ? ['cell-readonly', 'cell-border', 'rccode'] : ['cell-clickable', 'cell-border', 'rccode'],
      },
      {
        headerName: 'Tên CV',
        headerTooltip: 'Tên CV',
        field: 'jobsname',
        width: 200,
        editable: true,
        cellClass: ['cell-clickable', 'cell-border'],
        validators: ['required'],
      },
      {
        headerName: 'Kiểu CV thuê ngoài',
        headerTooltip: 'Kiểu CV thuê ngoài',
        field: 'subletTypeCode',
        width: 100,
        cellRenderer: 'agSelectRendererComponent',
        list: this.subletTypeList,
        disableSelect: () => (this.selectedNode && this.selectedNode.data.quotationprintVersion),
        cellClass: ['cell-clickable', 'cell-border', 'p-0'],
      },
      {
        headerName: 'GC ĐM',
        headerTooltip: 'GC ĐM',
        field: 'timework',
        width: 50,
        cellClass: ['text-right', 'cell-border'],
      },
      {
        headerName: 'GC TT',
        headerTooltip: 'GC TT',
        field: 'actualtime',
        width: 50,
        validators: ['required'],
        cellClass: ['text-right', 'cell-border'],
      },
      {
        headerName: 'Thành tiền',
        headerTooltip: 'Thành tiền',
        field: 'costs',
        editable: true,
        width: 90,
        cellClass: ['text-right', 'cell-border'],
        cellStyle: params => !params.data.subletTypeCode ? {backgroundColor: '#FFFFCC'} : {backgroundColor: '#F5F5F5'},
        validators: ['required', 'number', 'positiveNumber'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
      },
      {
        headerName: 'Ghi chú',
        headerTooltip: 'Ghi chú',
        field: 'notes',
        editable: true,
      },
    ];
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
      }
      if (changes.curredJob && changes.curredJob.currentValue) {
        changes.curredJob.currentValue.forEach(item => this.addWork(item.reasoncontent));
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
    // this.dlrConfigApi.getByCurrentDealer().subscribe(res => this.costDealer = res ? res[0].cost : 0);
    this.dlrConfigApi.getCurrentByDealer().subscribe(res => this.costDealer = res ? (res.cost || 0) : 0);
  }

  getSubletTypeList() {
    this.loadingService.setDisplay(true);
    this.subletApi.getAll()
      .subscribe(subletTypeList => {
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
    this.selectedNode = selectedNode ? selectedNode[0] : undefined;
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
    this.proposalForm.get('jobListScc').setValue(dataObj);
  }

  addWork(jobsname?) {
    const lastIndex = this.params.api.getLastDisplayedRow();
    if (lastIndex >= 0) {
      const lastItem = this.params.api.getDisplayedRowAtIndex(lastIndex).data;
      if ((!lastItem.jobsname || !lastItem.costs) && !jobsname) {
        this.swalAlertService.openWarningToast('Kiểm tra lại Công Việc');
        return;
      }
    }
    const newVal = {
      rccode: null,
      jobsname: jobsname || null,
      subletTypeCode: null,
      timework: null,
      actualtime: null,
      costs: null,
      taxRate: 0,
      discountPercent: 0,
      discount: 0,
      notes: null,
      version: 0,
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
    const oldData = this.selectedNode && this.selectedNode.data.rcjmId
      ? this.gridTableService.getAllData(this.params).filter(data => data.rcjmId !== this.selectedNode.data.rcjmId)
      : this.gridTableService.getAllData(this.params);
    const matchData = oldData.find(data => data.rcjmId === val.rcjmId);
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
        jobtime: val.jobtime,
        fix: true,
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
      this.confirmService.openConfirmModal('Bạn có chắc muốn xóa bản ghi được chọn')
        .subscribe(() => {
          this.params.api.updateRowData({remove: [this.selectedNode.data]});
          this.calculateInfo();
        });
    }
  }

  getWorkCodeList(searchKey, paginationParams?) {
    return this.rcJobApi.getAllRcJobsData(Object.assign({
      jobgroup: 0, // JobGroup=0: Sửa chữa chung
      cmId: this.cmId || 1200,
    }, searchKey), paginationParams);
  }

  cellDoubleClicked(params) {
    const col = params.colDef.field;
    if (this.state && this.state.toString() !== '1' && this.selectedNode && this.selectedNode.data.quotationprintVersion && col === 'rccode') {
      return;
    }
    const data = params.data;
    if (col === 'rccode' && !data.subletTypeCode) {
      this.searchJobInfo({searchKeyword: params.value}, null, data.isCampaign);
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
        this.params.api.getRowNode(params.nextCellDef.rowIndex).setData(data);
      }
    }
    return params.nextCellDef;
  }

  cellValueChanged(params) {
    const col = params.colDef.field;
    const data = params.data;
    switch (col) {
      case 'subletTypeCode':
        data.rccode = null;
        data.timework = null;
        data.actualtime = data.subletTypeCode ? null : data.jobtime;
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

    if (params.column.colId === 'discountPercent' && Number(params.newValue) === Number(params.oldValue)) {
      return;
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
    params.api.refreshCells();
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
      this.searchJobInfo({searchKeyword: srcElement.innerHTML}, null, this.selectedNode.data.isCampaign);
    }

    // Add new row with hot keys
    const focusCell = this.params.api.getFocusedCell();
    if (keyCode === KEY_DOWN) {
      if (focusCell.rowIndex === this.focusCellIndex && focusCell.rowIndex === displayedData.length - 1) {
        this.addWork();
      }
      this.focusCellIndex = focusCell.rowIndex;
    }
    this.focusCellIndex = (keyCode === KEY_UP) ? focusCell.rowIndex : this.focusCellIndex;
  }

  private searchJobInfo(val, paginationParams?, isCampaign?) {
    const findJob = () => {
      if (val.searchKeyword) {
        this.loadingService.setDisplay(true);
        this.rcJobApi.getAllRcJobsData(Object.assign({
          jobgroup: 0, // JobGroup=0: Sửa chữa chung
          cmId: this.cmId || 1200,
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
    };

    if (isCampaign) {
      this.confirmService.openConfirmModal('Cảnh báo', 'Đây là công việc của chiến dịch. Có tiếp tục thay đổi')
        .subscribe(() => findJob());
    } else {
      findJob();
    }
  }
}
