// scripts.js
// Referencias a elementos del DOM
const tipoFacturaSelect = document.getElementById("tipo_factura");
const checkboxes = document.querySelectorAll('input[name="orden"]');
const uploadButton = document.getElementById("upload-button");
const fileInput = document.getElementById("file-input");
const uploadArea = document.getElementById("upload-area");
const fileListDisplay = document.getElementById("file-list");
const processButton = document.getElementById("process-button");

// Variable para almacenar los archivos seleccionados
let selectedFiles = [];

// Función para habilitar/deshabilitar los checkboxes
function toggleCheckboxes() {
    if (tipoFacturaSelect.value === "pago" || tipoFacturaSelect.value === "nomina") {
        checkboxes.forEach((checkbox) => {
            checkbox.disabled = true;
            checkbox.checked = false; // Asegurar que ninguno esté seleccionado
        });
    } else {
        checkboxes.forEach((checkbox) => {
            checkbox.disabled = false;
        });
    }
}

// Evento al cambiar la selección de tipo de factura
tipoFacturaSelect.addEventListener("change", toggleCheckboxes);

// Llamada inicial para establecer el estado correcto
toggleCheckboxes();

// Función para validar archivos
function validateFiles(files) {
    const maxFiles = 300;
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

// Referencias al botón de ayuda y al modal
const helpButton = document.getElementById("help-button");
const helpModal = document.getElementById("help-modal");
const closeModal = document.getElementById("close-modal");

// Mostrar el modal
helpButton.addEventListener("click", () => {
    helpModal.style.display = "flex"; // Cambiamos la visibilidad del modal
});

// Cerrar el modal
closeModal.addEventListener("click", () => {
    helpModal.style.display = "none"; // Ocultamos el modal
});

// Cerrar el modal al hacer clic fuera de él
window.addEventListener("click", (e) => {
    if (e.target === helpModal) {
        helpModal.style.display = "none";
    }
});
