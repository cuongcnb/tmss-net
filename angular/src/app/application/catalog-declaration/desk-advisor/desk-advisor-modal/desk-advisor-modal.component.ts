import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { DeskAdvisorModel } from '../../../../core/models/catalog-declaration/desk-advisor.model';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { DeskAdvisorApi } from '../../../../api/master-data/catalog-declaration/desk-advisor.api';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { GlobalValidator } from '../../../../shared/form-validation/validators';
import { EmployeeCommonModel } from '../../../../core/models/common-models/employee-common.model';
import { EmployeeCommonApi } from '../../../../api/common-api/employee-common.api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'desk-advisor-modal',
  templateUrl: './desk-advisor-modal.component.html',
  styleUrls: ['./desk-advisor-modal.component.scss']
})
export class DeskAdvisorModalComponent implements OnInit {
  @ViewChild('deskAdvisorModal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData: DeskAdvisorModel;
  empUsedId: Array<number>;
  form: FormGroup;
  gridField;
  modalHeight: number;
  advisors: Array<EmployeeCommonModel>;

  constructor(
    private formBuilder: FormBuilder,
    private modalHeightService: SetModalHeightService,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private deskAdvisorApi: DeskAdvisorApi,
    private employeeCommonApi: EmployeeCommonApi,
  ) {
    this.gridField = [
      {headerName: 'Mã nhân viên CVDV', headerTooltip: 'Mã nhân viên CVDV', field: 'empCode'},
      {headerName: 'Tên nhân viên CVDV', headerTooltip: 'Tên nhân viên CVDV', field: 'empName'},
    ];
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(usedAdvisors, selectedData?) {
    this.empUsedId = usedAdvisors.length
      ? usedAdvisors.filter(advisor => advisor.advisorId && advisor.status === 'Y')
        .map(advisor => advisor.advisorId)
      : [];
    this.selectedData = selectedData;
    this.buildForm();
    this.modal.show();
    this.getEmps();
    if (!this.selectedData) {
      this.form.get('status').disable();
    }
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    const apiCall = this.selectedData
      ? this.deskAdvisorApi.update(this.form.value)
      : this.deskAdvisorApi.create(this.form.value);

    this.loadingService.setDisplay(true);
    apiCall.subscribe(() => {
      this.swalAlertService.openSuccessToast();
      this.modal.hide();
      this.close.emit();
    });
  }

  reset() {
    this.form = undefined;
    this.selectedData = undefined;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      deskName: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(50), GlobalValidator.specialCharacter])],
      id: [undefined],
      advisorId: [undefined], // lấy id danh sách
      advisorCode: [{value: undefined, disabled: true}],
      description: [undefined, GlobalValidator.maxLength(200)],
      status: ['Y'],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
      this.form.patchValue({advisorCode: this.selectedData.advisorCode});
    }
    this.form.get('advisorId').valueChanges.subscribe(val => {
      if (val) {
        this.form.patchValue({advisorCode: this.advisors.find(advisor => advisor.id === val).empCode});
      } else {
        this.form.patchValue({advisorCode: null});
      }
    });
  }

  private getEmps() {
    this.loadingService.setDisplay(true);
    this.employeeCommonApi.getEmpIsAdvisor().subscribe(emps => {
      this.advisors = emps.filter(emp => {
        return !this.empUsedId.includes(emp.id) || (this.selectedData && emp.id === this.selectedData.advisorId);
      }) || [];
      this.loadingService.setDisplay(false);
    });
  }
}
