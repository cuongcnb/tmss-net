import {
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
import {FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';

import {ToastService} from '../../../../../../shared/swal-alert/toast.service';
import {DataFormatService} from '../../../../../../shared/common-service/data-format.service';
import {SrvDRcJobsApi} from '../../../../../../api/master-data/warranty/srv-d-rc-jobs.api';
import {AgSelectRendererComponent} from '../../../../../../shared/ag-select-renderer/ag-select-renderer.component';
import {GridTableService} from '../../../../../../shared/common-service/grid-table.service';
import {SubletApi} from '../../../../../../api/common-api/sublet.api';
import {LoadingService} from '../../../../../../shared/loading/loading.service';
import {InsuranceApi} from '../../../../../../api/sales-api/insurance/insurance.api';
import {AgCheckboxRendererComponent} from '../../../../../../shared/ag-checkbox-renderer/ag-checkbox-renderer.component';
import {DlrConfigApi} from '../../../../../../api/common-api/dlr-config.api';
import {state} from '../../../../../../core/constains/ro-state';
import {ConfirmService} from '../../../../../../shared/confirmation/confirm.service';
import {DataCodes} from '../../../../../../core/constains/data-code';
import {PartsInfoManagementApi} from '../../../../../../api/parts-management/parts-info-management.api';
import {RepairJobApi} from '../../../../../../api/common-api/repair-job.api';
import {NextShortcutService} from '../../../../../../shared/common-service/nextShortcut.service';

import {
  discountUpdate$,
  setDiscount
} from '../../accessory-of-proposal/accessory-discount/accessory-discount.component';
import {setClickedRow} from '../../proposal.component';
import {StorageKeys} from '../../../../../../core/constains/storageKeys';
import {GoUpButtonComponent} from '../../go-up-button/go-up-button.component';
import { setFocusedCell, currentTab } from '@app/shared/common/focused-cells';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'general-repair-of-proposal',
  templateUrl: './general-repair-of-proposal.component.html',
  styleUrls: ['./general-repair-of-proposal.component.scss']
})
export class GeneralRepairOfProposalComponent implements OnInit, OnChanges, OnDestroy {
  @Output() countMoney = new EventEmitter();
  @Output() partByJob = new EventEmitter();
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
  newVal = {
    rccode: null,
    jobsname: null,
    subletTypeCode: null,
    timework: null,
    actualtime: null,
    costs: null,
    taxRate: 10,
    discountPercent: 0,
    discount: 0,
    notes: null,
    version: this.proposalForm ? (this.proposalForm.getRawValue().quotationprint || 0) + 1 : 1,
    fix: null,
    jobtime: null,
    seq: 1
  };
  fieldGrid;
  selectedNode;
  disabledBtnAdd = [state.complete, state.settlement, state.cancel, state.completeSc];
  params;
  // tslint:disable-next-line:variable-name
  _isRepair;
  isRepairObs;
  observer;
  works: Array<any> = [];
  footerData;
  fieldGridWorkCode;
  frameworkComponents;
  subletTypeList = [];
  listJobTypeGj = [];
  costDealer;
  focusCellIndex = 0;
  doubleClickParams;
  disableBtnDel = [state.quotation, state.quotationTmp];
  selectedRow;
  stateCVDV = [null, state.quotationTmp, ''];
  costsWarningFlag = false;
  discountObs$;
  dlrConfig;

