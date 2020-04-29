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
import {RepairJobApi} from '../../../api/common-api/repair-job.api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'repair-job-management',
  templateUrl: './repair-job-management.component.html',
  styleUrls: ['./repair-job-management.component.scss']
})
export class RepairJobManagementComponent implements OnInit {
  @ViewChild('repairJobDetail', {static: false}) repairJobDetail;
  form: FormGroup;
  carFamField;
  carFamList: Array<CarFamilyModel> = [];
  carFamListDefault: Array<CarFamilyModel>;
  carModelField;
  carModelList: Array<ModelCarModel>;
  carTypes = CarFamilyTypes;

  repairJobField;
  listCmName;
  listState;

  constructor(
    private formBuilder: FormBuilder,
    private swalAlert: ToastService,
    private loading: LoadingService,
    private carFamilyApi: CarFamilyApi,
    private carModelApi: CarModelApi,
    private srvDRcJobsApi: SrvDRcJobsApi,
    private partsInfoManagementApi: PartsInfoManagementApi,
    private repairJobApi: RepairJobApi
  ) {
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
    this.repairJobField = [
      {headerName: 'Mã  CV', headerTooltip: 'Mã  CV', field: 'rccode'},
      {headerName: 'Tên  CV', headerTooltip: 'Tên  CV', field: 'rcname'},
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'remark'}
    ];
    this.buildForm();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      carFamId: [undefined],
      carModelId: [undefined],
      deleteFlag: 'N'
    });
    this.form.get('carFamId').valueChanges.subscribe(val => {
      this.form.patchValue({carModelId: undefined});
      this.carModelList = undefined;
      if (val || val === 0) {
        this.getCarModelByFam(val);
      }
    });
    this.getCarFamByType();
  }

  // Chọn công việc
  callSearchRepairJob(val, paginationParams?) {
    return this.srvDRcJobsApi.searchJobs(
      {searchKeyword: val.searchKeyword || null},
      paginationParams);
  }

  private getCarFamByType() {
    this.loading.setDisplay(true);
    this.carFamilyApi.getAll().subscribe(carFams => {
      this.carFamListDefault = carFams || [];
      this.form.patchValue({carFamId: carFams[0] ? carFams[0].id : undefined});
      this.loading.setDisplay(false);
    }, () => {

    }, () => {
      this.getListCmName();
      this.getListState();
    });
  }

  private getCarModelByFam(famId) {
    this.loading.setDisplay(true);
    this.carModelApi.getCarModelByCarFam(famId).subscribe(carModel => {
      this.carModelList = carModel || [];
      this.form.patchValue({carModelId: carModel[0] ? carModel[0].id : undefined});
      this.loading.setDisplay(false);
    });
  }

  // changeCmName(cmName) {
  //   this.carFamList = (this.form.value.cmName && this.form.value.cmName.dataValue)
  //   ? this.carFamListDefault.filter(it => it.cfType === Number(cmName.dataValue)) : this.carFamListDefault;
  // }

  getListCmName() {
    this.partsInfoManagementApi.getDataCode(DataCodes.cmName).subscribe(res => {
      this.listCmName = res ? res : [];
      this.listCmName.unshift({dataNameVn: 'Tất cả', dataValue: null});
      // this.changeCmName(this.form.value.cmName);
    });
  }

  getListState() {
    this.partsInfoManagementApi.getDataCode(DataCodes.jobGroupStatus).subscribe(res => {
      this.listState = res ? res : [];
      this.listState.unshift({dataNameVn: 'Tất cả', dataValue: null});
    });
  }

  changeDeleteFlag() {
    this.repairJobDetail.getWorkGroupByModel();
  }
}
