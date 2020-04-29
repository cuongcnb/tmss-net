import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {ToastService} from '../../../../../../shared/swal-alert/toast.service';
import {DataFormatService} from '../../../../../../shared/common-service/data-format.service';
import {SrvDRcJobsApi} from '../../../../../../api/master-data/warranty/srv-d-rc-jobs.api';
import {LoadingService} from '../../../../../../shared/loading/loading.service';
import {GridTableService} from '../../../../../../shared/common-service/grid-table.service';
import {AgSelectRendererComponent} from '../../../../../../shared/ag-select-renderer/ag-select-renderer.component';
import {SubletApi} from '../../../../../../api/common-api/sublet.api';
import {AgCheckboxRendererComponent} from '../../../../../../shared/ag-checkbox-renderer/ag-checkbox-renderer.component';
import {Observable} from 'rxjs';
import {FormGroup} from '@angular/forms';
import {InsuranceApi} from '../../../../../../api/sales-api/insurance/insurance.api';
import {DlrConfigApi} from '../../../../../../api/common-api/dlr-config.api';
import {state} from '../../../../../../core/constains/ro-state';
import {ConfirmService} from '../../../../../../shared/confirmation/confirm.service';
import {PartsInfoManagementApi} from '../../../../../../api/parts-management/parts-info-management.api';
import {DataCodes} from '../../../../../../core/constains/data-code';
import {NextShortcutService} from '../../../../../../shared/common-service/nextShortcut.service';
import {ShortcutEventOutput, ShortcutInput} from 'ng-keyboard-shortcuts';

import {currentTab, setFocusedCell} from '../../../../../../home/home.component';

import {
  discountUpdate$,
  setDiscount
} from '../../accessory-of-proposal/accessory-discount/accessory-discount.component';
import {setClickedRow} from '../../proposal.component';
import {StorageKeys} from '../../../../../../core/constains/storageKeys';
import {SrvDRcJobsModelsApi} from '../../../../../../api/master-data/warranty/srv-d-rc-jobs-models.api';
import {GoUpButtonComponent} from '../../go-up-button/go-up-button.component';
import {RepairJobApi} from '../../../../../../api/common-api/repair-job.api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dong-son-of-proposal',
  templateUrl: './dong-son-of-proposal.component.html',
  styleUrls: ['./dong-son-of-proposal.component.scss']
})
export class DongSonOfProposalComponent implements AfterViewInit, OnInit, OnChanges, OnDestroy {
  @Output() countMoney = new EventEmitter();
  @Output() partByJob = new EventEmitter();
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
  newVal = {
    rccode: null,
    jobsname: null,
    bpType: 1,
    subletTypeCode: null,
    timework: null,
    actualtime: null,
    costs: null,
    bpcost: null,
    actualcost: null,
    taxRate: 10,
    discountPercent: 0,
    discount: 0,
    notes: null,
    version: this.proposalForm ? (this.proposalForm.getRawValue().quotationprint || 0) + 1 : 1,
    fix: null,
    jobtime: null,
    jobListDs: null,
    seq: 1
  };
  fieldGrid;
  selectedNode;
  params;
  // tslint:disable-next-line:variable-name
  _isRepair;
  isRepairObs;
  observer;
  disabledBtnAdd = [state.complete, state.settlement, state.cancel, state.completeSc];
  works: Array<any> = [];
  footerData;
  fieldGridWorkCode;
  frameworkComponents;
  subletTypeList = [];
  listJobTypeBp = [];
  listGroupTypeBp = [];
  costDealer;
  focusCellIndex = 0;
  doubleClickParams;
  disableBtnDel = [state.quotation, state.quotationTmp];
  stateCVDV = [null, state.quotationTmp, ''];
  keyboardShortcuts: Array<ShortcutInput> = [];
  CTRL_DOWN = false;
  dlrConfig;
  discountObs$;
  editing;

