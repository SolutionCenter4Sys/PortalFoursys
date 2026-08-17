"use client";

import { useContext } from "react";

import { ToastContext, type ToastApi } from "@/components/ui/Toast";

/**
 * Uso:
 *   const { toast } = useToast();
 *   toast.success("Configuração salva");
 *   toast.error("Falha ao conectar");
 */
export function useToast(): { toast: ToastApi } {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast deve ser usado dentro de <ToastProvider>");
  }
  return { toast: ctx };
}
