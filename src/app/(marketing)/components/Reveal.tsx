"use client"

import React, { useEffect, useRef, useState } from "react"

interface RevealProps {
    children: React.ReactNode
    delay?: number
    className?: string
}

/**
 * Componente que anima la aparición de su contenido al entrar en el viewport.
 * Utiliza Intersection Observer y CSS para máximo rendimiento.
 * 
 * @param props - Propiedades del componente.
 * @param props.children - Contenido a animar.
 * @param props.delay - Retraso en milisegundos.
 * @param props.className - Clases adicionales.
 * @returns Div con animación de revelado.
 */
export function Reveal({ children, delay = 0, className = "" }: RevealProps) {
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.unobserve(entry.target)
                }
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -100px 0px"
            }
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current)
            }
        }
    }, [])

    return (
        <div
            ref={ref}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(30px)",
                transition: `opacity 0.8s ease-out ${delay}ms, transform 0.8s ease-out ${delay}ms`,
            }}
            className={className}
        >
            {children}
        </div>
    )
}
