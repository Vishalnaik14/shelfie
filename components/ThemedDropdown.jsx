// components/ThemedDropdown.jsx
import React from 'react'
import { StyleSheet, useColorScheme, View, Platform } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { Colors } from '../constants/Colors'

const ThemedDropdown = ({ selectedValue, onValueChange, items = [], style, pickerStyle, ...props }) => {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.uiBackground, borderColor: theme.border }, style]}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={[styles.picker, { color: theme.text }, pickerStyle]}
        dropdownIconColor={theme.text}
        {...props}
      >
        {items.map((item) => (
          <Picker.Item key={item.value} label={item.label} value={item.value} color={theme.text} />
        ))}
      </Picker>
    </View>
  )
}

export default ThemedDropdown

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    ...Platform.select({
      ios: { height: 180 },
      android: { height: 50 },
    }),
  },
  picker: {
    width: '100%',
    ...Platform.select({
      ios: { height: 180 },
      android: { height: 50 },
    }),
  },
})
