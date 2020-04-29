import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SystemUserGroupDefinitionApi} from '../../../../api/system-admin/system-user-group-definition.api';
import {StorageKeys} from '../../../../core/constains/storageKeys';
import {FormStoringService} from '../../../../shared/common-service/form-storing.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'system-group-assign-modal',
  templateUrl: './system-group-assign-modal.component.html',
  styleUrls: ['./system-group-assign-modal.component.scss']
})
export class SystemGroupAssignModalComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  fieldGridGroupList;

  selectedCreateUser;
  selectedGroupAssignment;
  systemGroupList: Array<any>;
  currentUser;

  constructor(
    private formBuilder: FormBuilder,
    private systemUserGroupDefinitionApi: SystemUserGroupDefinitionApi,
    private formStoringService: FormStoringService
  ) {
    this.fieldGridGroupList = [
      {field: 'groupName'},
      {field: 'description'}
    ];
    this.currentUser = this.formStoringService.get(StorageKeys.currentUser);

  }

  ngOnInit() {
  }

  open(selectedCreateUser, selectedGroupAssignment?) {
    this.systemUserGroupDefinitionApi.getAllActiveSystemGroup().subscribe(systemGroupList => this.systemGroupList = this.currentUser.dealerId > 0
      ? systemGroupList.filter(it => [null, -1, -2, this.currentUser.dealerId].includes(it.dealerId)) : systemGroupList);
    this.selectedCreateUser = selectedCreateUser;
    this.selectedGroupAssignment = selectedGroupAssignment;
    this.buildForm();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
  }

  save() {
    this.close.emit(this.form.value.groupControl);
    this.modal.hide();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      groupControl: [undefined]
    });
  }

}
