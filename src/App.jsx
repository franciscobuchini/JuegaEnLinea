import "./index.css"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Icon } from "@iconify/react"

import bet30 from "./assets/bet30.png"
import ganaencasa from "./assets/ganaencasa.png"
import ganamos from "./assets/ganamos.png"
import zeus from "./assets/zeus.png"
import eljoker from "./assets/eljoker.png"
import celuapuestas from "./assets/celuapuestas.png"
import ruleta from "./assets/ruleta.jpg"

// Leer token desde path (sin leading slash)
function getTokenFromPath() {
  return window.location.pathname.slice(1) || null
}

// Sanitiza y valida string numérico: devuelve digits or null
function sanitizeDigits(raw) {
  if (!raw) return null
  const digits = raw.replace(/\D/g, "")
  if (!digits) return null
  if (digits.length < 8 || digits.length > 15) return null
  return digits
}

const DEFAULT_WHATSAPP = "5493425974668" // número por defecto sin prefijo

// Abrir WhatsApp (wa.me requiere el número sin '+')
function openWhatsapp(phoneDigits, platform) {
  const target = phoneDigits || DEFAULT_WHATSAPP
  const text = `Quiero reclamar mi doble bono 30% en ${platform}`
  const url = `https://wa.me/${target}?text=${encodeURIComponent(text)}`
  window.open(url, "_blank")
}

function App() {
  const [open, setOpen] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState(null)
  const [approvedSet, setApprovedSet] = useState(null)
  const [phoneFromUrl, setPhoneFromUrl] = useState(null)
  const [loadingApproved, setLoadingApproved] = useState(true)

  useEffect(() => {
    let mounted = true
    fetch("/approved.json", { cache: "no-cache" })
      .then((r) => {
        if (!r.ok) throw new Error("failed to load")
        return r.json()
      })
      .then((json) => {
        if (!mounted) return
        const arr = Array.isArray(json.approved) ? json.approved : []
        setApprovedSet(new Set(arr))
      })
      .catch(() => {
        setApprovedSet(null)
      })
      .finally(() => mounted && setLoadingApproved(false))
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (loadingApproved) return

    const token = getTokenFromPath() // debe ser solo dígitos
    if (!token) {
      setPhoneFromUrl(null)
      return
    }

    const digits = sanitizeDigits(token)
    if (!digits) {
      setPhoneFromUrl(null)
      return
    }

    if (approvedSet instanceof Set) {
      if (!approvedSet.has(digits)) {
        setPhoneFromUrl(null)
        return
      }
      setPhoneFromUrl(digits)
      return
    }

    // Si approved.json no está disponible, fallback: usar default
    setPhoneFromUrl(null)
  }, [approvedSet, loadingApproved])

  const items = [
    { id: 1, src: bet30, alt: "Bet30" },
    { id: 2, src: ganaencasa, alt: "Gana en Casa" },
    { id: 3, src: ganamos, alt: "Ganamos" },
    { id: 4, src: zeus, alt: "Zeus" },
    { id: 5, src: eljoker, alt: "El Joker" },
    { id: 6, src: celuapuestas, alt: "Celu Apuestas" },
  ]

  return (
    <div className="min-h-screen bg-black p-4">
      <h1 className="text-center text-2xl font-bold text-white mb-8">
        Nuestras Plataformas
      </h1>

      <div className="grid grid-cols-2 gap-4">
        {items.map((item, index) => (
          <motion.button
            key={item.id}
            className="rounded-xl overflow-hidden shadow-md bg-gray-800 cursor-pointer"
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            onClick={() => {
              setSelectedPlatform(item.alt)
              setOpen(true)
            }}
          >
            <img src={item.src} alt={item.alt} className="w-full h-48 object-cover" />
            <div className="p-2 text-center text-white text-sm font-medium">{item.alt}</div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative rounded-2xl shadow-2xl w-96 p-8 text-center border-4 border-yellow-500 overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="absolute inset-0 bg-center bg-cover opacity-30" style={{ backgroundImage: `url(${ruleta})` }}></div>
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/60"></div>

              <div className="relative z-10">
                <button onClick={() => setOpen(false)} className="absolute -top-5 -right-5 text-yellow-400 text-2xl font-bold hover:text-yellow-300 cursor-pointer">✕</button>

                <h2 className="text-xl font-bold text-yellow-400 mb-4 drop-shadow-lg">🎰 Reclamar doble bono</h2>
                <p className="text-yellow-300 font-semibold mb-8 drop-shadow-md">30% en tu primer y segunda recarga</p>

                <button
                  onClick={() => openWhatsapp(phoneFromUrl, selectedPlatform)}
                  className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20b955] text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-green-700/50 transition cursor-pointer w-full"
                >
                  <Icon icon="ic:baseline-whatsapp" className="text-white text-2xl" />
                  Reclamar por WhatsApp
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App