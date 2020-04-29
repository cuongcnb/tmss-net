import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ContactCustomModel } from '../../../../core/models/fir/contact-custom.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'info-refer',
  templateUrl: './info-refer.component.html',
  styleUrls: ['./info-refer.component.scss']
})
export class InfoReferComponent implements OnInit, OnChanges {
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  @Input() detailData;
  gridField;
  gridParams;
  fieldGrid;
  selectedData: ContactCustomModel;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.selectedData = this.detailData;
  }

  onSubmit() {
  }

  refresh() {
  }
}
