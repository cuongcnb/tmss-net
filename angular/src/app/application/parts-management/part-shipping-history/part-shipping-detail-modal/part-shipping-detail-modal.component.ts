import {Component, OnInit, ViewChild} from '@angular/core';
import {SetModalHeightService} from '../../../../shared/common-service/set-modal-height.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap';
import {PartShippingHistoryApi} from '../../../../api/parts-management/part-shipping-history.api';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {
  PartShippingHistoryDetailModel,
  PartShippingHistoryModel
} from '../../../../core/models/parts-management/part-shipping-history.model';
import {DataFormatService} from '../../../../shared/common-service/data-format.service';
import {GridTableService} from '../../../../shared/common-service/grid-table.service';

import {StatusColor, StatusColorLabel} from '../../status-color.enum';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'part-shipping-detail-modal',
  templateUrl: './part-shipping-detail-modal.component.html',
  styleUrls: ['./part-shipping-detail-modal.component.scss']
})
export class PartShippingDetailModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  modalHeight: number;
  form: FormGroup;

  fieldGrid;
  params;
  selectedShippingData;
  shippingHistoryDetail: PartShippingHistoryDetailModel;
  totalPriceBeforeTax;
  taxOnly;
  totalPriceIncludeTax;

  constructor(
    private setModalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private partShippingHistoryApi: PartShippingHistoryApi,
    private dataFormatService: DataFormatService,
    private gridTableService: GridTableService
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        field: 'stt',
        width: 30
      },
      {
        headerName: 'Thời gian xuất',
        headerTooltip: 'Thời gian xuất',
        field: 'shippingDate',
        width: 90,
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value)
      },
      {
        headerName: 'Loại PT',
        headerTooltip: 'Loại phụ tùng',
        field: 'partTypeLabel',
        width: 80
      },
      {
        headerName: 'Mã PT',
        headerTooltip: 'Mã phụ tùng',
        field: 'partCode',
        width: 70
      },
      {
        headerName: 'Tên PT',
        headerTooltip: 'Tên phụ tùng',
        field: 'partName'
      },
      {
        headerName: 'SL',
        headerTooltip: 'Số lượng',
        field: 'qty',
        width: 30,
        tooltip: params => this.dataFormatService.numberFormat(params.value),
        valueFormatter: params => this.dataFormatService.numberFormat(params.value),
        cellClass: ['cell-border', 'cell-readonly', 'text-right']
      },
      {
        headerName: 'Giá bán',
        headerTooltip: 'Giá bán',
        field: 'sellPrice',
        width: 60,
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
        cellClass: ['cell-border', 'cell-readonly', 'text-right']
      },
      {
        headerName: 'Thành tiền',
        headerTooltip: 'Thành tiền',
        field: 'amountBeforeTax',
        width: 80,
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
        cellClass: ['cell-border', 'cell-readonly', 'text-right']
      },
      {
        headerName: 'Thuế',
        headerTooltip: 'Thuế',
        field: 'tax',
        width: 30,
        cellClass: ['cell-border', 'cell-readonly', 'text-right']
      },
      {
        headerName: 'Trạng thái',
        headerTooltip: 'Trạng thái',
        field: 'statusLabel',
        width: 70,
        cellStyle: params => {
          const status = this.getStatusLabel(params.data.shippingStatus, params.data.prepickStatus);
          const colors = {
            STATUS_PREPICK: {backgroundColor: `${StatusColor.PREPICK} !important`, color: '#000 !important'},
            STATUS_PREPICK_OLD: {backgroundColor: `${StatusColor.PREPICK_OLD} !important`, color: '#000 !important'},
            STATUS_CANCEL_PREPICK: {backgroundColor: `${StatusColor.CANCEL_PREPICK} !important`, color: '#000 !important'},
            STATUS_CANCEL_PREPICK_OLD: {backgroundColor: `${StatusColor.CANCEL_PREPICK_OLD} !important`, color: '#000 !important'},
            STATUS_COMPLETE: {backgroundColor: `${StatusColor.COMPLETE} !important`, color: '#000 !important'},
            STATUS_RETURN: {backgroundColor: `${StatusColor.RETURN} !important`, color: '#000 !important'}
          };
          return colors[status];
        }
      }
    ];
  }

  getStatusLabel(shippingStatus, prepickStatus) {
    let status;
    if (shippingStatus === 0 && prepickStatus === 0) {
      status = StatusColorLabel.PREPICK;
    } else if (shippingStatus === 0 && prepickStatus === 1) {
      status = StatusColorLabel.PREPICK_OLD;
    } else if (shippingStatus === 4 && prepickStatus === 0) {
      status = StatusColorLabel.CANCEL_PREPICK;
    } else if ((shippingStatus === 3 && prepickStatus === 1) || shippingStatus === 4 && prepickStatus === 1) {
      status = StatusColorLabel.CANCEL_PREPICK_OLD;
    } else if ((shippingStatus === 3 && prepickStatus === 0) || shippingStatus === 0 && prepickStatus === 2) {
      status = StatusColorLabel.COMPLETE;
    } else if (shippingStatus === 2) {
      status = StatusColorLabel.RETURN;
    }
    return status;
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  open(selectedShippingData: PartShippingHistoryModel) {
    this.selectedShippingData = selectedShippingData;
    this.modal.show();
    this.buildForm();
  }

  getDetail(selectedShippingData) {
    this.loadingService.setDisplay(true);
    this.partShippingHistoryApi.getDetail(selectedShippingData.reqType, selectedShippingData.reqId).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.shippingHistoryDetail = res;
      this.form.patchValue(this.shippingHistoryDetail.partsShippingHistoryDetailInfoDTO);
      this.form.get('phone').setValue(selectedShippingData ? selectedShippingData.phone : null);
      this.params.api.setRowData(this.shippingHistoryDetail.partsShippingHistoryDetailPartsDTOs);
      this.calculateFooterDetail();
    });
  }

  reset() {
    this.form = undefined;
    this.shippingHistoryDetail.partsShippingHistoryDetailInfoDTO = undefined;
    this.shippingHistoryDetail.partsShippingHistoryDetailPartsDTOs = [];
    this.calculateFooterDetail();
  }

  callBackGrid(params) {
    this.params = params;
    if (this.selectedShippingData) {
      this.getDetail(this.selectedShippingData);
    }
  }

  calculateFooterDetail() {
    let beforeTax = 0;
    let tax = 0;
    let taxIncluded = 0;
    this.shippingHistoryDetail.partsShippingHistoryDetailPartsDTOs.forEach(data => {
      beforeTax += data.amountBeforeTax;
      tax += data.amountBeforeTax * (data.tax / 100);
      taxIncluded += data.amountBeforeTax + data.amountBeforeTax * (data.tax / 100);
    });
    this.totalPriceBeforeTax = this.dataFormatService.moneyFormat(beforeTax);
    this.taxOnly = this.dataFormatService.moneyFormat(tax);
    this.totalPriceIncludeTax = this.dataFormatService.moneyFormat(taxIncluded);
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      reqTypeLabel: [{value: undefined, disabled: true}],
      code: [{value: undefined, disabled: true}],
      vehicleNo: [{value: undefined, disabled: true}],
      cusName: [{value: undefined, disabled: true}],
      phone: [{value: undefined, disabled: true}],
      taxNumber: [{value: undefined, disabled: true}],
      cusAddress: [{value: undefined, disabled: true}]
    });
  }

}
