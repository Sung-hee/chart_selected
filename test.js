const redraw = (event) => {
  const chartTarget = event.target;

  if (chartTarget.series[0].hasGroupedData) {

    // Get all the candlesticks that are shown
    const candlesticks = chartTarget.series[0].points;

    // Get all the volume bards that are shown
    const volumeBars = chartTarget.series[1].points;

    // Go through the candle chart and volume points and update the colors
    for (let i = 0; i < candlesticks.length; i++) {
      const candle = candlesticks[i];
      const volumeBar = volumeBars[i];

      if (candle.close > candle.open) {
        const color = 'green';
        volumeBar.color = color;
        candle.color = color;
      } else if (candle.close < candle.open) {
        const color = 'red';
        candle.color = color;
        volumeBar.color = color;
      }
    }
  }
};

$.getJSON('http://61.72.187.6/attn/maker?companycode=005930', function(data) {
    // split the data set into ohlc and volume
    var ohlc = [],
      volume = [],
      dataLength = data.length,
      // set the allowed units for data grouping
      groupingUnits = [
      	['day',[1]],
        [
          'week', // unit name
          [1] // allowed multiples
        ],
        [
          'month', [1, 3, 6]
        ]
      ],

      i = 0;

    for (i; i < dataLength; i += 1) {
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

    // create the chart
    Highcharts.stockChart('container', {
      chart: {
        events: {
        	redraw: redraw,
          load: function(event) {
            // Get the volume series by id.
            var volSeries = this.series.find(function(s) {
              return s.userOptions.id === 'volume';
            });
            // Override the poitAttribs function on the volume series.
            volSeries.pointAttribs = (function(original) {
              return function(point, state) {
                // Call the original pointAttribs function.
                var attribs = original.apply(this, arguments);

                // Get the price series using the id.
                var priceSeries = point.series.chart.series.find(function(s) {
                  return s.userOptions.id === 'price';
                });

                // Find the candle corresponding to the current volume point.
                var candle;
                if (point.series.hasGroupedData) {
                  // With grouped data, we need to find the candle from the grouped data.
                  var datagroup = point.dataGroup;
                  var groupIdx = point.series.groupMap.indexOf(datagroup);

                  candle = priceSeries.groupedData[groupIdx];
                } else {
                  // Non-grouped data, we can just use the normal data.
                  candle = priceSeries.data[point.index];
                }

                // Choose the color for the volume point based on the candle properties.
                var color = 'blue';
                if (candle.close > candle.open) {
                  color = 'green';
                } else if (candle.close < candle.open) {
                  color = 'red';
                }
                // Set the volume point's attribute(s) accordingly.
                attribs.fill = color;
                // Return the updated attributes.
                return attribs;
              };
            })(volSeries.pointAttribs);
            // Need to call update so the changes get taken into account on first draw.
            this.update({});
          }
        }
      },
      rangeSelector: {
      buttons:
        [
          {
            type: 'month',
            count: 1,
            text: '1D',
            dataGrouping: {
              forced: true,
              units: [
                ['day', [1]]
              ]
            }
          },
          {
            type: 'month',
            count: 6,
            text: '1W',
            dataGrouping: {
              forced: true,
              units: [
                ['week', [1]]
              ]
            }
          },
          {
            type: 'all',
            count: 1,
            text: 'All',
            dataGrouping: {
              units: [
                ['month', [1, 3, 6]]
              ]
            }
          }
        ],
        selected: 1
      },
      navigator: {
        enabled: false
      },
      title: {
        text: 'AAPL Historical'
      },

      yAxis: [{
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'OHLC'
        },
        height: '60%',
        lineWidth: 2,
        resize: {
          enabled: true
        }
      }, {
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'Volume'
        },
        top: '65%',
        height: '35%',
        offset: 0,
        lineWidth: 2
      }],

      tooltip: {
        split: true
      },

      series: [{
        type: 'candlestick',
        name: 'AAPL',
        id: 'price',
        data: ohlc,
        color: 'red',
        upColor: 'green',
        dataGrouping: {
          units: groupingUnits
        }
      }, {
        type: 'column',
        name: 'Volume',
        id: 'volume',
        data: volume,
        yAxis: 1,
        dataGrouping: {
          units: groupingUnits
        }
      }]
    });
  });
