import {Component, OnInit, ViewChild} from '@angular/core';
import {LoadingService} from '../../../shared/loading/loading.service';
import {ToastService} from '../../../shared/swal-alert/toast.service';
import {isEqual} from 'lodash';
import {SysUserApi} from '../../../api/system-admin/sys-user.api';
import {AuthorizeApi} from '../../../api/system-admin/authorize.api';
import {StorageKeys} from '../../../core/constains/storageKeys';
import {FormStoringService} from '../../../shared/common-service/form-storing.service';
import {DealerApi} from '../../../api/sales-api/dealer/dealer.api';
import {ConfirmService} from '../../../shared/confirmation/confirm.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'create-system-user',
  templateUrl: './system-user-and-group-definition.component.html',
  styleUrls: ['./system-user-and-group-definition.component.scss']
})
export class SystemUserAndGroupDefinitionComponent implements OnInit {
  @ViewChild('forceSelectUser', {static: false}) forceSelectUser;
  @ViewChild('createUserModal', {static: false}) updateUserModal;
  @ViewChild('confirmChangeModal', {static: false}) confirmChangeModal;
  @ViewChild('updatePass', {static: false}) updatePass;
  @ViewChild('systemGroupAssignModal', {static: false}) systemGroupAssignModal;
  @ViewChild('switchUserDefWhileEditing', {static: false}) switchUserDefWhileEditing;
  fieldGridCreateUser;
  userCreatedParams;
  createUserData: Array<any>;
  selectedUser: any;
  isConfirmChange: boolean;
  activeUser: boolean;
  fieldGridGroupAssignment;
  groupAssignmentParams;
  groupAssignmentData: Array<any>;
  displayedUserGroupData: Array<any>;
  selectedGroupAssignment: any;
  currentUser;
  listDealer;

  constructor(
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private authorizeApi: AuthorizeApi,
    private sysUserApi: SysUserApi,
    private formStoringService: FormStoringService,
    private dealerApi: DealerApi,
    private confirmService: ConfirmService
  ) {
    this.fieldGridCreateUser = [
      {headerName: 'Mã', headerTooltip: 'Mã', field: 'code', width: 100, cellStyle: {textAlign: 'center'}},
      {headerName: 'TMV/Dealer', headerTooltip: 'TMV/Dealer', field: 'vnName', width: 250},
      {headerName: 'Tên Người Dùng', headerTooltip: 'Tên Người Dùng', field: 'userName', width: 150},
      {headerName: 'Họ Tên', headerTooltip: 'Họ Tên', field: 'fullUserName', width: 200},
      {headerName: 'Nhân Viên', headerTooltip: 'Nhân Viên', field: 'empName', width: 200},
      {headerName: 'Active?', headerTooltip: 'is Active ?', width: 100,  field: 'isLock',
        cellStyle: {textAlign: 'center'}, cellRenderer: params => {
          return `<input type='checkbox' disabled ${params.data.isLock === 'N' ||  params.data.isLock === null ? 'checked' : ''} />`;
        }}
    ];
    this.fieldGridGroupAssignment = [
      {headerName: 'Tên Nhóm', headerTooltip: 'Tên Nhóm', field: 'groupName'},
      {headerName: 'Mô Tả', headerTooltip: 'Mô Tả', field: 'description'}
    ];
    this.currentUser = this.formStoringService.get(StorageKeys.currentUser);
  }

  ngOnInit() {
    this.dealerApi.getAllAvailableDealers().subscribe(res => {
      this.listDealer = res;
    });
  }

  callbackGridCreateUser(params) {
    this.userCreatedParams = params;
    this.refreshCreateUser();
  }

  changeStatusUser() {
    const user = this.selectedUser;
    if (this.activeUser) {
      user.isLock = 'Y';
      this.confirmService.openConfirmModal('Question?', 'Do you want to lock user?').subscribe(() => {
        this.sysUserApi.changeStatusUser(user).subscribe(res => {
          this.callbackGridCreateUser(this.userCreatedParams);
          this.swalAlertService.openSuccessToast('Lock User Successfully');
        }, err => this.swalAlertService.openFailToast('Failed'));
      });
    } else {
      user.isLock = 'N';
      this.confirmService.openConfirmModal('Question?', 'Do you want to active user').subscribe(() => {
        this.sysUserApi.changeStatusUser(user).subscribe(res => {
          this.callbackGridCreateUser(this.userCreatedParams);
          this.swalAlertService.openSuccessToast('Active User Successfully');
        }, err => this.swalAlertService.openFailToast('Failed'));
      });
    }
  }

