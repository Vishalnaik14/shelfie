import { StyleSheet, useColorScheme, View, Platform } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { Colors } from '../constants/Colors'

const ThemedDropdown = ({ 
  selectedValue, 
  onValueChange, 
  items = [], 
  placeholder = "Select an option...",
  style,
  ...props 
}) => {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light

  // Determine text color based on theme
  const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000'
  const iconColor = colorScheme === 'dark' ? '#FFFFFF' : '#666666'
  const backgroundColor = colorScheme === 'dark' ? '#2d2a2a' : '#FFFFFF'
  const borderColor = colorScheme === 'dark' ? '#444' : '#ccc'

  return (
    <View 
      style={[
        styles.pickerWrapper,
        { 
          backgroundColor: backgroundColor,
          borderColor: borderColor
        },
        style
      ]}
    >
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={[styles.picker, { color: textColor }]}
        mode="dropdown"
        dropdownIconColor={iconColor}
        {...props}
      >
        <Picker.Item 
          label={placeholder} 
          value="" 
          color={colorScheme === 'dark' ? '#999' : '#666'}
        />
        {items.map((item, index) => (
          <Picker.Item 
            key={item.value || item.label || index} 
            label={item.label || item} 
            value={item.value || item}
            color={textColor}
          />
        ))}
      </Picker>
    </View>
  )
}

export default ThemedDropdown

const styles = StyleSheet.create({
  pickerWrapper: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        height: 200,
      },
      android: {
        height: 50,
      },
    }),
  },
  picker: {
    ...Platform.select({
      ios: {
        height: 180,
      },
      android: {
        height: 50,
      },
    }),
  },
})