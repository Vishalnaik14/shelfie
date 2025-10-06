import { StyleSheet, Text, ScrollView, Alert } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { useBooks } from "../../../../hooks/useBooks"
import { Colors } from "../../../../constants/Colors"

// themed components
import ThemedText from "../../../../components/ThemedText"
import ThemedButton from "../../../../components/ThemedButton"
import ThemedView from "../../../../components/ThemedView"
import Spacer from "../../../../components/Spacer"
import ThemedTextInput from "../../../../components/ThemedTextInput"
import ThemedLoader from "../../../../components/ThemedLoader"

const EditBook = () => {
  const [book, setBook] = useState(null)
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [genre, setGenre] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const { id } = useLocalSearchParams()
  const { fetchBookById, updateBook } = useBooks()
  const router = useRouter()

  // Load book data when component mounts
  useEffect(() => {
    async function loadBook() {
      try {
        const bookData = await fetchBookById(id)
        setBook(bookData)
        setTitle(bookData.title || "")
        setAuthor(bookData.author || "")
        setGenre(bookData.genre || "")
        setDescription(bookData.description || "")
      } catch (error) {
        console.error("Error loading book:", error)
        Alert.alert("Error", "Failed to load book details")
      }
    }

    loadBook()

    return () => setBook(null)
  }, [id])

  // Handle save/update
  const handleSave = async () => {
    // Validation
    if (!title.trim()) {
      Alert.alert("Validation Error", "Please enter a book title")
      return
    }

    if (!author.trim()) {
      Alert.alert("Validation Error", "Please enter an author name")
      return
    }

    if (!description.trim()) {
      Alert.alert("Validation Error", "Please enter a description")
      return
    }

    setLoading(true)

    try {
      await updateBook(id, {
        title: title.trim(),
        author: author.trim(),
        genre: genre.trim() || "Other",
        description: description.trim(),
      })

      Alert.alert("Success", "Book updated successfully!", [
        {
          text: "OK",
          onPress: () => router.replace('/books')
        }
      ])
    } catch (error) {
      console.error("Error updating book:", error)
      Alert.alert("Error", "Failed to update book. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Handle cancel
  const handleCancel = () => {
    router.replace('/books')
  }

  if (!book) {
    return (
      <ThemedView safe={true} style={styles.container}>
        <ThemedLoader />
      </ThemedView>
    )
  }

  return (
    <ThemedView safe={true} style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText title={true} style={styles.heading}>
          Edit Book
        </ThemedText>

        <Spacer height={20} />

        {/* Title Input */}
        <ThemedText style={styles.label}>Book Title</ThemedText>
        <ThemedTextInput
          style={styles.input}
          placeholder="Enter book title"
          value={title}
          onChangeText={setTitle}
        />

        <Spacer height={15} />

        {/* Author Input */}
        <ThemedText style={styles.label}>Author</ThemedText>
        <ThemedTextInput
          style={styles.input}
          placeholder="Enter author name"
          value={author}
          onChangeText={setAuthor}
        />

        <Spacer height={15} />

        {/* Genre Input */}
        <ThemedText style={styles.label}>Genre</ThemedText>
        <ThemedTextInput
          style={styles.input}
          placeholder="Enter genre (e.g., Fiction, Non-fiction)"
          value={genre}
          onChangeText={setGenre}
        />

        <Spacer height={15} />

        {/* Description Input */}
        <ThemedText style={styles.label}>Description</ThemedText>
        <ThemedTextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter book description"
          value={description}
          onChangeText={setDescription}
          multiline={true}
          numberOfLines={6}
          textAlignVertical="top"
        />

        <Spacer height={30} />

        {/* Action Buttons */}
        <ThemedButton 
          onPress={handleSave} 
          style={styles.saveButton}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Saving..." : "Save Changes"}
          </Text>
        </ThemedButton>

        <Spacer height={10} />

        <ThemedButton 
          onPress={handleCancel} 
          style={styles.cancelButton}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </ThemedButton>

        <Spacer height={20} />
      </ScrollView>
    </ThemedView>
  )
}

export default EditBook

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  heading: {
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    fontSize: 16,
  },
  textArea: {
    minHeight: 120,
    paddingTop: 12,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    width: "100%",
  },
  cancelButton: {
    backgroundColor: '#666',
    width: "100%",
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
})
