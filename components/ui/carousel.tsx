import React from 'react';
import Carousel from 'react-native-snap-carousel';
import { View, Text, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export function CarouselComponent({ items }: { items: string[] }) {
  return (
    <Carousel
      data={items}
      renderItem={({ item }) => (
        <View style={{ backgroundColor: '#eee', padding: 20, borderRadius: 10 }}>
          <Text>{item}</Text>
        </View>
      )}
      sliderWidth={width}
      itemWidth={width - 60}
    />
  );
}
