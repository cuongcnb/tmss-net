import {Component, OnInit, ViewChild, Output, EventEmitter, Input} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FormStoringService} from '../../../../shared/common-service/form-storing.service';
import {StorageKeys} from '../../../../core/constains/storageKeys';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {UserColumnService} from '../../../../api/admin/user-column.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cbu-display-choosing-modal',
  templateUrl: './cbu-display-choosing-modal.component.html',
  styleUrls: ['./cbu-display-choosing-modal.component.scss']
})
export class CbuDisplayChoosingModalComponent implements OnInit {
  @Input() isCbu: boolean;
  @ViewChild('cbuDisplayChoosingModal', {static: false}) cbuDisplayChoosingModal: ModalDirective;
  @Output() submitFieldToDisplay = new EventEmitter();
  form: FormGroup;
  groups = [];

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private formStoringService: FormStoringService,
    private userColumnService: UserColumnService,
  ) {
  }

  private getColumnsAuthorize() {
    this.loadingService.setDisplay(true);
    this.userColumnService.getColumnsAuthorize(this.isCbu ? 'cbu' : 'ckd')
      .subscribe(groupColumns => {
        if (groupColumns) {
          const fields = {};
          this.groups = groupColumns.groups.filter(group => {
            fields[group.groupId] = group.columns[0].stateGroup === 'Y';
            return group.groupCode !== 'VEHICLES';
          });
          this.formStoringService.set(this.isCbu ? StorageKeys.cbuDisplayGroup : StorageKeys.ckdDisplayGroup, fields);
          this.buildForm(this.isCbu
            ? this.formStoringService.get(StorageKeys.cbuDisplayGroup)
            : this.formStoringService.get(StorageKeys.ckdDisplayGroup));
        }
        this.loadingService.setDisplay(false);
      });
  }

  ngOnInit() {
  }

  open() {
    this.getColumnsAuthorize();
    this.cbuDisplayChoosingModal.show();
  }

  reset() {
    this.form = undefined;
  }

  getCustomTableField() {
    let allColumns = [];
    this.groups.forEach(group => {
      group.columns.forEach(column => column.stateGroup = this.form.value[group.groupId] ? 'Y' : 'N');
      allColumns = [...allColumns, ...group.columns];
    });
    this.userColumnService.updateStateGroup({ listUpdate: allColumns }).subscribe(() => {
        this.formStoringService.set(this.isCbu ? StorageKeys.cbuDisplayGroup : StorageKeys.ckdDisplayGroup, this.form.value);
        this.submitFieldToDisplay.emit();
        this.cbuDisplayChoosingModal.hide();
      });
  }

  unCheckAll() {
    this.buildForm();
  }

  private buildForm(fieldToDisplay?) {
    const formControlName = {pinned: [true]};

    for (const group of this.groups) {
      formControlName[group.groupId] = [false];
    }
    this.form = this.formBuilder.group(formControlName);

    if (fieldToDisplay) {
      this.form.patchValue(fieldToDisplay);
    }
  }
}
