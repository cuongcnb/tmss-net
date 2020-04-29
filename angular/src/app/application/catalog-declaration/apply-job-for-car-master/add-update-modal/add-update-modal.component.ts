import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';

import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PartOfWorkModel} from '../../../../core/models/catalog-declaration/general-repair.model';
import {ToastService} from '../../../../shared/swal-alert/toast.service';
import {PartsInfoManagementApi} from '../../../../api/parts-management/parts-info-management.api';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {CarModelApi} from '../../../../api/common-api/car-model.api';
import {CurrentUser} from '../../../../home/home.component';
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
import {Observable} from 'rxjs';
import {SrvDRcJobsModelsApi} from '../../../../api/master-data/warranty/srv-d-rc-jobs-models.api';
import {SrvDRcRepairPartsApi} from '../../../../api/master-data/warranty/srv-d-rc-repair-parts.api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'add-update-modal',
  templateUrl: './add-update-modal.component.html',
  styleUrls: ['./add-update-modal.component.scss']
})
export class AddUpdateModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('partModal', {static: false}) partModal;
  @ViewChild('searchCarModel', {static: false}) searchCarModel;
  @Output() closeModal = new EventEmitter();
  modalHeight: number;
  form: FormGroup;
  selectedJob;
  currentUser = CurrentUser;
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
  type;
  fieldGridSearch;

  constructor(
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
    private carFamilyApi: CarFamilyApi,
    private srvDRcJobsModelsApi: SrvDRcJobsModelsApi,
    private srvDRcRepairPartsApi: SrvDRcRepairPartsApi
  ) {
    this.fieldGridSearch = [
      {headerName: 'Mã CV', headerTooltip: 'Mã CV', field: 'rccode'},
      {headerName: 'Tên CV', headerTooltip: 'Tên CV', field: 'rcname'},
      {
        field: 'internal', cellClass: ['cell-border', 'cell-readonly', 'text-right']
      },
      {
        headerName: 'Loại CV', headerTooltip: 'Loại CV', field: 'jobgroup', cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        cellRenderer: (params) => {
          if (params.value) {
            const data = JobGroupTypes.find(it => Number(it.id) === Number(params.value));
            return data ? data.name : '';
          }
          return;
        }
      },
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'remark'}
    ];
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
            ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '';
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
            ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '';
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

  open(type, selectedJob?, carInfo?) {
    this.type = type;
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
      this.partGridParams.api.setRowData(this.selectedJob && this.selectedJob.listPartsDetail ? this.selectedJob.listPartsDetail : []);
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

    // Get data to send request
    let value = Object.assign({}, this.form.getRawValue(), {
      jobsModels: {
        id: this.jobTimeId,
        cmId: this.form.value.cmId,
        cfId: this.form.value.cfId,
        jobtime: this.form.value.jobtime
      },
      jobsModelsDlr: {
        id: this.jobTimeDlrId,
        actualJobTime: this.form.value.actualJobTime
      }
    });
    let apiCall = new Observable();
    if (this.type === 'job') {
      this.loading.setDisplay(true);
      apiCall = this.selectedJob
        ? this.srvDRcJobsModelsApi.updateRcJobModel(value)
        : this.srvDRcJobsModelsApi.insertRcJobModel(value);
    } else {
      const partList = this.gridTableService.getAllData(this.partGridParams);
      if (!this.agDataValidate.validateDataGrid(this.partGridParams, this.partGridField, partList)) {
        return;
      }
      value = partList.map(part => {
        return {
          rcjmId: this.selectedJob.id,
          partsId: part.id,
          reqQty: part.amount
        };
      });
      apiCall = this.srvDRcRepairPartsApi.insertRepairParts(value);
    }
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
        disabled: this.selectedJob || this.type === 'part'
      }, [GlobalValidator.required]],
      rcname: [{
        value: undefined,
        disabled: true
      }, [GlobalValidator.required, GlobalValidator.maxLength(150), GlobalValidator.specialCharacter]],
      internal: [{value: 'Y', disabled: true}],
      remark: [{value: undefined, disabled: true}, GlobalValidator.maxLength(200)],
      jobtime: [{value: undefined, disabled: !this.currentUser.isAdmin || this.type === 'part'},
        Validators.compose([GlobalValidator.required, GlobalValidator.floatNumberFormat, GlobalValidator.maxLength(53)])],
      actualJobTime: [{value: undefined, disabled: this.currentUser.isAdmin || this.type === 'part'},
        Validators.compose([GlobalValidator.required, GlobalValidator.floatNumberFormat, GlobalValidator.maxLength(53)])],
      jobgroup: [{value: this.jobGroupTypes[0].id, disabled: true}, GlobalValidator.required],
      status: ['Y'],
      cfId: [{
        value: undefined,
        disabled: this.selectedJob || this.type === 'part'
      }, [GlobalValidator.required]],
      cmId: [{
        value: undefined,
        disabled: this.selectedJob || this.type === 'part'
      }, [GlobalValidator.required]],
      rcjId: [undefined],
      id: [undefined]
    });
    if (this.selectedJob) {
      this.form.patchValue(this.selectedJob);
      this.form.patchValue({
        jobType: String(this.selectedJob.jobType)
      });
    }
    if (this.carInfo) {
      this.form.patchValue(this.carInfo);
    }
    this.getCarModelByFam(this.carInfo.cfId);
    this.form.get('cfId').valueChanges.subscribe(val => {
      this.carModelList = undefined;
      if (val || val === 0) {
        this.getCarModelByFam(val);
      }
    });

  }

  private getCarFamByType() {
    this.loading.setDisplay(true);
    this.carFamilyApi.getAll().subscribe(carFams => {
      this.carFamListDefault = carFams || [];
      if (!this.selectedJob && !this.carInfo) {
        this.form.patchValue({cfId: carFams[0] ? carFams[0].id : undefined});
      }
      this.loading.setDisplay(false);
    });
  }

  private getCarModelByFam(cfId) {
    this.loading.setDisplay(true);
    this.form.patchValue({cmId: undefined});
    this.carModelApi.getCarModelByCarFam(cfId).subscribe(carModel => {
      this.carModelList = carModel || [];
      if (!this.form.value.cmId) {
        this.form.patchValue({cmId: carModel[0] ? carModel[0].id : undefined});
      }
      this.loading.setDisplay(false);
    });
  }

  callApiSearchJob(val, paginationParams?) {
    return this.srvDRcJobsApi.getAllListJobByDlr({
      searchKeyword: val.searchKeyword || null,
      isBp: 'N'
    }, paginationParams);
  }

  addJob(data) {
    if (data.hasOwnProperty('cmId')) {
      delete data.cmId;
    }
    this.form.patchValue({
      rcjId: data.id
    });
    this.form.patchValue(data);
  }
}
