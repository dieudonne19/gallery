"use client"

import { createContext } from "react"

/**
 * Vrai dans la fenêtre d'une photo. Les cartes y remplacent l'adresse au lieu d'en ajouter une :
 * « retour » ou ✕ ferment alors toujours la fenêtre, quel que soit le nombre de photos vues dedans.
 */
export const InPhotoModal = createContext(false)
