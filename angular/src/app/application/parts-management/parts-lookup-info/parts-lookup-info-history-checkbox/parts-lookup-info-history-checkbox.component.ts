import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'part-search-history-checkbox',
  template: '<input type="checkbox" [(ngModel)]="params.value" (change)="this.refresh(this.params)">',
  styles: [''],
})
export class PartsLookupInfoHistoryCheckboxComponent implements OnInit {
  @Output() changeValue = new EventEmitter<boolean>();
  params;

  constructor() {
  }

  ngOnInit() {
  }

  // agInit(params) {
  //   this.params = params;
  // }

  afterGuiAttached() {
  }

  refresh(params) {
    params.data.checked = params.value;
    return false;
  }
}
