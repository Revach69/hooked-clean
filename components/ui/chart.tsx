import React from 'react';
import { View } from 'react-native';
import { VictoryChart, VictoryLine, VictoryTheme } from 'victory-native';

const sampleData = [
  { x: 1, y: 2 },
  { x: 2, y: 3 },
  { x: 3, y: 5 },
];

export const Chart = () => {
  return (
    <View style={{ padding: 20 }}>
      <VictoryChart theme={VictoryTheme.material}>
        <VictoryLine data={sampleData} />
      </VictoryChart>
    </View>
  );
};

export default Chart;
