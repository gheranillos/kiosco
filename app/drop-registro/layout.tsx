import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'El Kiosco — Drop',
  description: 'Regístrate para acceso anticipado al próximo drop.',
}

export default function DropRegistroLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
