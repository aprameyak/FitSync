import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export const colors = {
  primary: '#2563eb',
  background: '#f9fafb',
  card: '#ffffff',
  border: '#e5e7eb',
  text: '#111827',
  textMuted: '#4b5563',
  textSubtle: '#6b7280',
  danger: '#dc2626',
  success: '#16a34a',
}

export function Screen({
  children,
  title,
  subtitle,
  onRefresh,
}: {
  readonly children: React.ReactNode
  readonly title: string
  readonly subtitle?: string
  readonly onRefresh?: () => void
}) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {children}
        {onRefresh ? (
          <Pressable onPress={onRefresh} style={styles.refresh}>
            <Text style={styles.refreshText}>Refresh</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  )
}

export function Card({ children, style }: { readonly children: React.ReactNode; readonly style?: object }) {
  return <View style={[styles.card, style]}>{children}</View>
}

export function CardTitle({ children, right }: { readonly children: React.ReactNode; readonly right?: React.ReactNode }) {
  return (
    <View style={styles.cardTitleRow}>
      <Text style={styles.cardTitle}>{children}</Text>
      {right}
    </View>
  )
}

export function Button({
  title,
  onPress,
  disabled,
  loading,
  variant = 'primary',
  small,
}: {
  readonly title: string
  readonly onPress: () => void
  readonly disabled?: boolean
  readonly loading?: boolean
  readonly variant?: 'primary' | 'outline' | 'ghost'
  readonly small?: boolean
}) {
  const isDisabled = disabled || loading
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        small && styles.buttonSmall,
        variant === 'primary' && styles.buttonPrimary,
        variant === 'outline' && styles.buttonOutline,
        isDisabled && styles.buttonDisabled,
        pressed && !isDisabled && styles.buttonPressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#ffffff' : colors.primary} />
      ) : (
        <Text
          style={[
            styles.buttonText,
            small && styles.buttonTextSmall,
            variant === 'primary' ? styles.buttonTextPrimary : styles.buttonTextOutline,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  )
}

export function Field({ label, ...props }: TextInputProps & { readonly label: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput accessibilityLabel={label} placeholderTextColor={colors.textSubtle} style={styles.input} {...props} />
    </View>
  )
}

export function Choice<T extends string>({
  options,
  value,
  onChange,
  horizontal,
}: {
  readonly options: readonly { value: T; label: string; description?: string }[]
  readonly value: T | ''
  readonly onChange: (value: T) => void
  readonly horizontal?: boolean
}) {
  return (
    <View style={[styles.choices, horizontal && styles.choicesRow]}>
      {options.map((option) => {
        const selected = option.value === value
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            style={[styles.choice, horizontal && styles.choiceCompact, selected && styles.choiceSelected]}
          >
            <Text style={[styles.choiceLabel, selected && styles.choiceLabelSelected]}>{option.label}</Text>
            {option.description ? <Text style={styles.choiceDescription}>{option.description}</Text> : null}
          </Pressable>
        )
      })}
    </View>
  )
}

export function Stat({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  )
}

export function ProgressBar({ percent }: { readonly percent: number }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${Math.max(0, Math.min(percent, 100))}%` }]} />
    </View>
  )
}

export function Message({ text, tone = 'error' }: { readonly text: string; readonly tone?: 'error' | 'success' }) {
  if (!text) return null
  return <Text style={[styles.message, tone === 'success' ? styles.success : styles.error]}>{text}</Text>
}

export function Loading() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator color={colors.primary} />
    </View>
  )
}

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  screen: { padding: 16, paddingBottom: 32, gap: 16 },
  header: { marginBottom: 4 },
  title: { fontSize: 28, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 15, color: colors.textMuted, marginTop: 4 },
  refresh: { alignSelf: 'center', padding: 8 },
  refreshText: { color: colors.primary, fontSize: 14 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 12,
  },
  cardTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 17, fontWeight: '600', color: colors.text },
  button: {
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSmall: { minHeight: 34, paddingHorizontal: 12 },
  buttonPrimary: { backgroundColor: colors.primary },
  buttonOutline: { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  buttonDisabled: { opacity: 0.5 },
  buttonPressed: { opacity: 0.8 },
  buttonText: { fontSize: 15, fontWeight: '600' },
  buttonTextSmall: { fontSize: 13 },
  buttonTextPrimary: { color: '#ffffff' },
  buttonTextOutline: { color: colors.text },
  field: { gap: 6, flex: 1 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151' },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.card,
  },
  choices: { gap: 8 },
  choicesRow: { flexDirection: 'row', flexWrap: 'wrap' },
  choiceCompact: { paddingVertical: 8, paddingHorizontal: 12 },
  choice: { borderWidth: 1, borderColor: colors.border, borderRadius: 6, padding: 12, backgroundColor: colors.card },
  choiceSelected: { borderColor: colors.primary, backgroundColor: '#eff6ff' },
  choiceLabel: { fontSize: 15, fontWeight: '500', color: colors.text },
  choiceLabelSelected: { color: colors.primary },
  choiceDescription: { fontSize: 13, color: colors.textSubtle, marginTop: 2 },
  stat: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  statLabel: { fontSize: 13, color: colors.textMuted, fontWeight: '500' },
  statValue: { fontSize: 22, fontWeight: '700', color: colors.text, marginTop: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  progressTrack: { height: 8, borderRadius: 4, backgroundColor: '#f3f4f6', overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: 4, backgroundColor: colors.primary },
  message: { fontSize: 14 },
  error: { color: colors.danger },
  success: { color: colors.success },
  muted: { fontSize: 14, color: colors.textSubtle },
  row: { flexDirection: 'row', gap: 12 },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  listTitle: { fontSize: 15, color: colors.text, fontWeight: '500' },
  listMeta: { fontSize: 12, color: colors.textSubtle, marginTop: 2 },
  loading: { padding: 24, alignItems: 'center' },
})
