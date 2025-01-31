// xml.js
// Función para validar el TipoDeComprobante según la selección
function esComprobanteValido(tipo, tipoComprobanteSeleccionado) {
    switch (tipoComprobanteSeleccionado) {
        case "ingreso_egreso":
            return tipo === "I" || tipo === "E";
        case "ingreso":
            return tipo === "I";
        case "egreso":
            return tipo === "E";
        case "pago":
            return tipo === "P";
        case "nomina":
            return tipo === "N";
        default:
            return false;
    }
}
// Array global para almacenar resultados consolidados
let resultadosConsolidados = [];


// Función para procesar los archivos XML
function procesarArchivosXML(files, tipoComprobanteSeleccionado) {
    const archivosIgnorados = [];
    resultadosConsolidados = []; // Reiniciar el array al iniciar el procesamiento

    files.forEach((file, index) => {
        const reader = new FileReader();

        reader.onload = function (e) {
            try {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(e.target.result, "application/xml");

                // Verificar errores de parsing
                const parseError = xmlDoc.getElementsByTagName("parsererror");
                if (parseError.length > 0) {
                    alert(`Error al parsear el archivo: ${file.name}. Verifique que el archivo sea válido.`);
                    archivosIgnorados.push(file.name);
                    return;
                }

                // Extraer los nodos con TipoDeComprobante
                const comprobantes = xmlDoc.getElementsByTagName("cfdi:Comprobante");

                for (const comprobante of comprobantes) {
                    const tipo = comprobante.getAttribute("TipoDeComprobante");

                    // Ignorar nóminas si no se selecciona explícitamente "Nómina"
                    if (tipo === "N" && tipoComprobanteSeleccionado !== "nomina") {
                        continue;
                    }

                    // Verificar si el comprobante es válido según la selección
                    if (esComprobanteValido(tipo, tipoComprobanteSeleccionado)) {
                        const datos = tipo === "P"
                            ? extraerDatosPagos(comprobante)
                            : extraerDatos(comprobante);

                        resultadosConsolidados.push({ ...datos, Archivo: file.name });
                    }
                }

                // Exportar a Excel si es el último archivo procesado
                if (index === files.length - 1) {
                    if (resultadosConsolidados.length > 0) {
                        exportarAExcel(resultadosConsolidados, "resultados_consolidados.xlsx");
                    } else {
                        alert("No se encontraron datos válidos para exportar.");
                    }
                }
            } catch (error) {
                alert(`Error al procesar el archivo: ${file.name}. Detalles: ${error.message}`);
                archivosIgnorados.push(file.name);
            }
        };

        reader.readAsText(file);
    });

    // Mostrar archivos ignorados
    if (archivosIgnorados.length > 0) {
        console.warn("Archivos ignorados:", archivosIgnorados.join(", "));
    }
}

// Función para mapear claves de FormaPago y FormaDePagoP a sus descripciones
function obtenerDescripcionFormaPago(clave) {
    const tablaFormaPago = {
        "01": "EFECTIVO",
        "02": "CHEQUE NOMINATIVO",
        "03": "TRANSFERENCIA",
        "04": "TARJETA DE CRÉDITO",
        "05": "MONEDERO ELECTRÓNICO",
        "06": "DINERO ELECTRÓNICO",
        "08": "VALES DE DESPENSA",
        "12": "DACIÓN EN PAGO",
        "13": "PAGO POR SUBROGACIÓN",
        "14": "PAGO POR CONSIGNACIÓN",
        "15": "CONDONACIÓN",
        "17": "COMPENSACIÓN",
        "23": "NOVACIÓN",
        "24": "CONFUSIÓN",
        "25": "REMISIÓN DE DEUDA",
        "26": "PRESCRIPCIÓN O CADUCIDAD",
        "27": "A SATISFACCIÓN DEL ACREEDOR",
        "28": "TARJETA DE DÉBITO",
        "29": "TARJETA DE SERVICIOS",
        "30": "APLICACIÓN DE ANTICIPOS",
        "31": "INTERMEDIARIO PAGOS",
        "99": "POR DEFINIR"
    };

    return tablaFormaPago[clave] || clave || "No disponible"; // Devuelve la descripción o la clave original si no está mapeada
}


