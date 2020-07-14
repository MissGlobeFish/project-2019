import request from '@/plugin/axios'
import axios from 'axios'

export function AccountLogin (data) {
  var formData = new FormData();
  formData.append("username", data.username);
  formData.append("password", data.password);
  return axios.post('/pomegranate/web/baseInfo/login', formData)
}
