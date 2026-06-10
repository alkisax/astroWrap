Σας παρουσιάζω το side project με το οποίο ασχολούμαι τον τελευταίο καιρό. Πρόκειται για μια Android mobile εφαρμογή για αστρολογικούς υπολογισμούς και zodiac/compatibility features, η οποία ταυτόχρονα λειτουργεί και ως LLM wrapper για παραγωγή structured αστρολογικών ερμηνειών.

Η εφαρμογή είναι κατασκευασμένη με React Native, Node.js και SQLite, ενώ το build έγινε μέσω Expo/EAS. Στην αρχή χρησιμοποιήθηκαν cloud builds, αλλά αρκετά builds αργότερα η διαδικασία μεταφέρθηκε και σε local builds όταν τελείωσαν τα δωρεάν credits 😄

Η εφαρμογή περιλαμβάνει JWT authentication, αποθήκευση profile/chart data, LLM integrations, AdMob rewarded ads και deployment backend σε Hetzner VPS.

Πριν την υλοποίηση είχαν τεθεί μερικοί βασικοί στόχοι:

* να μην χρησιμοποιηθεί MongoDB ώστε να ξεφύγω λίγο από το οικοσύστημα που χρησιμοποιώ συνήθως, οπότε επιλέχθηκε SQLite
* να ενσωματωθούν mobile ads μέσω AdMob, τόσο για εξοικείωση με κάτι απαραίτητο σχεδόν σε κάθε production mobile app, όσο και για να μπορεί θεωρητικά να συντηρηθεί το κόστος των LLM API calls
* να γίνει publish στο Google Play Store ώστε να μάθω ολόκληρη τη διαδικασία deployment/review/testing

Η διαδικασία του Play Store αποδείχθηκε αρκετά πιο χρονοβόρα απ’ όσο περίμενα, αλλά και αρκετά ενδιαφέρουσα, γιατί σε αναγκάζει να έρθεις σε επαφή με πραγματικούς testers (12 testers / 14 ημέρες closed testing), policies, app signing, privacy standards, ads declarations, review διαδικασίες και γενικά με πράγματα που δεν φαίνονται όταν ένα project μένει μόνο στο localhost.

Η υλοποίηση με έφερε απέναντι και σε αρκετά τεχνικά προβλήματα:

* πώς επικοινωνεί σωστά ένα deployed backend σε Hetzner VPS με React Native mobile client
* πώς γίνεται debugging όταν δεν υπάρχει “inspect element” όπως στο web
* χρειάστηκε να δημιουργηθεί dedicated frontend logger που στέλνει logs από το κινητό στο backend
* τα SVG astro charts έρχονταν από βιβλιοθήκη που δεν συνεργαζόταν σωστά με React Native, οπότε τελικά προβλήθηκαν μέσω WebView
* τα LLM results επιστρέφονται σε markdown και γίνονται render μέσα στην εφαρμογή
* χρειάστηκε handling για async loading, mobile state persistence και αρκετό defensive error handling επειδή το mobile περιβάλλον είναι αρκετά πιο “σκληρό” από το web

Οι δύο βασικές βιβλιοθήκες που χρησιμοποιήθηκαν για τους αστρολογικούς υπολογισμούς και τα διαγράμματα ήταν οι:

* astrodraw/astrochart
* circular-natal-horoscope-js

Στο τεχνικό κομμάτι χρησιμοποιήθηκαν μεταξύ άλλων:
React Native, Expo Router, Node.js, Express, SQLite, JWT, Socket.io, Swagger, Zod, Winston logger, AdMob, React Markdown, Mantine, MUI, Axios κλπ.

Η βασική λογική της εφαρμογής είναι ότι ο χρήστης εισάγει ημερομηνία γέννησης, ώρα και συντεταγμένες. Από εκεί γίνονται διάφοροι αστρολογικοί υπολογισμοί:
ζώδιο, ωροσκόπος, σελήνη, πλανήτες, οίκοι, στοιχεία, aspects, balances, dignities κλπ.

Τα δεδομένα αυτά μετατρέπονται σε structured JSON payload και αποστέλλονται σε LLM μέσω carefully structured prompts ώστε να παραχθεί μια “ζωδιακή” ερμηνεία.

Στο profile μπορούν να αποθηκευτούν τα δεδομένα και υπάρχουν δύο επιπλέον λειτουργίες:

