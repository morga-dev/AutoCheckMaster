import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#fff',
    fontFamily: 'Helvetica'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C64F1',
    marginBottom: 10
  },
  section: {
    marginBottom: 20
  },
  evidenciaBlock: {
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 10
  },
  evidenciaImg: {
    width: 180,
    height: 180,
    objectFit: 'cover',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  evidenciaTitulo: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2
  },
  evidenciaDesc: {
    fontSize: 10,
    color: '#374151'
  }
});

const EvidenciasChecklistPDF = ({ checklistItems }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Evidencias Fotográficas del Checklist</Text>
      <View style={styles.section}>
        {Object.entries(checklistItems)
          .filter(([_, val]) => val.evidencia)
          .map(([key, val], idx) => (
            <View key={idx} style={styles.evidenciaBlock}>
              <Text style={styles.evidenciaTitulo}>{key}</Text>
              <Image src={val.evidencia} style={styles.evidenciaImg} />
              <Text style={styles.evidenciaDesc}>{val.observacion || "Sin observaciones"}</Text>
            </View>
        ))}
        {Object.values(checklistItems).filter(val => val.evidencia).length === 0 && (
          <Text>No se adjuntaron evidencias fotográficas.</Text>
        )}
      </View>
    </Page>
  </Document>
);

export default EvidenciasChecklistPDF;