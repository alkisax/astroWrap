// astro-native/components/chartInfo/biwheel/LlmRelationship.tsx

import {
  View,
  Text,
  Pressable,
} from 'react-native'
import Markdown from 'react-native-markdown-display'
import CompatibilityViewer from '@/components/chartInfo/biwheel/CompatibilityViewer'
import { globalStyles } from '@/layout/global'
import { markdownStyles } from '@/layout/markdownStyles'
import type { Compatibility } from '@/types/types'

type Props = {
  compatibility: Compatibility
  handleBiwheelLLMClick: () => void
  llmLoading: boolean
  llmError: string | null
  showLLM: boolean
  llmResult: string | null
  loaded: boolean
  isProcessing: boolean
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
  handleBiwheelLLMClick,
  llmLoading,
  llmError,
  showLLM,
  llmResult,
  loaded,
  isProcessing,
}: Props) => {

  const handlePress = () => {
    handleBiwheelLLMClick()
  }

  return (
    <>
      <Pressable
        onPress={handlePress}
        // disabled={!loaded || isProcessing || llmLoading} // TODO toggle for no ads
        disabled={isProcessing || llmLoading}
        style={[
          globalStyles.llmButton,
          {
            opacity:
              !loaded || isProcessing || llmLoading
                ? 0.5
                : 1,
          },
        ]}
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
          <CompatibilityViewer
            compatibility={compatibility}
          />

          <Markdown style={markdownStyles}>
            {llmResult}
          </Markdown>
        </View>
      )}
    </>
  )
}

export default LlmRelationship