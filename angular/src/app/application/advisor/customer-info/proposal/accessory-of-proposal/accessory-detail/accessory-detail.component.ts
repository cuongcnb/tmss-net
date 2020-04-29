import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

import { SetModalHeightService } from '../../../../../../shared/common-service/set-modal-height.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'accessory-detail',
  templateUrl: './accessory-detail.component.html',
  styleUrls: ['./accessory-detail.component.scss'],
})
export class AccessoryDetailComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  fieldGrid;
  modalHeight: number;
  params;

  constructor(
    private setModalHeightService: SetModalHeightService,
  ) {
    this.fieldGrid = [
      {headerName: 'Mã PT', headerTooltip: 'Mã phụ tùng', field: 'partCode', pinned: true},
      {headerName: 'Tên PT', headerTooltip: 'Tên phụ tùng', field: 'partName', pinned: true},
      {headerName: 'Đ/vị', headerTooltip: 'Đơn vị', field: 'unit', pinned: true},
      {headerName: 'Loại PT', headerTooltip: 'Loại phụ tùng', field: 'partType', pinned: true},
      {headerName: 'Đơn giá', headerTooltip: 'Đơn giá', field: 'price', pinned: true},
      {headerName: 'Tồn', headerTooltip: 'Tồn', field: 'stock', pinned: true},
      {headerName: 'Đ/dấu', headerTooltip: 'Đ/dấu', field: 'tick', pinned: true},
      {headerName: 'Cần', headerTooltip: 'Cần', field: 'required', pinned: true},
      {headerName: 'Nhận', headerTooltip: 'Nhận', field: 'receive', pinned: true},
      {headerName: 'Thành tiền', headerTooltip: 'Thành tiền', field: 'total', pinned: true},
      {headerName: 'Thuế', headerTooltip: 'Thuế', field: 'tax', pinned: true},
      {headerName: 'Giảm giá', headerTooltip: 'Giảm giá', field: 'discount', pinned: true},
      {headerName: 'Nhà CC', headerTooltip: 'Nhà cung cấp', field: 'cc'},
      {headerName: 'T/T dự trữ', headerTooltip: 'T/T dự trữ', field: 'dutru'},
      {headerName: 'Vị trí', headerTooltip: 'Vị trí', field: 'vitri'},
      {headerName: 'Mã TT mới', headerTooltip: 'Mã TT mới', field: 'newTT'},
      {headerName: 'Mã TT cũ', headerTooltip: 'Mã TT cũ', field: 'oldTT'},
    ];
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  open() {
    this.modal.show();
  }

  callBackGrid(params) {
    this.params = params;
  }

}
