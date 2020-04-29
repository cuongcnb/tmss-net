import {Component, OnInit, ViewChild} from '@angular/core';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {LoadingService} from '../../../shared/loading/loading.service';
import {ConfirmService} from '../../../shared/confirmation/confirm.service';
import {WarrCheckWmiApi} from '../../../api/warranty/warr-check-wmi.api';
import {FormBuilder, FormGroup} from '@angular/forms';
import { FileUploader} from 'ng2-file-upload';

@Component({
  selector: 'warranty-check-wmi',
  templateUrl: './warranty-check-wmi.component.html',
  styleUrls: ['./warranty-check-wmi.component.scss']
})
export class WarrantyCheckWmiComponent implements OnInit {
  @ViewChild('updateModal', {static: false}) updateModal;
  @ViewChild('importModal', {static: false}) importModal;
  uploader: FileUploader;
  fieldGrid;
  frameworkComponents;
  params;
  selectedData;
  data;
  paginationParams;
  paginationTotalsData: number;
  form: FormGroup;
  processingInfo = undefined;
  partsParams;
  partsList;
  saveStatus = false;

  constructor(
    private swalAlertService: ToastService,
    private warrCheckWmiApi: WarrCheckWmiApi,
    private loadingService: LoadingService,
    private confirmService: ConfirmService,
    private formBuilder: FormBuilder
  ) {
    this.fieldGrid = [
      {
        headerName: 'WMI',
        headerTooltip: 'WMI',
        field: 'wmi',
        pinned: true,
        width: 200,
        cellClass: ['cell-border'],
        resizable: true,
        textAlign: 'center'
      },
      {
        headerName: 'VDS',
        headerTooltip: 'VDS',
        field: 'vds',
        pinned: true,
        width: 200,
        cellClass: ['cell-border'],
        resizable: true,
        textAlign: 'center'
      },
      {
        headerName: 'JOBSCODE',
        headerTooltip: 'PIC',
        field: 'jobsCode',
        pinned: true,
        width: 300,
        cellClass: ['cell-border'],
        resizable: true,
      },
      {
        headerName: 'Work Rate',
        headerTooltip: 'Work Rate',
        field: 'workRate',
        pinned: true,
        width: 200,
        resizable: true,
      }
    ];
  }

  ngOnInit() {
    this.buildForm();
  }

  callbackGrid(params) {
    params.api.setRowData([]);
    this.params = params;
    this.search();
  }

  refreshData() {
    this.selectedData = undefined;
    this.callbackGrid(this.params);
  }

  getParams() {
    this.selectedData = this.params.api.getSelectedRows()[0];
  }

  delete() {
    this.confirmService.openConfirmModal('Bạn có chắc muốn xóa bản ghi được chọn').subscribe(res => {
      this.warrCheckWmiApi.removeWarrCheckWmi(this.selectedData.id).subscribe(() => {
        this.params.api.updateRowData({remove: [this.selectedData]});
        this.refreshData();
        this.loadingService.setDisplay(false);
        this.swalAlertService.openSuccessToast();
      });
    });
  }

  search() {
    const data = this.form.getRawValue();
    this.warrCheckWmiApi.getWarrCheckWmi(data, this.paginationParams).subscribe(
      val => {
        this.data = val.list;
        this.paginationTotalsData = val.total;
        this.params.api.setRowData(this.data);
      }
    );
  }

  changePaginationParams(paginationParams) {
    if (!this.data) {
      return;
    }
    this.paginationParams = paginationParams;
    this.search();
  }

  apiCallUpload(val) {
    return this.warrCheckWmiApi.import(val);
  }

  uploadSuccess(data) {
    this.processingInfo = undefined;
    const list = data.Success;
    this.importModal.open(list);
  }

  uploadFail(data) {
    this.swalAlertService.openFailToast('Failed');
  }

  save() {
    this.loadingService.setDisplay(true);
    this.warrCheckWmiApi.save(this.partsList).subscribe(() => {
      this.swalAlertService.openSuccessToast('Import thành công');
      this.loadingService.setDisplay(false);
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      vds: [''],
      wmi: [''],
      jobsCode: ['']
    });
  }

}
