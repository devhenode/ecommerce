import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme';
import { Button } from '../common/Button';
import { Address } from '../../types/models';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (address: Omit<Address, 'id' | 'isDefault'>) => void;
};

export function AddressFormSheet({ visible, onClose, onSave }: Props) {
  const [label, setLabel] = useState('Home');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [line1, setLine1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const canSave = fullName.trim() && phone.trim() && line1.trim() && city.trim();

  function handleSave() {
    if (!canSave) return;
    onSave({ label, fullName, phone, line1, city, state });
    setFullName('');
    setPhone('');
    setLine1('');
    setCity('');
    setState('');
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <ScrollView keyboardShouldPersistTaps="handled">
            <Text style={typography.h2}>Add a new address</Text>
            <View style={styles.form}>
              <Field label="Label (e.g. Home, Office)" value={label} onChangeText={setLabel} />
              <Field label="Full name" value={fullName} onChangeText={setFullName} />
              <Field label="Phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
              <Field label="Address line" value={line1} onChangeText={setLine1} />
              <Field label="City" value={city} onChangeText={setCity} />
              <Field label="State" value={state} onChangeText={setState} />
            </View>
            <View style={styles.actions}>
              <Button label="Cancel" variant="secondary" onPress={onClose} style={styles.actionBtn} />
              <Button label="Save address" onPress={handleSave} disabled={!canSave} style={styles.actionBtn} />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function Field(props: { label: string; value: string; onChangeText: (v: string) => void; keyboardType?: 'default' | 'phone-pad' }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{props.label}</Text>
      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        keyboardType={props.keyboardType}
        style={styles.input}
        placeholderTextColor={colors.textMuted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    padding: spacing.lg,
    maxHeight: '85%',
  },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: spacing.md },
  form: { gap: spacing.md, marginTop: spacing.lg },
  field: { gap: spacing.xs },
  fieldLabel: { ...typography.captionStrong },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.body,
  },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl, marginBottom: spacing.lg },
  actionBtn: { flex: 1 },
});
