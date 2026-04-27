export interface Province {
  id: string;
  name: string;
  cities: string[];
  workZones: string[];
}

export const ARGENTINA_PROVINCES: Province[] = [
  {
    id: 'caba',
    name: 'Ciudad Autónoma de Buenos Aires',
    cities: ['Palermo', 'Recoleta', 'Belgrano', 'Caballito', 'Almagro', 'Balvanera', 'San Telmo', 'La Boca', 'Flores', 'Villa Crespo', 'Colegiales', 'Nuñez', 'Saavedra', 'Devoto', 'Mataderos', 'Liniers', 'Floresta', 'Paternal', 'Villa Urquiza', 'Coghlan', 'Chacarita', 'Parque Chas', 'Agronomía', 'Villa del Parque', 'Villa Real', 'Monte Castro', 'Villa Luro', 'Versalles', 'San Cristóbal', 'Constitución', 'Barracas', 'Pompeya', 'La Paternal', 'Villa General Mitre', 'Villa Santa Rita', 'Villa Soldati', 'Villa Riachuelo', 'Puerto Madero', 'Retiro', 'Monserrat', 'San Nicolás', 'Tribunales', 'Microcentro', 'Once', 'Abasto', 'Barrio Norte'],
    workZones: ['CABA'],
  },
  {
    id: 'buenos_aires',
    name: 'Buenos Aires (GBA)',
    cities: ['La Plata', 'Mar del Plata', 'Bahía Blanca', 'Tandil', 'Zárate', 'Campana', 'Luján', 'Junín', 'Pergamino', 'Trenque Lauquen', 'Chivilcoy', 'Dolores', 'Azul', 'Olavarría', 'Necochea', 'Miramar', 'Pinamar', 'Villa Gesell', 'Cariló', 'Mar de Ajó', 'San Clemente del Tuyú', 'Lomas de Zamora', 'Lanús', 'Avellaneda', 'Quilmes', 'Berazategui', 'Florencio Varela', 'Esteban Echeverría', 'Ezeiza', 'Pilar', 'Escobar', 'Moreno', 'José C. Paz', 'San Martín', 'Tres de Febrero', 'Vicente López', 'San Isidro', 'Tigre', 'Malvinas Argentinas', 'San Fernando', 'Almirante Brown', 'Merlo', 'Morón', 'Hurlingham', 'Ituzaingó', 'General Rodríguez', 'Navarro', 'Cañuelas', 'Brandsen', 'Magdalena', 'Chascomús', 'Florencio Varela'],
    workZones: ['Zona Norte', 'Zona Sur', 'Zona Oeste'],
  },
  {
    id: 'catamarca',
    name: 'Catamarca',
    cities: ['San Fernando del Valle de Catamarca', 'Andalgalá', 'Belén', 'Santa María', 'Tinogasta', 'Recreo', 'La Puerta', 'Fiambalá', 'Ancasti', 'Antofagasta de la Sierra'],
    workZones: [],
  },
  {
    id: 'chaco',
    name: 'Chaco',
    cities: ['Resistencia', 'Presidencia Roque Sáenz Peña', 'Barranqueras', 'Villa Ángela', 'Castelli', 'General José de San Martín', 'Quitilipi', 'Fontana', 'Charata', 'Machagai', 'Colonias Unidas', 'Napenay'],
    workZones: [],
  },
  {
    id: 'chubut',
    name: 'Chubut',
    cities: ['Rawson', 'Comodoro Rivadavia', 'Puerto Madryn', 'Trelew', 'Esquel', 'El Calafate', 'Dolavon', 'Gaiman', 'Trevelin', 'Lago Puelo', 'El Hoyo', 'Epuyén', 'Cushamen'],
    workZones: [],
  },
  {
    id: 'cordoba',
    name: 'Córdoba',
    cities: ['Córdoba', 'Río Cuarto', 'Villa María', 'San Francisco', 'Río Tercero', 'Carlos Paz', 'Villa Carlos Paz', 'La Falda', 'Cosquín', 'Unquillo', 'Salsipuedes', 'Mendiolaza', 'Jesús María', 'Colonia Caroya', 'Alta Gracia', 'Bell Ville', 'Villa Nueva', 'Marcos Juárez', 'Villa Dolores', 'San Luis del Palmar', 'Deán Funes', 'Cruz del Eje', 'Arias', 'Canals', 'Laboulaye', 'Huinca Renancó', 'Río Segundo', 'General Cabrera', 'Villa Allende', 'Malagueño', 'Pilar'],
    workZones: [],
  },
  {
    id: 'corrientes',
    name: 'Corrientes',
    cities: ['Corrientes', 'Goya', 'Curuzú Cuatiá', 'Esquina', 'Mercedes', 'Paso de los Libres', 'Santo Tomé', 'Bella Vista', 'Itatí', 'Empedrado', 'Santaní', 'Lavalle', 'Concepción', 'Virasoro'],
    workZones: [],
  },
  {
    id: 'entre_rios',
    name: 'Entre Ríos',
    cities: ['Paraná', 'Concordia', 'Gualeguaychú', 'Victoria', 'Gualeguay', 'Concepción del Uruguay', 'Villaguay', 'Federal', 'Colón', 'Federación', 'La Paz', 'Nogoyá', 'Maciá', 'Basavilbaso', 'Crespo', 'Hernandarias', 'Diamante', 'Victoria'],
    workZones: [],
  },
  {
    id: 'formosa',
    name: 'Formosa',
    cities: ['Formosa', 'Clorinda', 'Pilcomayo', 'Pirané', 'Las Lomitas', 'Ingeniero Juárez', 'General Manuel Belgrano', 'El Colorado', 'Comandante Fontana'],
    workZones: [],
  },
  {
    id: 'jujuy',
    name: 'Jujuy',
    cities: ['San Salvador de Jujuy', 'Palpalá', 'Perico', 'El Carmen', 'Ledesma', 'Libertador General San Martín', 'Tilcara', 'Humahuaca', 'Purmamarca', 'Maimará', 'Yala', 'Caimancito', 'Calilegua', 'Abra Pampa'],
    workZones: [],
  },
  {
    id: 'la_pampa',
    name: 'La Pampa',
    cities: ['Santa Rosa', 'General Pico', 'Toay', 'Realicó', 'General Acha', 'Victorica', 'Winifreda', 'Intendente Alvear', 'Rancul', 'Castex'],
    workZones: [],
  },
  {
    id: 'la_rioja',
    name: 'La Rioja',
    cities: ['La Rioja', 'Chilecito', 'Arauco', 'Famatina', 'Sanogasta', 'Chamical', 'Villa Unión', 'Vinchina', 'Nonogasta', 'Patquía'],
    workZones: [],
  },
  {
    id: 'mendoza',
    name: 'Mendoza',
    cities: ['Mendoza', 'Godoy Cruz', 'Las Heras', 'San Rafael', 'San Martín', 'Luján de Cuyo', 'Maipú', 'Guaymallén', 'Tunuyán', 'Tupungato', 'General Alvear', 'Malargüe', 'Uspallata', 'Villa Nueva', 'Rivadavia', 'Junín', 'La Paz', 'San Carlos', 'Santa Rosa'],
    workZones: [],
  },
  {
    id: 'misiones',
    name: 'Misiones',
    cities: ['Posadas', 'Oberá', 'Eldorado', 'Puerto Iguazú', 'Guaraní', 'Apóstoles', 'Jardín América', 'Montecarlo', 'Leandro N. Alem', 'San Javier', 'Candelaria', 'San Ignacio', 'Oberá', 'Wanda', 'Boca del Tigre'],
    workZones: [],
  },
  {
    id: 'neuquen',
    name: 'Neuquén',
    cities: ['Neuquén', 'Cipolletti', 'General Roca', 'Plottier', 'San Martín de los Andes', 'Villa La Angostura', 'Junín de los Andes', 'Zapala', 'Centenario', 'Chos Malal', 'Aluminé', 'Villa Pehuenia', 'Las Lajas'],
    workZones: [],
  },
  {
    id: 'rio_negro',
    name: 'Río Negro',
    cities: ['Viedma', 'Bariloche', 'General Roca', 'Cipolletti', 'Allen', 'Fiske Menuco', 'Ing. Luis A. Huergo', 'Luis Beltrán', 'Cinco Saltos', 'Fernández Oro', 'Mainque', 'Guardia Mitre', 'Sierra Grande'],
    workZones: [],
  },
  {
    id: 'salta',
    name: 'Salta',
    cities: ['Salta', 'Cafayate', 'Cerrillos', 'General Güemes', 'Joaquín V. González', 'La Caldera', 'Metán', 'Orán', 'Rosario de la Frontera', 'San Ramón de la Nueva Orán', 'Tartagal', 'Cachi', 'Iruya', 'Quebrada de Humahuaca'],
    workZones: [],
  },
  {
    id: 'san_juan',
    name: 'San Juan',
    cities: ['San Juan', 'Rawson', 'Rivadavia', 'Santa Lucía', 'Chimbas', 'Pocito', 'Caucete', 'Jáchal', 'Calingasta', 'Barreal', 'Villa Media Agua', 'Zonda', 'Ullum'],
    workZones: [],
  },
  {
    id: 'san_luis',
    name: 'San Luis',
    cities: ['San Luis', 'Villa Mercedes', 'La Punta', 'Juana Koslay', 'Potrero de los Funes', 'Merlo', 'Concarán', 'Nogolí', 'El Trapiche', 'Tilisarao', 'Quines'],
    workZones: [],
  },
  {
    id: 'santa_cruz',
    name: 'Santa Cruz',
    cities: ['Río Gallegos', 'El Calafate', 'Caleta Olivia', 'Comodoro Rivadavia', 'Puerto Deseado', 'Pico Truncado', 'Los Antiguos', 'Perito Moreno', 'Gobernador Gregores'],
    workZones: [],
  },
  {
    id: 'santa_fe',
    name: 'Santa Fe',
    cities: ['Santa Fe', 'Rosario', 'Venado Tuerto', 'Rafaela', 'Reconquista', 'San Lorenzo', 'Santo Tomé', 'Villa Gobernador Gálvez', 'Coronda', 'Esperanza', 'Rufino', 'San Javier', 'Casilda', 'Soldini', 'Funes', 'Roldán', 'Pérez', 'Granadero Baigorria', 'Capitán Bermúdez', 'Fray Luis Beltrán'],
    workZones: [],
  },
  {
    id: 'santiago_del_estero',
    name: 'Santiago del Estero',
    cities: ['Santiago del Estero', 'La Banda', 'Fernández', 'Termas de Río Hondo', 'Banda', 'Fray Justo Santa María de Oro', 'Río Hondo', 'Añatuya', 'Suncho Corral', 'Clodomira'],
    workZones: [],
  },
  {
    id: 'tierra_del_fuego',
    name: 'Tierra del Fuego',
    cities: ['Ushuaia', 'Río Grande', 'Tolhuin', 'Porvenir'],
    workZones: [],
  },
  {
    id: 'tucuman',
    name: 'Tucumán',
    cities: ['San Miguel de Tucumán', 'Yerba Buena', 'Concepción', 'Famaillá', 'Aguilares', 'Lules', 'Banda del Río Sali', 'Tafí del Valle', 'Tafí Viejo', 'Alderetes', 'Bella Vista', 'Monteros', 'Burruyacú', 'Trancas', 'Amaicha del Valle'],
    workZones: [],
  },
];

export function getCitiesByProvince(provinceId: string): string[] {
  const province = ARGENTINA_PROVINCES.find(p => p.id === provinceId);
  if (!province) return [];
  return [...province.cities].sort((a, b) => a.localeCompare(b, 'es'));
}

export function getWorkZonesByProvince(provinceId: string): string[] {
  const province = ARGENTINA_PROVINCES.find(p => p.id === provinceId);
  return province?.workZones || [];
}

export function getProvinceName(provinceId: string): string {
  const province = ARGENTINA_PROVINCES.find(p => p.id === provinceId);
  return province ? province.name : provinceId;
}

export function searchCities(provinceId: string, query: string): string[] {
  const cities = getCitiesByProvince(provinceId);
  if (!query) return cities;
  const q = query.toLowerCase();
  return cities.filter(c => c.toLowerCase().includes(q));
}

export function isCaba(provinceId: string): boolean {
  return provinceId === 'caba';
}
