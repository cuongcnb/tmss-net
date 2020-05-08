import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { isEqual } from 'lodash';

import { LoadingService } from '../../../shared/loading/loading.service';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { DataFormatService } from '../../../shared/common-service/data-format.service';
import { GridTableService } from '../../../shared/common-service/grid-table.service';
import { BoOrderFollowupApi } from '../../../api/parts-management/bo-order-followup.api';
import { CurrentUserModel } from '../../../core/models/base.model';
import { BoPartsFollowupCvdvModel } from '../../../core/models/parts-management/bo-parts-followup-cvdv.model';
import { AgCheckboxRendererComponent } from '../../../shared/ag-checkbox-renderer/ag-checkbox-renderer.component';
import { DownloadService } from '../../../shared/common-service/download.service';
import {ValidateBeforeSearchService} from '../../../shared/common-service/validate-before-search.service';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'bo-order-followup-cvdv',
  templateUrl: './bo-order-followup-cvdv.component.html',
  styleUrls: ['./bo-order-followup-cvdv.component.scss'],
})
export class BoOrderFollowupCvdvComponent extends AppComponentBase implements OnInit {
  @ViewChild('detailModal', {static: false}) detailModal;
  @ViewChild('editModal', {static: false}) editModal;
  form: FormGroup;
  // currentUser: CurrentUserModel = CurrentUser;

  fieldGrid;
  params;
  selectedBo: BoPartsFollowupCvdvModel;
  data: Array<BoPartsFollowupCvdvModel>;
  paginationTotalsData: number;
  paginationParams;
  frameworkComponents;

  // oldFormValue: object;

  constructor(
    injector: Injector,
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private dataFormatService: DataFormatService,
    private gridTableService: GridTableService,
    private boOrderFollowupApi: BoOrderFollowupApi,
    private downloadService: DownloadService,
    private validateBeforeSearchService: ValidateBeforeSearchService,
  ) {
    super(injector);
  }

