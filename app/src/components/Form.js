import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';


/** Form
props:
  - style
  - children
*/

/** FormField
props:
  - label
  - children
*/

const styles = StyleSheet.create({
  form: {
    paddingVertical: 10,
  },
  field: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  fieldLabel: {
    flex: 1,
  },
  fieldLabelText: {
    fontWeight: 'bold',
  },
  fieldValue: {
    flex: 2,
  },
});

const Form = ({ style, children }) => (
  <View style={[styles.form, style]}>
    { children }
  </View>
);

export default Form;

export const FormField = ({ label, children }) => (
  <View style={styles.field}>
    <View style={styles.fieldLabel}>
      <Text style={styles.fieldLabelText}>{ label }</Text>
    </View>
    <View style={styles.fieldValue}>
      { children }
    </View>
  </View>
);
