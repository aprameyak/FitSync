import { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useAuth } from '../auth'
import { Button, Card, Field, Message, colors } from '../components/ui'
import type { AuthStackParamList } from '../navigation'

export default function SignInScreen({ navigation }: NativeStackScreenProps<AuthStackParamList, 'SignIn'>) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!email.trim() || !password) {
      setError('Enter your email and password')
      return
    }
    setIsLoading(true)
    setError('')
    try {
      await signIn(email.trim(), password)
    } catch (err) {
      setError((err as Error).message)
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView style={authStyles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={authStyles.container}>
        <View style={authStyles.brand}>
          <Text style={authStyles.logo}>FitSync</Text>
          <Text style={authStyles.tagline}>Sign in to your account</Text>
        </View>
        <Card>
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
            autoComplete="password"
            textContentType="password"
            onSubmitEditing={handleSubmit}
          />
          <Message text={error} />
          <Button title="Sign in" onPress={handleSubmit} loading={isLoading} />
        </Card>
        <Pressable onPress={() => navigation.navigate('SignUp')} style={authStyles.switch}>
          <Text style={authStyles.switchText}>
            Don&apos;t have an account? <Text style={authStyles.link}>Sign up</Text>
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export const authStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, justifyContent: 'center', padding: 16, gap: 16 },
  brand: { alignItems: 'center', gap: 4 },
  logo: { fontSize: 32, fontWeight: '700', color: colors.primary },
  tagline: { fontSize: 15, color: colors.textMuted },
  switch: { alignItems: 'center', padding: 8 },
  switchText: { fontSize: 14, color: colors.textMuted },
  link: { color: colors.primary, fontWeight: '600' },
})