  ngOnInit() {
    this.buildForm();
    this.frameworkComponents = {
      agCheckboxRendererComponent: AgCheckboxRendererComponent,
    };
    this.fieldGrid = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        field: 'stt',
        width: 100,
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'}
      },
      {
        headerName: 'Số lệnh sửa chữa',
        headerTooltip: 'Số lệnh sửa chữa',
        field: 'soRo',
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'}
      },
      {
        headerName: 'Số ngày pending',
        headerTooltip: 'Số ngày pending',
        field: 'pendingDay',
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'}
      },
      {
        headerName: 'Biển số',
        headerTooltip: 'Biển số',
        field: 'bienSoXe',
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'}
      },
      {
        headerName: 'Cố vấn dịch vụ',
        headerTooltip: 'Cố vấn dịch vụ',
        field: 'tenCvdv',
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'}
      },
      {
        headerName: 'ETA tiêu chuẩn',
        headerTooltip: 'ETA tiêu chuẩn',
        field: 'standardEta',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'}
      },
      {
        headerName: 'ETA1',
        headerTooltip: 'ETA1',
        field: 'eta1',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'}
      },
      {
        headerName: 'ETA2',
        headerTooltip: 'ETA2',
        field: 'eta2',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'}
      },
      {
        headerName: 'CVDV đã liên hệ khách',
        headerTooltip: 'CVDV đã liên hệ khách',
        field: 'checkIsAlreadyContact',
        cellRenderer: 'agCheckboxRendererComponent',
        disableCheckbox: true,
        width: 100,
      },
      {
        headerName: 'ATA đại lý',
        headerTooltip: 'ATA đại lý',
        field: 'ata',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'}
      },
      {
        headerName: 'Ngày liên hệ',
        headerTooltip: 'Ngày liên hệ',
        field: 'contactDate',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'}
      },
      {
        headerName: 'Thời gian hẹn khách',
        headerTooltip: 'Thời gian hẹn khách',
        field: 'thoigianHen',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'}
      },
      {
        headerName: 'Thời gian chưa hẹn khách',
        headerTooltip: 'Thời gian chưa hẹn khách',
        field: 'thoigianChuahen',
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'}
      },
      {
        headerName: 'Thời gian lưu kho PT',
        headerTooltip: 'Thời gian lưu kho PT',
        field: 'calPtQuahan',
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'}
      },
      {
        headerName: 'Xe trong xưởng',
        headerTooltip: 'Xe trong xưởng',
        field: 'checkIsInShop',
        cellRenderer: 'agCheckboxRendererComponent',
        disableCheckbox: true,
        width: 100,
      },
      {
        headerName: 'Ghi chú (TMV)',
        headerTooltip: 'Ghi chú (TMV)',
        field: 'reasonDelay',
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'}
      },
      {
        headerName: 'Ghi chú (DLR)',
        headerTooltip: 'Ghi chú (DLR)',
        field: 'dailyGhichu',
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'}
      },
      {
        headerName: 'Theo dõi đặc biệt',
        headerTooltip: 'Theo dõi đặc biệt',
        field: 'isSpecialFollowUp',
        width: 50,
        cellStyle: params => (params.data && params.colDef && params.data.delayFields && params.data.delayFields.includes(params.colDef.field))
          ? {backgroundColor: '#ff7f7f !important'} : {backgroundColor: '#F5F5F5'}
      },
    ];
  }

  callbackGrid(params) {
    this.params = params;
    // this.searchDataAndTotal(this.oldFormValue);
  }

  getParams(params) {
    const selectedNode = params.api.getSelectedNodes();
    if (selectedNode) {
      this.selectedBo = selectedNode[0].data;
    }
  }

  changePaginationParams(paginationParams) {
    if (!this.data) {
      return;
    }
    this.paginationParams = paginationParams;
    // this.searchData(this.oldFormValue);
    this.searchData(this.form.value, false);
  }

  search() {
    // if (isEqual(this.form.value, this.oldFormValue)) {
    //   this.searchData(this.oldFormValue);
    // } else {
    //   this.searchDataAndTotal(this.oldFormValue);
    //   this.oldFormValue = this.form.value;
    // }
    this.searchData(this.form.value, true);
  }

  private searchData(formValue, isReload) {
    this.loadingService.setDisplay(true);
    this.boOrderFollowupApi.searchPartForCvdv(this.validateBeforeSearchService.setBlankFieldsToNull(formValue), isReload, this.paginationParams).subscribe(data => {
      this.data = data.list;
      this.paginationTotalsData = data.total;
      this.params.api.setRowData(this.gridTableService.addSttToData(this.data));
      this.loadingService.setDisplay(false);
      const allColumnIds = [];
      this.params.columnApi.getAllColumns().forEach((column) => allColumnIds.push(column.colId));
      setTimeout(() => {
        this.params.columnApi.autoSizeColumns(allColumnIds);
      });
    });
  }

  // private searchDataAndTotal(formValue) {
  //   this.loadingService.setDisplay(true);
  //   forkJoin([
  //     this.boOrderFollowupApi.searchPartForCvdv(formValue, this.paginationParams),
  //     this.boOrderFollowupApi.searchCountForCvdv(formValue, this.paginationParams),
  //   ]).subscribe(res => {
  //     this.loadingService.setDisplay(false);
  //     this.data = res[0];
  //     this.paginationTotalsData = res[1];
  //     this.params.api.setRowData(this.gridTableService.addSttToData(this.data));
  //   });
  // }

  editBo() {
    if (!this.selectedBo) {
      this.swalAlertService.openWarningToast('Bạn chưa chọn đơn hàng, hãy chọn ít nhất một đơn hàng để cập nhật', 'Cảnh báo');
      return;
    }
    this.editModal.open(this.selectedBo);
  }

  deleteBo() {
    this.loadingService.setDisplay(true);
    this.boOrderFollowupApi.deleteBoFollow(this.selectedBo.reqId).subscribe(() => {
      this.swalAlertService.openSuccessToast();
      this.search();
      this.loadingService.setDisplay(false);
    });
  }

  exportExcel() {
    this.loadingService.setDisplay(true);
    this.boOrderFollowupApi.exportDataCvdv().subscribe(data => {
      this.loadingService.setDisplay(false);
      this.downloadService.downloadFile(data);
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      orderNo: [undefined],
      dlrId: [this.currentUser.dealerId],
      plateNo: [undefined],
      advisor: [undefined],
      today: [{value: this.dataFormatService.parseTimestampToDate(new Date().getTime()), disabled: true}],
    });
    // this.oldFormValue = new Object(this.form.value);
  }
}
