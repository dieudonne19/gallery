import { Eyebrow } from "@/components/shared/Eyebrow";
import { ABOUT_FACTS } from "../content";

export function AboutFacts() {
  return (
    <dl className="grid grid-cols-2 gap-4 px-4 pb-12 md:grid-cols-4 md:gap-8 md:px-16 md:pb-24">
      {ABOUT_FACTS.map((fact) => (
        <div key={fact.label} className="border-t border-border pt-3">
          <dt>
            <Eyebrow>{fact.label}</Eyebrow>
          </dt>
          <dd className="mt-1">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
