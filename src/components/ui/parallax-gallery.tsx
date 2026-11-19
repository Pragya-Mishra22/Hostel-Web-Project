"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

export interface GalleryImage {
  src: string;
  alt: string;
}

/**
 * ParallaxGallery: four columns of photos that drift at different speeds as the
 * section scrolls past (the Skiper "Parallax 002" pattern). Smooth scrolling is
 * provided by the page-level Lenis wrapper, so this only reads scroll progress.
 */
export function ParallaxGallery({ images }: { images: GalleryImage[] }) {
  const gallery = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ["start end", "end start"],
  });

  // Distances in viewport heights, so no window measuring is needed.
  const y1 = useTransform(scrollYProgress, [0, 1], ["0vh", "200vh"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0vh", "330vh"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["0vh", "125vh"]);
  const y4 = useTransform(scrollYProgress, [0, 1], ["0vh", "300vh"]);

  const pick = (indexes: number[]) => indexes.map((i) => images[i % images.length]);

  return (
    <div
      ref={gallery}
      className="relative box-border flex h-[175vh] w-full gap-[2vw] overflow-hidden bg-surface-muted p-[2vw]"
    >
      <Column images={pick([0, 1, 2])} y={y1} />
      <Column images={pick([3, 4, 5])} y={y2} />
      <Column images={pick([2, 0, 4])} y={y3} />
      <Column images={pick([5, 3, 1])} y={y4} />
    </div>
  );
}

function Column({ images, y }: { images: GalleryImage[]; y: MotionValue<string> }) {
  return (
    <motion.div
      className="relative -top-[45%] flex h-full w-1/4 min-w-[180px] flex-col gap-[2vw] first:top-[-45%] [&:nth-child(2)]:top-[-95%] [&:nth-child(3)]:top-[-45%] [&:nth-child(4)]:top-[-75%]"
      style={{ y }}
    >
      {images.map((img, i) => (
        <div key={`${img.src}-${i}`} className="relative h-full w-full overflow-hidden rounded-2xl">
          <Image src={img.src} alt={img.alt} fill sizes="(max-width: 768px) 50vw, 25vw" className="pointer-events-none object-cover" />
        </div>
      ))}
    </motion.div>
  );
}
