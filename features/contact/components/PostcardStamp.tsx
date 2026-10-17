/** Timbre de la carte postale : simple cadre à bord pointillé. */
export function PostcardStamp() {
  return (
    <div className="flex justify-end">
      <div aria-hidden="true" className="aspect-[4/5] w-[72px] border-2 border-dashed border-muted-foreground bg-muted md:w-24" />
    </div>
  );
}
