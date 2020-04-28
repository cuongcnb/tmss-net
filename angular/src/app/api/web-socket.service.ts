import {Injectable} from '@angular/core';
import {EnvConfigService} from '../env-config.service';

const SockJs = require('sockjs-client');
const Stomp = require('stompjs');

@Injectable()
export class WebSocketService {
  constructor(private envConfigService: EnvConfigService) {

  }

  // Open connection with the back-end socket
  public connect() {
    const socket = new SockJs(this.envConfigService.getConfig().socket);
    return Stomp.over(socket);
  }
}
