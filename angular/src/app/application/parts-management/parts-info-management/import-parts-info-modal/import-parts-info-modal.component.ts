import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { PartsInfoManagementApi } from '../../../../api/parts-management/parts-info-management.api';
import { PartImportedModel } from '../../../../core/models/parts-management/parts-info-management.model';
import { DataFormatService } from '../../../../shared/common-service/data-format.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'import-parts-info-modal',
  templateUrl: './import-parts-info-modal.component.html',
  styleUrls: ['./import-parts-info-modal.component.scss'],
})
export class ImportPartsInfoModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('fileInput', {static: false}) fileInput: ElementRef;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  modalHeight: number;
  processingInfo: Array<string> = [];

  fieldGrid;
  params;
  uploadedData: Array<PartImportedModel>;


  constructor(
    private formBuilder: FormBuilder,
    private setModalHeightService: SetModalHeightService,
    private dataFormatService: DataFormatService,
    private swalAlertService: ToastService,
    private partsInfoManagementApi: PartsInfoManagementApi,
  ) {
    this.fieldGrid = [
      {
        headerName: '',
        headerTooltip: '',
        children: [
          {
            headerName: 'STT',
            headerTooltip: 'Số thứ tự',
            field: 'stt',
          },
          {
            headerName: 'Mã ĐL',
            headerTooltip: 'Mã đại lý',
            field: 'dlrName',
          },
          {
            headerName: 'Loại PT',
            headerTooltip: 'Loại phụ tùng',
            field: 'partsTypeName',
          },
          {
            headerName: 'Mã PT',
            headerTooltip: 'Mã phụ tùng',
            field: 'partsCode',
          },
          {
            headerName: 'Tên PT',
            headerTooltip: 'Tên phụ tùng',
            valueGetter: params => {
               return params.data && params.data.partsNameVn && !!params.data.partsNameVn
                 ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '' ;
            },
          },
        ],
      },
      {
        headerName: 'Bán',
        headerTooltip: 'Bán',
        children: [
          {
            headerName: 'Giá mua',
            headerTooltip: 'Giá mua',
            field: 'price',
            tooltip: params => this.dataFormatService.moneyFormat(params.value),
            valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
            cellClass: ['cell-readonly', 'text-right', 'cell-border'],
          },
          {
            headerName: 'ĐVT',
            headerTooltip: 'Đơn vị tính',
            field: 'unit',
          },
        ],
      },
      {
        headerName: 'Mua',
        headerTooltip: 'Mua',
        children: [
          {
            headerName: 'Giá bán',
            headerTooltip: 'Giá bán',
            field: 'sellPrice',
            tooltip: params => this.dataFormatService.moneyFormat(params.value),
            valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
            cellClass: ['cell-readonly', 'text-right', 'cell-border'],
          },
          {
            headerName: 'ĐVT',
            headerTooltip: 'Đơn vị tính',
            field: 'sellUnit',
          },
        ],
      },
      {
        headerName: '',
        headerTooltip: '',
        children: [
          {
            headerName: 'Nhà CC',
            headerTooltip: 'Nhà CC',
            field: 'supplier',
          },
        ],
      },
      {
        headerName: 'FOB',
        headerTooltip: 'FOB',
        children: [
          {
            headerName: 'Giá FOB',
            headerTooltip: 'Giá FOB',
            field: 'fobPrice',
            tooltip: params => this.dataFormatService.moneyFormat(params.value),
            valueFormatter: params => this.dataFormatService.moneyFormat(params.value),
            cellClass: ['cell-readonly', 'text-right', 'cell-border'],
          },
          {
            headerName: 'ĐVT',
            headerTooltip: 'Đơn vị tính',
            field: 'fobUnit',
          },
        ],
      },
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

  closeModal() {
    this.modal.hide();
    this.close.emit();
  }

  reset() {
    this.processingInfo = [];
    this.params.api.setRowData([]);
  }

  apiCallUpload(val) {
    return this.partsInfoManagementApi.importPartsInfo(val);
  }

  uploadSuccess(response) {
    this.uploadedData = response.Success;
    this.params.api.setRowData(this.addStt(this.uploadedData));
    this.processingInfo = ['Import dữ liệu thành công'];
  }

  uploadFail(error) {
    this.processingInfo = error;
  }

  addStt(dataList: Array<PartImportedModel>) {
    const returnList: Array<PartImportedModel> = [];
    for (let i = 0; i < dataList.length; i++) {
      dataList[i] = Object.assign({}, dataList[i], {stt: i + 1});
      returnList.push(dataList[i]);
    }
    return returnList;
  }

  callBackGrid(params) {
    this.params = params;
  }
}
