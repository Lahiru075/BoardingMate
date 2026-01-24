// context/LoaderContext.tsx
import React, { createContext, useState, ReactNode, useContext } from "react"
import { View, ActivityIndicator, Dimensions } from "react-native"


interface LoaderContextProps {
  showLoader: () => void
  hideLoader: () => void
  isLoading: boolean
}

export const LoaderContext = createContext<LoaderContextProps>({
  showLoader: () => { },
  hideLoader: () => { },
  isLoading: false
})

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false)
  const screenHeight = Dimensions.get('screen').height;

  const showLoader = () => setIsLoading(true)
  const hideLoader = () => setIsLoading(false)

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader, isLoading }}>
      {children}

      {isLoading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: screenHeight, 
            zIndex: 999,          
            elevation: 10,        
            marginTop: -100,      
          }}
          className="justify-center items-center bg-black/30"
        >
          <View className="bg-gray-50 p-8 rounded-3xl shadow-xl">
            <ActivityIndicator size="large" color="#1e40af" />
          </View>
        </View>
      )}
    </LoaderContext.Provider>
  )
}
