import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#7152EC',
    borderBottomStyle: 'solid',
    paddingBottom: 10
  },
  headerLeft: {
    flex: 1
  },
  headerRight: {
    width: 80,
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#004ce3',
    marginBottom: 3
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4B5563',
    marginBottom: 5
  },
  companyInfo: {
    fontSize: 8,
    color: '#6B7280',
    marginTop: 3
  },
  logo: {
    width: 70,
    height: 70
  },
  folio: {
    fontSize: 10,
    color: '#0E9E6E',
    marginTop: 2
  },
  section: {
    marginBottom: 10,
    padding: 10
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#7152EC',
    paddingLeft: 8
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937'
  },
  field: {
    width: '50%',
    marginBottom: 5,
    padding: 3
  },
  label: {
    fontSize: 8,
    color: '#6B7280',
    marginBottom: 1
  },
  value: {
    fontSize: 9,
    color: '#1F2937',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 1
  },
  textArea: {
    marginTop: 5,
    padding: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#FE6F00',
    fontSize: 9,
    color: '#1F2937',
    minHeight: 40
  },
  checklistGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5
  },
  checklistItem: {
    width: '20%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  checkbox: {
    width: 8,
    height: 8,
    borderWidth: 1,
    borderColor: '#0E9E6E',
    marginRight: 5
  },
  checkboxChecked: {
    backgroundColor: '#0E9E6E'
  },
  checkboxLabel: {
    fontSize: 8,
    color: '#1F2937',
    padding: 25
  },
  firmas: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  firma: {
    width: '45%',
    alignItems: 'center'
  },
  firmaLinea: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 3
  },
  firmaNombre: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1C64F1',
    marginBottom: 1
  },
  firmaSubtitulo: {
    fontSize: 8,
    color: '#6B7280'
  }
});

const OrdenPDF = ({ formData }) => (
  <Document>
    <Page size="A4" style={styles.page} wrap={false}>
      {/* Header con logo */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Orden de Servicio</Text>
          <Text style={styles.subtitle}>AutoCheckMaster</Text>
          <Text style={styles.companyInfo}>
            Av. Principal #123, Ciudad{'\n'}
            Tel: (555) 123-4567{'\n'}
            Email: contacto@autocheckmaster.com
          </Text>
          {formData.folio && (
            <Text style={styles.folio}>Folio: {formData.folio}</Text>
          )}
        </View>
        <View style={styles.headerRight}>
          <Image src="https://i.postimg.cc/MK7JY6ND/Logo.png" style={styles.logo} />
        </View>
      </View>

      {/* Cliente y Vehículo en Grid */}
      <View style={{ flexDirection: 'row', gap: 20, marginBottom: 10 }}>
        {/* Cliente */}
        <View style={[styles.section, { flex: 1, borderLeftColor: '#7152EC' }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Información del Cliente</Text>
          </View>
          <View style={styles.grid}>
            {[
              { label: 'Nombre:', value: formData.nombre },
              { label: 'Teléfono:', value: formData.telefono },
              { label: 'Correo:', value: formData.correo }
            ].map((item, index) => (
              <View key={index} style={styles.field}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.value}>{String(item.value || '_________________')}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Vehículo */}
        <View style={[styles.section, { flex: 1, borderLeftColor: '#1C64F1' }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Información del Vehículo</Text>
          </View>
          <View style={styles.grid}>
            {[
              { label: 'No. Serie:', value: formData.noSerie },
              { label: 'Placa:', value: formData.placa },
              { label: 'Modelo:', value: formData.modelo },
              { label: 'Marca:', value: formData.marca }
            ].map((item, index) => (
              <View key={index} style={styles.field}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.value}>{String(item.value || '_________________')}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Servicio y Tiempos */}
      <View style={{ flexDirection: 'row', gap: 20, marginBottom: 10 }}>
        <View style={[styles.section, { flex: 1, borderLeftColor: '#7152EC' }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Datos del Servicio</Text>
          </View>
          <View style={styles.grid}>
            {[
              { label: 'Técnico responsable:', value: formData.tecnico },
              { label: 'Tipo de servicio:', value: formData.servicio }
            ].map((item, index) => (
              <View key={index} style={styles.field}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.value}>{String(item.value || '_________________')}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.section, { flex: 1, borderLeftColor: '#1C64F1' }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Control de Tiempos</Text>
          </View>
          <View style={styles.grid}>
            {[
              { label: 'Inicio:', value: formData.fechaInicio },
              { label: 'Finalización:', value: formData.fechaFin }
            ].map((item, index) => (
              <View key={index} style={styles.field}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.value}>{String(item.value || '_________________')}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Descripción, Insumos y Observaciones en una fila */}
      <View style={[styles.section, { borderLeftColor: '#FE6F00', marginBottom: 10 }]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Observaciones</Text>
        </View>
        <Text style={styles.textArea}>{String(formData.observaciones || 'Sin observaciones')}</Text>
      </View>

      {/* Checklist en una fila */}
      <View style={[styles.section, { borderLeftColor: '#0E9E6E', marginBottom: 10 }]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Entrega del vehículo</Text>
        </View>
        <View style={styles.checklistGrid}>
          {[
              { key: 'documentos', label: 'Documentos' },
              { key: 'llaves', label: 'Llaves' },
              { key: 'herramientas', label: 'Herramientas' },
              { key: 'accesorios', label: 'Accesorios' },
              { key: 'combustible', label: 'Combustible' }
            ].map((item) => (
              <View key={item.key} style={styles.checklistItem}>
                <View style={[
                  styles.checkbox,
                  formData.checklist?.[item.key] && styles.checkboxChecked
                ]} />
                <Text style={styles.checkboxLabel}>{item.label}</Text>
              </View>
            ))}
        </View>
      </View>

      {/* Firmas */}
      <View style={styles.firmas}>
        <View style={styles.firma}>
          <View style={styles.firmaLinea} />
          <Text style={styles.firmaNombre}>Firma del Cliente</Text>
          <Text style={styles.firmaSubtitulo}>Autorización de trabajos</Text>
        </View>
        <View style={styles.firma}>
          <View style={styles.firmaLinea} />
          <Text style={styles.firmaNombre}>Firma del Técnico</Text>
          <Text style={styles.firmaSubtitulo}>Responsable del diagnóstico</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default OrdenPDF;