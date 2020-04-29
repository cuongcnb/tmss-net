import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {JobGroupTypes} from '../../../../core/constains/job-group-types';
import {CommonService} from '../../../../shared/common-service/common.service';
import {RepairJobApi} from '../../../../api/common-api/repair-job.api';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {GridTableService} from '../../../../shared/common-service/grid-table.service';
import {JobGroupModel} from '../../../../core/models/catalog-declaration/job-group.model';
import {RepairJobModel} from '../../../../core/models/catalog-declaration/repair-job.model';
import {RepairJobDetailApi} from '../../../../api/common-api/repair-job-detail.api';
import {PartsOfJobModel} from '../../../../core/models/catalog-declaration/parts-of-job.model';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {FormBuilder} from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'detail-job-package',
  templateUrl: './detail-job-package.component.html',
  styleUrls: ['./detail-job-package.component.scss']
})
export class DetailJobPackageComponent implements OnInit, OnChanges {

  @Input() carModelId: number;
  jobGroupTypes = JobGroupTypes;
  form;
  jobGroupField;
  jobGroupParams;
  jobGroupList: Array<JobGroupModel>;
  jobGroupSelected: JobGroupModel;

  repairJobField;
  repairJobParams;
  repairJobList: Array<RepairJobModel>;
  repairJobSelected: RepairJobModel;
  repairJobFooter;

  partField;
  partParams;
  partList: Array<PartsOfJobModel>;
  partFooter;
  partTotalWithoutTax: number;
  partTaxTotal: number;
  partTotalWithTax: number;

