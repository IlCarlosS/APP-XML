# Gestión de Facturas XML
Este proyecto es una solución integral diseñada para automatizar la gestión de facturas electrónicas (CFDI SAT). Su objetivo principal es transformar datos brutos contenidos en archivos XML en información estructurada y exportarla a archivos excel .xlsx, eliminando el error humano y reduciendo drásticamente el tiempo de procesamiento administrativo.

## Funcionalidades Clave
- **Procesamiento Inteligente de XML:** Carga masiva de archivos mediante Drag & Drop o selección directa. La aplicación valida la estructura del documento antes de iniciar la extracción.
- **Extracción de Datos Dinámica:** Filtrado y selección de campos específicos. El usuario puede decidir qué información clave (montos, impuestos, emisores, fechas) desea procesar.
- **Generador de Reportes Excel:** Integración con la librería XLSX para consolidar cientos de archivos XML en un único reporte de Excel (.xlsx) perfectamente formateado y listo para su uso.

### Interfaz de Usuario (UX) Profesional:
- Panel de control responsivo basado en Bootstrap.
- Componentes dinámicos: selectores y checkboxes para control de la extración de datos y un sistema de notificaciones Toast para feedback en tiempo real.
- Modal de Ayuda: Instrucciones paso a paso para asegurar que cualquier usuario, independientemente de su perfil técnico, pueda operar la herramienta.

## Arquitectura de la app web (código)
La aplicación sigue un principio de Separación de Responsabilidades (SoC), dividiendo la lógica en módulos especializados para facilitar su escalabilidad:
- *xml.js* (El Motor de Datos): Contiene la lógica core para la lectura de nodos, validación de esquemas y procesamiento de los objetos XML. Es el encargado de convertir el marcado en datos manipulables por JavaScript.
- *scripts.js* (Lógica de Interfaz): Gestiona la interactividad del DOM. Controla el comportamiento de los botones, los estados de los selectores, el sistema de arrastrar y soltar, y la orquestación del flujo de usuario.
- *export.js* (Módulo de Salida): Especializado en la conversión de los datos analizados a formato de hoja de cálculo. Maneja la configuración de la librería XLSX para asegurar la compatibilidad total con Microsoft Excel.

## Tecnologías Utilizadas
| Tecnologías Utilizadas | Uso                                                                          |
|------------------------|------------------------------------------------------------------------------|
| JavaScript (Vanilla)   | Procesamiento de lógica y manipulación de datos en el cliente.               |
| Bootstrap              | Framework de diseño para una interfaz robusta y 100% responsiva.             |
| Librería XLSX          | Motor para la generación y exportación de archivos Excel.                    |
| HTML5 / CSS3           | Estructura semántica y personalización de estilos para una estética moderna. |

## Valor Agregado
A diferencia de los validadores de XML estándar, esta herramienta está enfocada en la productividad. No solo "lee" los archivos, sino que permite al usuario interactuar con la información antes de exportarla, lo que la convierte en una herramienta versátil para flujos de trabajo contables, financieros o de auditoría.

### Aviso de uso
 Esta aplicación web está diseñada para la gestión y análisis de facturas XML. El uso y/o modificación de esta aplicación implica la aceptación de los siguientes términos:

    Responsabilidad del Usuario: Los datos procesados en la aplicación son proporcionados y gestionados bajo la exclusiva responsabilidad del usuario.
    Limitación de Garantías: La aplicación se ofrece "tal cual" sin garantías explícitas o implícitas, incluyendo, entre otras, las garantías de comerciabilidad o idoneidad para un propósito particular.
    Librerías Externas: La aplicación utiliza librerías de terceros, como `xlsx.js`, distribuida bajo la licencia MIT. Los derechos y restricciones asociados con estas librerías están sujetos a sus respectivas licencias.
    Propiedad Intelectual: El diseño, la lógica personalizada y el código generado son propiedad exclusiva del desarrollador, con excepción de las herramientas o librerías externas utilizadas.
    Restricciones de Uso: El código se comparte con fines educativos y de portafolio personal. Se prohíbe su uso comercial, venta o redistribución como parte de un producto derivado sin el consentimiento expreso del autor.

### Desarrollador
Carlos Solis - Desarrollo y Diseño Web.
