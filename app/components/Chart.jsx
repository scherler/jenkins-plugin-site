import PureComponent from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { VictoryBar, VictoryChart,VictoryAxis, VictoryScatter } from 'victory';

const { array, string } = PropTypes;

export class Chart extends PureComponent {

  render() {
    const {label = 'Version of jenkins', data} = this.props;
    return (<VictoryChart
        domainPadding={{x: 10}}
      >
        <VictoryAxis
          dependentAxis
          label="Installations"
          style={{
                grid: {
                  stroke: 'grey',
                  strokeWidth: '1',
                },
                axis: {stroke: 'transparent'},
                ticks: {stroke: 'transparent'},
              }}
        />
        <VictoryAxis
          label={label}
        />
        <VictoryScatter
          data={data}
          symbol={"circle"}
        />
      </VictoryChart>
    );
  }
}

Chart.propTypes = {
  label: string,
  data: array.isRequired, // From react-router
};


export default Chart;
