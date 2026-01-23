import { View, Text } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LoaderProvider } from '@/context/LoaderContext';
import { AuthProvider } from '@/context/AuthContext';
import { Slot } from 'expo-router';

const RootLayout = () => {

  const insets = useSafeAreaInsets();

  return (
    <LoaderProvider>
      <AuthProvider>
        <View style={{ marginTop: insets.top, flex: 1 }}>
          <Slot />
        </View>
      </AuthProvider>
    </LoaderProvider>
  )
}

export default RootLayout