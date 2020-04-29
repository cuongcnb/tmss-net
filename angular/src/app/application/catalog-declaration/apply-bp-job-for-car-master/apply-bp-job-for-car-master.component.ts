import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ModelCarModel} from '../../../core/models/catalog-declaration/model-car.model';
import {CarFamilyModel} from '../../../core/models/catalog-declaration/car-family.model';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {LoadingService} from '../../../shared/loading/loading.service';
import {CarModelApi} from '../../../api/common-api/car-model.api';
import {CarFamilyApi} from '../../../api/common-api/car-family.api';
import {SrvDRcJobsApi} from '../../../api/master-data/warranty/srv-d-rc-jobs.api';
import {CarFamilyTypes} from '../../../core/constains/car-type';
import {DataCodes} from '../../../core/constains/data-code';
import {PartsInfoManagementApi} from '../../../api/parts-management/parts-info-management.api';
import {ConfirmService} from '../../../shared/confirmation/confirm.service';
import {SrvDRcJobsModelsApi} from '../../../api/master-data/warranty/srv-d-rc-jobs-models.api';
import {GridTableService} from '../../../shared/common-service/grid-table.service';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {JobGroupTypes} from '../../../core/constains/job-group-types';
import {SrvDRcRepairPartsApi} from '../../../api/master-data/warranty/srv-d-rc-repair-parts.api';
import {PaginationParamsModel} from "../../../core/models/base.model";

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'apply-bp-job-for-car-master',
  templateUrl: './apply-bp-job-for-car-master.component.html',
  styleUrls: ['./apply-bp-job-for-car-master.component.scss']
})
export class ApplyBPJobForCarMasterComponent implements OnInit {
  @ViewChild('addUpdateModal', {static: false}) addUpdateModal;
  @ViewChild('addJobModal', {static: false}) addJobModal;
  form: FormGroup;
  carFamField;
  // carFamList: Array<CarFamilyModel> = [];
  carFamListDefault: Array<CarFamilyModel>;
  carModelField;
  carModelList: Array<ModelCarModel>;
  carTypes = CarFamilyTypes;

  listCmName;
  listState;

  currentDlrId;
  fieldGridJob;
  fieldGridPart;

  paramJob;
  paramPart;

  selectDataJob;
  selectDataPart;

  data;
  paginationParams: PaginationParamsModel;
  paginationTotalsData;

