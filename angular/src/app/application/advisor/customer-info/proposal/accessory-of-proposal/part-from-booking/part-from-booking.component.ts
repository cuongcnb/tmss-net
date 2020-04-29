import {Component, EventEmitter, OnInit, Input, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';

import {ToastService} from '../../../../../../shared/swal-alert/toast.service';
import {SetModalHeightService} from '../../../../../../shared/common-service/set-modal-height.service';
import {LoadingService} from '../../../../../../shared/loading/loading.service';
import {AppoinmentApi} from '../../../../../../api/appoinment/appoinment.api';
import {DataFormatService} from '../../../../../../shared/common-service/data-format.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'part-from-booking',
  templateUrl: './part-from-booking.component.html',
  styleUrls: ['./part-from-booking.component.scss']
})
export class PartFromBookingComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @Output() choosingPart = new EventEmitter();
  @Input() listPT;
  @Input() removeId;
  modalHeight: number;
  appointmentNo;
  parts;
  fieldGrid;
  params;

  constructor(
    private swalAlertService: ToastService,
    private loadingService: LoadingService,
    private modalHeightService: SetModalHeightService,
    private appoinmentApi: AppoinmentApi,
    private dataFormatService: DataFormatService
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {headerName: 'Mã PT', headerTooltip: 'Mã phụ tùng', field: 'partsCode'},
      {headerName: 'Tên PT', headerTooltip: 'Tên phụ tùng', field: 'partsNameVn'},
      {headerName: 'Số lượng', headerTooltip: 'Số lượng', field: 'qty', cellClass: ['cell-border', 'cell-readonly', 'text-right']},
      {
        headerName: 'Đơn giá', headerTooltip: 'Đơn giá', field: 'sellPrice', cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        valueFormatter: params => this.dataFormatService.formatMoney(params.data.qty * params.data.sellPrice)
      },
      {headerName: 'Thuế', headerTooltip: 'Thuế', field: 'rate', cellClass: ['cell-border', 'cell-readonly', 'text-right']},
      {
        headerName: 'Thành tiền', headerTooltip: 'Thành tiền', cellClass: ['cell-border', 'cell-readonly', 'text-right'],
        tooltip: params => this.dataFormatService.formatMoney(params.data.qty * params.data.sellPrice),
        valueFormatter: params => this.dataFormatService.formatMoney(params.data.qty * params.data.sellPrice)
      }
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
    this.choosingPart.emit(this.parts);
    this.modal.hide();
  }

  private getPartOfBooking(appointmentId) {
    // tslint:disable-next-line:no-unused-expression
    // Tạo biến string lưu trữ tất cả các mã phụ tùng hiện có trong báo giá
     let str = '';
     if (this.listPT !== null && this.listPT !== undefined) {
       this.listPT.map(pt => pt.partsCode !== null && pt.partsCode ? str += pt.partsCode.toString() : str += '');
     }
     this.loadingService.setDisplay(true);
     this.appoinmentApi.findOne(appointmentId).subscribe(res => {
      this.appointmentNo = res.appoinment.appointmentno;
      const partBeforeFilter = str !== null && str !== undefined
        ? res.partList.filter(part => !str.includes(part.part.partsCode) && res.appoinment.roId === null)
        : res.partList;
      this.parts = partBeforeFilter.map(part => Object.assign({}, part.part, part.quotationPart,
        {
          id: part.part.id,
          partsCode: part.part.partsCode,
          partsNameVn: part.part.partsNameVn,
          qty: part.quotationPart.qty,
          sellPrice: part.part.sellPrice,
          rate: part.part.rate,
          quotationprintVersion: 0,
          appId: part.quotationPart.appId,
        }));
      this.params.api.setRowData(this.parts);
      this.loadingService.setDisplay(false);
    });
  }
}