  constructor(
    private loading: LoadingService,
    private gridTable: GridTableService,
    private common: CommonService,
    private repairJobApi: RepairJobApi,
    private repairJobDetailApi: RepairJobDetailApi,
    private dataFormatService: DataFormatService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.jobGroupField = [
      {headerName: 'Mã gói CV', headerTooltip: 'Mã gói CV', field: 'gjCode'},
      {headerName: 'Tên gói CV', headerTooltip: 'Tên gói CV', field: 'gjName'},
      {
        headerName: 'Type', headerTooltip: 'Type', field: 'jobType',
        valueFormatter: params => {
          const matchVal = this.jobGroupTypes.find(type => type.id === params.value);
          return matchVal ? matchVal.name : '';
        }
      },
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'remark'}
    ];
    this.repairJobField = [
      {headerName: 'Mã CV', headerTooltip: 'Mã CV', field: 'rcCode'},
      {headerName: 'Tên CV', headerTooltip: 'Tên CV', field: 'rcName'},
      {headerName: 'Loại CV', headerTooltip: 'Loại công việc', field: 'jobType'},
      {headerName: 'Giờ công tiêu chuẩn', headerTooltip: 'Giờ công tiêu chuẩn', field: 'jobTime'},
      {headerName: 'Giờ công thực tế', headerTooltip: 'Giờ công thực tế', field: 'actualJobTime'},
      {
        headerName: 'Thành tiền', headerTooltip: 'Thành tiền', field: 'price', cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      },
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'remark'}
    ];
    this.partField = [
      {headerName: 'Mã PT', headerTooltip: 'Mã phụ tùng', field: 'partsCode', width: 200},
      {
        headerName: 'Tên phụ tùng', headerTooltip: 'Tên phụ tùng', valueGetter: params => {
           return params.data && params.data.partsNameVn && !!params.data.partsNameVn
             ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '' ;
        }
      },
      {headerName: 'Genuine', headerTooltip: 'Genuine', field: 'genuine'},
      {headerName: 'Đơn vị', headerTooltip: 'Đơn vị', field: 'unitName'},
      {headerName: 'Số lượng', headerTooltip: 'Số lượng', field: 'reqQty'},
      {
        headerName: 'Đơn giá', headerTooltip: 'Đơn giá', field: 'sellPrice',
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      },
      {headerName: 'Thuế', headerTooltip: 'Thuế', field: 'tax'},
      {
        headerName: 'Thành tiền (chưa thuế)', headerTooltip: 'Thành tiền (chưa thuế)', field: 'total',
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      }
    ];
    this.setPartFooter();
    this.setRepairJobFooter();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.carModelId || this.carModelId === 0) {
      this.resetAll();
      if (this.jobGroupParams) {
        this.callbackGridJG(this.jobGroupParams);
      }
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      quotationprint: [{value: undefined, disabled: true}],
      name: [undefined, GlobalValidator.required],
      jobListScc: [undefined],
      partList: [undefined],
      jobListDs: [undefined]
    });
  }

  private resetAll() {
    this.jobGroupList = undefined;
    this.jobGroupSelected = undefined;
    if (this.jobGroupParams) {
      this.jobGroupParams.api.setRowData();
    }
    this.resetRepairJob();
    this.resetPart();
  }

  callbackGridJG(params) {
    params.api.setRowData();
    this.jobGroupParams = params;
    this.getWorkGroupByModel(this.carModelId);
  }

  getParamsJG() {
    const selectedData = this.jobGroupParams.api.getSelectedRows();
    if (selectedData) {
      this.jobGroupSelected = selectedData[0];
      // this.resetRepairJob();
      // this.getRepairJobByJobGroup(this.jobGroupSelected.id);
    }
  }

  private resetRepairJob() {
    this.repairJobList = undefined;
    this.repairJobSelected = undefined;
    if (this.repairJobParams) {
      this.repairJobParams.api.setRowData();
    }
    this.setRepairJobFooter();
    this.resetPart();
  }

  // callbackGridRJ(params) {
  //   params.api.setRowData();
  //   this.repairJobParams = params;
  //   this.setRepairJobFooter();
  // }

  // getParamsRJ() {
  //   const selectedData = this.repairJobParams.api.getSelectedRows();
  //   if (selectedData) {
  //     this.repairJobSelected = selectedData[0];
  //     this.resetPart();
  //     this.getPartByJob(this.repairJobSelected.rcjId);
  //   }
  // }

  private resetPart() {
    this.partList = undefined;
    if (this.partParams) {
      this.partParams.api.setRowData();
    }
    this.partTotalWithoutTax = undefined;
    this.partTaxTotal = undefined;
    this.partTotalWithTax = undefined;
    this.setPartFooter();
  }

  callbackGridParts(params) {
    params.api.setRowData();
    this.partParams = params;
  }

  private setPartFooter() {
    this.partFooter = [{
      partsCode: 'Tổng tiền trước thuế',
      partsName: this.partTotalWithoutTax,
      reqQty: 'Tổng thuế',
      sellPrice: this.partTaxTotal,
      tax: 'Tổng tiền sau thuế',
      total: this.partTotalWithTax
    }];
  }

  private setRepairJobFooter() {
    const calPriceTotal = (arrayObj: Array<any>) => {
      if (!arrayObj || !arrayObj.length) {
        return 0;
      }
      let sum = 0;
      for (let i = 0, length = arrayObj.length; i < length; i++) {
        sum += (Number(arrayObj[i].price) || 0) * (Number(arrayObj[i].actualJobTime) || Number(arrayObj[i].jobTime) || 0);
      }
      return sum;
    };
    this.repairJobFooter = [{
      rcCode: '',
      rcName: '',
      jobType: '',
      jobTime: '',
      actualJobTime: 'Tổng tiền',
      price: this.repairJobList ? calPriceTotal(this.repairJobList) : '',
      remark: ''
    }];
  }

  private calculatePartPriceTotal() {
    const calTaxTotal = (arrayObj: Array<any>) => {
      if (!arrayObj || !arrayObj.length) {
        return 0;
      }
      let sum = 0;
      for (let i = 0, length = arrayObj.length; i < length; i++) {
        sum += (Number(arrayObj[i].sellPrice) || 0) * (Number(arrayObj[i].reqQty) || 0) * (Number(arrayObj[i].tax) || 0) / 100;
      }
      return sum;
    };

    this.partTotalWithoutTax = this.common.sumObjectByField(this.partList, 'total');
    this.partTaxTotal = calTaxTotal(this.partList);
    this.partTotalWithTax = this.partTaxTotal + this.partTotalWithoutTax;

    setTimeout(() => {
      this.setPartFooter();
    });
  }

  private getWorkGroupByModel(modelId) {
    this.loading.setDisplay(true);
    this.repairJobApi.getByJobTypeAndCarModel(modelId).subscribe(jobGroup => {
      this.jobGroupList = jobGroup || [];
      this.jobGroupParams.api.setRowData(this.jobGroupList);
      this.gridTable.selectFirstRow(this.jobGroupParams);
      this.loading.setDisplay(false);
    });
  }

  // private getRepairJobByJobGroup(jobGroupId) {
  //   this.loading.setDisplay(true);
  //   this.repairJobDetailApi.getRepairJobByJobGroupAndCarModel(jobGroupId, this.carModelId)
  //     .subscribe(repairJob => {
  //       this.repairJobList = repairJob || [];
  //       this.repairJobParams.api.setRowData(this.repairJobList);
  //       this.gridTable.selectFirstRow(this.repairJobParams);
  //       this.setRepairJobFooter();
  //       this.loading.setDisplay(false);
  //     });
  // }

  // private getPartByJob(rcjId) {
  //   this.loading.setDisplay(true);
  //   this.repairJobApi.getRepairPartsByJob(rcjId, this.carModelId)
  //     .subscribe(part => {
  //       this.partList = part || [];
  //       this.partParams.api.setRowData(this.partList);
  //       this.gridTable.selectFirstRow(this.partParams);
  //       this.calculatePartPriceTotal();
  //       this.loading.setDisplay(false);
  //     });
  // }
}
