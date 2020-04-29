import {Component, OnInit, ViewChild} from '@angular/core';
import {DealerListService} from '../../../api/master-data/dealer-list.service';
import {LoadingService} from '../../../shared/loading/loading.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {GridExportService} from '../../../shared/common-service/grid-export.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'fleet-follow-up',
  templateUrl: './fleet-follow-up.component.html',
  styleUrls: ['./fleet-follow-up.component.scss']
})
export class FleetFollowUpComponent implements OnInit {
  @ViewChild('followAlertModal', {static: false}) followAlertModal;
  @ViewChild('followDetailModal', {static: false}) followDetailModal;
  fieldGridFleetFollow;
  fleetFollowParams;
  selectedFleetFollow;
  dealers;
  form: FormGroup;

  constructor(
    private dealerListService: DealerListService,
    private loadingService: LoadingService,
    private formBuilder: FormBuilder,
    private gridExportService: GridExportService
  ) {
    this.fieldGridFleetFollow = [
      {
        field: 'dealer',
        width: 80,
        pinned: true
      },
      {
        field: 'customerName',
        width: 130,
        pinned: true
      },
      {
        field: 'totalQuantity',
        width: 120
      },
      {
        field: 'cdToTmv',
        width: 100
      },
      {
        headerName: 'TMV Ref No',
        field: 'tmvRefNo',
        width: 110
      },
      {
        field: 'contractNo',
        width: 110
      },
      {
        field: 'contractDate',
        width: 120
      },
      {
        field: 'expireDate',
        width: 110
      },
      {
        field: 'cancel',
        width: 80
      },
      {
        field: 'frameNo',
        width: 100
      },
      {
        field: 'grade',
        width: 80
      },
      {
        field: 'color',
        width: 70
      },
      {
        headerName: 'TMV Inv No',
        field: 'tmvInvNo', width: 110
      },
      {
        headerName: 'TMV Inv Date',
        field: 'tmvInvDate', width: 120
      },
      {
        headerName: 'Amount (VND)',
        field: 'amountVnd',
        width: 125
      },
      {
        headerName: 'Amount (USD)',
        field: 'amountUsd',
        width: 120
      },
      {
        field: 'type',
        width: 70
      },
      {
        field: 'saleDate',
        width: 95
      },
      {
        headerName: 'DLR Invoice No',
        field: 'dlrInvoiceNo',
        width: 125
      },
      {
        headerName: 'DLR Invoice Date',
        field: 'dlrInvoiceDate',
        width: 135
      },
      {
        field: 'reAmount',
        width: 105
      },
      {
        headerName: 'FWSP',
        field: 'fwsp',
        width: 80
      },
      {
        headerName: 'NWSP',
        field: 'nwsp',
        width: 80
      },
      {
        field: 'branch',
        width: 80
      },
      {
        field: 'customerProfile',
        width: 140
      },
      {
        field: 'volumeRange',
        width: 130
      },
      {
        field: 'registrationPlate',
        width: 140
      },
      {
        field: 'remark',
        width: 85
      }
    ];
  }

  ngOnInit() {
    this.loadingService.setDisplay(true);
    this.dealerListService.getDealers().subscribe(dealers => {
      this.dealers = dealers;
      this.loadingService.setDisplay(false);
    });
    this.buildForm();
  }

  search() {
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      dealer: [''],
      quickSearch: ['']
    });
  }

  callbackGridFleetFollow(params) {
    this.fleetFollowParams = params;
  }

  getParamsFleetFollow() {
    const selectedFleetFollow = this.fleetFollowParams.api.getSelectedRows();
    if (selectedFleetFollow) {
      this.selectedFleetFollow = selectedFleetFollow[0];
    }
  }

  refresh() {
    this.callbackGridFleetFollow(this.fleetFollowParams);
  }

  exportExcel() {
    this.gridExportService.export(this.fleetFollowParams, 'Fleet Follow Up');
  }
}
