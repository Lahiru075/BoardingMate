import { View, Text, ActivityIndicator } from 'react-native'
import ".././global.css"
import React from 'react'
import useAuth from '@/hooks/useAuth'
import { Redirect } from 'expo-router'

const index = () => {

  const { user, loading } = useAuth()

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#4ade80" />
      </View>
    )
  }

  if (user) {
    return <Redirect href="/home" />
  } else {
    return <Redirect href="/login" />
  }

}

export default index