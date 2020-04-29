import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {CoreModule} from '../../core/core.module';
import {SystemUserAndGroupDefinitionComponent} from './system-user-and-group-definition/system-user-and-group-definition.component';
import {SystemUserModalComponent} from './system-user-and-group-definition/system-user-modal/system-user-modal.component';
import {UserGroupAndAuthorityComponent} from './user-group-and-authority/user-group-and-authority.component';
import {SystemFunctionListComponent} from './system-function-list/system-function-list.component';
import {SystemGroupAssignModalComponent} from './system-user-and-group-definition/system-group-assign-modal/system-group-assign-modal.component';
import {AddSystemFunctionListModalComponent} from './system-function-list/add-system-function-list-modal/add-system-function-list-modal.component';
import {AddUserGroupModalComponent} from './user-group-and-authority/add-user-group-modal/add-user-group-modal.component';
import {UserGroupAuthorityCheckboxComponent} from './user-group-and-authority/user-group-authority-checkbox/user-group-authority-checkbox.component';
import {MenuFunctionAssignComponent} from './user-group-and-authority/menu-function-assign/menu-function-assign.component';
import {ModifyMenuModalComponent} from './system-function-list/modify-menu-modal/modify-menu-modal.component';
import {UpdatePasswordComponent} from './system-user-and-group-definition/update-password/update-password.component';
import {UserManagementComponent} from './user-group-auth/user-management.component';
import {AddGroupInfoModalComponent} from './user-group-auth/add-group-info-modal/add-group-info-modal.component';
import {AddUserInfoModalComponent} from './user-group-auth/add-user-info-modal/add-user-info-modal.component';
import {CheckboxUserComponent} from './user-group-auth/checkbox-user/checkbox-user.component';
import {TabsModule} from 'ngx-bootstrap';
import {TMSSTabs} from '../../core/constains/tabs';
import {DeclareIpComponent} from './declare-ip/declare-ip.component';
import {DeclareIpDlrComponent} from './declare-ip/declare-ip-dlr/declare-ip-dlr.component';

const Components = [
  SystemUserAndGroupDefinitionComponent,
  SystemUserModalComponent,
  UserGroupAndAuthorityComponent,
  SystemFunctionListComponent,
  SystemGroupAssignModalComponent,
  AddSystemFunctionListModalComponent,
  AddUserGroupModalComponent,
  UserManagementComponent,
  DeclareIpComponent,
  DeclareIpDlrComponent
];

const EntryComponents = [
  UserGroupAuthorityCheckboxComponent,
  AddGroupInfoModalComponent,
  AddUserInfoModalComponent,
  CheckboxUserComponent,
  SystemUserAndGroupDefinitionComponent,
  UserGroupAndAuthorityComponent,
  UserManagementComponent,
  SystemFunctionListComponent,
  DeclareIpComponent
];

const map = {
  [TMSSTabs.systemUserAndGroupDefinition]: SystemUserAndGroupDefinitionComponent,
  [TMSSTabs.userGroupAndAuthority]: UserGroupAndAuthorityComponent,
  [TMSSTabs.userManagement]: UserManagementComponent,
  [TMSSTabs.systemFunctionList]: SystemFunctionListComponent,
  [TMSSTabs.declareIp]: DeclareIpComponent
};

@NgModule({
  imports: [
    CommonModule,
    TabsModule.forRoot(),
    SharedModule,
    CoreModule
  ],
  declarations: [
    Components,
    UserGroupAuthorityCheckboxComponent,
    MenuFunctionAssignComponent,
    ModifyMenuModalComponent,
    UpdatePasswordComponent,
    AddGroupInfoModalComponent,
    AddUserInfoModalComponent,
    CheckboxUserComponent,
    DeclareIpDlrComponent
  ],
  exports: [
    Components
  ],
  entryComponents: [
    EntryComponents
  ]
})
export class SystemAdminModule {
  static getComponent(key) {
    return map[key];
  }
}
