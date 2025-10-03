import { StyleSheet, FlatList, Pressable, View } from 'react-native'
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
    if (!searchQuery) return true
    
    const query = searchQuery.toLowerCase()
    const titleMatch = book.title?.toLowerCase().includes(query) || false
    const authorMatch = book.author?.toLowerCase().includes(query) || false
    const genreMatch = book.genre?.toLowerCase().includes(query) || false
    
    return titleMatch || authorMatch || genreMatch
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
          placeholder="Search by title, author, or genre..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </ThemedView>

      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item.$id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/books/${item.$id}`)}>
            <ThemedCard style={styles.card}>
              <View style={styles.cardHeader}>
                <ThemedText style={styles.title} numberOfLines={2}>
                  {item.title}
                </ThemedText>
                {item.genre && (
                  <View style={styles.genreBadge}>
                    <ThemedText style={styles.genreText}>{item.genre}</ThemedText>
                  </View>
                )}
              </View>
              <ThemedText style={styles.author}>Written by {item.author}</ThemedText>
            </ThemedCard>
          </Pressable>
        )}
        ListEmptyComponent={
          <ThemedView style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>No books found</ThemedText>
          </ThemedView>
        }
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
    marginTop: 20,
    paddingBottom: 20,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
  },
  author: {
    fontSize: 14,
  },
  genreBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  genreText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
  },
})