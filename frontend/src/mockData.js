// Datos mock para simular usuarios y donaciones
// Sin autenticación real ni base de datos - solo datos en memoria

// Lista de usuarios
export const USERS = [
  {
    id: 'ana_donor',
    name: 'Ana',
    role: 'donor'
  },
  {
    id: 'carlos_donor',
    name: 'Carlos',
    role: 'donor'
  },
  {
    id: 'costa_viva',
    name: 'Fundación Costa Viva',
    role: 'foundation'
  },
  {
    id: 'abrigo_andino',
    name: 'Fundación Abrigo Andino',
    role: 'foundation'
  },
  {
    id: 'lucia_beneficiary',
    name: 'Lucía',
    role: 'beneficiary'
  }
];

// Lista de donaciones
export const DONATIONS = [
  {
    id: 'don_001',
    donorId: 'ana_donor',
    foundationId: 'costa_viva',
    itemDescription: 'Camiseta de algodón azul para niño',
    type: 'camiseta',
    group: 'niño',
    condition: 'bueno',
    status: 'entregado',
    beneficiaryName: 'Juan'
  },
  {
    id: 'don_002',
    donorId: 'carlos_donor',
    foundationId: 'abrigo_andino',
    itemDescription: 'Abrigo de lana para adulto',
    type: 'abrigo',
    group: 'adulto',
    condition: 'muy usado',
    status: 'pendiente',
    beneficiaryName: null
  },
  {
    id: 'don_003',
    donorId: 'ana_donor',
    foundationId: 'costa_viva',
    itemDescription: 'Pantalón corto para niña',
    type: 'pantalón',
    group: 'niño',
    condition: 'bueno',
    status: 'en_camino',
    beneficiaryName: 'María'
  }
];

// Funciones auxiliares para facilitar el acceso a los datos
export const getUserById = (id) => {
  return USERS.find(user => user.id === id);
};

export const getDonationsByDonor = (donorId) => {
  return DONATIONS.filter(donation => donation.donorId === donorId);
};

export const getDonationsByFoundation = (foundationId) => {
  return DONATIONS.filter(donation => donation.foundationId === foundationId);
};

export const getDonationsByStatus = (status) => {
  return DONATIONS.filter(donation => donation.status === status);
};

export const getDonors = () => {
  return USERS.filter(user => user.role === 'donor');
};

export const getFoundations = () => {
  return USERS.filter(user => user.role === 'foundation');
};

export const getBeneficiaries = () => {
  return USERS.filter(user => user.role === 'beneficiary');
};

