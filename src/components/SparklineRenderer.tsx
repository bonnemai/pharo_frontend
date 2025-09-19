import { ICellRendererParams } from "ag-grid-community";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, LineController } from "chart.js";
import { SparklineData } from "types/Instrument";

// Register required scales, elements, and controllers
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, LineController);

export default class SparklineRenderer {
  eGui: HTMLDivElement | null = null;
  canvas: HTMLCanvasElement | null = null;
  chart: Chart | null = null;

  init(params: ICellRendererParams) {
    this.eGui = document.createElement("div");
    this.eGui.style.display = "flex";
    this.eGui.style.alignItems = "center";
    this.eGui.style.justifyContent = "center";
    this.eGui.style.height = "100%";

    this.canvas = document.createElement("canvas");
    this.canvas.width = 120; // small, sparkline-sized
    this.canvas.height = 28;
    this.canvas.style.maxWidth = "120px";
    this.canvas.style.maxHeight = "28px";

    this.eGui.appendChild(this.canvas);

    this.renderChart(params);
  }

  renderChart(params: ICellRendererParams) {
      const data: number[] = formatData(params.data.sparkline);
    if (!this.canvas) return;

    const gradient = this.canvas.getContext("2d")!.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, "rgba(0, 0, 0, 0.35)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0.02)");

    // Destroy existing chart if any
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    this.chart = new Chart(this.canvas, {
      type: "line",
      data: {
        labels: data.map((_, i) => i + 1),
        datasets: [
          {
            data,
            fill: true,
            borderWidth: 1.5,
            pointRadius: 0,
            tension: 0.35,
            backgroundColor: gradient,
          },
        ],
      },
      options: {
        responsive: false,
        animation: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: {
          x: { display: false },
          y: { display: false },
        },
        elements: { line: { borderCapStyle: "round" } },
      },
    });
  }

  getGui() {
    return this.eGui!;
  }

  refresh(params: ICellRendererParams) {
    if (!this.chart) {
      this.renderChart(params);
      return true;
    }
    const data: number[] = formatData(params.data.sparkline);
    this.chart.data.labels = data.map((_, i) => i + 1);
    this.chart.data.datasets[0].data = data as any;
    this.chart.update();
    return true;
  }

  destroy() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
    this.canvas = null;
    this.eGui = null;
  }

}

function formatData(sparkline: SparklineData[] | undefined): number[] {
    return Array.isArray(sparkline)
      ? sparkline.map((x: SparklineData) => x.level)
      : [];
  }