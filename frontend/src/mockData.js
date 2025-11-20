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
    id: 'maria_donor',
    name: 'María',
    role: 'donor'
  },
  {
    id: 'luis_donor',
    name: 'Luis',
    role: 'donor'
  },
  {
    id: 'patricia_donor',
    name: 'Patricia',
    role: 'donor'
  },
  {
    id: 'fundacion-di',
    name: 'FUNDACIÓN DI',
    role: 'foundation'
  },
  {
    id: 'fundacion-gf',
    name: 'FUNDACIÓN GF',
    role: 'foundation'
  },
  {
    id: 'fundacion-to',
    name: 'FUNDACION TO',
    role: 'foundation'
  },
  {
    id: 'fundacion-pa',
    name: 'FUNDACIÓN PA',
    role: 'foundation'
  },
  {
    id: 'fundacion-ri',
    name: 'FUNDACIÓN RI',
    role: 'foundation'
  },
  {
    id: 'fundacion-ni',
    name: 'FUNDACIÓN NI',
    role: 'foundation'
  },
  {
    id: 'fundacion-ca',
    name: 'FUNDACION CA',
    role: 'foundation'
  },
  {
    id: 'fundacion-an',
    name: 'FUNDACIÓN AN',
    role: 'foundation'
  },
  {
    id: 'fundacion-do',
    name: 'FUNDACIÓN DO',
    role: 'foundation'
  },
  {
    id: 'fundacion-de',
    name: 'FUNDACION DE',
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
  // Donaciones de Ana
  {
    id: 'don_001',
    donorId: 'ana_donor',
    foundationId: 'fundacion-di',
    itemDescription: 'Camiseta de algodón azul para niño',
    type: 'camiseta',
    group: 'niño',
    condition: 'bueno',
    status: 'entregado',
    beneficiaryName: 'Juan',
    estimatedValueUSD: 10.00
  },
  {
    id: 'don_003',
    donorId: 'ana_donor',
    foundationId: 'fundacion-di',
    itemDescription: 'Pantalón corto para niña',
    type: 'pantalón',
    group: 'niño',
    condition: 'bueno',
    status: 'en_camino',
    beneficiaryName: 'María',
    estimatedValueUSD: 15.00
  },
  {
    id: 'don_004',
    donorId: 'ana_donor',
    foundationId: 'fundacion-di',
    itemDescription: 'Chaqueta deportiva para niño',
    type: 'chaqueta',
    group: 'niño',
    condition: 'excelente',
    status: 'entregado',
    beneficiaryName: 'Pedro',
    estimatedValueUSD: 28.00
  },
  {
    id: 'don_005',
    donorId: 'ana_donor',
    foundationId: 'fundacion-di',
    itemDescription: 'Zapatos deportivos para niña',
    type: 'zapatos',
    group: 'niño',
    condition: 'bueno',
    status: 'pendiente',
    beneficiaryName: null,
    estimatedValueUSD: null  // Pendiente de revisión por experto
  },
  {
    id: 'don_006',
    donorId: 'ana_donor',
    foundationId: 'fundacion-di',
    itemDescription: 'Gorro de lana para niño',
    type: 'gorro',
    group: 'niño',
    condition: 'bueno',
    status: 'entregado',
    beneficiaryName: 'Luis',
    estimatedValueUSD: 8.00
  },
  {
    id: 'don_007',
    donorId: 'ana_donor',
    foundationId: 'fundacion-di',
    itemDescription: 'Bufanda de lana para niña',
    type: 'bufanda',
    group: 'niño',
    condition: 'excelente',
    status: 'en_camino',
    beneficiaryName: 'Sofía',
    estimatedValueUSD: 12.00
  },
  {
    id: 'don_008',
    donorId: 'ana_donor',
    foundationId: 'fundacion-di',
    itemDescription: 'Pantalón largo para niño',
    type: 'pantalón',
    group: 'niño',
    condition: 'bueno',
    status: 'pendiente',
    beneficiaryName: null,
    estimatedValueUSD: null  // Pendiente de revisión por experto
  },
  // Donaciones de Carlos
  {
    id: 'don_002',
    donorId: 'carlos_donor',
    foundationId: 'fundacion-pa',
    itemDescription: 'Abrigo de lana para adulto',
    type: 'abrigo',
    group: 'adulto',
    condition: 'muy usado',
    status: 'pendiente',
    beneficiaryName: null,
    estimatedValueUSD: null  // Pendiente de revisión por experto
  },
  {
    id: 'don_009',
    donorId: 'carlos_donor',
    foundationId: 'fundacion-pa',
    itemDescription: 'Chaqueta impermeable para adulto',
    type: 'chaqueta',
    group: 'adulto',
    condition: 'bueno',
    status: 'entregado',
    beneficiaryName: 'Roberto',
    estimatedValueUSD: 35.00
  },
  {
    id: 'don_010',
    donorId: 'carlos_donor',
    foundationId: 'fundacion-pa',
    itemDescription: 'Pantalón de mezclilla para adulto',
    type: 'pantalón',
    group: 'adulto',
    condition: 'bueno',
    status: 'entregado',
    beneficiaryName: 'Miguel',
    estimatedValueUSD: 22.00
  },
  {
    id: 'don_011',
    donorId: 'carlos_donor',
    foundationId: 'fundacion-pa',
    itemDescription: 'Camiseta de algodón para adulto',
    type: 'camiseta',
    group: 'adulto',
    condition: 'excelente',
    status: 'en_camino',
    beneficiaryName: 'Carlos',
    estimatedValueUSD: 14.00
  },
  {
    id: 'don_012',
    donorId: 'carlos_donor',
    foundationId: 'fundacion-pa',
    itemDescription: 'Zapatos de cuero para adulto',
    type: 'zapatos',
    group: 'adulto',
    condition: 'bueno',
    status: 'pendiente',
    beneficiaryName: null,
    estimatedValueUSD: null  // Pendiente de revisión por experto
  },
  {
    id: 'don_013',
    donorId: 'carlos_donor',
    foundationId: 'fundacion-pa',
    itemDescription: 'Abrigo de plumas para adulto',
    type: 'abrigo',
    group: 'adulto',
    condition: 'bueno',
    status: 'entregado',
    beneficiaryName: 'Fernando',
    estimatedValueUSD: 45.00
  },
  {
    id: 'don_014',
    donorId: 'carlos_donor',
    foundationId: 'fundacion-pa',
    itemDescription: 'Gorro de lana para adulto',
    type: 'gorro',
    group: 'adulto',
    condition: 'bueno',
    status: 'en_camino',
    beneficiaryName: 'Jorge',
    estimatedValueUSD: 10.00
  },
  {
    id: 'don_015',
    donorId: 'carlos_donor',
    foundationId: 'fundacion-pa',
    itemDescription: 'Pantalón de invierno para adulto',
    type: 'pantalón',
    group: 'adulto',
    condition: 'excelente',
    status: 'pendiente',
    beneficiaryName: null,
    estimatedValueUSD: null  // Pendiente de revisión por experto
  },
  // Donaciones de María
  {
    id: 'don_016',
    donorId: 'maria_donor',
    foundationId: 'fundacion-gf',
    itemDescription: 'Camiseta manga corta para niño',
    type: 'camiseta',
    group: 'niño',
    condition: 'bueno',
    status: 'entregado',
    beneficiaryName: 'Diego',
    estimatedValueUSD: 8.00
  },
  {
    id: 'don_017',
    donorId: 'maria_donor',
    foundationId: 'fundacion-gf',
    itemDescription: 'Shorts deportivos para niña',
    type: 'pantalón',
    group: 'niño',
    condition: 'excelente',
    status: 'en_camino',
    beneficiaryName: 'Valentina',
    estimatedValueUSD: 12.00
  },
  {
    id: 'don_018',
    donorId: 'maria_donor',
    foundationId: 'fundacion-gf',
    itemDescription: 'Vestido ligero para niña',
    type: 'vestido',
    group: 'niño',
    condition: 'bueno',
    status: 'entregado',
    beneficiaryName: 'Isabella',
    estimatedValueUSD: 18.00
  },
  {
    id: 'don_019',
    donorId: 'maria_donor',
    foundationId: 'fundacion-to',
    itemDescription: 'Camiseta de algodón para adulto',
    type: 'camiseta',
    group: 'adulto',
    condition: 'bueno',
    status: 'entregado',
    beneficiaryName: 'Roberto',
    estimatedValueUSD: 12.00
  },
  {
    id: 'don_020',
    donorId: 'maria_donor',
    foundationId: 'fundacion-to',
    itemDescription: 'Pantalón corto para niño',
    type: 'pantalón',
    group: 'niño',
    condition: 'bueno',
    status: 'en_camino',
    beneficiaryName: 'Sebastián',
    estimatedValueUSD: 14.00
  },
  {
    id: 'don_021',
    donorId: 'maria_donor',
    foundationId: 'fundacion-to',
    itemDescription: 'Sandalias para niña',
    type: 'zapatos',
    group: 'niño',
    condition: 'bueno',
    status: 'pendiente',
    beneficiaryName: null,
    estimatedValueUSD: null
  },
  // Donaciones de Luis
  {
    id: 'don_022',
    donorId: 'luis_donor',
    foundationId: 'fundacion-ri',
    itemDescription: 'Abrigo de lana para adulto',
    type: 'abrigo',
    group: 'adulto',
    condition: 'bueno',
    status: 'entregado',
    beneficiaryName: 'Andrés',
    estimatedValueUSD: 40.00
  },
  {
    id: 'don_023',
    donorId: 'luis_donor',
    foundationId: 'fundacion-ri',
    itemDescription: 'Chaqueta de invierno para niño',
    type: 'chaqueta',
    group: 'niño',
    condition: 'excelente',
    status: 'en_camino',
    beneficiaryName: 'Mateo',
    estimatedValueUSD: 25.00
  },
  {
    id: 'don_024',
    donorId: 'luis_donor',
    foundationId: 'fundacion-ri',
    itemDescription: 'Gorro de lana para adulto',
    type: 'gorro',
    group: 'adulto',
    condition: 'bueno',
    status: 'entregado',
    beneficiaryName: 'José',
    estimatedValueUSD: 10.00
  },
  {
    id: 'don_025',
    donorId: 'luis_donor',
    foundationId: 'fundacion-ni',
    itemDescription: 'Suéter de lana para niño',
    type: 'suéter',
    group: 'niño',
    condition: 'bueno',
    status: 'entregado',
    beneficiaryName: 'Daniel',
    estimatedValueUSD: 20.00
  },
  {
    id: 'don_026',
    donorId: 'luis_donor',
    foundationId: 'fundacion-ni',
    itemDescription: 'Bufanda de lana para adulto',
    type: 'bufanda',
    group: 'adulto',
    condition: 'excelente',
    status: 'en_camino',
    beneficiaryName: 'Francisco',
    estimatedValueUSD: 12.00
  },
  {
    id: 'don_027',
    donorId: 'luis_donor',
    foundationId: 'fundacion-ni',
    itemDescription: 'Pantalón de invierno para niño',
    type: 'pantalón',
    group: 'niño',
    condition: 'bueno',
    status: 'pendiente',
    beneficiaryName: null,
    estimatedValueUSD: null
  },
  // Donaciones de Patricia
  {
    id: 'don_028',
    donorId: 'patricia_donor',
    foundationId: 'fundacion-ca',
    itemDescription: 'Chaqueta impermeable para adulto',
    type: 'chaqueta',
    group: 'adulto',
    condition: 'bueno',
    status: 'entregado',
    beneficiaryName: 'Carmen',
    estimatedValueUSD: 32.00
  },
  {
    id: 'don_029',
    donorId: 'patricia_donor',
    foundationId: 'fundacion-ca',
    itemDescription: 'Abrigo para niña',
    type: 'abrigo',
    group: 'niño',
    condition: 'excelente',
    status: 'en_camino',
    beneficiaryName: 'Sofía',
    estimatedValueUSD: 35.00
  },
  {
    id: 'don_030',
    donorId: 'patricia_donor',
    foundationId: 'fundacion-ca',
    itemDescription: 'Zapatos de cuero para adulto',
    type: 'zapatos',
    group: 'adulto',
    condition: 'bueno',
    status: 'pendiente',
    beneficiaryName: null,
    estimatedValueUSD: null
  },
  {
    id: 'don_031',
    donorId: 'patricia_donor',
    foundationId: 'fundacion-an',
    itemDescription: 'Camiseta de algodón para niño',
    type: 'camiseta',
    group: 'niño',
    condition: 'bueno',
    status: 'entregado',
    beneficiaryName: 'Alejandro',
    estimatedValueUSD: 9.00
  },
  {
    id: 'don_032',
    donorId: 'patricia_donor',
    foundationId: 'fundacion-an',
    itemDescription: 'Pantalón de mezclilla para adulto',
    type: 'pantalón',
    group: 'adulto',
    condition: 'bueno',
    status: 'entregado',
    beneficiaryName: 'Ricardo',
    estimatedValueUSD: 20.00
  },
  {
    id: 'don_033',
    donorId: 'patricia_donor',
    foundationId: 'fundacion-an',
    itemDescription: 'Vestido para niña',
    type: 'vestido',
    group: 'niño',
    condition: 'excelente',
    status: 'en_camino',
    beneficiaryName: 'Camila',
    estimatedValueUSD: 22.00
  },
  {
    id: 'don_034',
    donorId: 'ana_donor',
    foundationId: 'fundacion-do',
    itemDescription: 'Abrigo de plumas para adulto',
    type: 'abrigo',
    group: 'adulto',
    condition: 'bueno',
    status: 'entregado',
    beneficiaryName: 'Eduardo',
    estimatedValueUSD: 48.00
  },
  {
    id: 'don_035',
    donorId: 'ana_donor',
    foundationId: 'fundacion-do',
    itemDescription: 'Gorro de lana para niño',
    type: 'gorro',
    group: 'niño',
    condition: 'bueno',
    status: 'en_camino',
    beneficiaryName: 'Nicolás',
    estimatedValueUSD: 8.00
  },
  {
    id: 'don_036',
    donorId: 'ana_donor',
    foundationId: 'fundacion-do',
    itemDescription: 'Chaqueta para niña',
    type: 'chaqueta',
    group: 'niño',
    condition: 'excelente',
    status: 'pendiente',
    beneficiaryName: null,
    estimatedValueUSD: null
  },
  {
    id: 'don_037',
    donorId: 'carlos_donor',
    foundationId: 'fundacion-de',
    itemDescription: 'Camiseta manga corta para adulto',
    type: 'camiseta',
    group: 'adulto',
    condition: 'bueno',
    status: 'entregado',
    beneficiaryName: 'Mario',
    estimatedValueUSD: 11.00
  },
  {
    id: 'don_038',
    donorId: 'carlos_donor',
    foundationId: 'fundacion-de',
    itemDescription: 'Pantalón corto para niño',
    type: 'pantalón',
    group: 'niño',
    condition: 'bueno',
    status: 'entregado',
    beneficiaryName: 'Gabriel',
    estimatedValueUSD: 13.00
  },
  {
    id: 'don_039',
    donorId: 'carlos_donor',
    foundationId: 'fundacion-de',
    itemDescription: 'Zapatos deportivos para adulto',
    type: 'zapatos',
    group: 'adulto',
    condition: 'excelente',
    status: 'en_camino',
    beneficiaryName: 'Héctor',
    estimatedValueUSD: 30.00
  },
  {
    id: 'don_040',
    donorId: 'maria_donor',
    foundationId: 'fundacion-de',
    itemDescription: 'Vestido ligero para niña',
    type: 'vestido',
    group: 'niño',
    condition: 'bueno',
    status: 'pendiente',
    beneficiaryName: null,
    estimatedValueUSD: null
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

