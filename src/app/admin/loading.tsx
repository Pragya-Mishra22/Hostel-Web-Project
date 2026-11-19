import { KineticTextLoader } from "@/components/ui/kinetic-loader";

export default function Loading() {
  return (
    <div className="flex min-h-[70dvh] items-center justify-center">
      <KineticTextLoader />
    </div>
  );
}
