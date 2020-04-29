import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { RepairCavityModel } from '../../../../core/models/catalog-declaration/repair-cavity.model';
import { ShopCommonApi } from '../../../../api/common-api/shop-common.api';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { DivisionCommonApi } from '../../../../api/common-api/division-common.api';
import { EmployeeCommonApi } from '../../../../api/common-api/employee-common.api';
import { ShopTypeCommonApi } from '../../../../api/common-api/shop-type-common.api';
import { CavityTypeModel } from '../../../../core/models/catalog-declaration/cavity-type.model';
import { EmployeeCommonModel } from '../../../../core/models/common-models/employee-common.model';
import { ConfirmService } from '../../../../shared/confirmation/confirm.service';
import { ErrorCodes } from '../../../../core/interceptors/error-code';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'repair-cavity-modal',
  templateUrl: './repair-cavity-modal.component.html',
  styleUrls: ['./repair-cavity-modal.component.scss']
})
export class RepairCavityModalComponent implements OnInit {
  @ViewChild('searchEmployee', {static: false}) searchEmployee;
  @ViewChild('searchDivision', {static: false}) searchDivision;
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData: RepairCavityModel;
  form: FormGroup;
  modalHeight: number;

  nestGridField;
  picGridField;
  shopTypes: Array<CavityTypeModel>;
  employeeData: Array<EmployeeCommonModel>;

  ngOnInit() {
    this.onResize();
  }

  constructor(
    private formBuilder: FormBuilder,
    private modalHeightService: SetModalHeightService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private confirmService: ConfirmService,
    private divisionCommonApi: DivisionCommonApi,
    private employeeCommonApi: EmployeeCommonApi,
    private shopApi: ShopCommonApi,
    private shopTypeCommonApi: ShopTypeCommonApi,
  ) {
    this.nestGridField = [
      {headerName: 'Mã tổ phụ trách', headerTooltip: 'Mã tổ phụ trách', field: 'divCode'},
      {headerName: 'Tên tổ phụ trách', headerTooltip: 'Tên tổ phụ trách', field: 'divName'},
    ];
    this.picGridField = [
      {headerName: 'Mã NV', headerTooltip: 'Mã NV', field: 'empCode'},
      {headerName: 'Tên NV', headerTooltip: 'Tên NV', field: 'empName'},
    ];
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(cavityTypeId, selectedData?) {
    this.selectedData = selectedData;
    this.buildForm();
    this.employeeData = undefined;
    this.modal.show();
    this.getShopTypes();
    if (this.selectedData && this.selectedData.divId) {
      this.getEmployeeData(this.selectedData.divId);
    }
    if (cavityTypeId && this.selectedData) {
      this.form.patchValue({
        wsTypeId: cavityTypeId,
        listEmpID: this.selectedData.listEmp
      });
    }
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    let listEmpId;
    if (this.form.value.listEmpID) {
      listEmpId = this.form.value.listEmpID.map(item => item.id);
    }

    const value = Object.assign({}, this.form.value, {
      listEmpID: listEmpId
    });
    this.loadingService.setDisplay(true);

    const apiCall = accept => {
      this.shopApi.saveWshop(accept, value).subscribe(() => {
        this.swalAlertService.openSuccessToast();
        this.close.emit();
        this.modal.hide();
      }, err => {
        if (err.status) {
          this.confirmService.openConfirmModal('Cảnh báo', ErrorCodes[err.status]).subscribe(() => {
            apiCall(true);
          });
        }
      });
    };

    apiCall(false);
  }

  reset() {
    this.form = undefined;
  }

  patchDivision(selectedData) {
    this.form.patchValue({
      divId: selectedData.id,
      divCode: selectedData.divCode
    });
    this.loadingService.setDisplay(true);
    this.employeeData = undefined;
    this.form.get('listEmpID').patchValue('');
    this.getEmployeeData(this.form.value.divId);
  }

  getDivisions() {
    this.loadingService.setDisplay(true);
    this.divisionCommonApi.getDivisionByCurrentDlr().subscribe(res => {
      this.searchDivision.open(null, res || []);
      this.loadingService.setDisplay(false);
    });
  }

  getEmployeeData(divId) {
    this.employeeCommonApi.getTechiciansEmp(divId).subscribe(value => {
      this.loadingService.setDisplay(false);
      this.employeeData = value;
    });
  }

  private getShopTypes() {
    this.loadingService.setDisplay(true);
    this.shopTypeCommonApi.getAll(false).subscribe(shopTypes => {
      this.loadingService.setDisplay(false);
      this.shopTypes = shopTypes || [];
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      wsCode: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(20), GlobalValidator.specialCharacter])],
      id: [undefined],
      wsName: [undefined, Validators.compose([GlobalValidator.maxLength(50), GlobalValidator.specialCharacter])],
      description: [undefined, GlobalValidator.maxLength(100)],
      divId: [undefined],
      divCode: [undefined],
      pic: [undefined],
      empName: [undefined],
      listEmpID: [undefined],
      ordering: [undefined, Validators.compose([GlobalValidator.numberFormat, GlobalValidator.maxLength(10)])],
      status: ['Y'],
      wsTypeId: [undefined, GlobalValidator.required],
    });

    this.form.value.divId = undefined;

    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
      this.form.patchValue({pic: this.selectedData.empId});
    }
  }
}

