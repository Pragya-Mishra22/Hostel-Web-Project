"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// SVG parts
// ---------------------------------------------------------------------------

const FolderBackIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 20 16" className={cn("h-full w-full fill-current", className)} aria-hidden="true">
    <path d="M7.5,0C7.4,0,2,0,2,0C0.9,0,0,0.9,0,2l0,12c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V4c0-1.1-0.9-2-2-2c0,0-7.5,0-8,0C9,2,9.9,0,7.5,0z" />
  </svg>
);

const FolderCoverIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 20 16" className={cn("h-full w-full fill-current", className)} aria-hidden="true">
    <path d="M2,2h16c1.1,0,2,0.9,2,2v10c0,1.1-0.9,2-2,2H2c-1.1,0-2-0.9-2-2V4C0,2.9,0.9,2,2,2z" />
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn("h-full w-full fill-current", className)} aria-hidden="true">
    <path
      opacity="0.3"
      d="M22.2,17.7l-4-2c-0.5-0.3-0.8-0.8-0.8-1.3v-1.6c0.1-0.1,0.2-0.3,0.4-0.5c0.5-0.8,0.9-1.6,1.2-2.5c0.5-0.2,0.9-0.6,0.9-1.2V7c0-0.4-0.2-0.7-0.4-0.9V3.7c0,0,0.5-3.7-4.6-3.7c-5,0-4.6,3.7-4.6,3.7v2.4C10.1,6.3,9.9,6.7,9.9,7v1.7c0,0.4,0.2,0.8,0.6,1c0.4,1.8,1.5,3.1,1.5,3.1v1.5c0,0.6-0.3,1.1-0.8,1.3l-3.7,2c-1.1,0.6-1.7,1.7-1.7,2.9v1.3H24v-1.3C24,19.4,23.3,18.3,22.2,17.7z"
    />
    <path
      opacity="0.5"
      d="M7.5,17.7l2.5-1.3c0,0,0,0,0,0l1.2-0.7c0.5-0.3,0.8-0.8,0.8-1.3v-1.5c0,0-0.4-0.5-0.9-1.4l0,0c0,0,0,0,0,0c-0.1-0.1-0.1-0.2-0.2-0.3c0,0,0,0,0-0.1c-0.1-0.1-0.1-0.3-0.2-0.4c0,0,0,0,0,0c0-0.1-0.1-0.2-0.1-0.4c0,0,0-0.1,0-0.1c0-0.1-0.1-0.3-0.1-0.4c-0.3-0.2-0.6-0.6-0.6-1V7c0-0.4,0.2-0.7,0.4-0.9V3.8C9.8,3.3,8.9,2.9,7.4,2.9c-4,0-4.1,3.3-4.1,3.3v2.1C3.1,8.5,2.9,8.8,2.9,9.1v1.4c0,0.4,0.2,0.7,0.5,0.9c0.4,1.6,1.6,2.7,1.6,2.7v1.3c0,0.5-0.3,0.9-0.7,1.1l-2.8,1.7C0.6,18.8,0,19.7,0,20.8v1.2h5.8v-1.3C5.8,19.4,6.5,18.3,7.5,17.7z"
    />
  </svg>
);

const GlobeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn("h-full w-full fill-current", className)} aria-hidden="true">
    <circle cx="12" cy="12" r="10" opacity="0.3" />
    <path d="M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10s10-4.5,10-10S17.5,2,12,2z M12,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,12,20z" />
  </svg>
);

const PadlockIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 33.6" className={cn("h-full w-full fill-current", className)} aria-hidden="true">
    <path d="M23,13.5h-1.7V9.4C21.4,4.2,17.2,0,12,0C6.8,0,2.6,4.2,2.6,9.4v4.1H1c-0.5,0-1,0.4-1,1v18.2c0,0.5,0.4,1,1,1H23c0.5,0,1-0.4,1-1V14.4C24,13.9,23.6,13.5,23,13.5z M13.5,24.5v3.9c0,0.3-0.3,0.6-0.6,0.6h-1.8c-0.3,0-0.6-0.3-0.6-0.6v-3.9c-0.7-0.5-1.1-1.3-1.1-2.1c0-1.4,1.2-2.6,2.6-2.6c1.4,0,2.6,1.2,2.6,2.6C14.6,23.3,14.2,24.1,13.5,24.5z M16.9,13.5H7.1V9.4c0-2.7,2.2-4.9,4.9-4.9c2.7,0,4.9,2.2,4.9,4.9V13.5z" />
  </svg>
);

const CloudIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 22.2" className={cn("h-full w-full fill-current", className)} aria-hidden="true">
    <path d="M19.5,5.8c-0.3-1.5-1-2.9-2.2-4c-1.3-1.2-3-1.8-4.7-1.8C11.3,0,10,0.4,8.9,1.1C8,1.7,7.2,2.5,6.6,3.5c-0.2,0-0.5-0.1-0.7-0.1c-2.1,0-3.8,1.7-3.8,3.8c0,0.3,0,0.5,0.1,0.8C0.8,9,0,10.6,0,12.3C0,13.6,0.5,15,1.4,16c1,1.1,2.2,1.7,3.6,1.8c0,0,0,0,0,0h4.2c0.4,0,0.7-0.3,0.7-0.7s-0.3-0.7-0.7-0.7H5c-2-0.1-3.7-2-3.7-4.2c0-1.4,0.8-2.7,2-3.4c0.3-0.2,0.4-0.5,0.3-0.8C3.5,7.8,3.4,7.5,3.4,7.2c0-1.4,1.1-2.5,2.5-2.5c0.3,0,0.6,0,0.8,0.1c0.3,0.1,0.7,0,0.8-0.3c0.9-2,2.9-3.2,5.1-3.2c2.9,0,5.3,2.2,5.6,5.1c0,0.3,0.3,0.5,0.6,0.6c2.2,0.4,3.9,2.4,3.9,4.7c0,2.5-1.9,4.6-4.3,4.8h-3.6c-0.4,0-0.7,0.3-0.7,0.7s0.3,0.7,0.7,0.7h3.7c0,0,0,0,0,0c1.5-0.1,2.9-0.8,4-2c1-1.1,1.6-2.6,1.6-4.1C24,8.9,22.1,6.5,19.5,5.8z M16,12.9c0.3-0.3,0.3-0.7,0-0.9l-3.5-3.5c-0.1-0.1-0.3-0.2-0.5-0.2c-0.2,0-0.3,0.1-0.5,0.2L8,12c-0.3,0.3-0.3,0.7,0,0.9c0.1,0.1,0.3,0.2,0.5,0.2c0.2,0,0.3-0.1,0.5-0.2l2.4-2.4v11c0,0.4,0.3,0.7,0.7,0.7s0.7-0.3,0.7-0.7v-11l2.4,2.4C15.3,13.2,15.7,13.2,16,12.9z" />
  </svg>
);

const FileIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 20 26.8" className={cn("h-full w-full fill-current", className)} aria-hidden="true">
    <path d="M2.3,0C1,0,0,1,0,2.3v22.2c0,1.2,1,2.3,2.3,2.3h15.4c1.2,0,2.3-1,2.3-2.3V6l-6-6H2.3z" />
    <path opacity="0.1" d="M13.9,3.7V0l6,6h-3.7C14.9,6,13.9,5,13.9,3.7z" />
  </svg>
);

// ---------------------------------------------------------------------------
// Types and configuration
// ---------------------------------------------------------------------------

export type FolderVariant = "devi" | "rudras" | "ardra" | "shakti" | "kubera" | "hari" | "ravi" | "durga" | "nandi" | "info";

export interface FolderInfo {
  title: string;
  rows: { label: string; value?: string }[];
}

export interface FolderPreviewProps {
  variant?: FolderVariant;
  /** Image URLs that pop out of image variants. */
  images?: string[];
  /** File names listed by the durga and nandi variants. */
  files?: { name: string; type?: "txt" | "gif" | "mp3" | "default" }[];
  /** A card of labelled rows for the info variant (real information, not just pictures). */
  info?: FolderInfo;
  label?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  onClick?: () => void;
}

type Colors = { back: string; cover: string; deco: string; caption: string };

