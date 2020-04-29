import { Component, OnInit } from '@angular/core';
import { DeadStockPartModel } from '../../../core/models/parts-management/dead-stock-part.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DealerModel } from '../../../core/models/sales/dealer.model';
import { DealerApi } from '../../../api/sales-api/dealer/dealer.api';
import { LoadingService } from '../../../shared/loading/loading.service';
import { GridTableService } from '../../../shared/common-service/grid-table.service';
import { DeadStockPartApi } from '../../../api/parts-management/dead-stock-part.api';
import { PaginationParamsModel } from '../../../core/models/base.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dead-stock-part-searching',
  templateUrl: './dead-stock-part-searching.component.html',
  styleUrls: ['./dead-stock-part-searching.component.scss']
})
export class DeadStockPartSearchingComponent implements OnInit {
  gridField;
  gridParams;

  paginationParams: PaginationParamsModel;
  paginationTotalsData: number;

  partSelected: DeadStockPartModel;
  deadStockParts: Array<DeadStockPartModel>;
  dealers: Array<DealerModel>;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private loading: LoadingService,
    private gridTableService: GridTableService,
    private dealerApi: DealerApi,
    private deadStockPartApi: DeadStockPartApi,
  ) {
  }

  ngOnInit() {
    this.getDealers();
    this.buildForm();
    this.gridField = [
      {
        headerName: '',
        headerTooltip: '',
        field: 'checkbox',
        checkboxSelection: true,
        width: 70,
      },
      {
        headerName: 'STT', headerTooltip: 'Số thứ tự', width: 80,
        cellRenderer: params => params.rowIndex + 1
      },
      {headerName: 'Đại lý', headerTooltip: 'Đại lý', field: 'dlrCode'},
      {headerName: 'Mã PT', headerTooltip: 'Mã phụ tùng', field: 'partsCode'},
      {headerName: 'Tên PT', headerTooltip: 'Tên phụ tùng', valueGetter: params => {
           return params.data && params.data.partsNameVn && !!params.data.partsNameVn
             ? params.data.partsNameVn : params.data && params.data.partsName ? params.data.partsName : '' ;
        }},
      {headerName: 'Số lượng', headerTooltip: 'Số lượng', field: 'qty'},
      {headerName: 'Giá TMV', headerTooltip: 'Giá TMV', field: 'price'},
    ];
  }

  searchDeadStockPart() {
    this.partSelected = undefined;
    this.loading.setDisplay(true);
    this.deadStockPartApi.searchDeadStockPart(this.form.value.dlrId, this.form.value.partCode, this.paginationParams)
      .subscribe(res => {
        this.loading.setDisplay(false);
        if (res) {
          this.deadStockParts = res.list;
          this.paginationTotalsData = res.total;
          this.gridParams.api.setRowData(res.list);
        }
      });
  }

  callbackGrid(params) {
    this.gridParams = params;
    this.resetPaginationParams();
    this.searchDeadStockPart();
  }

  getParams() {
    const selected = this.gridParams.api.getSelectedRows();
    if (selected) {
      this.partSelected = selected[0];
    }
  }

  changePaginationParams(paginationParams) {
    if (!this.deadStockParts) {
      return;
    }

    this.paginationParams = paginationParams;
    this.searchDeadStockPart();
  }

  exportSelected() {
    this.gridTableService.exportSelected(this.gridParams);
  }

  private resetPaginationParams() {
    if (this.paginationParams) {
      this.paginationParams.page = 1;
    }
    this.paginationTotalsData = 0;
  }

  private getDealers() {
    this.loading.setDisplay(true);
    this.dealerApi.getAllAvailableDealers().subscribe(dealers => {
      this.dealers = dealers || [];
      this.loading.setDisplay(false);
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      dlrId: [undefined],
      partCode: [undefined],
    });
  }
}
