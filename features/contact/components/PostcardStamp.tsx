import { Eyebrow } from "@/components/shared/Eyebrow";

interface PostcardStampProps {
  src: string;
  place?: string;
  date?: string;
}

/** Timbre : petite photo à bord pointillé, avec cachet (lieu et date). */
export function PostcardStamp({ src, place = "[Lieu]", date = "[Date]" }: PostcardStampProps) {
  return (
    <div className="flex items-start justify-end gap-3">
      <Eyebrow className="text-right">
        {place}
        <br />
        {date}
      </Eyebrow>
      <img
        src={src}
        alt=""
        className="aspect-[4/5] w-[72px] border-2 border-dashed border-muted-foreground bg-muted object-cover p-1 md:w-24"
      />
    </div>
  );
}
