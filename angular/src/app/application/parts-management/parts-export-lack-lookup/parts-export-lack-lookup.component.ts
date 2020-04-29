import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parts-export-lack-lookup',
  templateUrl: './parts-export-lack-lookup.component.html',
  styleUrls: ['./parts-export-lack-lookup.component.scss'],
})
export class PartsExportLackLookupComponent implements OnInit {
  tabs;
  selectedTab;
  @ViewChild('shippingModal', {static: false}) shippingModal;

  constructor() {
  }

  ngOnInit() {
    this.initTab();
  }

  private initTab() {
    this.tabs = ['Danh sách RO chưa xuất hết phụ tùng', 'Danh sách lệnh có hàng BO chưa xuất'];
    this.selectedTab = this.tabs[0];
  }

}