const variantColors: Record<FolderVariant, Colors> = {
  devi: { back: "text-gray-500", cover: "text-gray-400", deco: "text-gray-400 brightness-125", caption: "text-ink" },
  rudras: { back: "text-slate-600", cover: "text-slate-500", deco: "text-gray-300", caption: "text-accent-fg" },
  ardra: { back: "text-blue-800", cover: "text-blue-600", deco: "text-blue-700", caption: "text-accent-fg" },
  shakti: { back: "text-indigo-800", cover: "text-indigo-700", deco: "text-indigo-800", caption: "text-success-fg" },
  kubera: { back: "text-emerald-700", cover: "text-emerald-600", deco: "text-emerald-800", caption: "text-ink" },
  hari: { back: "text-sky-700", cover: "text-sky-600", deco: "text-sky-800", caption: "text-ink" },
  ravi: { back: "text-gray-600", cover: "text-gray-500", deco: "text-gray-300", caption: "text-ink" },
  durga: { back: "text-green-700", cover: "text-green-600", deco: "text-green-800", caption: "text-success-fg font-mono" },
  nandi: { back: "text-amber-600", cover: "text-amber-500", deco: "text-amber-700", caption: "text-ink" },
  info: { back: "text-brand-800", cover: "text-brand-600", deco: "text-brand-300", caption: "text-ink" },
};

const sizeConfig = {
  sm: { folder: "w-16", thumb: "size-10", deco: "size-4", caption: "text-xs" },
  md: { folder: "w-24", thumb: "size-14", deco: "size-6", caption: "text-sm" },
  lg: { folder: "w-32", thumb: "size-20", deco: "size-8", caption: "text-base" },
  xl: { folder: "w-44", thumb: "size-24", deco: "size-10", caption: "text-base" },
};
type Sizes = (typeof sizeConfig)["md"];

const createCircularPositions = (count: number, radius = 120) =>
  Array.from({ length: count }, (_, i) => {
    const startAngle = Math.PI / count;
    const angle = startAngle / 2 + startAngle * i;
    return { x: Math.round(radius * Math.cos(angle)), y: Math.round(-radius * Math.sin(angle)) };
  });

interface FolderBodyProps {
  isHovered: boolean;
  colors: Colors;
  sizes: Sizes;
  label?: string;
}

const Caption = ({ label, sizes, colors, className }: { label?: string; sizes: Sizes; colors: Colors; className?: string }) =>
  label ? <h3 className={cn("mt-3 text-center font-medium", sizes.caption, colors.caption, className)}>{label}</h3> : null;

const PaperSheet = ({ className }: { className?: string }) => (
  <div className={cn("absolute bottom-0.5 left-0.5 right-0.5 h-3/4 rounded-lg bg-white", className)} />
);

const Deco = ({ children, sizes, colors, offset }: { children: React.ReactNode; sizes: Sizes; colors: Colors; offset?: boolean }) => (
  <div className={cn("absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2", offset && "mt-1", sizes.deco, colors.deco)}>
    {children}
  </div>
);

/** A thumbnail that pops out of a folder. Uses a plain img: these are tiny and decorative. */
const Thumb = ({ src, ...props }: { src: string } & React.ComponentProps<typeof motion.img>) => (
  <motion.img src={src} alt="" loading="lazy" {...props} />
);

// ---------------------------------------------------------------------------
// Image variants
// ---------------------------------------------------------------------------

const DeviFolder = ({ images, isHovered, colors, sizes, label }: FolderBodyProps & { images: string[] }) => {
  const positions = createCircularPositions(images.length, 80);
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        {images.map((img, i) => (
          <Thumb
            key={i}
            src={img}
            className="absolute size-12 rounded-full border-2 border-white object-cover shadow-md"
            initial={{ opacity: 0, scale: 0.7, x: 0, y: 0 }}
            animate={isHovered ? { opacity: 1, scale: 1, x: positions[i]?.x ?? 0, y: positions[i]?.y ?? 0 } : { opacity: 0, scale: 0.7, x: 0, y: 0 }}
            transition={{ duration: 0.6, delay: (images.length - i - 1) * 0.04, ease: [0.2, 1, 0.3, 1] }}
          />
        ))}
      </div>
      <div className="relative aspect-[20/16] cursor-pointer" style={{ perspective: "800px" }}>
        <div className={cn("absolute inset-0 transition-colors duration-150", colors.back)}>
          <FolderBackIcon />
        </div>
        <motion.div className={cn("relative transition-colors duration-150", isHovered ? "text-gray-600" : colors.cover)}>
          <FolderCoverIcon />
          <Deco sizes={sizes} colors={colors}>
            <UsersIcon />
          </Deco>
        </motion.div>
      </div>
      <Caption label={label} sizes={sizes} colors={colors} />
    </div>
  );
};

