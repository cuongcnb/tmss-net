import {Component, OnInit} from '@angular/core';
import {AgSelectRendererComponent} from '../../../shared/ag-select-renderer/ag-select-renderer.component';
import {LoadingService} from '../../../shared/loading/loading.service';
import {MasterLexusApi} from '../../../api/srv-master-lexus/master-lexus.api';
import {DealerApi} from '../../../api/sales-api/dealer/dealer.api';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'list-of-dlr-order-to-lexus',
  templateUrl: './list-of-dlr-order-to-lexus.component.html',
  styleUrls: ['./list-of-dlr-order-to-lexus.component.scss']
})
export class ListOfDlrOrderToLexusComponent implements OnInit {
  fieldGrid;
  gridParams;
  frameworkComponents;

  constructor(
    private masterLexusApi: MasterLexusApi,
    private loadingService: LoadingService,
    private dealerApi: DealerApi
  ) {
  }

  ngOnInit() {
    this.frameworkComponents = {
      agSelectRendererComponent: AgSelectRendererComponent
    };
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
      }
    ];
  }

  callBackGrid(params) {
    this.gridParams = params;
    this.getDlrPutAccessaryLexus();
  }

  getDlrPutAccessaryLexus() {
    this.loadingService.setDisplay(true);
    this.dealerApi.getDealerNotLexus().subscribe(res => {
      if (res && res.length) {
        this.gridParams.api.setRowData(res);
        const allColumnIds = [];
        this.gridParams.columnApi.getAllColumns().forEach((column) => {
          allColumnIds.push(column.colId);
        });
        this.gridParams.columnApi.autoSizeColumns(allColumnIds);
      }
      this.loadingService.setDisplay(false);
    });
  }

  cellValueChanged(params) {
    if (params.colDef.field === 'isSellLexusPart') {
      this.loadingService.setDisplay(true);
      this.masterLexusApi.doOrderToLexus(params.data.id, params.data.isSellLexusPart).subscribe(() => {
        this.loadingService.setDisplay(false);
      }, () => {
        // reset value if error
        params.node.setDataValue(params.colDef.field, params.column.editingStartedValue);
      });
    }
  }
}