  constructor(
    private dataFormatService: DataFormatService,
    private gridTableService: GridTableService,
    private swalAlertService: ToastService,
    private confirmService: ConfirmService,
    private rcJobApi: SrvDRcJobsApi,
    private subletApi: SubletApi,
    private repairJobApi: RepairJobApi,
    private loadingService: LoadingService,
    private insuranceApi: InsuranceApi,
    private dlrConfigApi: DlrConfigApi,
    private cdr: ChangeDetectorRef,
    private nextShortcutService: NextShortcutService,
    private srvDRcJobsModelsApi: SrvDRcJobsModelsApi,
    private partsInfoManagementApi: PartsInfoManagementApi) {
    const dlrConfig = JSON.parse(localStorage.getItem(StorageKeys.dlrConfig));
    if (dlrConfig) {
      this.dlrConfig = dlrConfig;
    } else {
      // this.dlrConfigApi.getByCurrentDealer().subscribe(res => this.dlrConfig = res ? res[0] : undefined);
      this.dlrConfigApi.getCurrentByDealer().subscribe(res => this.dlrConfig = res ? res : undefined);
    }
    this.fieldGridWorkCode = [
      {headerName: 'Mã CV', headerTooltip: 'Mã công việc', field: 'rccode'},
      {headerName: 'Tên CV', headerTooltip: 'Tên công việc', field: 'rcname'},
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'remark'},
      // {headerName: 'Đ/mức giờ công', headerTooltip: 'Đ/mức giờ công', field: 'jobtime'},
      // {headerName: 'H công thực tế', headerTooltip: 'H công thực tế', field: 'actualJobTime'}
      {
        headerName: 'Thành tiền',
        headerTooltip: 'Thành tiền',
        field: 'price',
        cellClass: ['cell-border', 'text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      }
    ];
    this.fieldGrid = [
      {
        headerName: 'Mã CV', headerTooltip: 'Mã CV',
        field: 'rccode',
        editable: params => {
          const roState = this.proposalForm.get('rostate').value;
          return (!roState || roState === state.quotation || roState === state.quotationTmp || this.roState === state.lxpt || !params.data.quotationprintVersion);
        },
        cellClass: params => !params.data.subletTypeCode ? ['cell-clickable', 'cell-border', 'rccode'] : ['cell-readonly', 'cell-border']
      },
      {
        headerName: 'Tên CV',
        headerTooltip: 'Tên công việc',
        field: 'jobsname',
        width: 350,
        maxLength: 150,
        suppressKeyboardEvent: this.suppressJobName(),
        editable: params => {
          const roState = this.proposalForm.get('rostate').value;
          return (!roState || roState === state.quotation || roState === state.quotationTmp || this.roState === state.lxpt || !params.data.quotationprintVersion);
        },
        cellClass: ['cell-clickable', 'cell-border'],
        validators: ['required', 'maxLength']
      },
      {
        headerName: 'Loại CV',
        headerTooltip: 'Loại công việc',
        field: 'jobType',
        cellRenderer: 'agSelectRendererComponent',
        list: this.listJobTypeBp,
        disableSelect: (params) => {
          return params.data.status && params.data.status === 'Y';
        },
        cellClass: params => params.data.status && params.data.status === 'Y' ? ['cell-unClickDropdown', 'cell-border', 'text-right']
          : ['cell-clickDropdown', 'cell-border', 'text-right']
      },
      {
        headerName: 'Nhóm CV', headerTooltip: 'Nhóm công việc', field: 'bpType',
        cellRenderer: 'agSelectRendererComponent',
        suppressKeyboardEvent: this.suppressBPType(),
        cellClass: (params) => {
          const data = params.data && params.data.bpType ? this.listGroupTypeBp.find(it => it.key === params.data.bpType) : null;
          return params.data && params.data.status === 'Y' && data ? ['cell-unClickDropdown', 'cell-border', 'text-right']
            : ['cell-clickDropdown', 'cell-border'];
        },
        width: 300,
        list: this.listGroupTypeBp,
        disableSelect: (params) => {
          const data = params.data && params.data.bpType ? this.listGroupTypeBp.find(it => it.key === params.data.bpType) : null;
          return params.data && params.data.status === 'Y' && data;
        }
      },
      {
        headerName: 'Kiểu CV thuê ngoài',
        headerTooltip: 'Kiểu công việc thuê ngoài',
        field: 'subletTypeCode',
        cellRenderer: 'agSelectRendererComponent',
        list: this.subletTypeList,
        cellClass: params => params.data.status && params.data.status === 'Y' ? ['cell-unClickDropdown', 'cell-border', 'p-0']
          : ['cell-clickDropdown', 'cell-border'],
        disableSelect: params => params.data.status && params.data.status === 'Y'
      },
      // {
      //   headerName: 'GC ĐM', headerTooltip: 'GC ĐM', field: 'timework', cellClass: ['text-right', 'cell-border']
      // },
      {
        headerName: 'GC TT',
        headerTooltip: 'GC TT',
        field: 'actualtime',
        validators: ['floatPositiveNum'],
        cellClass: ['text-right', 'cell-border'],
        editable: params => {
          return params.data && params.data.status !== 'Y';
        },
        cellStyle: {backgroundColor: '#FFFFCC'}
      },
      {
        headerName: 'Thành tiền',
        headerTooltip: 'Thành tiền',
        field: 'costs',
        width: 250,
        editable: params => {
          // const roState = this.proposalForm.get('rostate').value;
          // return (!roState || roState === state.quotation || roState === state.quotationTmp || this.roState === state.lxpt || !params.data.quotationprintVersion);
          return params.data && params.data.status !== 'Y';
        }, cellClass: ['cell-clickable', 'cell-border', 'text-right'],
        maxLength: 10,
        validators: ['required', 'number', 'notNagetiveIntNumber', 'maxLength'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)

      },
      {
        headerName: 'CPVT ĐM',
        headerTooltip: 'CPVT ĐM',
        field: 'bpcost',
        cellClass: ['cell-readonly', 'cell-border', 'text-right']
      },
      {
        headerName: 'CPVT TT',
        headerTooltip: 'CPVT TT',
        field: 'actualcost',
        editable: params => !params.data.subletTypeCode,
        cellStyle: params => !params.data.subletTypeCode ? {backgroundColor: '#FFFFCC'} : {backgroundColor: '#F5F5F5'},
        validators: ['required', 'floatPositiveNum1']
      },
      {
        headerName: 'Thuế', headerTooltip: 'Thuế', field: 'taxRate',
        required: true,
        cellRenderer: 'agSelectRendererComponent',
        list: [
          {key: 10, value: 10},
          {key: 5, value: 5},
          {key: 0, value: 0}
        ],
        disableSelect: params => params.data.status && params.data.status === 'Y',
        cellClass: params => params.data.status && params.data.status === 'Y' ? ['cell-unClickDropdown', 'cell-border']
          : ['cell-clickDropdown'],
        width: 200
      },
      {
        headerName: '% Giảm',
        headerTooltip: '% Giảm',
        field: 'discountPercent',
        validators: ['number'],
        cellClass: ['text-right', 'cell-border'],
        cellStyle: {backgroundColor: '#FFFFCC'},
        width: 150
      },
      {
        headerName: 'Giá giảm',
        headerTooltip: 'Giá giảm',
        field: 'discount',
        width: 250,
        editable: true,
        validators: ['intNumber'],
        cellClass: ['text-right', 'cell-border'],
        tooltip: params => this.dataFormatService.moneyFormat((params.value) ? params.value : 0),
        valueFormatter: params => this.dataFormatService.moneyFormat((params.value) ? params.value : 0),
        cellStyle: {backgroundColor: '#FFFFCC'}
      },
      {
        headerName: 'Ghi chú',
        headerTooltip: 'Ghi chú',
        field: 'notes',
        editable: true,
        width: 250
      },
      {headerName: 'Ver', headerTooltip: 'Ver', field: 'quotationprintVersion', width: 100},
      {
        headerName: 'Sửa lại', headerTooltip: 'Sửa lại', field: 'fix',
        cellRenderer: (params) => `<input disabled type='checkbox' ${params.data.readjust === true ? 'checked' : ''}/>`,
        disableCheckbox: () => this.isRepairObs,
        width: 100
      },
      {
        headerName: '',
        headerTooltip: 'Thay đổi thứ tự hiển thị',
        field: undefined,
        width: 140,
        cellClass: ['text-center', 'cell-border'],
        cellRenderer: 'goUpButtonRenderer',
        cellRendererParams: {
          onUpClick: this.goUp.bind(this),
          onDownClick: this.goDown.bind(this)
        }
      },
      {
        field: 'seq',
        sortable: true,
        hide: true
      }
    ]
    ;
    this.frameworkComponents = {
      agSelectRendererComponent: AgSelectRendererComponent,
      agCheckboxRendererComponent: AgCheckboxRendererComponent,
      goUpButtonRenderer: GoUpButtonComponent,
    };
    this.isRepairObs = new Observable(observer => this.observer = observer);
  }

  goUp(params) {
    const node = params.rowData.node;
    const index = node.childIndex;
    if (index > 0) {
      const prevNode = this.params.api.getDisplayedRowAtIndex(index - 1);
      const prevSeq = prevNode.data['seq'];
      const seq = params.rowData.node.data['seq'];
      prevNode.data['seq'] = seq;
      node.data['seq'] = prevSeq;
      var sort = [{colId: 'seq', sort: 'asc'}];
      this.params.api.setSortModel(sort);
      const dataObj = this.gridTableService.getAllDataAfterFilterAndSort(this.params).map(it => {
        // return Object.assign({}, it, {id: null, readjust: it.readjust ? 'Y' : 'N'})
        it.id = null;
        return it;
      });
      this.proposalForm.get('jobListDs').setValue(dataObj);
      this.params.api.getDisplayedRowAtIndex(index - 1).setSelected(true);
    }
  }

  goDown(params) {
    const node = params.rowData.node;
    const index = node.childIndex;
    if (index < this.params.api.getDisplayedRowCount() - 1) {
      const nextNode = this.params.api.getDisplayedRowAtIndex(index + 1);
      const nextSeq = nextNode.data['seq'];
      const seq = params.rowData.node.data['seq'];
      nextNode.data['seq'] = seq;
      node.data['seq'] = nextSeq;
      var sort = [{colId: 'seq', sort: 'asc'}];
      this.params.api.setSortModel(sort);
      const dataObj = this.gridTableService.getAllDataAfterFilterAndSort(this.params).map(it => {
        // return Object.assign({}, it, {id: null, readjust: it.readjust ? 'Y' : 'N'})
        it.id = null;
        return it;
      });
      this.proposalForm.get('jobListDs').setValue(dataObj);
      this.params.api.getDisplayedRowAtIndex(index + 1).setSelected(true);
    }
  }

  ngOnInit() {
    this.getSubletTypeList();
    this.getListJobTypeBp();
    this.getDealerConfig();
    this.getListGroupTypeBp();
    // this.proposalForm.get('pds').valueChanges.subscribe(val => {
    //   if (val && (this.proposalForm.value.rotype === '1' || this.proposalForm.value.roTypeTemp === '1')) {
    //     const arr = this.proposalForm.value.jobListDs;
    //     if (arr && arr.length > 0) {
    //       arr.map(it => {
    //         it.costs = 0;
    //         return it;
    //       });
    //     }
    //     this.params.api.setRowData(arr);
    //     this.calculateInfo();
    //   }
    // });

    this.discountObs$ = discountUpdate$.subscribe((data: any) => {
      if (data && data.registerno === this.proposalForm.get('registerno').value) {
        if (this.proposalForm.value.rotype === '1' || this.proposalForm.value.roTypeTemp === '1') {
          setDiscount(this.selectedNode, this.params, data, 'CV');
          this.calculateInfo();
          this.proposalForm.markAsDirty();
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.discountObs$) {
      this.discountObs$.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.keyboardShortcuts = [
      {
        key: ['ctrl + d', 'ctrl + D'],
        label: 'Báo giá',
        description: 'Xoá hàng trong bảng công việc Đồng Sơn',
        command: (e: ShortcutEventOutput) => this.removeWork(),
        preventDefault: true
      }
    ];
    this.nextShortcutService.listenType()
      .subscribe(type => {
        this.nextShortcutService.nextShortcut(type === 'DS' ? this.keyboardShortcuts : []);
        // if (type === 'SCC' || type === '') { }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
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
      if (this.params && (!this.data || this.data.length < 1)) {
        const newVal = {
          rccode: null,
          jobsname: null,
          bpType: 1,
          subletTypeCode: null,
          timework: null,
          actualtime: null,
          costs: null,
          bpcost: null,
          actualcost: null,
          taxRate: 10,
          discountPercent: 0,
          discount: 0,
          notes: null,
          version: this.proposalForm ? (this.proposalForm.getRawValue().quotationprint || 0) + 1 : 1,
          fix: null,
          jobtime: null,
          seq: 1
        };
        this.params.api.updateRowData({add: [newVal]});
      }
      if (changes.roState && changes.roState.currentValue && Number(changes.roState.currentValue) >= 2 && this.params) {
        // disable chọn kiểu cv khi tạo lệnh sửa chữa
        // this.fieldGrid[2].disableSelect = true;
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
    // this.dlrConfigApi.getByCurrentDealer().subscribe(res => this.costDealer = (res) ? res[0].cost : 0);
    this.dlrConfigApi.getCurrentByDealer().subscribe(res => this.costDealer = (res) ? (res.cost || 0) : 0);
  }

  getSubletTypeList() {
    this.loadingService.setDisplay(true);
    this.subletApi.getAll().subscribe(subletTypeList => {
      subletTypeList.forEach(subletType => {
        this.subletTypeList.push({
          key: subletType.sublettype,
          value: subletType.desceng
        });
      });
      this.loadingService.setDisplay(false);
    });
  }

  getListJobTypeBp() {
    this.partsInfoManagementApi.getDataCode(DataCodes.jobTypeBp)
      .subscribe(res => {
        res.forEach(it => {
          this.listJobTypeBp.push({
            key: it.dataValue,
            value: it.dataNameVn
          });
        });
      });
  }

  getListGroupTypeBp() {
    this.partsInfoManagementApi.getDataCode(DataCodes.groupTypeBp)
      .subscribe(res => {
        res.forEach(it => {
          this.listGroupTypeBp.push({
            key: Number(it.dataValue),
            value: it.dataNameVn
          });
        });
      });
  }

  callbackGrid(params) {
    this.params = params;
    if (this.data && this.data.length > 0) {
      this.params.api.setRowData(this.data);
      this.calculateInfo();
    }
    if (this.params && (!this.data || this.data.length < 1)) {
      this.params.api.updateRowData({add: [this.newVal]});
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
        total: costs - discount + taxRate
      };
      this.countMoney.emit(this.footerData);
    }

    const dataObj = this.gridTableService.getAllDataAfterFilterAndSort(this.params).map(it => {
      // return Object.assign({}, it, {id: null, readjust: it.readjust ? 'Y' : 'N'})
      it.id = null;
      return it;
    });
    this.proposalForm.get('jobListDs').setValue(dataObj);
  }

  addWork(jobsname?) {
    const lastIndex = this.params.api.getLastDisplayedRow();
    let lastItem = null;
    if (lastIndex >= 0) {
      lastItem = this.params.api.getDisplayedRowAtIndex(lastIndex).data;
      // if ((!lastItem.jobsname || lastItem.costs && (Number(lastItem.costs) >= 0 && !this.proposalForm.value.pds)) && !jobsname) {
      if (!lastItem.jobsname) {
        this.swalAlertService.openWarningToast('Kiểm tra lại Công Việc');
        return;
      }
    }
    const newVal = {
      rccode: null,
      jobsname: null,
      bpType: 1,
      subletTypeCode: null,
      timework: null,
      actualtime: null,
      costs: null,
      bpcost: null,
      actualcost: null,
      taxRate: 10,
      discountPercent: 0,
      discount: 0,
      notes: null,
      version: this.proposalForm ? (this.proposalForm.getRawValue().quotationprint || 0) + 1 : 1,
      fix: null,
      jobtime: null,
      jobType: null,
      seq: lastItem ? lastItem['seq'] + 1 : 1
    };
    newVal.jobsname = jobsname ? jobsname : null;
    this.params.api.updateRowData({add: [newVal]});
    this.gridTableService.setFocusCellDontEdit(this.params, this.fieldGrid[0].field, lastIndex + 1);

    this.params.api.getModel().rowsToDisplay[lastIndex + 1].setSelected(true);
    this.params.api.startEditingCell({
      rowIndex: lastIndex + 1,
      colKey: 'rccode'
    });
    this.calculateInfo();
  }

  cellKeyPress(event) {
    if (event.colDef.field === 'actualtime' && this.selectedNode) {
      setTimeout(() => {
        const key = event.event.key;
        const value = event.event.target.value;
        if (value && Number(value) > 0) {
          this.selectedNode.setDataValue('costs', Number(value) * (this.dlrConfig ? this.dlrConfig.cost : 1));
        } else if (Number(key) > 0 && Number(key) < 10) {
          this.selectedNode.setDataValue('costs', Number(key) * (this.dlrConfig ? this.dlrConfig.cost : 1));
        }
      }, 0);
    }
  }

  modifyWork(val) {
    let jobs = [];
    if (val.rcjgId && val.rcjgId > 0) {
      jobs = val.listJobsDetail;
    }
    else {
      jobs.push(val);
    }
    if (jobs && jobs.length > 0) {
      let nodeSeq = -1;
      let nodeIndex = -1;
      if (this.selectedNode) {
        nodeSeq = this.selectedNode.data['seq'];
        nodeIndex = this.selectedNode.childIndex;
        this.params.api.updateRowData({remove: [this.selectedNode.data]});
      }
      let partJobGroup;    
      for (let i = 0; i < jobs.length; i++) {
        const obj = jobs[i];
        const oldData = this.gridTableService.getAllData(this.params);
        const matchData = oldData.find(data => data.rcjmId && obj.rcjmId && data.rcjmId === obj.rcjmId);
        if (matchData) {
          this.swalAlertService.openWarningToast('Công việc đã tồn tại');
          this.params.api.updateRowData({add: [{seq: nodeSeq}]});
          const sort = [{colId: 'seq', sort: 'asc'}];
          this.params.api.setSortModel(sort);
          this.gridTableService.setFocusCell(this.params, this.fieldGrid[0].field, null, Number(nodeIndex));
          break;
        } else {
          const rowData = Object.assign({}, obj, {
            timework: obj.jobtime,
            actualtime: obj.actualJobTime,
            jobsname: obj.rcname,
            costs: obj.costs,
            taxRate: 10,
            discountPercent: 0,
            bpType: 1,
            jobtime: obj.jobtime,
            status: 'N',
            version: this.proposalForm ? (this.proposalForm.getRawValue().quotationprint || 0) + 1 : 1,
            seq: nodeSeq
          });          
          this.params.api.updateRowData({add: [rowData]});
          const sort = [{colId: 'seq', sort: 'asc'}];
          this.params.api.setSortModel(sort);
          this.gridTableService.setFocusCellDontEdit(this.params, this.fieldGrid[0].field, nodeIndex);
          this.focusCellIndex = nodeIndex;
          let node = this.params.api.getDisplayedRowAtIndex(nodeIndex);
          if (!rowData.discountPercent) {
            node.setDataValue('discountPercent', 0);
          }
          this.gridTableService.setDataToRow(this.params, nodeIndex, rowData, this.gridTableService.getAllData(this.params), 'costs');
          //
          if (!partJobGroup || partJobGroup.length <= 0) {
            partJobGroup = obj.listPartsDetail;
          }
          else {
            for (let j = 0; j < obj.listPartsDetail.length; j++) {
              partJobGroup.push(obj.listPartsDetail[j]);
            }
          }
          //
          const lastNode = this.params.api.getDisplayedRowAtIndex(this.params.api.getLastDisplayedRow());
          nodeSeq = lastNode.data['seq'] + 1;
          nodeIndex = lastNode.childIndex + 1;
        }
      }
      if (partJobGroup.length > 0) {
        partJobGroup.map(it => {
          it.partsId = it.id;
          it.partsNameVn = it.partsName;
          it.qty = it.amount;
          it.amount = it.payment;
          it.taxRate = 10;
          return it;
        });
      }
      this.partByJob.emit(partJobGroup);
      //
      this.proposalForm.markAsDirty();
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

  // getWorkCodeList(searchKey, paginationParams?) {
  //   return this.srvDRcJobsModelsApi.getAllRcJobsData(Object.assign({
  //     jobgroup: 5 // JobGroup=5: Sửa chữa đồng sơn
  //   }, searchKey), paginationParams);
  // }

  getWorkCodeList(searchKey, paginationParams ?) {
    const obj = {
      cfId: this.proposalForm.value.cfId,
      cmId: this.proposalForm.value.cmId,
      id: null,
      isBp: 'Y'
    };
    return this.repairJobApi.getJobsGroupQuotation(Object.assign({}, obj, searchKey), paginationParams);
  }

  tabToNextCell(params) {
    if (params.previousCellDef && params.nextCellDef && params.previousCellDef.column.colId === 'discount' && params.nextCellDef.column.colId === 'discountPercent') {
      const data = this.params.api.getModel().rowsToDisplay[params.nextCellDef.rowIndex].data;
      if (data.costs && data.discount) {
        data.discountPercent = this.returnIntOrFloat(Number(data.discount) / Number(data.costs) * 100);
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
    // if (this.state && this.state.toString() !== '1' && this.selectedNode && this.selectedNode.data.quotationprintVersion && col === 'rccode') {
    //   return;
    // }
    // const data = params.data;
    // if (col === 'rccode' && !data.subletTypeCode) {
    //   this.searchJobInfo({searchKeyword: params.value});
    // }
    //
    if (col === 'discountPercent') {
      this.discountModal.open(params.data.discountPercent);
    }

    this.doubleClickParams = params;
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
      // #23276 chọn nhóm công việc thì sẽ tự động chọn loại công việc tương ứng
      case 'bpType':
        if (data) {
          this.params.api.forEachNode(rowNode => {
            if (params.rowIndex === rowNode.rowIndex && params.newValue && Number(params.newValue) !== Number(params.oldValue)) {
              if ([11, 12, 13].includes(data.bpType)) {
                rowNode.setDataValue('jobType', '0');
              }
              if ([1000, 2000, 3000, 4000].includes(data.bpType)) {
                rowNode.setDataValue('jobType', '1');
              }
              if ([30].includes(data.bpType)) {
                rowNode.setDataValue('jobType', null);
              }
            }
            // check trường hợp nhóm cv chọn null thì loại cv sẽ fill là null
            if (params.rowIndex === rowNode.rowIndex && params.newValue === null) {
              if ([1, null].includes(data.bpType)) {
                rowNode.setDataValue('jobType', null);
              }
            }
          });
        }
        break;
    }

    if (params.column.colId === 'costs') {
      const costDealer = this.costDealer;
      this.params.api.forEachNode(rowNode => {
        if (params.rowIndex === rowNode.rowIndex && !params.data.subletTypeCode) {
          rowNode.setDataValue('actualtime', this.returnIntOrFloat(!costDealer || costDealer === 0 ? 0 : (Number(params.newValue) / costDealer)));
          rowNode.setDataValue('discount', Math.round(Number(params.newValue) * Number(params.data.discountPercent || 0) / 100));
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
    setFocusedCell(this.params, currentTab);
    const col = params.colDef.field;
    const data = params.data;
    this.proposalForm.markAsDirty();
    switch (col) {
      case 'actualtime':
        if (!data.subletTypeCode) {
          data.costs = this.returnIntOrFloat((parseFloat(this.dlrConfig ? this.dlrConfig.cost : 0)) * (parseFloat(data.actualtime) || 0));
        } else {
          data.actualtime = 0;
        }
        break;
      case 'costs':
        if (!data.subletTypeCode) {
          data.actualtime = this.returnIntOrFloat((parseFloat(data.costs) || 0) / (parseFloat(this.dlrConfig ? this.dlrConfig.cost : 1)));
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
        if (Number(data.discount) > Number(data.costs) || Number(data.discount) < 0) {
          this.swalAlertService.openWarningToast('GIẢM GIÁ không thể lớn hơn THÀNH TIỀN hoặc nhỏ hơn 0', 'Số không hợp lệ');
          this.gridTable.focusAfterEdit(params);
          // data.discount = params.column.editingStartedValue;
          break;
        }
        if (params.column.editingStartedValue !== params.value) {
          const discountPercent = (Number(params.data.discount) !== 0) ? (parseFloat(params.data.discount) / (Number(params.data.costs) || 1) * 100) : 0;
          params.data.discountPercent = this.returnIntOrFloat(discountPercent);
        }
        break;
    }
    params.node.setData(data);
    this.calculateInfo();
  }

  moneyFormat(val) {
    return this.dataFormatService.moneyFormat(val);
  }

  agKeyDown(event) {
    const lastIndex = this.params.api.getLastDisplayedRow();
    const KEY_C = 67;
    if (event.keyCode === KEY_C && !!event.ctrlKey) {
      this.gridTableService.setFocusCell(this.params, this.fieldGrid[1].field, this.gridTableService.getAllData(this.params));
    }
  }

  agKeyUp(event: KeyboardEvent) {
    event.stopPropagation();
    event.preventDefault();
    if (this.proposalForm.getRawValue().jti !== this.proposalForm.getRawValue().createdBy && !this.stateCVDV.includes(this.state)) {
      return;
    }
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

    const focusCell = this.params.api.getFocusedCell();
    if (focusCell.column.colId === 'bpType' && !focusCell.column.colDef.disableSelect(focusCell.column.gridApi.getSelectedNodes()[0])) {
      this.params.api.setFocusedCell(focusCell.rowIndex, 'bpType');
      const params = {columns: ['bpType'], rowNodes: [this.params.api.getDisplayedRowAtIndex(focusCell.rowIndex)]};
      const rendererInstances = this.params.api.getCellRendererInstances(params);
      const selectElement = rendererInstances.length ? rendererInstances[0]._eGui.querySelector('select') : null;
      if (selectElement) {
        if (keyCode === KEY_DOWN) {
          if (selectElement.selectedIndex < selectElement.length - 1) {
            selectElement.selectedIndex = selectElement.selectedIndex + 1;
          } else {
            selectElement.selectedIndex = 0;
          }
        } else if (keyCode === KEY_UP) {
          if (selectElement.selectedIndex > 0) {
            selectElement.selectedIndex = selectElement.selectedIndex - 1;
          } else {
            selectElement.selectedIndex = selectElement.length - 1;
          }
        }
        this.params.api.forEachNode(rowNode => {
          if (focusCell.rowIndex === rowNode.rowIndex) {
            if (this.listGroupTypeBp[selectElement.selectedIndex - 1]) {
              rowNode.setDataValue('bpType', this.listGroupTypeBp[selectElement.selectedIndex - 1].key);
            } else {
              rowNode.setDataValue('bpType', null);
            }
          }
        });
      }
    } else {
      // Add new row with hot keys
      const editingCells = this.params.api.getEditingCells();
      const isEditing = !!editingCells.find(val => val.column.colId === focusCell.column.colId);
      if (keyCode === KEY_DOWN) {
        if (focusCell.rowIndex === this.focusCellIndex && focusCell.rowIndex === displayedData.length - 1) {
          this.addWork();
        } else {
          this.gridTableService.setFocusCell(this.params, focusCell.column.colId, null, focusCell.rowIndex + 1, isEditing);
        }
        this.focusCellIndex = focusCell.rowIndex + 1;
        setTimeout(() => {
          this.params.api.forEachNode((node) => {
            if (node.rowIndex === this.focusCellIndex) {
              node.setSelected(true);
            }
          });
        }, 0);
      }
      if (keyCode === KEY_UP) {
        this.focusCellIndex = focusCell.rowIndex === 0 ? 0 : focusCell.rowIndex - 1;
        this.gridTableService.setFocusCell(this.params, focusCell.column.colId, null, this.focusCellIndex, isEditing);
      }
    }
  }


  private searchJobInfo(val, paginationParams?) {
    if (val.searchKeyword) {
      this.loadingService.setDisplay(true);
      const obj = {
        cfId: this.proposalForm.value.cfId,
        cmId: this.proposalForm.value.cmId,
        id: null,
        isBp: 'Y'
      };
      return this.repairJobApi.getJobsGroupQuotation(Object.assign({}, obj, val, paginationParams)).subscribe(job => {
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

  cellClicked(event) {
    if (this.state && !this.disableBtnDel.includes(this.state.toString()) && this.selectedNode && this.selectedNode.data.quotationprintVersion) {
      return;
    }
  }

  rowClicked(event) {
    this.focusCellIndex = event.rowIndex;
    setClickedRow(this.params, this.selectedNode, 'CV');
  }

  navigateToNextCell(params) {
    const currentField = params.previousCellPosition.column.colDef.field;
    if ((params.key === 38 || params.key === 40) && currentField === 'bpType') {
      return params.previousCellPosition;
    }
    return params.nextCellPosition;
  }

  suppressJobName() {
    const self = this;
    return (params) => {
      const focusCell = params.api.getFocusedCell();
      if (params.event.keyCode === 9) {
        params.api.setFocusedCell(focusCell.rowIndex, 'bpType');
        self.editing = params.editing;
        return true;
      }
      return false;
    };
  }

  suppressBPType() {
    const self = this;
    return (params) => {
      const keyCode = params.event.keyCode;
      if (keyCode === 9) {
        if (!self.editing) {
          return false;
        }
        params.event.preventDefault();
        params.api.setFocusedCell(params.api.getFocusedCell().rowIndex, 'costs');
        return true;
      }
      return false;
    };
  }

  cellFocused(params) {
    setFocusedCell(params, currentTab, false);
  }

  private returnIntOrFloat(val) {
    return val % 1 === 0 ? val : val.toFixed(2);
  }
}
