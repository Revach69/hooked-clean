import React, { useState } from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Text,
  useWindowDimensions,
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

type TabRoute = {
  key: string;
  title: string;
  content: React.ReactNode;
};

type TabsProps = {
  routes: TabRoute[];
};

export const Tabs: React.FC<TabsProps> = ({ routes }) => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const renderScene = SceneMap(
    routes.reduce((acc, route) => {
      acc[route.key] = () => <View style={styles.scene}>{route.content}</View>;
      return acc;
    }, {} as { [key: string]: React.ComponentType })
  );

  const renderCustomTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#ff6b6b' }}
      style={{ backgroundColor: 'white' }}
      renderLabel={({ route, focused }) => (
        <Text style={{ color: focused ? 'black' : 'gray', fontWeight: '600' }}>
          {route.title}
        </Text>
      )}
    />
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderCustomTabBar}
    />
  );
};

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    padding: 16,
  },
});
