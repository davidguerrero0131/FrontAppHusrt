const fs = require('fs');
const file = 'src/app/Components/MesaServicios/Cases/mesa-caso-detail/mesa-caso-detail.component.html';
let content = fs.readFileSync(file, 'utf8');

// Append appendTo="body" to all p-selects
content = content.replace(/<p-select /g, '<p-select appendTo="body" ');

// Fix the filterBy to include placa and placa_inventario
content = content.replace(/filterBy="nombres,serie,placaInvima"/g, 'filterBy="nombres,serie,placa,placaInvima,placa_inventario"');

// Fix the template text "Placa: {{ eq.placaInvima || 'N/A' }}" -> "Placa: {{ eq.placa || eq.placa_inventario || eq.placaInvima || 'N/A' }}"
content = content.replace(/Placa: \{\{ eq\.placaInvima \|\| 'N\/A' \}\}/g, "Placa: {{ eq.placa || eq.placa_inventario || eq.placaInvima || 'N/A' }}");

fs.writeFileSync(file, content, 'utf8');
console.log('p-select modified');
