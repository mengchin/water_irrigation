/********************************
 *  主要 Vue app  
 * ******************************/ 
 const app = new Vue({    
    el: '#homepage',
    mixins:[],
    components:{},
    data: function () {
        return {
            wateradmin: '',
            ACC:'',
            options: [
                {eng:'TK', name:'北北基管理處',　acc:'10000'},
                {eng:'CS', name:'七星管理處',　acc:'15000'},
                {eng:'SM', name:'石門管理處',　acc:'16000'},
                {eng:'LG', name:'瑠公管理處',　acc:'13000'},
                {eng:'TY', name:'桃園管理處',　acc:'14000'},
                {eng:'HT', name:'新竹管理處',　acc:'23000'},
                {eng:'ML', name:'苗栗管理處',　acc:'133000'},
                {eng:'TC', name:'臺中管理處',　acc:'1400'},
                {eng:'CH', name:'彰化管理處',　acc:'5520'},
                {eng:'NT', name:'南投管理處',　acc:'15500'},
                {eng:'YL', name:'雲林管理處',　acc:'10400'},
                {eng:'CN', name:'嘉南管理處',　acc:'15000'},
            ],

        };
    },
    watch:{

    },
    methods: {
        showAcc(event) {
            this.ACC = event.target.acc; 
        },


    
    },

    beforeCreate:function (){
    },
    created:function(){
        var self = this;        
    },
    mounted: function () {
        var self = this;

    }
   
        
});
window.app = app;