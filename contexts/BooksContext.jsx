import { createContext, useEffect, useState } from "react"
import { databases } from "../lib/appwrite"
import { ID, Permission, Query, Role } from "react-native-appwrite"
import { useUser } from "../hooks/useUser"

const DATABASE_ID = "68db62870017f4f89b99"
const COLLECTION_ID = "68db660d000feaf7ed0c"

export const BooksContext = createContext()

export function BooksProvider({children}) {
  const [books, setBooks] = useState([])
  const { user } = useUser()

  async function fetchBooks() {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID, 
        COLLECTION_ID,
        [
          Query.equal('userId', user.$id)
        ]
      )

      setBooks(response.documents)
      console.log("Fetched books:", response.documents.length)
    } catch (error) {
      console.error("Error fetching books:", error.message)
    }
  }

  async function fetchBookById(id) {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id
      )

      return response
    } catch (error) {
      console.log(error.message)
    }
  }

  async function createBook(data) {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {...data, userId: user.$id, rating: 0},
        [
          Permission.read(Role.user(user.$id)),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
        ]
      )
      
      console.log("Book created:", response.$id)
      
      // Add to local state immediately
      setBooks((prevBooks) => [...prevBooks, response])
      
      return response
    } catch (error) {
      console.log("Error creating book:", error.message)
      throw error
    }
  }

  async function updateBook(id, data) {
    try {
      // First fetch the current book to merge with new data
      const currentBook = await databases.getDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id
      )

      // Merge existing data with new data to avoid missing required fields
      const updatedData = {
        title: currentBook.title,
        author: currentBook.author,
        description: currentBook.description,
        genre: currentBook.genre || 'Other',
        rating: currentBook.rating || 0,
        ...data // Override with new data
      }

      const response = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id,
        updatedData
      )
      
      console.log("Book updated:", id)
      
      // Update local state immediately
      setBooks((prevBooks) => 
        prevBooks.map((book) => 
          book.$id === id ? { ...book, ...data } : book
        )
      )
      
      return response
    } catch (error) {
      console.log('Error updating book:', error.message)
      throw error
    }
  }

  async function deleteBook(id) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id
      )
      
      console.log("Book deleted:", id)
      
      // Remove from local state immediately
      setBooks((prevBooks) => prevBooks.filter((book) => book.$id !== id))
      
    } catch (error) {
      console.log("Error deleting book:", error.message)
      throw error
    }
  }

  // Fetch books when user logs in
  useEffect(() => {
    if (user) {
      console.log("User logged in, fetching books")
      fetchBooks()
    } else {
      console.log("No user, clearing books")
      setBooks([])
    }
  }, [user])

  return (
    <BooksContext.Provider 
      value={{ books, fetchBooks, fetchBookById, createBook, updateBook, deleteBook }}
    >
      {children}
    </BooksContext.Provider>
  )
}