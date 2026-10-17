import Image from "next/image";
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
      <div className="relative aspect-[4/5] w-[72px] border-2 border-dashed border-muted-foreground bg-muted p-1 md:w-24">
        <Image src={src} alt="" fill sizes="96px" className="object-cover p-1" />
      </div>
    </div>
  );
}
