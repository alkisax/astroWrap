import { useEffect } from 'react'
import { Chart } from '@astrodraw/astrochart'

type Props = {
  containerId: string
  planets: Record<string, number[]>
  cusps: number[]
}

export const useAstroChart = ({ containerId, planets, cusps }: Props) => {

  useEffect(() => {
    const el = document.getElementById(containerId)

    if (!el) return

    // 🔥 IMPORTANT: καθαρίζουμε προηγούμενο render (React strict mode fix)
    el.innerHTML = ''

    // 🎨 δημιουργία chart instance (600x600 fixed από lib)
    const chart = new Chart(containerId, 600, 600)

    // 🪐 δημιουργία radix chart
    const radix = chart.radix({
      planets,
      cusps
    })

    // σχεδιάζουμε aspects
    radix.aspects()

    // 🔍 βρίσκουμε το SVG που δημιούργησε η βιβλιοθήκη μέσα στο container
    const svg = el.querySelector('svg')

    if (svg) {
      // 🔥 δημιουργούμε ένα νέο SVG element (circle)
      // ΠΡΟΣΟΧΗ: χρησιμοποιούμε createElementNS γιατί το SVG ΔΕΝ είναι HTML
      const circle = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'circle'
      )

      // το chart έχει fixed size (600x600)
      // άρα το κέντρο είναι στο (300, 300)
      const size = 600
      const center = size / 2

      // cx, cy = coordinates του κέντρου του κύκλου
      circle.setAttribute('cx', center.toString())
      circle.setAttribute('cy', center.toString())

      // radius = πόσο μεγάλος είναι ο κύκλος (παίξε μέχρι να ταιριάξει με inner wheel)
      circle.setAttribute('r', '140')

      // γεμίζουμε τον κύκλο με μαύρο για να καλύψουμε το transparent background
      circle.setAttribute('fill', 'rgba(0,0,0,0.7)')

      // 🔥 το βάζουμε ΠΡΙΝ από όλα τα άλλα στοιχεία
      // ώστε να είναι "background layer" μέσα στο SVG
      svg.insertBefore(circle, svg.firstChild)
    }

    // cleanup (σε περίπτωση re-render / unmount)
    return () => {
      el.innerHTML = ''
    }

  }, [containerId, planets, cusps])
}