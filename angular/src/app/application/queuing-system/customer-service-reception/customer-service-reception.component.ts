import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';

import { ToastService } from '../../../shared/swal-alert/toast.service';
import { LoadingService } from '../../../shared/loading/loading.service';
import { PaginationParamsModel } from '../../../core/models/base.model';
import {
  CustomerReceptingModel,
  CustomerWaitingReceptionModel,
} from '../../../core/models/queuing-system/customer-service-reception.model';
import { QueuingApi } from '../../../api/queuing-system/queuing.api';
import { DataFormatService } from '../../../shared/common-service/data-format.service';
import { DeskAdvisorApi } from '../../../api/master-data/catalog-declaration/desk-advisor.api';
import { GridTableService } from '../../../shared/common-service/grid-table.service';
import { AgSelectRendererComponent } from '../../../shared/ag-select-renderer/ag-select-renderer.component';
import { DlrConfigApi } from '../../../api/common-api/dlr-config.api';
import { CommonFunctionsService } from '../common-functions.service';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'customer-service-reception',
  templateUrl: './customer-service-reception.component.html',
  styleUrls: ['./customer-service-reception.component.scss'],
})
export class CustomerServiceReceptionComponent extends AppComponentBase implements OnInit {
  @ViewChild('advisorDeskChangeModal', { static: false }) advisorDeskChangeModal;
  @ViewChild('deskAdvisorModal', { static: false }) deskAdvisorModal;
  @ViewChild('vehicleIn', { static: false }) vehicleIn;
  form: FormGroup;
  // currentUser = CurrentUser;
  desks: Array<{ key: number, value: string }> = [];
  advisorDesks: Array<any> = [];
  warningTime: number;
  frameworkComponents;

  selectedWaitingData: CustomerWaitingReceptionModel;
  waitingParams;
  waitingfieldGrid;
  waitingPaginationParams: PaginationParamsModel;
  waitingList: Array<CustomerWaitingReceptionModel>;
  waitingPaginationTotalsData: number;

  selectedReceptingData: CustomerReceptingModel;
  receptingfieldGrid;
  receptingPaginationParams: PaginationParamsModel;
  receptingPaginationTotalsData: number;
  receptingParams;
  receptingList: Array<CustomerReceptingModel>;
  deskInfo = '';
  fieldDeskAdvisor;

