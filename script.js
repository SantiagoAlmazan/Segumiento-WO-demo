// === FUNCIONES BASE ===
function obtenerWO() {
  return JSON.parse(localStorage.getItem("workOrders")) || [];
}

function guardarWO(data) {
  localStorage.setItem("workOrders", JSON.stringify(data));
}

// === ACTUALIZA TODAS LAS TABLAS DE LAS ESTACIONES ===
function actualizarTablas() {
  actualizarTablaPorEstacion("CNC");
  actualizarTablaPorEstacion("Molino");
  actualizarTablaPorEstacion("Ensamble");
  actualizarTablaPorEstacion("Empaque");
  actualizarTablaMaster();
}

// === AVANZAR WO ENTRE ESTACIONES ===
function avanzarWO(id, nuevaEstacion) {
  const allWOs = obtenerWO();
  const wo = allWOs.find(w => w.id === id);
  if (!wo) return alert("WO no encontrada");

  wo.estado = nuevaEstacion;
  wo.historial = wo.historial || [];
  wo.historial.push({
    estacion: nuevaEstacion,
    fecha: new Date().toLocaleString()
  });

  guardarWO(allWOs);
  actualizarTablas(); // refresca todas las vistas
}

// === RENDERIZA TABLAS POR ESTACIÓN ===
function actualizarTablaPorEstacion(estacion) {
  const tbody = document.getElementById(`tabla-${estacion.toLowerCase()}`);
  if (!tbody) return;

  const allWOs = obtenerWO();
  tbody.innerHTML = "";

  allWOs
    .filter(wo => wo.estado === estacion)
    .forEach(wo => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${wo.id}</td>
        <td>${wo.descripcion}</td>
        <td>${wo.piezas}</td>
        <td>${wo.clasificacion}</td>
        <td>${wo.estado}</td>
        <td>
          <select onchange="avanzarWO('${wo.id}', this.value)">
            <option value="">Mover a...</option>
            <option value="CNC">CNC</option>
            <option value="Molino">Molino</option>
            <option value="Ensamble">Ensamble</option>
            <option value="Empaque">Empaque</option>
            <option value="Finalizado">Finalizado</option>
          </select>
        </td>
      `;
      tbody.appendChild(tr);
    });
}

// === MASTER ===
function actualizarTablaMaster() {
  const tbody = document.getElementById("tabla-master");
  if (!tbody) return;

  const allWOs = obtenerWO();
  tbody.innerHTML = "";

  allWOs.forEach(wo => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${wo.id}</td>
      <td>${wo.descripcion}</td>
      <td>${wo.piezas}</td>
      <td>${wo.clasificacion}</td>
      <td>${wo.estado}</td>
      <td>
        <select onchange="avanzarWO('${wo.id}', this.value)">
          <option value="">Mover a...</option>
          <option value="CNC">CNC</option>
          <option value="Molino">Molino</option>
          <option value="Ensamble">Ensamble</option>
          <option value="Empaque">Empaque</option>
          <option value="Finalizado">Finalizado</option>
        </select>
      </td>
    `;
    tbody.appendChild(tr);
  });
}
// === DASHBOARD GENERAL (index.html) ===
// === DASHBOARD GENERAL (index.html) ===
function actualizarTablaDashboard() {
  const tbody = document.getElementById("tabla-dashboard");
  if (!tbody) return;

  const allWOs = JSON.parse(localStorage.getItem("workOrders")) || [];
  tbody.innerHTML = "";

  allWOs.forEach(wo => {
    const tr = document.createElement("tr");

    // Determinar clase de color según la estación
    let claseColor = "";
    switch (wo.estado) {
      case "En espera": claseColor = "estado-espera"; break;
      case "CNC": claseColor = "estado-cnc"; break;
      case "Molino": claseColor = "estado-molino"; break;
      case "Ensamble": claseColor = "estado-ensamble"; break;
      case "Lija": claseColor = "estado-lija"; break;
      case "Pintura": claseColor = "estado-pintura"; break;
      case "Finalizado": claseColor = "estado-finalizado"; break;
    }

    tr.innerHTML = `
      <td>${wo.id}</td>
      <td>${wo.descripcion}</td>
      <td>${wo.piezas}</td>
      <td>${wo.clasificacion}</td>
      <td class="${claseColor}">${wo.estado}</td>
    `;

    tbody.appendChild(tr);
  });
}

function agregarWO(descripcion, piezas, clasificacion) {
  const allWOs = JSON.parse(localStorage.getItem("workOrders")) || [];
  const nuevaWO = {
    id: Date.now().toString(),
    descripcion,
    piezas,
    clasificacion,
    estado: "En espera"
  };
  allWOs.push(nuevaWO);
  localStorage.setItem("workOrders", JSON.stringify(allWOs));
  actualizarTablas(); // o la función que refresca tus tablas
}



document.addEventListener("DOMContentLoaded", actualizarTablas);

