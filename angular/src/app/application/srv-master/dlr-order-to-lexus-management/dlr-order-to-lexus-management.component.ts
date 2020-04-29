import {Component, OnInit} from '@angular/core';
import {AgSelectRendererComponent} from '../../../shared/ag-select-renderer/ag-select-renderer.component';
import {LoadingService} from '../../../shared/loading/loading.service';
import {MasterLexusApi} from '../../../api/srv-master-lexus/master-lexus.api';
import {DealerApi} from '../../../api/sales-api/dealer/dealer.api';
import {DealerModel} from '../../../core/models/sales/dealer.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dlr-order-to-lexus-management',
  templateUrl: './dlr-order-to-lexus-management.component.html',
  styleUrls: ['./dlr-order-to-lexus-management.component.scss']
})
export class DlrOrderToLexusManagementComponent implements OnInit {
  dlrIsLexus: Array<DealerModel>;
  fieldGrid;
  gridParams;
  frameworkComponents;

  constructor(
    private masterLexusApi: MasterLexusApi,
    private loadingService: LoadingService,
    private dealerApi: DealerApi
  ) {
    this.fieldGrid = [
      {headerName: 'Code', headerTooltip: 'Code', field: 'code', resizable: true},
      {headerName: 'Abbreviation', headerTooltip: 'Abbreviation', field: 'abbreviation', resizable: true},
      {headerName: 'Vn Name', headerTooltip: 'Vn Name', field: 'vnName', resizable: true},
      {
        headerName: 'Order to Lexus', headerTooltip: 'Order to Lexus', field: 'isSellLexusPart',
        cellRenderer: 'agSelectRendererComponent',
        list: [
          {key: 'Y', value: 'YES'},
          {key: 'N', value: 'NO'}
        ],
        cellClass: 'p-0',
        required: true,
        resizable: true
      },
      {
        colKey: 'dlrLexus',
        headerName: 'Đại lý Lexus',
        headerTooltip: 'Đại lý Lexus',
        field: 'dlrId',
        cellRenderer: 'agSelectRendererComponent',
        cellClass: 'p-0',
        required: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        cellStyle: params => {
          const style = {background: null};
          if (params.data.isSellLexusPart === 'N') {
            style['pointer-events'] = 'none';
          }
          if (params.data.isSellLexusPart === 'Y' && params.data.dlrId == null) {
            style.background = '#FFFFCC';
          }
          return style;
        }
      }
    ];
    this.frameworkComponents = {
      agSelectRendererComponent: AgSelectRendererComponent
    };
  }

  ngOnInit() {
    this.getDealerForSelect();
  }

  callBackGrid(params) {
    this.gridParams = params;
    this.searchDealer();
  }

  searchDealer() {
    this.loadingService.setDisplay(true);
    this.masterLexusApi.getListDealerOrderLexusPart(null).subscribe(res => {
      this.loadingService.setDisplay(false);
      if (res && res.length) {
        this.gridParams.api.setRowData(res);
        const allColumnIds = [];
        this.gridParams.columnApi.getAllColumns().forEach((column) => {
          allColumnIds.push(column.colId);
        });
        this.gridParams.columnApi.autoSizeColumns(this.gridParams);
      }
    });
  }

  cellValueChanged(params) {
    const field = params.colDef.field;
    const data = params.data;
    if (field === 'dlrId') {
      this.loadingService.setDisplay(true);
      this.masterLexusApi.saveDealerOrderLexusPart(data.id, data.dlrId).subscribe(() => {
        this.loadingService.setDisplay(false);
      });
    } else if (field === 'isSellLexusPart') {
      this.loadingService.setDisplay(true);
      this.masterLexusApi.doOrderToLexus(data.id, data.isSellLexusPart).subscribe(() => {
        this.loadingService.setDisplay(false);
        params.api.redrawRows();
        this.searchDealer();
      }, () => {
        // reset value if error
        params.node.setDataValue(field, params.column.editingStartedValue);
      });
    }
  }

  getDealerForSelect() {
    this.loadingService.setDisplay(true);
    this.dealerApi.getDealerLexus().subscribe(res => {
      this.loadingService.setDisplay(false);
      this.dlrIsLexus = res;
      this.fieldGrid[4].list = this.dlrIsLexus.map(item => ({
        key: item.id,
        value: item.abbreviation
      }));
    });
  }
}
