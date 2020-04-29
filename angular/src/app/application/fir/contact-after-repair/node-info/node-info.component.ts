import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'node-info',
  templateUrl: './node-info.component.html',
  styleUrls: ['./node-info.component.scss']
})
export class NodeInfoComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData: Array<any>;
  form: FormGroup;
  modalHeight: number;

  constructor(
    private formBuilder: FormBuilder,
    private setModalHeightService: SetModalHeightService
  ) {
  }

  ngOnInit() {
    this.buildForm();
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResizeWithoutFooter();
  }

  refresh() {
    this.form = undefined;
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.modal.show();
  }

  onSubmit() {
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      content: [undefined],
    });
  }
}
