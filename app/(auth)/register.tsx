import useLoader from '@/hooks/useLoader'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { 
  Alert, 
  Keyboard, 
  KeyboardAvoidingView, 
  Platform, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  View, 
  StatusBar, 
  StyleSheet, 
  Dimensions,
  ScrollView 
} from 'react-native'
import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import { registation } from '@/services/auth'

const { width, height } = Dimensions.get('window');

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
            await registation(fullName, email, password);
            Alert.alert("Success", "Registration Successful!");
            router.replace('/login');
        } catch (error: any) {
            Alert.alert("Registration Failed", error.message);
        } finally {
            hideLoader()
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* BACKGROUND DECORATIONS */}
            <View style={styles.bgCircleTop} />
            <View style={styles.bgCircleBottom} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                        <View style={styles.inner}>

                            {/* 1. TOP SECTION (LOGO & BRANDING) */}
                            <View style={styles.topSection}>
                                <View style={styles.logoCircle}>
                                    <Ionicons name="person-add" size={32} color="#FF5A5F" />
                                </View>
                                <Text style={styles.brandTitle}>
                                    Boarding<Text style={{ color: '#FF5A5F' }}>Mate</Text>
                                </Text>
                                <Text style={styles.brandTagline}>SMART PROPERTY MANAGEMENT</Text>
                            </View>

                            {/* 2. FORM CONTAINER */}
                            <View style={styles.formWrapper}>
                                <View style={styles.card}>
                                    
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.welcomeText}>Create Account</Text>
                                        <Text style={styles.subText}>Fill the details to join BoardingMate</Text>
                                    </View>
                                    
                                    <View style={styles.inputsArea}>
                                        {/* Full Name */}
                                        <View style={styles.inputContainer}>
                                            <MaterialIcons name="person-outline" size={18} color="#A0A0A0" />
                                            <TextInput
                                                value={fullName}
                                                onChangeText={setFullName}
                                                placeholder="Full Name"
                                                placeholderTextColor="#A0A0A0"
                                                style={styles.input}
                                            />
                                        </View>

                                        {/* Email */}
                                        <View style={styles.inputContainer}>
                                            <MaterialIcons name="mail-outline" size={18} color="#A0A0A0" />
                                            <TextInput
                                                value={email}
                                                onChangeText={setEmail}
                                                placeholder="Email Address"
                                                placeholderTextColor="#A0A0A0"
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                                style={styles.input}
                                            />
                                        </View>

                                        {/* Password */}
                                        <View style={styles.inputContainer}>
                                            <MaterialIcons name="lock-outline" size={18} color="#A0A0A0" />
                                            <TextInput
                                                value={password}
                                                onChangeText={setPassword}
                                                placeholder="Password"
                                                placeholderTextColor="#A0A0A0"
                                                secureTextEntry={!showPassword}
                                                style={styles.input}
                                            />
                                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={18} color="#A0A0A0" />
                                            </TouchableOpacity>
                                        </View>

                                        {/* Confirm Password */}
                                        <View style={styles.inputContainer}>
                                            <MaterialIcons name="verified-user" size={18} color="#A0A0A0" />
                                            <TextInput
                                                value={confirmPassword}
                                                onChangeText={setConfirmPassword}
                                                placeholder="Confirm Password"
                                                placeholderTextColor="#A0A0A0"
                                                secureTextEntry={!showConfirmPassword}
                                                style={styles.input}
                                            />
                                            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={18} color="#A0A0A0" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    {/* Register Button */}
                                    <TouchableOpacity
                                        onPress={handleRegister}
                                        activeOpacity={0.8}
                                        style={styles.registerBtn}
                                    >
                                        <Text style={styles.registerBtnText}>Get Started</Text>
                                    </TouchableOpacity>

                                </View>

                                {/* Footer */}
                                <View style={styles.footer}>
                                    <Text style={styles.footerText}>Already have an account? </Text>
                                    <TouchableOpacity onPress={() => router.back()}>
                                        <Text style={styles.loginText}>Login Now</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FDFDFD' },
    keyboardView: { flex: 1 },
    inner: { flex: 1 },
    
    // Background Decorations
    bgCircleTop: {
        position: 'absolute',
        top: -height * 0.05,
        right: -width * 0.15,
        width: width * 0.7,
        height: width * 0.7,
        borderRadius: width,
        backgroundColor: '#FFF1F1', 
        opacity: 0.7,
    },
    bgCircleBottom: {
        position: 'absolute',
        bottom: -height * 0.05,
        left: -width * 0.15,
        width: width * 0.6,
        height: width * 0.6,
        borderRadius: width,
        backgroundColor: '#FFF1F1',
        opacity: 0.5,
    },

    // Top Branding
    topSection: {
        height: height * 0.22,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 30,
        zIndex: 1,
    },
    logoCircle: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 50,
        marginBottom: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    brandTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: '#2D3436',
    },
    brandTagline: {
        fontSize: 9,
        color: '#A0A0A0',
        fontWeight: 'bold',
        letterSpacing: 1.5,
        marginTop: 3,
    },

    // Form Card Wrapper
    formWrapper: { 
        flex: 1, 
        paddingHorizontal: 30, 
        zIndex: 1,
        marginTop: 10
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 35,
        paddingHorizontal: 25,
        paddingVertical: 35,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 10,
        borderWidth: 1,
        borderColor: '#F2F2F2',
    },
    cardHeader: { alignItems: 'center', marginBottom: 25 },
    welcomeText: { fontSize: 24, fontWeight: 'bold', color: '#2D3436' },
    subText: { fontSize: 13, color: '#A0A0A0', marginTop: 5, textAlign: 'center' },

    // Inputs
    inputsArea: { gap: 12 },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F8FA',
        borderRadius: 15,
        paddingHorizontal: 15,
        height: 52,
        borderWidth: 1,
        borderColor: '#ECECEC',
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        color: '#2D3436',
    },
    
    registerBtn: {
        backgroundColor: '#FF5A5F',
        height: 55,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FF5A5F',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
        marginTop: 30,
    },
    registerBtnText: { color: 'white', fontSize: 17, fontWeight: 'bold' },

    // Footer
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
        paddingBottom: 40,
    },
    footerText: { fontSize: 14, color: '#A0A0A0' },
    loginText: { fontSize: 14, color: '#FF5A5F', fontWeight: 'bold' },
});

export default Register;