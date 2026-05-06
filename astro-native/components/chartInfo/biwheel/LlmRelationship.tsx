// astro-native/components/chartInfo/biwheel/LlmRelationship.tsx

import {
  View,
  Text,
  Pressable,
} from 'react-native'
import { useEffect, useState } from 'react'
import Markdown from 'react-native-markdown-display'
import CompatibilityViewer from '@/components/chartInfo/biwheel/CompatibilityViewer'
import { globalStyles } from '@/layout/global'
import { markdownStyles } from '@/layout/markdownStyles'
import type { Compatibility } from '@/types/types'

type Props = {
  compatibility: Compatibility
  handleBiwheelLLM: () => Promise<string | null>
  llmLoading: boolean
  llmError: string | null
  resetTrigger: string | null
}

/*
  🤖 RELATIONSHIP LLM PANEL

  Παίρνει:
  - shaken synastry payload
  - compatibility calculations
  και ζητά από backend LLM:
  relationship interpretation.
  Αργότερα εδώ θα μπει:
  - rewarded ad
  - cooldown
  - save result
  - regenerate
*/

const LlmRelationship = ({
  compatibility,
  handleBiwheelLLM,
  llmLoading,
  llmError,
  resetTrigger,
}: Props) => {

  const [showLLM, setShowLLM] = useState(false)
  const [llmResult, setLlmResult] = useState<string | null>(null)

  // όταν αλλάζει chart καθαρίζουμε το llm
  useEffect(() => {
    setShowLLM(false)
    setLlmResult(null)
  }, [resetTrigger])

  const handlePress = async () => {
    setShowLLM(true)
    const result = await handleBiwheelLLM()
    setLlmResult(result)
  }

  return (
    <>
      <Pressable
        onPress={handlePress}
        disabled={llmLoading}
        style={globalStyles.llmButton}
      >
        <Text style={globalStyles.llmButtonText}>
          {llmLoading
            ? 'Loading...'
            : llmError
              ? 'Error ❌'
              : 'call Lark 🦜\n(relationship analysis)'}
        </Text>
      </Pressable>

      {showLLM && llmResult && (
        <View style={globalStyles.llmResultBox}>
          {/* compatibility */}
          <CompatibilityViewer
            compatibility={compatibility}
          />

          {/* markdown */}
          <Markdown
            style={markdownStyles}
          >
            {llmResult}
          </Markdown>
        </View>
      )}
    </>

  )
}

export default LlmRelationship