import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {throttleTime} from 'rxjs/operators';
import * as moment from 'moment';

import {DealerApi} from '../../../api/sales-api/dealer/dealer.api';
import {CurrentUser} from '../../../home/home.component';
import {LoadingService} from '../../../shared/loading/loading.service';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {RcTypeApi} from '../../../api/rc-type/rc-type.api';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {RepairOrderApi} from '../../../api/quotation/repair-order.api';
import {DownloadService} from '../../../shared/common-service/download.service';
import {AppoinmentApi} from '../../../api/appoinment/appoinment.api';
import {RoStateOfProposal, state} from '../../../core/constains/ro-state';
import {GridTableService} from '../../../shared/common-service/grid-table.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'repair-profile',
  templateUrl: './repair-profile.component.html',
  styleUrls: ['./repair-profile.component.scss']
})
export class RepairProfileComponent implements AfterViewInit, OnInit {
  @ViewChild('orderPrintModal', {static: false}) orderPrintModal;
  @ViewChild('reportTypeModal', {static: false}) reportTypeModal;
  @ViewChild('tableRo', {static: false}) tableRo;
  repairProfileSearchForm: FormGroup;
  repairProfileDetailForm: FormGroup;
  dealers: Array<any>;
  rcTypes: Array<any>;
  // repair profile
  repairProfileList;
  repairProfileParams;
  fieldGridRepairProfile;
  selectedRepairProfile;
  // Ro
  fieldGridRo;
  fieldGridAppointment;
  selectedRo;
  roParams;
  paginationParams;
  paginationTotalsData;
  roState = RoStateOfProposal;
  roStateObj = state;
  dataProfileInfo;
  screenHeight: number;

  enableBtnQuotation = [
    null, state.quotation, state.complete, state.complete, state.completeSc, state.settlement,
    state.quotation, state.lsc, state.lxpt, state.complete, state.completeSc, state.stopWork, state.working, state.gateInOut, state.washing
  ];
  enableBtnCancelRo = [null, state.quotationTmp, state.quotation, state.cancel, state.washing];
  enableBtnPrintLXPT = [state.lxpt, state.complete, state.completeSc, state.lsc, state.working, state.settlement, state.gateInOut, state.washing];
  enableBtnPrintLSC = [null, state.lsc, state.lxpt, state.complete, state.completeSc, state.stopWork, state.working, state.settlement, state.gateInOut, state.washing];
  enableBtnFinishRo = [state.lsc, state.lxpt, state.working, state.complete, state.completeSc, state.qc, state.washing, state.stopWork, state.washing];
  enableBtnProposalPrint = [state.settlement, state.gateInOut, state.washing];
  enableBtnBillPrint = [state.gateInOut, state.washing];
  enableBtnRepairHistory = [
    null, state.quotation, state.lsc, state.lxpt, state.working, state.complete, state.completeSc,
    state.settlement, state.cancel, state.qc, state.washing, state.stopWork, state.washing
  ];

  onResize() {
    this.screenHeight = window.innerHeight - 180;
  }

