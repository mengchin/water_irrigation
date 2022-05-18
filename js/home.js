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
                                        color:"#3A415E",
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
        },
        getAccumData: function(){
            $.ajax({
                type: 'GET',
                url: 'https://data.wra.gov.tw/OpenAPI/api/OpenData/1602CA19-B224-4CC3-AA31-11B1B124530F/Data',
                dataType: 'json',
                success: function() {
                    console.log('success')
                }
            })
        },
       setChart: function(){
            Highcharts.chart('container', {
              colors:["#2F4794","#2F6594","#4899E0"],
              title: {
                  text: '烏山頭水庫有效容量'
              },
            
              subtitle: {
                  text: '取自經濟部水利署'
              },
            
              yAxis: {
                  title: {
                      text: '月降雨量(mm)'
                  }
              },
            
              xAxis: {
                categories: ["01","02","03","04","05","06","07","08","09","10","11","12"]
              },
            
              legend: {
                  layout: 'vertical',
                  align: 'right',
                  verticalAlign: 'middle'
              },
            
              plotOptions: {
                  series: {
                      label: {
                          connectorAllowed: false
                      },
                      pointStart: 0
                  }
              },
            
              series: [{
                  name: '2018',
                  data: [7911, 52503, 57177, 69658, 97031, 119931, 137133, 154175, 119931, 137133, 154175,32490]
              }, {
                  name: '2019',
                  data: [24916, 24064, 29742, 29851, 32490, 30282, 40434, 32490, 30282, 38121, 40434,32490]
              }, {
                  name: '2020',
                  data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387, 24377, 32147, 39387,977]
              }],
            
              responsive: {
                  rules: [{
                      condition: {
                          maxWidth: 500
                      },
                      chartOptions: {
                          legend: {
                              layout: 'horizontal',
                              align: 'center',
                              verticalAlign: 'bottom',
                          }
                      }
                  }]
              }
            
          });      
       }
    },

    beforeCreate:function (){
    },
    created:function(){
        var self = this;        
    },
    mounted: function () {
        var self = this;
        //this.setRequiredWaterChart();
        this.getAccumData();
        this.setChart();
    }
   
        
});
window.app = app;