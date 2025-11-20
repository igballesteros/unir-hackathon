import { useState } from 'react'

function Login({ onLogin }) {
  const handleFoundationClick = () => {
    // Mock: Simular login como fundación
    onLogin('foundation')
  }

  const handleDonorClick = () => {
    // Mock: Simular login como donante
    onLogin('donor')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src="/logo-hackathon.PNG" 
              alt="RopaConSentido Logo" 
              className="h-24 w-auto object-contain"
            />
          </div>

          {/* Slogan */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              RopaConSentido
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              Conectando donaciones con propósito
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Cada prenda tiene una historia, cada donación un impacto
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-8"></div>

          {/* Botones de acción */}
          <div className="space-y-4">
            <button
              onClick={handleFoundationClick}
              className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                />
              </svg>
              Soy Fundación
            </button>

            <button
              onClick={handleDonorClick}
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                />
              </svg>
              Soy Donante
            </button>
          </div>

          {/* Footer info */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">
              Plataforma de donación inteligente
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

