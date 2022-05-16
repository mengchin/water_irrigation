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
            capacity:'',
            options: [
                {eng:'TK', name:'北北基管理處',　acc:'100000', required:'150000'},
                {eng:'CS', name:'七星管理處',　acc:'150000',required:'150000'},
                {eng:'SM', name:'石門管理處',　acc:'160000',required:'160000'},
                {eng:'LG', name:'瑠公管理處',　acc:'130000',required:'130000'},
                {eng:'TY', name:'桃園管理處',　acc:'140000',required:'140000'},
                {eng:'HT', name:'新竹管理處',　acc:'300000',required:'230000'},
                {eng:'ML', name:'苗栗管理處',　acc:'123000',required:'133000'},
                {eng:'TC', name:'臺中管理處',　acc:'130000',required:'140000'},
                {eng:'CH', name:'彰化管理處',　acc:'300000',required:'342000'},
                {eng:'NT', name:'南投管理處',　acc:'199000',required:'155000'},
                {eng:'YL', name:'雲林管理處',　acc:'100000',required:'104000'},
                {eng:'CN', name:'嘉南管理處',　acc:'200000',required:'100201'},
            ],

        };
    },
    watch:{

    },
    computed:{


    },
    methods: {

        setRequiredWaterChart:function(){
            function  setRainfallChart(){
                var backgroundColor = [
                                    "#2F4794",
                                    "#2F6594", 
                                    "#4899E0",
                                    ]
                $.ajax({
                    type: 'GET',
                    url: 'data/all_require_water.json',
                    dataType: 'json',
                    success: function(field) {
                      var datasets = []
                      var labels = [];
                      var count = 0
                      for (var period in field){
                        var flag = true
                        if (labels.length == 0) {
                            flag = false
                        }
                        monthly_data = field[period]
                        var requiredWater = [];
                        for (var i = 0; i < monthly_data.length; i++) {
                            if (!flag) {
                                labels.push(monthly_data[i].month);
                            }
                            requiredWater.push(monthly_data[i].periodRequired);
                        }
                        datasets.push({
                            label: period,
                            data: requiredWater,
                            fill: false,
                            backgroundColor: backgroundColor[count],
                            borderColor: backgroundColor[count],
                        })
                        count += 1
                      }
            
                      var ctx = document.getElementById("requiredwater-chart").getContext('2d') 
                      var myChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                          labels: labels,
                          datasets: datasets
                          
                        },
                        options: {
                            interaction: {
                                intersect: false,
                                mode: 'index',
                            },
                            plugins: {
                                title: {
                                  display: true,
                                  text: '總需水量',
                                  color: 'white',
                                  font:{size:30}
                                },
                                legend: {
                                    labels: {
                                        usePointStyle: true,
                                        color:"#3A415E",
                                    },
                                    position: 'chartArea',
                                },
                            },
                            scales: {
                                x : {
                                    title: {
                                        display: true,
                                        text: "月份",
                                        color:"white",
                                        font:{size:15} 
                                    },
                                    ticks: {
                                        color:"#3A415E",
                                        font:{size:15}  
                                    },
                                    
                                },
                                y : {
                                    title: {
                                        display: true,
                                        text: "需水量(mm)",
                                        color:"#3A415E",
                                        font:{size:15} 
                                    },
                                    suggestedMin: 0,
                                    suggestedMax: 7500,
                                    ticks: {
                                        color:"#3A415E",
                                        font:{size:15}                                        
                                    }
                                }
                            }
                        }
                      });
                    }
                  });
            };
            
            
        function addRainfallChart(){
            var myChart = setRainfallChart()
        };
        document.getElementById('requiredWater-container').innerHTML = "<canvas width=300 height=150 id='requiredwater-chart'>";
        addRainfallChart();
        }
    
    },

    beforeCreate:function (){
    },
    created:function(){
        var self = this;        
    },
    mounted: function () {
        var self = this;
        this.setRequiredWaterChart();

    }
   
        
});
window.app = app;