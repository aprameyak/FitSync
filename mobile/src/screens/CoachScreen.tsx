import { useRef, useState } from 'react'
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { apiRequest } from '../api'
import { colors } from '../components/ui'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: "Hi! I'm your FitSync coach. Ask me about workouts, nutrition, or your goals.",
}

export default function CoachScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const listRef = useRef<FlatList<ChatMessage>>(null)

  const send = async () => {
    const text = input.trim()
    if (!text || isSending) return

    const history = messages
      .filter((message) => message.id !== WELCOME.id)
      .map((message) => ({ role: message.role === 'user' ? 'user' : 'model', parts: [{ text: message.content }] }))

    setMessages((current) => [...current, { id: `${Date.now()}`, role: 'user', content: text }])
    setInput('')
    setIsSending(true)
    try {
      const result = await apiRequest<{ message: string }>('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: text, conversationHistory: history }),
      })
      setMessages((current) => [...current, { id: `${Date.now()}-reply`, role: 'assistant', content: result.message }])
    } catch (err) {
      setMessages((current) => [
        ...current,
        { id: `${Date.now()}-error`, role: 'assistant', content: `Sorry, something went wrong: ${(err as Error).message}` },
      ])
    } finally {
      setIsSending(false)
    }
  }

  return (
    <SafeAreaView style={chatStyles.safeArea} edges={['top', 'left', 'right']}>
      <Text style={chatStyles.title}>AI Coach</Text>
      <KeyboardAvoidingView
        style={chatStyles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={chatStyles.list}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => (
            <View style={[chatStyles.bubble, item.role === 'user' ? chatStyles.userBubble : chatStyles.botBubble]}>
              <Text style={item.role === 'user' ? chatStyles.userText : chatStyles.botText}>{item.content}</Text>
            </View>
          )}
          ListFooterComponent={isSending ? <Text style={chatStyles.typing}>Coach is typing...</Text> : undefined}
        />
        <View style={chatStyles.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask your coach..."
            accessibilityLabel="Message"
            placeholderTextColor={colors.textSubtle}
            style={chatStyles.input}
            multiline
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Send message"
            onPress={send}
            disabled={!input.trim() || isSending}
            style={[chatStyles.send, (!input.trim() || isSending) && chatStyles.sendDisabled]}
          >
            <Ionicons name="send" size={18} color="#ffffff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const chatStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  title: { fontSize: 28, fontWeight: '700', color: colors.text, paddingHorizontal: 16, paddingTop: 16 },
  list: { padding: 16, gap: 8 },
  bubble: { maxWidth: '85%', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: colors.primary },
  botBubble: { alignSelf: 'flex-start', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  userText: { color: '#ffffff', fontSize: 15 },
  botText: { color: colors.text, fontSize: 15 },
  typing: { color: colors.textSubtle, fontSize: 13, paddingTop: 4 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
  },
  send: { width: 44, height: 44, borderRadius: 6, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  sendDisabled: { opacity: 0.5 },
})
