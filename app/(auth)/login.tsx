import useLoader from '@/hooks/useLoader'
// import { login } from '@/services/authService'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { MaterialIcons, FontAwesome5, AntDesign } from '@expo/vector-icons'

const Login = () => {
    const router = useRouter()
    const { showLoader, hideLoader } = useLoader()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    
    const [showPassword, setShowPassword] = useState(false)

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Missing Details', 'Please enter both email and password.');
            return;
        }

        showLoader()

        try {
            // await login(email, password);
            router.replace('/home');
        } catch (error: any) {
            console.error("Login Error:", error);
            let msg = error.message;
            if(msg.includes('invalid-credential')) msg = "Invalid Email or Password.";
            Alert.alert("Login Failed", msg);
        } finally {
            hideLoader()
        }
    }

    const handleGoogleLogin = () => {
        Alert.alert("Coming Soon", "Google Sign-In will be implemented later!");
    }

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            className="flex-1"
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View className="flex-1 bg-gray-50">
                    
                    {/* HEADER */}
                    <View className="bg-blue-600 h-[35%] rounded-b-[50px] items-center justify-center pt-8">
                        <View className="bg-white/20 p-3 rounded-full mb-3">
                            <FontAwesome5 name="house-user" size={40} color="white" />
                        </View>
                        <Text className="text-white text-3xl font-bold tracking-wider">BoardingMate</Text>
                        <Text className="text-blue-100 text-sm mt-1">Landlord's Best Friend</Text>
                    </View>

                    {/* MAIN CONTAINER */}
                    <View className="flex-1 px-6 -mt-20">
                        
                        {/* WHITE CARD */}
                        <View className="bg-white rounded-3xl shadow-xl p-8">
                            
                            <View className="items-center mb-6">
                                <Text className="text-2xl font-bold text-gray-800">Welcome Back!</Text>
                                <Text className="text-gray-500 text-sm mt-1">Sign in to manage your property</Text>
                            </View>

                            {/* Inputs Section */}
                            <View className="space-y-5">
                                <View>
                                    <Text className="text-gray-600 ml-1 text-xs font-bold uppercase mb-2">Email Address</Text>
                                    <View className="flex-row items-center border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:border-blue-500">
                                        <MaterialIcons name="mail-outline" size={22} color="#6B7280" />
                                        <TextInput
                                            value={email}
                                            onChangeText={setEmail}
                                            placeholder="Enter your email"
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            className="flex-1 ml-3 text-gray-700 font-medium text-base"
                                        />
                                    </View>
                                </View>

                                {/* Password Field with Eye Icon */}
                                <View>
                                    <Text className="text-gray-600 ml-1 text-xs font-bold uppercase mb-2">Password</Text>
                                    <View className="flex-row items-center border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:border-blue-500">
                                        <MaterialIcons name="lock-outline" size={22} color="#6B7280" />
                                        
                                        {/* Password Input */}
                                        <TextInput
                                            value={password}
                                            onChangeText={setPassword}
                                            placeholder="Enter your password"
                                            secureTextEntry={!showPassword} 
                                            className="flex-1 ml-3 text-gray-700 font-medium text-base"
                                        />

                                        {/* Eye Icon Button */}
                                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                            <MaterialIcons 
                                                name={showPassword ? "visibility" : "visibility-off"} 
                                                size={22} 
                                                color="#9CA3AF" 
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            <TouchableOpacity className="items-end mt-3 mb-4">
                                <Text className="text-blue-500 font-medium text-sm">Forgot Password?</Text>
                            </TouchableOpacity>

                            {/* Login Button */}
                            <TouchableOpacity
                                onPress={handleLogin}
                                className="bg-blue-600 py-4 rounded-xl shadow-lg shadow-blue-300 active:bg-blue-700"
                            >
                                <Text className="text-white text-center font-bold text-lg tracking-wide">
                                    LOGIN
                                </Text>
                            </TouchableOpacity>

                            {/* DIVIDER */}
                            <View className="flex-row items-center my-8">
                                <View className="flex-1 h-[1px] bg-gray-200" />
                                <Text className="mx-3 text-gray-400 font-medium text-xs">OR</Text>
                                <View className="flex-1 h-[1px] bg-gray-200" />
                            </View>

                            {/* Google Button */}
                            <TouchableOpacity
                                onPress={handleGoogleLogin}
                                className="flex-row items-center justify-center bg-gray-50 border border-gray-200 py-4 rounded-xl active:bg-gray-100 mb-2"
                            >
                                <AntDesign name="google" size={20} color="#DB4437" />
                                <Text className="text-gray-700 font-bold text-base ml-2">
                                    Sign in with Google
                                </Text>
                            </TouchableOpacity>

                        </View>

                        {/* Register Link */}
                        <View className="flex-row justify-center mt-6">
                            <Text className="text-gray-600">Don't have an account? </Text>
                            <TouchableOpacity onPress={() => router.push('/register')}>
                                <Text className="text-blue-600 font-bold">Register Now</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

export default Login