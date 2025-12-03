// Constantes de servicios y localizaciones del hospital
export const SERVICIOS_HOSPITAL = [
  'Gerencia',
  'Subgerencia de servicios de salud',
  'Subgerencia Administrativa y financiera',
  'Oficina asesora de desarrollo de servicios de apoyo',
  'Control Interno',
  'Control Interno Disciplinario',
  'Atención de urgencias',
  'Urgencias',
  'Referencia y contrarreferencia',
  'Transporte asistencial',
  'Atención hospitalaria',
  'Hospitalización',
  'Cuidado crítico',
  'Apoyo Terapéutico',
  'Ginecoobstetricia',
  'Asignación de camas',
  'Enfermería',
  'Consulta Especializada y Apoyo Diagnostico',
  'Consulta especializada y subespecializada',
  'Quirófanos',
  'Salas de cirugía',
  'Esterilización',
  'Programación de cirugía',
  'Hemodinamia e intervencionismo',
  'Seguridad del paciente',
  'Gestión preventiva y predictiva',
  'Programas Institucionales',
  'Salud Pública',
  'Rutas integrales de atención en salud',
  'Farmacia',
  'Docencia de servicio',
  'Investigación',
  'Talento humano',
  'Seguridad y salud en el trabajo',
  'Sistema de información y atención al usuario (SIAU)',
  'Gestión jurídica',
  'Gestión de Contratación',
  'Gestión comercial',
  'Gestión Financiero',
  'Tesorería',
  'Facturación',
  'Cartera',
  'Auditoría',
  'Gestión de suministros y activos fijos',
  'Gestión de la tecnología biomédica: nueva, reposición y mantenimiento',
  'Gestión ambiental',
  'Gestión del ambiente físico',
  'Gestión servicios de apoyo',
  'Aseo y desinfección',
  'Tecnologías de la Información',
  'Gestión documental',
  'Comunicaciones y medios',
  'Planeación',
  'Gestión de calidad',
  'Gestión del riesgo integral',
  'Laboratorio Clínico',
  'Radiología e Imágenes Diagnósticas',
  'Patología',
  'Atención Ambulatoria',
  'Programa de Humanización'
];

// Promesa de valor del Hospital San Rafael
export const PROMESA_VALOR = [
  'SEGURO',
  'UNIVERSITARIO',
  'MEJORADO',
  'EFICIENTE',
  'RESPONSABLE',
  'CALIDO',
  'EXCELENTE'
];

// Tipos de solicitud
export const TIPOS_SOLICITUD = [
  { valor: 'requerimiento', etiqueta: 'Requerimiento' },
  { valor: 'incidencia', etiqueta: 'Incidencia' }
];

// Estados de casos
export const ESTADOS_CASO = [
  { valor: 'nuevo', etiqueta: 'Nuevo', color: 'blue' },
  { valor: 'en_curso', etiqueta: 'En Curso', color: 'yellow' },
  { valor: 'en_seguimiento', etiqueta: 'En Seguimiento', color: 'orange' },
  { valor: 'cerrado', etiqueta: 'Cerrado', color: 'green' }
];

// Prioridades
export const PRIORIDADES = [
  { valor: 'baja', etiqueta: 'Baja', color: 'gray' },
  { valor: 'media', etiqueta: 'Media', color: 'blue' },
  { valor: 'alta', etiqueta: 'Alta', color: 'orange' },
  { valor: 'critica', etiqueta: 'Crítica', color: 'red' }
];

// Tipos de campos para formatos
export const TIPOS_CAMPO = [
  { valor: 'texto', etiqueta: 'Texto' },
  { valor: 'numero', etiqueta: 'Número' },
  { valor: 'fecha', etiqueta: 'Fecha' },
  { valor: 'lista_desplegable', etiqueta: 'Lista Desplegable' },
  { valor: 'area_texto', etiqueta: 'Área de Texto' },
  { valor: 'email', etiqueta: 'Correo Electrónico' },
  { valor: 'telefono', etiqueta: 'Teléfono' }
];

// Extensiones de archivo permitidas
export const EXTENSIONES_PERMITIDAS = [
  '.jpg', '.jpeg', '.png', '.gif', '.bmp',
  '.pdf', '.doc', '.docx', '.xls', '.xlsx',
  '.txt', '.csv', '.zip', '.rar', '.7z'
];

// Tamaño máximo de archivo (10 MB)
export const TAMANO_MAXIMO_ARCHIVO = 10485760;
