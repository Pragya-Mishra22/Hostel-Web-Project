import Image from "next/image";
import { PublicHeader } from "@/components/site/public-header";
import { Footer } from "@/components/site/footer";

/**
 * Full-width, two-panel layout for login and registration: a photo panel that
 * runs to the left edge and the form panel running to the right edge.
 */
export function AuthShell({
  image,
  imageAlt,
  eyebrow,
  title,
  points,
  children,
}: {
  image: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  points: string[];
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicHeader />
      <main className="grid min-h-svh w-full lg:grid-cols-2">
        <aside className="relative hidden overflow-hidden bg-brand-950 text-white lg:flex lg:flex-col lg:justify-end">
          <Image src={image} alt={imageAlt} fill priority sizes="50vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/60 to-brand-950/10" />
          <div className="relative z-10 p-12 xl:p-16">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">{eyebrow}</p>
            <h2 className="mt-3 max-w-lg font-display text-4xl font-extrabold leading-tight xl:text-5xl">{title}</h2>
            <ul className="mt-6 max-w-md space-y-3 text-sm text-white/80">
              {points.map((p) => (
                <li key={p} className="flex gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold-400" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <section className="flex w-full flex-col justify-center bg-page px-4 pb-16 pt-28 sm:px-8 lg:px-12 xl:px-20">
          <div className="mx-auto w-full max-w-xl">{children}</div>
        </section>
      </main>
      <Footer />
    </>
  );
}
