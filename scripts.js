// scripts.js
// Referencias a elementos del DOM
const tipoFacturaSelect = document.getElementById("tipo_factura");
const checkboxes = document.querySelectorAll('input[name="orden"]');
const uploadButton = document.getElementById("upload-button");
const fileInput = document.getElementById("file-input");
const uploadArea = document.getElementById("upload-area");
const fileListDisplay = document.getElementById("file-list");
const processButton = document.getElementById("process-button");
// Referencias a los checkboxes
const selectAllCheckbox = document.getElementById("select-all");
const selectTaxesCheckbox = document.getElementById("select-taxes");
const allCheckboxes = document.querySelectorAll('input[name="orden"]');

// Variable para almacenar los archivos seleccionados
let selectedFiles = [];

// Función para habilitar/deshabilitar los checkboxes
function toggleCheckboxes() {
    const tipoFactura = document.getElementById("tipo_factura").value;
    const disable = tipoFactura === "pago"; // Desactivar si es "pago"

    // Desactivar/activar todos los checkboxes
    allCheckboxes.forEach((checkbox) => {
        checkbox.disabled = disable;
        if (disable) {
            checkbox.checked = false; // Deseleccionar si se desactivan
        }
    });

    // Desactivar/activar "Seleccionar Todo" y "Seleccionar Todos los Impuestos"
    selectAllCheckbox.disabled = disable;
    selectTaxesCheckbox.disabled = disable;
    if (disable) {
        selectAllCheckbox.checked = false;
        selectTaxesCheckbox.checked = false;
    }
}

// Llamada inicial para establecer el estado correcto al cargar la página
toggleCheckboxes();

// Evento para manejar cambios en el select "tipo_factura"
document.getElementById("tipo_factura").addEventListener("change", toggleCheckboxes);

// Evento al cambiar la selección de tipo de factura
tipoFacturaSelect.addEventListener("change", toggleCheckboxes);

// Llamada inicial para establecer el estado correcto
toggleCheckboxes();


// Función para seleccionar/deseleccionar todos los checkboxes
selectAllCheckbox.addEventListener("change", () => {
    allCheckboxes.forEach((checkbox) => {
        checkbox.checked = selectAllCheckbox.checked;
    });
    // Asegurarse de sincronizar "Seleccionar Todos los Impuestos"
    selectTaxesCheckbox.checked = selectAllCheckbox.checked;
});

// Función para seleccionar/deseleccionar solo los impuestos
selectTaxesCheckbox.addEventListener("change", () => {
    const taxCheckboxes = document.querySelectorAll(
        'input[name="orden"][value="iva"], input[name="orden"][value="ieps"], input[name="orden"][value="ret_isr"], input[name="orden"][value="ret_iva"]'
    );
    taxCheckboxes.forEach((checkbox) => {
        checkbox.checked = selectTaxesCheckbox.checked;
    });
});

// Sincronizar "Seleccionar Todo" con los cambios en los checkboxes individuales
allCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
        const allChecked = Array.from(allCheckboxes).every((cb) => cb.checked);
        selectAllCheckbox.checked = allChecked;

        const taxCheckboxes = Array.from(
            document.querySelectorAll(
                'input[name="orden"][value="iva"], input[name="orden"][value="ieps"], input[name="orden"][value="ret_isr"], input[name="orden"][value="ret_iva"]'
            )
        );
        const allTaxesChecked = taxCheckboxes.every((cb) => cb.checked);
        selectTaxesCheckbox.checked = allTaxesChecked;
    });
});

// Función para validar archivos
function validateFiles(files) {
    const maxFiles = 500;
    const validFiles = [];
    const invalidFiles = [];

    Array.from(files).forEach((file) => {
        if (file.name.endsWith(".xml")) {
            validFiles.push(file);
        } else {
            invalidFiles.push(file.name);
        }
    });

    if (validFiles.length > maxFiles) {
        fileListDisplay.textContent = `Error: Solo se permiten un máximo de ${maxFiles} archivos XML.`;
        return { validFiles: [], invalidFiles };
    }

    if (validFiles.length === 0) {
        fileListDisplay.textContent = "Error: No se seleccionaron archivos XML válidos.";
        return { validFiles: [], invalidFiles };
    }

    return { validFiles, invalidFiles };
}

// Función para actualizar la lista de archivos y el estado del botón
function updateFileListDisplay() {
    if (selectedFiles.length > 0) {
        fileListDisplay.textContent = `Archivos seleccionados: ${selectedFiles.length}`;
        enableProcessButton();
    } else {
        fileListDisplay.textContent = "No hay archivos seleccionados.";
        disableProcessButton();
    }
}

