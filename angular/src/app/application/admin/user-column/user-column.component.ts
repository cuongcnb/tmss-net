import {Component, OnInit} from '@angular/core';
import {LoadingService} from '../../../shared/loading/loading.service';
import {FormService} from '../../../api/admin/form.service';
import {FormGroupService} from '../../../api/admin/form-group.service';
import {UserColumnService} from '../../../api/admin/user-column.service';
import {FormStoringService} from '../../../shared/common-service/form-storing.service';
import {CreateUserService} from '../../../api/system-admin/create-user.service';
import {IsViewCheckboxComponent} from './is-view-checkbox.component';
import {IsUpdateCheckboxComponent} from './is-update-checkbox.component';
import {CommonService} from '../../../shared/common-service/common.service';
import {UpdateCheckboxUserColumnService} from './update-checkbox-user-column.service';
import {EventBusType} from '../../../core/constains/eventBusType';
import {EventBusService} from '../../../shared/common-service/event-bus.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ToastService} from '../../../shared/common-service/toast.service';
import {ConfirmService} from '../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'user-column',
  templateUrl: './user-column.component.html',
  styleUrls: ['./user-column.component.scss']
})
export class UserColumnComponent implements OnInit {
  isViewAll = false;
  isUpdateAll = false;
  isChanged = false;
  form: FormGroup;
  stateGroup: string;

  usersData;
  userGridField;
  formsData;
  groupsData;

  gridField;
  gridParam;
  columnsData;

  constructor(
    private loadingService: LoadingService,
    private formBuilder: FormBuilder,
    private formService: FormService,
    private formGroupService: FormGroupService,
    private formStoringService: FormStoringService,
    private userColumnService: UserColumnService,
    private createUserService: CreateUserService,
    private swalAlertService: ToastService,
    private confirmationService: ConfirmService,
    private commonService: CommonService,
    private eventBusService: EventBusService,
    private updateCheckboxUserColumnService: UpdateCheckboxUserColumnService) {
  }

  ngOnInit() {
    this.gridField = [
      {
        headerName: 'Column Code',
        field: 'columnCode',
        minWidth: 200,
      },
      {
        headerName: 'Column Des',
        field: 'columnDes',
        minWidth: 200,
      },
      {
        headerName: 'Is View',
        field: 'isView',
        cellStyle: { textAlign: 'center' },
        cellRendererFramework: IsViewCheckboxComponent,
      },
      {
        headerName: 'Is Update',
        field: 'isUpdate',
        cellStyle: { textAlign: 'center' },
        cellRendererFramework: IsUpdateCheckboxComponent,
      },
    ];
    this.userGridField = [
      { headerName: 'Username', field: 'userName' },
      { headerName: 'Name', field: 'fullUserName' },
    ];
    this.buildForm();
    this.getTMVUserData();
    this.getFormList();
    this.updateCheckboxUserColumnService.onViewChange.subscribe(() => {
      this.isViewAll = !this.commonService.isObjectInListByKey(this.columnsData, { isView: false }, 'isView');
    });
    this.updateCheckboxUserColumnService.onUpdateChange.subscribe(() => {
      this.isUpdateAll = !this.commonService.isObjectInListByKey(this.columnsData, { isUpdate: false }, 'isUpdate');
    });
    this.eventBusService.on(EventBusType.isChangedUserColumn).subscribe(() => this.isChanged = true);
  }

  isViewAllChange() {
    this.setFullGridData('view');
  }

  isUpdateAllChange() {
    this.setFullGridData('update');
  }

  save() {
    // Get data to request
    const dataArr = [];
    this.gridParam.api.forEachNode(node => {
      if (typeof node.data.isView === 'boolean') {
        node.data.isView = node.data.isView ? '1' : '0';
      }
      if (typeof node.data.isUpdate === 'boolean') {
        node.data.isUpdate = node.data.isUpdate ? '1' : '0';
      }
      const value = {
        groupId: node.data.groupId,
        columnId: node.data.columnId,
        isView: node.data.isView,
        isUpdate: node.data.isUpdate,
        userId: this.form.value.user.id,
        formId: this.form.controls.formId.value,
        stateGroup: this.stateGroup,
      };
      dataArr.push(value);
    });

    // Call API
    this.userColumnService.saveColumnRole(dataArr)
      .subscribe(() => {
        this.loadingService.setDisplay(false);
        this.isChanged = false;
        this.getColumnsData();
        this.swalAlertService.openSuccessModal();
      });
  }

