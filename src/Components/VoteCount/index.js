import React from 'react';
import { Text, View } from 'react-native';
import styles from './styles';

export default function VoteCount({ inverted, count }) {
  return (
    <View
      style={[styles.circle, inverted ? styles.inverted : styles.notInverted]}
    >
      <Text style={[styles.text, { color: !inverted ? 'white' : '#e26e64' }]}>
        {count}
      </Text>
    </View>
  );
}