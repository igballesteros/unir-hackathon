import { useState, useEffect } from 'react'
import axios from 'axios'
import { USERS, DONATIONS } from './mockData'
import { getTaxSummaryForUser } from './taxSummary'
import Login from './Login'

const API_URL = 'http://localhost:3000/api'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [currentUserId, setCurrentUserId] = useState(USERS[0]?.id || '')
  const [currentUser, setCurrentUser] = useState(null)
  const [donations, setDonations] = useState(DONATIONS)

  // Handler para el login mock
  const handleLogin = (role) => {
    setUserRole(role)
    setIsLoggedIn(true)
    // Si es donante, usar el primer usuario donante; si es fundación, el primer usuario fundación
    if (role === 'donor') {
      const donor = USERS.find(u => u.role === 'donor')
      if (donor) setCurrentUserId(donor.id)
    } else if (role === 'foundation') {
      const foundation = USERS.find(u => u.role === 'foundation')
      if (foundation) setCurrentUserId(foundation.id)
    }
  }

  // Actualizar currentUser cuando cambie currentUserId
  useEffect(() => {
    const user = USERS.find(u => u.id === currentUserId)
    setCurrentUser(user || null)
  }, [currentUserId])

  const handleUserChange = (e) => {
    setCurrentUserId(e.target.value)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setError(null)
      setResult(null)
      
      // Crear preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Por favor selecciona una imagen primero')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('image', selectedFile)

      const response = await axios.post(`${API_URL}/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setResult(response.data)
    } catch (err) {
      console.error('Error:', err)
      setError(
        err.response?.data?.error || 
        err.response?.data?.message || 
        'Error al analizar la imagen. Por favor intenta de nuevo.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
  }

  // Handler para regresar al login al hacer clic en el logo
  const handleLogoClick = () => {
    setIsLoggedIn(false)
    setUserRole(null)
    setCurrentUserId('')
    setCurrentUser(null)
    setSelectedFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
  }

  // Función para marcar donación como entregada
  const handleMarkAsDelivered = (donationId) => {
    setDonations(prevDonations =>
      prevDonations.map(donation =>
        donation.id === donationId
          ? { ...donation, status: 'entregado' }
          : donation
      )
    )
  }

  // Obtener donaciones según el rol
  const getDonationsForCurrentUser = () => {
    if (!currentUser) return []
    
    if (currentUser.role === 'donor') {
      return donations.filter(d => d.donorId === currentUser.id)
    } else if (currentUser.role === 'foundation') {
      return donations.filter(d => d.foundationId === currentUser.id)
    } else if (currentUser.role === 'beneficiary') {
      return donations.filter(d => d.beneficiaryName === currentUser.name)
    }
    return []
  }

  // Obtener nombre de fundación por ID
  const getFoundationName = (foundationId) => {
    const foundation = USERS.find(u => u.id === foundationId)
    return foundation ? foundation.name : 'Fundación desconocida'
  }

  // Obtener nombre de donante por ID
  const getDonorName = (donorId) => {
    const donor = USERS.find(u => u.id === donorId)
    return donor ? donor.name : 'Donante desconocido'
  }

  // Obtener texto del estado en español
  const getStatusText = (status) => {
    const statusMap = {
      'pendiente': 'Pendiente',
      'en_camino': 'En camino',
      'entregado': 'Entregado'
    }
    return statusMap[status] || status
  }

  const userDonations = getDonationsForCurrentUser()

  // Calcular resumen tributario para donantes
  const taxSummary = currentUser?.role === 'donor' 
    ? getTaxSummaryForUser(currentUserId, donations)
    : null

  // Calcular resumen de impacto global
  const totalDonations = donations.length
  const totalDelivered = donations.filter(d => d.status === 'entregado').length
  // Solo incluir donaciones con valor revisado por experto
  const globalTotalDonatedUSD = donations
    .filter(donation => donation.estimatedValueUSD != null && donation.estimatedValueUSD > 0)
    .reduce((sum, donation) => {
      const value = donation.estimatedValueUSD || 0
      return sum + value
    }, 0)

  // Si no está logueado, mostrar la página de login
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Top Bar Fija */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo y nombre de la app a la izquierda */}
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleLogoClick}
          >
            <img 
              src="/logo-hackathon.PNG" 
              alt="AMANU Logo" 
              className="h-12 w-auto"
            />
            <div className="flex flex-col">
              <div className="text-2xl font-bold text-gray-800 uppercase">
                AMANU
              </div>
              <div className="text-xs font-light text-gray-600 uppercase">
                Camino de Ayuda
              </div>
            </div>
          </div>
          
          {/* Selector de usuario a la derecha */}
          <div className="flex items-center gap-3">
            <label htmlFor="user-select" className="text-sm text-gray-600 font-medium">
              Usuario:
            </label>
            <select
              id="user-select"
              value={currentUserId}
              onChange={handleUserChange}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
            >
              {USERS.filter((user) => user.role === userRole).map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Contenido principal con padding-top para no quedar oculto detrás de la top bar */}
      <div className="pt-24 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
              Asignación de Ropa a Fundaciones
            </h1>
            <p className="text-center text-gray-600 mb-8">
              {currentUser?.role === 'donor' 
                ? 'Sube una foto de una prenda y la IA la asignará a la fundación adecuada'
                : currentUser?.role === 'foundation'
                ? 'Gestiona las donaciones recibidas por tu fundación'
                : 'Vista de beneficiario - Donaciones entregadas'
              }
            </p>

            {/* Resumen de Impacto Global */}
            <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                Resumen de Impacto
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-indigo-600 mb-1">
                    {totalDonations}
                  </p>
                  <p className="text-sm text-gray-600">
                    Prendas donadas
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-indigo-600 mb-1">
                    {totalDelivered}
                  </p>
                  <p className="text-sm text-gray-600">
                    Prendas entregadas
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-indigo-600 mb-1">
                    Por definir
                  </p>
                  <p className="text-sm text-gray-600">
                    Valor estimado donado (USD)
                  </p>
                </div>
              </div>
            </div>

            {/* ROL: DONOR - Mostrar uploader y donaciones */}
            {currentUser?.role === 'donor' && (
              <>
                {/* Upload Section */}
                <div className="mb-8">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
                    {!preview ? (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <svg
                            className="w-16 h-16 text-gray-400 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <span className="text-gray-600 font-medium">
                            Haz clic para subir una imagen
                          </span>
                          <span className="text-sm text-gray-400 mt-2">
                            PNG, JPG, GIF hasta 5MB
                          </span>
                        </label>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <img
                          src={preview}
                          alt="Preview"
                          className="max-h-64 mx-auto rounded-lg shadow-md"
                        />
                        <div className="flex gap-4 justify-center">
                          <button
                            onClick={handleReset}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                          >
                            Cambiar imagen
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Analyze Button */}
                {preview && !result && (
                  <div className="text-center mb-8">
                    <button
                      onClick={handleAnalyze}
                      disabled={loading}
                      className={`px-8 py-3 rounded-lg font-semibold text-white transition-all ${
                        loading
                          ? 'bg-indigo-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'
                      }`}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="animate-spin h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Analizando...
                        </span>
                      ) : (
                        'Analizar Prenda'
                      )}
                    </button>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800">{error}</p>
                  </div>
                )}

                {/* Results Section */}
                {result && (
                  <div className="mt-8 space-y-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 text-center">
                      Resultado del Análisis
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Detalles de la Prenda */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                          Detalles de la Prenda
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm text-gray-500">Tipo de Prenda:</span>
                            <p className="text-lg font-medium text-gray-800 capitalize">
                              {result.tipoPrenda}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Grupo:</span>
                            <p className="text-lg font-medium text-gray-800 capitalize">
                              {result.grupo}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Estado:</span>
                            <p className="text-lg font-medium text-gray-800 capitalize">
                              {result.estado}
                            </p>
                          </div>
                          {result.climate && (
                            <div>
                              <span className="text-sm text-gray-500">Clima:</span>
                              <p className="text-lg font-medium text-gray-800 capitalize">
                                {result.climate}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Fundación Asignada */}
                      <div className="bg-indigo-50 rounded-lg p-6 border-2 border-indigo-200">
                        <h3 className="text-lg font-semibold text-indigo-700 mb-4">
                          Fundación Sugerida
                        </h3>
                        <div className="space-y-2">
                          <p className="text-2xl font-bold text-indigo-800">
                            {result.fundacion.nombre}
                          </p>
                          {result.fundacion.reason && (
                            <p className="text-sm text-indigo-600">
                              {result.fundacion.reason}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Valor de Donación Pendiente */}
                    <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200 mt-6">
                      <h3 className="text-lg font-semibold text-yellow-700 mb-2">
                        Valor de Donación
                      </h3>
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-yellow-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        <p className="text-base font-medium text-yellow-800">
                          Este valor está pendiente y será revisado por un experto
                        </p>
                      </div>
                      <p className="text-sm text-yellow-700 mt-2">
                        Un experto evaluará la prenda y determinará el valor estimado de la donación.
                      </p>
                    </div>

                    {/* Reset Button */}
                    <div className="text-center pt-4">
                      <button
                        onClick={handleReset}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Analizar Otra Prenda
                      </button>
                    </div>
                  </div>
                )}

                {/* Tarjeta de Beneficio Tributario Referencial */}
                <div className="mt-12 border-t pt-8">
                  <div className="bg-green-50 rounded-lg p-6 border border-green-200 mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                      Beneficio tributario referencial
                    </h2>
                    <div className="space-y-3 text-gray-700">
                      <p className="text-base">
                        <span className="font-medium">Total donado (estimado):</span>{' '}
                        Por definir
                      </p>
                      <p className="text-base">
                        <span className="font-medium">Total ya entregado:</span>{' '}
                        Por definir
                      </p>
                      <p className="text-base">
                        <span className="font-medium">Base referencial para deducción de impuestos:</span>{' '}
                        Por definir
                      </p>
                      <p className="text-xs text-gray-600 mt-4 pt-4 border-t border-green-200">
                        Este monto es solo referencial. En Ecuador, ciertas donaciones a entidades calificadas pueden servir para reducir la base imponible del Impuesto a la Renta, sujeto a límites y requisitos del SRI. Consulta con tu contador o con el SRI para el cálculo real.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sección: Tus donaciones */}
                <div className="mt-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Tus donaciones
                  </h2>
                  {userDonations.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      Aún no has realizado donaciones
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {userDonations.map((donation) => (
                        <div
                          key={donation.id}
                          className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="text-lg font-semibold text-gray-800 mb-2">
                                {donation.itemDescription}
                              </p>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p>
                                  <span className="font-medium">Fundación:</span>{' '}
                                  {getFoundationName(donation.foundationId)}
                                </p>
                                <p>
                                  <span className="font-medium">Estado:</span>{' '}
                                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                    donation.status === 'entregado'
                                      ? 'bg-green-100 text-green-800'
                                      : donation.status === 'en_camino'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {getStatusText(donation.status)}
                                  </span>
                                </p>
                                <p>
                                  <span className="font-medium">Valor de donación:</span>{' '}
                                  {donation.estimatedValueUSD ? (
                                    <span className="text-green-700 font-semibold">
                                      ${donation.estimatedValueUSD.toFixed(2)} USD
                                    </span>
                                  ) : (
                                    <span className="text-yellow-700 italic">
                                      Pendiente de revisión por un experto
                                    </span>
                                  )}
                                </p>
                                {donation.beneficiaryName && (
                                  <p>
                                    <span className="font-medium">Beneficiario:</span>{' '}
                                    {donation.beneficiaryName}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ROL: FOUNDATION - Solo mostrar donaciones */}
            {currentUser?.role === 'foundation' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Donaciones para tu fundación
                </h2>
                {userDonations.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Tu fundación aún no ha recibido donaciones
                  </p>
                ) : (
                  <div className="space-y-4">
                    {userDonations.map((donation) => (
                      <div
                        key={donation.id}
                        className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-lg font-semibold text-gray-800 mb-2">
                              {donation.itemDescription}
                            </p>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p>
                                <span className="font-medium">Donante:</span>{' '}
                                {getDonorName(donation.donorId)}
                              </p>
                              <p>
                                <span className="font-medium">Estado:</span>{' '}
                                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                  donation.status === 'entregado'
                                    ? 'bg-green-100 text-green-800'
                                    : donation.status === 'en_camino'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {getStatusText(donation.status)}
                                </span>
                              </p>
                              <p>
                                <span className="font-medium">Valor de donación:</span>{' '}
                                {donation.estimatedValueUSD ? (
                                  <span className="text-green-700 font-semibold">
                                    ${donation.estimatedValueUSD.toFixed(2)} USD
                                  </span>
                                ) : (
                                  <span className="text-yellow-700 italic">
                                    Pendiente de revisión por un experto
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          {(donation.status === 'pendiente' || donation.status === 'en_camino') && (
                            <button
                              onClick={() => handleMarkAsDelivered(donation.id)}
                              className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium whitespace-nowrap"
                            >
                              Marcar como entregado
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ROL: BENEFICIARY - Vista de beneficiario */}
            {currentUser?.role === 'beneficiary' && (
              <div>
                <div className="bg-indigo-50 rounded-lg p-6 mb-8 border border-indigo-200">
                  <p className="text-lg text-gray-700">
                    Vista de ejemplo del beneficiario {currentUser.name}.
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Esta vista permitiría a las comunidades ver qué donaciones se han entregado.
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Donaciones recibidas
                </h2>
                {userDonations.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Aún no has recibido donaciones
                  </p>
                ) : (
                  <div className="space-y-4">
                    {userDonations.map((donation) => (
                      <div
                        key={donation.id}
                        className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                      >
                        <p className="text-lg font-semibold text-gray-800 mb-2">
                          {donation.itemDescription}
                        </p>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>
                            <span className="font-medium">Fundación:</span>{' '}
                            {getFoundationName(donation.foundationId)}
                          </p>
                          <p>
                            <span className="font-medium">Donante:</span>{' '}
                            {getDonorName(donation.donorId)}
                          </p>
                          <p>
                            <span className="font-medium">Estado:</span>{' '}
                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                              donation.status === 'entregado'
                                ? 'bg-green-100 text-green-800'
                                : donation.status === 'en_camino'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {getStatusText(donation.status)}
                            </span>
                          </p>
                          <p>
                            <span className="font-medium">Valor de donación:</span>{' '}
                            {donation.estimatedValueUSD ? (
                              <span className="text-green-700 font-semibold">
                                ${donation.estimatedValueUSD.toFixed(2)} USD
                              </span>
                            ) : (
                              <span className="text-yellow-700 italic">
                                Pendiente de revisión por un experto
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

