import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {RepairJobApi} from '../../../../api/common-api/repair-job.api';
import {JobGroupTypes} from '../../../../core/constains/job-group-types';
import {RepairJobDetailApi} from '../../../../api/common-api/repair-job-detail.api';
import {CommonService} from '../../../../shared/common-service/common.service';
import {GridTableService} from '../../../../shared/common-service/grid-table.service';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {ConfirmService} from '../../../../shared/confirmation/confirm.service';
import {DataCodes} from '../../../../core/constains/data-code';
import {PartsInfoManagementApi} from '../../../../api/parts-management/parts-info-management.api';
import {ToastService} from '../../../../shared/swal-alert/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'repair-job-detail',
  templateUrl: './repair-job-detail.component.html',
  styleUrls: ['./repair-job-detail.component.scss']
})
export class RepairJobDetailComponent implements OnInit, OnChanges {
  @Input() carModelId: number;
  @Input() form;
  jobGroupTypes = JobGroupTypes;

  jobGroupField;
  jobGroupParams;
  jobGroupList;
  jobGroupSelected;

  repairJobField;
  repairJobParams;
  repairJobList;
  repairJobSelected;
  repairJobFooter;
  listState;
  partField;
  partParams;
  partFooter;
  partList;
  currentDlrId;

  constructor(
    private loading: LoadingService,
    private gridTable: GridTableService,
    private common: CommonService,
    private repairJobApi: RepairJobApi,
    private repairJobDetailApi: RepairJobDetailApi,
    private dataFormatService: DataFormatService,
    private confirm: ConfirmService,
    private partsInfoManagementApi: PartsInfoManagementApi,
    private swalAlert: ToastService
  ) {
  }

