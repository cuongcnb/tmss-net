import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {ModalDirective} from 'ngx-bootstrap';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {JobGroupModel} from '../../../../core/models/catalog-declaration/job-group.model';
import {RepairJobModel} from '../../../../core/models/catalog-declaration/repair-job.model';
import {JobGroupTypes} from '../../../../core/constains/job-group-types';
import {RepairJobApi} from '../../../../api/common-api/repair-job.api';
import {RepairJobDetailApi} from '../../../../api/common-api/repair-job-detail.api';
import {SrvDRcJobsApi} from '../../../../api/master-data/warranty/srv-d-rc-jobs.api';
import {ToastService} from '../../../../shared/swal-alert/toast.service';
import {GridTableService} from '../../../../shared/common-service/grid-table.service';
import {ConfirmService} from '../../../../shared/confirmation/confirm.service';
import {difference, omit} from 'lodash';
import {PartsOfJobModel} from '../../../../core/models/catalog-declaration/parts-of-job.model';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {CommonService} from '../../../../shared/common-service/common.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CarFamilyModel} from '../../../../core/models/catalog-declaration/car-family.model';
import {ModelCarModel} from '../../../../core/models/catalog-declaration/model-car.model';
import {CarFamilyTypes} from '../../../../core/constains/car-type';
import {CarFamilyApi} from '../../../../api/common-api/car-family.api';
import {CarModelApi} from '../../../../api/common-api/car-model.api';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {DataCodes} from '../../../../core/constains/data-code';
import {PartsInfoManagementApi} from '../../../../api/parts-management/parts-info-management.api';
import {SrvDRcJobsModelsApi} from '../../../../api/master-data/warranty/srv-d-rc-jobs-models.api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'job-group-declaration',
  templateUrl: './job-group-declaration.component.html',
  styleUrls: ['./job-group-declaration.component.scss']
})
export class JobGroupDeclarationComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @Output() closeModal = new EventEmitter();
  modalHeight: number;
  jobGroupTypes = JobGroupTypes;

  jobGroupField;
  jobGroupParams;
  jobGroupList: Array<JobGroupModel>;
  jobSelected: JobGroupModel;

  repairJobField;
  repairJobParams;
  repairJobSelected: RepairJobModel;


  form: FormGroup;
  carFamField;
  carFamList: Array<CarFamilyModel> = [];
  carFamListDefault: Array<CarFamilyModel>;
  carModelField;
  carModelList: Array<ModelCarModel>;
  carTypes = CarFamilyTypes;
  selectedJobGroup;
  dataJobs;
  partField;
  partParams;
  partList: Array<PartsOfJobModel>;
  partFooter;
  partTotalWithoutTax: number;
  partTaxTotal: number;
  partTotalWithTax: number;
  listState;
  listJobGroupJobType;
  repairJobFooter;

  constructor(
    private modalHeightSrv: SetModalHeightService,
    private loading: LoadingService,
    private gridTableService: GridTableService,
    private swalAlert: ToastService,
    private confirm: ConfirmService,
    private repairJobApi: RepairJobApi,
    private repairJobDetailApi: RepairJobDetailApi,
    private srvDRcJobsApi: SrvDRcJobsApi,
    private srvDRcJobsModelsApi: SrvDRcJobsModelsApi,
    private dataFormatService: DataFormatService,
    private common: CommonService,
    private formBuilder: FormBuilder,
    private carFamilyApi: CarFamilyApi,
    private carModelApi: CarModelApi,
    private partsInfoManagementApi: PartsInfoManagementApi
  ) {
  }

  ngOnInit() {
    this.carFamField = [
      {headerName: 'Mã', headerTooltip: 'Mã', field: 'cfCode'},
      {headerName: 'Tên', headerTooltip: 'Tên', field: 'cfName'},
      {
        headerName: 'Loại', headerTooltip: 'Loại', field: 'cfType',
        valueFormatter: params => {
          const matchVal = this.carTypes.find(type => type.id === params.value);
          return matchVal ? matchVal.name : '';
        }
      }
    ];
    this.carModelField = [
      {headerName: 'Mã', headerTooltip: 'Mã', field: 'cmCode', width: 100},
      {headerName: 'Tên', headerTooltip: 'Tên', field: 'cmName', width: 100},
      {headerName: 'Đời xe', headerTooltip: 'Đời xe', field: 'doixe'}
    ];
    this.repairJobField = [
      {headerName: 'Mã  CV', headerTooltip: 'Mã  CV', field: 'rccode'},
      {headerName: 'Tên  CV', headerTooltip: 'Tên  CV', field: 'rcname'},
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'remark'}
    ];
    this.jobGroupField = [
      {headerName: 'Mã CV', headerTooltip: 'Mã CV', field: 'rccode', maxWidth: 80},
      {headerName: 'Tên CV', headerTooltip: 'Tên CV', field: 'rcname', maxWidth: 250},
      {
        headerName: 'Loại CV', field: 'internal', maxWidth: 100, cellClass: ['cell-border', 'cell-readonly', 'text-right'],
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
    this.repairJobField = [
      {headerName: 'Mã  CV', headerTooltip: 'Mã  CV', field: 'rccode'},
      {headerName: 'Tên  CV', headerTooltip: 'Tên  CV', field: 'rcname'},
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'remark'}
    ];
    this.partField = [
      {headerName: 'Mã PT', headerTooltip: 'Mã phụ tùng', field: 'partsCode', minWidth: 100},
      {
        headerName: 'Tên phụ tùng', headerTooltip: 'Tên phụ tùng', valueGetter: params => {
          return params.data && params.data.partsNameVn && !!params.data.partsNameVn
            ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '';
        }, minWidth: 200
      },
      {
        headerName: 'Genuine', headerTooltip: 'Genuine', field: 'genuine', minWidth: 100,
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
  }

  onResize() {
    this.modalHeight = this.modalHeightSrv.onResize();
  }

  open(selectedJobGroup?, dataJobs?) {
    this.selectedJobGroup = selectedJobGroup;
    this.dataJobs = dataJobs;
    this.modal.show();
    this.buildForm();
    this.onResize();

  }

  reset() {
    this.jobSelected = undefined;
    this.repairJobSelected = undefined;
    this.selectedJobGroup = undefined;
    this.dataJobs = undefined;
    this.form.reset();
  }

  save() {
    const rcJobId = this.gridTableService.getAllData(this.repairJobParams).map(it => it.rcjId);
    let jobsGroup = this.form.value;
    jobsGroup.cfId = jobsGroup.carFamId;
    jobsGroup.cmId = jobsGroup.carModelId;
    jobsGroup = omit(jobsGroup, ['carFamId', 'carModelId']);
    const obj = {
      rcJobId,
      jobsGroup
    };
    this.loading.setDisplay(true);
    this.repairJobApi.createJobsGroup(obj)
      .subscribe(() => {
        this.loading.setDisplay(false);
        this.swalAlert.openSuccessToast();
        this.modal.hide();
        this.closeModal.emit();
      });
  }

  refreshJG() {
    this.jobGroupParams.api.setRowData([]);
    this.jobSelected = undefined;
    this.repairJobSelected = undefined;
    this.repairJobParams.api.setRowData([]);
  }

  callbackGridJG(params) {
    params.api.setRowData([]);
    this.repairJobParams = params;
    if (this.selectedJobGroup) {
      this.repairJobParams.api.setRowData(this.dataJobs);
      this.setRepairJobFooter();
    }
  }

  getParamsJG() {
    const selectedData = this.repairJobParams.api.getSelectedRows();
    if (selectedData) {
      this.jobSelected = selectedData[0];
    }
  }


  callSearchRepairJob(val, paginationParams?) {
    return this.srvDRcJobsModelsApi.getAllDataForCar(Object.assign({
      cfId: this.form.value.carFamId,
      cmId: this.form.value.carModelId,
      searchKeyword: val.searchKeyword || null
    }, paginationParams));
  }

  patchRepairJob(data) {
    const allRepairJob = this.gridTableService.getAllData(this.repairJobParams);
    const matchData = allRepairJob.find(repairJob => repairJob.id === data.rcjId);
    if (matchData) {
      this.swalAlert.openWarningToast('Công việc đã tồn tại', 'Thông báo');
    } else {
      this.repairJobParams.api.updateRowData({add: [data]});
      this.setRowDataPart();
      this.setRepairJobFooter();
      this.setRepairPartFooter();
    }
  }

  setRowDataPart() {
    const allData = this.gridTableService.getAllData(this.repairJobParams);
    const dataPart = [];
    allData.map(it => it.listPartsDetail.forEach(item => dataPart.push(item)));
    this.partParams.api.setRowData(dataPart);
  }


  patchRepairJobs(data) {
    const allRepairJob = this.gridTableService.getAllData(this.repairJobParams);
    const oldJob = allRepairJob.map(job => job.id);
    const newJob = data.map(job => job.id);
    const matchData = difference(newJob, oldJob);
    if (matchData && matchData.length) {
      const patchJob = allRepairJob.concat(data).filter(job => {
        return matchData.includes(job.id);
      });
      this.repairJobParams.api.updateRowData({add: patchJob});
      this.setRowDataPart();
      this.setRepairJobFooter();
      this.setRepairPartFooter();
    } else {
      this.swalAlert.openWarningToast('Công việc đã tồn tại', 'Thông báo');
    }
  }

  onBtnDelJob() {
    this.confirm.openConfirmModal('Xác nhận!', 'Bạn có muốn xóa dòng này?').subscribe(() => {
      this.repairJobParams.api.updateRowData({remove: [this.jobSelected]});
      this.jobSelected = undefined;
      this.setRowDataPart();
      this.setRepairPartFooter();
      this.setRepairJobFooter();
    }, () => {
    });
  }

  callbackGridParts(params) {
    params.api.setRowData();
    this.partParams = params;
    if (this.selectedJobGroup) {
      this.setRowDataPart();
      this.setRepairPartFooter();
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      carFamId: [undefined],
      carModelId: [undefined],
      deleteFlag: 'N',
      gjCode: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(30), GlobalValidator.specialCharacter, GlobalValidator.inputFormat])],
      id: [undefined],
      gjName: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(100), GlobalValidator.specialCharacter])],
      remark: [undefined, GlobalValidator.maxLength(200)],
      jobType: ['0']
    });
    this.getCarFamByType();
    this.getListState();
    this.getJobGroupJobType();
    this.form.get('carFamId').valueChanges.subscribe(val => {
      this.form.patchValue({carModelId: undefined});
      this.carModelList = undefined;
      if (val || val === 0) {
        this.getCarModelByFam(val);
      }
    });
    if (this.selectedJobGroup) {
      this.form.patchValue(this.selectedJobGroup);
      this.form.patchValue({
        jobType: String(this.selectedJobGroup.jobType),
        carFamId: this.selectedJobGroup.cfId,
        carModelId: this.selectedJobGroup.cmId
      });
    }
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
    const data = this.gridTableService.getAllData(this.repairJobParams);
    const total = calPriceTotal(data);
    this.repairJobFooter = [{
      actualJobTime: 'Tổng tiền',
      costs: data ? (total) : 0
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
    const data = this.gridTableService.getAllData(this.repairJobParams);
    const partList = [];
    data.map(it => it.listPartsDetail.forEach(item => partList.push(item)));
    const total = calPriceTotal(partList);
    this.partFooter = [{
      sellPrice: 'Tổng tiền',
      payment: partList ? total : 0

    }];
  }

  private getCarModelByFam(famId) {
    this.loading.setDisplay(true);
    this.carModelApi.getCarModelByCarFam(famId).subscribe(carModel => {
      this.carModelList = carModel || [];
      if (!this.form.value.carModelId) {
        this.form.patchValue({carModelId: carModel[0] ? carModel[0].id : undefined});
      }
      this.loading.setDisplay(false);
    });
  }

  private getCarFamByType() {
    this.loading.setDisplay(true);
    this.carFamilyApi.getAll().subscribe(carFams => {
      this.carFamListDefault = carFams || [];
      if (!this.selectedJobGroup) {
        this.form.patchValue({carFamId: carFams[0] ? carFams[0].id : undefined});
      }
      this.loading.setDisplay(false);
    }, () => {

    }, () => {
    });
  }

  getListState() {
    this.partsInfoManagementApi.getDataCode(DataCodes.jobGroupStatus).subscribe(res => {
      this.listState = res ? res : [];
      if (!this.form.value.deleteFlag) {
        this.form.patchValue({
          deleteFlag: res[0].dataValue
        });
      }
    });
  }

  getJobGroupJobType() {
    this.partsInfoManagementApi.getDataCode(DataCodes.jobGroupJobType).subscribe(res => {
      this.listJobGroupJobType = res ? res : [];
    });
  }

  resetData() {
    if (!this.form.value.id) {
      return;
    } else {
      const obj = {
        id: this.form.value.id,
        cmId: this.form.value.carModelId,
        cfId: this.form.value.carFamId
      };
      this.repairJobApi.getJobsGroupDetail(obj).subscribe(res => {
        if (!res) {
          return;
        }
        this.repairJobParams.api.setRowData(res);
        this.setRowDataPart();
        this.setRepairPartFooter();
        this.setRepairJobFooter();
      });
    }
  }
}
