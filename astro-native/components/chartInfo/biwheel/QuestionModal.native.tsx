// astro-native\components\chartInfo\biwheel\QuestionModal.native.tsx

import {
  Modal,
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
} from 'react-native'
import { globalStyles } from '@/layout/global'
import { colors } from '@/constants/constants'

type TopicKey =
  | 'career'
  | 'money'
  | 'relationships'
  | 'home'
  | 'emotional'
  | 'change'

type Props = {
  visible: boolean
  onClose: () => void
  selectedTopics: string[]
  setSelectedTopics: (v: TopicKey[]) => void
  userQuestion: string
  setUserQuestion: (v: string) => void
  onSubmit: () => void
  llmEagleLarkLoading: boolean
  llmEagleLarkError: string | null
}

const options = [
  {
    label: 'Career / direction',
    value: 'career',
  },
  {
    label: 'Money / resources',
    value: 'money',
  },
  {
    label: 'Relationships',
    value: 'relationships',
  },
  {
    label: 'Home / family',
    value: 'home',
  },
  {
    label: 'Emotional state',
    value: 'emotional',
  },
  {
    label: 'Life changes',
    value: 'change',
  },
] as const

const QuestionModal = ({
  visible,
  onClose,
  selectedTopics,
  setSelectedTopics,
  userQuestion,
  setUserQuestion,
  onSubmit,
  llmEagleLarkLoading,
  llmEagleLarkError,
}: Props) => {

  const toggleTopic = (value: TopicKey) => {
    const exists = selectedTopics.includes(value)
    if (exists) {
      setSelectedTopics(
        selectedTopics.filter(t => t !== value) as TopicKey[],
      )
      return
    }

    if (selectedTopics.length >= 3) return

    setSelectedTopics([
      ...selectedTopics,
      value,
    ] as TopicKey[])
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType='slide'
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={globalStyles.card}>
          <Text style={globalStyles.title}>
            Ask a specific question
          </Text>

          {/* topics */}
          <View style={{ gap: 8 }}>
            {options.map(option => {
              const active = selectedTopics.includes(option.value)

              return (
                <Pressable
                  key={option.value}
                  onPress={() => toggleTopic(option.value)}
                  style={[
                    globalStyles.section,
                    styles.topicButton,
                    active && styles.topicButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      globalStyles.text,
                      active && styles.topicTextActive,
                    ]}
                  >
                    {active ? '☑ ' : '☐ '}
                    {option.label}
                  </Text>
                </Pressable>
              )
            })}
          </View>

          {/* input */}
          <TextInput
            multiline
            placeholder='Type your question...'
            placeholderTextColor={colors.dim}
            value={userQuestion}
            onChangeText={setUserQuestion}
            style={[
              globalStyles.input,
              styles.input,
            ]}
          />

          {/* submit */}
          <Pressable
            onPress={onSubmit}
            disabled={llmEagleLarkLoading}
            style={[
              globalStyles.llmButton,
              llmEagleLarkLoading && { opacity: 0.5 },
            ]}
          >
            <Text style={globalStyles.llmButtonText}>
              {llmEagleLarkLoading
                ? 'Loading...'
                : llmEagleLarkError
                  ? 'Error ❌'
                  : 'Analyze'}
            </Text>
          </Pressable>

          {/* close */}
          <Pressable
            onPress={onClose}
            style={styles.closeButton}
          >
            <Text style={globalStyles.text}>
              Close
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

export default QuestionModal

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },

  topicButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },

  topicButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },

  topicTextActive: {
    color: colors.text,
    fontWeight: '700',
  },

  input: {
    minHeight: 120,
    marginTop: 16,
  },

  closeButton: {
    marginTop: 16,
    alignItems: 'center',
  },
})