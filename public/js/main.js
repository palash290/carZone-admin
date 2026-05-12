$(document).ready(function () {

  // ── Sidebar Toggles ──
  $(".ct_menu_bar").click(function () {
    $("main").addClass("ct_show");
  });

  $(".ct_close_sidebar").click(function () {
    $("main").removeClass("ct_show");
  });


  // ── Animate Bars ──
  setTimeout(() => {
    document.querySelectorAll('.bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.width + '%';
    });
  }, 200);


  // ── Revenue Overview Chart ──
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data = [12000, 4560, 28000, 14000, 10000, 16000, 13000, 19000, 22000, 24000, 11000, 22000];

  const revenueOptions = {
    chart: {
      type: 'area',
      height: 220,
      toolbar: { show: false },
      zoom: { enabled: false },
      sparkline: { enabled: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 900,
      },
    },
    series: [{
      name: 'Revenue',
      data: data,
    }],
    xaxis: {
      categories: months,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: Array(12).fill('#919EAB'),
          fontSize: '12px',
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 400,
        },
      },
    },
    yaxis: {
      show: true,
      tickAmount: 4,
      min: 0,
      max: 45000,
      labels: {
        formatter: val => val === 0 ? '0' : (val / 1000) + 'k',
        style: {
          colors: ['#919EAB'],
          fontSize: '12px',
          fontFamily: 'DM Sans, sans-serif',
        },
        offsetX: -8,
      },
    },
    grid: {
      borderColor: '#e8eaf0',
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { left: 4, right: 4, top: 0, bottom: 0 },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
      colors: ['#8F0C1F'],
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.22,
        opacityTo: 0.0,
        stops: [0, 95],
        colorStops: [
          { offset: 0, color: '#8F0C1F78' },
          { offset: 100, color: '#8F0C1F00' },
        ],
      },
    },
    markers: {
      size: 0,
      hover: {
        size: 5,
        sizeOffset: 2,
        fillColor: '#ef4444',
        strokeColor: '#fff',
        strokeWidth: 2,
      },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    tooltip: {
      custom: ({ series, seriesIndex, dataPointIndex }) => {
        const val = series[seriesIndex][dataPointIndex];
        const formatted = "CHF " + val.toLocaleString('de-CH') + '.–';
        return `<div class="tooltip-title">${months[dataPointIndex]}</div>
                <div class="tooltip-value">${formatted}</div>`;
      },
    },
  };

  const revenueEl = document.querySelector('#revenueChart');
  if (revenueEl) {
    const revenueChart = new ApexCharts(revenueEl, revenueOptions);
    revenueChart.render();
  } else {
    console.warn('⚠️ #revenueChart element not found in DOM.');
  }


  // ── Donut Chart ──
const donutOptions = {
  series: [72, 28],
  chart: {
    type: 'donut',
    width: 180,
    height: 180,
    animations: { enabled: true, easing: 'easeinout', speed: 1000 },
    sparkline: { enabled: false },
    toolbar: { show: false },
  },
  labels: ['Monthly', 'Yearly'],
  colors: ['#9b1c2e', '#d1d5db'],
  stroke: { width: 0 },
  plotOptions: {
    pie: {
      donut: {
        size: '72%',
        labels: {
          show: true,
          name: {
            show: true,
            fontSize: '11px',
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 500,
            color: '#6b7280',
            offsetY: 20,
          },
          value: {
            show: true,
            fontSize: '22px',       // ← large enough to show full "72%"
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 700,
            color: '#18181b',
            offsetY: -10,
            formatter: () => '72%', // ← renders the % correctly
          },
          total: {
            show: true,
            showAlways: true,       // ← keeps it visible when not hovering
            label: 'MONTHLY',
            fontSize: '11px',
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 500,
            color: '#6b7280',
            formatter: () => '72%',
          },
        },
      },
    },
  },
  dataLabels: { enabled: false },
  legend: { show: false },
  tooltip: { enabled: true, y: { formatter: (val) => val + '%' } },
  states: { hover: { filter: { type: 'darken', value: 0.85 } } },
};

  const donutEl = document.querySelector('#donutChart');
  if (donutEl) {
    const donutChart = new ApexCharts(donutEl, donutOptions);
    donutChart.render();
  } else {
    console.warn('⚠️ #donutChart element not found in DOM.');
  }


  // ── Video Modal ──
  const videoModal = document.getElementById('videoModal');
  const videoFrame = document.getElementById('videoFrame');

  if (videoModal && videoFrame) {
    videoModal.addEventListener('shown.bs.modal', () => {
      videoFrame.src = VIDEO_SRC;
    });

    videoModal.addEventListener('hide.bs.modal', () => {
      videoFrame.src = '';
    });
  } else {
    console.warn('⚠️ videoModal or videoFrame element not found in DOM.');
  }

});