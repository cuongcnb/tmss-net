import { Component, OnInit } from '@angular/core';
import { DataFormatService } from '../../../shared/common-service/data-format.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LoadingService } from '../../../shared/loading/loading.service';
import { DealerListService } from '../../../api/master-data/dealer-list.service';
import { CampaignFollowUpApi } from '../../../api/warranty/campaign-follow-up.api';

@Component({
  selector: 'app-campaign-veh-complete',
  templateUrl: './campaign-veh-complete.component.html',
  styleUrls: ['./campaign-veh-complete.component.scss'],
})
export class CampaignVehCompleteComponent implements OnInit {
  fieldGrid;
  gridParams;
  filterForm: FormGroup;
  dealers;
  paginationParams;

  constructor(
    private formBuilder: FormBuilder,
    private dataFormatService: DataFormatService,
    private loadingService: LoadingService,
    private dealerListService: DealerListService,
    private campaignFollowUpApi: CampaignFollowUpApi,
  ) {
    this.getDealer();
  }

  ngOnInit() {
    this.fieldGrid = [
      {
        headerName: 'STT',
        headerTooltip: 'Số thứ tự',
        width: 50,
        cellRenderer: (params) => params.rowIndex + 1,
      },
      {
        headerName: 'Vinno',
        headerTooltip: 'Vinno',
        field: 'vin',
        width: 120,
      },
      {
        headerName: 'Tên chiến dịch',
        headerTooltip: 'Tên chiến dịch',
        field: 'campaignName',
      },
      {
        headerName: 'Số thư',
        headerTooltip: 'Số thư',
        width: 80,
        field: 'refNo',
      },
      {
        headerName: 'Loại chiến dịch',
        headerTooltip: 'Loại chiến dịch',
        field: 'campaignType',
        width: 120,
      },
      {
        headerName: 'Ngày thực hiện',
        headerTooltip: 'Ngày thực hiện',
        field: 'completeDate',
        width: 120,
        tooltip: (params) =>
          this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: (params) =>
          this.dataFormatService.parseTimestampToDate(params.value),
      },
      {
        headerName: 'Đại lý thực hiện',
        headerTooltip: 'Đại lý thực hiện',
        field: 'dealerName',
        width: 120,
      },
      {
        headerName: 'Mã công việc',
        headerTooltip: 'Mã công việc',
        field: 'openCode',
        width: 120,
      },
      {
        headerName: 'CVDV',
        headerTooltip: 'Cố vấn dịch vụ',
        field: 'advisorName',
      },
    ];
    this.buildForm();
  }

  callbackGridParams(params) {
    this.gridParams = params;
    params.api.setRowData([]);
  }

  buildForm() {
    this.filterForm = this.formBuilder.group({
      dlrId: [undefined],
      code: [''],
      campaignName: [''],
      vin: [''],
    });
  }

  getDealer() {
    this.loadingService.setDisplay(true);
    this.dealerListService.getDealers().subscribe((res) => {
      this.dealers = res;
      this.loadingService.setDisplay(false);
    });
  }

  search() {
    this.loadingService.setDisplay(true);
    this.campaignFollowUpApi
      .getListCampainVehCompleted(this.filterForm.value, this.paginationParams)
      .subscribe((res) => {
        this.gridParams.api.setRowData(res ? res : []);
        this.loadingService.setDisplay(false);
      });
  }

  changePaginationParams(paginationParams) {
    this.paginationParams = paginationParams;
    this.search();
  }

  download() {}

  
}
