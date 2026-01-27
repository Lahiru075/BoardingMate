import { View, Text } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LoaderProvider } from '@/context/LoaderContext';
import { AuthProvider } from '@/context/AuthContext';
import { Slot } from 'expo-router';
import Toast from 'react-native-toast-message';
import { BaseToast, ErrorToast } from 'react-native-toast-message';

const RootLayout = () => {

  const insets = useSafeAreaInsets();

  return (
    <LoaderProvider>
      <AuthProvider>
        <View style={{ marginTop: insets.top, marginBottom: insets.bottom, flex: 1 }}>
          <Slot />
          <Toast />
        </View>
      </AuthProvider>
    </LoaderProvider>
  )
}

export default RootLayout