import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { RepairCavityModel } from '../../../../core/models/catalog-declaration/repair-cavity.model';
import { ShopCommonApi } from '../../../../api/common-api/shop-common.api';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { DivisionCommonApi } from '../../../../api/common-api/division-common.api';
import { EmployeeCommonApi } from '../../../../api/common-api/employee-common.api';
import { CavityTypeModel } from '../../../../core/models/catalog-declaration/cavity-type.model';
import { EmployeeCommonModel } from '../../../../core/models/common-models/employee-common.model';
import { ConfirmService } from '../../../../shared/confirmation/confirm.service';
import { BpGroupApi } from '../../../../api/bp-group/bp-group.api';
import { ErrorCodes } from '../../../../core/interceptors/error-code';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'wshop-bp-group-modal',
  templateUrl: './wshop-bp-group-modal.component.html',
  styleUrls: ['./wshop-bp-group-modal.component.scss']
})
export class WshopBpGroupModalComponent implements OnInit {
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
  employeeArray: FormArray;
  employeeData: Array<EmployeeCommonModel>;
  tempEmployees = [];
  val;
  loadingData = false;
  openDropdownChooseEmp = false;
  scroll_height = 40;

  ngOnInit() {
    this.onResize();
  }

  constructor(
    private formBuilder: FormBuilder,
    private modalHeightService: SetModalHeightService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private confirmService: ConfirmService,
    private componentdivisionCommonApi: DivisionCommonApi,
    private employeeCommonApi: EmployeeCommonApi,
    private shopApi: ShopCommonApi,
    private bpGroupApi: BpGroupApi,
  ) {
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(selectedData?) {
    this.loadingData = true;
    this.val = selectedData;
    this.loadingService.setDisplay(true);
    if (this.val) {
      this.bpGroupApi.getBpGroup(this.val.id).subscribe(res => {
        this.val.empIds = res;
        this.buildForm();
      });
    } else {
      this.buildForm();
    }
    this.selectedData = selectedData;
    this.employeeData = undefined;
    this.getEmployeeData();
    this.modal.show();
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    let empIds;
    if (this.form.value.empIds) {
      empIds = this.form.value.empIds.map(item => item.id);
    } else empIds = [];

    if (empIds.length == 0) {
      this.swalAlertService.openWarningToast("Tổ/nhóm phải có ít nhất 1 KTV");
      return;
    }

    const value = {
      groupCode: this.form.value.groupCode.trim(),
      groupName: this.form.value.groupName.trim(),
      groupDesc: this.form.value.groupDesc.trim(),
      empIds: empIds,
      ordering: this.form.value.ordering,
      id: this.selectedData ?  this.selectedData.id : undefined
    }
    this.loadingService.setDisplay(true);
    if (!this.selectedData) {
      this.bpGroupApi.createBpGroup(value).subscribe(() => {
        this.swalAlertService.openSuccessToast("Lưu thành công");
        this.close.emit();
        this.loadingService.setDisplay(false);
  
        this.modal.hide();
      }, err => {
        if (err.status) {
          
        }
      });
    } else {
      this.bpGroupApi.updateBpGroup(value).subscribe(() => {
        this.swalAlertService.openSuccessToast("Lưu thành công");
        this.close.emit();
        this.loadingService.setDisplay(false);
  
        this.modal.hide();
      }, err => {
        if (err.status) {
          
        }
      });
    }
    
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
    this.form.get('empIds').patchValue('');
    //this.getEmployeeData(this.form.value.divId);
  }


  getEmployeeData() {
    this.employeeCommonApi.getEmployees().subscribe(value => {
      this.loadingService.setDisplay(false);
      this.employeeData = value;
      this.loadingData = false;

    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      groupCode: [this.val ? this.val.groupCode : undefined],
      groupName: [this.val ? this.val.groupName : undefined],
      groupDesc: [this.val ? this.val.groupDesc : undefined],
      ordering: [this.val ? this.val.ordering : undefined],
      empIds: [this.val ? this.val.empIds : []],
    });
  }

  recaculateHeight() {
    if ($('#selecteEmployees').prop('scrollHeight') > $('#selecteEmployees').prop('clientHeight')) {
      this.scroll_height = 238;
    } else this.scroll_height = 40;
  }
}

