import { StyleSheet, Text, TouchableWithoutFeedback, Keyboard, ScrollView, Platform } from 'react-native'
import { useBooks } from "../../hooks/useBooks"
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Picker } from '@react-native-picker/picker'

// themed components
import ThemedView from "../../components/ThemedView"
import ThemedText from "../../components/ThemedText"
import ThemedTextInput from "../../components/ThemedTextInput"
import ThemedButton from '../../components/ThemedButton'
import Spacer from '../../components/Spacer'

// Genre options
const GENRES = [
  'Fiction',
  'Non-Fiction',
  'Mystery',
  'Thriller',
  'Romance',
  'Science Fiction',
  'Fantasy',
  'Biography',
  'History',
  'Self-Help',
  'Other'
]

const Create = () => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [description, setDescription] = useState("")
  const [genre, setGenre] = useState("") 
  const [loading, setLoading] = useState(false)

  const { createBook } = useBooks()
  const router = useRouter()

  async function handleSubmit() {
    // Debug: Check what values we have
    console.log("Form values:", { title, author, description, genre })
    
    if (!title.trim() || !author.trim() || !description.trim() || !genre) {
      console.log("Validation failed - missing fields")
      alert("Please fill in all fields including genre")
      return
    }

    setLoading(true)
    
    try {
      // create the book with genre
      console.log("Creating book with:", { title, author, description, genre })
      await createBook({ title, author, description, genre })
      
      console.log("Book created successfully!")

      // reset fields
      setTitle("")
      setAuthor("")
      setDescription("")
      setGenre("")

      // redirect
      router.replace("/books")
    } catch (error) {
      console.error("Error creating book:", error)
      alert("Error creating book: " + error.message)
    } finally {
      // reset loading state
      setLoading(false) 
    }
  }

  return (
    <ThemedView style={styles.container} safe={true}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={true}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ThemedView style={styles.formContainer}>
            <ThemedText title={true} style={styles.heading}>
              Add a New Book
            </ThemedText>
            <Spacer />

            <ThemedTextInput
              style={styles.input}
              placeholder="Book Title"
              value={title}
              onChangeText={setTitle}
            />
            <Spacer />

            <ThemedTextInput
              style={styles.input}
              placeholder="Author"
              value={author}
              onChangeText={setAuthor}
            />
            <Spacer />

           {/* Genre Dropdown */}
            <ThemedView style={styles.pickerContainer}>
              <ThemedText style={styles.label}>Genre:</ThemedText>
              <ThemedView style={styles.pickerWrapper}>
                <Picker
                  selectedValue={genre}
                  onValueChange={(itemValue) => {
                    console.log("Selected genre:", itemValue)
                    setGenre(itemValue)
                  }}
                  style={styles.picker}
                  mode="dropdown"
                  dropdownIconColor="#666"
                >
                  <Picker.Item label="Select a genre..." value="" />
                  {GENRES.map((g) => (
                    <Picker.Item key={g} label={g} value={g} />
                  ))}
                </Picker>
              </ThemedView>
            </ThemedView>

            <Spacer />

            <ThemedTextInput
              style={styles.multiline}
              placeholder="Book Description"
              value={description}
              onChangeText={setDescription}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />
            <Spacer />

            <ThemedView style={styles.buttonContainer}>
              <ThemedButton 
                style={styles.button}
                onPress={handleSubmit} 
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Saving..." : "Create Book"}
                </Text>
              </ThemedButton>
            </ThemedView>
            <Spacer size={40} />
          </ThemedView>
        </TouchableWithoutFeedback>
      </ScrollView>
    </ThemedView>
  )
}

export default Create

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 40,
  },
  heading: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  input: {
    padding: 20,
    borderRadius: 6,
    alignSelf: 'stretch',
    marginHorizontal: 40,
  },
  multiline: {
    padding: 20,
    borderRadius: 6,
    minHeight: 100,
    alignSelf: 'stretch',
    marginHorizontal: 40,
  },
  pickerContainer: {
    alignSelf: 'stretch',
    marginHorizontal: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  pickerWrapper: {
    borderRadius: 8,
    borderColor: '#ccc',
    overflow: 'hidden',
    borderWidth: 1,
    backgroundColor: '#2d2a2aff',
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
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
  },
  button: {
    width: '50%',
    maxWidth: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})