// Función para extraer datos de un comprobante
function extraerDatos(comprobante) {
    const datos = {};

    // Verificar los checkboxes seleccionados
    const checkboxesSeleccionados = Array.from(
        document.querySelectorAll('input[name="orden"]:checked')
    ).map((checkbox) => checkbox.value);

    // Tipo de Comprobante
    datos["Tipo"] = comprobante.getAttribute("TipoDeComprobante") || "No disponible";

    // Referencia al tipo de factura (emitida o recibida)
    const tipoFactura = document.getElementById("factura").value;

    // Folio Fiscal (UUID)
    if (checkboxesSeleccionados.includes("folio_fiscal")) {
        const timbreFiscal = comprobante.getElementsByTagName("tfd:TimbreFiscalDigital")[0];
        datos["Folio Fiscal"] = timbreFiscal ? timbreFiscal.getAttribute("UUID") || "-" : "No disponible";
    }

    // Folio
    if (checkboxesSeleccionados.includes("folio")) {
        datos["Folio"] = comprobante.getAttribute("Folio") || "-";
    }

    // Fecha Emisión
    if (checkboxesSeleccionados.includes("fecha_emision")) {
        datos["Fecha Emisión"] = comprobante.getAttribute("Fecha") || "No disponible";
    }

    // RFC y Nombre
    if (checkboxesSeleccionados.includes("rfc") || checkboxesSeleccionados.includes("nombre")) {
        const entidad = tipoFactura === "emitida"
            ? comprobante.getElementsByTagName("cfdi:Receptor")[0]
            : comprobante.getElementsByTagName("cfdi:Emisor")[0];

        if (entidad) {
            if (checkboxesSeleccionados.includes("rfc")) {
                datos["RFC"] = entidad.getAttribute("Rfc") || "No disponible";
            }

            if (checkboxesSeleccionados.includes("nombre")) {
                datos["Nombre"] = entidad.getAttribute("Nombre") || "No disponible";
            }
        } else {
            if (checkboxesSeleccionados.includes("rfc")) {
                datos["RFC"] = "No disponible";
            }

            if (checkboxesSeleccionados.includes("nombre")) {
                datos["Nombre"] = "No disponible";
            }
        }
    }

    // Forma de Pago (Transformada)
    if (checkboxesSeleccionados.includes("forma_pago")) {
        const claveFormaPago = comprobante.getAttribute("FormaPago");
        datos["Forma de Pago"] = obtenerDescripcionFormaPago(claveFormaPago);
    }
    // Método de Pago
    if (checkboxesSeleccionados.includes("metodo_pago")) {
        datos["Método de Pago"] = comprobante.getAttribute("MetodoPago") || "No disponible";
    }

    // Total
    if (checkboxesSeleccionados.includes("total")) {
        datos["Total"] = comprobante.getAttribute("Total") || "No disponible";
    }

    // Subtotal
    if (checkboxesSeleccionados.includes("subtotal")) {
        datos["Subtotal"] = comprobante.getAttribute("SubTotal") || "No disponible";
    }

    // Extraer los impuestos totales del comprobante
    const impuestos = Array.from(comprobante.children).find((nodo) => 
    nodo.nodeName === "cfdi:Impuestos"
    );

    if (impuestos) {
        // Inicializar acumuladores para impuestos
        let totalIVA = 0;
        let totalIEPS = 0;

        // Extracción de Traslados
        if (checkboxesSeleccionados.includes("iva") || checkboxesSeleccionados.includes("ieps")) {
            const traslados = impuestos.getElementsByTagName("cfdi:Traslado");
            for (const traslado of traslados) {
                const impuesto = traslado.getAttribute("Impuesto");
                const importe = parseFloat(traslado.getAttribute("Importe")) || 0;

                if (impuesto === "002" && checkboxesSeleccionados.includes("iva")) {
                    totalIVA += importe; // Acumular IVA
                }
                if (impuesto === "003" && checkboxesSeleccionados.includes("ieps")) {
                    totalIEPS += importe; // Acumular IEPS
                }
            }
        }

        // Asignar los totales acumulados
        if (checkboxesSeleccionados.includes("iva")) {
            datos["IVA"] = totalIVA > 0 ? totalIVA.toFixed(2) : "No disponible";
        }
        if (checkboxesSeleccionados.includes("ieps")) {
            datos["IEPS"] = totalIEPS > 0 ? totalIEPS.toFixed(2) : "No disponible";
        }

        // Extracción de Retenciones
        if (checkboxesSeleccionados.includes("ret_isr") || checkboxesSeleccionados.includes("ret_iva")) {
            const retenciones = impuestos.getElementsByTagName("cfdi:Retencion");
            for (const retencion of retenciones) {
                const impuesto = retencion.getAttribute("Impuesto");
                const importe = parseFloat(retencion.getAttribute("Importe")) || 0;

                if (impuesto === "001" && checkboxesSeleccionados.includes("ret_isr")) {
                    datos["Ret ISR"] = importe > 0 ? importe.toFixed(2) : "No disponible";
                }
                if (impuesto === "002" && checkboxesSeleccionados.includes("ret_iva")) {
                    datos["Ret IVA"] = importe > 0 ? importe.toFixed(2) : "No disponible";
                }
            }
        }
    }

    // Descuento
    if (checkboxesSeleccionados.includes("descuento")) {
        datos["Descuento"] = comprobante.getAttribute("Descuento") || "No disponible";
    }

    return datos;
}

