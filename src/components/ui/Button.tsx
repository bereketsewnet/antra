import { motion } from 'framer-motion'
import { type ReactNode } from 'react'
import styles from './Button.module.css'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'ghost'
  href?: string
  onClick?: () => void
  as?: 'button' | 'a'
}

export function Button({
  children,
  variant = 'primary',
  href,
  onClick,
  as: Tag = href ? 'a' : 'button',
}: ButtonProps) {
  return (
    <motion.div
      className={`${styles.btn} ${styles[variant]}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <Tag href={href} onClick={onClick} className={styles.inner}>
        {children}
      </Tag>
    </motion.div>
  )
}
