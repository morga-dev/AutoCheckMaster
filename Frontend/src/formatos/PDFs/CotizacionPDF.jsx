import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 20, // Reducir el padding
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15, // Reducir margin
    borderBottomWidth: 2,
    borderBottomColor: '#7152EC',
    borderBottomStyle: 'solid',
    paddingBottom: 10 // Reducir padding
  },
  headerLeft: {
    flex: 1
  },
  headerRight: {
    width: 80, // Reducir tamaño del logo
    alignItems: 'center'
  },
  title: {
    fontSize: 20, // Reducir tamaño
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
    fontSize: 8, // Reducir tamaño
    color: '#6B7280',
    marginTop: 3
  },
  logo: {
    width: 70, // Reducir tamaño
    height: 70
  },
  section: {
    marginBottom: 10 // Reducir margin
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
    fontSize: 12, // Reducir tamaño
    fontWeight: 'bold',
    color: '#1F2937'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  field: {
    width: '50%',
    marginBottom: 5, // Reducir margin
    padding: 3 // Reducir padding
  },
  label: {
    fontSize: 8, // Reducir tamaño
    color: '#6B7280',
    marginBottom: 1
  },
  value: {
    fontSize: 9, // Reducir tamaño
    color: '#1F2937',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 1
  },
  table: {
    marginTop: 5 // Reducir margin
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 4, // Reducir padding
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    padding: 4 // Reducir padding
  },
  tableCell: {
    fontSize: 8, // Reducir tamaño
    color: '#1F2937'
  },
  observacionesCard: {
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FE6F00',
    padding: 5
  },
  totalesCard: {
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#0E9E6E',
    padding: 5
  },
  totalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 4,
    marginBottom: 3,
    backgroundColor: '#F9FAFB'
  },
  totalFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 4,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#0E9E6E'
  },
  firmas: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15 // Reducir margin
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

const CotizacionPDF = ({ formData, refacciones, manosDeObra, calcularTotales }) => (
  <Document>
    <Page size="A4" style={styles.page} wrap={false}>
      {/* Header con logo */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Hoja de Cotización</Text>
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

      {/* Cliente y Vehículo en Grid (igual que Checklist) */}
      <View style={{ flexDirection: 'row', gap: 15, marginBottom: 5 }}>
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
                <Text style={styles.value}>{item.value || '_________________'}</Text>
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
              { label: 'Marca:', value: formData.marca },
              { label: 'Modelo:', value: formData.modelo },
              { label: 'Año:', value: formData.año },
              { label: 'Placas:', value: formData.placas },
              { label: 'Kilometraje:', value: formData.kilometraje },
            ].map((item, index) => (
              <View key={index} style={styles.field}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.value}>{item.value || '_________________'}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Tablas de Refacciones y Mano de Obra */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detalle de Cotización</Text>
        
        {/* Tabla Refacciones */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={{ width: '15%' }}><Text style={styles.tableCell}>Cant.</Text></View>
            <View style={{ width: '45%' }}><Text style={styles.tableCell}>Descripción</Text></View>
            <View style={{ width: '20%' }}><Text style={styles.tableCell}>Precio Unit.</Text></View>
            <View style={{ width: '20%' }}><Text style={styles.tableCell}>Subtotal</Text></View>
          </View>
          {refacciones.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={{ width: '15%' }}><Text style={styles.tableCell}>{item.cantidad}</Text></View>
              <View style={{ width: '45%' }}><Text style={styles.tableCell}>{item.descripcion}</Text></View>
              <View style={{ width: '20%' }}><Text style={styles.tableCell}>${item.precio}</Text></View>
              <View style={{ width: '20%' }}><Text style={styles.tableCell}>${item.subtotal}</Text></View>
            </View>
          ))}
        </View>

        {/* Tabla Mano de Obra */}
        <View style={[styles.table, { marginTop: 20 }]}>
          <View style={styles.tableHeader}>
            <View style={{ width: '70%' }}><Text style={styles.tableCell}>Descripción del Servicio</Text></View>
            <View style={{ width: '30%' }}><Text style={styles.tableCell}>Importe</Text></View>
          </View>
          {manosDeObra.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={{ width: '70%' }}><Text style={styles.tableCell}>{item.descripcion}</Text></View>
              <View style={{ width: '30%' }}><Text style={styles.tableCell}>${item.precio}</Text></View>
            </View>
          ))}
        </View>
      </View>

      {/* Grid de Observaciones y Totales */}
      <View style={{ flexDirection: 'row', gap: 20, marginBottom: 30 }}>
        <View style={[styles.observacionesCard, { flex: 1 }]}>
          <Text style={[styles.cardTitle, { color: '#FE6F00' }]}>Observaciones</Text>
          <Text style={styles.value}>{formData.observaciones || 'Sin observaciones'}</Text>
        </View>

        <View style={[styles.totalesCard, { flex: 1 }]}>
          <Text style={[styles.cardTitle, { color: '#0E9E6E' }]}>Resumen de Costos</Text>
          <View style={styles.totalItem}>
            <Text style={styles.label}>Subtotal refacciones:</Text>
            <Text style={styles.value}>${calcularTotales().subtotalRefacciones}</Text>
          </View>
          <View style={styles.totalItem}>
            <Text style={styles.label}>Subtotal mano de obra:</Text>
            <Text style={styles.value}>${calcularTotales().subtotalManoDeObra}</Text>
          </View>
          <View style={styles.totalFinal}>
            <Text style={[styles.cardTitle, { color: '#0E9E6E' }]}>Total:</Text>
            <Text style={[styles.cardTitle, { color: '#0E9E6E' }]}>${calcularTotales().total}</Text>
          </View>
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

export default CotizacionPDF;