  callbackGrid(params) {
    this.gridParam = params;
    this.gridParam.api.setRowData();
  }

  refreshList() {
    this.getColumnsData();
  }

  getColumnsData() {
    if (this.isChanged) {
      this.confirmationService.openConfirmModal('Are you sure', 'Do you want to save changes?')
        .subscribe(() => {
          this.save();
          this.isChanged = false;
        }, () => {
          this.getColumnsData();
          this.isChanged = false;
        });
    } else {
      // Reset to default setting
      this.columnsData = undefined;
      this.isViewAll = false;
      this.isUpdateAll = false;
      this.gridParam.api.setRowData();
      // Call API
      if (this.form.value.groupId && this.form.value.user) {
        const value = {
          userId: this.form.value.user.id,
          groupId: this.form.value.groupId,
          formId : this.form.value.formId,
        };
        this.loadingService.setDisplay(true);
        this.userColumnService.getColumns(value)
          .subscribe(columns => {
            this.columnsData = columns;
            columns
              ? this.gridParam.api.setRowData(columns)
              : this.gridParam.api.setRowData();
            if (this.columnsData) {
              this.isViewAll = !this.commonService.isObjectInListByKey(this.columnsData, { isView: '0' }, 'isView');
              this.isUpdateAll = !this.commonService.isObjectInListByKey(this.columnsData, { isUpdate: '0' }, 'isUpdate');
              this.columnsData.forEach(element => {
                this.stateGroup = element.stateGroup;
              });
            }
            this.loadingService.setDisplay(false);
          });
      }
    }
  }

  getGroupData() {
    if (this.isChanged) {
      this.confirmationService.openConfirmModal('Are you sure', 'Do you want to save changes?')
        .subscribe(() => {
          this.save();
          this.isChanged = false;
        }, () => {
          this.getGroupData();
          this.isChanged = false;
        });
    } else {
      // Reset to default setting
      this.form.patchValue({ groupId: undefined });
      this.columnsData = undefined;
      this.isViewAll = false;
      this.isUpdateAll = false;
      this.gridParam.api.setRowData();
      // Call API
      if (this.form.value.formId) {
        // if (this.selectedForm) {
        this.loadingService.setDisplay(true);
        this.formGroupService.getGroupsAvailable(this.form.value.formId)
          .subscribe(groups => {
            this.groupsData = groups.filter(group => group.groupCode !== 'VEHICLES');
            this.loadingService.setDisplay(false);
          });
      }
    }
  }

  private setFullGridData(type: string) {
    const dataArr = [];
    if (type === 'view') {
      if (!this.isViewAll) {
        this.isUpdateAll = this.isViewAll;
        this.gridParam.api.forEachNode(node => {
          node.data.isView = this.isViewAll;
          node.data.isUpdate = this.isUpdateAll;
          dataArr.push(node.data);
        });
      } else {
        this.gridParam.api.forEachNode(node => {
          node.data.isView = this.isViewAll;
          dataArr.push(node.data);
        });
      }
    }
    if (type === 'update') {
      if (this.isUpdateAll) {
        this.isViewAll = this.isUpdateAll;
        this.gridParam.api.forEachNode(node => {
          node.data.isUpdate = this.isUpdateAll;
          node.data.isView = this.isViewAll;
          dataArr.push(node.data);
        });
      } else {
        this.gridParam.api.forEachNode(node => {
          node.data.isUpdate = this.isUpdateAll;
          dataArr.push(node.data);
        });
      }
    }
    this.isChanged = true;
    this.gridParam.api.setRowData(dataArr);
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      user: [undefined],
      formId: [undefined],
      groupId: [undefined],
    });
    this.form.valueChanges.subscribe(val => {
      if (val) {
        this.getColumnsData();
      }
    });
    this.form.get('formId').valueChanges.subscribe(val => {
      if (val) {
        this.getGroupData();
      }
    });
  }

  private getFormList() {
    this.loadingService.setDisplay(true);
    this.formService.getList().subscribe(forms => {
      this.formsData = forms;
      this.loadingService.setDisplay(false);
    });
  }

  private getTMVUserData() {
    this.loadingService.setDisplay(true);
    this.createUserService.getTMVUser().subscribe(users => {
      this.usersData = users;
      this.loadingService.setDisplay(false);
    });
  }
}
