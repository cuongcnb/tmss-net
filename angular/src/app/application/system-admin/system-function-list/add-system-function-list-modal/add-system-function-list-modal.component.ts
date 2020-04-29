import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SystemFunctionListApi} from '../../../../api/system-admin/system-function-list.api';
import {ToastService} from '../../../../shared/swal-alert/toast.service';
import {StorageKeys} from '../../../../core/constains/storageKeys';
import {FormStoringService} from '../../../../shared/common-service/form-storing.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'add-system-fucntion-list-modal',
  templateUrl: './add-system-function-list-modal.component.html',
  styleUrls: ['./add-system-function-list-modal.component.scss']
})
export class AddSystemFunctionListModalComponent {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  @ViewChild('addFunctionConfirmModal', {static: false}) addFunctionConfirmModal;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  functions: Array<any>;
  menus: Array<any>;
  isAddToMenu: boolean;
  functionFieldGrid;
  menuFieldGrid;
  currentUser;

  constructor(
    private formBuilder: FormBuilder,
    private swalAlertService: ToastService,
    private systemFunctionListApi: SystemFunctionListApi,
    private formStoringService: FormStoringService
  ) {
    this.functionFieldGrid = [
      {headerName: 'Tên', headerTooltip: 'Tên', field: 'functionName'},
      {headerName: 'Nhãn', headerTooltip: 'Nhãn', field: 'functionLabel'},
      {headerName: 'Mô Tả', headerTooltip: 'Mô Tả', field: 'functionDescription'}
    ];
    this.menuFieldGrid = [
      {headerName: 'Tên', headerTooltip: 'Tên', field: 'menuName'},
      {headerName: 'Nhãn', headerTooltip: 'Nhãn', field: 'menuLabel'},
      {headerName: 'Mô Tả', headerTooltip: 'Mô Tả', field: 'menuDescription'}
    ];
    this.currentUser = this.formStoringService.get(StorageKeys.currentUser);

  }

  open(functions, isAddToMenu?) {
    this.isAddToMenu = isAddToMenu;
    if (this.isAddToMenu) {
      this.systemFunctionListApi.getAll().subscribe(menus => this.menus = this.currentUser.dealerId > 0
        ? menus.filter(it => [null, -1 , -2, this.currentUser.dealerId].includes(it.dealerId)) : menus);
    }
    this.functions = functions;
    this.buildForm();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
  }

  save() {
    if (this.isAddToMenu && (!this.form.value.functionControl || !this.form.value.menuControl)) {
      this.swalAlertService.openFailToast('Bạn phải nhập đủ function và menu');
      return;
    }

    let value = this.form.value;
    if (this.isAddToMenu) {
      value = Object.assign({}, value.functionControl, {
        menuControl: value.menuControl
      });
    }

    this.close.emit([value]);
    this.addFunctionConfirmModal.show();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      functionControl: [undefined],
      menuControl: [undefined]
    });
  }

}
