import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastService } from '../../../../../../shared/swal-alert/toast.service';
import { SetModalHeightService } from '../../../../../../shared/common-service/set-modal-height.service';
import { LoadingService } from '../../../../../../shared/loading/loading.service';
import { DataFormatService } from '../../../../../../shared/common-service/data-format.service';
import { PartsInfoManagementApi } from '../../../../../../api/parts-management/parts-info-management.api';
import { AppoinmentApi } from '../../../../../../api/appoinment/appoinment.api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'part-from-booking-detail',
  templateUrl: './part-from-booking-detail.component.html',
  styleUrls: ['./part-from-booking-detail.component.scss'],
})
export class PartFromBookingDetailComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  modalHeight: number;
  appointmentNo;
  parts;
  fieldGrid;
  params;

  constructor(
    private swalAlertService: ToastService,
    private loadingService: LoadingService,
    private modalHeightService: SetModalHeightService,
    private partsInfoManagementApi: PartsInfoManagementApi,
    private dataFormatService: DataFormatService,
    private appoinmentApi: AppoinmentApi,
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {headerName: 'Mã PT', headerTooltip: 'Mã phụ tùng', field: 'partsCode'},
      {headerName: 'Tên PT', headerTooltip: 'Tên phụ tùng', valueGetter: params => {
           return params.data && params.data.partsNameVn && !!params.data.partsNameVn
             ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '' ;
        }},
      {headerName: 'Đơn vị', headerTooltip: 'Đơn vị', field: 'unitName'},
      {headerName: 'Loại PT', headerTooltip: 'Loại phụ tùng', field: 'partstypeName'},
      {headerName: 'Đơn giá', headerTooltip: 'Đơn giá', field: 'sellPrice', cellClass: ['cell-border', 'cell-readonly', 'text-right']},
      {headerName: 'Tồn', headerTooltip: 'Tồn', field: 'onHandQty'},
      {headerName: 'Đ/Dấu', headerTooltip: 'Đ/Dấu', field: 'prepick'},
      {headerName: 'Cần', headerTooltip: 'Cần', field: 'qty'},
      {headerName: 'Nhận', headerTooltip: 'Nhận', field: 'qtyReceived'},
      {
        headerName: 'Thành tiền', headerTooltip: 'Thành tiền', cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.formatMoney(params.data.qty * params.data.sellPrice),
        valueFormatter: params => this.dataFormatService.formatMoney(params.data.qty * params.data.sellPrice),
      },
      {headerName: 'Thuế', headerTooltip: 'Thuế', field: 'rate', cellClass: ['cell-border', 'cell-readonly', 'text-right']},
      {headerName: 'Giảm giá', headerTooltip: 'Giảm giá', field: 'discount'},
      {headerName: 'Nhà CC', headerTooltip: 'Nhà cung cấp', field: 'supplierName'},
      {headerName: 'T/T Dự trữ', headerTooltip: 'T/T Dự trữ', field: 'instockType'},
      {headerName: 'Vị trí', headerTooltip: 'Vị trí', field: 'location'},
      {headerName: 'Mã TT mới', headerTooltip: 'Mã TT mới', field: 'substitutionpartno'},
      {headerName: 'Mã TT cũ', headerTooltip: 'Mã TT cũ', field: 'substitutionpartnoOld'},

    ];
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(appointmentId) {
    if (this.params) {
      this.params.api.sizeColumnsToFit();
    }
    this.onResize();
    this.modal.show();
    this.getPartOfBooking(appointmentId);
    // this.getNumberAppoinment(appointmentId);
  }

  callbackGrid(params) {
    this.params = params;
  }

  hide() {
    this.modal.hide();
  }

  reset() {
    this.appointmentNo = undefined;
    this.params.api.setRowData();
  }

  save() {
    this.modal.hide();
  }

  private getPartOfBooking(roId) {
    this.loadingService.setDisplay(true);
    this.partsInfoManagementApi.partInfoOfRepairOrder(roId).subscribe(res => {
      this.parts = res.map(part => Object.assign({}, part,
        {
          id: part.id,
          partsCode: part.partsCode,
          partsNameVn: part.partsNameVn,
          qty: part.qty,
          sellPrice: part.sellPrice,
          rate: part.rate,
        }));
      this.params.api.setRowData(this.parts);
      this.loadingService.setDisplay(false);
    });
  }

  private getNumberAppoinment(appointmentId) {
    this.appoinmentApi.findOne(appointmentId).subscribe(res => {
      this.appointmentNo = res.appoinment.appointmentno;
    });
  }
}
