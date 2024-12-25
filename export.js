// export.js
// Función para exportar datos a un archivo Excel
function exportarAExcel(datos, nombreArchivo = "resultados.xlsx") {
    if (!datos || datos.length === 0) {
        alert("No hay datos para exportar.");
        return;
    }

    // Crear una hoja de cálculo a partir de los datos
    const hoja = XLSX.utils.json_to_sheet(datos);

    // Crear un libro de trabajo (workbook) y agregar la hoja
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Resultados");

    // Generar y descargar el archivo Excel
    XLSX.writeFile(libro, nombreArchivo);
}
