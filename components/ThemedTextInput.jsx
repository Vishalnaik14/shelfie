import { TextInput, useColorScheme } from 'react-native'
import { Colors } from '../constants/Colors'

export default function ThemedTextInput({ style, ...props }) {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light

  return (
    <TextInput 
      style={[
        {
          backgroundColor: theme.uiBackground,
          color: theme.text,       // <-- this is for typed text (already works)
          padding: 20,
          borderRadius: 6,
        },
        style
      ]}
      placeholderTextColor={colorScheme === 'dark' ? '#ffffff' : '#777'} // ✅ placeholder color here
      {...props}
    />
  )
}