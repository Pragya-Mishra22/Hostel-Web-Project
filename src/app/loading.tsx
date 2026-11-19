import { KineticTextLoader } from "@/components/ui/kinetic-loader";

export default function Loading() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-page">
      <KineticTextLoader />
    </div>
  );
}
