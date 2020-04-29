import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetModalHeightService } from '../../../../../shared/common-service/set-modal-height.service';
import { ToastService } from '../../../../../shared/swal-alert/toast.service';
import { MaintenanceCallingModel } from '../../../../../core/models/maintenance-operation/maintenance-calling.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'accessary-car',
  templateUrl: './accessary-car.component.html',
  styleUrls: ['./accessary-car.component.scss'],
})
export class AccessaryCarComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('newAccsessary', {static: false}) newAccsessary;
  @Input() isAfterDays15;
  gridInsurrance: any;
  form: FormGroup;
  gridParams;
  data: any;
  modalHeight: number;
  selectedData: MaintenanceCallingModel;

  constructor(
    private modalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
    private swalAlert: ToastService,
  ) {
  }

  ngOnInit() {

    this.gridInsurrance = [
      {headerName: 'VIN', headerTooltip: 'VIN', field: 'errorVin'},
      {headerName: 'BKS', headerTooltip: 'BKS', field: 'licensePlates'},
      {headerName: 'Ngày hỏi mua', headerTooltip: 'Ngày hỏi mua', field: 'insurranceDay'},
      {headerName: 'Loại phụ kiện', headerTooltip: 'Loại phụ kiện', field: 'accessoriesType'},
      {headerName: 'Số lượng', headerTooltip: 'Số lượng', field: 'errorAmount'},
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'errorNote'},
    ];
    this.data = [
      {
        errorVin: 'S007', licensePlates: '29-s6.65222', insurranceDay: '29-03',
        accessoriesType: 'Bánh xe', errorAmount: '01', errorNote: 'Không có ghi chú',
      },
      {
        errorVin: 'S006', licensePlates: '30-s1.5545', insurranceDay: '03-06',
        accessoriesType: 'Kính xe', errorAmount: '02', errorNote: 'Đã hết hàng',
      },
    ];
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open() {
    this.buildForm();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
  }

  refresh() {
    this.selectedData = undefined;
    this.gridParams.api.setRowData(this.data);
  }

  addNewCar(data) {
    this.data.push(data);
    this.refresh();
  }

  editNewCar() {
    if (this.selectedData) {
      this.newAccsessary.open(this.selectedData);
    } else {
      this.swalAlert.openWarningToast('Bạn phải chọn 1 dòng');
    }
  }

  updateNewCar(selectedData) {
    this.data = this.data.map(data => {
      return data === this.selectedData ? selectedData : data;
    });
    this.refresh();
  }

  deleteAccessary() {
    if (this.selectedData) {
      this.data = this.data.filter(data => data !== this.selectedData);
      this.refresh();
    } else {
      this.swalAlert.openWarningToast('Bạn phải chọn 1 dòng');
    }
  }

  callbackGrid(params) {
    this.gridParams = params;
    this.gridParams.api.setRowData(this.data);
  }

  getParams() {
    const selected = this.gridParams.api.getSelectedRows();
    if (selected) {
      this.selectedData = selected[0];
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      sortAgency: [undefined],
      accessoriesType: [undefined],
      dateTime: [undefined],
      errorVin: [undefined],
      licensePlates: [undefined],
    });
  }

}
