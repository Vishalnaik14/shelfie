import { Client, Account, Avatars, Databases } from "react-native-appwrite"

export const client = new Client()

client
  .setEndpoint('https://fra.cloud.appwrite.io/v1')  // Endpoint first
  .setProject('68d11741000085700ac4')               // Project ID second
  .setPlatform('dev.netninja.shelfie')            // Platform third

export const account = new Account(client)
export const avatars = new Avatars(client)
export const databases = new Databases(client)