  refreshCreateUser() {
    this.selectedUser = undefined;
    this.loadingService.setDisplay(true);
    this.sysUserApi.getAllUser().subscribe(createUserData => {
      this.loadingService.setDisplay(false);
      this.createUserData = createUserData;
      this.createUserData.map(it => {
        const dlr = this.listDealer ? this.listDealer.find(el => el.id === it.dealerId) : null;
        it.code = dlr ? dlr.code : null;
        return it;
      });
      if (this.currentUser.dealerId > 0) {
        const data = this.createUserData.filter(it => it.dealerId === this.currentUser.dealerId);
        this.userCreatedParams.api.setRowData(data);
      } else {
        this.userCreatedParams.api.setRowData(this.createUserData);
      }
      this.userCreatedParams.api.sizeColumnsToFit(this.userCreatedParams);
    });
  }

  getParamsCreateUser() {
    if (!isEqual(this.groupAssignmentData, this.displayedUserGroupData)) {
      this.switchUserDefWhileEditing.show();
    } else {
      this.forceSwitchUserDef();
    }
  }

  forceSwitchUserDef() {
    const selectedUser = this.userCreatedParams.api.getSelectedRows();
    if (selectedUser) {
      this.selectedUser = selectedUser[0];
      if (this.selectedUser.isLock === 'N' || this.selectedUser.isLock === null) {
        this.activeUser = true;
      } else {
        this.activeUser = false;
      }
      this.refreshGroupAssign();
    }
  }

  updateUser() {
    if (this.selectedUser) {
      this.updateUserModal.open(this.selectedUser);
    } else {
      this.forceSelectUser.show();
    }
  }

  updatePassword() {
    if (this.selectedUser) {
      this.updatePass.open(this.selectedUser);
    } else {
      this.forceSelectUser.show();
    }
  }

  callbackGridGroupAssignment(params) {
    this.groupAssignmentParams = params;
  }

  getParamsGridAssignment() {
    const selectedGroupAssignment = this.groupAssignmentParams.api.getSelectedRows();
    if (selectedGroupAssignment) {
      this.selectedGroupAssignment = selectedGroupAssignment[0];
    }
  }

  refreshGroupAssign() {
    if (this.selectedUser) {
      this.loadingService.setDisplay(true);
      this.authorizeApi.getGroupByUserId(this.selectedUser.id).subscribe(groupAssignmentData => {
        this.groupAssignmentData = this.currentUser.dealerId > 0
          ? groupAssignmentData.filter(it => [null, -1, -2, this.currentUser.dealerId].includes(it.dealerId)) : groupAssignmentData;
        this.displayedUserGroupData = this.groupAssignmentData;
        this.groupAssignmentParams.api.setRowData(this.groupAssignmentData);
        this.loadingService.setDisplay(false);
      });
    } else {
      this.groupAssignmentParams.api.setRowData();
    }
  }

  setDataToGroupAssignTable(groupOfUser) {
    this.getDisplayedData();
    if (groupOfUser) {
      if (this.displayedUserGroupData.find(item => item.groupId === groupOfUser.groupId)) {
        this.swalAlertService.openFailToast('Group này đã được đính vào user');
      } else {
        this.groupAssignmentParams.api.updateRowData({add: [groupOfUser]});
      }
    }
  }

  removeSelectedRow() {
    this.groupAssignmentParams.api.updateRowData({remove: [this.selectedGroupAssignment]});
    this.selectedGroupAssignment = undefined;
    this.getDisplayedData();
  }

  private getDisplayedData() {
    const displayedData = [];
    this.groupAssignmentParams.api.forEachNode(node => {
      displayedData.push(node.data);
    });
    this.displayedUserGroupData = displayedData;
  }

  saveUserGroup() {
    this.getDisplayedData();

    if (!isEqual(this.groupAssignmentData, this.displayedUserGroupData) && !this.isConfirmChange) {
      this.confirmChangeModal.show();
      return;
    }

    this.loadingService.setDisplay(true);
    this.authorizeApi.saveGroupOfUser(this.selectedUser.id, this.displayedUserGroupData).subscribe(() => {
      this.refreshGroupAssign();
      this.isConfirmChange = false;
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessToast();
    });
  }
}
