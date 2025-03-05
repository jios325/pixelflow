# Herramienta de Procesamiento de Imágenes

## Arquitectura General de la Aplicación

La aplicación es una herramienta web para procesamiento de imágenes por lotes que permite a los usuarios subir, visualizar, editar y optimizar imágenes a través de una interfaz intuitiva y funcional. La arquitectura se compone de las siguientes secciones principales:

1. **Área de carga de archivos**: Zona para arrastrar y soltar imágenes o seleccionarlas mediante un botón, con soporte para archivos de hasta 60MB.
2. **Visualización de imágenes**: Panel dividido que muestra las imágenes originales subidas y las imágenes procesadas.
3. **Panel de herramientas**: Sección que contiene diferentes herramientas para manipular las imágenes (optimizar, cambiar formato, redimensionar, recortar y renombrar).
4. **Controles de acción**: Botones para descargar las imágenes procesadas.

La aplicación mantiene un estado persistente que refleja las operaciones seleccionadas por el usuario, aplicándolas en tiempo real al lote completo de imágenes.

## Flujo de Usuario

1. El usuario inicia en la pantalla de carga de archivos donde puede arrastrar imágenes o seleccionarlas mediante un botón.
2. Una vez cargadas las imágenes, aparecen en el panel izquierdo "Imágenes subidas".
3. Las imágenes procesadas aparecen en el panel derecho "Imágenes Listas".
4. El usuario puede seleccionar diferentes herramientas para modificar las imágenes:
   - Activar/desactivar optimización
   - Cambiar formato de archivo
   - Redimensionar imágenes especificando dimensiones
   - Recortar seleccionando una zona específica
   - Renombrar archivos mediante diferentes opciones (secuencial, agregar texto, reemplazar texto)
5. Todas las modificaciones se muestran en tiempo real en el panel "Imágenes Listas".
6. Finalmente, el usuario puede descargar las imágenes procesadas.

## Componentes por Sección Funcional

### 1. Área de Carga de Archivos

#### Componente principal de carga

- **Componente**: `<Upload>`
- **Props relevantes**:
  - `accept="image/*"`
  - `listType="picture-card"`
  - `showUploadList={false}`
  - `multiple={true}`
  - `maxCount={20}`
  - `customRequest={customUploadFunction}`
  - `onChange={handleChange}`
  - `beforeUpload={beforeUploadValidator}`
