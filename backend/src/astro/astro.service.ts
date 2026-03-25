// backend/src/astro/astro.service.ts
import { Horoscope, Origin } from "circular-natal-horoscope-js";
import {
  AstroAspectType,
  BasicAspect,
  BasicPlacement,
  CalculateChartInput,
  ChartSummary,
} from "./astro.types";

/*
  Γιατί χρησιμοποιούμε class εδώ ενώ σε πολλά JS projects βλέπεις απλά functions;

  1. Θέλουμε να ομαδοποιήσουμε related logic
     Όλη η λογική για astrology calculations μένει σε ένα σημείο.

  2. Θέλουμε "instance variables" / properties
     π.χ. defaultAspectPoints, defaultAspectTypes, limits για aspect filtering.
     Αυτά είναι shared ρυθμίσεις του service και δεν θέλουμε να τα περνάμε κάθε φορά ως params.

  3. Service pattern
     Σε backend αρχιτεκτονική είναι συνηθισμένο να έχουμε:
     routes -> controller -> service
     Άρα η class εδώ είναι πιο "backend style" από ότι "frontend utility style".

  4. Εύκολη μελλοντική επέκταση
     Αργότερα μπορείς να βάλεις:
     - constructor
     - injected dependencies
     - logger
     - config
     - διαφορετικά calculate methods
     χωρίς να αλλάξεις τη γενική δομή.

  Τι υπάρχει / τι δεν υπάρχει εδώ από τα "κλασικά" στοιχεία OOP:

  - instance variables / properties:
    ΝΑΙ -> defaultAspectPoints, defaultAspectWithPoints, defaultAspectTypes,
           majorAspectTypes, preferredAspectBodies, maxAspects

  - constructor:
    ΟΧΙ -> δεν τον χρειαζόμαστε ακόμα γιατί δεν κάνουμε dependency injection
           ούτε δεχόμαστε εξωτερικές παραμέτρους για αρχικοποίηση

  - getters / setters:
    ΟΧΙ -> δεν έχουμε λόγο ακόμα, γιατί οι τιμές είναι εσωτερικές και σταθερές

  - toString():
    ΟΧΙ -> δεν έχει νόημα σε service class, ίσως θα είχε νόημα σε domain model / entity

  - methods:
    ΝΑΙ -> calculateChart, validateInput, mapPlacement, mapHouses, mapAspects,
           isPreferredAspect, normalizeAspectType
*/

class AstroService {
  // default ρυθμίσεις για τη βιβλιοθήκη
  private readonly defaultAspectPoints = ["bodies", "points", "angles"];
  private readonly defaultAspectWithPoints = ["bodies", "points", "angles"];
  private readonly defaultAspectTypes: AstroAspectType[] = ["major"];

  // κρατάμε μόνο τα 5 βασικά major aspects
  private readonly majorAspectTypes = [
    "conjunction",
    "opposition",
    "trine",
    "square",
    "sextile",
  ];

  // θέλουμε να προτιμάμε τα "κλασικά" σώματα για να μη γεμίζει το output
  private readonly preferredAspectBodies = [
    "sun",
    "moon",
    "mercury",
    "venus",
    "mars",
    "jupiter",
    "saturn",
    "uranus",
    "neptune",
    "pluto",
    // "ascendant",
    // "midheaven",
    // "northnode",
    // "southnode",
    // "lilith",
    // "chiron",
    // "sirius",
  ];

  // στόχος: λίγα και χρήσιμα aspects
  private readonly maxAspects = 10;

