// src/hooks/useKanbanDragDrop.ts
"use client";

import { useState } from "react";
import {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { useKanban } from "@/context/KanbanContext";

export const useKanbanDragDrop = () => {
  const { board, reorderLists, moveCard } = useKanban();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragStart = (e: DragStartEvent) => {
    setActiveId(e.active.id as string);
  };

  const handleDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const fromList = board.lists.find((l) =>
      l.cards?.some((c) => c.id === activeId)
    );
    const toList = board.lists.find(
      (l) => l.id === overId || l.cards?.some((c) => c.id === overId)
    );

    if (!fromList || !toList || fromList.id === toList.id) return;

    const fromIndex = fromList.cards?.findIndex((c) => c.id === activeId) ?? -1;
    const toIndex =
      toList.cards?.findIndex((c) => c.id === overId) ??
      toList.cards?.length ??
      0;

    if (fromIndex > -1) {
      moveCard(fromList.id, toList.id, fromIndex, toIndex);
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Reordering lists
    const draggingList = board.lists.some((l) => l.id === activeId);
    if (draggingList) {
      const oldIdx = board.lists.findIndex((l) => l.id === activeId);
      const newIdx = board.lists.findIndex((l) => l.id === overId);
      if (oldIdx !== -1 && newIdx !== -1 && oldIdx !== newIdx) {
        reorderLists(oldIdx, newIdx);
      }
      return;
    }

    // Moving cards
    const src = board.lists.find((l) =>
      l.cards?.some((c) => c.id === activeId)
    );
    const dst = board.lists.find(
      (l) => l.id === overId || l.cards?.some((c) => c.id === overId)
    );

    if (!src || !dst) return;

    const srcIdx = src.cards?.findIndex((c) => c.id === activeId) ?? -1;
    const dstIdx =
      dst.cards?.findIndex((c) => c.id === overId) ?? dst.cards?.length ?? 0;

    if (srcIdx > -1) {
      moveCard(src.id, dst.id, srcIdx, dstIdx);
    }
  };

  return {
    sensors,
    activeId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};
