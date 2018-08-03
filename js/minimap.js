function miniMap (potName) {
    console.log(potName)
    $.getJSON('data/honeypot/'+ potName + '.json', function (res) {

        // /minmap title
        $('.minimap-title').text(res.title)

        var chart,
            mapdata = res,
            data = [],
            potLat, potLon ;

        // 获取honypot经纬度
        for (var facility in latlonData.facilities) {
            if (facility === potName) {
                potLat = latlonData.facilities[facility].lat;
                potLon = latlonData.facilities[facility].lon;
                break;
            }
        }
        
        Highcharts.each(mapdata.features, function(md, index) {
            data.push({
                'hc-key': md.properties['hc-key'],
                value: Math.floor((Math.random()*100)+1)  // 生成 1 ~ 100 随机值
            });
        });

        // 初始化图表
        // $('#map-container').highcharts('Map', {
        !!chart ? chart.destroy() : {}
        chart = Highcharts.Map('map-container', {
            chart: {  
                backgroundColor: 'rgba(0, 0, 0, 0)',  
            }, 
            title : {
                useHTML: true,
                text : ''
            },
            credits: {  
                enabled: false
            },
            legend: {
                enabled: false
            },
            tooltip: {
                useHTML: true,
                formatter: function() {
                    return this.point.name;
                }
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: false
                    },
                    marker: {
                      radius: 5
                    }
                }
            },
            colorAxis: {
                min: 0,
                stops: [
                    [0, '#EFEFFF'],
                    [0.5, Highcharts.getOptions().colors[0]],
                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).brighten(-0.5).get()]
                ]
            },
            series : [{
                data : data,
                mapData: mapdata,
                joinBy: 'hc-key',
                name: 'Honeypot ' + potName,
                states: {
                    hover: {
                        color: '#a4edba'
                    }
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                }
            }, {
                type: 'mappoint',
                name: 'Dubay',
                data: [{
                  lat: potLat,
                  lon: potLon,
                  color: 'red',
                  name: 'Honeypot ' + potName,
                  marker: {
                    width: 20,
                    height: 20,
                    symbol: 'url(images/honeypot.gif)'
                  }
                }]
            }]
        });

    })
}