  calculateChart(input: CalculateChartInput): ChartSummary {
    this.validateInput(input);

    // Προσοχή:
    // Η βιβλιοθήκη θέλει month 0-11, ενώ εμείς δεχόμαστε 1-12
    const origin = new Origin({
      year: input.year,
      month: input.month - 1,
      date: input.day,
      hour: input.hour,
      minute: input.minute,
      latitude: input.latitude,
      longitude: input.longitude,
    });

    const horoscope = new Horoscope({
      origin,
      houseSystem: input.houseSystem || "placidus",
      zodiac: input.zodiac || "tropical",

      // aspect generation settings
      aspectPoints: input.aspectPoints || this.defaultAspectPoints,
      aspectWithPoints: input.aspectWithPoints || this.defaultAspectWithPoints,
      aspectTypes: input.aspectTypes || this.defaultAspectTypes,
      customOrbs: input.customOrbs || {},
      language: input.language || "en",
    });

    return {
      // βασικές γωνίες
      ascendant: this.mapPlacement("ascendant", horoscope?.Ascendant),
      midheaven: this.mapPlacement("midheaven", horoscope?.Midheaven),

      // όλοι οι βασικοί πλανήτες
      sun: this.mapPlacement("sun", horoscope?.CelestialBodies?.sun),
      moon: this.mapPlacement("moon", horoscope?.CelestialBodies?.moon),
      mercury: this.mapPlacement(
        "mercury",
        horoscope?.CelestialBodies?.mercury,
      ),
      venus: this.mapPlacement("venus", horoscope?.CelestialBodies?.venus),
      mars: this.mapPlacement("mars", horoscope?.CelestialBodies?.mars),
      jupiter: this.mapPlacement(
        "jupiter",
        horoscope?.CelestialBodies?.jupiter,
      ),
      saturn: this.mapPlacement("saturn", horoscope?.CelestialBodies?.saturn),
      uranus: this.mapPlacement("uranus", horoscope?.CelestialBodies?.uranus),
      neptune: this.mapPlacement(
        "neptune",
        horoscope?.CelestialBodies?.neptune,
      ),
      pluto: this.mapPlacement("pluto", horoscope?.CelestialBodies?.pluto),

      // κρατάμε και τα σημεία για μελλοντική χρήση
      northNode: this.mapPlacement(
        "northnode",
        horoscope?.CelestialPoints?.northnode,
      ),
      southNode: this.mapPlacement(
        "southnode",
        horoscope?.CelestialPoints?.southnode,
      ),
      lilith: this.mapPlacement("lilith", horoscope?.CelestialPoints?.lilith),

      // όλοι οι οίκοι
      houses: this.mapHouses(horoscope?.Houses),

      // το βασικό cleanup γίνεται εδώ:
      // δεν επιστρέφουμε όλα τα aspects της βιβλιοθήκης
      // αλλά λίγα, κλασικά, και με λογικό orb
      aspects: this.mapAspects(horoscope?.Aspects?.all),

      // useful για debugging αλλά το commentάρουμε γιατί φουσκώνει πολύ το response
      // raw: horoscope,
    };
  }

  private validateInput(input: CalculateChartInput) {
    if (!Number.isInteger(input.year) || input.year < 1) {
      throw new Error("Invalid year");
    }

    if (!Number.isInteger(input.month) || input.month < 1 || input.month > 12) {
      throw new Error("Invalid month. Expected 1-12");
    }

    if (!Number.isInteger(input.day) || input.day < 1 || input.day > 31) {
      throw new Error("Invalid day");
    }

    if (!Number.isInteger(input.hour) || input.hour < 0 || input.hour > 23) {
      throw new Error("Invalid hour");
    }

    if (
      !Number.isInteger(input.minute) ||
      input.minute < 0 ||
      input.minute > 59
    ) {
      throw new Error("Invalid minute");
    }

    if (
      typeof input.latitude !== "number" ||
      input.latitude < -90 ||
      input.latitude > 90
    ) {
      throw new Error("Invalid latitude");
    }

    if (
      typeof input.longitude !== "number" ||
      input.longitude < -180 ||
      input.longitude > 180
    ) {
      throw new Error("Invalid longitude");
    }
  }

  private mapPlacement(key: string, source: any): BasicPlacement | null {
    if (!source) return null;

    return {
      key,
      label: source?.label,
      sign: source?.Sign?.label || source?.Sign?.key || source?.sign || null,
      house: source?.House?.id ?? source?.house?.id ?? source?.house ?? null,
      retrograde: source?.isRetrograde ?? source?.retrograde ?? false,
      longitude:
        source?.ChartPosition?.Ecliptic?.DecimalDegrees ??
        source?.ChartPosition?.Horizon?.DecimalDegrees ??
        null,
    };
  }

private mapHouses(houses: any[] = []) {
  return houses.map((house: any, index: number) => ({
    house: index + 1,
    sign: house?.Sign?.label || house?.Sign?.key || house?.sign || null,

    // ✅ παίρνουμε την αρχή του οίκου (cusp)
    longitude:
      house?.ChartPosition?.StartPosition?.Ecliptic?.DecimalDegrees ?? null,
  }));
}

