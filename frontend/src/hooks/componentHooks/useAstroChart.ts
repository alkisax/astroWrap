// frontend\src\hooks\componentHooks\useAstroChart.ts

// αυτό είναι ένα hook που συνεργάζεται με το AstroChart.tsx και κάνουν render το chart σε svg. Περα απο την βιβλιοθήκη έχουμε προσθεσει στο svg και δικά μας render

import { useEffect } from "react";
import { Chart } from "@astrodraw/astrochart"; //⚠️⚠️
// import { getAngleAspects } from "../../utils/getAngleAspects";
import type { ChartSummary } from "../../types/types";
import { getAngleAspects } from "../../utils/getAngleAspects";

type Props = {
  containerId: string; // html Λογική, η βιβλιοθήκη δεν είναι react και σε κάθε rerender αναζητά και αλλάζει το <div id="paper">
  planets: Record<string, number[]>;
  cusps: number[];
  data: ChartSummary;
  userOrb: number;
};

export const useAstroChart = ({
  containerId,
  planets,
  cusps,
  data,
  userOrb,
}: Props) => {
  useEffect(() => {
    const el = document.getElementById(containerId);

    if (!el) return;

    // IMPORTANT: καθαρίζουμε προηγούμενο render (React strict mode fix)
    el.innerHTML = "";

    // δημιουργία chart instance (600x600 fixed από lib)
    // δηλαδή φτιάχνουμε ένα object της βιβλιοθήκης @astrodraw/astrochart
    const chart = new Chart(containerId, 600, 600);

    // δημιουργία radix chart → @astrodraw/astrochart
    const radix = chart.radix({
      planets,
      cusps,
    });
    // console.log(radix);

    // σχεδιάζουμε aspects → @astrodraw/astrochart
    radix.aspects();

    // βρίσκουμε το SVG που δημιούργησε η βιβλιοθήκη μέσα στο container
    const svg = el.querySelector("svg");

    // αυτή είναι η προσθήκη μας. είναι για να φτιάξουμε έναν εσωτερικό semitransparent κύκλο γιατί τα aspects χάνονταν στο bg image
    if (svg) {
      // δημιουργούμε ένα νέο SVG element (circle)
      // ΠΡΟΣΟΧΗ: χρησιμοποιούμε createElementNS γιατί το SVG ΔΕΝ είναι HTML
      // το 'http://www.w3.org/2000/svg' ΔΕΝ είναι request URL — είναι identifier, λέει στον browser "φτιάξε SVG element (<circle>) και όχι HTML"
      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );

      // το chart έχει fixed size (600x600)
      // άρα το κέντρο είναι στο (300, 300)
      const size = 600;
      const center = size / 2;

      // cx, cy = coordinates του κέντρου του κύκλου
      circle.setAttribute("cx", center.toString());
      circle.setAttribute("cy", center.toString());

      // radius = πόσο μεγάλος είναι ο κύκλος (παίξε μέχρι να ταιριάξει με inner wheel)
      circle.setAttribute("r", "140");

      // γεμίζουμε τον κύκλο με μαύρο για να καλύψουμε το transparent background
      circle.setAttribute("fill", "rgba(0,0,0,0.7)");

      // το βάζουμε ΠΡΙΝ από όλα τα άλλα στοιχεία
      // ώστε να είναι "background layer" μέσα στο SVG
      svg.insertBefore(circle, svg.firstChild);

      // TODO να διαβαστεί καλύτερα
      // ↓ ⚠️⚠️⚠️ new aspect lines
      // βρίσκουμε το group που περιέχει ΟΛΑ τα aspects της βιβλιοθήκης
      const libAspectGroup = svg.querySelector("#paper-astrology-aspects");

      if (libAspectGroup) {
        // ❗ δεν τα διαγράφουμε
        // ❗ τα κρατάμε για να πάρουμε τα coordinates
        // ✔ απλά τα κάνουμε invisible
        (libAspectGroup as SVGGElement).style.opacity = "0";
      }

      // παίρνουμε όλα τα <line> που έχει ζωγραφίσει η βιβλιοθήκη
      // κάθε line = ένα aspect (με ήδη σωστά coordinates + rotation)
      const libLines = svg.querySelectorAll("#paper-astrology-aspects line");

      // μετατρέπουμε τα SVG lines σε JS objects για εύκολο matching
      const libAspectMap = Array.from(libLines).map((line) => ({
        // ποια 2 σημεία συνδέει (πχ Sun - Mars)
        p1: line.getAttribute("data-point"),
        p2: line.getAttribute("data-toPoint"),

        // οι ΠΡΑΓΜΑΤΙΚΕΣ συντεταγμένες που υπολόγισε η lib
        // (εδώ είναι όλο το ζουμί — ΔΕΝ τις υπολογίζουμε εμείς)
        x1: Number(line.getAttribute("x1")),
        y1: Number(line.getAttribute("y1")),
        x2: Number(line.getAttribute("x2")),
        y2: Number(line.getAttribute("y2")),
      }));

      // δικά σου aspects (με custom orb logic κλπ)
      const aspects = getAngleAspects(data, userOrb);

      // για κάθε δικό σου aspect
      aspects.forEach((a) => {
        // προσπαθούμε να βρούμε το αντίστοιχο line της βιβλιοθήκης
        // (για να πάρουμε τα coordinates του)
        const match = libAspectMap.find(
          (l) =>
            // γιατί μπορεί να είναι reversed (Sun-Mars ή Mars-Sun)
            (l.p1 === a.point1Label && l.p2 === a.point2Label) ||
            (l.p1 === a.point2Label && l.p2 === a.point1Label),
        );

        // αν η βιβλιοθήκη ΔΕΝ έχει αυτό το aspect → δεν μπορούμε να το ζωγραφίσουμε
        // (γιατί δεν έχουμε coordinates)
        if (!match) return;

        // δημιουργούμε νέο SVG line (custom layer)
        const line = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line",
        );

        // χρησιμοποιούμε ΑΚΡΙΒΩΣ τα coordinates της βιβλιοθήκης
        line.setAttribute("x1", match.x1.toString());
        line.setAttribute("y1", match.y1.toString());
        line.setAttribute("x2", match.x2.toString());
        line.setAttribute("y2", match.y2.toString());

        // 🎨 COLORS ανά aspect type
        // (ίδια λογική με astrochart colors)
        let color = "white"; // default

        if (a.type === "square")
          color = "#FF4500"; // κόκκινο
        else if (a.type === "trine")
          color = "#27AE60"; // πράσινο
        else if (a.type === "opposition") color = "#FF0000";
        else if (a.type === "sextile")
          color = "#3498DB"; // μπλε
        else if (a.type === "conjunction") color = "#AAAAAA"; // neutral

        line.setAttribute("stroke", color);

        // 📏 THICKNESS based on orb
        // μικρό orb = πιο "δυνατό" aspect → πιο χοντρή γραμμή
        const orb = a.orb ?? 0; // 👈 fix εδώ
        const width = Math.max(0.5, 3 - orb);
        line.setAttribute("stroke-width", width.toString());

        // 🧠 TOOLTIP
        line.setAttribute(
          "data-tooltip",
          `${a.point1Label} ${a.type} ${a.point2Label} (orb: ${orb.toFixed(2)})`,
        );

        // native tooltip
        const title = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "title",
        );
        title.textContent = `${a.point1Label} ${a.type} ${a.point2Label} (${orb.toFixed(2)}°)`;
        line.appendChild(title);

        // το προσθέτουμε ΠΑΝΩ από το chart
        // (οπτικά αντικαθιστά τα hidden lib aspects)
        svg.appendChild(line);
      });
      // // ↑ ⚠️⚠️⚠️ new aspect lines
    }

    // cleanup (σε περίπτωση re-render / unmount)
    return () => {
      el.innerHTML = "";
    };
  }, [containerId, planets, cusps, data, userOrb]);
};