* compatibility/synastry μεταξύ δύο ατόμων
* future transit / question mode όπου ο χρήστης δίνει μια χρονική στιγμή στο μέλλον και κάνει συγκεκριμένη ερώτηση προς το σύστημα

Σε εκείνο το σημείο το project άρχισε να αποκτά περισσότερο ενδιαφέρον αρχιτεκτονικά, γιατί πλέον δεν ήταν απλώς “ένα horoscope app”, αλλά κάτι πιο κοντά σε experimentation πάνω σε:

* structured prompting
* filtering μεγάλων JSON payloads
* shaping δεδομένων πριν σταλούν σε LLM
* mobile frontend ↔ backend orchestration
* cost/performance tradeoffs για AI calls

Ξέρω ότι το UI/UX αυτή τη στιγμή μοιάζει περισσότερο με “εργαλείο προγραμματιστή που λύνει τεχνικά προβλήματα” παρά με polished mobile app που στοχεύει σε mainstream κοινό 😄
Αν δω ότι υπάρχει ενδιαφέρον πιθανότατα θα γίνει redesign στο μέλλον.

Η επιλογή του θέματος έγινε όχι τόσο λόγω βαθιάς “πίστης” στην αστρολογία — που παραμένει μάλλον περιορισμένη 😁 — αλλά γιατί κάπως πρέπει να καταφέρουμε και εμείς οι developers να τραβήξουμε την προσοχή των non-coding φίλων μας σε κάτι από αυτά που φτιάχνουμε.

(Αν και το ανθρωπολογικό ενδιαφέρον γύρω από το πώς λειτουργεί το chit-chat, τα zodiac discussions και οι μικρές “τελετουργίες” κοινωνικής αλληλεπίδρασης γύρω από αυτά τα θέματα παραμένει αρκετά ενδιαφέρον από μόνο του.)

Μπορείτε να τη δείτε στο Google Play Store εδώ:
[βάλε link]

---

Astro Lark – an astrology app I built

I'd like to share a side project I've been working on recently.

Astro Lark is an Android application that calculates a natal chart and provides AI-generated astrological interpretations. The app calculates planetary positions, signs, houses, chart ruler, elemental balance, aspects, house rulers, essential dignities, dispositors, and other chart data based on the birth date, birth time, and location provided by the user.

Once the chart has been calculated, the user can press the "Call Lark" button. The chart data is converted into a structured prompt and sent to an AI model, which generates a detailed interpretation of the chart.

Because AI calls are not free, I had to include rewarded advertisements in the app to help cover part of the operating costs — sorry about that 😄

Users who create an account can save their chart information and interpretations so they don't have to enter everything again each time they use the app.

Logged-in users also have access to a double-chart mode. This can be used either for relationship/synastry questions involving another person or for predictive questions about a future moment in time. In both cases, chart data is processed and sent to the AI system for interpretation.

The name Astro Lark was inspired by astrologer Bernadette Brady, who contrasts the hawk that flies high and sees the landscape from above with the lark that sings beautifully but remains closer to the ground. I liked the analogy because the application combines the mathematical side of astrology with AI-generated narrative interpretation.

I'm not a professional astrologer, so one of the reasons I'm posting this is to get feedback. I'm particularly interested in hearing whether the calculations look correct, whether the interpretations feel useful, and what could be improved in the overall experience.

I should also admit that the current UI looks much more like a developer tool that solves technical problems than a polished consumer mobile application 😄 Most of the effort went into getting the functionality working rather than making it pretty. If people find the project interesting, a future redesign is definitely on the table.

For developers

The application was built with React Native, Node.js, and SQLite, using Expo/EAS for the mobile build and deployment workflow. User accounts are handled through JWT authentication, while the backend is deployed on a Hetzner VPS.

For astrology calculations and chart generation, the two main libraries used were:

astrodraw / astrochart
circular-natal-horoscope-js

The AI functionality works as a wrapper around an LLM. Rather than sending raw chart text, the application generates structured JSON containing planetary positions, houses, aspects, rulers, dignities, elemental balances, and other chart data. This payload is filtered and transformed before being included in a structured prompt.

One of the original goals of the project was to learn the complete mobile publishing process, including Play Store testing, reviews, app signing, privacy requirements, and AdMob integration.

Google Play:
https://play.google.com/store/apps/details?id=com.alkis.astrolark