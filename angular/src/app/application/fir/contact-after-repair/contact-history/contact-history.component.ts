import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { ContactCustomModel } from '../../../../core/models/fir/contact-custom.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'contact-history',
  templateUrl: './contact-history.component.html',
  styleUrls: ['./contact-history.component.scss']
})
export class ContactHistoryComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  gridField;
  gridParams;
  fieldGrid;
  selectedData: ContactCustomModel;

  constructor() {
  }

  ngOnInit() {
    this.fieldGrid = [
      { headerName: 'Ngày liên lạc', headerTooltip: 'Ngày liên lạc', field: 'dayContact' },
      { headerName: 'Giờ liên lạc', headerTooltip: 'Giờ liên lạc', field: 'hourContact' },
      { headerName: 'Người liên lạc', headerTooltip: 'Người liên lạc', field: 'nameContact' },
      { headerName: 'Trạng thái liên lạc', headerTooltip: 'Trạng thái liên lạc', field: 'statusContact' },
      { headerName: 'Ý kiến', headerTooltip: 'Ý kiến', field: 'comment' },
      { headerName: 'Lý do', headerTooltip: 'Lý do', field: 'reason' },
      { headerName: 'Lý do liên hệ  thành công', headerTooltip: 'Lý do liên hệ  thành công', field: 'contactTrue' },
      { headerName: 'Lý do liên hệ không thành công', headerTooltip: 'Lý do liên hệ không thành công', field: 'contactFalse' },
      { headerName: 'Lý do không liên hệ', headerTooltip: 'Lý do không liên hệ', field: 'notContact' },
    ];
  }

  callbackGrid(params) {
    this.gridParams = params;
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.gridParams.api.setRowData([this.selectedData]);
    this.modal.show();
  }

  refresh() {
  }
}
