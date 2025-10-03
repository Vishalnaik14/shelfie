import { StyleSheet, FlatList, Pressable } from 'react-native'
import { useState } from 'react'
import { useBooks } from '../../hooks/useBooks'
import { Colors } from '../../constants/Colors'
import { useRouter } from 'expo-router'

import Spacer from "../../components/Spacer"
import ThemedText from "../../components/ThemedText"
import ThemedView from "../../components/ThemedView"
import ThemedCard from "../../components/ThemedCard"
import ThemedTextInput from "../../components/ThemedTextInput"

const Books = () => {
  const { books } = useBooks()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  // Filter books based on search query
  const filteredBooks = books.filter((book) => {
    if (!searchQuery) return true // Show all books if no search query
    
    const query = searchQuery.toLowerCase()
    const titleMatch = book.title.toLowerCase().includes(query)
    const authorMatch = book.author.toLowerCase().includes(query)
    
    return titleMatch || authorMatch
  })

  return (
    <ThemedView style={styles.container} safe={true}>

      <Spacer />
      <ThemedText title={true} style={styles.heading}>
        Your Reading List
      </ThemedText>

      <Spacer />
      
      {/* Search Bar */}
      <ThemedView style={styles.searchContainer}>
        <ThemedTextInput
          style={styles.searchInput}
          placeholder="Search by title or author..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </ThemedView>

      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item.$id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/books/${item.$id}`)}>
            <ThemedCard style={styles.card}>
              <ThemedText style={styles.title}>{item.title}</ThemedText>
              <ThemedText>Written by {item.author}</ThemedText>
            </ThemedCard>
          </Pressable>
        )}
      />

    </ThemedView>
  )
}

export default Books

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  searchContainer: {
    paddingHorizontal: "5%",
    marginTop: 10,
  },
  searchInput: {
    width: "100%",
    marginBottom: 10,
  },
  list: {
    marginTop: 20
  },
  card: {
    width: "90%",
    marginHorizontal: "5%",
    marginVertical: 10,
    padding: 10,
    paddingLeft: 14,
    borderLeftColor: Colors.primary,
    borderLeftWidth: 4
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
})