  constructor(
    private dataFormatService: DataFormatService,
    private gridTableService: GridTableService,
    private swalAlertService: ToastService,
    private rcJobApi: SrvDRcJobsApi,
    private subletApi: SubletApi,
    private loadingService: LoadingService,
    private confirmService: ConfirmService,
    private insuranceApi: InsuranceApi,
    private dlrConfigApi: DlrConfigApi,
    private cdr: ChangeDetectorRef,
    private repairJobApi: RepairJobApi,
    private partsInfoManagementApi: PartsInfoManagementApi,
    private nextShortcutService: NextShortcutService
  ) {
    const dlrConfig = JSON.parse(localStorage.getItem(StorageKeys.dlrConfig));
    if (dlrConfig) {
      this.dlrConfig = dlrConfig;
    } else {
      // this.dlrConfigApi.getByCurrentDealer().subscribe(res => this.dlrConfig = res ? res[0] : undefined);
      this.dlrConfigApi.getCurrentByDealer().subscribe(res => this.dlrConfig = res ? res : undefined);
    }
    this.fieldGridWorkCode = [
      {
        headerName: 'Mã CV',
        headerTooltip: 'Mã công việc',
        field: 'rccode'
      },
      {
        headerName: 'Tên CV',
        headerTooltip: 'Tên công việc',
        field: 'rcname',
        maxLength: 150
      },
      {
        headerName: 'Ghi chú',
        headerTooltip: 'Ghi chú',
        field: 'remark'
      },
      {
        headerName: 'Đ/mức giờ công',
        headerTooltip: 'Định mức giờ công',
        field: 'jobtime',
        cellClass: ['cell-border', 'text-right']
      },
      {
        headerName: 'H công thực tế',
        headerTooltip: 'Giờ công thực tế',
        field: 'actualJobTime',
        cellClass: ['cell-border', 'text-right'],
      }
    ];
    this.fieldGrid = [
      {
        headerName: 'Mã CV',
        headerTooltip: 'Mã công việc',
        field: 'rccode',
        width: 70,
        editable: params => {
          const roState = this.proposalForm.get('rostate').value;
          return (!roState || roState === state.quotation || roState === state.quotationTmp || this.roState === state.lxpt || !params.data.quotationprintVersion);
        },
        cellStyle: params => !(params.data && params.data.subletTypeCode) ? {backgroundColor: '#FFFFCC'} : {backgroundColor: '#F5F5F5'},
        cellClass: params => params.data && params.data.subletTypeCode ? ['cell-readonly', 'cell-border', 'rccode'] : ['cell-clickable', 'cell-border', 'rccode']
      },
      {
        headerName: 'Tên CV',
        headerTooltip: 'Tên công việc',
        field: 'jobsname',
        maxLength: 150,
        editable: params => {
          const roState = this.proposalForm.get('rostate').value;
          return (!roState || roState === state.quotation || roState === state.quotationTmp || this.roState === state.lxpt || !params.data.quotationprintVersion);
        },
        cellClass: ['cell-clickable', 'cell-border'],
        validators: ['required', 'maxLength']
      },
      {
        headerName: 'Loại CV', headerTooltip: 'Loại công việc', field: 'jobType',
        cellRenderer: 'agSelectRendererComponent',
        list: this.listJobTypeGj,
        cellClass: params => params.data && params.data.status && params.data.status === 'Y' ? ['cell-unClickDropdown', 'cell-border']
          : ['cell-clickDropdown', 'cell-border', 'text-right'],
        disableSelect: (params) => {
          return params.data && params.data.status && params.data.status === 'Y';
        },
        width: 100
      },
      {
        headerName: 'Kiểu CV thuê ngoài',
        headerTooltip: 'Kiểu công việc thuê ngoài',
        field: 'subletTypeCode',
        width: 100,
        cellRenderer: 'agSelectRendererComponent',
        list: this.subletTypeList,
        cellClass: params => params.data && params.data.status && params.data.status === 'Y' ? ['cell-unClickDropdown', 'cell-border']
          : ['cell-clickDropdown', 'cell-border', 'p-0'],
        disableSelect: params => params.data && params.data.status && params.data.status === 'Y'
      },
      {
        headerName: 'GC ĐM',
        headerTooltip: 'Giờ công định mức',
        field: 'timework',
        width: 50,
        cellClass: ['text-right', 'cell-border']
      },
      {
        headerName: 'GC TT',
        headerTooltip: 'Giờ công thực tế',
        field: 'actualtime',
        width: 50,
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
        width: 90,
        cellClass: ['text-right', 'cell-border', 'costs'],
        editable: params => {
          return params.data && params.data.status !== 'Y';
        },
        maxLength: 10,
        cellStyle: params => !params.data.subletTypeCode ? {backgroundColor: '#FFFFCC'} : {backgroundColor: '#F5F5F5'},
        validators: ['required', 'number', 'notNagetiveIntNumber', 'maxLength'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      },
      {
        headerName: 'Thuế',
        headerTooltip: 'Thuế',
        field: 'taxRate',
        width: 60,
        required: true,
        // disableSelect: () => {
        //   return Number(this.roState) >= 1 ? true : null
        // },
        cellRenderer: 'agSelectRendererComponent',
        list: [
          {key: 10, value: 10},
          {key: 5, value: 5},
          {key: 0, value: 0}
        ],
        cellClass: params => params.data.status && params.data.status === 'Y' ? ['cell-unClickDropdown', 'cell-border']
          : ['cell-clickDropdown', 'cell-border', 'text-right'],
        disableSelect: params => {
          return params.data.status && params.data.status === 'Y';
        }
      },
      {
        headerName: '% Giảm',
        headerTooltip: '% Giảm',
        field: 'discountPercent',
        width: 50,

        // validators: ['number'],
        cellClass: ['text-right', 'cell-border'],
        cellStyle: {backgroundColor: '#FFFFCC'}
      },
      {
        headerName: 'Giá giảm',
        headerTooltip: 'Giá giảm',
        field: 'discount',
        width: 70,
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
        width: 50
      },
      {
        headerName: 'Ver',
        headerTooltip: 'Ver',
        field: 'quotationprintVersion',
        width: 40
      },
      // {
      //   headerName: 'Sửa lại',
      //   headerTooltip: 'Sửa lại',
      //   field: 'readjust',
      //   width: 50,
      //   cellClass: ['text-center', 'cell-border'],
      //   cellRenderer: (params) => `<input disabled type="checkbox" ${params.data.readjust === true ? 'checked' : ''}/>`,
      //   disableCheckbox: () => this.isRepairObs
      // },
      {
        headerName: '',
        headerTooltip: 'Thay đổi thứ tự hiển thị',
        field: undefined,
        width: 50,
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
    ];
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
      this.proposalForm.get('jobListScc').setValue(dataObj);
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
      this.proposalForm.get('jobListScc').setValue(dataObj);
      this.params.api.getDisplayedRowAtIndex(index + 1).setSelected(true);
    }
  }

  ngOnInit() {
    // const registerno = this.proposalForm.get('registerno').value;
    // window.onfocus = () => {
    //   const dataLocalStorage = JSON.parse(localStorage.getItem(registerno));
    //   if (dataLocalStorage) {
    //     if (this.params && dataLocalStorage.colId) {
    //       this.gridTableService.setFocusCellDontEdit(this.params, dataLocalStorage.colId, Number(dataLocalStorage.rowIndex));
    //       this.params.api.clearFocusedCell();
    //       setTimeout(() => {
    //         this.gridTableService.setFocusCell(
    //           this.params,
    //           dataLocalStorage.colId,
    //           null,
    //           Number(dataLocalStorage.rowIndex)
    //         );
    //       }, 100);
    //     }
    //   }
    // };
    // window.onblur = () => {
    //   // this.focusedCells = [];
    //   const focusCell = this.params.api.getFocusedCell();
    //   console.log(focusCell);
    //   console.log(registerno);
    //   const dataLocalStorage = localStorage.getItem(registerno);
    //   if (dataLocalStorage) {
    //     localStorage.removeItem(registerno);
    //   }
    //   if (focusCell) {
    //     const obj = {
    //       colId: focusCell.column.colId,
    //       rowIndex: focusCell.rowIndex
    //     };
    //     localStorage.setItem(registerno, JSON.stringify(obj));
    //
    //   }
    // };
    this.getSubletTypeList();
    this.getListJobTypeGj();
    this.getDealerConfig();
    if (this.params && (!this.data || this.data.length < 1)) {
      this.params.api.updateRowData({add: [this.newVal]});
    }
    // this.proposalForm.get('pds').valueChanges.subscribe(val => {
    //   if (val && (this.proposalForm.value.rotype === '2' || this.proposalForm.value.roTypeTemp === '2')) {
    //     const arr = this.proposalForm.value.jobListScc;
    //     if (arr && arr.length > 0) {
    //       arr.map(it => {
    //         if (it && it.costs) {
    //           it.costs = 0;
    //         }
    //         return it;
    //       });
    //     }
    //     this.params.api.setRowData(arr);
    //     this.calculateInfo();
    //   }
    // });

    this.discountObs$ = discountUpdate$.subscribe((data: any) => {
      if (data && data.registerno === this.proposalForm.get('registerno').value) {
        if (this.proposalForm.value.rotype === '2' || this.proposalForm.value.roTypeTemp === '2') {
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

  ngOnChanges(changes: SimpleChanges): void {
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
      if (this.params && (!this.data || this.data.length < 1)) {
        const newVal = {
          rccode: null,
          jobsname: null,
          subletTypeCode: null,
          timework: null,
          actualtime: null,
          costs: null,
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
    this.subletApi.getAll()
      .subscribe(subletTypeList => {
        subletTypeList.forEach(subletType => {
          this.subletTypeList.push({
            key: subletType.sublettype,
            value: subletType.desceng
          });
        });
        this.loadingService.setDisplay(false);
      });
  }

  getListJobTypeGj() {
    this.partsInfoManagementApi.getDataCode(DataCodes.jobTypeGj)
      .subscribe(res => {
        res.forEach(it => {
          this.listJobTypeGj.push({
            key: it.dataValue,
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
        total: costs - discount + taxRate
      };
      this.countMoney.emit(this.footerData);
    }
    const dataObj = this.gridTableService.getAllDataAfterFilterAndSort(this.params).map(it => {
      // return Object.assign({}, it, {id: null, readjust: it.readjust ? 'Y' : 'N'})
      it.id = null;
      return it;
    });
    this.proposalForm.get('jobListScc').setValue(dataObj);

  }

  addWork(jobsname?) {
    const lastIndex = this.params.api.getLastDisplayedRow();
    let lastItem = null;
    if (lastIndex >= 0) {
      lastItem = this.params.api.getDisplayedRowAtIndex(lastIndex).data;
      // if ((!lastItem.jobsname || (!lastItem.costs && !this.proposalForm.value.pds)) && !jobsname) {
      if (!lastItem.jobsname) {
        this.swalAlertService.openWarningToast('Kiểm tra lại Công Việc');
        return;
      }
    }
    const newVal = {
      rccode: null,
      jobsname: jobsname ? jobsname : null,
      subletTypeCode: null,
      jobType: null,
      timework: null,
      actualtime: null,
      costs: null,
      taxRate: 10,
      discountPercent: 0,
      discount: 0,
      notes: null,
      version: this.proposalForm ? (this.proposalForm.getRawValue().quotationprint || 0) + 1 : 1,
      fix: null,
      jobtime: null,
      seq: lastItem ? lastItem['seq'] + 1 : 1
    };
    this.params.api.updateRowData({add: [newVal]});
    this.gridTableService.setFocusCellDontEdit(this.params, this.fieldGrid[0].field, lastIndex + 1);
    this.params.api.getModel().rowsToDisplay[lastIndex + 1].setSelected(true);
    this.params.api.startEditingCell({
      rowIndex: lastIndex + 1,
      colKey: 'rccode'
    });
    this.calculateInfo();
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
            discountPercent: 0,
            jobtime: obj.jobtime,
            version: (this.proposalForm.getRawValue().quotationprint || 0) + 1,
            fix: true,
            jobsname: obj.rcname,
            timework: obj.jobtime,
            actualtime: obj.actualJobTime,
            taxRate: 10,
            subletTypeCode: null,
            costs: obj.costs,
            status: 'N',
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
      this.confirmService.openConfirmModal('Bạn có chắc muốn xóa bản ghi được chọn')
        .subscribe(res => {
          this.params.api.updateRowData({remove: [this.selectedNode.data]});
          this.calculateInfo();
        });
    }
  }

  getWorkCodeList(searchKey, paginationParams ?) {
    const obj = {
      cfId: this.proposalForm.value.cfId,
      cmId: this.proposalForm.value.cmId,
      id: null
    };
    return this.repairJobApi.getJobsGroupQuotation(Object.assign({}, obj, searchKey), paginationParams);
  }

  cellDoubleClicked(params) {
    const col = params.colDef.field;
    // if (this.state && this.state.toString() !== '1' && this.selectedNode && this.selectedNode.data.quotationprintVersion && col === 'rccode') {
    //   return;
    // }
    // const data = params.data;
    // if (col === 'rccode' && !data.subletTypeCode) {
    //   this.searchJobInfo({searchKeyword: params.value}, null);
    // }
    if (col === 'discountPercent') {
      this.discountModal.open(params.data.discountPercent);
    }
    this.doubleClickParams = params;
  }

  cellEditingStarted(params) {
    this.proposalForm.markAsDirty();

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
      case 'costs':
        this.params.api.forEachNode(rowNode => {
          if (params.rowIndex === rowNode.rowIndex && !params.data.subletTypeCode) {
            // rowNode.setDataValue('actualtime', this.returnIntOrFloat((Number(params.newValue) / costDealer ? costDealer : 1)));
            rowNode.setDataValue('discount', Math.round(Number(params.newValue) * Number(params.data.discountPercent || 0) / 100));
          }
        });
        break;
    }

    if (params.column.colId === 'discountPercent' && Number(params.newValue) === Number(params.oldValue)) {
      return;
    }
  }

  cellEditingStopped(params) {
    const registerno = this.proposalForm.get('registerno').value;
    // params.data.rccode = params.data.rccode.replace(/\s/g, '');
    // params.data.jobsname = params.data.jobsname.trim();
    // params.data.actualtime = params.data.actualtime.replace(/\s/g, '');
    // params.data.costs = params.data.costs.replace(/\s/g, '');
    // params.data.discount = params.data.discount.replace(/\s/g, '');
    window.onfocus = () => {
      // tslint:disable-next-line:no-shadowed-variable
      const dataLocalStorage = JSON.parse(localStorage.getItem(registerno));
      if (dataLocalStorage) {
        if (this.params && dataLocalStorage.colId) {
          this.gridTableService.setFocusCellDontEdit(this.params, dataLocalStorage.colId, Number(dataLocalStorage.rowIndex));
          this.params.api.clearFocusedCell();
          setTimeout(() => {
            this.gridTableService.setFocusCell(
              this.params,
              dataLocalStorage.colId,
              null,
              Number(dataLocalStorage.rowIndex)
            );
          }, 100);
        }
      }
    };
    const focusCell = this.params.api.getFocusedCell();
    const dataLocalStorage = localStorage.getItem(registerno);
    if (dataLocalStorage) {
      localStorage.removeItem(registerno);
    }
    if (focusCell) {
      const obj = {
        colId: focusCell.column.colId,
        rowIndex: focusCell.rowIndex
      };
      localStorage.setItem(registerno, JSON.stringify(obj));

    }
    setFocusedCell(this.params, currentTab);
    const col = params.colDef.field;
    const data = params.data;
    switch (col) {
      case 'actualtime':
        data.costs = this.returnIntOrFloat(parseFloat(this.dlrConfig ? this.dlrConfig.cost : 0) * (parseFloat(data.actualtime) || 0));
        break;
      case 'costs':
        if (Number(data.costs) < 0 && this.costsWarningFlag === false) {
          this.swalAlertService.openWarningToast('Phải là số nguyên không âm', 'Số không hợp lệ');
          this.gridTable.focusAfterEdit(params);
          this.costsWarningFlag = true;
          break;
        }
        data.actualtime = this.returnIntOrFloat((parseFloat(data.costs ? data.costs : 0)) / (parseFloat(this.dlrConfig ? this.dlrConfig.cost : 1)));
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
        if (Number(data.discount) > Number(data.costs) || Number(data.discount) < 0) {
          this.swalAlertService.openWarningToast('GIẢM GIÁ không thể lớn hơn THÀNH TIỀN hoặc nhỏ hơn 0', 'Số không hợp lệ');
          this.gridTable.focusAfterEdit(params);
          break;
        }
        if (params.column.editingStartedValue !== params.value) {
          const discountPercent = (Number(params.data.discount) !== 0) ? (parseFloat(params.data.discount) / (Number(params.data.costs) || 1) * 100) : 0;
          params.data.discountPercent = this.returnIntOrFloat(discountPercent);
        }
        break;
      case 'taxRate':
        break;
    }
    params.node.setData(data);
    this.params.api.refreshCells();

    this.calculateInfo();
  }

  moneyFormat(val) {
    return this.dataFormatService.moneyFormat(val);
  }

  agKeyUp(event) {
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
    const KEY_TAB = 'Tab';

    const displayedData = this.gridTableService.getAllData(this.params);

    // Press enter to search with modal
    if (srcElement.classList.contains('rccode') && keyCode === KEY_ENTER) {
      this.searchJobInfo({searchKeyword: srcElement.innerHTML}, null, this.selectedNode.data.isCampaign);
    }
    // Add new row with hot keys
    const focusCell = this.params.api.getFocusedCell();
    const editingCells = this.params.api.getEditingCells();
    const isEditing = !!editingCells.find(val => val.column.colId === focusCell.column.colId);
    if (keyCode === KEY_DOWN) {
      if (focusCell.rowIndex === displayedData.length - 1) {
        this.addWork();
      } else {
        this.gridTableService.setFocusCell(this.params, focusCell.column.colId, null, focusCell.rowIndex + 1, isEditing);
      }
    }
    if (keyCode === KEY_UP) {
      this.focusCellIndex = focusCell.rowIndex === 0 ? 0 : focusCell.rowIndex - 1;
      this.gridTableService.setFocusCell(this.params, focusCell.column.colId, null, this.focusCellIndex, isEditing);
    }
    if (keyCode === KEY_TAB && event.target.className === 'ag-cell-edit-input' && focusCell.column.colId === 'costs') {

    }
  }

  navigateToNextCell(params) {
    const KEY_UP = 38;
    const KEY_DOWN = 40;
    if ((params.key === KEY_UP || params.key === KEY_DOWN)) {
      return params.previousCellPosition;
    }
    return params.nextCellPosition;
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

  private searchJobInfo(val, paginationParams ?, isCampaign ?) {
    const findJob = () => {
      if (val.searchKeyword) {
        this.loadingService.setDisplay(true);
        this.repairJobApi.getJobsGroupQuotation(Object.assign({
          cfId: this.proposalForm.value.cfId,
          cmId: this.proposalForm.value.cmId,
          id: null
        }, val, paginationParams)).subscribe(job => {
          this.loadingService.setDisplay(false);
          if (job.list && job.list.length === 1) {
            this.modifyWork(job.list[0]);
          } else {
            this.searchWorkCodeModal.open(val, job.list, job.length);
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

  cellClicked(event) {
    if (this.state && this.selectedNode && this.selectedNode.data.quotationprintVersion) {
      const roState = this.proposalForm.get('rostate').value;
      return (!roState || roState === state.quotation || roState === state.quotationTmp || this.roState === state.lxpt || !this.selectedNode.quotationprintVersion);
      if (event) {
        event.colDef.disableSelect();
      }
    }
  }

  rowClicked(event) {
    this.focusCellIndex = event.rowIndex;
    setClickedRow(this.params, this.selectedNode, 'CV');
    // if (event.node.selected && !!event.node.data) {
    //   this.nextShortcutService.nextCheckShortcut('SCC');
    //   this.nextShortcutService.listen().subscribe((res: string) => {
    //     if (res === 'SCC') {
    //       this.removeWork();
    //       this.nextShortcutService.nextFunction(null);
    //     }
    //   });
    // }
  }

  tabToNextCellCustom(params) {
    const currentField = params.previousCellPosition.column.colDef.field;
    if (params.editing && currentField === 'jobsname') {
      return {
        rowIndex: params.nextCellPosition.rowIndex,
        column: params.nextCellPosition.column.columnApi.getColumn('costs')
      };
    }
    return params.nextCellPosition;
  }

  cellFocused(params) {
    setFocusedCell(params, currentTab, false);
  }

  private returnIntOrFloat(val) {
    return val % 1 === 0 ? val : Number(val.toFixed(2));
  }
}
