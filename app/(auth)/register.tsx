import useLoader from '@/hooks/useLoader'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, ScrollView } from 'react-native'
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons'

const Register = () => {
    const router = useRouter()
    const { showLoader, hideLoader } = useLoader()

    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleRegister = async () => {
        if (!fullName || !email || !password || !confirmPassword) {
            Alert.alert('Missing Details', 'Please fill in all fields.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match!');
            return;
        }
        
        showLoader()
        try {
            router.replace('/home'); 
        } catch (error: any) {
            Alert.alert("Registration Failed", error.message);
        } finally {
            hideLoader()
        }
    }

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            className="flex-1"
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1 bg-gray-50">
                    
                    {/* Header Section */}
                    <View className="bg-blue-600 h-[35%] rounded-b-[50px] items-center justify-center pt-8">
                        <View className="bg-white/20 p-3 rounded-full mb-3">
                            <FontAwesome5 name="house-user" size={40} color="white" />
                        </View>
                        <Text className="text-white text-3xl font-bold tracking-wider">BoardingMate</Text>
                        <Text className="text-blue-100 text-sm mt-1">Landlord's Best Friend</Text>
                    </View>

                    {/* Form Container */}
                    <View className="flex-1 px-6 -mt-20">
                        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                            
                            <View className="bg-white rounded-3xl shadow-xl p-8 mb-6">
                                
                                <View className="items-center mb-6">
                                    <Text className="text-2xl font-bold text-gray-800">Create Account</Text>
                                    <Text className="text-gray-500 text-sm mt-1">Join us to manage your property</Text>
                                </View>

                                <View className="space-y-4">
                                    {/* Full Name */}
                                    <View>
                                        <Text className="text-gray-600 ml-1 text-xs font-bold uppercase mb-2">Full Name</Text>
                                        <View className="flex-row items-center border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50">
                                            <MaterialIcons name="person-outline" size={22} color="#6B7280" />
                                            <TextInput
                                                value={fullName}
                                                onChangeText={setFullName}
                                                placeholder="Enter your full name"
                                                className="flex-1 ml-3 text-gray-700 font-medium text-base h-10"
                                            />
                                        </View>
                                    </View>

                                    {/* Email Address */}
                                    <View>
                                        <Text className="text-gray-600 ml-1 text-xs font-bold uppercase mb-2">Email Address</Text>
                                        <View className="flex-row items-center border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50">
                                            <MaterialIcons name="mail-outline" size={22} color="#6B7280" />
                                            <TextInput
                                                value={email}
                                                onChangeText={setEmail}
                                                placeholder="Enter your email"
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                                className="flex-1 ml-3 text-gray-700 font-medium text-base h-10"
                                            />
                                        </View>
                                    </View>

                                    {/* Password */}
                                    <View>
                                        <Text className="text-gray-600 ml-1 text-xs font-bold uppercase mb-2">Password</Text>
                                        <View className="flex-row items-center border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50">
                                            <MaterialIcons name="lock-outline" size={22} color="#6B7280" />
                                            <TextInput
                                                value={password}
                                                onChangeText={setPassword}
                                                placeholder="Create a password"
                                                secureTextEntry={!showPassword}
                                                className="flex-1 ml-3 text-gray-700 font-medium text-base h-10"
                                            />
                                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                                <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={22} color="#9CA3AF" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    {/* Confirm Password */}
                                    <View>
                                        <Text className="text-gray-600 ml-1 text-xs font-bold uppercase mb-2">Confirm Password</Text>
                                        <View className="flex-row items-center border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50">
                                            <MaterialIcons name="verified-user" size={22} color="#6B7280" />
                                            <TextInput
                                                value={confirmPassword}
                                                onChangeText={setConfirmPassword}
                                                placeholder="Repeat your password"
                                                secureTextEntry={!showConfirmPassword}
                                                className="flex-1 ml-3 text-gray-700 font-medium text-base h-10"
                                            />
                                            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                <MaterialIcons name={showConfirmPassword ? "visibility" : "visibility-off"} size={22} color="#9CA3AF" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>

                                {/* Register Button */}
                                <TouchableOpacity
                                    onPress={handleRegister}
                                    activeOpacity={0.8}
                                    className="bg-blue-600 py-4.5 rounded-xl shadow-lg shadow-blue-300 active:bg-blue-700 mt-8"
                                    style={{ paddingVertical: 16 }}
                                >
                                    <Text className="text-white text-center font-bold text-lg tracking-wide">
                                        REGISTER
                                    </Text>
                                </TouchableOpacity>

                            </View>

                            {/* Footer */}
                            <View className="flex-row justify-center mb-10">
                                <Text className="text-gray-600">Already have an account? </Text>
                                <TouchableOpacity onPress={() => router.back()}>
                                    <Text className="text-blue-600 font-bold">Login Now</Text>
                                </TouchableOpacity>
                            </View>

                        </ScrollView>
                    </View>

                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

export default Register