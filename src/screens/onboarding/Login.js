import React, { useState } from 'react';
import { View, TextInput, Text, Alert, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.farmItText}>
        Farm<Text style={styles.italicText}>It</Text>
      </Text>
      <View style={styles.formContainer}>
        <Text style={styles.signInText}>Sign In</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.rememberContainer}>
          <TouchableOpacity onPress={() => setRememberMe(!rememberMe)} style={styles.checkbox}>
            <View style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              borderWidth: 1,
              borderColor: 'gray',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: rememberMe ? '#48bb78' : 'transparent',
            }}>
              {rememberMe && <Text style={{ color: 'white' }}>✔</Text>} 
            </View>
            <Text style={styles.rememberText}>Remember Me</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert("Forgot Password", "Link to reset password.")}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.orContainer}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.orLine} />
        </View>

        <View style={styles.socialContainer}>
          <TouchableOpacity onPress={() => Alert.alert("Login with Google")} style={styles.socialButton}>
            <Image source={{ uri: 'https://img.icons8.com/color/48/000000/google-logo.png' }} style={styles.socialIcon} />
            <Text style={styles.socialText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert("Login with Facebook")} style={styles.socialButton}>
            <Image source={{ uri: 'https://img.icons8.com/color/48/000000/facebook-new.png' }} style={styles.socialIcon} />
            <Text style={styles.socialText}>Facebook</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.registerContainer}>
          <Text style={styles.registerPromptText}>Do not have an Account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('LanguageSelection')}>
            <Text style={styles.registerText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', 
    padding: 16,
  },
  farmItText: {
    fontSize: 32,
    fontWeight: '600', 
    marginBottom: 20,
    color: 'black',
  },
  italicText: {
    fontStyle: 'italic',
    color: '#48bb78', 
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  signInText: {
    fontSize: 24,
    fontWeight: '500', 
    marginBottom: 24,
    textAlign: 'left', 
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#f0f0f0', 
    borderRadius: 8,
    paddingHorizontal: 10, 
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: 'transparent', 
    borderRadius: 8,
  },
  icon: {
    color: 'black', 
    marginRight: 10,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rememberText: {
    color: 'gray',
    marginLeft: 8,
  },
  forgotText: {
    color: '#48bb78', 
    marginLeft: 'auto',
  },
  loginButton: {
    backgroundColor: '#48bb78',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  loginButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  orText: {
    marginHorizontal: 8,
    color: 'gray',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', 
    borderWidth: 0, 
    padding: 10,
    borderRadius: 8,
    width: '45%', 
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  socialText: {
    marginLeft: 8,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  registerPromptText: {
    color: 'black', 
  },
  registerText: {
    color: '#48bb78', 
  },
});

export default Login;