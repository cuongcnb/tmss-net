import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ToastService} from '../../../../../shared/swal-alert/toast.service';
import {SetModalHeightService} from '../../../../../shared/common-service/set-modal-height.service';
import {DataFormatService} from '../../../../../shared/common-service/data-format.service';
import {ModalDirective} from 'ngx-bootstrap';
import {LoadingService} from '../../../../../shared/loading/loading.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CurrentUser} from '../../../../../home/home.component';
import {JobGroupModel} from '../../../../../core/models/catalog-declaration/job-group.model';
import {RepairJobApi} from '../../../../../api/common-api/repair-job.api';
import {JobGroupTypes} from '../../../../../core/constains/job-group-types';
import {GlobalValidator} from '../../../../../shared/form-validation/validators';
import {RepairJobModel} from '../../../../../core/models/catalog-declaration/repair-job.model';
import {CarFamilyModel} from '../../../../../core/models/catalog-declaration/car-family.model';
import {ModelCarModel} from '../../../../../core/models/catalog-declaration/model-car.model';
import {CarFamilyTypes} from '../../../../../core/constains/car-type';
import {PartsOfJobModel} from '../../../../../core/models/catalog-declaration/parts-of-job.model';
import {CarModelApi} from '../../../../../api/common-api/car-model.api';
import {CarFamilyApi} from '../../../../../api/common-api/car-family.api';
import {CommonService} from '../../../../../shared/common-service/common.service';
import {PartsInfoManagementApi} from '../../../../../api/parts-management/parts-info-management.api';
import {GridTableService} from '../../../../../shared/common-service/grid-table.service';
import {SrvDRcJobsApi} from '../../../../../api/master-data/warranty/srv-d-rc-jobs.api';
import {omit} from 'lodash';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'modify-job-group-modal',
  templateUrl: './modify-job-group-modal.component.html',
  styleUrls: ['./modify-job-group-modal.component.scss']
})
export class ModifyJobGroupModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData: JobGroupModel;
  form: FormGroup;
  modalHeight: number;
  currentUser = CurrentUser;
  jobGroupTypes = JobGroupTypes;

  jobGroupField;
  jobGroupParams;
  jobGroupList: Array<JobGroupModel>;
  jobGroupSelected: JobGroupModel;

  repairJobField;
  repairJobParams;
  repairJobSelected: RepairJobModel;

  partGridParams;
  carFamField;
  carFamList: Array<CarFamilyModel> = [];
  carFamListDefault: Array<CarFamilyModel>;
  carModelField;
  carModelList: Array<ModelCarModel>;
  carTypes = CarFamilyTypes;

  partField;
  partParams;
  partList: Array<PartsOfJobModel>;
  partFooter;
  partTotalWithoutTax: number;
  partTaxTotal: number;
  partTotalWithTax: number;
  partSearchGridField;

  constructor(
    private formBuilder: FormBuilder,
    private modalHeightService: SetModalHeightService,
    private loading: LoadingService,
    private swalAlert: ToastService,
    private repairJobApi: RepairJobApi,
    private carModelApi: CarModelApi,
    private carFamilyApi: CarFamilyApi,
    private dataFormatService: DataFormatService,
    private common: CommonService,
    private partsInfoManagementApi: PartsInfoManagementApi,
    private gridTableService: GridTableService,
    private srvDRcJobsApi: SrvDRcJobsApi
  ) {
  }

  ngOnInit() {
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
    this.partField = [
      {headerName: 'Mã PT', headerTooltip: 'Mã phụ tùng', field: 'partsCode', minWidth: 100},
      {
        headerName: 'Tên phụ tùng', headerTooltip: 'Tên phụ tùng', valueGetter: params => {
           return params.data && params.data.partsNameVn && !!params.data.partsNameVn
             ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '' ;
        }, minWidth: 200
      },
      {headerName: 'Genuine', headerTooltip: 'Genuine', field: 'genuine', minWidth: 100},
      {headerName: 'Đơn vị', headerTooltip: 'Đơn vị', field: 'unitName', minWidth: 100},
      {headerName: 'Số lượng', headerTooltip: 'Số lượng', field: 'reqQty', cellClass: ['cell-border', 'cell-readonly', 'text-right'], minWidth: 100, editable: true},
      {
        headerName: 'Đơn giá', headerTooltip: 'Đơn giá', field: 'sellPrice', cellClass: ['cell-border', 'cell-readonly', 'text-right'], minWidth: 100,
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      },
      {
        headerName: 'Thành tiền', headerTooltip: 'Thành tiền', field: 'total', cellClass: ['cell-border', 'cell-readonly', 'text-right'], minWidth: 200,
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      }
    ];
    if (!this.currentUser.isAdmin) {
      this.jobGroupTypes = this.jobGroupTypes.filter(type => type.name !== 'Bảo dưỡng');
    }

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
      {headerName: 'Mã CV', headerTooltip: 'Mã CV', field: 'rccode'},
      {headerName: 'Tên CV', headerTooltip: 'Tên CV', field: 'rcname'},
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'remark'}
    ];
    this.jobGroupField = [
      {headerName: 'Mã gói CV', headerTooltip: 'Mã gói CV', field: 'gjCode'},
      {headerName: 'Tên gói CV', headerTooltip: 'Tên gói CV', field: 'gjName'},
      {
        headerName: 'Nhóm', headerTooltip: 'Nhóm', field: 'jobType',
        valueFormatter: params => {
          const matchVal = this.jobGroupTypes.find(type => type.id === params.value);
          return matchVal ? matchVal.name : '';
        }
      },
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'remark'}
    ];
    this.repairJobField = [
      {headerName: 'Mã CV', headerTooltip: 'Mã CV', field: 'rccode'},
      {headerName: 'Tên CV', headerTooltip: 'Tên CV', field: 'rcname'},
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'remark'}
    ];
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.buildForm();
    this.onResize();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
    this.selectedData = undefined;
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    const listPart = this.gridTableService.getAllData(this.partGridParams);
    let value = this.form.value;
    value.listRepairParts = listPart;
    value.jobsModels = {
      cfId: value.carFamId,
      cmId: value.carModelId
    };
    value = omit(value, ['carFamId', 'carModelId']);
    const apiCall = this.selectedData
      ? this.srvDRcJobsApi.updateJobForCar(value) : this.srvDRcJobsApi.insertJobForCar(value);
    this.loading.setDisplay(true);
    apiCall.subscribe(() => {
      this.close.emit();
      this.modal.hide();
      this.loading.setDisplay(false);
      this.swalAlert.openSuccessToast();
    });
  }

  callbackGridParts(params) {
    params.api.setRowData([]);
    this.partGridParams = params;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      carFamId: [undefined],
      carModelId: [undefined],
      cmName: [null],
      state: [undefined],
      gjCode: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(30), GlobalValidator.specialCharacter])],
      id: [undefined],
      gjName: [undefined, Validators.compose([GlobalValidator.maxLength(100), GlobalValidator.specialCharacter])],
      remark: [undefined, GlobalValidator.maxLength(200)],
      jobType: [this.jobGroupTypes[0].id]
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

  private getCarModelByFam(famId) {
    this.loading.setDisplay(true);
    this.carModelApi.getCarModelByCarFam(famId).subscribe(carModel => {
      this.carModelList = carModel || [];
      this.form.patchValue({carModelId: carModel[0] ? carModel[0].id : undefined});
      this.loading.setDisplay(false);
    });
  }

  private getCarFamByType() {
    this.loading.setDisplay(true);
    this.carFamilyApi.getAll().subscribe(carFams => {
      this.carFamListDefault = carFams || [];
      this.form.patchValue({carFamId: carFams[0] ? carFams[0].id : undefined});
      this.loading.setDisplay(false);
    }, () => {

    }, () => {
    });
  }

  private setPartFooter() {
    this.partFooter = [{
      partsCode: 'Tổng tiền trước thuế',
      partsName: this.dataFormatService.moneyFormat(this.partTotalWithoutTax),
      reqQty: 'Tổng thuế',
      sellPrice: this.dataFormatService.moneyFormat(this.partTaxTotal),
      tax: 'Tổng tiền sau thuế',
      total: this.dataFormatService.moneyFormat(this.partTotalWithTax)
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

  callbackPart(params) {
    this.partGridParams = params;
  }

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
}
