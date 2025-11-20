"use client";

import { useState } from "react";
import type { GUTValues } from "./GUTModal";

export function useGUTModal() {
  const [open, setOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [values, setValues] = useState<GUTValues>({ g:1, u:1, t:1 });

  function openModal(title: string, initial: GUTValues) {
    setTaskTitle(title);
    setValues(initial);
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  return {
    open,
    values,
    taskTitle,
    setValues,
    openModal,
    closeModal,
  };
}