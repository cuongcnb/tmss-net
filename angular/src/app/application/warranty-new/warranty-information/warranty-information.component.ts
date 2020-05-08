import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoadingService } from '../../../shared/loading/loading.service';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import { VehicleInfoApi } from '../../../api/warranty/vehicle-info.api';
import { DataFormatService } from '../../../shared/common-service/data-format.service';
import { CurrentUserModel } from '../../../core/models/base.model';
import {User} from '../../../core/constains/user';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'warranty-information',
  templateUrl: './warranty-information.component.html',
  styleUrls: ['./warranty-information.component.scss'],
})
export class WarrantyInformationComponent extends AppComponentBase implements OnInit {
  @ViewChild('vinDetailModal', {static: false}) vinDetailModal;
  searchForm: FormGroup;
  fieldVinInfo;
  vinInfoList;
  vinInfoParams;
  paginationParams;
  claimStatusList;
  paginationTotalsData;
  selectedNode;
  // currentUser: CurrentUserModel = CurrentUser;
  isTMV = false;

  constructor(injector: Injector,
    private formBuilder: FormBuilder,
              private loadingService: LoadingService,
              private swalAlertService: ToastService,
              private vehicleInfoApi: VehicleInfoApi,
              private dataFormatService: DataFormatService) {
                super(injector);
    this.fieldVinInfo = [
      {
        headerName: 'Số Vin',
        headerTooltip: 'Số Vin',
        field: 'vin',
        width: 250,
      },
      {
        headerName: 'Mã Đại Lý',
        headerTooltip: 'Mã Đại Lý',
        field: 'dealercode',
      },
      {
        headerName: 'Màu',
        headerTooltip: 'Màu',
        field: 'color',
      },
      {
        headerName: 'Engine No',
        headerTooltip: 'Engine No',
        field: 'engine',
      },
      {
        headerName: 'Line Off Date',
        headerTooltip: 'Line Off Date',
        field: 'lineoffdate',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
      },
      {
        headerName: 'Delivery Date',
        headerTooltip: 'Delivery Date',
        field: 'deliverdate',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
      },
      {
        headerName: 'Sale Date',
        headerTooltip: 'Sale Date',
        field: 'salesdate',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
      },
      {
        headerName: 'PDS Date',
        headerTooltip: 'PDS Date',
        field: 'pdsdate',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
      },
      {
        headerName: 'SFX',
        headerTooltip: 'SFX',
        field: 'sfx',
      },
    ];
  }


  ngOnInit() {
    this.buildForm();
    this.isTMV = this.currentUser.dealerId === User.tmvDealerId;
  }

  callbackVinInfo(params) {
    this.vinInfoParams = params;
  }

  getParamsVinInfo() {
    const selectedNode = this.vinInfoParams.api.getSelectedNodes();
    if (selectedNode) {
      this.selectedNode = selectedNode[0];
    }
  }

  search() {
    const formValue = this.searchForm.value;
    if (formValue.dateFrom > formValue.dateTo) {
      this.swalAlertService.openFailToast('Ngày bắt đầu không thể lớn hơn ngày kết thúc', 'Lỗi ngày tìm kiếm');
      return;
    }
    this.loadingService.setDisplay(true);
    this.vehicleInfoApi.search(formValue).subscribe(val => {
      if (val) {
        this.vinInfoList = val;
        this.vinInfoParams.api.setRowData(this.vinInfoList);
        this.selectedNode = undefined;
      }
      this.loadingService.setDisplay(false);
    });
  }

  changePaginationParams(paginationParams) {
    if (!this.claimStatusList) {
      return;
    }

    this.paginationParams = paginationParams;
    this.search();
  }

  openVinDetailModal() {
    if (this.selectedNode) {
      this.vinDetailModal.open(this.selectedNode.data);
    } else {
      this.swalAlertService.openWarningToast('Chọn 1 bản ghi để Tạo Claim');
    }
  }
  updateVin(dataUpdate) {
    this.selectedNode.setData(dataUpdate);
  }

  private buildForm() {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const date = new Date().getDate();
    this.searchForm = this.formBuilder.group({
      dateType: [1],
      dateFrom: [new Date(year, month, date, 0, 0, 0)],
      dateTo: [new Date(year, month, date, 23, 59, 59)],
      vinNo: [undefined],
    });
  }
}