  /*
    Εδώ γίνεται το "μάζεμα" των aspects.

    Στόχος:
    - μόνο τα 5 κλασικά aspect types
    - μόνο ανάμεσα σε bodies που θεωρούμε βασικά
    - μικρό orb ώστε να μη γεμίσει θόρυβο το response
    - ταξινόμηση από το πιο tight aspect προς το πιο loose
    - τελικό limit: maxAspects
  */
  private mapAspects(aspects: any[] = []): BasicAspect[] {
    return (
      aspects
        .map(
          (aspect: any): BasicAspect => ({
            point1Key: aspect?.point1Key || aspect?.point1?.key || undefined,
            point1Label:
              aspect?.point1Label || aspect?.point1?.label || undefined,
            point2Key: aspect?.point2Key || aspect?.point2?.key || undefined,
            point2Label:
              aspect?.point2Label || aspect?.point2?.label || undefined,
            type: this.normalizeAspectType(
              aspect?.aspectKey || aspect?.type || aspect?.label || undefined,
            ),
            orb: aspect?.orb ?? null,
            orbFormatted: aspect?.orbFormatted ?? null,
          }),
        )

        // κρατάμε μόνο aspects που έχουν βασικά στοιχεία
        .filter((aspect) => aspect.point1Key && aspect.point2Key && aspect.type)

        // κρατάμε μόνο τα κλασικά major aspects
        .filter((aspect) =>
          this.majorAspectTypes.includes(aspect.type as string),
        )

        // πετάμε aspects με "δευτερεύοντα" bodies / points / fixed stars
        .filter((aspect) => this.isPreferredAspect(aspect))

        // λογικό orb:
        // εδώ κρατάμε tight-ish aspects ώστε να βγουν περίπου 5-10
        .filter((aspect) => typeof aspect.orb === "number" && aspect.orb <= 3)

        // μικρότερο orb = ισχυρότερο / πιο exact aspect
        .sort((a, b) => (a.orb ?? 999) - (b.orb ?? 999))

        // τελικό όριο για να μη φουσκώνει το response
        .slice(0, this.maxAspects)
    );

    /*
      Εναλλακτικά, αν αργότερα θες ΟΛΑ τα aspects ξανά:
      return aspects.map((aspect: any) => ({
        point1Key: aspect?.point1Key || aspect?.point1?.key || null,
        point1Label: aspect?.point1Label || aspect?.point1?.label || null,
        point2Key: aspect?.point2Key || aspect?.point2?.key || null,
        point2Label: aspect?.point2Label || aspect?.point2?.label || null,
        type: aspect?.aspectKey || aspect?.type || aspect?.label || null,
        orb: aspect?.orb ?? null,
        orbFormatted: aspect?.orbFormatted ?? null,
      }));
    */
  }

  /*
    Ελέγχουμε αν και τα δύο άκρα του aspect είναι μέσα στη λίστα των βασικών σωμάτων.
    Έτσι κόβουμε:
    - nodes
    - lilith
    - chiron
    - sirius
    - angles
    αν δεν τα θέλουμε στο βασικό output της v1.
  */
  private isPreferredAspect(aspect: BasicAspect): boolean {
    const point1 = aspect.point1Key?.toLowerCase() || "";
    const point2 = aspect.point2Key?.toLowerCase() || "";

    return (
      this.preferredAspectBodies.includes(point1) &&
      this.preferredAspectBodies.includes(point2)
    );
  }

  /*
    Η βιβλιοθήκη μπορεί να επιστρέψει type/aspectKey/label
    και με διαφορετικό casing.
    Εμείς το κάνουμε normalize σε lowercase για ασφαλές filtering.
  */
  private normalizeAspectType(type: string | null | undefined): string | undefined {
    if (!type) return undefined;

    return type.toLowerCase().trim();
  }
}

export const astroService = new AstroService();
