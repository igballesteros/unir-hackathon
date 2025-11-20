// NOTA: Esto es solo un cálculo referencial de montos donados, no asesoría tributaria.

/**
 * Calcula un resumen tributario referencial para un usuario donante.
 * 
 * @param {string} userId - ID del usuario donante
 * @param {Array} donations - Array de todas las donaciones
 * @returns {Object} Resumen tributario con totales y año
 */
export function getTaxSummaryForUser(userId, donations) {
  // Filtrar donaciones del usuario
  const userDonations = donations.filter(donation => donation.donorId === userId);

  // Calcular total donado (suma de todas las donaciones del usuario que ya tienen valor revisado)
  // Solo incluir donaciones con valor asignado (revisadas por experto)
  const totalDonatedUSD = userDonations
    .filter(donation => donation.estimatedValueUSD != null && donation.estimatedValueUSD > 0)
    .reduce((sum, donation) => {
      const value = donation.estimatedValueUSD || 0;
      return sum + value;
    }, 0);

  // Calcular total entregado (suma solo de donaciones con status "entregado" y que ya tienen valor revisado)
  const totalDeliveredUSD = userDonations
    .filter(donation => donation.status === 'entregado' && donation.estimatedValueUSD != null && donation.estimatedValueUSD > 0)
    .reduce((sum, donation) => {
      const value = donation.estimatedValueUSD || 0;
      return sum + value;
    }, 0);

  // Base potencial de deducción (por ahora igual al total donado)
  // NOTA: En la realidad, este cálculo dependería de la ley tributaria vigente
  // y de los límites establecidos por el SRI (Servicio de Rentas Internas de Ecuador).
  // Por ejemplo, podría haber límites porcentuales sobre la renta, límites absolutos,
  // o requisitos específicos sobre el tipo de fundación beneficiaria.
  const potentialDeductionBaseUSD = totalDonatedUSD;

  // Año actual
  const year = new Date().getFullYear();

  return {
    totalDonatedUSD,
    totalDeliveredUSD,
    potentialDeductionBaseUSD,
    year
  };
}

