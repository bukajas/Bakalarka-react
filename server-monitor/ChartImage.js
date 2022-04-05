import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Chart, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem, exportVisual } from '@progress/kendo-react-charts';
import 'hammerjs';
import { exportImage } from '@progress/kendo-drawing';
import { saveAs } from '@progress/kendo-file-saver';

class ChartContainer extends React.Component {
  render() {
    return <div>
                <button className="k-button" onClick={this.onImageExportClick}>Export as Image</button>
                <Chart ref={cmp => this._chart = cmp}>
                    <ChartCategoryAxis>
                        <ChartCategoryAxisItem categories={[2015, 2016, 2017, 2018]} />
                    </ChartCategoryAxis>
                    <ChartSeries>
                        <ChartSeriesItem data={[110, 230, 200, 78]} />
                    </ChartSeries>
                </Chart>
            </div>;
  }

  onImageExportClick = () => {
    const chartVisual = exportVisual(this._chart);

    if (chartVisual) {
      exportImage(chartVisual, {
        width: 1200,
        height: 800
      }).then(dataURI => saveAs(dataURI, 'chart.png'));
    }
  };
}

export default ChartImage