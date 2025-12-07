'use client'

import { useEffect } from 'react'

/**
 * Chatbot component that loads the custom Kongunad Hospital chatbot script
 * 
 * The chatbot script is hosted at:
 * https://kongunadhospitalassets.s3.amazonaws.com/js/chatbot_kgn.js
 * 
 * This component loads the script only once when mounted.
 */
export const Chatbot: React.FC = () => {
  useEffect(() => {
    // Check if script is already loaded
    const existingScript = document.querySelector('script[src*="chatbot_kgn.js"]')
    if (existingScript) {
      return
    }

    // Create and append the chatbot script
    const script = document.createElement('script')
    script.src = 'https://kongunadhospitalassets.s3.amazonaws.com/js/chatbot_kgn.js'
    script.async = true
    script.defer = true

    // Handle script load errors gracefully
    script.onerror = () => {
      console.error('Failed to load chatbot script')
    }

    document.body.appendChild(script)

    // Cleanup function (though script will remain in DOM)
    return () => {
      // Note: We don't remove the script as it may be needed by the chatbot widget
      // The script will remain in the DOM but won't cause issues
    }
  }, [])

  return null
}

