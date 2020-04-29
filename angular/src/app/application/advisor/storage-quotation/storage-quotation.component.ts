import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {StorageQuotationApi} from '../../../api/quotation/storage-quotation.api';
import {LoadingService} from '../../../shared/loading/loading.service';
import {TMSSTabs} from '../../../core/constains/tabs';
import {EventBusService} from '../../../shared/common-service/event-bus.service';
import {GlobalValidator} from '../../../shared/form-validation/validators';
import {CustomerTypeModel} from '../../../core/models/common-models/customer-type-model';
import {ConfirmService} from '../../../shared/confirmation/confirm.service';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {RepairOrderApi} from '../../../api/quotation/repair-order.api';
import {DownloadService} from '../../../shared/common-service/download.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'storage-quotation',
  templateUrl: './storage-quotation.component.html',
  styleUrls: ['./storage-quotation.component.scss']
})
export class StorageQuotationComponent implements OnInit {
  @ViewChild('proposalPrintModal', {static: false}) proposalPrintModal;
  form: FormGroup;
  proposalForm: FormGroup;
  selectedStorageQuotation;
  fieldGrid;
  params;
  storageQuotationList: any[] = [];
  customerTypes: Array<CustomerTypeModel> = [];

  paginationTotalsData: number;
  paginationParams;

  constructor(
    private formBuilder: FormBuilder,
    private swalAlertService: ToastService,
    private loadingService: LoadingService,
    private storageQuotationApi: StorageQuotationApi,
    private eventBus: EventBusService,
    private confirmService: ConfirmService,
    private dataFormatService: DataFormatService,
    private repairOrderApi: RepairOrderApi,
    private downloadService: DownloadService
  ) {
    this.fieldGrid = [
      {headerName: 'Biển số xe', headerTooltip: 'Biển số xe', field: 'registerNo'},
      {headerName: 'VIN', headerTooltip: 'VIN', field: 'vinNo', minWidth: 150},
      {headerName: 'RO', headerTooltip: 'RO', field: 'repairorderno'},
      {
        headerName: 'TG báo giá', headerTooltip: 'TG báo giá', field: 'openroDate',
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value)
      },
      {headerName: 'Km', headerTooltip: 'Km', field: 'km', cellClass: ['cell-border', 'cell-readonly', 'text-right']},
      {headerName: 'Bản', headerTooltip: 'Bản', field: 'version', cellClass: ['cell-border', 'cell-readonly', 'text-right']},
      {
        headerName: 'Ngày lưu báo giá', headerTooltip: 'Ngày lưu báo giá', field: 'versionDate',
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value)
      },
      {headerName: 'Ghi chú báo giá', headerTooltip: 'Ghi chú báo giá', field: 'versionDescription'}
    ];
  }

  ngOnInit() {
    this.buildForm();
  }

  callbackGrid(params) {
    this.params = params;
    this.searchQuotation();
  }

  getParams() {
    const selectedStorageQuotation = this.params.api.getSelectedRows();
    if (selectedStorageQuotation) {
      this.selectedStorageQuotation = selectedStorageQuotation[0];
    }
  }

  changePaginationParams(paginationParams) {
    if (!this.storageQuotationList) {
      return;
    }
    this.paginationParams = paginationParams;
    this.searchQuotation();
  }

  resetPaginationParams() {
    if (this.paginationParams) {
      this.paginationParams.page = 1;
    }
    this.paginationTotalsData = 0;
  }

  searchQuotation() {
    this.loadingService.setDisplay(true);
    this.storageQuotationApi.search(this.form.value, this.paginationParams).subscribe(data => {
      this.paginationTotalsData = data.total;
      this.storageQuotationList = data.list;
      this.params.api.setRowData(this.storageQuotationList);
      this.loadingService.setDisplay(false);
    });
  }

  printProposal() {
    if (!this.selectedStorageQuotation) {
      this.swalAlertService.openFailToast('Bạn chưa chọn bản ghi');
      return;
    }
    this.confirmService.openConfirmModal('Thông báo', 'Bạn muốn in báo giá?').subscribe(() => {
      this.proposalPrintModal.open(this.selectedStorageQuotation);
    }, () => {
    });
  }

  openStorageQuotationDetail() {
    if (!this.selectedStorageQuotation) {
      this.swalAlertService.openWarningToast('Cần chọn 1 bản ghi');
      return;
    } else {
      this.eventBus.emit({
        type: 'openViewProposalComponent',
        functionCode: TMSSTabs.viewProposal,
        carInformation: this.selectedStorageQuotation
      });
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      registerNo: [undefined],
      vinNo: [undefined],
      ro: [undefined]
    });

    this.proposalForm = this.formBuilder.group({
      registerno: [undefined],
      vinno: [undefined],
      id: [undefined],
      customerId: [undefined],
      vehiclesId: [undefined],
      cusDId: [undefined],
      cusdesId: [undefined],

      // customer
      carownername: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(180)])],
      cusno: [{value: undefined, disabled: true}],
      orgname: [undefined, GlobalValidator.maxLength(2000)],
      custypeId: [undefined],
      cusType: [undefined],
      carowneradd: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.maxLength(180)])],
      provinceId: [undefined],
      districtId: [undefined],
      carownermobil: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.phoneFormat])],
      carownertel: [undefined, GlobalValidator.phoneFormat],
      carownerfax: [undefined, GlobalValidator.phoneFormat],
      taxcode: [undefined, GlobalValidator.taxFormat],
      carowneremail: [undefined, Validators.compose([GlobalValidator.emailFormat, GlobalValidator.maxLength(50)])],
      cusNote: [undefined, GlobalValidator.maxLength(1000)],

      // vehicle
      cmType: [undefined, GlobalValidator.required],
      ckd: [undefined],
      cmCode: [{value: undefined, disabled: true}, GlobalValidator.required],
      cmId: [undefined],
      fullmodel: [undefined, GlobalValidator.maxLength(50)],
      cmName: [undefined, GlobalValidator.required],
      doixe: [{value: undefined, disabled: true}],
      frameno: [undefined, GlobalValidator.maxLength(20)],
      enginetypeId: [undefined],
      enginecode: [undefined],
      engineno: [undefined, GlobalValidator.maxLength(20)],
      vcId: [undefined],
      vccode: [undefined],
      ntCode: [undefined, GlobalValidator.maxLength(50)],

      // cus refer
      name: [{
        value: undefined,
        disabled: true
      }, Validators.compose([GlobalValidator.maxLength(100), GlobalValidator.required])],
      type: [null],
      tel: [{value: undefined, disabled: true}, GlobalValidator.phoneFormat],
      address: [{value: undefined, disabled: true}, GlobalValidator.maxLength(100)],
      email: [{
        value: undefined,
        disabled: true
      }, Validators.compose([GlobalValidator.maxLength(50), GlobalValidator.emailFormat])],

      nonFir: [{value: undefined, disabled: true}],
      pds: [undefined],
      repairContent: [undefined]
    });
  }

  downloadReport(event) {
    this.repairOrderApi.printQuotation({
      extension: event.extension,
      customersId: this.selectedStorageQuotation.cusId,
      customerDId: this.selectedStorageQuotation.customerDId,
      vehiclesId: this.selectedStorageQuotation.vhcId,
      roId: this.selectedStorageQuotation.id
    }).subscribe(data => {
      if (data) {
        this.downloadService.downloadFile(data);
      }
      this.loadingService.setDisplay(false);
    });
  }
}
