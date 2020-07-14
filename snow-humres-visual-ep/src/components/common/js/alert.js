function _log_err(msg) {
  if(msg == null || msg == '' || msg == undefined){
    return;
  }
  this.$message({
    message: msg,
    type: 'error'
  });
}

function _log_warn(msg) {
  if(msg == null || msg == '' || msg == undefined){
    return;
  }
  this.$message({
    message: msg,
    type: 'warning'
  });
}

function _log_info(msg) {
  if(msg == null || msg == '' || msg == undefined){
    return;
  }
  this.$message({
    message: msg,
    type: 'info'
  });
}

function _log_success(msg) {
  if(msg == null || msg == '' || msg == undefined){
    return;
  }
  this.$message({
    message: msg,
    type: 'success'
  });
}

export {_log_err,_log_info,_log_warn,_log_success}
