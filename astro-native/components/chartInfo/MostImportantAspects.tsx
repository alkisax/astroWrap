import { View, Text, StyleSheet, Pressable, Modal } from 'react-native'
import { useState } from 'react'
import { colors, aspectIcons, planetIcons, aspectKeywords, planetKeywords } from '../../constants/constants'

const MostImportantAspects = ({ aspects }: any) => {
  const [selected, setSelected] = useState<{
    p1: string
    p2: string
    type: string
  } | null>(null)

  if (!aspects?.length) return null

  return (
    <>
      <View style={styles.card}>
        <Text style={styles.title}>🔗 Aspects</Text>

        {aspects.map((a: any, i: number) => {
          const orb = a.orb != null ? a.orb.toFixed(2) : '?'

          return (
            <Pressable
              key={i}
              onPress={() =>
                setSelected({
                  p1: a.point1,
                  p2: a.point2,
                  type: a.type,
                })
              }
              style={styles.row}
            >
              <Text style={styles.cell}>
                {planetIcons[a.point1]} {a.point1}
              </Text>

              <Text style={styles.cell}>
                {aspectIcons[a.type]}
              </Text>

              <Text style={styles.cell}>
                {planetIcons[a.point2]} {a.point2}
              </Text>

              <Text style={styles.orb}>
                {a.type} ({orb}°)
              </Text>
            </Pressable>
          )
        })}
      </View>

      {/* 🔥 MODAL */}
      <Modal
        visible={!!selected}
        transparent
        animationType="fade"
        onRequestClose={() => setSelected(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selected && (
              <>
                <Text style={styles.modalTitle}>Aspect Details</Text>

                <Text style={styles.modalText}>
                  Aspects show how planets interact — harmony, tension, or flow.
                </Text>

                <View style={styles.modalBlock}>
                  <Text style={styles.modalPlanet}>
                    🪐 {selected.p1}
                  </Text>
                  <Text style={styles.modalKeywords}>
                    {planetKeywords[selected.p1 as keyof typeof planetKeywords]?.join(', ')}
                  </Text>

                  <Text style={styles.modalAspect}>
                    {aspectIcons[selected.type]} {selected.type}
                  </Text>
                  <Text style={styles.modalKeywords}>
                    {aspectKeywords[selected.type as keyof typeof aspectKeywords]?.join(', ')}
                  </Text>

                  <Text style={styles.modalPlanet}>
                    🪐 {selected.p2}
                  </Text>
                  <Text style={styles.modalKeywords}>
                    {planetKeywords[selected.p2 as keyof typeof planetKeywords]?.join(', ')}
                  </Text>
                </View>

                <Pressable
                  onPress={() => setSelected(null)}
                  style={styles.closeBtn}
                >
                  <Text style={styles.closeText}>Close</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  )
}

export default MostImportantAspects

const styles = StyleSheet.create({
  card: {
    gap: 6,
  },

  title: {
    textAlign: 'center',
    color: colors.dim,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 6,

    backgroundColor: 'rgba(255,255,255,0.02)',
  },

  cell: {
    color: colors.text,
    fontSize: 12,
  },

  orb: {
    color: colors.dim,
    fontSize: 11,
  },

  // 🔥 MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    width: '80%',
    borderRadius: 16,
    padding: 16,

    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  modalTitle: {
    color: colors.text,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },

  modalText: {
    color: colors.dim,
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
  },

  modalBlock: {
    alignItems: 'center',
    gap: 4,
  },

  modalPlanet: {
    color: colors.text,
    fontWeight: '600',
    marginTop: 6,
  },

  modalAspect: {
    color: colors.text,
    marginTop: 6,
  },

  modalKeywords: {
    color: colors.dim,
    fontSize: 12,
    textAlign: 'center',
  },

  closeBtn: {
    marginTop: 12,
    alignSelf: 'center',
  },

  closeText: {
    color: colors.primary,
  },
})