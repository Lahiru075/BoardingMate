import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { logout } from '@/services/auth'

const home = () => {

  const handleLogin = async () => {
    await logout();
  }

  return (
    <TouchableOpacity
      onPress={handleLogin}
      className="bg-blue-600 py-3 rounded-xl shadow-lg shadow-blue-300 active:bg-blue-700"
    >
      <Text className="text-white text-center font-bold text-base tracking-wide">
        LOGOUT
      </Text>
    </TouchableOpacity>
  )
}

export default home