  constructor(
    injector: Injector,
    private formBuilder: FormBuilder,
    private swalAlertService: ToastService,
    private dataFormatService: DataFormatService,
    private queuingApi: QueuingApi,
    private deskAdvisorApi: DeskAdvisorApi,
    private gridTableService: GridTableService,
    private loadingService: LoadingService,
    private commonFunctionsService: CommonFunctionsService,
    private dlrConfigApi: DlrConfigApi
  ) {
    super(injector);
    this.fieldDeskAdvisor = [
      { headerName: 'Tên bàn', headerTooltip: 'Tên bàn', field: 'deskName' },
      { headerName: 'Mã CVDV', headerTooltip: 'Mã cố vấn dịch vụ', field: 'advisorId' },
      { headerName: 'Tên CVDV', headerTooltip: 'Tên cố vấn dịch vụ', field: 'advisorName' },
    ];
    this.waitingfieldGrid = [
      {
        headerName: 'Biển số xe', headerTooltip: 'Biển số xe', field: 'registerNo',
        cellStyle: params => this.setGridRowStyle(params.data),
      },
      {
        headerName: 'Giờ vào',
        headerTooltip: 'Giờ vào',
        field: 'inDate',
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        cellStyle: params => this.setGridRowStyle(params.data),
      },
      {
        headerName: 'Loại KH', headerTooltip: 'Loại khách hàng', cellClass: ['text-center', 'cell-border', 'cell-readonly'],
        tooltip: params => this.commonFunctionsService.getTypeOfCustomer(params.data),
        cellRenderer: params => this.commonFunctionsService.getTypeOfCustomer(params.data),
        cellStyle: params => this.setGridRowStyle(params.data),
      },
      {
        headerName: 'YCSC', headerTooltip: 'Yêu cầu sửa chữa', cellClass: ['text-center', 'cell-border', 'cell-readonly'],
        tooltip: params => this.commonFunctionsService.getCarJobs(params.data),
        cellRenderer: params => this.commonFunctionsService.getCarJobs(params.data),
        cellStyle: params => this.setGridRowStyle(params.data),
      },
      {
        headerName: 'Tên KH', headerTooltip: 'Tên khách hàng', editable: true, field: 'customerName',
        tooltip: params => params.value,
        cellRenderer: params => params.value,
        cellStyle: params => this.setGridRowStyle(params.data),
      },
      {
        headerName: 'Lần đầu vào',
        headerTooltip: 'Lần đầu vào',
        cellClass: ['text-center', 'cell-border', 'cell-readonly'],
        tooltip: params => `<input disabled type='checkbox' ${params.data.isFirstIn === 'Y' ? 'checked' : ''} />`,
        cellRenderer: params => `<input disabled type='checkbox' ${params.data.isFirstIn === 'Y' ? 'checked' : ''} />`,
        cellStyle: params => this.setGridRowStyle(params.data),
      },
      {
        headerName: 'Bàn CVDV', headerTooltip: 'Bàn cố vấn dịch vụ', field: 'deskId',
        cellRenderer: 'agSelectRendererComponent',
        list: this.desks,
        cellStyle: params => this.setGridRowStyle(params.data),
      },
    ];

    this.frameworkComponents = {
      agSelectRendererComponent: AgSelectRendererComponent
    };

    this.receptingfieldGrid = [
      {
        headerName: 'Bàn',
        headerTooltip: 'Bàn',
        field: 'deskName',
        width: 100,
        cellClass: ['text-center', 'cell-border']
      },
      {
        headerName: 'Cố vấn dịch vụ',
        headerTooltip: 'Cố vấn dịch vụ',
        field: 'empName',
        cellClass: ['text-center', 'cell-border'],
      },
      {
        headerName: 'Loại KH', headerTooltip: 'Loại khách hàng', cellClass: ['text-center', 'cell-border'],
        tooltip: params => this.commonFunctionsService.getTypeOfCustomer(params.data),
        cellRenderer: params => this.commonFunctionsService.getTypeOfCustomer(params.data),
      },
      {
        headerName: 'Biển số xe',
        headerTooltip: 'Biển số xe',
        field: 'registerNo',
        cellClass: ['text-center', 'cell-border']
      },
      {
        headerName: 'Giờ vào',
        headerTooltip: 'Giờ vào',
        field: 'inDate',
        cellClass: ['text-center', 'cell-border'],
        width: 200,
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value),
      },
      {
        headerName: 'YCSC', headerTooltip: 'Yêu cầu sửa chữa', cellClass: ['text-center', 'cell-border'],
        tooltip: params => this.commonFunctionsService.getCarJobs(params.data),
        cellRenderer: params => this.commonFunctionsService.getCarJobs(params.data),
      },
    ];
  }

  ngOnInit() {
    this.buildForm();
    this.deskAdvisorApi.getDeskByCurrentDealer(true)
      .subscribe(desks => {
        this.advisorDesks = desks;
        desks.forEach(desk => this.desks.push({ key: desk.id, value: desk.deskName }));
      });
    this.getWaitTime();
  }

  // lấy thười gian quá hạn đợi của xe
  getWaitTime() {
    // this.dlrConfigApi.getByCurrentDealer().subscribe(currentDealerConfigs => this.warningTime = currentDealerConfigs[0].warningTime * 60000);
    this.dlrConfigApi.getCurrentByDealer().subscribe(currentDealerConfigs => this.warningTime = currentDealerConfigs.warningTime * 60000);
  }

  setGridRowStyle(data) {
    if (data.isFirstIn === 'Y') {
      return { fontWeight: 'bold' };
    }
    if (this.getDuration(data.inDate) <= moment.duration(this.warningTime).asMinutes()) {
      return { backgroundColor: '#EFEFEF' };
    }
    if (this.getDuration(data.inDate) > 2 * moment.duration(this.warningTime).asMinutes()) {
      return { backgroundColor: 'red !important', color: 'white' };
    }
    if ((this.getDuration(data.inDate) > moment.duration(this.warningTime).asMinutes())
      && (this.getDuration(data.inDate) <= 2 * moment.duration(this.warningTime).asMinutes())) {
      return { backgroundColor: 'yellow' };
    }
  }

  getDuration(indate): number {
    const now = moment();
    const inDate = moment(indate);
    const duration = moment.duration(now.diff(inDate));
    return Math.floor(duration.asMinutes());
  }

  // waiting params
  getWaitingParams() {
    const selectedWaitingData = this.waitingParams.api.getSelectedRows();
    if (selectedWaitingData) { this.selectedWaitingData = selectedWaitingData[0]; }
  }

  callbackGridWaiting(params) {
    this.waitingParams = params;
    this.searchWaitingList();
  }

  changeWaitingPaginationParams(paginationParams) {
    if (!this.waitingList) { return; }

    this.waitingPaginationParams = paginationParams;
    this.searchWaitingList();
  }

  searchWaitingList() {
    if (new Date(this.form.value.fromDate) > new Date(this.form.value.toDate)) {
      this.swalAlertService.openFailToast('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
      return;
    }

    this.loadingService.setDisplay(true);
    this.queuingApi.searchWaitList(this.form.value, this.waitingPaginationParams)
      .subscribe(res => {

        if (res) {
          this.waitingList = res.list;
          this.waitingPaginationTotalsData = res.total;
          this.waitingParams.api.setRowData(this.waitingList);
          // this.waitingParams.api.setRowData(this.gridTableService.addSttToData(res.gateInOutList, this.waitingPaginationParams));
        }
      });
  }

  // recepting params
  getReceptingParams() {
    const selectedReceptingData = this.receptingParams.api.getSelectedRows();
    if (selectedReceptingData) { this.selectedReceptingData = selectedReceptingData[0]; }
  }

  callbackGridRecepting(params) {
    this.receptingParams = params;
    this.searchReceptingList();
  }

  changeReceptingPaginationParams(paginationParams) {
    if (!this.receptingList) { return; }
    this.receptingPaginationParams = paginationParams;
    this.searchReceptingList();
  }

  searchReceptingList() {
    this.deskInfo = '';
    if (new Date(this.form.value.fromDate) > new Date(this.form.value.toDate)) {
      this.swalAlertService.openFailToast('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
      return;
    }

    this.loadingService.setDisplay(true);
    this.queuingApi.searchReceiveList(this.form.value, this.receptingPaginationParams).subscribe(res => {
      this.loadingService.setDisplay(false);

      if (res) {
        this.receptingList = res.waitingReceiveGateInOutList;
        this.receptingPaginationTotalsData = res.total;
        this.receptingParams.api.setRowData(this.receptingList);
        // this.receptingParams.api.setRowData(this.gridTableService.addSttToData(res.waitingReceiveGateInOutList, this.receptingPaginationParams));

        res.countDeskList.forEach((item, index) => this.deskInfo += `${index ? ' | ' : ''}${item.deskName}: ${item.countAmount}`);
      }
    });
  }

  search() {
    this.searchReceptingList();
    this.searchWaitingList();
  }

  update() {
    const displayedData = [];
    this.waitingList.forEach(data => {
      if (!!data.deskId) {
        const { advisorId } = this.advisorDesks.find(desk => desk.id === data.deskId);
        displayedData.push(Object.assign({}, data, { advisorId }, this.waitingList));
      }
    });

    if (!displayedData.length) {
      this.swalAlertService.openFailToast('Để tiếp nhận cần ít nhất 1 khách hàng đã được gán cho 1 CVDV');
      return;
    }
    const requestList = displayedData;

    this.loadingService.setDisplay(true);
    this.queuingApi.updateData({ requestList }).subscribe(() => {
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessToast();
      this.search();
    });
  }

  changeAdviser() {
    !this.selectedReceptingData
      ? this.swalAlertService.openFailToast('Cần chọn khách hàng đang tiếp nhận')
      : this.advisorDeskChangeModal.open(this.selectedReceptingData);
  }

  chooseAdviser() {
    !this.selectedWaitingData ? this.swalAlertService.openFailToast('Cần chọn khách hàng chờ tiếp nhận') : this.getDeskAdvisor();
  }

  private getDeskAdvisor() {
    this.loadingService.setDisplay(true);
    this.deskAdvisorApi.getDeskByCurrentDealer(true).subscribe(res => {
      this.deskAdvisorModal.open(null, res || []);
      this.loadingService.setDisplay(false);
    });
  }
  saveDeskAdvisor(data) {
    const idxFound = this.waitingList.findIndex(item => item.registerNo === this.selectedWaitingData.registerNo);
    this.waitingList[idxFound] = Object.assign({}, this.waitingList[idxFound], {
      deskName: data.deskName,
      deskId: data.id,
      advisorId: data.advisorId,
      advisorName: data.advisorName,
    });
    this.waitingParams.api.setRowData(this.waitingList);
  }
  private buildForm() {
    this.form = this.formBuilder.group({
      fromDate: [new Date()],
      toDate: [new Date()],
      dlrId: [this.currentUser.dealerId],
      registerNo: [undefined],
    });
  }
}
