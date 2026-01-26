import useLoader from '@/hooks/useLoader'
import { login } from '@/services/auth'
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
  Dimensions 
} from 'react-native'
import { MaterialIcons, AntDesign, Ionicons } from '@expo/vector-icons'

const { width, height } = Dimensions.get('window');

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
            await login(email, password);
            router.replace('/home');
        } catch (error: any) {
            Alert.alert("Login Failed", "Invalid Email or Password.");
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
                    <View style={styles.inner}>

                        {/* 1. TOP SECTION (LOGO & TITLES) - Height adu kala */}
                        <View style={styles.topSection}>
                            <View style={styles.logoCircle}>
                                <Ionicons name="home" size={38} color="#FF5A5F" />
                            </View>
                            <Text style={styles.brandTitle}>
                                Boarding<Text style={{ color: '#FF5A5F' }}>Mate</Text>
                            </Text>
                            <Text style={styles.brandSub}>Smart Property Management</Text>
                        </View>

                        {/* 2. FORM CONTAINER */}
                        <View style={styles.formWrapper}>
                            <View style={styles.card}>
                                
                                <View style={styles.cardHeader}>
                                    <Text style={styles.welcomeText}>Welcome Back!</Text>
                                    <Text style={styles.subText}>Log in to manage your property</Text>
                                </View>

                                <View style={styles.inputsArea}>
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
                                </View>

                                {/* Forgot Password */}
                                <TouchableOpacity style={styles.forgotBtn}>
                                    <Text style={styles.forgotText}>Forgot Password?</Text>
                                </TouchableOpacity>

                                {/* Login Button */}
                                <TouchableOpacity
                                    onPress={handleLogin}
                                    activeOpacity={0.8}
                                    style={styles.loginBtn}
                                >
                                    <Text style={styles.loginBtnText}>Login</Text>
                                </TouchableOpacity>

                                {/* Google Login */}
                                <TouchableOpacity
                                    onPress={() => Alert.alert("Coming Soon")}
                                    style={styles.googleBtn}
                                >
                                    <AntDesign name="google" size={16} color="#757575" />
                                    <Text style={styles.googleBtnText}>Sign in with Google</Text>
                                </TouchableOpacity>

                            </View>

                            {/* Footer */}
                            <View style={styles.footer}>
                                <Text style={styles.footerText}>Don't have an account? </Text>
                                <TouchableOpacity onPress={() => router.push('/register')}>
                                    <Text style={styles.signUpText}>Sign Up</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#FDFDFD',
        overflow: 'hidden' 
    },
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
        height: '28%', // 32% idan adu kala
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 30,
        zIndex: 1,
    },
    logoCircle: {
        backgroundColor: 'white',
        padding: 15,
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
    brandSub: {
        fontSize: 9,
        color: '#A0A0A0',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginTop: 2,
    },

    // Form Card
    formWrapper: { flex: 1, paddingHorizontal: 30, zIndex: 1 },
    card: {
        backgroundColor: 'white',
        borderRadius: 35,
        paddingHorizontal: 25,
        paddingVertical: 25, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 }, 
        shadowOpacity: 0.05, 
        shadowRadius: 20,
        elevation: 10, 
        borderWidth: 1,
        borderColor: '#F8F8F8',
    },
    cardHeader: { alignItems: 'center', marginBottom: 20 },
    welcomeText: { fontSize: 20, fontWeight: 'bold', color: '#2D3436' },
    subText: { fontSize: 12, color: '#A0A0A0', marginTop: 2 },

    // Inputs
    inputsArea: { gap: 10 },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F8FA',
        borderRadius: 15,
        paddingHorizontal: 15,
        height: 50, // 55 idan adu kala
        borderWidth: 1,
        borderColor: '#ECECEC',
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        color: '#2D3436',
    },

    forgotBtn: { alignSelf: 'center', marginTop: 12, marginBottom: 15 },
    forgotText: { color: '#A0A0A0', fontWeight: 'bold', fontSize: 12 },
    
    loginBtn: {
        backgroundColor: '#FF5A5F',
        height: 52, // 60 idan adu kala
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FF5A5F',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    loginBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },

    googleBtn: {
        flexDirection: 'row',
        height: 48, // 55 idan adu kala
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        backgroundColor: 'white',
    },
    googleBtnText: { color: '#666', fontSize: 14, fontWeight: 'bold', marginLeft: 8 },

    // Footer
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 25, // Form eka lagata gaththa
        paddingBottom: 20,
    },
    footerText: { fontSize: 14, color: '#A0A0A0' },
    signUpText: { fontSize: 14, color: '#FF5A5F', fontWeight: 'bold' },
});

export default Login;