import { Injectable, Injector } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { AssignAdvisor } from '../../core/models/receptionist/receptionist.model';
import { EnvConfigService } from '../../env-config.service';

@Injectable()
export class QueuingApi extends BaseApiService {

  constructor(injector: Injector, envConfigService: EnvConfigService) {
    super(injector, envConfigService);
    this.setBaseUrl('/queuing');
  }

  createNew(data, isCheck) {
    return this.post(`/insert?is_check=${isCheck}`, data);
  }

  updateData(data) {
    // return this.put('/list', data); API cho màn hình cũ
    return this.post('/assign-list', data);
  }

  search(searchData, paginationParams?) {
    paginationParams = !!paginationParams ? paginationParams : { page: 1, size: 20, };

    const dataRequest = Object.assign({}, searchData, paginationParams);
    return this.post('/search', dataRequest);
  }

  manageInOut(id) {
    return this.put(`/cancle-out-gate/${id}`);
  }

  checkRegisterNoExist(registerNo) {
    return this.get(`/is-exist?registerNo=${registerNo}`);
  }

  searchWaitList(searchData, paginationParams = {
    page: 1,
    size: 20,
  }) {
    const dataRequest = Object.assign({}, searchData, paginationParams);
    return this.post('/receptionist/all-wait-receive', dataRequest);
  }

  searchReceiveList(searchData, paginationParams = {
    page: 1,
    size: 20,
  }) {
    const dataRequest = Object.assign({}, searchData, paginationParams);
    return this.post('/receive', dataRequest);
  }

  searchCustomerWaiting(registerNo?) {
    return this.get(`/search_receive${registerNo ? `?register_no=${registerNo}` : ''}`);
  }

  modifyUserIntoCustomer(id, type) {
    return this.put(`/customer_waiting/${id}/${type}`);
  }

  printGateInOut(id) {
    return this.downloadByGet(`/print-in-gate/${id}`);
  }

  // dành cho lễ tân
  // danh sách bàn cố vấn của Đại lý
  getAdviserDesks() {
    return this.get('/receptionist/desk-advisor');
  }

  // tìm kiếm danh sách khách chờ và khách hẹn
  getWaitingAndConsultingCustomers(timestamp, registerNo?, job?) {
    return this.get(`/receptionist/wait-assign?date=${timestamp}${!!registerNo ? `&registerNo=${registerNo}` : ''}${!!job ? `&job=${job}` : ''}`);
  }

  // danh sách khách đang tiếp nhận của các cố vấn dịch vụ
  getReceivingVehicle(timestamp) {
    return this.get(`/receptionist/vehicle-receiving?date=${timestamp}`);
  }

  // danh sách khách chờ của các cố vấn dịch vụ
  getWaitReceiveVehicle(timestamp) {
    return this.get(`/receptionist/wait-receive?date=${timestamp}`);
  }

  // danh sách xe đã tiếp nhận xong của các cố vấn dịch vụ
  getReceivedVehicle(timestamp) {
    return this.get(`/receptionist/received-vehicle?date=${timestamp}`);
  }

  // kéo thả xe đang chờ tư vấn sang xe chờ hoặc đã hẹn
  unReceiveVehicle(id) {
    return this.post(`/unreceive-vehicle/${id}`, {});
  }

  /**
   * Lễ tân kéo khách hàng vào danh sách chờ tiếp của cố vấn dịch vụ
   * Thay đổi vị trí khách hàng chờ từ CVDV này sang CVDV khác
   * Thay đổi thứ tiếp nhận khách hàng
   */
  assigndvisor(data: AssignAdvisor) {
    return this.post('/assign-advisor', data);
  }

  // lấy khách hàng đang tiếp nhận của các cố vấn dịch vụ
  getAdvisorVehicleReceiving(timestamp) {
    return this.get(`/advisor/vehicle-receiving?date=${timestamp}`);
  }

  // danh sách khách chờ của  cố vấn dịch vụ
  getAdvisorWaitReceive(timestamp) {
    return this.get(`/advisor/wait-receive?date=${timestamp}`);
  }

  // lấy danh sách xe đã tiếp nhận xong
  getAdvisorReceivedVehicle(timestamp) {
    return this.get(`/advisor/received-vehicle?date=${timestamp}`);
  }

  // Lấy số lượng khách đang chờ và đã tiếp của CVDV
  getAdvisorWaitOrRecvVehicleQty() {
    return this.get('/advisor/vehicle-qty');
  }

  getVehicleWaitReception() {
    return this.get('/vehicle-wait-reception');
  }

  getVehicleStatus() {
    return this.get('/vehicle-status-progress');
  }

  // API Tiếp nhận + Tiếp nhận xong + Dừng tiếp nhận xe
  doAdvisorVehicleReceive(param, data) {
    return this.post(`/advisor/vehicle-receive?action=${param}`, data);
  }

  // chọn xe và thay đổi thứ tự tiếp nhận xe
  doAdvisorChooseVehicle(data) {
    return this.post('/advisor/choose-vehicle', data);
  }

  // Xe ra
  outGate(registerNo) {
    return this.put(`/out-gate?registerNo=${registerNo}`);
  }

  callCustomer(id, param) {
    return this.post(`/call-customer/${id}?currentModifyDate=${param}`);
  }

  // lấy ra danh sách trong tiến độ khách hàng
  getListProgessCustomer(paginationParams = {
    page: 1,
    size: 10,
  }) {
    const dataRequest = paginationParams;
    return this.post('/vehicle-status', dataRequest);
  }
}
