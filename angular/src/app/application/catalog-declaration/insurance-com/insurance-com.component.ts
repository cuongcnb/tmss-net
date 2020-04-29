import { Component, OnInit } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'insurance-com',
  templateUrl: './insurance-com.component.html',
  styleUrls: ['./insurance-com.component.scss']
})
export class InsuranceComComponent implements OnInit {
  tabs: Array<any>;
  selectedTab;

  constructor() {
  }

  ngOnInit() {
    this.initTabs();
    this.selectedTab = this.tabs[0];
  }

  selectTab(tab) {
    this.selectedTab = tab;
  }

  private initTabs() {
    this.tabs = [
      'Công ty',
      'Hồ sơ',
    ];
  }
}