const RudrasFolder = ({ images, isHovered, colors, sizes, label }: FolderBodyProps & { images: string[] }) => {
  const positions = createCircularPositions(images.length, 80);
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        {images.map((img, i) => (
          <Thumb
            key={i}
            src={img}
            className="absolute size-12 rounded-full border-2 border-white object-cover shadow-md"
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={isHovered ? { opacity: 1, scale: 1, x: -(positions[i]?.x ?? 0), y: positions[i]?.y ?? 0 } : { opacity: 0, scale: 0, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: (images.length - i - 1) * 0.08, type: "spring", stiffness: 200, damping: 15 }}
          />
        ))}
      </div>
      <div className="relative aspect-[20/16] cursor-pointer" style={{ perspective: "800px" }}>
        <div className={cn("absolute inset-0", colors.back)}>
          <FolderBackIcon />
        </div>
        <PaperSheet />
        <motion.div
          className={cn("relative", colors.cover)}
          style={{ transformOrigin: "50% 100%", transformStyle: "preserve-3d" }}
          animate={isHovered ? { rotateX: -30 } : { rotateX: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <FolderCoverIcon />
          <Deco sizes={sizes} colors={colors}>
            <UsersIcon />
          </Deco>
        </motion.div>
      </div>
      <Caption label={label} sizes={sizes} colors={colors} />
    </div>
  );
};

const ArdraFolder = ({ images, isHovered, colors, sizes, label }: FolderBodyProps & { images: string[] }) => {
  // Fixed offsets (not Math.random) so server and client render identically.
  const positions = React.useMemo(
    () =>
      images.map((_, i) => {
        const radius = 60 + ((i * 7) % 20);
        const angle = (2 * (i + 1) * Math.PI) / images.length;
        return { x: Math.round(radius * Math.cos(angle)), y: Math.round(radius * Math.sin(angle)), rotate: ((i * 5) % 6) - 3 };
      }),
    [images],
  );
  return (
    <div className="relative">
      <motion.div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
      >
        <motion.div
          className="size-10 rounded-full bg-gray-900/50"
          initial={{ scale: 1 }}
          animate={isHovered ? { opacity: [1, 0], scale: [1, 6] } : { opacity: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.1, 1, 0.3, 1] }}
        />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        {images.map((img, i) => (
          <Thumb
            key={i}
            src={img}
            className="absolute size-10 rounded-full border-2 border-white object-cover shadow-lg"
            initial={{ opacity: 0, scale: 0.4, x: 0, y: 0, rotate: 0 }}
            animate={
              isHovered
                ? { opacity: 1, scale: 1, x: positions[i]?.x ?? 0, y: positions[i]?.y ?? 0, rotate: positions[i]?.rotate ?? 0 }
                : { opacity: 0, scale: 0.4, x: 0, y: 0, rotate: 0 }
            }
            transition={{ duration: 0.5, ease: [0.1, 1, 0.3, 1] }}
          />
        ))}
      </div>
      <motion.div
        className="relative aspect-[20/16] cursor-pointer"
        animate={isHovered ? { scale: 0.85 } : { scale: 1 }}
        transition={{ duration: 0.5, ease: [0.1, 1, 0.3, 1] }}
      >
        <div className={cn("absolute inset-0", colors.back)}>
          <FolderBackIcon />
        </div>
        <div className={cn("relative", colors.cover)}>
          <FolderCoverIcon />
          <Deco sizes={sizes} colors={colors}>
            <GlobeIcon />
          </Deco>
        </div>
      </motion.div>
      <Caption label={label} sizes={sizes} colors={colors} />
    </div>
  );
};

