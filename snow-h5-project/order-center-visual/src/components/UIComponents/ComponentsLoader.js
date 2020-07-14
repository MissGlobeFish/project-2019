
import navbar from './Navbar'
import sectionHeader from './SectionHeader'
import inputIterm from './FormInputIterm'
import selectIterm from './FormSelectIterm'
import switchIterm from './FormSwitchIterm'
import datePickerIterm from './FormDatePickerIterm'
import Refresh from './Refresh' 
import searchSelect from './FormSearchSelectIterm'

const loading={
    install:function(Vue){
        Vue.component('navbar',navbar);
        Vue.component('sectionHeader',sectionHeader);
        Vue.component('inputIterm',inputIterm);
        Vue.component('selectIterm',selectIterm);
        Vue.component('switchIterm',switchIterm);
        Vue.component('datePickerIterm',datePickerIterm);
        Vue.component('v-scroll',Refresh);
        Vue.component('searchSelectIterm',searchSelect)
    }  //'selectIterm'这就是后面可以使用的组件的名字，install是默认的一个方法
};
 
export default loading;



//用于全局注册自定义组件