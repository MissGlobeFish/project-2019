import { Message } from 'element-ui';
export default {
  _log_err(msg) {
    if(msg == null || msg == '' || msg == undefined){
      return;
    }
    Message({
      message: msg,
      type: 'error'
    });
  },
  _log_warn(msg){
    if(msg == null || msg == '' || msg == undefined){
      return;
    }
    Message({
      message: msg,
      type: 'warning'
    });
  },

  
  _log_info(msg) {
    if(msg == null || msg == '' || msg == undefined){
      return;
    }
    Message({
      message: msg,
      type: 'info'
    });
  },
  
  _log_success(msg) {
    if(msg == null || msg == '' || msg == undefined){
      return;
    }
    Message({
      message: msg,
      type: 'success'
    });
  },
}


