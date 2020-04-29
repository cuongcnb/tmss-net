import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NewPromotionModel } from '../../../core/models/new-infomation/new-promotion.model';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';
import { GridTableService } from '../../../shared/common-service/grid-table.service';
import { ValidateBeforeSearchService } from '../../../shared/common-service/validate-before-search.service';
import { NewInfomationApi } from '../../../api/new-infomation/new-infomation.api';
import { SetModalHeightService } from '../../../shared/common-service/set-modal-height.service';
import { LoadingService } from '../../../shared/loading/loading.service';
import { DataFormatService } from '../../../shared/common-service/data-format.service';
import { ToastService } from '../../../shared/swal-alert/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'regis-test-drive',
  templateUrl: './regis-test-drive.component.html',
  styleUrls: ['./regis-test-drive.component.scss'],
})
export class RegisTestDriveComponent implements OnInit {
  @ViewChild('registestDriveDetail', {static: false}) registestDriveDetail;
  form: FormGroup;
  fieldGrid;
  gridParams;
  params;
  data: any;
  selectedData: NewPromotionModel;

  constructor(
    private swalAlert: ToastService,
    private confirm: ConfirmService,
    private gridTableService: GridTableService,
    private validateBeforeSearchService: ValidateBeforeSearchService,
    private newInfomationApi: NewInfomationApi,
    private modalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private dataFormatService: DataFormatService,
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        cellRenderer: params => params.rowIndex + 1,
        minWidth: 50

      },
      {headerName: 'Mã Đkí', headerTooltip: 'Mã Đkí', field: 'mdki', minWidth: 110},
      {headerName: 'Tên ĐLý', headerTooltip: 'Tên ĐLý', field: 'name', minWidth: 110},
      {
        headerName: 'Đkí từ', headerTooltip: 'Đkí từ', field: 'date',
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        minWidth: 110
      },
      {
        headerName: 'Đến ngày', field: 'date',
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        minWidth: 110
      },
      {headerName: 'NV xác nhận', headerTooltip: 'NV xác nhận', field: 'tennv', minWidth: 110},
      {headerName: 'Người Đkí', headerTooltip: 'Người Đkí', field: 'tenkh', minWidth: 110},
      {headerName: 'Ngày sinh', headerTooltip: 'Ngày sinh', field: 'birthday', minWidth: 110, cellClass: ['cell-border', 'cell-readonly', 'text-right']},
      {headerName: 'Giới tính', headerTooltip: 'Giới tính', field: 'sex', minWidth: 110},
      {headerName: 'SĐT', headerTooltip: 'Số điện thoại', field: 'sdt', minWidth: 110, cellClass: ['cell-border', 'cell-readonly', 'text-right']},
      {headerName: 'Email', headerTooltip: 'Email', field: 'email', minWidth: 110},
      {
        headerName: 'Xác nhận ĐLÝ',
        headerTooltip: 'Xác nhận ĐLÝ',
        field: 'confirm',
        cellRenderer: params => params.data.status === 'Y' ? `Đã xác nhận` : 'Chưa xác nhận',
        minWidth: 110
      },
      {
        headerName: 'Xác nhận từ', headerTooltip: 'Xác nhận từ', field: 'date',
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        minWidth: 110
      },
      {
        headerName: 'Đến ngày', headerTooltip: 'Đến ngày', field: 'date',
        minWidth: 110,
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value),
      },
      {headerName: 'Loại xe', headerTooltip: 'Loại xe', field: 'typecar', minWidth: 110},
    ];
    this.data = [{}];
    this.buildForm();
  }

  reset() {
    this.form = undefined;
  }

  refresh() {
    this.selectedData = undefined;
    this.gridParams.api.setRowData(this.data);
  }

  addNewRegisTestDrive(data) {
    this.data.push(data);
    this.refresh();
  }

  editRegisTestDrive() {
    !!this.selectedData ? this.registestDriveDetail.open(this.selectedData) : this.swalAlert.openWarningToast('Bạn phải chọn 1 dòng');
  }

  updateRegisTestDrive(selectedData) {
    this.data = this.data.map(data => (data === this.selectedData ? selectedData : data));
    this.refresh();
  }

  deleteRegisTestDrive() {
    if (this.selectedData) {
      this.confirm.openConfirmModal('Question?', 'Bạn có muốn xóa dòng này?').subscribe(() => {
        this.data = this.data.filter(data => data !== this.selectedData);
        this.refresh();
      });
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
      statusConfirm: [undefined],
    });
  }
}