  constructor(
    private formBuilder: FormBuilder,
    private swalAlert: ToastService,
    private loading: LoadingService,
    private carFamilyApi: CarFamilyApi,
    private carModelApi: CarModelApi,
    private srvDRcJobsApi: SrvDRcJobsApi,
    private srvDRcJobsModelsApi: SrvDRcJobsModelsApi,
    private partsInfoManagementApi: PartsInfoManagementApi,
    private confirmService: ConfirmService,
    private gridTableService: GridTableService,
    private dataFormatService: DataFormatService,
    private srvDRcRepairPartsApi: SrvDRcRepairPartsApi
  ) {
    this.fieldGridJob = [
      {headerName: 'Đại lý', headerTooltip: 'Đại lý', field: 'dlrName'},
      {headerName: 'Mã CV', headerTooltip: 'Mã CV', field: 'rccode'},
      {headerName: 'Tên CV', headerTooltip: 'Tên CV', field: 'rcname'},
      {
        field: 'internal'
      },
      {
        headerName: 'Loại CV',
        headerTooltip: 'Loại CV',
        field: 'jobgroup',
        cellRenderer: (params) => {
          if (params.value) {
            const data = JobGroupTypes.find(it => Number(it.id) === Number(params.value));
            return data ? data.name : '';
          }
          return;
        }
      },
      {
        headerName: 'Thành tiền',
        headerTooltip: 'Thành tiền',
        field: 'price',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      },
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'remark'}
    ];
    this.fieldGridPart = [
      {headerName: 'Mã PT', headerTooltip: 'Mã phụ tùng', field: 'partsCode'},
      {
        headerName: 'Tên phụ tùng', headerTooltip: 'Tên phụ tùng', valueGetter: params => {
          return params.data && params.data.partsNameVn && !!params.data.partsNameVn
            ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '';
        }
      },
      {
        headerName: 'Genuine', headerTooltip: 'Genuine', field: 'genuine',
        cellRenderer: (params) => {
          if (params.value) {
            return params.value === 'Y' ? 'Chính hãng' : 'Không chính hãng';
          }
          return;
        }
      },
      {headerName: 'Đơn vị', headerTooltip: 'Đơn vị', field: 'unit'},
      {
        headerName: 'Số lượng',
        headerTooltip: 'Số lượng',
        field: 'amount',
        cellClass: ['cell-border', 'cell-readonly', 'text-right']
      },
      {
        headerName: 'Đơn giá',
        headerTooltip: 'Đơn giá',
        field: 'sellPrice',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        valueFormatter: params => (params && typeof params.value === 'string') ? params.value : this.dataFormatService.moneyFormat(params.value)
      },
      {
        headerName: 'Thành tiền',
        headerTooltip: 'Thành tiền',
        field: 'payment',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      }
    ];
  }

  ngOnInit() {
    this.carFamField = [
      {headerName: 'Mã', headerTooltip: 'Mã', field: 'cfCode'},
      // {headerName: 'Tên', headerTooltip: 'Tên', field: 'cfName'},
      {
        headerName: 'Loại', headerTooltip: 'Loại', field: 'cfType',
        valueFormatter: params => {
          const matchVal = this.carTypes.find(type => type.id === params.value);
          return matchVal ? matchVal.name : '';
        }
      }
    ];
    this.carModelField = [
      {headerName: 'Mã', headerTooltip: 'Mã', field: 'cmCode', width: 120},
      // {headerName: 'Tên', headerTooltip: 'Tên', field: 'cmName', width: 100},
      {headerName: 'Đời xe', headerTooltip: 'Đời xe', field: 'doixe'}
    ];
    this.buildForm();
    this.currentDlrId = JSON.parse(localStorage.getItem('TMSS_Service_Current_User')).dealerId;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      cfId: [undefined],
      cmId: [undefined],
      searchKeyword: [undefined],
      isBp: 'Y'
    });
    // this.form.get('cfId').valueChanges.subscribe(val => {
    //   this.form.patchValue({cmId: undefined});
    //   this.carModelList = undefined;
    //   if (val || val === 0) {
    //     this.getCarModelByFam(val);
    //   }
    // });
    // this.form.get('cmId').valueChanges.subscribe(val => {
    //   if (this.form.value.cmId) {
    //     this.getAllData();
    //   } else {
    //     if(this.paramJob) {
    //       this.paramJob.api.setRowData();
    //     }
    //     if (this.paramPart) {
    //       this.paramPart.api.setRowData();
    //     }
    //   }
    // });
    this.getCarFamByType();
  }

  getAllData() {
    this.loading.setDisplay(true);
    this.srvDRcJobsModelsApi.getAllDataForCar(this.form.getRawValue(), this.paginationParams).subscribe(res => {
      this.data = res && res.list ? res.list : [];
      this.paginationTotalsData = res && res.total ? res.total : 0;
      this.paramJob.api.setRowData(this.data);
      this.gridTableService.selectFirstRow(this.paramJob);
      if (this.data.length < 1) {
        if (this.paramPart) {
          this.paramPart.api.setRowData();
        }
      }
      this.loading.setDisplay(false);
    });
  }

  private getCarFamByType() {
    this.loading.setDisplay(true);
    this.carFamilyApi.getAll().subscribe(carFams => {
      this.carFamListDefault = carFams || [];
      this.form.patchValue({cfId: carFams[0] ? carFams[0].id : undefined});
      this.loading.setDisplay(false);
    }, () => {

    }, () => {
      this.getListCmName();
      this.getListState();
    });
  }

  // private getCarModelByFam(famId) {
  //   this.loading.setDisplay(true);
  //   this.carModelApi.getCarModelByCarFam(famId).subscribe(carModel => {
  //     this.carModelList = carModel || [];
  //     this.form.patchValue({cmId: carModel[0] ? carModel[0].id : undefined});
  //     this.loading.setDisplay(false);
  //     // if (this.form.value.cmId) {
  //     //   this.getAllData();
  //     // } else {
  //     //   this.paramJob.api.setRowData();
  //     //   this.paramPart.api.setRowData();
  //     // }
  //   });
  // }

  getListCmName() {
    this.partsInfoManagementApi.getDataCode(DataCodes.cmName).subscribe(res => {
      this.listCmName = res ? res : [];
      this.listCmName.unshift({dataNameVn: 'Tất cả', dataValue: null});
    });
  }

  getListState() {
    this.partsInfoManagementApi.getDataCode(DataCodes.jobGroupStatus).subscribe(res => {
      this.listState = res ? res : [];
      this.listState.unshift({dataNameVn: 'Tất cả', dataValue: null});
    });
  }


  callbackGridJob(param) {
    this.paramJob = param;
  }

  getParamsJob() {
    const selectedData = this.paramJob.api.getSelectedRows();
    this.selectDataJob = selectedData ? selectedData[0] : [];
    this.selectDataPart = null;
    this.paramPart.api.setRowData(this.selectDataJob.listPartsDetail);
    this.paramPart.api.sizeColumnsToFit(this.paramPart);
  }

  callbackGridParts(param) {
    this.paramPart = param;
    this.paramPart.api.sizeColumnsToFit(this.paramPart);
  }

  getParamsPart() {
    const selectedData = this.paramPart.api.getSelectedRows();
    if (selectedData) {
      this.selectDataPart = selectedData[0];
    }
  }

  onBtnDeleteJob() {
    this.confirmService.openConfirmModal('Bạn có muốn xóa dòng công việc này?').subscribe(() => {
      this.srvDRcJobsModelsApi.deleteRcJobModel(this.selectDataJob).subscribe(res => {
        this.swalAlert.openSuccessToast();
        this.getAllData();
      });
    });
  }

  onBtnDeletePart() {
    this.confirmService.openConfirmModal('Bạn có muốn xóa dòng phụ tùng này?').subscribe(() => {
      this.srvDRcRepairPartsApi.deleteRepairParts(this.selectDataPart).subscribe(res => {
        this.swalAlert.openSuccessToast();
        this.getAllData();
      });
    });
  }

  changePaginationParams(paginationParams) {
    this.paginationParams = paginationParams;
    this.getAllData();
  }
}
