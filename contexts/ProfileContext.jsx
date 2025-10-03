import { createContext, useEffect, useState } from "react"
import { databases, client } from "../lib/appwrite"
import { ID, Permission, Query, Role } from "react-native-appwrite"
import { useUser } from "../hooks/useUser"

const DATABASE_ID = "68db62870017f4f89b99"
const COLLECTION_ID = "68db660d000feaf7ed0c"

export const ProfileContext = createContext()

export function ProfileProvider({children}) {
  const [profile, setProfile] = useState(null)
  const { user } = useUser()

  async function fetchProfile() {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID, 
        COLLECTION_ID,
        [
          Query.equal('userId', user.$id)
        ]
      )

      if (response.documents.length > 0) {
        setProfile(response.documents[0])
      } else {
        // Create a default profile if none exists
        await createProfile({ readingGoal: 0 })
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  async function createProfile(data) {
    try {
      const newProfile = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {...data, userId: user.$id},
        [
          Permission.read(Role.user(user.$id)),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
        ]
      )
      setProfile(newProfile)
    } catch (error) {
      console.log(error.message)
    }
  }

  async function updateReadingGoal(goal) {
    try {
      if (!profile) return

      const updatedProfile = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        profile.$id,
        { readingGoal: goal }
      )
      setProfile(updatedProfile)
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    let unsubscribe
    const channel = `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`

    if (user) {
      fetchProfile()

      unsubscribe = client.subscribe(channel, (response) => {
        const { payload, events } = response

        if (events[0].includes("update")) {
          setProfile(payload)
        }
      })

    } else {
      setProfile(null)
    }

    return () => {
      if (unsubscribe) unsubscribe()
    }

  }, [user])

  return (
    <ProfileContext.Provider 
      value={{ profile, updateReadingGoal }}
    >
      {children}
    </ProfileContext.Provider>
  )
}