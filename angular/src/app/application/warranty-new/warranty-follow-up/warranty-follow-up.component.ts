import {Component, OnInit, ViewChild, Input} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {WarrantyFollowUpModel} from '../../../core/models/warranty/warranty-follow-up.model';
import {LoadingService} from '../../../shared/loading/loading.service';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {GridTableService} from '../../../shared/common-service/grid-table.service';
import {DownloadService} from '../../../shared/common-service/download.service';
import {ValidateBeforeSearchService} from '../../../shared/common-service/validate-before-search.service';
import {WarrantyFollowUpApi} from '../../../api/warranty/warranty-follow-up.api';
import * as moment from 'moment';
import {DealerListService} from '../../../api/master-data/dealer-list.service';
import {SysUserApi} from '../../../api/system-admin/sys-user.api';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {ConfirmService} from '../../../shared/confirmation/confirm.service';
import {AgDatepickerRendererComponent} from '../../../shared/ag-datepicker-renderer/ag-datepicker-renderer.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'warranty-follow-up',
  templateUrl: './warranty-follow-up.component.html',
  styleUrls: ['./warranty-follow-up.component.scss']
})
export class WarrantyFollowUpComponent implements OnInit {
  @ViewChild('updateModal', {static: false}) updateModal;
  form: FormGroup;
  fieldGrid;
  params;
  selectedData: WarrantyFollowUpModel;
  data: Array<WarrantyFollowUpModel>;
  dlrList;
  paginationParams;
  paginationTotalsData: number;
  modelPicList;
  frameworkComponents;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private dataFormatService: DataFormatService,
    private gridTableService: GridTableService,
    private warrantyFollowUpApi: WarrantyFollowUpApi,
    private downloadService: DownloadService,
    private validateBeforeSearchService: ValidateBeforeSearchService,
    private dealerListService: DealerListService,
    private sysUserApi: SysUserApi,
    private confirmService: ConfirmService
  ) {

    this.frameworkComponents = {
      agDatepickerRendererComponent: AgDatepickerRendererComponent
    };

    this.fieldGrid = [
      {
        headerName: 'Model PIC',
        headerTooltip: 'Model PIC',
        field: 'modelPic',
        pinned: true,
        width: 40,
        resizable: true,
      },
      {
        headerName: 'SA Name',
        headerTooltip: 'SA Name',
        field: 'saName',
        pinned: true,
        width: 40,
        resizable: true,

      },
      {
        headerName: 'Plate No',
        headerTooltip: 'Plate No',
        field: 'plateNo',
        pinned: true,
        width: 40,
        resizable: true,
      },
      {
        headerName: 'DLR Name',
        headerTooltip: 'DLR Name',
        field: 'dlrName',
        pinned: true,
        width: 40,
        resizable: true,
      },
      {
        headerName: 'Model',
        headerTooltip: 'Model',
        field: 'model',
        pinned: true,
        width: 40,
        resizable: true,
      },
      {
        headerName: 'Problem',
        headerTooltip: 'Problem',
        field: 'problem',
        pinned: true,
        width: 150,
        resizable: true,
      },
      {
        headerName: 'Customer Complain Date',
        headerTooltip: 'Customer Complain Date',
        field: 'cusComplainDate',
        pinned: true,
        width: 60,
        resizable: true,
      },
      {
        headerName: 'DLR Judge Date',
        headerTooltip: 'DLR Judge Date',
        field: 'dlrJudgeDate',
        pinned: true,
        width: 60,
        resizable: true,
      },
      {
        headerName: 'Request TSD Date',
        headerTooltip: 'Request TSD Date',
        field: 'reqTSDDate',
        pinned: true,
        width: 60,
        resizable: true,
      },
      {
        headerName: 'Appoint. (For Gemba)',
        headerTooltip: 'Appoint. (For Gemba)',
        field: 'appForGemba',
        width: 60,
        resizable: true,
      },
      {
        headerName: 'TSD Judge Date',
        headerTooltip: 'TSD Judge Date',
        field: 'tsdJudgeDate',
        width: 60,
        resizable: true,
      },
      {
        headerName: 'DLR Order Part Date',
        headerTooltip: 'DLR Order Part Date',
        field: 'dlrOrderPartDate',
        width: 80,
        resizable: true,
      },
      {
        headerName: 'ETA Date',
        headerTooltip: 'ETA Date',
        field: 'etaDate',
        width: 60,
        resizable: true,
      },
      {
        headerName: 'Appoint. (for repair)',
        headerTooltip: 'Appoint. (for repair)',
        field: 'appForRepair',
        width: 60,
        resizable: true,
      },
      {
        headerName: 'Repair Finish Date',
        headerTooltip: 'Repair Finish Date',
        field: 'repairFinishDate',
        width: 60,
        resizable: true,
      },
      {
        headerName: 'Total LT',
        headerTooltip: 'Total LT',
        field: 'totalLT',
        width: 40,
        resizable: true,
      },
      {
        headerName: 'Angry Bird',
        headerTooltip: 'Angry Bird',
        field: 'angryBird',
        width: 40,
        resizable: true,
      },
      {
        headerName: 'Remark',
        headerTooltip: 'Remark',
        field: 'remark',
        width: 120,
        resizable: true,
      },
    ];
  }

  ngOnInit() {
    this.getDealerList();
    this.getUserTmv();
    this.buildForm();
  }

  private getDealerList() {
    this.loadingService.setDisplay(true);
    this.dealerListService.getAvailableDealers().subscribe(dealerList => {
      this.dlrList = dealerList;
      this.loadingService.setDisplay(false);
    },
      err => this.swalAlertService.openFailToast('Có lỗi xảy ra'));
  }

  private getUserTmv() {
    this.sysUserApi.getTMVUser().subscribe(
      val => this.modelPicList = val,
      err => this.swalAlertService.openFailToast('Có lỗi xảy ra')
    );
  }

  callbackGrid(params) {
    params.api.setRowData([]);
    this.params = params;
    this.search();
  }

  getParams() {
    const selectedData = this.params.api.getSelectedRows()[0];
    if (selectedData) {
      this.selectedData = selectedData;
    }
  }

  changePaginationParams(paginationParams) {
    if (!this.data) {
      return;
    }
    this.paginationParams = paginationParams;
    this.search();
  }

  search() {
    const searchData = this.form.getRawValue();
    this.selectedData = undefined;
    this.loadingService.setDisplay(true);
    this.warrantyFollowUpApi.getWarrantyFollowUp(searchData, this.paginationParams).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.data = res.list;
      this.paginationTotalsData = res.total;
      this.params.api.setRowData(this.data);
    });
  }

  delete() {
    this.confirmService.openConfirmModal('Bạn có chắc muốn xóa bản ghi được chọn').subscribe(res => {
      this.warrantyFollowUpApi.deleteWarrFollowUp(this.selectedData.id).subscribe(() => {
        this.params.api.updateRowData({remove: [this.selectedData]});
        this.refreshData();
        this.loadingService.setDisplay(false);
        this.swalAlertService.openSuccessToast();
      });
    });
  }

  exportExcel() {
    const paramsExport = {
      fileName: 'theo-doi-bao-hanh',
      sheetName: 'Theo dõi bảo hành',
      processHeaderCallback: params => params.column.getColDef().headerName,
      processCellCallback: params => {
        const field = params.column.getColDef().field;
        switch (field) {
          case 'cusComplainDate': case 'dlrJudgeDate': case 'reqTSDDate': case 'appointForRepair':
          case 'tsdJudgeDate': case 'dlrOrderPartDate': case 'etaDate': case 'appointForGemba':
            return !!params.value ? moment(params.value).format(moment.HTML5_FMT.DATETIME_LOCAL_MS) : '';
          default:
            return params.value;
        }
      }
    };
    this.params.api.exportDataAsExcel(paramsExport);
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      modelPicId: [null],
      dlrId: [null],
      cboReqTSD: [null],
      status: [null],
      fromDate: [null],
      toDate: [null],
      byLT: [null],
    });
  }

  refreshData() {
    this.selectedData = undefined;
    this.callbackGrid(this.params);
  }
}