  constructor(
    private formBuilder: FormBuilder,
    private downloadService: DownloadService,
    private appointmentApi: AppoinmentApi,
    private dealerApi: DealerApi,
    private repairOrderApi: RepairOrderApi,
    private loadingService: LoadingService,
    private dataFormatService: DataFormatService,
    private rcTypeApi: RcTypeApi,
    private swalAlert: ToastService,
    private gridTableService: GridTableService
  ) {
    this.fieldGridRepairProfile = [
      {headerName: 'DLRNO', headerTooltip: 'DLRNO', field: 'dlrno', width: 130},
      {headerName: 'RO', headerTooltip: 'RO', field: 'repairorderno', width: 130},
      {headerName: 'Biển số', headerTooltip: 'Biển số', field: 'registerno', width: 100},
      {
        headerName: 'Km', headerTooltip: 'Km', field: 'km', width: 60,
        tooltip: params => this.dataFormatService.moneyFormat(params.value) || '',
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value) || '',
        cellClass: ['cell-border', 'cell-readonly', 'text-right']
      },
      {
        headerName: 'Ngày vào',
        headerTooltip: 'Ngày vào',
        field: 'inDate',
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        width: 130
      }
    ];
    this.fieldGridRo = [
      {headerName: 'Số RO', headerTooltip: 'Số RO', field: 'repairorderno', width: 50},
      {
        headerName: 'Loại CV',
        headerTooltip: 'Loại công việc',
        field: 'rotype',
        valueFormatter: params => params.value === '1' ? 'Sửa chữa đồng đơn' : params.value === '2' ? 'Sửa chữa chung' : '',
        width: 50
      },
      {
        headerName: 'Loại RO',
        headerTooltip: 'Loại RO',
        field: 'rctypeId',
        width: 30,
        valueFormatter: params => {
          if (!params.value || !this.rcTypes) {
            return null;
          }
          const rcType = this.rcTypes.filter(item => item.id === params.value);
          return rcType ? rcType[0].rctypename : null;
        }
      },
      {
        headerName: 'Trạng thái',
        headerTooltip: 'Trạng thái',
        field: 'rostate',
        valueFormatter: params => {
          const matchVal = this.roState.find(it => params.value === it.id);
          return matchVal ? matchVal.name : '';
        },
        width: 30
      },
      {
        headerName: 'Ngày hẹn/mở LSC', headerTooltip: 'Ngày hẹn/mở LSC', field: 'openroDate', width: 40,
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value)
      },
      {
        headerName: 'Ngày quyết toán', headerTooltip: 'Ngày quyết toán', field: 'closeroDate', width: 40,
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value)
      },
      {headerName: 'CVDV', headerTooltip: 'Cố vấn dịch vụ', field: 'empName', width: 40},
      {headerName: 'Y/C K.hàng', headerTooltip: 'Y/C K.hàng', field: 'reqdesc', width: 40},
      {
        headerName: 'Rửa xe', headerTooltip: 'Rửa xe', field: 'carWash', width: 20,
        valueFormatter: params => params.value === 'Y' ? 'Có' : 'Không'
      },
      {
        headerName: 'Lấy PT', headerTooltip: 'Lấy phụ tùng', field: 'getOldParts', width: 20,
        valueFormatter: params => params.value === 'Y' ? 'Có' : 'Không'
      },
      {
        headerName: 'Số bản', headerTooltip: 'Số bản', field: 'quotationprint', width: 20,
        cellClass: ['cell-border', 'cell-readonly', 'text-right']
      }
    ];
    this.fieldGridAppointment = [
      {headerName: 'Số RO', headerTooltip: 'Số RO', field: 'appointmentno', width: 130},
      {
        headerName: 'Loại CV',
        headerTooltip: 'Loại công việc',
        field: 'apptype',
        valueFormatter: params => params.value === '1' ? 'Sửa chữa đồng đơn' : params.value === '2' ? 'Sửa chữa chung' : ''
      },
      {
        headerName: 'Loại RO',
        headerTooltip: 'Loại RO',
        field: 'rctypeId',
        width: 80,
        valueFormatter: params => {
          if (!params.value || !this.rcTypes) {
            return null;
          }
          const rcType = this.rcTypes.filter(item => item.id === params.value);
          return rcType ? rcType[0].rctypename : null;
        }
      },
      {
        headerName: 'Trạng thái',
        headerTooltip: 'Trạng thái',
        field: 'appstatus',
        valueFormatter: params => {
          const matchVal = this.roState.find(it => params.value === it.id);
          return matchVal ? matchVal.name : '';
        }
      },
      {
        headerName: 'Ngày hẹn/mở LSC', headerTooltip: 'Ngày hẹn/mở LSC', field: 'cusarr', width: 100,
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value)
      },
      {
        headerName: 'Ngày quyết toán', headerTooltip: 'Ngày quyết toán', field: 'closeroDate', width: 100,
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value)
      },
      {headerName: 'CVDV', headerTooltip: 'Cố vấn dịch vụ', field: 'empName', width: 100},
      {headerName: 'Y/C K.hàng', headerTooltip: 'Y/C K.hàng', field: 'reqdesc', width: 100},
      {
        headerName: 'Rửa xe', headerTooltip: 'Rửa xe', field: 'carWash', width: 50,
        valueFormatter: params => params.value === 'Y' ? 'Có' : 'Không'
      },
      {
        headerName: 'Lấy PT', headerTooltip: 'Lấy phụ tùng', field: 'getOldParts', width: 50,
        valueFormatter: params => params.value === 'Y' ? 'Có' : 'Không'
      },
      {
        headerName: 'Số bản', headerTooltip: 'Số bản', field: 'quotationprint', width: 50,
        cellClass: ['cell-border', 'cell-readonly', 'text-right']
      }
    ];
  }

  ngOnInit() {
    this.getRelatedDealers();
    this.buildForm();
    this.onResize();
  }

  ngAfterViewInit(): void {
  }

  getRelatedDealers() {
    this.dealerApi.getRelatedDealers(CurrentUser.dealerId).subscribe(val => {
      this.dealers = val;
    });
    this.rcTypeApi.findAll().subscribe(val => {
      if (val) {
        this.rcTypes = val;
      }
    });
  }

  private buildForm() {
    this.repairProfileSearchForm = this.formBuilder.group({
      dealerId: [{value: CurrentUser.dealerId, disabled: this.dealers && this.dealers.length === 1}],
      appOrRoNo: [undefined],
      type: ['1'],
      registerNo: [undefined],
      // startDate: [moment(new Date().setHours(0, 0, 0)).subtract(7, 'days').format()],
      // endDate: [new Date().setHours(0, 0, 0)],
      startDate: [undefined],
      endDate: [undefined],
      vinNo: [undefined]
    });
    this.repairProfileDetailForm = this.formBuilder.group({
      vinno: [{value: undefined, disabled: true}],
      registerno: [{value: undefined, disabled: true}],
      cmCode: [{value: undefined, disabled: true}],
      fullmodel: [{value: undefined, disabled: true}],
      cfCode: [{value: undefined, disabled: true}],
      cmYear: [{value: undefined, disabled: true}],
      frameno: [{value: undefined, disabled: true}],
      enginecode: [{value: undefined, disabled: true}],
      deliveryDate: [{value: undefined, disabled: true}],
      vCCode: [{value: undefined, disabled: true}],
      cusno: [{value: undefined, disabled: true}],
      carownername: [{value: undefined, disabled: true}],
      calltimeMap: [{value: undefined, disabled: true}],
      orgname: [{value: undefined, disabled: true}],
      taxcode: [{value: undefined, disabled: true}],
      cusTypeName: [{value: undefined, disabled: true}],
      carowneradd: [{value: undefined, disabled: true}],
      carownertel: [{value: undefined, disabled: true}],

      name: [{value: undefined, disabled: true}],
      tel: [{value: undefined, disabled: true}],
      email: [{value: undefined, disabled: true}],
      address: [{value: undefined, disabled: true}],
      cusDCalltime: [{value: undefined, disabled: true}]
    });
  }

  callbackRepairProfile(params) {
    this.repairProfileParams = params;
  }

  getParamsRepairProfile() {
    const selectedRepairProfile = this.repairProfileParams.api.getSelectedRows();
    if (selectedRepairProfile) {
      this.selectedRepairProfile = selectedRepairProfile[0];
      this.getRepairProfileInfo();
      this.getRo();
      this.getInfo(Number(this.repairProfileSearchForm.get('type').value) === 1 ? this.selectedRepairProfile.roId : this.selectedRepairProfile.appoinmentid);
    } else {
      this.roParams.api.setRowData([]);
      this.repairProfileDetailForm.patchValue({});
    }
  }

  getRepairProfileInfo() {
    this.repairProfileDetailForm.patchValue(Object.assign(this.selectedRepairProfile,
      {calltimeMap: this.selectedRepairProfile.calltime === 'H' ? 'Hành chính' : this.selectedRepairProfile.calltime === 'N' ? 'Ngoài HC' : null}));
  }

  getRo() {
    this.roParams.api.setRowData([this.selectedRepairProfile]);
  }

  searchRepairProfile() {
    this.resetPaginationParams();
    this.search();
  }

  getInfo(id) {
    this.repairOrderApi.getInfo(id, Number(this.repairProfileSearchForm.get('type').value)).subscribe(res => {
      this.repairProfileDetailForm.patchValue(res.customerInfo);
      this.repairProfileDetailForm.patchValue(res.vehicleInfo);
      this.dataProfileInfo = res || [];
    });
  }

  handleSearch() {

  }

  search() {
    const formValue = this.repairProfileSearchForm.value;
    formValue.endDate = formValue.endDate ? formValue.endDate + 24 * 60 * 60 * 1000 - 1 : null;   // đang lấy từ 00h phải cộng thêm 1 ngày
    if (formValue && formValue.startDate && formValue.endDate && formValue.startDate > formValue.endDate) {
      this.swalAlert.openFailToast('Ngày bắt đầu không thể lớn ngày kết thúc', 'Lỗi ngày tìm kiếm');
      return;
    }
    this.tableRo.fieldGrid = formValue.type === '1' ? this.fieldGridRo : this.fieldGridAppointment;
    this.loadingService.setDisplay(true);
    this.repairOrderApi.searchRo(formValue, this.paginationParams).subscribe((val: { total: number, list: Array<any> }) => {
      if (val) {
        this.paginationTotalsData = val.total;
        this.repairProfileList = this.repairProfileSearchForm.get('type').value === '2' ? val.list : val.list.filter(it => it && !!it.rostate && Number(it.rostate) !== 0);
        this.repairProfileParams.api.setRowData(this.repairProfileList);
        this.repairProfileDetailForm.reset();
        this.roParams.api.setRowData([]);
        this.gridTableService.selectFirstRow(this.repairProfileParams);
        if (this.repairProfileList.length) {
          this.repairProfileParams.api.getModel().rowsToDisplay[0].setSelected(true);
        }
        this.roParams.api.sizeColumnsToFit(this.roParams);
      }
      this.loadingService.setDisplay(false);
    });
  }

  resetPaginationParams() {
    if (this.paginationParams) {
      this.paginationParams.page = 1;
    }
    this.paginationTotalsData = 0;
  }

  changePaginationParams(paginationParams) {
    if (!this.repairProfileList) {
      return;
    }
    this.paginationParams = paginationParams;
    this.search();
  }

  callbackRo(params) {
    this.roParams = params;
  }

  getParamsRo() {
    const selectedRo = this.roParams.api.getSelectedRows();
    if (selectedRo) {
      this.selectedRo = selectedRo[0];
    }
  }

  printPartHandover(extension) {
    this.loadingService.setDisplay(true);
    this.repairOrderApi.printPartHandover({
      customerDId: this.dataProfileInfo && this.dataProfileInfo.customerInfo ? this.dataProfileInfo.customerInfo.cusDId : null,
      customersId: this.dataProfileInfo && this.dataProfileInfo.customerInfo ? this.dataProfileInfo.customerInfo.cusId : null,
      roId: this.selectedRepairProfile.roId,
      vehiclesId: this.dataProfileInfo && this.dataProfileInfo.vehicleInfo ? this.dataProfileInfo.vehicleInfo.vehiclesId : null,
      extension,
      isRecord: 'Y'
    }).subscribe((data) => {
      this.loadingService.setDisplay(false);
      this.downloadService.downloadFile(data);
    });
  }

  printRepairProfile(extension) {
    this.loadingService.setDisplay(true);
    this.repairOrderApi.printRepairOrder({
      customerDId: this.dataProfileInfo && this.dataProfileInfo.customerInfo ? this.dataProfileInfo.customerInfo.cusDId : null,
      customersId: this.dataProfileInfo && this.dataProfileInfo.customerInfo ? this.dataProfileInfo.customerInfo.cusId : null,
      estimateTime: this.selectedRepairProfile.estimateTime,
      roId: this.selectedRepairProfile.roId,
      vehiclesId: this.dataProfileInfo && this.dataProfileInfo.vehicleInfo ? this.dataProfileInfo.vehicleInfo.vehiclesId : null,
      isCarWash: this.selectedRepairProfile.isCarWash,
      isCusWait: this.selectedRepairProfile.isCusWait,
      isPriority: this.selectedRepairProfile.isPriority,
      isTakeParts: this.selectedRepairProfile.isTakeParts,
      km: this.selectedRepairProfile.km,
      qcLevel: this.selectedRepairProfile.qcLevel,
      extension,
      isRecord: 'Y'
    }).subscribe((data) => {
      this.loadingService.setDisplay(false);
      this.downloadService.downloadFile(data);
    });
  }

  printQuote(extension) {
    this.loadingService.setDisplay(true);
    this.repairOrderApi.printQuotation({
      customerDId: this.dataProfileInfo && this.dataProfileInfo.customerInfo ? this.dataProfileInfo.customerInfo.cusDId : null,
      customersId: this.dataProfileInfo && this.dataProfileInfo.customerInfo ? this.dataProfileInfo.customerInfo.cusId : null,
      roId: this.selectedRepairProfile.roId,
      vehiclesId: this.dataProfileInfo && this.dataProfileInfo.vehicleInfo ? this.dataProfileInfo.vehicleInfo.vehiclesId : null,
      appId: null,
      isCarWash: this.selectedRepairProfile.isCarWash,
      isCusWait: this.selectedRepairProfile.isCusWait,
      isPriority: this.selectedRepairProfile.isPriority,
      isTakeParts: this.selectedRepairProfile.isTakeParts,
      km: null,
      qc: null,
      isRecord: 'Y',
      extension
    }).subscribe(data => {
      this.downloadService.downloadFile(data);
      this.loadingService.setDisplay(false);
    });
  }

  printRoSettlement(extension) {
    this.loadingService.setDisplay(true);
    this.repairOrderApi.printRoSettlement({
      customerDId: this.dataProfileInfo && this.dataProfileInfo.customerInfo ? this.dataProfileInfo.customerInfo.cusDId : null,
      customersId: this.dataProfileInfo && this.dataProfileInfo.customerInfo ? this.dataProfileInfo.customerInfo.cusId : null,
      roId: this.selectedRepairProfile.roId,
      vehiclesId: this.dataProfileInfo && this.dataProfileInfo.vehicleInfo ? this.dataProfileInfo.vehicleInfo.vehiclesId : null,
      estimateTime: this.selectedRepairProfile.estimateTime,
      extension,
      isCarWash: this.selectedRepairProfile.isCarWash,
      isCusWait: this.selectedRepairProfile.isCusWait,
      isPriority: this.selectedRepairProfile.isPriority,
      isTakeParts: this.selectedRepairProfile.isTakeParts,
      km: this.selectedRepairProfile.km,
      qcLevel: this.selectedRepairProfile.qcLevel,
      isRecord: 'Y'
    }).subscribe((data) => {
      this.loadingService.setDisplay(false);
      this.downloadService.downloadFile(data);
    });
  }

  printOrder() {
    this.orderPrintModal.open(this.selectedRepairProfile);
  }

  printBooking(params) {
    this.loadingService.setDisplay(true);
    this.appointmentApi.printAppoinment({
      customerDId: this.dataProfileInfo && this.dataProfileInfo.customerInfo ? this.dataProfileInfo.customerInfo.cusDId : null,
      customerId: this.dataProfileInfo && this.dataProfileInfo.customerInfo ? this.dataProfileInfo.customerInfo.cusId : null,
      appoinmentId: this.selectedRepairProfile.appoinmentid,
      vehicleId: this.dataProfileInfo && this.dataProfileInfo.vehicleInfo ? this.dataProfileInfo.vehicleInfo.vehiclesId : null,
      meetCus: this.selectedRepairProfile.meetCus,
      extension: params.extension,
      isRecord: 'Y'
    }).subscribe((data) => {
      this.loadingService.setDisplay(false);
      this.downloadService.downloadFile(data);
    });
  }

  printOutGate() {
    this.loadingService.setDisplay(true);
    this.repairOrderApi.printOutGate(this.selectedRepairProfile.roId).subscribe(data => {
      this.loadingService.setDisplay(false);
      this.downloadService.downloadFile(data);
    });
  }

  print(params) {
    switch (params.type) {
      case 1:
        this.printBooking(params);
        break;
      case 2:
        this.printRoSettlement(params.extension);
        break;
      case 3:
        this.printPartHandover(params.extension);
        break;
      case 4:
        this.printRepairProfile(params.extension);
        break;
      case 5:
        this.printQuote(params.extension);
        break;
    }
  }
}
