import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

type TableProps = {
  data: { [key: string]: string }[];
  columns: string[];
};

export const Table: React.FC<TableProps> = ({ data, columns }) => {
  const renderItem = ({ item }: any) => (
    <View style={styles.row}>
      {columns.map((col) => (
        <Text style={styles.cell} key={col}>{item[col]}</Text>
      ))}
    </View>
  );

  return (
    <View>
      <View style={styles.header}>
        {columns.map((col) => (
          <Text style={[styles.cell, styles.headerText]} key={col}>{col}</Text>
        ))}
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(_, idx) => idx.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', backgroundColor: '#eee', padding: 10 },
  row: { flexDirection: 'row', padding: 10 },
  cell: { flex: 1, padding: 4 },
  headerText: { fontWeight: 'bold' },
});
