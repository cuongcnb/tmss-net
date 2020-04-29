import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';

import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { GridTableService } from '../../../../shared/common-service/grid-table.service';
import { DataFormatService } from '../../../../shared/common-service/data-format.service';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import { BoOrderFollowupApi } from '../../../../api/parts-management/bo-order-followup.api';
import { CurrentUser } from '../../../../home/home.component';
import { CurrentUserModel } from '../../../../core/models/base.model';
import {
  AdvisorViewDetailModel,
  BoPartsFollowupCvdvModel,
} from '../../../../core/models/parts-management/bo-parts-followup-cvdv.model';
import { AgCheckboxRendererComponent } from '../../../../shared/ag-checkbox-renderer/ag-checkbox-renderer.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'bo-followup-cvdv-detail-modal',
  templateUrl: './bo-followup-cvdv-detail-modal.component.html',
  styleUrls: ['./bo-followup-cvdv-detail-modal.component.scss'],
})
export class BoFollowupCvdvDetailModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  modalHeight: number;
  selectedBo: BoPartsFollowupCvdvModel;
  currentUser: CurrentUserModel = CurrentUser;

  form: FormGroup;

  fieldGrid;
  params;
  boDetailData: Array<AdvisorViewDetailModel>;
  selectedPart: AdvisorViewDetailModel;
  frameworkComponents;

  constructor(
    private setModalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private gridTableService: GridTableService,
    private dataFormatService: DataFormatService,
    private swalAlertService: ToastService,
    private boOrderFollowupApi: BoOrderFollowupApi,
  ) {
  }

  ngOnInit() {
    this.onResize();
    this.frameworkComponents = {
      agCheckboxRendererComponent: AgCheckboxRendererComponent,
    };
    this.fieldGrid = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        field: 'stt',
      },
      {
        headerName: 'Mã phụ tùng',
        headerTooltip: 'Mã phụ tùng',
        field: 'maPt',
      },
      {
        headerName: 'Số lượng',
        headerTooltip: 'Số lượng',
        field: 'soLuong',
      },
      {
        headerName: 'Tên phụ tùng',
        headerTooltip: 'Tên phụ tùng',
        field: 'tenPt',
      },
      {
        headerName: 'Nguồn',
        headerTooltip: 'Nguồn',
        field: 'nguon',
      },
      {
        headerName: 'ETA tiêu chuẩn',
        headerTooltip: 'ETA tiêu chuẩn',
        field: 'standardEta',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
      },
      {
        headerName: 'Thời gian đặt hàng',
        headerTooltip: 'Thời gian đặt hàng',
        field: 'thoigianHen',
      },
      {
        headerName: '(1) CVDV y/c đặt hàng',
        headerTooltip: '(1) Cố vấn Dịch vụ yêu cầu đặt hàng',
        field: 'custOrderDate',
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value),
      },
      {
        headerName: '(2) Đại lý đặt hàng',
        headerTooltip: '(2) Đại lý đặt hàng',
        field: 'requestDate',
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value),
      },
      {
        headerName: '(10) ETA đại lý',
        headerTooltip: '(10) ETA đại lý',
        field: 'eta',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
      },
      {
        headerName: '(11) ATA ĐL',
        headerTooltip: '(11) ATA đại lý',
        field: 'ata',
        tooltip: params => this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToDate(params.value),
      },
      {
        headerName: 'Theo dõi đặc biệt',
        headerTooltip: 'Theo dõi đặc biệt',
        field: 'specialFollowUp',
        cellRenderer: 'agCheckboxRendererComponent',
      },
    ];
    this.boDetailData = [
      {
        maPt: '6920506030C0',
        soLuong: 1,
        tenPt: 'HANDLE SUB-ASSY, FR ',
        nguon: 'TOYOTA MOTOR CORPORATION - USA',
        standardEta: 1535043600000,
        thoigianHen: 46,
        custOrderDate: 1531206120000,
        requestDate: 1531206120000,
        eta: 1532710800000,
        ata: 1532624400000,
        specialFollowUp: null,
      },
    ];
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  open(selectedBo) {
    this.selectedBo = selectedBo;
    this.modal.show();
    this.buildForm();
  }

  reset() {
    this.form = undefined;
  }

  callbackGrid(params) {
    this.params = params;
    this.searchDetail();
  }

  getParams(params) {
  }

  cellValueChanged(params) {
    const field = params.colDef.field;
    if (field === 'specialFollowUp') {
    }
  }

  searchDetail() {
    this.params.api.setRowData(this.gridTableService.addSttToData(this.boDetailData));
    // this.loadingService.setDisplay(true);
    // this.boOrderFollowupApi.viewDetailForCvdv(this.currentUser.dealerId, this.selectedBo.reqId, this.selectedBo.reqtype).subscribe(boDetailData => {
    //   this.boDetailData = boDetailData;
    //   this.params.api.setRowData(this.gridTableService.addSttToData(this.boDetailData));
    //   this.loadingService.setDisplay(false);
    // });
  }

  save() {
    this.loadingService.setDisplay(true);
    this.boOrderFollowupApi.editPartForNvpt(this.form.getRawValue()).subscribe(() => {
      this.swalAlertService.openSuccessToast();
      this.modal.hide();
      this.close.emit();
      this.loadingService.setDisplay(false);
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      soRo: [{value: undefined, disabled: true}],
      bienSoXe: [{value: undefined, disabled: true}],
      tenCvdv: [{value: undefined, disabled: true}],
    });

    if (this.selectedBo) {
      this.form.patchValue(this.selectedBo);
    }
  }

}
