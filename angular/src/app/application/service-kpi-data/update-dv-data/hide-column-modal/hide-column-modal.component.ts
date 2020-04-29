import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { LoadingService } from '../../../../shared/loading/loading.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'hide-column-modal',
  templateUrl: './hide-column-modal.component.html',
  styleUrls: ['./hide-column-modal.component.scss'],
})
export class HideColumnModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  modalHeight: number;
  columns = [
    {id: '1', headerName: 'Giờ bắt đầu sửa chữa'},
    {id: '2', headerName: 'Giờ kết thúc sửa chữa'},
    {id: '3', headerName: 'Tổng thời gian sửa chữa'},
    {id: '4', headerName: 'Tỉnh - Thành'},
    {id: '5', headerName: 'Quận - Huyện'},
    {id: '6', headerName: 'Khách hàng trả tiền'},
    {id: '7', headerName: 'Sử dụng phiếu quà'},
    {id: '8', headerName: 'Nhóm KTV'},
    {id: '9', headerName: 'KTV'},
    {id: '10', headerName: 'Doanh thu công và vật tư sơn'},
    {id: '11', headerName: 'Tỷ lệ vật tư sơn'},
    {id: '12', headerName: 'Công thuế ngoài'},
    {id: '13', headerName: 'Dầu máy'},
    {id: '14', headerName: 'Dầu và hóa chất khác'},
    {id: '15', headerName: 'Phụ kiện'},
    {id: '16', headerName: 'Phụ tùng sản phẩm không chính hiệu'},
    {id: '17', headerName: 'Phụ kiện sản phẩm không chính hiệu'},
    {id: '18', headerName: 'Mức độ hư hỏng'},
    {id: '19', headerName: 'Ghi chú'},
  ];

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private setModalHeight: SetModalHeightService,
  ) {
  }

  ngOnInit() {
  }

  onResize() {
    this.modalHeight = this.setModalHeight.onResize();
  }

  open() {
    this.buildForm();
    this.modal.show();
    this.onResize();
  }

  reset() {
    this.form = undefined;
  }

  save() {
    this.close.emit(this.form.value);
    this.modal.hide();
  }

  private buildForm() {
    const formControlName = {};

    for (const column of this.columns) {
      formControlName[column.id] = [false];
    }
    this.form = this.formBuilder.group(formControlName);
  }
}
