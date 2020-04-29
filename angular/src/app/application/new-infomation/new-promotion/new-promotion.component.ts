import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetModalHeightService } from '../../../shared/common-service/set-modal-height.service';
import { NewPromotionModel } from '../../../core/models/new-infomation/new-promotion.model';
import { DataFormatService } from '../../../shared/common-service/data-format.service';
import { LoadingService } from '../../../shared/loading/loading.service';
import { NewInfomationApi } from '../../../api/new-infomation/new-infomation.api';
import { ValidateBeforeSearchService } from '../../../shared/common-service/validate-before-search.service';
import { GridTableService } from '../../../shared/common-service/grid-table.service';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';
import { ToastService } from '../../../shared/swal-alert/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'new-promotion',
  templateUrl: './new-promotion.component.html',
  styleUrls: ['./new-promotion.component.scss'],
})
export class NewPromotionComponent implements OnInit {
  @ViewChild('newPromotionDetail', {static: false}) newPromotionDetail;
  form: FormGroup;
  fieldGrid;
  gridParams;
  params;
  data: any;
  paginationParams;
  paginationTotalsData: number;
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
        cellClass: ['cell-border', 'cell-readonly', 'text-right']
      },
      {headerName: 'Tên kiểu', headerTooltip: 'Tên kiểu', field: 'NewsType', cellClass: ['cell-border', 'cell-readonly', 'text-right']},
      {headerName: 'Tiêu đề', headerTooltip: 'Tiêu đề', field: 'title', cellClass: ['cell-border', 'cell-readonly', 'text-right']},
      {headerName: 'Nội dung', headerTooltip: 'Nội dung', field: 'content'},
      {
        headerName: 'Ngày đăng', headerTooltip: 'Ngày đăng', field: 'times',
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value),
      },
      {headerName: 'Đại lý đăng tin', headerTooltip: 'Đại lý đăng tin', field: 'enName'},
      {
        headerName: 'Trạng thái duyệt',
        headerTooltip: 'Trạng thái duyệt',
        field: 'newsStatus',
        cellRenderer: params => params.data.status === 'Y' ? `Đã duyệt` : 'Chưa duyệt',
      },
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

  addNewPromotion(data) {
    this.data.push(data);
    this.refresh();
  }

  editNewPromotion() {
    if (this.selectedData) {
      this.newPromotionDetail.open(this.selectedData);
    } else {
      this.swalAlert.openWarningToast('Bạn phải chọn 1 dòng');
    }
  }

  updateNewPromotion(selectedData) {
    this.data = this.data.map(data => {
      return data === this.selectedData ? selectedData : data;
    });
    this.refresh();
  }

  deleteNewPromotion() {
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

  search() {
    this.loadingService.setDisplay(true);
    this.newInfomationApi.findAll().subscribe(res => {
      this.loadingService.setDisplay(false);
      this.params.api.setRowData(this.gridTableService.addSttToData(this.selectedData));
      this.gridTableService.selectFirstRow(this.params);
    });
  }


  private buildForm() {
    this.form = this.formBuilder.group({
      searchInfo: [undefined],
    });
  }
}
