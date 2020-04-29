import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetModalHeightService } from '../../../../../shared/common-service/set-modal-height.service';
import { ToastService } from '../../../../../shared/swal-alert/toast.service';
import { DataFormatService } from '../../../../../shared/common-service/data-format.service';
import { MaintenanceCallingModel } from '../../../../../core/models/maintenance-operation/maintenance-calling.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'insurrance-car',
  templateUrl: './insurrance-car.component.html',
  styleUrls: ['./insurrance-car.component.scss'],
})
export class InsurranceCarComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('newInsurrance', {static: false}) newInsurrance;
  @Input() isAfterDays15: boolean;
  fieldGrid;
  form: FormGroup;
  gridParams;
  selectedData: MaintenanceCallingModel;
  data: any;
  modalHeight: number;

  constructor(
    private modalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
    private swalAlert: ToastService,
    private dataFormatService: DataFormatService,
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {headerName: 'VIN', headerTooltip: 'VIN', field: 'errorVin'},
      {headerName: 'BKS', headerTooltip: 'BKS', field: 'licensePlates'},
      {
        headerName: 'Ngày hỏi mua', headerTooltip: 'Ngày hỏi mua', eaderName: 'Ngày hỏi mua', field: 'dateTimeHM',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
      },
      {
        headerName: 'Ngày mua', headerTooltip: 'Ngày mua', eaderName: 'Ngày mua', field: 'dateTimeM',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
      },
      {
        headerName: 'Ngày hết hạn', headerTooltip: 'Ngày hết hạn', eaderName: 'Ngày hết hạn', field: 'dateTimeHH',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
      },
      {headerName: 'Loại hình bảo hiểm', headerTooltip: 'Loại hình bảo hiểm', field: 'insurranceType'},
      {headerName: 'Công ty BH', headerTooltip: 'Công ty BH', field: 'errorCompany'},
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'errorNote'},
    ];
    this.data = [
      {
        errorVin: 'M113',
        licensePlates: '29-s6.65222',
        dateTimeHM: '03-29',
        dateTimeM: '03-06',
        dateTimeHH: '08-08',
        insurranceType: 'Loại hình bắt buộc',
        errorCompany: 'IOT',
        errorNote: 'Không có ghi chú',
      },
      {
        errorVin: 'F007',
        licensePlates: '30-s1.5545',
        insurranceDay: '03-06',
        dateTimeHM: '06-06',
        dateTimeM: '08-08',
        dateTimeHH: '10-28',
        expiredDay: '12-12',
        insurranceType: 'Loại hình không bắt buộc',
        errorCompany: 'TDT',
        errorNote: 'Ghi chú cấp 1',
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

  addInsurrance(data) {
    this.data.push(data);
    this.refresh();
  }

  update() {
    if (this.selectedData) {
      this.newInsurrance.open(this.selectedData);
    } else {
      this.swalAlert.openWarningToast('Bạn phải chọn 1 dòng');
    }
  }

  updateInsurrance(selectedData) {
    this.data = this.data.map(data => {
      return data === this.selectedData ? selectedData : data;
    });
    this.refresh();
  }

  deleteInsurrance() {
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
      insurranceType: [undefined],
      dateTime: [undefined],
      errorVin: [undefined],
      licensePlates: [undefined],
    });
  }
}
