import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { UserManagementApi } from '../../../api/system-admin/user-management.api';
import { CheckboxUserComponent } from './checkbox-user/checkbox-user.component';
import { LoadingService } from '../../../shared/loading/loading.service';
import { ToastService } from '../../../shared/swal-alert/toast.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  @ViewChild('deleteGroupModal', {static: false}) deleteGroupModal: ModalDirective;

  stringAuthUser;
  stringAuthUserGroup;
  stringAuthGroupInfo;
  stringAuthFunctionGroup;

  form: FormGroup;
  view;
  gridApiListInformation;

  rowGroupPanelShow = 'always';

  fieldGridFunction;
  fieldGridUserInformation;
  gridApiUserInformation;
  gridApiFunction;
  selectedData;
  isLocked = false;
  UserGroupData;
  DataUser;
  userName = '';
  fullName = '';
  // group
  fieldGridGroup;
  fieldGridMenuGroup;
  fieldGridUserInGroup;
  gridApiUserInGroup;
  gridApiGroup;
  gridApiMenuGroup;
  FunctionGroupData;
  MenuGroupData;


  autoGroupColumnDefListGroup;
  autoGroupColumnDefGroup;
  autoMenuGroupColumnDefGroup;
  autoGroupColumnDefFunction;

  fieldGridListGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userManagementApi: UserManagementApi,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private toastrService: ToastrService
  ) {
    this.fieldGridFunction = [
      {
        headerName: 'Menu', headerTooltip: 'Menu', field: 'menuText', rowGroup: true, cellRenderer: this.customFieldRowGroupFunction,
        tooltipValueGetter: (t: any) => t.value,
      },
      {
        headerName: 'Form', headerTooltip: 'Form', field: 'formText', cellRenderer: this.customFieldRowGroupFunction,
        tooltipValueGetter: (t: any) => t.value,
      },
      {
        headerName: 'Chức Năng', headerTooltip: 'Chức Năng', field: 'formFunctionText', rowGroup: true,
        tooltipValueGetter: (t: any) => t.value,
      },
      {
        headerName: 'Button', headerTooltip: 'Button', field: 'buttonText',
        tooltipValueGetter: (t: any) => t.value,
      },
      {field: 'itemType'}
    ];
    this.autoGroupColumnDefFunction = {
      headerName: 'Item',
      headerTooltip: 'Item',
      field: 'functionText',
      tooltipValueGetter: (t: any) => t.value,
    };
    this.fieldGridGroup = [
      {
        field: 'checked', cellRendererFramework: CheckboxUserComponent, cellStyle: {'text-align': 'center'},
        tooltipValueGetter: (t: any) => t.value,
      },
      {
        headerName: 'Menu', headerTooltip: 'Menu', field: 'menuText', rowGroup: true, cellRenderer: this.customFieldRowGroupFunction,
        tooltipValueGetter: (t: any) => t.value,
      },
      {
        headerName: 'Form', headerTooltip: 'Form', field: 'formText', cellRenderer: this.customFieldRowGroupFunction,
        tooltipValueGetter: (t: any) => t.value,
      },
      {
        headerName: 'Chức Năng', headerTooltip: 'Chức Năng', field: 'formFunctionText',
        tooltipValueGetter: (t: any) => t.value,
      },
      {
        headerName: 'ItemType', headerTooltip: 'ItemType', field: 'itemType', cellRenderer: this.customFieldRow,
        tooltipValueGetter: (t: any) => t.value,
      }
    ]
    ;
    this.fieldGridMenuGroup = [

      {
        field: 'menuName', rowGroup: true, hide: true,
      },
      {
        field: 'subMenuName', rowGroup: true, hide: true,
      },
      {
        field: 'checked', cellRendererFramework: CheckboxUserComponent, cellStyle: {'text-align': 'center'},
      },
      {
        headerName: 'Function', headerTooltip: 'Function', field: 'functionName',
      },
    ]
    ;
    this.autoGroupColumnDefGroup = {
      headerName: 'Item',
      field: 'functionText',
      cellRenderer: 'agGroupCellRenderer',
      tooltipValueGetter: (t: any) => t.value,
    };
    this.autoMenuGroupColumnDefGroup = {
      headerName: 'Parent',
      headerTooltip: 'Parent',
      field: 'parent',
      cellRenderer: 'agGroupCellRenderer',
      tooltipValueGetter: (t: any) => t.value,
    };
    this.autoGroupColumnDefFunction = {
      headerName: 'Item',
      headerTooltip: 'Item',
      field: 'item',
      tooltipValueGetter: (t: any) => t.value,
    };
    this.fieldGridUserInformation = [
      {
        headerName: 'In Group', headerTooltip: 'In Group', field: 'checked',
        cellStyle: {'text-align': 'center'},
        cellRendererFramework: CheckboxUserComponent,
        tooltipValueGetter: (t: any) => t.value,
      },
      {
        field: 'groupText',
        tooltipValueGetter: (t: any) => t.value,
      },
    ];
    this.fieldGridUserInGroup = [
      {
        headerName: 'In Group',
        headerTooltip: 'In Group',
        field: 'checked',
        cellStyle: {'text-align': 'center'},
        cellRenderer: params => {
          if (params.value !== undefined) {
            return `<input disabled type='checkbox' ${params.value ? 'checked' : ''} />`;
          } else {
            return;
          }
        },
        tooltipValueGetter: (t: any) => t.value,
      },
      {
        field: 'username',
        tooltipValueGetter: (t: any) => t.value,
      },
      {
        field: 'fullname',
        tooltipValueGetter: (t: any) => t.value,
      },
    ];
    this.fieldGridListGroup = [
      {
        field: 'type',
        cellRenderer: this.customFieldRowGroup,
        rowGroup: true,
        tooltipValueGetter: (t: any) => t.value,
      },
    ];
    this.autoGroupColumnDefListGroup = {
      headerName: 'Full Name',
      headerTooltip: 'Full Name',
      field: 'fullName',
      tooltipValueGetter: (t: any) => t.value,
    };
  }

  ngOnInit() {
    this.view = 'User';
    localStorage.removeItem('FunctionGroupData');
    localStorage.removeItem('MenuGroupData');
    localStorage.removeItem('UserGroupData');
    this.userManagementApi.getAuthMenuById().subscribe(() => {});
  }

  getParamsUser() {

  }

  getParamsFunction() {

  }

  getParamsGroup() {

  }

  getParamsMenuGroup() {

  }

  getParamsUserInGroup() {

  }

  callbackGridUserInGroup(params) {
    this.gridApiUserInGroup = params;
    this.gridApiUserInGroup.api.setRowData([]);
  }

  callServiceUserInGroup() {
    const obj = {
      groupId: this.selectedData.id
    };
    if (this.gridApiUserInGroup) {
      this.userManagementApi.getUserInGroup(obj).subscribe(res => {
        if (res) {
          this.gridApiUserInGroup.api.setRowData(res);
        } else {
          this.gridApiUserInGroup.api.setRowData([]);
        }
        this.gridApiUserInGroup.api.sizeColumnsToFit();
      }, () => this.gridApiUserInGroup.api.setRowData([]));

    }
  }


  callbackGridGroup(params) {
    this.gridApiGroup = params;
    this.callServiceGroup();
  }

  callbackGridMenuGroup(params) {
    this.gridApiMenuGroup = params;
    this.callServiceMenuGroup();
  }


  callbackGridFunction(params) {
    this.gridApiFunction = params;
    this.callServiceFunction();
  }

  callServiceFunction(): any {
    this.userManagementApi.getFunctionInformation().subscribe(res => {
      if (res) {
        this.gridApiFunction.api.setRowData(res);
      } else {
        this.gridApiFunction.api.setRowData([]);
      }
    }, () => this.gridApiFunction.api.setRowData([]));
  }

  callbackGridUserInformation(params) {
    this.gridApiUserInformation = params;
    params.api.setRowData([]);
    if (this.selectedData) {
      this.callServiceUserInformation();
    }
  }

  callServiceUserInformation(): any {
    const obj = {
      groupId: this.selectedData.id
    };
    this.userManagementApi.getGroupUser(obj).subscribe(res => {
      if (res) {
        localStorage.setItem('UserGroupData', JSON.stringify(res));
        this.UserGroupData = res;
        this.gridApiUserInformation.api.setRowData(res);
      } else {
        this.gridApiUserInformation.api.setRowData([]);
      }
    }, () => this.gridApiUserInformation.api.setRowData([]));
  }


  callbackGridListGroup(params) {
    this.gridApiListInformation = params;
    this.userManagementApi.getDataListInformation().subscribe(res => {
      if (res) {
        params.api.setRowData(res);
        params.api.forEachNode(node => {
          if (node.id === '0') {
            node.setSelected(true);
          }
        });
      } else {
        params.api.setRowData([]);
      }
    }, () => params.api.setRowData([]));
  }

  getParamsListGroup() {
    const rowsSelection = this.gridApiListInformation.api.getSelectedRows();
    if (rowsSelection) {
      this.selectedData = rowsSelection[0];
      this.view = this.selectedData.type;
      if (this.view === 'Function') {
        setTimeout(this.callServiceFunction(), 100)
        ;
      } else if (this.view === 'Group') {
        setTimeout(
          this.callServiceGroup(),
          this.callServiceMenuGroup(),
          this.callServiceUserInGroup(), 100);
      } else {

        setTimeout(
          this.callServiceGetUser(),
          this.callServiceUserInformation(), 100);
      }
    }
  }

  callServiceGetUser(): any {
    this.userManagementApi.getUser(this.selectedData.id).subscribe(res => {
      if (res) {
        if (res.length > 0) {
          this.DataUser = res[0];
          this.userName = res[0].userName;
          this.fullName = res[0].fullName;
          this.isLocked = Boolean(res[0].isLocked);
        } else {
          this.setDefaultUser();
        }
      } else {
        this.setDefaultUser();
        this.DataUser = null;
      }
    }, () => {
      this.DataUser = null;
      this.setDefaultUser();
    });
  }

  setDefaultUser() {
    this.userName = '';
    this.fullName = '';
    this.isLocked = false;
  }

  callServiceGroup(): any {
    const obj = {
      groupId: this.selectedData.id
    };
    this.userManagementApi.getFunctionGroup(obj).subscribe(res => {
        if (res) {
          this.FunctionGroupData = res;
          localStorage.setItem('FunctionGroupData', JSON.stringify(res));
          if (this.gridApiGroup) {
            this.gridApiGroup.api.setRowData(res);
          }
        } else {
          this.FunctionGroupData = [];
          this.gridApiGroup.api.setRowData([]);
        }
      }, () => {
        this.gridApiGroup.api.setRowData([]);
        this.FunctionGroupData = [];
      }
    );
  }

  callServiceMenuGroup(): any {
    const obj = {
      groupId: this.selectedData.id
    };
    this.userManagementApi.getMenuGroup(obj).subscribe(res => {
        if (res) {
          this.MenuGroupData = res;
          localStorage.setItem('MenuGroupData', JSON.stringify(res));
          if (this.gridApiMenuGroup) {
            this.gridApiMenuGroup.api.setRowData(res);
          }
        } else {
          this.MenuGroupData = [];
          this.gridApiMenuGroup.api.setRowData([]);
        }
        if (this.gridApiUserInGroup) {
          this.gridApiUserInGroup.api.sizeColumnsToFit();
        }

      }, () => {
        this.gridApiMenuGroup.api.setRowData([]);
        this.MenuGroupData = [];
      }
    );
  }

  customFieldRowGroup(params) {
    if (params.value) {
      if (params.node.rowGroupColumn) {
        return params.value + ' List';
      } else {
        return params.value;
      }
    } else {
      return 'Root of ' + params.node.key;
    }
  }

  customFieldRowGroupFunction(params) {
    if (params.value) {
      return params.value;
    } else {
      const field = params.colDef.field;
      if (params.node.childrenAfterGroup[0].allLeafChildren !== undefined) {
        return params.node.childrenAfterGroup[0].allLeafChildren[0].data[field];
      } else {
        return params.node.childrenAfterGroup[0].data[field];
      }
    }
  }

  customFieldRow(params) {
    if (params.value) {
      return params.value;
    } else {
      return 'Menu Form';
    }
  }

  onBtSaveUser() {
    const formFunctionId = [];
    this.gridApiUserInformation.api.forEachNode(node => {
      if (node.data) {
        if (node.data.checked === 1 || node.data.checked === true) {
          formFunctionId.push(node.data.groupId);
        }
      }
    });
    const obj = {
      userId: this.selectedData.id,
      groupList: formFunctionId.join(',')
    };
    this.userManagementApi.saveUserGroup(obj).subscribe(res => {
      this.toastrService.success('Lưu thành công', 'Thông báo');
      this.callServiceUserInformation();
    });
  }

  onBtSaveGroup() {
    const formFunctionId = [];
    this.gridApiGroup.api.forEachNode( node => {
      if (node.data) {
        if (node.data.checked === 1 || node.data.checked === true) {
          formFunctionId.push(node.data.id);
        }
      }
    });
    const obj = {
      groupId: this.selectedData.id,
      functionList: formFunctionId.join(',')
    };
    this.userManagementApi.saveFunctionGroup(obj).subscribe(res => {
      this.toastrService.success('Lưu thành công', 'Thông báo');
      this.callServiceGroup();
    });
  }

  onBtSaveMenuGroup() {
    const menuId = [];
    this.gridApiMenuGroup.api.forEachNode(node => {
      if (node.data) {
        if (node.data.checked === 1 || node.data.checked === true) {
          menuId.push(node.data.functionId);
        }
      }
    });
    const obj = {
      groupId: this.selectedData.id,
      menuList: menuId.join(',')
    };
    this.userManagementApi.saveMenuGroup(obj).subscribe(res => {
      this.toastrService.success('Lưu thành công', 'Thông báo');
      this.callServiceMenuGroup();
    });
  }

  onBtCancelUserGroup() {
    const data = JSON.parse(localStorage.getItem('UserGroupData'));
    this.gridApiUserInformation.api.setRowData(data);
  }

  onBtCancelFunctionGroup() {
    const data = JSON.parse(localStorage.getItem('FunctionGroupData'));
    this.gridApiGroup.api.setRowData(data);
  }

  onBtCancelMenuGroup() {
    const data = JSON.parse(localStorage.getItem('MenuGroupData'));
    this.gridApiMenuGroup.api.setRowData(data);
  }

  onShowModalDelete() {
    this.deleteGroupModal.show();
  }

  onSubmitModalDelete() {
    const obj = {
      groupId: this.selectedData.id
    };
    this.loadingService.setDisplay(true);
    this.userManagementApi.deleteGroup(obj).subscribe(res => {
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessToast();
      this.deleteGroupModal.hide();
      this.callbackGridListGroup(this.gridApiListInformation);
    });
  }

  a() {
    for (let i = 0; i < this.FunctionGroupData.length; i++) {
      const rowNode = this.gridApiGroup.api.getRowNode(i);
      rowNode.setDataValue('checked', true);
    }
  }

}
