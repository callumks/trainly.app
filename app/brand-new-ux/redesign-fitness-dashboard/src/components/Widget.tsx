"use client";
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function Widget({ id, children, isEditMode, onRemove, isPinned, className }: any) {
  return (
    <motion.div layout className={className}>
      {children}
    </motion.div>
  )
}