- **Estilización**:
  - Borde redondeado con color violeta claro (#a855f7 con opacidad)
  - Contenido centrado en ambos ejes
  - Icono de upload con color violeta (#a855f7)
  - Texto descriptivo en color violeta

```jsx
<Upload.Dragger 
  accept="image/*"
  multiple={true}
  maxCount={20}
  showUploadList={false}
  onChange={handleChange}
  style={{ borderColor: '#a855f7', borderRadius: '8px', padding: '60px 20px' }}
>
  <p className="ant-upload-drag-icon">
    <UploadOutlined style={{ color: '#a855f7', fontSize: '32px' }} />
  </p>
  <p className="ant-upload-text" style={{ color: '#a855f7' }}>Arrastra tus imágenes aquí</p>
  <p className="ant-upload-hint" style={{ color: '#a855f7' }}>Hasta 20 imágenes</p>
</Upload.Dragger>
```

#### Texto informativo

- **Componente**: `<Typography.Text>`
- **Props relevantes**:
  - `type="secondary"`
- **Estilización**:
  - Tamaño pequeño
  - Color gris claro

#### Botón de descarga

- **Componente**: `<Button>`
- **Props relevantes**:
  - `type="default"`
  - `icon={<DownloadOutlined />}`
  - `onClick={handleDownload}`
- **Estilización**:
  - Borde redondeado con color violeta claro (#a855f7)
  - Texto en color violeta (#a855f7)
  - Sin fondo (ghost)

### 2. Visualización de Imágenes

#### Panel de imágenes subidas

- **Componente**: `<Card>` + `<List>`
- **Props relevantes para Card**:
  - `title="Imagenes subidas"`
  - `bordered={true}`
  - `style={{ borderRadius: '8px' }}`
- **Props relevantes para List**:
  - `dataSource={uploadedImages}`
  - `renderItem={renderImageItem}`
  - `grid={{ gutter: 16, column: 1 }}`
- **Estilización**:
  - Borde redondeado con color violeta claro
  - Cabecera con icono específico

#### Panel de imágenes procesadas

- **Componente**: `<Card>` + `<List>`
- **Props relevantes para Card**:
  - `title="Imagenes Listas"`
  - `bordered={true}`
  - `style={{ borderRadius: '8px' }}`
- **Props relevantes para List**:
  - `dataSource={processedImages}`
  - `renderItem={renderProcessedImageItem}`
  - `grid={{ gutter: 16, column: 2 }}`
- **Estilización**:
  - Borde redondeado con color violeta claro
  - Layout de 2 columnas para las imágenes

#### Item de imagen individual

- **Componente**: `<List.Item>` + `<Card>`
- **Props relevantes para Card**:
  - `hoverable={true}`
  - `cover={<img src={...} />}`
- **Estilización**:
  - Tamaño pequeño y compacto
  - Información de tamaño y formato como etiquetas

### 3. Panel de Herramientas

#### Contenedor de herramientas

- **Componente**: `<Card>`
- **Props relevantes**:
  - `title={<span><ToolOutlined /> Herramientas</span>}`
  - `bordered={true}`
- **Estilización**:
  - Subtítulo en color violeta (#a855f7)
  - Icono correspondiente
  - Texto descriptivo pequeño

#### Switch de optimización

- **Componente**: `<Switch>`
- **Props relevantes**:
  - `checked={optimizeEnabled}`
  - `onChange={toggleOptimize}`
- **Estilización**:
  - Color activo violeta (#a855f7)
  - Etiqueta con texto "Optimizar"

#### Sección de formato

- **Componente**: `<Form.Item>` + `<Select>` + `<Button>`
- **Props relevantes para Form.Item**:
  - `label="Formato"`
- **Props relevantes para Select**:
  - `options={formatOptions}`
  - `defaultValue="JPG"`
  - `onChange={handleFormatChange}`
- **Props relevantes para Button**:
  - `type="link"`
  - `size="small"`
- **Estilización**:
  - Títulos en color violeta (#a855f7)
  - Botón "Agregar Formato" en violeta (#a855f7)
  - Selector con borde redondeado

#### Sección de redimensión

- **Componente**: `<Form.Item>` + `<Space>` + `<Select>` + `<InputNumber>`
- **Props relevantes para Form.Item**:
  - `label="Redimensión"`
- **Props relevantes para Select**:
  - `options={resizeUnitOptions}`
  - `defaultValue="Pixeles"`
- **Props relevantes para InputNumber**:
  - `min={0}`
  - `placeholder="00"`
  - `addonAfter="px"`
- **Estilización**:
  - Título en color violeta (#a855f7)
  - Campos de entrada con bordes redondeados
  - Layout horizontal con etiquetas "W" y "H"

#### Sección de corte de imagen

- **Componente**: `<Form.Item>` + `<Space>` + `<InputNumber>` + `<Select>`
- **Props relevantes para Form.Item**:
  - `label="Corte de imagen"`
- **Props relevantes para InputNumber**:
  - Similares a los de redimensión
- **Props relevantes para Select**:
  - `options={cropAreaOptions}`
  - `defaultValue="Corte zona Central"`
- **Estilización**:
  - Similar a la sección de redimensión

### 4. Sección de Renombrado de Archivos

#### Título de la sección

- **Componente**: `<Typography.Title>`
- **Props relevantes**:
  - `level={5}`
  - `icon={<FileTextOutlined />}`
- **Estilización**:
  - Color violeta (#a855f7)
  - Icono a la izquierda

#### Opciones de limpieza de texto

- **Componente**: `<Switch>` + `<Typography.Paragraph>`
- **Props relevantes para Switch**:
  - `checked={cleanTextEnabled}`
  - `onChange={toggleCleanText}`
- **Props relevantes para Typography.Paragraph**:
  - `type="secondary"`
  - `style={{ fontSize: 'small' }}`
- **Estilización**:
  - Color activo violeta (#a855f7)
  - Texto descriptivo pequeño y gris

#### Radio group para opciones de renombrado

- **Componente**: `<Radio.Group>`
- **Props relevantes**:
  - `options={renameOptions}`
  - `value={selectedRenameOption}`
  - `onChange={handleRenameOptionChange}`
- **Estilización**:
  - Radio buttons con color activo violeta (#a855f7)
  - Distribución vertical

#### Campos para opciones de secuencia

- **Componente**: `<Radio>` + `<Form>` + `<Input>` + `<Select>`
- **Props relevantes para Radio**:
  - `value="sequential"`
- **Props relevantes para Form**:
  - Layout horizontal para etiquetas y campos
- **Props relevantes para Input**:
  - Placeholder relevante para cada campo
- **Props relevantes para Select**:
  - Opciones para posición de número y separador
- **Estilización**:
  - Inputs con bordes redondeados
  - Márgenes apropiados para jerarquía visual

#### Campos para agregar/reemplazar texto

- **Componente**: Similar al anterior, con `<Input>` + `<Select>`
- **Props relevantes**:
  - Específicos para cada modo (agregar/reemplazar)
- **Estilización**:
  - Consistente con el resto de la interfaz

## Interacciones entre Estados

1. **Estado de carga inicial** (Imagen 1)
   - La aplicación muestra solo el área de carga sin imágenes visibles.
   - Panel de herramientas visible pero inactivo hasta que se carguen imágenes.

2. **Estado con imágenes cargadas** (Imagen 4-6)
   - Se muestran los paneles de "Imágenes subidas" e "Imágenes Listas".
   - Todas las herramientas están activas y listas para usar.

3. **Interacción con opciones de renombrado** (Imágenes 1-3)
   - Según la opción seleccionada en el grupo de radio buttons, aparecen diferentes controles:
     - **Secuencial**: Muestra campos para prefijo/sufijo, posición, separador y dígitos.
     - **Agregar texto**: Muestra campo para texto a agregar y selector de posición.
     - **Reemplazar texto**: Muestra campos para buscar texto y reemplazarlo.

4. **Aplicación de cambios**
   - Las modificaciones se reflejan en tiempo real en el panel "Imágenes Listas".
   - El botón "Descargar" se activa cuando hay imágenes procesadas.

## Recomendaciones para la Implementación

### Estructura de Componentes React

```
src/
├── components/
│   ├── ImageUploader/
│   │   ├── UploadArea.jsx
│   │   └── UploadedImagesList.jsx
│   ├── ImageProcessor/
│   │   ├── ProcessedImagesList.jsx
│   │   └── ImageItem.jsx
│   ├── Tools/
│   │   ├── ToolsPanel.jsx
│   │   ├── FormatTool.jsx
│   │   ├── ResizeTool.jsx
│   │   ├── CropTool.jsx
│   │   └── OptimizeTool.jsx
│   ├── RenameTools/
│   │   ├── RenamePanel.jsx
│   │   ├── SequentialRename.jsx
│   │   ├── AddTextRename.jsx
│   │   └── ReplaceTextRename.jsx
│   └── DownloadButton.jsx
├── hooks/
│   ├── useImageProcessor.js
│   ├── useImageUpload.js
│   └── useImageRename.js
├── utils/
│   ├── imageProcessing.js
│   └── fileHelpers.js
└── App.jsx
```

### Gestión de Estado

Para una aplicación como esta, se recomienda:

1. **Context API o Redux**: Para gestionar el estado global de imágenes y configuraciones.
2. **Custom Hooks**: Para encapsular la lógica de procesamiento de imágenes.
3. **Procesamiento asíncrono**: Manejar el procesamiento de imágenes en workers separados para no bloquear la UI.

### Consideraciones Técnicas

1. **Optimización de rendimiento**:
   - Procesamiento de imágenes por lotes pequeños para evitar bloquear el navegador
   - Uso de Web Workers para operaciones intensivas como redimensionamiento
   - Virtualización de listas para manejar grandes cantidades de imágenes

2. **Biblioteca de procesamiento de imágenes**:
   - Se recomienda usar bibliotecas como `sharp` (en backend) o `pica` (en frontend) para procesamiento eficiente

3. **Carga progresiva**:
   - Implementar carga progresiva para mostrar las imágenes procesadas gradualmente

4. **Accesibilidad**:
   - Asegurar que todos los elementos interactivos tengan etiquetas accesibles
   - Mantener un contraste adecuado para textos y controles

### Personalización de Ant Design

Para lograr la apariencia visual mostrada en las capturas:

```jsx
// theme.js
export const theme = {
  token: {
    colorPrimary: '#a855f7',
    borderRadius: 8,
    colorBgContainer: '#ffffff',
    fontFamily: 'Segoe UI, system-ui, sans-serif',
  },
  components: {
    Card: {
      headerBg: '#f9f9f9',
      borderRadiusLG: 8,
    },
    Button: {
      borderRadius: 8,
      paddingInline: 16,
    },
    Input: {
      borderRadius: 6,
    },
    Select: {
      borderRadius: 6,
    },
    Switch: {
      colorPrimary: '#a855f7',
    },
    Radio: {
      colorPrimary: '#a855f7',
    },
  },
};
```

## Conclusión

La herramienta de procesamiento de imágenes analizada presenta una interfaz intuitiva con múltiples funcionalidades bien organizadas. La implementación con Ant Design permite una estructura limpia y modular, además de ofrecer la flexibilidad necesaria para personalizar la apariencia según los requisitos específicos del proyecto.

Se recomienda implementar la lógica de procesamiento de imágenes de manera eficiente, posiblemente delegando tareas intensivas al backend o utilizando Web Workers para mantener una experiencia de usuario fluida incluso con grandes cantidades de imágenes.