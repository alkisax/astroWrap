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
