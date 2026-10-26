import { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useAuth } from '../auth'
import { Button, Card, Field, Message } from '../components/ui'
import type { AuthStackParamList } from '../navigation'
import { authStyles } from './SignInScreen'

export default function SignUpScreen({ navigation }: NativeStackScreenProps<AuthStackParamList, 'SignUp'>) {
  const { signUp } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !password) {
      setError('Fill in every field')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setIsLoading(true)
    setError('')
    try {
      await signUp(name.trim(), email.trim(), password)
    } catch (err) {
      setError((err as Error).message)
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView style={authStyles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={authStyles.container} keyboardShouldPersistTaps="handled">
          <View style={authStyles.brand}>
            <Text style={authStyles.logo}>FitSync</Text>
            <Text style={authStyles.tagline}>Create your account</Text>
          </View>
          <Card>
            <Field label="Name" value={name} onChangeText={setName} autoComplete="name" textContentType="name" />
            <Field
              label="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              textContentType="emailAddress"
            />
            <Field
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="new-password"
              textContentType="newPassword"
            />
            <Field
              label="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              textContentType="newPassword"
              onSubmitEditing={handleSubmit}
            />
            <Message text={error} />
            <Button title="Create account" onPress={handleSubmit} loading={isLoading} />
          </Card>
          <Pressable onPress={() => navigation.navigate('SignIn')} style={authStyles.switch}>
            <Text style={authStyles.switchText}>
              Already have an account? <Text style={authStyles.link}>Sign in</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
