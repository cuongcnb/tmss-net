import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {SetModalHeightService} from '../../../../../../shared/common-service/set-modal-height.service';
import {LoadingService} from '../../../../../../shared/loading/loading.service';
import {PaginationParamsModel} from '../../../../../../core/models/base.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {GridTableService} from '../../../../../../shared/common-service/grid-table.service';
import {DataFormatService} from '../../../../../../shared/common-service/data-format.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'recently-part-price',
  templateUrl: './recently-part-price.component.html',
  styleUrls: ['./recently-part-price.component.scss']
})
export class RecentlyPartPriceComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  @Output() cancel = new EventEmitter();
  fieldGrid;
  // tslint:disable-next-line:ban-types
  @Input() headerText: string;
  @Input() list: Array<any>;
  modalHeight: number;
  params;
  gridHeight = '250px';
  selectedData: any;

  constructor(
    private setModalHeightService: SetModalHeightService,
    private loadingService: LoadingService,
    private formBuilder: FormBuilder,
    private elem: ElementRef,
    private gridTableService: GridTableService,
    private dataFormatService: DataFormatService
  ) {
    this.fieldGrid = [
      {
        headerName: 'Đơn giá',
        headerTooltip: 'Đơn giá',
        field: 'sellPrice',
        width: 80,
        cellClass: ['cell-readonly', 'cell-border', ' text-right'],
        tooltip: params => this.dataFormatService.moneyFormat(params.value),
        valueFormatter: params => this.dataFormatService.moneyFormat(params.value)
      }
    ];
  }

  ngOnInit() {
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  open(list) {
    this.list = [];
    list.forEach(it => this.list.push({sellPrice: Number(it)}));
    this.modal.show();
  }

  onCancelBtn() {
    this.modal.hide();
    this.cancel.emit();
  }

  reset() {
    this.list = undefined;
    this.selectedData = undefined;
  }

  callBackGrid(params) {
    this.params = params;
    if (this.list) {
      this.params.api.setRowData(this.list);
      setTimeout(() => {
        this.gridTableService.setFocusCell(this.params, this.fieldGrid[0].field);
      }, 100);
    }
  }

  agKeyUp(event: KeyboardEvent) {
    event.stopPropagation();
    event.preventDefault();
    const keyCode = event.key;
    const KEY_ENTER = 'Enter';


    // Press enter to search with modal
    if (keyCode === KEY_ENTER) {
      this.close.emit(this.selectedData);
      this.modal.hide();
    }

  }

  getParams() {
    const selectedData = this.params.api.getSelectedRows();
    if (selectedData) {
      this.selectedData = selectedData[0];
    }
  }

  confirm() {
    this.close.emit(this.selectedData);
    this.modal.hide();
  }

}
