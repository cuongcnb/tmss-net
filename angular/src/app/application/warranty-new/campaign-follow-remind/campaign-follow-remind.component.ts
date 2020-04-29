import { Component, OnInit } from '@angular/core';
import { DataFormatService } from '../../../shared/common-service/data-format.service';
import { FormBuilder } from '@angular/forms';
import { LoadingService } from '../../../shared/loading/loading.service';
import { DealerListService } from '../../../api/master-data/dealer-list.service';

@Component({
  selector: 'app-campaign-follow-remind',
  templateUrl: './campaign-follow-remind.component.html',
  styleUrls: ['./campaign-follow-remind.component.scss']
})
export class CampaignFollowRemindComponent implements OnInit {
  filterForm;
  dealers;

  constructor(
    private formBuilder: FormBuilder,
    private dataFormatService: DataFormatService,
    private loadingService: LoadingService,
    private dealerListService: DealerListService
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.filterForm = this.formBuilder.group({
      dlrId: [undefined],
      campaignName: [undefined],
      fromDate: [this.dataFormatService.formatDate(new Date())],
      toDate: [this.dataFormatService.formatDate(new Date())],
    });
  }

  search() {
    
  }

  getDealer() {
    this.loadingService.setDisplay(true);
    this.dealerListService.getDealers().subscribe((res) => {
      this.dealers = res;
      this.loadingService.setDisplay(false);
    });
  }

}