  ngOnInit() {
    this.getListState();
    this.repairJobField = [
      {headerName: 'Mã CV', headerTooltip: 'Mã CV', field: 'rccode', maxWidth: 80},
      {headerName: 'Tên CV', headerTooltip: 'Tên CV', field: 'rcname', maxWidth: 250},
      {
        headerName: 'Loại CV', headerTooltip: 'Loại công việc', field: 'internal', maxWidth: 100, cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        cellRenderer: (params) => {
          if (params.value) {
            return params.value === 'Y' ? 'Chính hãng' : 'Không chính hãng';
          }
          return;
        }
      },
      {headerName: 'Định mức giờ công', headerTooltip: 'Định mức giờ công', field: 'jobtime', maxWidth: 130, cellClass: ['cell-border', 'cell-readonly', 'text-right']},
      {headerName: 'Giờ công thực tế', headerTooltip: 'Giờ công thực tế', field: 'actualJobTime', maxWidth: 100, cellClass: ['cell-border', 'cell-readonly', 'text-right']},
      {
        headerName: 'Thành tiền', headerTooltip: 'Thành tiền', field: 'costs', cellClass: ['cell-border', 'cell-readonly', 'text-right'], maxWidth: 100,
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      },
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'remark', maxWidth: 220}
    ];
    this.jobGroupField = [
      {headerName: 'Mã gói CV', headerTooltip: 'Mã gói CV', field: 'gjCode'},
      {headerName: 'Tên gói CV', headerTooltip: 'Tên gói CV', field: 'gjName'},
      {
        headerName: 'Loại', headerTooltip: 'Loại', field: 'jobType',
        valueFormatter: params => {
          const matchVal = this.jobGroupTypes.find(type => type.id === params.value);
          return matchVal ? matchVal.name : '';
        }
      },
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'remark'},
      {
        headerName: 'Trạng thái', headerTooltip: 'Trạng thái', field: 'deleteFlag',
        cellRenderer: (params) => {
          if (params.value) {
            const data = this.listState.find(it => it.dataValue === params.value);
            return data ? data.dataNameVn : '';
          }
          return;
        }
      }
    ];
    this.partField = [
      {headerName: 'Mã PT', headerTooltip: 'Mã phụ tùng', field: 'partsCode', minWidth: 100},
      {headerName: 'Tên phụ tùng', headerTooltip: 'Tên phụ tùng', valueGetter: params => {
          return params.data && params.data.partsNameVn && !!params.data.partsNameVn ? params.data.partsNameVn : params.data.partsName;
        }, minWidth: 200},
      {
        headerName: 'Loại', headerTooltip: 'Loại', field: 'genuine', minWidth: 100,
        cellRenderer: (params) => {
          if (params.value) {
            return params.value === 'Y' ? 'Chính hãng' : 'Không chính hãng';
          }
          return;
        }
      },
      {headerName: 'Đơn vị', headerTooltip: 'Đơn vị', field: 'unit', minWidth: 100},
      {headerName: 'Số lượng', headerTooltip: 'Số lượng', field: 'amount', cellClass: ['cell-border', 'cell-readonly', 'text-right'], minWidth: 100},
      {
        headerName: 'Đơn giá', headerTooltip: 'Đơn giá', field: 'sellPrice', cellClass: ['cell-border', 'cell-readonly', 'text-right'], minWidth: 100,
        valueFormatter: params => (params && typeof params.value === 'string') ? params.value : this.dataFormatService.moneyFormat(params.value)
      },
      {
        headerName: 'Thành tiền', headerTooltip: 'Thành tiền', field: 'payment', cellClass: ['cell-border', 'cell-readonly', 'text-right'], minWidth: 200,
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      }
    ];
    this.currentDlrId = JSON.parse(localStorage.getItem('TMSS_Service_Current_User')).dealerId;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.carModelId || this.carModelId === 0) {
      if (this.jobGroupParams) {
        this.callbackGridJG(this.jobGroupParams);
      }
    }
  }

  callbackGridJG(params) {
    params.api.setRowData();
    this.jobGroupParams = params;
    this.getWorkGroupByModel();
  }

  getParamsJG() {
    const selectedData = this.jobGroupParams.api.getSelectedRows();
    if (selectedData) {
      this.jobGroupSelected = selectedData[0];
      this.getDetailJobGroup();
    }
  }

  getParamsRJ() {
    const selectedData = this.repairJobParams.api.getSelectedRows();
    if (selectedData) {
      this.repairJobSelected = selectedData[0];
    }
  }

  getListState() {
    this.partsInfoManagementApi.getDataCode(DataCodes.jobGroupStatus).subscribe(res => {
      this.listState = res ? res : [];
    });
  }

  getDetailJobGroup() {
    this.repairJobList = this.jobGroupSelected.listJobsDetail;
    this.repairJobParams.api.setRowData(this.repairJobList);
    this.setRepairJobFooter();
    this.partList = this.getPartList(this.repairJobList);
    this.partParams.api.setRowData(this.partList);
    this.setRepairPartFooter();
  }

  getPartList(res) {
    const partList = [];
    res.map(it => it.listPartsDetail.forEach(item => partList.push(item)));
    return partList;
  }

  callbackGridRJ(params) {
    this.repairJobParams = params;
    params.api.setRowData([]);
    this.setRepairJobFooter();
  }

  callbackGridParts(params) {
    this.partParams = params;
    params.api.setRowData([]);
    this.setRepairPartFooter();
  }

  onBtnDeleteJobGroup() {
    this.confirm.openConfirmModal('Xác nhận!', 'Bạn có muốn xóa dòng này?').subscribe(() => {
      this.repairJobApi.deleteJobGroup(this.jobGroupSelected.id).subscribe(() => {
        this.swalAlert.openSuccessToast();
        this.getWorkGroupByModel();
      });
    }, () => {
    });
  }

  private setRepairJobFooter() {
    const calPriceTotal = (arrayObj: Array<any>) => {
      if (!arrayObj || !arrayObj.length) {
        return 0;
      }
      let sum = 0;
      for (let i = 0, length = arrayObj.length; i < length; i++) {
        sum += (Number(arrayObj[i].costs) || 0) * (Number(arrayObj[i].actualJobTime) || Number(arrayObj[i].jobtime) || 0);
      }
      return sum;
    };
    const total = calPriceTotal(this.repairJobList);
    this.repairJobFooter = [{
      actualJobTime: 'Tổng tiền',
      costs: this.repairJobList ? (total) : 0
    }];
  }

  private setRepairPartFooter() {
    const calPriceTotal = (arrayObj: Array<any>) => {
      if (!arrayObj || !arrayObj.length) {
        return 0;
      }
      let sum = 0;
      for (let i = 0, length = arrayObj.length; i < length; i++) {
        sum += (Number(arrayObj[i].payment) || 0);
      }
      return sum;
    };
    const total = calPriceTotal(this.partList);
    this.partFooter = [{
      sellPrice: 'Tổng tiền',
      payment: this.repairJobList ? total : 0

    }];
  }

  getWorkGroupByModel() {
    this.loading.setDisplay(true);
    const obj = {
      cfId: this.form.value.carFamId,
      cmId: this.form.value.carModelId,
      deleteFlag: this.form.value.deleteFlag
    };
    this.repairJobApi.searchJobsGroup(obj).subscribe(jobGroup => {
      this.jobGroupSelected = [];
      this.jobGroupList = jobGroup || [];
      this.jobGroupParams.api.setRowData(this.jobGroupList);
      this.jobGroupParams.api.forEachNode(node => {
        if (node.childIndex === 0) {
          node.setSelected(true);
        }
      });
      this.gridTable.selectFirstRow(this.jobGroupParams);
      if (jobGroup.length === 0) {
        this.repairJobParams.api.setRowData([]);
        this.partParams.api.setRowData([]);
      }
      this.loading.setDisplay(false);
    });
  }
}
