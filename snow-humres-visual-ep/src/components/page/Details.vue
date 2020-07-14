<template>
    <div class="details">
    	<v-Particulars :optionId="empId"></v-Particulars>
    </div>
</template>

<script>
	import vParticulars from '../common/Particulars' 
    export default {
        data() {
            return {
				empId: {
                    detailsId:'',
                    manageId:'',
                    applyId: {},
                    buttonStatus: ''
                }
            }
        },
		components: {
            vParticulars
        }, 
        created() {//在实例创建完成后被立即调用
			this.empId.detailsId = window.localStorage.getItem("ms_empCode");
	    },
        methods: {//实例方法

        }  
    }
</script>
<style>
    .details{
        background: #fff;
        box-shadow: 2px 2px 4px 2px rgba(204, 204, 204, 0.5);
        padding: 20px;
    }
</style>