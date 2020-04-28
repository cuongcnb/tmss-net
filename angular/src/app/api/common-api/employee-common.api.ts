import {Injectable, Injector} from '@angular/core';
import {BaseApiService} from '../base-api.service';
import {EnvConfigService} from '../../env-config.service';

@Injectable()
export class EmployeeCommonApi extends BaseApiService {
  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/employee');
  }

  getAll() {
    return this.get('');
  }

  getEmpByCurrentDlr() {
    return this.get(`/division`);
  }

  getEmpByDivisionOfCurrent(divisionId) {
    return this.get(`/division?id=${divisionId}`); // Get All by current dealer and division(unit)
  }

  getEmpIsAdvisor() {
    return this.get(`/isAdvisor`);
  }

  saveEmp(value) {
    return this.post(`/save`, value);

  }

  getImg(empId) {
    return this.get(`/${empId}/img`);
  }

  uploadNewImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    return this.sendForm(`/image-upload`, formData).send().response;
  }

  getEmployeeByCurrentUser() {
    return this.get(`/by-user`);
  }

  // danh sách KTV cho Bảng tiến độ đồng sơn
  getDsEmp(empType?) {
    return this.get(`/emp-ds/${empType ? empType : -1}`);
  }

  getTechiciansEmp(divId) {
    return this.get(`/techician-employee?divId=${divId}`);
  }

  getEmployees() {
    return this.get('/tech-emp');

  }

  getServiceAdvisor() {
    return this.get(`/getServiceAdvisor`);
  }

  searchEmployee(searchBody) {
    return this.post('/search-by-emp', searchBody);
  }
}
