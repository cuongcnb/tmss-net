import { Component, OnInit, ViewChild } from '@angular/core';
import { ModifyAfterProcessModel } from '../../../../core/models/fir/modify-after-process.model';
import { ModalDirective } from 'ngx-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lslh-modal',
  templateUrl: './lslh-modal.component.html',
  styleUrls: ['./lslh-modal.component.scss'],
})
export class LslhModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  selectedData: ModifyAfterProcessModel;
  form: FormGroup;
  modalHeight: number;
  fieldGrid;
  addGridParams;
  lslh;

  constructor(
    private formBuilder: FormBuilder,
    private modalHeightService: SetModalHeightService,
  ) {
  }

  ngOnInit() {
    this.fieldGrid = [
      {headerName: 'Ngày liên hệ', headerTooltip: 'Ngày liên hệ', field: 'dateContact'},
      {headerName: 'Giờ liên hệ', headerTooltip: 'Giờ liên hệ', field: 'timeContact'},
      {headerName: 'Người liên hệ', headerTooltip: 'Người liên hệ', field: 'contacter'},
      {headerName: 'Trạng thái liên hệ', headerTooltip: 'Trạng thái liên hệ', field: 'statusContact'},
      {headerName: 'Ý kiến khách hàng khi liên lạc thành công', headerTooltip: 'Ý kiến khách hàng khi liên lạc thành công', field: 'customerFeedBack'},
      {headerName: 'Lý do liên hệ không thành công', headerTooltip: 'Lý do liên hệ không thành công', field: 'reasonContactFail'},
      {headerName: 'Lý do không liên hệ', headerTooltip: 'Lý do không liên hệ', field: 'reasonNotContact'},
    ];
    this.lslh = [{
      dateContact: '15/12/2018',
      timeContact: '15:20:45',
      contacter: 'Nguyễn Văn Hưng',
      statusContact: 'Thanh cong',
      customerFeedBack: 'Khá tốt',
      reasonContactFail: '',
      reasonNotContact: '',
    }];
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.buildForm();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  callbackGrid(params) {
    this.addGridParams = params;
    this.addGridParams.api.setRowData(this.lslh);
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      dateContact: [undefined],
      timeContact: [undefined],
      contacter: [undefined],
      statusContact: [undefined],
      customerFeedBack: [undefined],
      reasonContactFail: [undefined],
      reasonNotContact: [undefined],
    });
  }
}
