var _chart;
var selected = "http://61.72.187.6/phps/giftChart";

// 파라메터 정보가 저장될 오브젝트
// common.js 같은 모든 페이지에서 로딩되는 js 파일에 넣어두면 됨.
var getParam = function(key){
    var _parammap = {};
    document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
        function decode(s) {
            return decodeURIComponent(s.split("+").join(" "));
        }

        _parammap[decode(arguments[1])] = decode(arguments[2]);
    });

    return _parammap[key];
};

var companycode = getParam("companycode");
console.log(companycode);

  $(function stock(){
    Highcharts.setOptions({
      global : {
          useUTC : false
        }
    });
    function requestData(){
      setInterval(function () {
        $.ajax({
            // url: selected + "?companycode=" + companycode,
            url: selected,
            type: "GET",
            dataType: "json",
            async: false,
            success: function(data) {
              // split the data set into ohlc and volume
              var volumeColor = '';
              var ohlc = [],
                  volume = [],
                  dataLength = data.length;

              for (i = 0; i < dataLength; i++) {
                ohlc.push([
                  data[i][0], // the date
                  data[i][1], // open
                  data[i][2], // high
                  data[i][3], // low
                  data[i][4] // close
                ]);
                volume.push([
                  data[i][0], // the date
                  data[i][5] // the volume
                ]);
              }
              _chart.series[0].setData(ohlc);
              _chart.series[1].setData(volume);
            },
            cache: false
        });
        console.log("ajax 호출");
      },5000)
    }
    // $.getJSON(selected + "?companycode=" + companycode, function(data) {
    $.getJSON(selected, function(data) {

      // split the data set into ohlc and volume
      var volumeColor = '';
      var ohlc = [],
          volume = [],
          volumeColor = '',
          dataLength = data.length;

      for (i = 0; i < dataLength; i++) {
        ohlc.push([
            data[i][0], // the date
            data[i][1], // open
            data[i][2], // high
            data[i][3], // low
            data[i][4] // close
        ]);
        volume.push([
          data[i][0], // the date
          data[i][5] // the volume
        ]);
        console.log(volume);
    }
    console.log("차트 데이터 저장");
    _chart = new Highcharts.StockChart({
      chart: {
        renderTo: 'container',
        events: {
          load: requestData
        }
      },
      title: {
      },
      rangeSelector: {
        inputEnabled: false,
          buttons: [{
            type: 'minute',
            count: 30,
            text: '30분'
          }, {
            type: 'hour',
            count: 1,
            text: '1시간'
          }, {
            type: 'hour',
            count: 6,
            text: '6시간'
          }, {
            type: 'all',
            text: '전체'
          }],
        buttonTheme: {
          fill: 'none',
          stroke: 'none',
          'stroke-width': 0,
          width: 50,
          height: 20,
          r: 8,
          style: {
            fontSize: "15px"
          }
        },
        selected: 1
      },
      scrollbar : {
        enabled: false
    	},
      navigator: {
        enabled: false
      },
      xAxis: {
        type: 'datetime',
        height: '100%',
        tickPixelInterval: 150,
        labels: {
          enabled: false
        }
      },
      yAxis: [{
        height: '70%',
        lineWidth: 2,
        resize: {
          enabled: true
        },
      }, {
        labels: {
        align: 'right',
        x: -3
        },
        top: '75%',
        height: '25%',
        offset: 0,
        lineWidth: 2
      }],
        legend: {
        enabled: false
        },
        credits: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        plotOptions: {
          candlestick: {
          lineColor: 'black',
          upColor: 'red',
          upLineColor: 'black'
          },
        series: {
          animation: false,
          dataGrouping: {
            units: [ ['second', [1]] ]
          },
        }
      },
      series: [{
        type: 'candlestick',
        name: 'AAPL',
        id: 'aapl',
        zIndex: 2,
        data: ohlc
      }, {
        type: 'column',
        name: '거래량',
        data: volume,
        yAxis: 1,
        turboThreshold: Number.MAX_VALUE
      }, {
        type: 'sma',
        linkedTo: 'aapl',
        zIndex: 1,
        marker: {
            enabled: false
        },
        dataGrouping: {
          groupPixelWidth: 500
        },
      }, {
        type: 'sma10',
        linkedTo: 'aapl',
        zIndex: 1,
        marker: {
            enabled: false
        },
        dataGrouping: {
          groupPixelWidth: 500
        }
      }, {
        type: 'sma15',
        linkedTo: 'aapl',
        zIndex: 1,
        marker: {
            enabled: false
        },
        dataGrouping: {
          groupPixelWidth: 500
        }
      }, {
        type: 'sma30',
        linkedTo: 'aapl',
        zIndex: 1,
        marker: {
            enabled: false
        },
        dataGrouping: {
          groupPixelWidth: 500
        }
      }, {
        type: 'sma60',
        linkedTo: 'aapl',
        zIndex: 1,
        marker: {
            enabled: false
        },
        dataGrouping: {
          groupPixelWidth: 500
        }
      }]
    });
      console.log("차트그리기");
  });
});
