
import navbar from './Navbar'
import sectionHeader from './SectionHeader'
import infoIterm from './InfoIterm'


const loading={
    install:function(Vue){
        Vue.component('navbar',navbar);
        Vue.component('sectionHeader',sectionHeader);
        Vue.component('infoIterm',infoIterm);

    }  //'selectIterm'这就是后面可以使用的组件的名字，install是默认的一个方法
};
 
export default loading;



//用于全局注册自定义组件