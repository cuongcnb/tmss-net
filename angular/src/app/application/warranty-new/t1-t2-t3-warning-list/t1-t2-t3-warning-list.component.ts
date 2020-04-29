import {Component, OnInit, ViewChild} from '@angular/core';
import {LoadingService} from '../../../shared/loading/loading.service';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {FormBuilder} from '@angular/forms';
import {GridTableService} from '../../../shared/common-service/grid-table.service';
import {ConfirmService} from '../../../shared/confirmation/confirm.service';
import {TcodeWarningApi} from '../../../api/warranty/tcode-warning.api';

@Component({
  selector: 't1-t2-t3-warning-list',
  templateUrl: './t1-t2-t3-warning-list.component.html',
  styleUrls: ['./t1-t2-t3-warning-list.component.scss']
})
export class T1T2T3WarningListComponent implements OnInit {

  @ViewChild('updateModal', {static: false}) updateModal;
  params;
  selectedData;
  data;
  gridField;
  frameworkComponents;

  constructor(
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private formBuilder: FormBuilder,
    private gridTableService: GridTableService,
    private confirmService: ConfirmService,
    private tcodeWarningApi: TcodeWarningApi
  ) {
    this.gridField = [
      {
        headerName: 'TCode Type',
        headerTooltip: 'TCode Type',
        field: 'tcodeType',
        width: 150,
        resizable: true,
        pinned: true
      },
      {
        headerName: 'Name',
        headerTooltip: 'Name',
        field: 'tcode',
        width: 200,
        resizable: true,
        pinned: true
      },
      {
        headerName: 'Remark',
        headerTooltip: 'Remark',
        field: 'description',
        width: 600,
        resizable: true,
        pinned: true
      },
      {
        headerName: 'Is In Use',
        headerTooltip: 'Is In Use',
        field: 'isInUse',
        width: 150,
        cellRenderer: params => params.data.isInUse === 'Y' ? 'Enable' : 'Disable',
        resizable: true,
        pinned: true
      },
    ];
  }

  ngOnInit() {
  }

  callbackGrid(params) {
    params.api.setRowData([]);
    this.params = params;
    this.callApi();
  }
  callApi() {
    this.tcodeWarningApi.getTCodeWarning().subscribe(val => {
      this.data = val;
      this.params.api.setRowData(this.data);
    });
  }

  getParams() {
    this.selectedData = this.params.api.getSelectedRows()[0];
  }

  refreshData() {
    this.selectedData = undefined;
    this.callbackGrid(this.params);
  }

  delete() {
    this.confirmService.openConfirmModal('Bạn có chắc muốn xóa bản ghi được chọn').subscribe(res => {
      this.tcodeWarningApi.deleteTCodeWarning(this.selectedData.id).subscribe(() => {
        this.params.api.updateRowData({remove: [this.selectedData]});
        this.refreshData();
        this.loadingService.setDisplay(false);
        this.swalAlertService.openSuccessToast();
      });
    });
  }
}
