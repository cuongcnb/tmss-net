import {Component, OnInit, ViewChild} from '@angular/core';
import {SrvDRcJobsApi} from '../../../api/master-data/warranty/srv-d-rc-jobs.api';
import {JobGroupTypes} from '../../../core/constains/job-group-types';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {ConfirmService} from '../../../shared/confirmation/confirm.service';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'repair-job-master',
  templateUrl: './repair-job-master.component.html',
  styleUrls: ['./repair-job-master.component.scss']
})
export class RepairJobMasterComponent implements OnInit {
  @ViewChild('addUpdateJobModal', {static: false}) repairJobDetail;
  fieldGrid;
  selectData;
  param;
  data;
  paginationTotalsData;
  paginationParams;
  currentDlrId;
  form: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private srvDRcJobsApi: SrvDRcJobsApi,
              private toastService: ToastService,
              private confirmService: ConfirmService) {
    this.fieldGrid = [
      {headerName: 'TMV/Đại lý', headerTooltip: 'TMV/Đại lý', width: 100, field: 'dlrName'},
      {headerName: 'Mã CV', headerTooltip: 'Mã CV', width: 100, field: 'rccode'},
      {headerName: 'Tên CV', headerTooltip: 'Tên CV', field: 'rcname'},
      {
        field: 'internal', width: 60, cellClass: ['cell-border', 'cell-readonly', 'text-center'],
      },
      {
        headerName: 'Loại CV',
        headerTooltip: 'Loại CV',
        width: 100,
        field: 'jobgroup',
        cellClass: ['cell-border', 'cell-readonly'],
        cellRenderer: (params) => {
          if (params.value) {
            const data = JobGroupTypes.find(it => Number(it.id) === Number(params.value));
            return data ? data.name : '';
          }
          return;
        },
        filter: "agNumberColumnFilter"
      },
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'remark'}
    ];
  }

  ngOnInit() {
    this.buildForm();
    this.getAllListJob();
    this.currentDlrId = JSON.parse(localStorage.getItem('TMSS_Service_Current_User')).dealerId;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      searchKeyword: [undefined],
      isBp: [undefined]
    });
    this.form.get('isBp').valueChanges.subscribe(val => {
      this.getAllListJob();
    });
  }

  callbackGrid(param) {
    this.param = param;
  }

  getParams() {
    const selectedData = this.param.api.getSelectedRows();
    if (selectedData) {
      this.selectData = selectedData[0];
    }
  }

  onBtnDelete() {
    this.confirmService.openConfirmModal('Bạn có muốn xóa dòng này?').subscribe(() => {
      this.srvDRcJobsApi.deleteJob(this.selectData.id).subscribe(() => {
        this.toastService.openSuccessToast();
        this.getAllListJob();
      });
    });
  }

  getAllListJob() {
    const formValue = Object.assign({}, this.form.getRawValue(), {
      isBp: this.form.getRawValue().isBp === true ? 'Y' : 'N'
    });
    this.srvDRcJobsApi.getAllListJob(formValue, this.paginationParams).subscribe(res => {
      this.data = res && res.list ? res.list : [];
      if (this.param) {
        this.param.api.setRowData(this.data);
        this.param.api.sizeColumnsToFit(this.param);
      }
      this.paginationTotalsData = res && res.total ? res.total : 0;
    });
  }

  changePaginationParams(paginationParams) {
    if (!this.data) {
      return;
    }
    this.paginationParams = paginationParams;
    if (this.paginationParams.filters && this.paginationParams.filters.length == 0) this.getAllListJob();
  }
}