const ShaktiFolder = ({ images, isHovered, colors, sizes, label }: FolderBodyProps & { images: string[] }) => (
  <motion.div className="relative" animate={isHovered ? { y: 15 } : { y: 0 }} transition={{ duration: 0.4, ease: [0.2, 1, 0.3, 1] }}>
    <div className="relative cursor-pointer">
      <div className={cn("absolute inset-0", colors.back)}>
        <FolderBackIcon />
      </div>
      <div className={cn("absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2", sizes.thumb)}>
        {images.map((img, i) => (
          <Thumb
            key={i}
            src={img}
            className="absolute h-16 w-12 origin-[-600%_50%] rounded object-cover shadow-lg"
            initial={{ opacity: 0, rotate: 0 }}
            animate={isHovered ? { opacity: 1, rotate: -10 * (images.length - i - 1) - 15 } : { opacity: 0, rotate: 0 }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.1, 1, 0.3, 1] }}
          />
        ))}
      </div>
      <div className={cn("relative", colors.cover)}>
        <FolderCoverIcon />
        <Deco sizes={sizes} colors={colors} offset>
          <PadlockIcon />
        </Deco>
      </div>
    </div>
    <Caption label={label} sizes={sizes} colors={colors} />
  </motion.div>
);

const KuberaFolder = ({ images, isHovered, colors, sizes, label }: FolderBodyProps & { images: string[] }) => {
  const floating = React.useMemo(
    () => images.map((_, i) => ({ y: -200 - ((i * 17) % 50), x: ((i * 29) % 50) - 25, rotate: ((i * 19) % 40) - 20 })),
    [images],
  );
  return (
    <div className="relative">
      <div className="relative cursor-pointer" style={{ perspective: "800px" }}>
        <div className={cn("absolute inset-0", colors.back)}>
          <FolderBackIcon />
        </div>
        <PaperSheet />
        <div className={cn("absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2", sizes.thumb)}>
          {images.map((img, i) => (
            <Thumb
              key={i}
              src={img}
              className="absolute size-full rounded-lg object-cover shadow-lg"
              initial={{ opacity: 0 }}
              animate={
                isHovered
                  ? { opacity: [1, 0], y: [0, floating[i]?.y ?? -200], x: floating[i]?.x ?? 0, rotate: floating[i]?.rotate ?? 0 }
                  : { opacity: 0 }
              }
              transition={{ duration: 0.4, delay: i * 0.3, repeat: isHovered ? Infinity : 0, ease: "linear" }}
            />
          ))}
        </div>
        <motion.div
          className={cn("relative", colors.cover)}
          style={{ transformOrigin: "50% 100%", transformStyle: "preserve-3d" }}
          animate={isHovered ? { rotateX: -40 } : { rotateX: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <FolderCoverIcon />
          <Deco sizes={sizes} colors={colors} offset>
            <CloudIcon />
          </Deco>
        </motion.div>
      </div>
      <Caption label={label} sizes={sizes} colors={colors} />
    </div>
  );
};

const HariFolder = ({ images, isHovered, colors, sizes, label }: FolderBodyProps & { images: string[] }) => {
  const positions = createCircularPositions(images.length, 120);
  return (
    <div className="relative">
      <motion.div
        className="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500"
        initial={{ opacity: 0, scale: 1 }}
        animate={isHovered ? { opacity: [1, 0], scale: [1, 15] } : { opacity: 0, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.2, ease: [0.1, 1, 0.3, 1] }}
      />
      <div className={cn("absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2", sizes.thumb)}>
        {images.map((img, i) => (
          <Thumb
            key={i}
            src={img}
            className="absolute h-16 w-12 rounded object-cover shadow-lg"
            initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
            animate={isHovered ? { opacity: 1, scale: 1, x: -(positions[i]?.x ?? 0), y: -(positions[i]?.y ?? 0) } : { opacity: 0, scale: 0.5, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          />
        ))}
      </div>
      <motion.div
        className="relative cursor-pointer"
        style={{ perspective: "800px", transformOrigin: "50% 100%" }}
        animate={isHovered ? { y: -20, scaleX: 0.9, scaleY: 0.9 } : { y: 0, scaleX: 1, scaleY: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 200, damping: 15 }}
      >
        <div className={cn("absolute inset-0", colors.back)}>
          <FolderBackIcon />
        </div>
        <PaperSheet className="bg-white/80" />
        <motion.div
          className={cn("relative", colors.cover)}
          style={{ transformOrigin: "50% 100%", transformStyle: "preserve-3d" }}
          animate={isHovered ? { rotateX: -25 } : { rotateX: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <FolderCoverIcon />
          <Deco sizes={sizes} colors={colors} offset>
            <GlobeIcon />
          </Deco>
        </motion.div>
      </motion.div>
      <motion.h3
        className={cn("mt-3 text-center font-medium", sizes.caption, colors.caption)}
        animate={isHovered ? { opacity: 0 } : { opacity: 1 }}
        transition={{ delay: isHovered ? 0.3 : 0 }}
      >
        {label}
      </motion.h3>
    </div>
  );
};

const RaviFolder = ({ images, isHovered, colors, sizes, label }: FolderBodyProps & { images: string[] }) => {
  const ordered = React.useMemo(() => {
    const result: string[] = [];
    let i = Math.ceil(images.length / 2);
    let j = i - 1;
    while (j >= 0) {
      result.push(images[j--]);
      if (i < images.length) result.push(images[i++]);
    }
    return result;
  }, [images]);

  return (
    <div className="relative">
      <motion.div
        className="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        initial={{ opacity: 0, scale: 1 }}
        animate={!isHovered ? { opacity: [1, 0], scale: [1, 5] } : { opacity: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.35, ease: [0.1, 1, 0.3, 1] }}
      />
      <div className="relative cursor-pointer" style={{ perspective: "800px" }}>
        <div className={cn("absolute inset-0", colors.back)}>
          <FolderBackIcon />
        </div>
        <PaperSheet />
        <div className="absolute left-1/2 top-1/2 h-[65px] w-[75px] -translate-x-1/2 -translate-y-1/2">
          {ordered.map((img, i) => {
            const interval = 60;
            const c = ordered.length;
            const x = -interval * Math.floor(c / 2) + interval * i + (c % 2 === 0 ? interval / 2 : 0);
            const rotateInterval = 20;
            const rotate = -rotateInterval * Math.floor(c / 2) + rotateInterval * i + (c % 2 === 0 ? rotateInterval / 2 : 0);
            return (
              <Thumb
                key={i}
                src={img}
                className="absolute size-full rounded object-cover shadow-lg"
                initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 1 }}
                animate={isHovered ? { opacity: 1, y: -70, x, rotate } : { opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.5 }}
                transition={{ duration: isHovered ? 0.4 : 0.3, ease: isHovered ? [0.1, 1, 0.3, 1] : "easeInOut" }}
              />
            );
          })}
        </div>
        <motion.div
          className={cn("relative", colors.cover)}
          style={{ transformOrigin: "50% 100%", transformStyle: "preserve-3d" }}
          animate={isHovered ? { rotateX: -30 } : { rotateX: 0 }}
          transition={{ duration: 0.4, delay: isHovered ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <FolderCoverIcon />
          <Deco sizes={sizes} colors={colors} offset>
            <PadlockIcon />
          </Deco>
        </motion.div>
      </div>
      <Caption label={label} sizes={sizes} colors={colors} />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Text / information variants (popups that show information, not just images)
// ---------------------------------------------------------------------------

const OpenCover = ({ isHovered, colors, sizes, angle = -30, icon }: Omit<FolderBodyProps, "label"> & { angle?: number; icon: React.ReactNode }) => (
  <div className="relative aspect-[20/16] cursor-pointer" style={{ perspective: "800px" }}>
    <div className={cn("absolute inset-0", colors.back)}>
      <FolderBackIcon />
    </div>
    <PaperSheet />
    <motion.div
      className={cn("relative", colors.cover)}
      style={{ transformOrigin: "50% 100%", transformStyle: "preserve-3d" }}
      animate={isHovered ? { rotateX: angle } : { rotateX: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <FolderCoverIcon />
      <Deco sizes={sizes} colors={colors}>
        {icon}
      </Deco>
    </motion.div>
  </div>
);

const DurgaFolder = ({ files, isHovered, colors, sizes, label }: FolderBodyProps & { files: { name: string }[] }) => (
  <div className="relative">
    <motion.div
      className="absolute left-full top-0 z-30 ml-2 min-w-[120px] rounded-lg bg-gray-900 px-3 py-2 shadow-lg"
      initial={{ opacity: 0, x: -10, scale: 0.9 }}
      animate={isHovered ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: -10, scale: 0.9 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{ pointerEvents: "none" }}
    >
      {files.slice(0, 6).map((file, i) => (
        <motion.div
          key={i}
          className="whitespace-nowrap py-0.5 font-mono text-xs text-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.05, delay: i * 0.03 }}
        >
          {file.name}
        </motion.div>
      ))}
    </motion.div>
    <OpenCover isHovered={isHovered} colors={colors} sizes={sizes} icon={<GlobeIcon />} />
    <Caption label={label} sizes={sizes} colors={colors} />
  </div>
);

const NandiFolder = ({ files, isHovered, colors, sizes, label }: FolderBodyProps & { files: { name: string; type?: string }[] }) => {
  const fileColor: Record<string, string> = { txt: "fill-blue-300", gif: "fill-teal-400", mp3: "fill-amber-400", default: "fill-gray-400" };
  return (
    <div className="relative">
      <motion.div
        className="absolute bottom-full left-1/2 z-30 mb-2 grid min-w-[150px] -translate-x-1/2 grid-cols-3 gap-2 rounded-2xl bg-white p-3 shadow-xl"
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={isHovered ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 10 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ pointerEvents: "none" }}
      >
        {files.slice(0, 6).map((file, i) => (
          <div key={i} className="text-center">
            <FileIcon className={cn("mx-auto size-5", fileColor[file.type ?? "default"])} />
            <span className="mt-0.5 block max-w-[48px] truncate text-[9px] text-gray-600">{file.name}</span>
          </div>
        ))}
      </motion.div>
      <OpenCover isHovered={isHovered} colors={colors} sizes={sizes} icon={<CloudIcon />} />
      <Caption label={label} sizes={sizes} colors={colors} />
    </div>
  );
};

/** Pop-up card of labelled rows (e.g. a fee structure) that opens above the folder. */
const InfoFolder = ({ info, isHovered, colors, sizes, label }: FolderBodyProps & { info?: FolderInfo }) => (
  <div className="relative">
    <motion.div
      role="region"
      aria-label={info?.title}
      className="absolute bottom-10 left-1/2 z-30 w-64 -translate-x-1/2 rounded-2xl border border-line bg-card p-4 text-left shadow-[0_18px_44px_-16px_rgba(8,15,40,0.5)]"
      initial={{ opacity: 0, scale: 0.85, y: 12 }}
      animate={isHovered ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.85, y: 12 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{ pointerEvents: "none", visibility: isHovered ? "visible" : "hidden" }}
    >
      {info ? (
        <>
          <p className="font-display text-sm font-bold text-ink">{info.title}</p>
          <ul className="mt-2 space-y-1.5">
            {info.rows.map((row) => (
              <li key={row.label} className="flex items-baseline justify-between gap-3 text-xs">
                <span className="text-ink-muted">{row.label}</span>
                {row.value ? <span className="text-right font-mono font-semibold text-ink">{row.value}</span> : null}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </motion.div>
    <OpenCover isHovered={isHovered} colors={colors} sizes={sizes} angle={-32} icon={<CloudIcon />} />
    <Caption label={label} sizes={sizes} colors={colors} />
  </div>
);

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

export const FolderPreview = React.forwardRef<HTMLDivElement, FolderPreviewProps>(
  ({ variant = "devi", images = [], files = [], info, label, size = "md", className, onClick }, ref) => {
    const [hover, setHover] = React.useState(false);
    const [pinned, setPinned] = React.useState(false);
    const isHovered = hover || pinned;
    const colors = variantColors[variant];
    const sizes = sizeConfig[size];
    const imageList = images;

    const toggle = () => {
      setPinned((p) => !p);
      onClick?.();
    };

    const body = () => {
      const props = { isHovered, colors, sizes, label };
      switch (variant) {
        case "rudras":
          return <RudrasFolder images={imageList} {...props} />;
        case "ardra":
          return <ArdraFolder images={imageList} {...props} />;
        case "shakti":
          return <ShaktiFolder images={imageList} {...props} />;
        case "kubera":
          return <KuberaFolder images={imageList} {...props} />;
        case "hari":
          return <HariFolder images={imageList} {...props} />;
        case "ravi":
          return <RaviFolder images={imageList} {...props} />;
        case "durga":
          return <DurgaFolder files={files} {...props} />;
        case "nandi":
          return <NandiFolder files={files} {...props} />;
        case "info":
          return <InfoFolder info={info} {...props} />;
        default:
          return <DeviFolder images={imageList} {...props} />;
      }
    };

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        aria-label={label}
        aria-expanded={isHovered}
        className={cn("inline-flex flex-col items-center overflow-visible outline-offset-8", sizes.folder, className)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
      >
        {body()}
      </div>
    );
  },
);
FolderPreview.displayName = "FolderPreview";

export default FolderPreview;
