import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DataFormatService } from '../../../shared/common-service/data-format.service';
import { CampaignFollowUpApi } from '../../../api/warranty/campaign-follow-up.api';
import { LoadingService } from '../../../shared/loading/loading.service';
import { DealerListService } from '../../../api/master-data/dealer-list.service';


@Component({
  selector: 'app-campaign-follow-up',
  templateUrl: './campaign-follow-up.component.html',
  styleUrls: ['./campaign-follow-up.component.scss'],
})
export class CampaignFollowUpComponent implements OnInit {
  filterForm: FormGroup;
  fieldGrid;
  gridParams;
  paginationParams;
  dealers;

  constructor(
    private formBuilder: FormBuilder,
    private dataFormatService: DataFormatService,
    private campaignFollowUpApi: CampaignFollowUpApi,
    private loadingService: LoadingService,
    private dealerListService: DealerListService
  ) {
    this.getDealer();
  }

  ngOnInit() {
    this.buildForm();
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
        field: 'vinno',
        width: 120,
      },
      {
        headerName: 'Đại lý yêu cầu',
        headerTooltip: 'Đại lý yêu cầu',
        field: 'dealerName',
        width: 120,
      },
      {
        headerName: 'Ngày gửi',
        headerTooltip: 'Ngày gửi',
        field: 'requestDate',
        tooltip: (params) =>
          this.dataFormatService.parseTimestampToDate(params.value),
        valueFormatter: (params) =>
          this.dataFormatService.parseTimestampToDate(params.value),
      },
      {
        headerName: 'Tên chiến dịch',
        headerTooltip: 'Tên chiến dịch',
        field: 'campaignName',
      },
      {
        headerName: 'Mã công việc',
        headerTooltip: 'Mã công việc',
        field: 'codeOpen',
        width: 120,
      },
    ];
  }

  buildForm() {
    this.filterForm = this.formBuilder.group({
      dlrId: [undefined],
      code: [''],
      campaignName: [''],
    });
  }

  callbackGridParams(params) {
    this.gridParams = params;
    params.api.setRowData([]);
  }

  search() {
    this.loadingService.setDisplay(true);
    this.campaignFollowUpApi
      .getListCampaignFollowUp(this.filterForm.value, this.paginationParams)
      .subscribe((res) => {
        this.gridParams.api.setRowData(res ? res : []);
        this.loadingService.setDisplay(false);
      });
  }

  changePaginationParams(paginationParams) {
    this.paginationParams = paginationParams;
    this.search();
  }

  getDealer() {
    this.loadingService.setDisplay(true);
    this.dealerListService.getDealers().subscribe(res => {
      this.dealers = res;
      this.loadingService.setDisplay(false);
    });
  }

  download() {}
}
