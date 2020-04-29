import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ContactCustomModel } from '../../../../core/models/fir/contact-custom.model';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'repair-history',
  templateUrl: './repair-history.component.html',
  styleUrls: ['./repair-history.component.scss']
})
export class RepairHistoryComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData: ContactCustomModel;
  form: FormGroup;
  fieldGrid;
  data: Array<any>;
  gridParams;
  selectRowGrid: any;
  modalHeight: number;

  constructor(
    private setModalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.fieldGrid = [
      {headerName: 'Đại lý', headerTooltip: 'Đại lý', field: 'agency'},
      {headerName: 'Số lệnh sửa chữa', headerTooltip: 'Số lệnh sửa chữa', field: 'commandRepair'},
      {headerName: 'Số VIN', headerTooltip: 'Số VIN', field: 'vinNo'},
      {headerName: 'BKS', headerTooltip: 'BKS', field: 'licensePlate'},
      {headerName: 'Ngày xe đến', headerTooltip: 'Ngày xe đến', field: 'dayIn'},
      {headerName: 'Ngày ra xe', headerTooltip: 'Ngày ra xe', field: 'dayOut'},
      {headerName: 'Số km vào', headerTooltip: 'Số km vào', field: 'sumKm'},
      {headerName: 'CVDV', headerTooltip: 'Cố vấn dịch vụ', field: 'serviceAdvisor'},
      {headerName: 'Tổ KTV', headerTooltip: 'Tổ KTV', field: 'techniciansName'},
    ];
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResizeWithoutFooter();
  }

  refresh() {
    this.form = undefined;
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.gridParams.api.setRowData([this.selectedData]);
    this.modal.show();
  }

  callbackGrid(params) {
    this.gridParams = params;
  }
  private buildForm() {
    this.form = this.formBuilder.group({
      vin: [undefined] ,
      licensePlate: [undefined]
    });
  }
  getParams() {
    const selectedData = this.gridParams.api.getSelectedRows();
    if (selectedData) {
      this.selectRowGrid = selectedData[0];
    }
  }
}
