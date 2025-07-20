'use client'
import { useState, useEffect } from 'react'

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false)
  const toggleVisibility = () => { window.pageYOffset > 300 ? setIsVisible(true) : setIsVisible(false) }
  const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }) }

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isVisible && (
        <button onClick={scrollToTop} className="bg-corgi-blue text-white p-3 rounded-full shadow-lg hover:bg-blue-700" aria-label="Go to top">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
        </button>
      )}
    </div>
  )
}