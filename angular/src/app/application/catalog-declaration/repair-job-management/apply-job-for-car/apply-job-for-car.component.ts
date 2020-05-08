import {Component, EventEmitter, OnInit, Output, ViewChild, Injector} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';

import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PartOfWorkModel} from '../../../../core/models/catalog-declaration/general-repair.model';
import {ToastService} from '../../../../shared/swal-alert/toast.service';
import {PartsInfoManagementApi} from '../../../../api/parts-management/parts-info-management.api';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {CarModelApi} from '../../../../api/common-api/car-model.api';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {GridTableService} from '../../../../shared/common-service/grid-table.service';
import {SrvDRcJobsApi} from '../../../../api/master-data/warranty/srv-d-rc-jobs.api';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {AgDataValidateService} from '../../../../shared/ag-grid-table/ag-data-validate/ag-data-validate.service';
import {ConfirmService} from '../../../../shared/confirmation/confirm.service';
import {RepairJobApi} from '../../../../api/common-api/repair-job.api';
import {JobGroupTypes} from '../../../../core/constains/job-group-types';
import {CarFamilyModel} from '../../../../core/models/catalog-declaration/car-family.model';
import {ModelCarModel} from '../../../../core/models/catalog-declaration/model-car.model';
import {CarFamilyTypes} from '../../../../core/constains/car-type';
import {CarFamilyApi} from '../../../../api/common-api/car-family.api';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'apply-job-for-car',
  templateUrl: './apply-job-for-car.component.html',
  styleUrls: ['./apply-job-for-car.component.scss']
})
export class ApplyJobForCarComponent extends AppComponentBase implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('partModal', {static: false}) partModal;
  @ViewChild('searchCarModel', {static: false}) searchCarModel;
  @Output() closeModal = new EventEmitter();
  modalHeight: number;
  form: FormGroup;
  selectedJob;
  // currentUser = CurrentUser;
  jobGroupTypes = JobGroupTypes;
  carInfo;
  partGridField;
  partGridParams;
  selectedPart: PartOfWorkModel;
  carFamListDefault: Array<CarFamilyModel>;
  carModelField;
  carFamField;
  carModelList: Array<ModelCarModel>;
  carTypes = CarFamilyTypes;
  partSearchGridField;
  carModelGridField;
  jobTimeId: number;
  jobTimeDlrId: number;

  constructor(
    injector: Injector,
    private formBuilder: FormBuilder,
    private setModalHeightService: SetModalHeightService,
    private gridTableService: GridTableService,
    private dataFormatService: DataFormatService,
    private loading: LoadingService,
    private agDataValidate: AgDataValidateService,
    private swalAlert: ToastService,
    private confirm: ConfirmService,
    private carModelApi: CarModelApi,
    private srvDRcJobsApi: SrvDRcJobsApi,
    private partsInfoManagementApi: PartsInfoManagementApi,
    private repairJobApi: RepairJobApi,
    private carFamilyApi: CarFamilyApi
  ) {
    super(injector);
  }

  ngOnInit() {
    if (!this.currentUser.isAdmin) {
      this.jobGroupTypes = this.jobGroupTypes.filter(type => type.name !== 'Bảo dưỡng');
    }
    this.partGridField = [
      {headerName: 'Mã PT', headerTooltip: 'Mã phụ tùng', field: 'partsCode'},
      {
        headerName: 'Tên PT', headerTooltip: 'Tên phụ tùng', valueGetter: params => {
           return params.data && params.data.partsNameVn && !!params.data.partsNameVn
             ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '' ;
        }
      },
      {
        headerName: 'Genuine',
        headerTooltip: 'Genuine',
        field: 'genuine',
        cellRenderer: params => `<input type="checkbox" disabled="disabled" ${params.data.genuine ? 'checked' : ''}/>`
      },
      {headerName: 'Đơn vị', headerTooltip: 'Đơn vị', field: 'unit'},
      {headerName: 'Đơn giá', headerTooltip: 'Đơn giá', field: 'sellPrice', valueFormatter: params => this.dataFormatService.moneyFormat(params.value)},
      {
        headerName: 'Số lượng', headerTooltip: 'Số lượng', field: 'amount',
        editable: true, cellClass: ['cell-clickable', 'cell-border', 'text-right'],
        type: 'number',
        validators: ['required', 'floatPositiveNum']
      },
      {
        headerName: 'Thành tiền', headerTooltip: 'Thành tiền', field: 'payment',
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
        cellClass: ['cell-border', 'cell-readonly', 'text-right']
      }
    ];
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


    this.partSearchGridField = [
      {headerName: 'Mã PT', headerTooltip: 'Mã phụ tùng', field: 'partsCode'},
      {
        headerName: 'Tên PT', headerTooltip: 'Tên phụ tùng', valueGetter: params => {
           return params.data && params.data.partsNameVn && !!params.data.partsNameVn
             ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '' ;
        }
      },
      {
        headerName: 'Đơn giá', headerTooltip: 'Đơn giá', field: 'sellPrice',
        cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      },
      {
        field: 'genuine',
        cellRenderer: (params) => `<input type="checkbox" disabled="disabled" ${params.data.genuine === 'Y' ? 'checked' : ''}/>`
      }
    ];
    this.carModelGridField = [
      {headerName: 'Mã kiểu xe', headerTooltip: 'Mã kiểu xe', field: 'cmCode'},
      {headerName: 'Tên kiểu xe', headerTooltip: 'Tên kiểu xe', field: 'cmName'},
      {headerName: 'Đời xe', headerTooltip: 'Đời xe', field: 'doixe'},
      {
        headerName: 'Năm', headerTooltip: 'Năm', field: 'cmYear',
        tooltip: params => this.dataFormatService.parseTimestampToYear(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToYear(params.value)
      }
    ];
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  open(selectedJob?, carInfo?) {
    this.selectedJob = selectedJob;
    this.carInfo = carInfo;
    this.getCarFamByType();
    this.buildForm();
    this.modal.show();
  }

  reset() {
    this.selectedJob = undefined;
    this.form = undefined;
    this.jobTimeId = undefined;
    this.jobTimeDlrId = undefined;
  }

  // Grid Table: Phụ tùng
  callbackPart(params) {
    this.partGridParams = params;
    if (this.selectedJob) {
      this.partGridParams.api.setRowData(this.selectedJob.listPartsDetail);
    }
  }

  getPartParams() {
    const selected = this.partGridParams.api.getSelectedNodes();
    if (selected && selected.length > 0) {
      this.selectedPart = selected[0].data;
      // Set focus to cell
      const partList = this.gridTableService.getAllData(this.partGridParams);
      this.gridTableService.setFocusCell(this.partGridParams, 'amount', partList, selected[0].rowIndex);
    }
  }

  cellEditingStopped(params) {
    const col = params.colDef.field;
    if (col === 'amount') {
      params.data.payment = Number(params.data.amount) * Number(params.data.sellPrice);
      params.api.refreshCells();
    }
  }

  // Thêm,xóa phụ tùng
  callApiSearchPart(val, paginationParams ?) {
    return this.partsInfoManagementApi.searchPartsInfo({
      partsCode: val.partsCode || null,
      status: 'Y'
    }, paginationParams);
  }

  addPart(data) {
    const partList = this.gridTableService.getAllData(this.partGridParams);
    const matchValue = partList.find(part => part.partsId ? part.partsId === data.id : part.id === data.id);
    if (matchValue) {
      this.swalAlert.openWarningToast('Phụ tùng đã tồn tại', 'Cảnh báo');
    } else {
      this.partGridParams.api.updateRowData({add: [data]});
    }
  }

  delPart() {
    this.confirm.openConfirmModal('Xác nhận!', 'Bạn có muốn xóa dòng này?').subscribe(() => {
      this.partGridParams.api.updateRowData({remove: [this.selectedPart]});
      this.selectedPart = undefined;
    }, () => {
    });
  }

  // Chọn đời xe từ danh sách
  callApiSearchCarModel(val) {
    return this.carModelApi.searchByCarModelCode({model: val.model});
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    const partList = this.gridTableService.getAllData(this.partGridParams);
    if (!this.agDataValidate.validateDataGrid(this.partGridParams, this.partGridField, partList)) {
      return;
    }

    // Get data to send request
    const value = Object.assign({}, this.form.getRawValue(), {
      id: this.selectedJob ? this.selectedJob.id : null,
      jobtype: this.form.value.jobgroup,
      jobsModels: {
        id: this.jobTimeId,
        cmId: this.form.value.carModelId,
        cfId: this.form.value.carFamId,
        jobtime: this.form.value.jobtime
      },
      jobsModelsDlr: {
        id: this.jobTimeDlrId,
        actualJobTime: this.form.value.actualJobTime
      },
      listRepairParts: partList.map(part => {
        return {
          partsId: part.id,
          reqQty: part.amount
        };
      })
    });

    this.loading.setDisplay(true);
    const apiCall = this.selectedJob
      ? this.srvDRcJobsApi.updateJobForCar(value)
      : this.srvDRcJobsApi.insertJobForCar(value);
    apiCall.subscribe(() => {
      this.loading.setDisplay(false);
      this.swalAlert.openSuccessToast();
      this.modal.hide();
      this.closeModal.emit();
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      rccode: [{
        value: undefined,
        disabled: this.selectedJob
      }, [GlobalValidator.required, GlobalValidator.maxLength(20), GlobalValidator.specialCharacter, GlobalValidator.inputFormat]],
      rcname: [{
        value: undefined,
        disabled: this.selectedJob
      }, [GlobalValidator.required, GlobalValidator.maxLength(150), GlobalValidator.specialCharacter]],
      internal: [{value: 'Y', disabled: this.selectedJob}],
      remark: [{value: undefined, disabled: this.selectedJob}, GlobalValidator.maxLength(200)],
      jobtime: [{value: undefined, disabled: !this.currentUser.isAdmin},
        Validators.compose([GlobalValidator.required, GlobalValidator.floatNumberFormat, GlobalValidator.maxLength(53)])],
      actualJobTime: [{value: undefined, disabled: this.currentUser.isAdmin},
        Validators.compose([GlobalValidator.required, GlobalValidator.floatNumberFormat, GlobalValidator.maxLength(53)])],
      jobgroup: [this.jobGroupTypes[0].id, GlobalValidator.required],
      status: ['Y'],
      carFamId: [undefined],
      carModelId: [undefined]
    });

    this.form.get('carFamId').valueChanges.subscribe(val => {
      this.form.patchValue({carModelId: undefined});
      this.carModelList = undefined;
      if (val || val === 0) {
        this.getCarModelByFam(val);
      }
    });
    if (this.selectedJob) {
      this.form.patchValue(this.selectedJob);
      this.form.patchValue({
        jobType: String(this.selectedJob.jobType),
        carFamId: this.selectedJob.cfId,
        carModelId: this.selectedJob.cmId
      });
    }
    if (this.carInfo) {
      this.form.patchValue(this.carInfo);
    }

  }

  private getCarFamByType() {
    this.loading.setDisplay(true);
    this.carFamilyApi.getAll().subscribe(carFams => {
      this.carFamListDefault = carFams || [];
      if (!this.selectedJob && !this.carInfo) {
        this.form.patchValue({carFamId: carFams[0] ? carFams[0].id : undefined});
      }
      this.loading.setDisplay(false);
    });
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
}
