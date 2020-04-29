import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {JobGroupModel} from '../../../../../core/models/catalog-declaration/job-group.model';
import {RepairJobModel} from '../../../../../core/models/catalog-declaration/repair-job.model';
import {LoadingService} from '../../../../../shared/loading/loading.service';
import {JobGroupTypes} from '../../../../../core/constains/job-group-types';
import {RepairJobApi} from '../../../../../api/common-api/repair-job.api';
import {RepairJobDetailApi} from '../../../../../api/common-api/repair-job-detail.api';
import {SetModalHeightService} from '../../../../../shared/common-service/set-modal-height.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'copy-job-from-group-job',
  templateUrl: './copy-job-from-group-job.component.html',
  styleUrls: ['./copy-job-from-group-job.component.scss']
})
export class CopyJobFromGroupJobComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  jobGroupTypes = JobGroupTypes;
  jobGroupTypeId: number;
  modalHeight: number;
  cmId;
  cfId;
  jobGroupGridField;
  jobGroupParams;
  jobGroupList: Array<JobGroupModel>;
  jobGroupSelected: JobGroupModel;

  repairJobGridField;
  repairJobParams;
  repairJobList: Array<RepairJobModel>;
  repairJobSelected: Array<RepairJobModel>;

  constructor(
    private loading: LoadingService,
    private setModalHeight: SetModalHeightService,
    private repairJobApi: RepairJobApi,
    private repairJobDetailApi: RepairJobDetailApi
  ) {
  }

  ngOnInit() {
    this.jobGroupGridField = [
      {headerName: 'Mã gói CV', headerTooltip: 'Mã gói CV', field: 'gjCode'},
      {headerName: 'Tên gói CV', headerTooltip: 'Tên gói CV', field: 'gjName'},
      {
        headerName: 'Nhóm', headerTooltip: 'Nhóm', field: 'jobType',
        valueFormatter: params => {
          const matchVal = this.jobGroupTypes.find(type => type.id === params.value);
          return matchVal ? matchVal.name : '';
        }
      },
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'remark'}
    ];
    this.repairJobGridField = [
      {headerName: '', headerTooltip: '', field: 'checked', editable: true, checkboxSelection: true, width: 100},
      {headerName: 'Mã CV', headerTooltip: 'Mã CV', field: 'rccode'},
      {headerName: 'Tên CV', headerTooltip: 'Tên CV', field: 'rcname'},
      {headerName: 'Ghi chú', headerTooltip: 'Ghi chú', field: 'remark'}
    ];
  }

  onResize() {
    this.modalHeight = this.setModalHeight.onResize();
  }

  open(cmId, cfId, deleteFlag) {
    this.cmId = cmId;
    this.cfId = cfId;
    this.getJobGroup(cmId, cfId, deleteFlag);
    this.modal.show();
  }

  reset() {
    this.jobGroupList = undefined;
    this.jobGroupSelected = undefined;
    this.repairJobList = undefined;
    this.repairJobSelected = undefined;
  }

  choose() {
    this.close.emit(this.repairJobSelected);
    this.modal.hide();
  }

  callbackGridJG(params) {
    params.api.setRowData();
    this.jobGroupParams = params;
  }

  getParamsJG() {
    const selectedData = this.jobGroupParams.api.getSelectedRows();
    if (selectedData) {
      this.jobGroupSelected = selectedData[0];
      this.repairJobList = undefined;
      this.repairJobSelected = undefined;
      this.getRepairJobByGroup(this.jobGroupSelected.id);
    }
  }

  callbackGridRJ(params) {
    params.api.setRowData();
    this.repairJobParams = params;
  }

  getParamsRJ() {
    const selectedData = this.repairJobParams.api.getSelectedRows();
    if (selectedData) {
      this.repairJobSelected = selectedData;
    }
  }

  private getJobGroup(cmId, cfId, deleteFlag) {
    this.loading.setDisplay(true);
    const obj = {
      cfId,
      cmId,
      deleteFlag
    };
    this.repairJobApi.searchJobsGroup(obj).subscribe(jobGroup => {
      this.jobGroupList = jobGroup || [];
      this.loading.setDisplay(false);
      if (this.jobGroupParams) {
        this.jobGroupParams.api.setRowData(this.jobGroupList);
      }
    });
  }

  private getRepairJobByGroup(id) {
    // get Repair job by job group
    const obj = {
      cfId: this.cfId,
      cmId: this.cmId,
      id
    };
    this.loading.setDisplay(true);
    this.repairJobApi.getJobsGroupDetail(obj)
      .subscribe(repairJob => {
        this.repairJobList = repairJob || [];
        this.loading.setDisplay(false);
        this.repairJobParams.api.setRowData(this.repairJobList);
      });
  }
}
