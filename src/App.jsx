import "./index.css"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Icon } from "@iconify/react"

import bet30 from "./assets/bet30.png"
import ganaencasa from "./assets/ganaencasa.png"
import ganamos from "./assets/ganamos.png"
import zeus from "./assets/zeus.png"
import eljoker from "./assets/eljoker.png"
import celuapuestas from "./assets/celuapuestas.png"
import ruleta from "./assets/ruleta.jpg"

// Mapa de codificación/decodificación
const encodeMap = { "0": "o", "1": "i", "2": "z", "3": "e", "4": "a", "5": "s", "7": "t" }
const decodeMap = { o: "0", i: "1", z: "2", e: "3", a: "4", s: "5", t: "7" }

// Decodificar número codificado
function decodePhone(encoded) {
  if (!encoded) return null
  return encoded.replace(/[oizeast]/g, (c) => decodeMap[c] || c)
}

// Obtener número desde el path de la URL
function getPhoneFromPath() {
  const path = window.location.pathname.slice(1) // elimina "/"
  return decodePhone(path)
}

const DEFAULT_WHATSAPP = "5493425974668" // Número por defecto

// Abrir WhatsApp
function openWhatsapp(phone, platform) {
  const target = phone || DEFAULT_WHATSAPP
  const text = `Quiero reclamar mi doble bono 30% en ${platform}`
  const url = `https://wa.me/${target}?text=${encodeURIComponent(text)}`
  window.open(url, "_blank")
}

function App() {
  const [open, setOpen] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState(null)

  const phoneFromUrl = getPhoneFromPath()

  const items = [
    { id: 1, src: bet30, alt: "Bet30" },
    { id: 2, src: ganaencasa, alt: "Gana en Casa" },
    { id: 3, src: ganamos, alt: "Ganamos" },
    { id: 4, src: zeus, alt: "Zeus" },
    { id: 5, src: eljoker, alt: "El Joker" },
    { id: 6, src: celuapuestas, alt: "Celu Apuestas" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-4">
      <h1 className="text-center text-2xl font-bold text-white mb-8">
        Nuestras Plataformas
      </h1>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {items.map((item, index) => (
          <motion.button
            key={item.id}
            className="rounded-xl overflow-hidden shadow-md bg-gray-800 cursor-pointer"
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => {
              setSelectedPlatform(item.alt)
              setOpen(true)
            }}
          >
            <img
              src={item.src}
              alt={item.alt}
              className="w-full h-48 object-cover"
            />
            <div className="p-2 text-center text-white text-sm font-medium">
              {item.alt}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Modal */}
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
              {/* Imagen de fondo con opacidad */}
              <div
                className="absolute inset-0 bg-center bg-cover opacity-30"
                style={{ backgroundImage: `url(${ruleta})` }}
              ></div>

              {/* Degradado overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/60"></div>

              {/* Contenido */}
              <div className="relative z-10">
                {/* Botón cerrar */}
                <button
                  onClick={() => setOpen(false)}
                  className="absolute -top-5 -right-5 text-yellow-400 text-2xl font-bold hover:text-yellow-300 cursor-pointer"
                >
                  ✕
                </button>

                {/* Texto */}
                <h2 className="text-xl font-bold text-yellow-400 mb-4 drop-shadow-lg">
                  🎰 Reclamar doble bono
                </h2>
                <p className="text-yellow-300 font-semibold mb-8 drop-shadow-md">
                  30% en tu primer y segunda recarga
                </p>

                {/* Botón estilo WhatsApp */}
                <button
                  onClick={() => openWhatsapp(phoneFromUrl, selectedPlatform)}
                  className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20b955] text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-green-700/50 transition cursor-pointer w-full"
                >
                  <Icon
                    icon="ic:baseline-whatsapp"
                    className="text-white text-2xl"
                  />
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
