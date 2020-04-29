import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'add-discontent-complain-modal',
  templateUrl: './add-discontent-complain-modal.component.html',
  styleUrls: ['./add-discontent-complain-modal.component.scss'],
})
export class AddDiscontentComplainModalComponent implements OnInit {

  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @Input() manageComplainPotential;
  modalHeight: number;
  selectedTab;
  form: FormGroup;
  tabs: Array<any> = [];
  isUpdateModal: boolean;

  constructor(
    private modalHeightService: SetModalHeightService,
  ) {
  }

  ngOnInit() {
    this.onResize();
    this.initTabs();
    this.selectedTab = this.tabs[0];
  }

  open(complainPotential?, updateModal?) {
    this.modal.show();
    if (updateModal) {
      this.isUpdateModal = updateModal;
    }
  }

  reset() {
    this.form = undefined;
    this.isUpdateModal = undefined;
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResizeTab();
  }

  private initTabs() {
    this.tabs = ['Thông tin khiếu nại', 'Tổng kết và đánh giá'];
  }

  selectTab(tab) {
    this.selectedTab = tab;
  }
}
