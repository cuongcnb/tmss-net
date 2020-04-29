import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormArray} from '@angular/forms';

import {ToastService} from '../../../../shared/swal-alert/toast.service';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {RoWshopApi} from '../../../../api/ro-wshop/ro-wshop.api';
import { ActionTypeEmployee } from '../../../../core/constains/repair-progress';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'employee-list-modal',
  templateUrl: './employee-list-modal.component.html',
  styleUrls: ['./employee-list-modal.component.scss']
})
export class EmployeeListModalComponent {
  @Output() new_employee = new EventEmitter();
  @ViewChild('employeeListModal', {static: false}) modal;
  employeeForm: FormGroup;
  modalHeight: number;
  employeeList: Array<any> = [];
  employeeArray: FormArray;
  tempEmployees = [];
  finish_get_date = false;
  actionTypeEmployee = ActionTypeEmployee;
  employee_time_space: Object;
  choosed_employee = [];
  employee_time_form: FormGroup;
  wshop: any;
  constructor(
    private setModalHeight: SetModalHeightService,
    private loadingService: LoadingService,
    private roWshopApi: RoWshopApi,
    private swalAlertService: ToastService,
    private formBuilder: FormBuilder,
  ) {
  }

  open(dataEmployee, data_time, disabled_form = false, wshop) {
    this.wshop = wshop;
    if (this.tempEmployees.length == 0 && !disabled_form) {
      this.choosed_employee = dataEmployee;
      this.employee_time_form = this.formBuilder.group({
        fromDateTime: data_time.fromDateTime,
        toDateTime: data_time.toDateTime,
      });
      this.getEmpByTime(data_time);
      this.modal.show();
    }
  }

  onResize() {
    this.modalHeight = this.setModalHeight.onResize();
  }

  getEmpByTime(employee_time) {
    if (employee_time) {
      this.loadingService.setDisplay(true);
      this.roWshopApi.getEmpByTime(employee_time).subscribe(emps => {
        this.loadingService.setDisplay(false);
        if (emps) {
          this.employeeList = emps;

          // lấy ra những kỹ sư chưa được chọn
          for (let i = 0; i < this.employeeList.length; i++) {
            this.employeeList[i].empId = this.employeeList[i].id;
            for (let j = 0; j < this.choosed_employee.length; j++) {
              if (this.employeeList[i] && this.employeeList[i].id == this.choosed_employee[j].empId) {
                this.employeeList.splice(i, 1);
              }
            }
          }


          for (let i = 0; i < this.employeeList.length; i++){
            let employee_value  = Object.assign({}, this.employeeList[i]);
            employee_value.choosed =  false;
            this.tempEmployees.push(employee_value);
          }
          this.initFormEmploy();
        }

        this.finish_get_date = true;
      });
    }
  }
  getDataForm() {
    return (this.employeeForm.get('data' )as FormArray).controls;
  }
  
  getName(data) {
    return data.value.empName;
  }

  initFormEmploy() {
    let formbuilder_array = [];
    this.tempEmployees.forEach(employ => {
      let show_plan_time = false;
      if (employ.planFromTime && employ.planToTime) {
        show_plan_time = true;
      }
      const employee = this.formBuilder.group({
        id: employ.id,
        empCode: employ.empCode,
        empId: employ.empId ? employ.empId : employ.id,
        empImg: employ.empImg,
        empName: employ.empName,
        empStatus: employ.empStatus,
        choosed: false,
        actionType: this.actionTypeEmployee.add_or_update,
        new_employ: true,
        planFromTime: employ.planFromTime ? employ.planFromTime : this.wshop.planFromTime,
        planToTime: employ.planToTime ? employ.planToTime : this.wshop.planToTime,
        show_plan_time: show_plan_time,
      });
      formbuilder_array.push(employee);
    });

    this.employeeForm = this.formBuilder.group({
      data: this.formBuilder.array(formbuilder_array)
    });
    this.employeeArray = this.employeeForm.get('data') as FormArray;
  }

  accept() {
    let data_emp = [];
    for (let i = 0; i < this.getDataForm().length; i++) {
      if (this.getDataForm()[i].value.choosed) data_emp.push(this.getDataForm()[i].value);
    }
    this.new_employee.emit(data_emp);
    this.reset_data();
    this.modal.hide();
  }

  close() {
    this.reset_data();
    this.modal.hide();
  }

  reset_data() {
    if (this.employeeForm) this.employeeForm.reset();
    this.tempEmployees = [];
    if (this.employeeArray) this.employeeArray.reset();
    this.finish_get_date = false;
  }

  search() {
    if (!this.employee_time_form.value.fromDateTime && !this.employee_time_form.value.toDateTime) {
      this.swalAlertService.openWarningToast("Từ ngày, Đến ngày không được để trống");
      return;
    }

    if (!this.employee_time_form.value.fromDateTime) {
      this.swalAlertService.openWarningToast("Từ ngày không được để trống");
      return;
    }

    if (!this.employee_time_form.value.toDateTime) {
      this.swalAlertService.openWarningToast("Đến ngày không được để trống");
      return;
    }
    if (this.employee_time_form.value.fromDateTime > this.employee_time_form.value.toDateTime) {
      this.swalAlertService.openWarningToast("Từ ngày phải nhỏ hơn Đến ngày");
      return;
    } else {
      this.reset_data();
      let employee_time = {
        fromDateTime: this.employee_time_form.value.fromDateTime,
        toDateTime: this.employee_time_form.value.toDateTime,
      }
      this.getEmpByTime(employee_time);
    }
  }

}
