function setupRotChart(MngCode){
    var backgroundColor = ["rgba(133, 193, 233, 0.8)", 
                           "rgba(226, 169, 203, 0.8)", 
                           "rgba(192, 169, 226, 0.8)"]
    $.ajax({
        type: 'GET',
        url: 'data/rice_water.json',
        dataType: 'json',
        success: function(field) {
          var labels = [];
          var water_108 =[];
          var water_109 =[];
          var data_filter = field[MngCode]
          for(var i in data_filter) {
            labels.push(data_filter[i].Mnsperiod);
            water_108.push(data_filter[i].re_water_108);
            water_109.push(data_filter[i].re_water_109);
        }
        var waterData = {
            labels : labels,
            datasets : [
                {
                    label: "二期稻作需水量",
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(0,168,168, 0.5)",
                    borderColor: "rgba(0,168,168, 0.1)",
                    borderCapStyle: 'butt',
                    data:  water_108,
                    spanGaps: false,
                    pointRadius: 5,
                    showLine: false //<- set this
                },
                {
                    label: "一期稻作需水量",
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(0,214,214, 0.5)",
                    borderColor: "rgba(0,214,214, 0.1)",
                    borderCapStyle: 'butt',
                    data:  water_109,
                    spanGaps: false,
                    pointRadius: 5,
                    showLine: false //<- set this
                }

            ]
        };

          var ctx = document.getElementById("RotWater-chart").getContext('2d') 
          var waterChart = new Chart(ctx, {
            type: 'line',
            data: waterData,
            options: {
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    title: {
                        display: true,
                        text: '灌區需水量'
                    }
                },
                scales: {
                    x : {
                        title: {
                            display: true,
                            text: "旬期"
                        },
                        ticks: {
                            font: {
                                size: 10
                            }
                        }
                    },
                    y : {
                        title: {
                            display: true,
                            text: "需水量(萬立方公尺)",
                        },
                        suggestedMin: 0,
                        suggestedMax: 1500,
                        ticks: {
                            font: {
                                size: 10
                            }
                        }
                    }
                }
            }
           });      
        }
      });
};


function addRotChart(MngCode){
    var myChart = setupRotChart(MngCode)
};

function  setRainfallChart(StationCode){
    var backgroundColor = ["rgba(133, 193, 233, 0.8)", 
                           "rgba(226, 169, 203, 0.8)", 
                           "rgba(192, 169, 226, 0.8)"]
    $.ajax({
        type: 'GET',
        url: 'data/rev_rainfall_all.json',
        dataType: 'json',
        success: function(field) {
          var datasets = []
          var labels = [];
          var data_filter = field[StationCode]
          var count = 0
          for (var year in data_filter){
            var flag = true
            if (labels.length == 0) {
                flag = false
            }
            yearly_data = data_filter[year]
            var rain = [];
            for (var i = 0; i < yearly_data.length; i++) {
                if (!flag) {
                    labels.push(yearly_data[i].Month);
                }
                rain.push(yearly_data[i].Rainfall);
            }
            datasets.push({
                label: year,
                data: rain,
                fill: false,
                backgroundColor: backgroundColor[count],
                borderColor: backgroundColor[count],
            })
            count += 1
          }

          var ctx = document.getElementById("rainfall-chart").getContext('2d') 
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
                      text: '總降雨量 (' + StationCode + ")"
                    },
                    legend: {
                        labels: {
                            usePointStyle: true,
                            font: {
                                size: 10
                            }
                        },
                        position: 'chartArea',
                    },
                },
                scales: {
                    x : {
                        title: {
                            display: true,
                            text: "月份"
                        },
                        ticks: {
                            font: {
                                size: 10
                            }
                        }
                    },
                    y : {
                        title: {
                            display: true,
                            text: "降雨量(公噸)",
                        },
                        suggestedMin: 0,
                        suggestedMax: 10000,
                        ticks: {
                            font: {
                                size: 10
                            }
                        }
                    }
                }
            }
          });
        }
      });
};