// Función para extraer datos de comprobantes de tipo "P" (Pagos)
function extraerDatosPagos(comprobante) {
    const datos = {};

    // Tipo de Comprobante
    datos["Tipo"] = comprobante.getAttribute("TipoDeComprobante") || "No disponible";

    // Folio Fiscal (UUID)
    const timbreFiscal = comprobante.getElementsByTagName("tfd:TimbreFiscalDigital")[0];
    datos["UUID"] = timbreFiscal ? timbreFiscal.getAttribute("UUID") || "-" : "No disponible";

    // Folio
    datos["Folio"] = comprobante.getAttribute("Folio") || "-";

    // Fecha
    datos["Fecha"] = comprobante.getAttribute("Fecha") || "No disponible";

    // RFC y Nombre
    const tipoFactura = document.getElementById("factura").value;
    const entidad = tipoFactura === "emitida"
        ? comprobante.getElementsByTagName("cfdi:Receptor")[0]
        : comprobante.getElementsByTagName("cfdi:Emisor")[0];

    if (entidad) {
        datos["RFC"] = entidad.getAttribute("Rfc") || "No disponible";
        datos["Nombre"] = entidad.getAttribute("Nombre") || "No disponible";
    } else {
        datos["RFC"] = "No disponible";
        datos["Nombre"] = "No disponible";
    }

    // Complemento de pagos
    const complemento = comprobante.getElementsByTagName("cfdi:Complemento")[0];
    if (complemento) {
        const pagos = complemento.getElementsByTagName("pago20:Pagos")[0];
        if (pagos) {
            // Pago Individual
            const pago = pagos.getElementsByTagName("pago20:Pago")[0];
            if (pago) {
                datos["FormaDePagoP"] = obtenerDescripcionFormaPago(pago.getAttribute("FormaDePagoP"));
                datos["FechaPago"] = pago.getAttribute("FechaPago") || "No disponible"; // Extraer FechaPago
                datos["MontoTotalPagos"] = parseFloat(pago.getAttribute("Monto") || 0);
            }

            // Impuestos (ImpuestosP)
            const impuestosP = pagos.getElementsByTagName("pago20:ImpuestosP")[0];
            datos["IVA"] = 0;
            datos["IEPS"] = 0;
            datos["ISR"] = 0;

            if (impuestosP) {
                // Traslados
                const trasladosP = impuestosP.getElementsByTagName("pago20:TrasladoP");
                for (const traslado of trasladosP) {
                    const impuesto = traslado.getAttribute("ImpuestoP");
                    const importe = parseFloat(traslado.getAttribute("ImporteP")) || 0;

                    if (impuesto === "002") {
                        datos["IVA"] += importe;
                    } else if (impuesto === "003") {
                        datos["IEPS"] += importe;
                    }
                }

                // Retenciones
                const retencionesP = impuestosP.getElementsByTagName("pago20:RetencionP");
                for (const retencion of retencionesP) {
                    const impuesto = retencion.getAttribute("ImpuestoP");
                    const importe = parseFloat(retencion.getAttribute("ImporteP")) || 0;

                    if (impuesto === "001") {
                        datos["ISR"] += importe;
                    }
                }
            }

            // Cálculo del Subtotal
            const montoTotal = datos["MontoTotalPagos"];
            const iva = datos["IVA"];
            const ieps = datos["IEPS"];
            const isr = datos["ISR"];

            if (montoTotal > 0) {
                if (iva > 0 || ieps > 0) {
                    datos["Subtotal"] = (montoTotal - iva - ieps + isr).toFixed(2);
                } else {
                    datos["Subtotal"] = (montoTotal + isr).toFixed(2); // Caso sin IVA ni IEPS
                }
            } else {
                datos["Subtotal"] = "No disponible";
            }
        }
    }

    return datos;
}