/** Données structurées (schema.org) pour les moteurs de recherche. Le "<" est échappé pour que rien ne ferme la balise. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  )
}