function addRainfallChart(StationID){
    var myChart = setRainfallChart(StationID)
};

/********************************
 *  主要 Vue app  
 * ******************************/ 
 const app = new Vue({    
    el: '#app',
    mixins:[],
    components:{},
    data: function () {
        return {
            irrigationChecked:false,
            rainStationChecked: false,
            rainAccumChecked:false,
            riverChecked:false,
            weightsChecked:false,
            paddiesChecked:false,
            RotChecked:false,
            countyChecked:false,
            irrigation_mainLayer: undefined,
            irrigation_subLayer: undefined,
            rainStationLayer:undefined,
            river_lineLayer:undefined,
            river_polyLayer:undefined,
            rainAccumLayer:undefined,
            paddiesWeightsLayer:undefined,
            paddiesLayer:undefined,
            RotLayer:undefined,
            CountyBoundaries:undefined,
            StationID:'',
            Mng:'',
            toShowseasonSelect:false,
        };
    },
    watch:{
        irrigationChecked:function(){
            if (this.irrigationChecked == true){
                this.loadirrigation()
            } else {
                this.irrigationChecked = false;
                this.irrigation_mainLayer.remove();
                this.irrigation_subLayer.remove();
            }                    
        },
        rainStationChecked:function(){
            if (this.rainStationChecked == true){
                this.loadRainStation()
            } else {
                this.rainStationChecked = false;
                this.rainStationLayer.remove();
            }                    
        },
        riverChecked:function(){
            if (this.riverChecked == true){
                this.loadRiver()
            } else {
                this.riverChecked = false;
                this.river_lineLayer.remove();
                this.river_polyLayer.remove();
            }        
        },
        rainAccumChecked:function(){
            if (this.rainAccumChecked == true){
                this.loadrainAccum()
            } else {
                this.rainAccumChecked = false;
                this.rainAccumLayer.remove();
                const myChild = document.getElementById('rainfall-container');
                myChild.innerHTML = '';
            }   
        },
        weightsChecked:function(){
            if (this.weightsChecked == true){
                this.loadWeights();
            } else {
                this.weightsChecked = false;
                this.paddiesWeightsLayer.remove();
            }        
        },
        paddiesChecked:function(){
            if (this.paddiesChecked == true){
                this.loadPaddies()
            } else {
                this.paddiesChecked = false;
                this.paddiesLayer.remove();
            }        
        },
        RotChecked:function(){
            if (this.RotChecked == true){
                this.loadRot()
            } else {
                this.RotChecked = false;
                this.RotLayer.remove();
                const myChild = document.getElementById('requiredWater-container');
                myChild.innerHTML = '';
            }        
        },
        countyChecked:function(){
            if (this.countyChecked == true){
                this.loadCounty()
            } else {
                this.countyChecked = false;
                this.CountyBoundaries.remove();
            }        
        },

    },
    methods: {

        PrintSimpleMap: function(){
            window.print();  
        },
        
        btnZoomHandler: function(isZoomIn) {
            if (isZoomIn) {
                map.zoomIn();
            } else {
                map.zoomOut();                
            }
        },
        
        /**
         * 初始化底圖切換
         */
        initBaseLayer: function(){
            const map = L.map('map',{zoomControl: false}).setView([23.14999, 120.202545], 9);
            //設為全域 
            window.map  = map
            // 設定地圖名稱以及對應的TileLayer
            var mapLayers = {
                '臺灣通用電子地圖(新)': L.tileLayer('https://wmts.nlsc.gov.tw/wmts/EMAP98/default/GoogleMapsCompatible/{z}/{y}/{x}', {
                    attribution: '&copy; <a href="https://wmts.nlsc.gov.tw">NLSC</a>'
                }),
                'Carto Map': L.tileLayer('http://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
                    attribution: '&copy;'
                }), 
                'OpenStreetMap': L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png',{
                })
            };  
            mapLayers['Carto Map'].addTo(map); // 使用中文地圖作為預設
            L.control.layers(mapLayers).addTo(map); // 加入地圖切換控制項    
        },
        
        /**
         * 初始化 zoom-in zoom-out
         */
        initZoomIn: function(){
            var zoomLevel = document.getElementById("zoomLevel");
            zoomLevel.innerText = " zoom 層級 :" + map.getZoom()
            map.on('zoomend', function () {
            
                zoomLevel.innerText = "zoom 層級 :" + map.getZoom()
            });
            map.addEventListener('mousemove', function (evt) {
                var span = document.getElementById('currentWGS84Txt')
                span.innerText = " " + evt.latlng.lng.toFixed(6) + ", " + evt.latlng.lat.toFixed(6) + " ";
                
            });
        },

        initSearch: function(){
            map.addControl(L.control.search({ position: 'topright' }))
        },
        //載入河流為VT
        loadRiver: function (){
            var self = this;
            axios.get('data/river_line.geojson').then(function (response) {
                let data = response.data;
                self.river_lineLayer = L.geoJSON(data,{
                    style:{
                        weight: 1,
                        color: '#2E64FE',
                    }
                }).addTo(map);
            });
            var options = {
                maxZoom: 16,
                zIndex:1000,
                tolerance: 5,
                debug: 0,
                style:{
                    color:"#5882FA",
                    fillColor:"#5882FA",
                    weight:1,
                    opacity:1
                }
            };
            axios.get('data/river_poly.geojson').then(function (response) {
                let data = response.data;
                self.river_polyLayer = L.geoJson.vt(data,options).addTo(map);
            });

        },

        
        //載入灌溉渠道
        loadirrigation: function (){
            var self = this; 
            axios.get('data/irrigation_main.geojson').then(function (response) {
                let data = response.data;
                self.irrigation_mainLayer = L.geoJSON(data,{
                    onEachFeature: function (feature, layer) {
                        if (layer instanceof L.Polyline) {
                          layer.setStyle({
                            color: '#5AA0BE',
                            weight: 3
                          });
                        }
                      }            
                }).addTo(map);
            });
            axios.get('data/irrigation_sub.geojson').then(function (response) {
                let bounds;
                let data = response.data;
                self.irrigation_subLayer = L.geoJSON(data,{
                    onEachFeature: function (feature, layer) {
                        if (layer instanceof L.Polyline) {
                          layer.setStyle({
                            color: '#64B2D5',
                            weight: 2
                          });
                        }
                      }            
                }).addTo(map);
            });
        },

        //載入降雨測站
        loadRainStation: function (){
            var self = this; 
            axios.get('data/rain_station.geojson').then(function (response) {
                let data = response.data;
                self.rainStationLayer = L.geoJSON(data,{
                    pointToLayer: function (feature, latlng) {
                        return L.circleMarker(latlng,{
                            radius: 5,
                            fillColor: "#B2677C",
                            color:'transparent',
                            weight: 1,
                            opacity: 1,
                            fillOpacity: 0.8
                        });
                    }
                }).addTo(map);
            });
        },
        //載入降雨估計徐昇多邊形
        loadrainAccum: function (){
            var self = this; 
            var style = {
                fillColor: '#B6D0EC',
                zIndex:999,
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '1',
                fillOpacity: 0.7
            };
            var onEachShape = function(feature, layer){ 
                layer.on('click', function (e) {
                    /* 這裏的 this scope 指的是 layer 回傳的 shape */
                    document.getElementById('rainfall-container').innerHTML = "<canvas width=300 height=250 id='rainfall-chart'>";
                    this.StationID = layer.feature.properties.StationID;
                    var StationCode = this.StationID;
                    addRainfallChart(StationCode);
                    //this.feature.type === 'Feature'  && self.setInfowindow(e,this.feature.properties)
                });
                 // Highlight the marker on hover
                layer.on('mouseover', function(e){
                    layer.setStyle({ fillColor: '#968CD8' });
                });
            
                // Un-highlight the marker on hover out
                layer.on('mouseout', function(e){
                    layer.setStyle(style);
                });                
            };           
            axios.get('data/rainAccum.geojson').then(function (response) {
                let data = response.data;
                self.rainAccumLayer = L.geoJSON(data,{
                    onEachFeature: onEachShape,
                    style:style
                }).addTo(map);
            });
        },


        //載入稻作權重        
        loadWeights: function (){
            var self = this; 
            var options = {
                maxZoom: 16,
                zIndex:1000,
                tolerance: 5,
                debug: 0,
                style: (properties) => {
                  if (properties.weight <= 0.001102) {
                    return  {weight: 1,fillColor:"#AFEEEE", color:"#AFEEEE"};
                  } else if ((properties.weight > 0.001102) && (properties.weight <= 0.001941)) {
                        return  {weight: 1,fillColor:"#ADD8E6",color:"#ADD8E6"};
                  } else if ((properties.weight > 0.001941) && (properties.weight <= 0.003671)) {
                        return  {weight: 1,fillColor:"#87CEEB",color:"#87CEEB"};
                  } else if ((properties.weight > 0.001941) && (properties.weight <= 0.013158)) {
                        return  {weight: 1,fillColor:"#00BFFF",color:"#00BFFF"};
                  } else {
                        return {weight: 1,fillColor:"#4682B4",color:"#4682B4"};
                  }
                }
            };
            axios.get('data/paddies.geojson').then(function (response) {
                let data = response.data;
                self.paddiesWeightsLayer = L.geoJson.vt(data,options).addTo(map);
            });
        },

        //載入灌溉輪區
        loadRot: function (){
            var self = this; 
            var style = {
                fillColor: '#CFEFA9',
                zIndex:900,
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '1',
                fillOpacity: 0.7
            };
            var onEachShape = function(feature, layer){ 
                layer.on('click', function (e) {
                    console.log(layer.feature.properties.Rot)
                    /* 這裏的 this scope 指的是 layer 回傳的 shape */
                    document.getElementById('requiredWater-container').innerHTML = "<canvas width=300 height=250 id='RotWater-chart'>";
                    this.Mng = layer.feature.properties.Rot;
                    var MngCode = this.Mng;
                    addRotChart(MngCode);
                    //this.feature.type === 'Feature'  && self.setInfowindow(e,this.feature.properties)
                });
                 // Highlight the marker on hover
                layer.on('mouseover', function(e){
                    layer.setStyle({ fillColor: '#26A69A' });
                });
            
                // Un-highlight the marker on hover out
                layer.on('mouseout', function(e){
                    layer.setStyle(style);
                });                
            };           
            axios.get('data/Rot.geojson').then(function (response) {
                let data = response.data;
                self.RotLayer = L.geoJson(data,
                    {style:style,
                     onEachFeature:onEachShape
                    }).addTo(map);
            });

        },
   
        //載入縣市界
        loadCounty: function(){
            var self = this; 
            var style = {
                weight: 1,
                opacity: 1,
                color: 'grey',
                fillOpacity: 0.3
            };
            axios.get('data/county.geojson').then(function (response) {
                let data = response.data;
                self.CountyBoundaries = L.geoJson(data,{
                    style:style,
                    onEachFeature: function (feature, layer) {
                        layer.bindTooltip(feature.properties.COUNTYNAME);
                    }
                }).addTo(map);
            });
        },
        
        
    },

    beforeCreate:function (){
    },
    created:function(){
        var self = this;        
    },
    mounted: function () {
        var self = this;
        //執行地圖初始化的相關方法
        self.initBaseLayer();
        self.initZoomIn(); 
        self.initSearch();
        //self.makeRainfallAllCharts();
    }
   
        
});
window.app = app;
