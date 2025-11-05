// Simulación local (almacena las WO en localStorage)
let workOrders = JSON.parse(localStorage.getItem('workOrders')) || [
  { id: 'WO-101', descripcion: 'Mesa de comedor', cliente: 'Casa Bonita', estacion: 'En espera' },
  { id: 'WO-102', descripcion: 'Puerta sólida', cliente: 'Maderas MX', estacion: 'CNC' },
  { id: 'WO-103', descripcion: 'Closet empotrado', cliente: 'Interiores Lara', estacion: 'Molino' },
  { id: 'WO-104', descripcion: 'Cabecera tapizada', cliente: 'Muebles D-Lujo', estacion: 'Lija' },
  { id: 'WO-105', descripcion: 'Puerta doble', cliente: 'Hogar MX', estacion: 'Pintura' },
];

const flujo = ['En espera', 'CNC', 'Molino', 'Ensamble', 'Lija', 'Pintura', 'Terminada'];

// Guardar cambios
function guardarDatos() {
  localStorage.setItem('workOrders', JSON.stringify(workOrders));
}

// Renderizar tabla (puede mostrar todas o filtrar por estación)
function renderTable(estacionFiltro = null) {
  const tbody = document.querySelector('#woTable tbody');
  tbody.innerHTML = '';

  const filtradas = estacionFiltro
    ? workOrders.filter(wo => wo.estacion === estacionFiltro)
    : workOrders;

  filtradas.forEach((wo, i) => {
    const tr = document.createElement('tr');
    const statusClass = wo.estacion.toLowerCase().replace(' ', '');

    tr.innerHTML = `
      <td>${wo.id}</td>
      <td>${wo.descripcion}</td>
      <td>${wo.cliente}</td>
      <td><span class="status ${statusClass}">${wo.estacion}</span></td>
      <td>${wo.estacion === 'Terminada' ? '✅ Completada' : 'En proceso'}</td>
      ${estacionFiltro ? `
        <td>
          ${wo.estacion !== 'Terminada' ? `<button onclick="pedirPassword(${i})">Avanzar</button>` : ''}
        </td>` : ''
      }
    `;
    tbody.appendChild(tr);
  });
}

// Solicita contraseña antes de avanzar
function pedirPassword(index) {
  const password = prompt("Ingrese contraseña del encargado:");
  if (password === "123") {
    avanzar(index);
  } else {
    alert("❌ Contraseña incorrecta");
  }
}

// Avanza la WO a la siguiente estación
function avanzar(i) {
  const actual = workOrders[i].estacion;
  const idx = flujo.indexOf(actual);
  if (idx < flujo.length - 1) {
    workOrders[i].estacion = flujo[idx + 1];
    guardarDatos();
    alert(`✅ ${workOrders[i].id} pasó a ${flujo[idx + 1]}`);
    location.reload();
  }
}

// Agregar nueva WO (desde master)
function agregarWO(id, descripcion, cliente, estacion) {
  if (!id || !descripcion || !cliente || !estacion) {
    alert("⚠️ Todos los campos son obligatorios");
    return;
  }

  if (workOrders.some(wo => wo.id === id)) {
    alert("❌ Ya existe una WO con ese ID");
    return;
  }

  workOrders.push({ id, descripcion, cliente, estacion });
  guardarDatos();
  alert(`✅ WO ${id} agregada exitosamente`);
  location.reload();
}
