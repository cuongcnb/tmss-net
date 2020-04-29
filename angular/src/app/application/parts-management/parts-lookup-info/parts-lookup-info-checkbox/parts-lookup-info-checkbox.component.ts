import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IAfterGuiAttachedParams } from 'ag-grid-community';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'part-search-checkbox',
  template: '<input type="checkbox" [(ngModel)]="params.value" (change)="this.refresh(this.params)">',
  styles: [''],
})
export class PartsLookupInfoCheckboxComponent implements OnInit {
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