// Funciones para habilitar/deshabilitar el botón "Analizar XML"
function enableProcessButton() {
    processButton.classList.add("enabled");
    processButton.disabled = false;
}

function disableProcessButton() {
    processButton.classList.remove("enabled");
    processButton.disabled = true;
}

// Evento al presionar el botón de cargar archivos
uploadButton.addEventListener("click", () => {
    fileInput.click();
});

// Evento al cambiar el input de archivos
fileInput.addEventListener("change", (e) => {
    handleFiles(e.target.files);
});

// Eventos para manejar el área de arrastrar y soltar
uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadArea.classList.add("dragover");
});

uploadArea.addEventListener("dragleave", () => {
    uploadArea.classList.remove("dragover");
});

uploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadArea.classList.remove("dragover");
    handleFiles(e.dataTransfer.files);
});

// Función para manejar archivos seleccionados o arrastrados
function handleFiles(files) {
    const { validFiles, invalidFiles } = validateFiles(files);

    selectedFiles = validFiles;
    updateFileListDisplay();

    if (invalidFiles.length > 0) {
        alert(`Los siguientes archivos no son válidos y serán ignorados:\n${invalidFiles.join("\n")}`);
    }
}

// Evento al hacer clic en "Analizar XML"
processButton.addEventListener("click", () => {
    if (selectedFiles.length > 0) {
        const tipoComprobanteSeleccionado = tipoFacturaSelect.value;
        procesarArchivosXML(selectedFiles, tipoComprobanteSeleccionado); // Llamar a la lógica en xml.js
        console.log("Iniciando el procesamiento de XML...");
    } else {
        alert("No hay archivos para procesar.");
    }
});

// Referencias al select de factura y al checkbox de folio
const facturaSelect = document.getElementById("factura");
const folioCheckbox = document.querySelector('input[name="orden"][value="folio"]');
// Función para habilitar/deshabilitar el checkbox de "Folio"
function toggleFolioCheckbox() {
    if (facturaSelect.value === "recibida") {
        folioCheckbox.disabled = true;
        folioCheckbox.checked = false; // Asegurar que quede desmarcado
    } else {
        folioCheckbox.disabled = false;
    }
}

// Evento al cambiar el select "factura"
facturaSelect.addEventListener("change", toggleFolioCheckbox);

// Llamada inicial para establecer el estado correcto
toggleFolioCheckbox();

// Función para manejar archivos seleccionados o arrastrados
function handleFiles(files) {
    const { validFiles, invalidFiles } = validateFiles(files);
    // Eliminar duplicados basándose en el nombre del archivo
    const uniqueFiles = validFiles.filter(
        (file, index, self) =>
            index === self.findIndex((f) => f.name === file.name)
    );

    selectedFiles = uniqueFiles;
    updateFileListDisplay();

    if (invalidFiles.length > 0) {
        alert(`Los siguientes archivos no son válidos y serán ignorados:\n${invalidFiles.join("\n")}`);
    }

    if (validFiles.length !== uniqueFiles.length) {
        alert("Se eliminaron archivos duplicados.");
    }
}

// Función para manejar modales
function manejarModal(botonId, modalId, closeId) {
    const boton = document.getElementById(botonId);
    const modal = document.getElementById(modalId);
    const close = document.getElementById(closeId);

    // Mostrar el modal
    boton.addEventListener("click", () => {
        modal.style.display = "flex"; // Mostrar modal
    });

    // Cerrar el modal al presionar el botón de cierre
    close.addEventListener("click", () => {
        modal.style.display = "none"; // Ocultar modal
    });

    // Cerrar el modal al hacer clic fuera de él
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
}

// Manejar ambos modales
manejarModal("help-button", "help-modal", "close-modal");
manejarModal("usage-button", "usage-modal", "close-usage-modal");

// ==== CAMBIO DE TEMA ==== //
const body = document.body;
const themeToggle = document.getElementById('theme-toggle');
const THEME_KEY = 'theme-preference';
// Función para aplicar tema
function applyTheme(theme) {
  if (theme === 'dark') {
    body.classList.add('dark-mode');
  } else {
    body.classList.remove('dark-mode');
  }
}

// Leer tema guardado o usar preferencia del sistema
const savedTheme = localStorage.getItem(THEME_KEY);
if (savedTheme) {
  applyTheme(savedTheme);
} else {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark ? 'dark' : 'light');
}

// Alternar tema al presionar el botón
themeToggle.addEventListener('click', () => {
  const isDark = body.classList.toggle('dark-mode');
  localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
});