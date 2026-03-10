'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const FORM_SELECTOR = 'form[data-cta-container]'
const MESSAGE_ID = 'supabase-form-message'

function getMessageEl(form) {
  let el = document.getElementById(MESSAGE_ID)
  if (!el) {
    const wrap = document.createElement('div')
    wrap.className = 'md:col-span-2'
    wrap.setAttribute('role', 'status')
    el = document.createElement('p')
    el.id = MESSAGE_ID
    wrap.appendChild(el)
    form.appendChild(wrap)
  }
  return document.getElementById(MESSAGE_ID)
}

function showMessage(form, text) {
  const el = getMessageEl(form)
  el.textContent = text
}

function clearMessage(form) {
  const el = document.getElementById(MESSAGE_ID)
  if (el) el.textContent = ''
}

function getFormData(form) {
  const nombre = (form.querySelector('[name="nombre"]')?.value || '').trim()
  const instagram = (form.querySelector('[name="instagram"]')?.value || '').trim()
  const telefono = (form.querySelector('[name="telefono"]')?.value || '').trim()
  const correo = (form.querySelector('[name="email"]')?.value || '').trim()
  const ciudad = (form.querySelector('[name="ciudad"]')?.value || '').trim()
  const talla = (form.querySelector('[name="talla"]')?.value || '').trim()
  return { nombre, instagram, telefono, correo, ciudad, talla }
}

function clearForm(form) {
  const fields = ['nombre', 'instagram', 'email', 'telefono', 'ciudad', 'talla']
  fields.forEach((name) => {
    const field = form.querySelector(`[name="${name}"]`)
    if (field) field.value = ''
  })
  const tallaSelect = form.querySelector('[name="talla"]')
  if (tallaSelect && tallaSelect.tagName === 'SELECT') tallaSelect.value = ''
}

export function FormSupabaseHandler() {
  useEffect(() => {
    const form = document.querySelector(FORM_SELECTOR)
    if (!form) return

    const handler = async (e) => {
      e.preventDefault()

      const hasErrors = form.querySelector('.validation-error-msg:not(.hidden)')
      if (hasErrors) return

      clearMessage(form)

      const { nombre, instagram, telefono, correo, ciudad, talla } = getFormData(form)

      try {
        const { error } = await supabase.from('registro_drop').insert([
          { nombre, instagram, telefono, correo, ciudad, talla },
        ])

        if (error) {
          const msg = error.message || ''
          if (msg.includes('duplicate') || msg.includes('unique') || msg.includes('already exists')) {
            showMessage(form, 'Este correo ya está registrado.')
          } else if (msg.includes('fetch') || msg.includes('network') || msg.includes('Failed to fetch')) {
            showMessage(form, 'Sin conexión. Revisa tu internet e intenta de nuevo.')
          } else {
            showMessage(form, 'Algo salió mal. Intenta más tarde.')
          }
          return
        }

        showMessage(form, '¡Te registraste exitosamente! Te avisaremos cuando salga el drop.')
        clearForm(form)
      } catch (err) {
        const msg = String(err?.message || err)
        if (msg.includes('fetch') || msg.includes('network') || msg.includes('Failed to fetch')) {
          showMessage(form, 'Sin conexión. Revisa tu internet e intenta de nuevo.')
        } else {
          showMessage(form, 'Hubo un problema al registrarte. Intenta de nuevo.')
        }
      }
    }

    form.addEventListener('submit', handler)
    return () => form.removeEventListener('submit', handler)
  }, [])

  return null
}
