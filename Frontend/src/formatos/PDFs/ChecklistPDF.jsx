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
    marginBottom: 10,
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
    color: '#1C64F1',
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
  section: {
    marginBottom: 0
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap'
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
  checklistTable: {
    marginTop: 2,
    borderWidth: 1,
    borderColor: '#000000'
  },
  checklistHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: '#000000'
  },
  checklistCellHeader: {
    fontSize: 9,
    fontWeight: 'bold',
    padding: 2,
    borderRightWidth: 1,
    borderRightColor: '#000000'
  },
  checklistRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  checklistCell: {
    fontSize: 9,
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB'
  },
  checklistCellLast: {
    fontSize: 9,
    padding: 4
  },
  titleObservaciones: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  observaciones: {
    marginTop: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#0E9E6E',
    padding: 5,
    fontSize: 10,
  },
  firmas: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30
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
  },
  leyenda: {
    fontSize: 8,
    color: '#6B7280',
    marginTop: 6
  }
});

const ChecklistPDF = ({ formData, checklistItems }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header con logo */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Checklist de Vehículo</Text>
          <Text style={styles.subtitle}>AutoCheckMaster</Text>
          <Text style={styles.companyInfo}>
            Av. Principal #123, Ciudad{'\n'}
            Tel: (555) 123-4567{'\n'}
            Email: contacto@autocheckmaster.com
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Image src="https://i.postimg.cc/MK7JY6ND/Logo.png" style={styles.logo} />
        </View>
      </View>

      {/* Cliente y Vehículo en Grid */}
      <View style={{ flexDirection: 'row', gap: 15, marginBottom: 5 }}>
        {/* Cliente */}
        <View style={[styles.section, { flex: 1, borderLeftColor: '#7152EC' }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Información del Cliente</Text>
          </View>
          <View style={styles.grid}>
            { [
              { label: 'Nombre:', value: formData.nombre },
              { label: 'Teléfono:', value: formData.telefono },
              { label: 'Correo:', value: formData.correo }
            ].map((item, index) => (
              <View key={index} style={styles.field}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.value}>{item.value || '_________________'}</Text>
              </View>
            )) }
          </View>
        </View>
        {/* Vehículo */}
        <View style={[styles.section, { flex: 1, borderLeftColor: '#1C64F1' }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Información del Vehículo</Text>
          </View>
          <View style={styles.grid}>
            { [
              { label: 'No. Serie:', value: formData.noSerie },
              { label: 'Marca:', value: formData.marca },
              { label: 'Modelo:', value: formData.modelo },
              { label: 'Año:', value: formData.año },
              { label: 'Placas:', value: formData.placas },
              { label: 'Kilometraje', value: formData.kilometraje },
            ].map((item, index) => (
              <View key={index} style={styles.field}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.value}>{item.value || '_________________'}</Text>
              </View>
            )) }
          </View>
        </View>
      </View>

      {/* Tabla de Checklist */}
      <View style={styles.section}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: '#FE6F00' }]}>Inspección de Componentes</Text>
        </View>
        <View style={styles.checklistTable}>
          {/* Header */}
          <View style={styles.checklistHeader}>
            <Text style={[styles.checklistCellHeader, { flex: 2 }]}>Elemento</Text>
            <Text style={styles.checklistCellHeader}>Estado</Text>
            <Text style={styles.checklistCellHeader}>Observaciones</Text>
          </View>
          {/* Rows */}
          { Object.entries(checklistItems).map(([key, value], idx) => (
            <View key={idx} style={styles.checklistRow}>
              <Text style={[styles.checklistCell, { flex: 2 }]}>{key}</Text>
              <Text style={styles.checklistCell}>
                { value.estado === 'B' ? 'Bueno' : value.estado === 'R' ? 'Regular' : value.estado === 'M' ? 'Malo' : '' }
              </Text>
              <Text style={styles.checklistCellLast}>{value.observacion || ''}</Text>
            </View>
          )) }
        </View>
        {/* Leyenda */}
        <Text style={styles.leyenda}>
          Leyenda: Bueno = Sin daños (Funciona correctamente). Regular = Desgaste o detalles menores. Malo = Daños graves, requiere reparación o reemplazo.
        </Text>
      </View>

      {/* Observaciones generales */}
      <View style={styles.observaciones}>
        <Text style={styles.titleObservaciones}>Observaciones Generales</Text>
        <Text>{formData.observaciones || 'Sin observaciones'}</Text>
      </View>

      {/* Firmas */}
      <View style={styles.firmas}>
        <View style={styles.firma}>
          <View style={styles.firmaLinea} />
          <Text style={styles.firmaNombre}>Firma del Cliente</Text>
          <Text style={styles.firmaSubtitulo}>Autorización de revisión</Text>
        </View>
        <View style={styles.firma}>
          <View style={styles.firmaLinea} />
          <Text style={styles.firmaNombre}>Firma del Técnico</Text>
          <Text style={styles.firmaSubtitulo}>Responsable de la inspección</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default ChecklistPDF;