/**
 * Accueil, pages des photos et fenêtre des photos. Un clic sur une photo l'ouvre dans @modal, par-dessus la page
 * en cours (route interceptée « (.)photos/[id] »). Un lien partagé ou un rechargement affiche /photos/[id] en page complète.
 * Les pages des photos sont dans ce même groupe : ouverte depuis l'une d'elles, la fenêtre se pose par-dessus.
 */
export default function GalleryLayout({ children, modal }: { children: React.ReactNode; modal: React.ReactNode }) {
  return (
    <>
      {children}
      {modal}
    </>
  )
}
