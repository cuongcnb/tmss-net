import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetModalHeightService } from '../../../../../shared/common-service/set-modal-height.service';
import { ToastService } from '../../../../../shared/swal-alert/toast.service';
import { DataFormatService } from '../../../../../shared/common-service/data-format.service';
import { MaintenanceCallingModel } from '../../../../../core/models/maintenance-operation/maintenance-calling.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'new-car',
  templateUrl: './new-car.component.html',
  styleUrls: ['./new-car.component.scss'],
})
export class NewCarComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('newCarAdd', {static: false}) newCarAdd;
  @Input() isOldCar: boolean;
  form: FormGroup;
  fieldGrid;
  gridParams;
  data: any;
  modalHeight: number;
  selectedData: MaintenanceCallingModel;

  constructor(
    private modalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
    private swalAlert: ToastService,
    private dataFormatService: DataFormatService,
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {headerName: 'Ngày liên hệ', headerTooltip: 'Ngày liên hệ', field: 'newcarContactday'},
      {headerName: 'Khách hàng', headerTooltip: 'Khách hàng', field: 'errorName'},
      {headerName: 'Mua/bán xe', headerTooltip: 'Mua/bán xe', field: 'carPurchase'},
      {headerName: 'Model xe', headerTooltip: 'Model xe', field: 'errorModel'},
      {headerName: 'Màu', headerTooltip: 'Màu', field: 'carColor'},
      {headerName: 'Giá từ', headerTooltip: 'Giá từ', field: 'carPrice'},
      {headerName: 'Đến', headerTooltip: 'Đến', field: 'carPriceto'},
      {headerName: 'Năm sx/Đời xe', headerTooltip: 'Năm sx/Đời xe', field: 'yearManufacture'},
      {headerName: 'Loại xe', headerTooltip: 'Loại xe', field: 'carType'},
      {headerName: 'Nơi sản xuất', headerTooltip: 'Nơi sản xuất', field: 'carOrigin'},
      {
        headerName: 'Thời gian giao dịch', headerTooltip: 'Thời gian giao dịch', field: 'timePurchase',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
      },
    ];
    this.data = [
      {
        newcarContactday: '29-03',
        errorName: 'Vũ Thị M',
        carPurchase: 'mua',
        errorModel: 'M1996',
        carColor: 'red',
        carPrice: '100',
        carPriceto: '120',
        yearManufacture: '2018',
        carType: 'oto',
        carOrigin: 'Ha noi',
        timePurchase: '08-08',
      },
      {
        newcarContactday: '08-08',
        errorName: 'Nguyễn Văn A',
        carPurchase: 'bán',
        errorModel: 'MB2018',
        carColor: 'blue',
        carPrice: '500',
        carPriceto: '720',
        yearManufacture: '2010',
        carType: 'Mui Tran',
        carOrigin: 'Viet Nam',
        timePurchase: '03-06',
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
      this.newCarAdd.open(this.selectedData);
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

  deleteNewCar() {
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
      errorModel: [undefined],
      dateTime: [undefined],
      errorVin: [undefined],
      licensePlates: [undefined],
    });
  }
}
