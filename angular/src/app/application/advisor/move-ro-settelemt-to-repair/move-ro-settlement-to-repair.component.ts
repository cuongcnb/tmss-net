import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoadingService} from '../../../shared/loading/loading.service';
import {DataFormatService} from '../../../shared/common-service/data-format.service';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {AgCheckboxRendererComponent} from '../../../shared/ag-checkbox-renderer/ag-checkbox-renderer.component';
import {RepairOrderApi} from '../../../api/quotation/repair-order.api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'move-ro-settlement-to-repair',
  templateUrl: './move-ro-settlement-to-repair.component.html',
  styleUrls: ['./move-ro-settlement-to-repair.component.scss']
})
export class MoveRoSettlementToRepairComponent implements OnInit {
  form: FormGroup;

  fieldGrid;
  params;
  listData;
  frameworkComponents;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private repairOrderApi: RepairOrderApi,
    private dataFormatService: DataFormatService
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.fieldGrid = [
      {
        headerName: '',
        headerTooltip: '',
        field: 'checkForExport',
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        width: 30
      },
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        field: 'stt',
        width: 30,
        cellRenderer: params => params.rowIndex + 1
      },
      {
        headerName: 'Số RO',
        headerTooltip: 'Số RO',
        field: 'repairorderno',
        width: 80
      },
      {
        headerName: 'Loại sữa chữa',
        headerTooltip: 'Loại sữa chữa',
        field: 'rotype',
        width: 70,
        valueFormatter: params => {
          switch (params.value) {
            case '1':
              return 'BP';
            case '2':
              return 'GJ';
            default:
              return '';
          }
        }
      },
      {
        headerName: 'Biển số xe',
        headerTooltip: 'Biển số xe',
        field: 'registerno',
        width: 80
      },
      {
        headerName: 'Yêu cầu',
        headerTooltip: 'Yêu cầu',
        field: 'reqdesc'
      },
      {
        headerName: 'Ngày mở RO',
        headerTooltip: 'Ngày mở RO',
        field: 'openroDate',
        tooltip: params => this.dataFormatService.parseTimestampToFullDate(params.value),
        valueFormatter: params => this.dataFormatService.parseTimestampToFullDate(params.value)
      }
    ];
    this.frameworkComponents = {
      agCheckboxRendererComponent: AgCheckboxRendererComponent
    };
  }

  // =====****** AG GRID *****=====
  callbackGrid(params) {
    this.params = params;
  }

  getParams() {
    const selectedData = this.params.api.getSelectedRows();
    this.listData = [];
    if (selectedData) {
      selectedData.forEach(it => this.listData.push(it));
    }

  }

  search() {
    this.repairOrderApi.getRoSettlementInDay(this.form.getRawValue()).subscribe(res => {
      this.params.api.setRowData(res);
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      filter: ['']
    });
  }

  onBtnButtonMove() {
    if (!this.listData) {
      return;
    }
    const arrRoId = [];
    this.listData.forEach(it => arrRoId.push(it.id));
    this.repairOrderApi.moveRoSettlementInDay(arrRoId).subscribe(res => {
        this.swalAlertService.openSuccessToast();
        this.search();
    });
  }
}
