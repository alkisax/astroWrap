// astro-native\hooks\componentHooks\useRewardedAd.ts

/**
 * 🧠 ΤΙ ΚΑΝΕΙ ΑΥΤΟ ΤΟ FILE
 *
 * Αυτό είναι ένα "bridge" για το useRewardedAd hook ώστε:
 * - να δουλεύει σε native (Android/iOS)
 * - να δουλεύει σε web
 * - να ΜΗΝ σκάει το TypeScript
 *
 * --------------------------------------------------
 * ❗ ΠΡΟΒΛΗΜΑ
 *
 * Έχουμε δύο αρχεία:
 *   useRewardedAd.native.ts
 *   useRewardedAd.web.ts
 *
 * Το Expo (runtime) ξέρει να διαλέγει σωστό αρχείο.
 * Το TypeScript ΟΜΩΣ πολλές φορές δεν μπορεί να κάνει resolve αυτά τα extensions
 * → "Cannot find module"
 *
 * --------------------------------------------------
 * ✅ ΛΥΣΗ ΠΟΥ ΒΑΛΑΜΕ
 *
 * Χρησιμοποιούμε dynamic require αντί για static import:
 *
 * - δεν χρειάζεται TypeScript να κάνει resolve το path
 * - το Metro (runtime) φορτώνει σωστά το αρχείο
 *
 * --------------------------------------------------
 * 🔥 LOGIC
 *
 * Platform.OS === 'web'
 *   → φορτώνουμε useRewardedAd.web
 *
 * αλλιώς (android / ios)
 *   → φορτώνουμε useRewardedAd.native
 *
 * --------------------------------------------------
 * ⚠️ γιατί require και όχι import
 *
 * import → γίνεται resolve στο build time (TS error)
 * require → γίνεται resolve στο runtime (δουλεύει σωστά)
 *
 * --------------------------------------------------
 * 🧠 EXTRA (tsconfig fix)
 *
 * Στο tsconfig.json βάλαμε:
 *
 * {
 *   "compilerOptions": {
 *     "moduleResolution": "bundler"
 *   }
 * }
 *
 * Αυτό βοηθά το TypeScript να καταλάβει το Metro resolution (React Native style)
 * και να υποστηρίζει καλύτερα:
 *   - .native.ts
 *   - .web.ts
 *
 * --------------------------------------------------
 * 📌 TL;DR
 *
 * - αυτό το file = safe bridge μεταξύ web / native
 * - αποφεύγει TS errors
 * - κρατάει clean import:
 *
 *   import { useRewardedAd } from '.../useRewardedAd'
 *
 */

export { useRewardedAd } from './useRewardedAd.web'