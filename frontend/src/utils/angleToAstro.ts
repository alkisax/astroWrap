// frontend\src\utils\angleToAstro.ts

// παιρνει τις γωνίες των πλανητών και μου λεει σε ποιο ζώδιο είναι 
// και δημιουργεί απο cusps ranges γωνιών για τον κάθε οίκο (και άρα μπορω να δώ και σε ποιον οικο είναι και το κάθε ζωδιο)

import { signs } from "../constants/constants";

// ο ζωδιακός = 360° / 12 = 30° ανά ζώδιο → παίρνει μοίρα (π.χ. 75°) → βρίσκει σε ποιο “κομμάτι 30°” ανήκει πχ getZodiacSign(75) → signs[2] → Δίδυμοι
export const getZodiacSign = (deg: number) => {
  const index = Math.floor(deg / 30);
  return signs[index];
};

export const getHouse = (deg: number, cusps: number[]) => {
  for (let i = 0; i < cusps.length; i++) {
    // οι οίκοι δεν είναι σαν ζωδια με σταθερές τιμες ανα 30° για αυτό παίρνουμε τα cusps απο την circular-natal-horoscope-js και πρέπει κάθε φορα να υπολογίσουμε σε πια μοίρα αρχίζει και σε πιά τελειώνει πχ cusps = [10, 40, 70, ..., 350]
    // current η αρχή του οίκου, next το τέλος
    const current = cusps[i];
    const next = cusps[(i + 1) % cusps.length];

    if (current < next) {
      if (deg >= current && deg < next) return i + 1;
    } else {
      // wrap 360 → 0 ενας οίκος μπορεί να ξεκινάει πριν το 0° (που είναι η αρχή του κριού: εαρινή ισημερία → 21 μαρτίου)
      if (deg >= current || deg < next) return i + 1;
    }
  }
  return null;
};
