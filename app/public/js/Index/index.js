// 导航条高亮
$('#homeNav').addClass('active');
$(".exampleBtn").on("click", function() {
  $("#geneSymbol").val("TLR4\nIL1\nTNF\nNOS2\nMYD88\nSOCS1\nTLR3\nIL6\nIFNG\nSERPINB1-PS1")
})
Highcharts.chart('pieChartContainer', {
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    type: 'pie',
  },
  credits: {
    enabled: false,
  },
  title: {
    text: 'Database statistics',
  },
  tooltip: {
    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
  },
  accessibility: {
    point: {
      valueSuffix: '%',
    },
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
      },
    },
  },
  series: [{
    name: 'Percentage',
    colorByPoint: true,
    data: [{
      name: 'Data1',
      y: 61.41,
      sliced: true,
      selected: true,
    }, {
      name: 'Data2',
      y: 11.84,
    }, {
      name: 'Data3',
      y: 10.85,
    }],
  }],
});
