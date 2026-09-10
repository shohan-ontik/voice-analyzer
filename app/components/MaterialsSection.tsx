"use client";

import { useState } from "react";
import { MaterialRow } from "./MaterialRow";
import { MaterialViewerModal } from "./MaterialViewerModal";
import type { LearningMaterial } from "../lib/types";

export function MaterialsSection({
  materials,
  chapterHeadline,
  roleplayHref,
  onMarkComplete,
}: {
  materials: LearningMaterial[];
  chapterHeadline: string;
  roleplayHref: string;
  onMarkComplete: (materialId: string) => void;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const openMaterial = materials.find((m) => m.id === openId) ?? null;

  return (
    <>
      <div className="flex flex-col gap-3">
        {materials.map((material) => (
          <MaterialRow
            key={material.id}
            material={material}
            completed={material.completedAt !== null}
            onOpen={() => setOpenId(material.id)}
          />
        ))}
      </div>

      {openMaterial && (
        <MaterialViewerModal
          material={openMaterial}
          chapterHeadline={chapterHeadline}
          roleplayHref={roleplayHref}
          completed={openMaterial.completedAt !== null}
          onMarkComplete={() => onMarkComplete(openMaterial.id)}
          onClose={() => setOpenId(null)}
        />
      )}
    </>
  );
}
