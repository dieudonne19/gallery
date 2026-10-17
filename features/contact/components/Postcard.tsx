import { Eyebrow } from "@/components/shared/Eyebrow";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SITE_NAME } from "@/components/layout/nav";
import type { ContactDraft } from "../lib/message";
import { PostcardStamp } from "./PostcardStamp";

interface PostcardProps {
  value: ContactDraft;
  onChange: (next: ContactDraft) => void;
}

const lined =
  "rounded-none border-0 border-b border-muted-foreground bg-transparent px-0 font-serif text-xl font-light italic shadow-none focus-visible:ring-0 placeholder:text-muted-foreground";

export function Postcard({ value, onChange }: PostcardProps) {
  const set = (patch: Partial<ContactDraft>) => onChange({ ...value, ...patch });

  const message = (
    <div className="flex flex-col gap-3">
      <Label htmlFor="postcard-message" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        Votre message
      </Label>
      <Textarea
        id="postcard-message"
        rows={6}
        value={value.message}
        onChange={(e) => set({ message: e.target.value })}
        placeholder="Bonjour, j’ai vu votre photo…"
        className="min-h-0 resize-none rounded-none border-0 bg-[repeating-linear-gradient(transparent_0_35px,var(--border)_35px_36px)] p-0 md:min-h-[324px] font-serif text-xl font-light italic leading-9 shadow-none focus-visible:ring-0"
      />
    </div>
  );

  const address = (
    <div className="flex flex-col gap-5">
      <div>
        <Eyebrow>Pour</Eyebrow>
        <p className="mt-1 font-serif text-xl font-light">{SITE_NAME}</p>
      </div>
      <div>
        <Label htmlFor="postcard-name" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          De la part de
        </Label>
        <Input
          id="postcard-name"
          value={value.name}
          onChange={(e) => set({ name: e.target.value })}
          placeholder="Votre nom"
          className={lined}
        />
      </div>
      <div>
        <Label htmlFor="postcard-photo" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          À propos de la photo (facultatif)
        </Label>
        <Input
          id="postcard-photo"
          value={value.photo}
          onChange={(e) => set({ photo: e.target.value })}
          placeholder="Titre de la photo"
          className={lined}
        />
      </div>
    </div>
  );

  return (
    <div className="flex w-full max-w-[1000px] flex-col gap-7 rounded border border-border bg-[#FBF8F1] p-5 md:-rotate-1 md:grid md:grid-cols-[1fr_1px_1fr] md:gap-10 md:p-10">
      <div className="order-2 md:order-none">{message}</div>
      <div className="hidden bg-border md:block" aria-hidden />
      <div className="order-1 flex flex-col gap-7 md:order-none md:gap-10">
        <PostcardStamp />
        {address}
      </div>
    </div>
  );
}
