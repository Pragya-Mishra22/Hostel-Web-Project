"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

export interface GalleryImage {
  src: string;
  alt: string;
}

/**
 * ParallaxGallery — three columns of campus/hostel photos drifting at
 * different speeds as the section scrolls past, adapted from the Skiper30
 * reference pattern. Home page only. Uses real photos from the brief
 * (campus gate, gym, wellness camp) rather than stock art.
 */
export function ParallaxGallery({ images }: { images: GalleryImage[] }) {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -60]);

  const columns: { imgs: GalleryImage[]; y: MotionValue<number> }[] = [
    { imgs: [images[0], images[3]].filter(Boolean), y: y1 },
    { imgs: [images[1], images[4]].filter(Boolean), y: y2 },
    { imgs: [images[2], images[5]].filter(Boolean), y: y3 },
  ];

  return (
    <div ref={sectionRef} className="relative grid grid-cols-3 gap-3 overflow-hidden py-2 md:gap-5">
      {columns.map((col, i) => (
        <motion.div
          key={i}
          style={{ y: col.y }}
          className={i === 1 ? "mt-8 flex flex-col gap-3 md:mt-14 md:gap-5" : "flex flex-col gap-3 md:gap-5"}
        >
          {col.imgs.map((img, j) => (
            <div
              key={img.src + j}
              className="relative aspect-[3/4] w-full overflow-hidden rounded-xl md:rounded-2xl"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 33vw, 20vw"
                className="object-cover"
              />
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  );
}
