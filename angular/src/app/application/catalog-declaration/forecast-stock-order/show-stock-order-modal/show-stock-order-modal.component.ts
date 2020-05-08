import { Component, EventEmitter, OnInit, Output, ViewChild, Injector } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { ForecastOrderModel } from '../../../../core/models/catalog-declaration/forecast-order.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'show-stock-order-modal',
  templateUrl: './show-stock-order-modal.component.html',
  styleUrls: ['./show-stock-order-modal.component.scss'],
})
export class ShowStockOrderModalComponent extends AppComponentBase implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedList: Array<ForecastOrderModel>;
  modalHeight: number;
  form: FormGroup;
  // currentUser = CurrentUser;
  gridField;
  gridParams;

  constructor(
    injector: Injector,
    private formBuilder: FormBuilder,
    private modalHeightService: SetModalHeightService,
  ) {
    super(injector);
  }

  ngOnInit() {
    this.onResize();
    this.gridField = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        cellRenderer: params => params.rowIndex + 1,
      },
      {
        headerName: 'Mã phụ tùng',
        headerTooltip: 'Mã phụ tùng',
        field: 'partCode',
      },
      {
        headerName: 'Tên phụ tùng',
        headerTooltip: 'Tên phụ tùng',
        field: 'partName',
      },
      {
        headerName: 'Đơn vị tính',
        headerTooltip: 'Đơn vị tính',
        field: 'unit',
      },
      {
        headerName: 'Số lượng',
        headerTooltip: 'Số lượng',
        field: 'amount',
      },
      {
        headerName: 'Đơn giá',
        headerTooltip: 'Đơn giá',
        field: 'price',
      },
      {
        headerName: 'Thành tiền',
        headerTooltip: 'Thành tiền',
        field: 'total',
      },
      {
        headerName: 'Thuế',
        headerTooltip: 'Thuế',
        field: 'tax',
      },
    ];
  }

  callbackGrid(params) {
    params.api.setRowData();
    this.gridParams = params;
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  open(selectList) {
    this.selectedList = selectList;
    this.buildForm();
    this.modal.show();
    this.gridParams.api.setRowData(selectList);
  }

  reset() {
    this.selectedList = undefined;
    this.form = undefined;
  }

  save() {
    this.close.emit();
    this.modal.hide();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      invoiceNo: [undefined],
      invoiceDate: [new Date()],
      invoicePerson: [this.currentUser.dealerName],
    });
  }
}
