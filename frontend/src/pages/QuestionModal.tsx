import { Modal, Checkbox, Stack, Textarea, Button } from '@mantine/core'
import { CircularProgress } from '@mui/material'

type TopicKey =
  | 'career'
  | 'money'
  | 'relationships'
  | 'home'
  | 'emotional'
  | 'change'

type Props = {
  opened: boolean
  onClose: () => void
  selectedTopics: string[]
  setSelectedTopics: (v: TopicKey[]) => void
  userQuestion: string
  setUserQuestion: (v: string) => void
  onSubmit: () => void
  llmEagleLarkLoading: boolean
  llmEagleLarkError: string | null
}


export const QuestionModal = ({
  opened,
  onClose,
  selectedTopics,
  setSelectedTopics,
  userQuestion,
  setUserQuestion,
  onSubmit,
  llmEagleLarkLoading,
  llmEagleLarkError,
}: Props) => {

  const options = [
    { label: 'Career / direction', value: 'career' },
    { label: 'Money / resources', value: 'money' },
    { label: 'Relationships', value: 'relationships' },
    { label: 'Home / family', value: 'home' },
    { label: 'Emotional state', value: 'emotional' },
    { label: 'Life changes', value: 'change' },
  ]

  return (
    <Modal opened={opened} onClose={onClose} title='Ask a specific question'>
      <Stack>
        <Checkbox.Group
          value={selectedTopics}
          onChange={(v) => {
            if (v.length <= 3) setSelectedTopics(v as TopicKey[])
          }}
          label='Select topic'
        >
          <Stack mt='sm'>
            {options.map(o => (
              <Checkbox key={o.value} value={o.value} label={o.label} />
            ))}
          </Stack>
        </Checkbox.Group>

        <Textarea
          placeholder='Type your question...'
          value={userQuestion}
          onChange={e => setUserQuestion(e.currentTarget.value)}
        />

        <Button onClick={onSubmit} disabled={llmEagleLarkLoading}>
          {llmEagleLarkLoading ? (
            <CircularProgress size={18} />
          ) : llmEagleLarkError ? (
            'Error ❌'
          ) : (
            'analyze'
          )}
        </Button>
      </Stack>
    </Modal>
  )
}

