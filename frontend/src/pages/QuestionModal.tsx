import { Modal, Checkbox, Stack, Textarea, Button } from '@mantine/core'

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
}


export const QuestionModal = ({
  opened,
  onClose,
  selectedTopics,
  setSelectedTopics,
  userQuestion,
  setUserQuestion,
  onSubmit,
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
          onChange={v => setSelectedTopics(v as TopicKey[])}
          label='Select topics (1–3)'
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

        <Button onClick={onSubmit}>
          analyze
        </Button>
      </Stack>
    </Modal>
  )
}

