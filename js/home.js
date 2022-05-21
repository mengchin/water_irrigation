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
            questionType:'',
            questionOptions:[
                {question:'平台使用問題', type:'001'},
                {question:'稻作灌溉疑問', type:'002'},
                {question:'其他問題', type:'003'}
            ]

        };
    },
    watch:{

    },
    computed:{


    },
    methods: {

        //灌區水情地圖
        initMap: function(){
            var map = L.map('map').setView([23.214999, 120.202545], 10);

            L.tileLayer('http://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
                attribution: '&copy;'
            }).addTo(map);
            
            //var getColor= function(d) {
            //    return d > 10000 ? '#EC407A' :
            //           d > 8000  ? '#F06292' :
            //           d > 7000  ? '#F48FB1' :
            //           d > 6000  ? '#F8BBD0' :
            //                        '#E0E0E0';
            //};
            //var style= function(feature) {
            //    return {
            //        fillColor: getColor(feature.properties.Year_accum),
            //        weight: 2,
            //        opacity: 1,
            //        color: 'white',
            //        dashArray: '1',
            //        fillOpacity: 0.7
            //    };
            //}
            var popupContent = "<b>Hello world!</b><br />I am a popup.";
            var popupOptions =
                {
                  'maxWidth': '500',
                  'className' : 'another-popup' // classname for another popup
                }
            var style={
                fillColor:'#EC407A',
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '1',
                fillOpacity: 0.7
            }
            var markerStyle={
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: 500
            }
            axios.get('data/Rot.geojson').then(function (response) {
                let data = response.data;
                L.geoJson(data,{style:style,}).addTo(map);
            });
            
            var popup = L.popup()
            .setLatLng([23.214999, 120.202545])
            .setContent('嘉南水利處')
            .openOn(map);
    
        },
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

                }
            })
        },
       setChart: function(){
            Highcharts.chart('container', {
                chart: {
                    type: 'area'
                },
                colors:["#9FA8DA","#81D4FA","#4899E0"],
                title: {
                    text: '烏山頭水庫水情供需平衡'
                },
                xAxis: {
                    categories: ["1月上旬","1月中旬","1月下旬","2月上旬","2月中旬","2月下旬","3月上旬","3月中旬","3月下旬","4月上旬","4月中旬","4月下旬","5月上旬","5月中旬","5月下旬","6月上旬","6月中旬","6月下旬","7月上旬","7月中旬","7月下旬","8月上旬","8月中旬","8月下旬","9月上旬","9月中旬","9月下旬","10月上旬","10月中旬","10月下旬","11月上旬","11月中旬","11月下旬","12月上旬","12月中旬","12月下旬","1月上旬","1月中旬","1月下旬","2月上旬","2月中旬","2月下旬","3月上旬","3月中旬","3月下旬","4月上旬","4月中旬","4月下旬","5月上旬","5月中旬","5月下旬","6月上旬","6月中旬","6月下旬","7月上旬","7月中旬","7月下旬","8月上旬","8月中旬","8月下旬","9月上旬","9月中旬","9月下旬","10月上旬","10月中旬","10月下旬","11月上旬","11月中旬","11月下旬","12月上旬","12月中旬","12月下旬","1月上旬","1月中旬","1月下旬"]
                },
                yAxis:{
                    title: {
                        display: true,
                        text: "水量(mm)"
                    },
                },
                credits: {
                    enabled: false
                },
                series: [{
                    name: '集水區內可灌溉用水量',
                    data: [277.741655,277.741655,277.741655,67.13428795,67.13428795,67.13428795,1949.827165,1949.827165,1949.827165,2135.574449,2135.574449,2135.574449,11062.63547,11062.63547,11062.63547,9410.664535,9410.664535,9410.664535,7181.858787,7181.858787,7181.858787,20911.70034,20911.70034,20911.70034,3451.389219,3451.389219,3451.389219,472.9795853,472.9795853,472.9795853,25.85683053,25.85683053,25.85683053,1915.555163,1915.555163,1915.555163,372.4462369,372.4462369,372.4462369,363.6005223,363.6005223,363.6005223,1616.526835,1616.526835,1616.526835,1043.199843,1043.199843,1043.199843,10681.42608,10681.42608,10681.42608,2607.641356,2607.641356,2607.641356,5364.998399,5364.998399,5364.998399,7540.511833,7540.511833,7540.511833,2030.797883,2030.797883,2030.797883,345.4950942,345.4950942,345.4950942,396.5971447,396.5971447,396.5971447,635.31101,635.31101,635.31101,,,]
                }, {
                    name: '嘉南灌區內作物需水量',
                    data: [0,0,0,277.741655,277.741655,277.741655,67.13428795,67.13428795,67.13428795,1949.827165,1949.827165,1949.827165,2135.574449,2135.574449,2135.574449,11062.63547,11062.63547,11062.63547,9410.664535,9410.664535,9410.664535,7181.858787,7181.858787,7181.858787,20911.70034,20911.70034,20911.70034,3451.389219,3451.389219,3451.389219,472.9795853,472.9795853,472.9795853,25.85683053,25.85683053,25.85683053,1915.555163,1915.555163,1915.555163,372.4462369,372.4462369,372.4462369,363.6005223,363.6005223,363.6005223,1616.526835,1616.526835,1616.526835,1043.199843,1043.199843,1043.199843,10681.42608,10681.42608,10681.42608,2607.641356,2607.641356,2607.641356,5364.998399,5364.998399,5364.998399,7540.511833,7540.511833,7540.511833,2030.797883,2030.797883,2030.797883,345.4950942,345.4950942,345.4950942,396.5971447,396.5971447,396.5971447,635.31101,635.31101,635.31101]
                }, {
                    name: '供需平衡可用水量剩餘',
                    data: [0,0,0,210.607367,210.607367,210.607367,-1882.692877,-1882.692877,-1882.692877,-185.7472841,-185.7472841,-185.7472841,-8927.061025,-8927.061025,-8927.061025,1651.970939,1651.970939,1651.970939,2228.805748,2228.805748,2228.805748,-13729.84156,-13729.84156,-13729.84156,17460.31113,17460.31113,17460.31113,2978.409634,2978.409634,2978.409634,447.1227548,447.1227548,447.1227548,-1889.698333,-1889.698333,-1889.698333,1543.108926,1543.108926,1543.108926,8.845714634,8.845714634,8.845714634,-1252.926312,-1252.926312,-1252.926312,573.3269919,573.3269919,573.3269919,-9638.226238,-9638.226238,-9638.226238,8073.784725,8073.784725,8073.784725,-2757.357044,-2757.357044,-2757.357044,-2175.513434,-2175.513434,-2175.513434,5509.713951,5509.713951,5509.713951,1685.302789,1685.302789,1685.302789,-51.10205048,-51.10205048,-51.10205048,-238.7138653,-238.7138653,-238.7138653,0,0,0]
                }]
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
        this.initMap();
    }
   
        
});
window.app = app;