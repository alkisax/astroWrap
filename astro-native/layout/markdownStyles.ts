// astro-native\layout\markdownStyles.ts

import { colors } from '@/constants/constants'

export const markdownStyles = {
  body: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
  },

  heading1: {
    color: colors.text,
    fontSize: 22,
    marginBottom: 10,
  },

  heading2: {
    color: colors.text,
    fontSize: 18,
    marginBottom: 8,
  },

  paragraph: {
    color: colors.text,
    marginBottom: 10,
  },

  strong: {
    color: colors.text,
    fontWeight: '700' as const,
  },

  bullet_list: {
    marginBottom: 10,
  },

  list_item: {
    color: colors.text,
  },
}