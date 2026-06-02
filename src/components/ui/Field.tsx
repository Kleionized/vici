import { useState } from 'react';
import { TextInput, View, type KeyboardTypeOptions, type TextStyle } from 'react-native';

import { colors, fonts, fontSize, radius, spacing, weight } from '@/lib/theme';
import { AppText } from './AppText';

export interface FieldProps {
  label?: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  multiline?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  helperText?: string;
}

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  secureTextEntry = false,
  keyboardType,
  autoCapitalize = 'sentences',
  helperText,
}: FieldProps) {
  const [focused, setFocused] = useState(false);
  const inputStyle: TextStyle = {
    fontFamily: fonts.body,
    fontSize: fontSize.md,
    fontWeight: weight.regular,
    color: colors.text,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: focused ? colors.borderStrong : colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: multiline ? 110 : undefined,
    textAlignVertical: multiline ? 'top' : 'center',
  };

  return (
    <View style={{ gap: spacing.sm }}>
      {label ? <AppText variant="label">{label}</AppText> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSofter}
        multiline={multiline}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={!secureTextEntry}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={inputStyle}
      />
      {helperText ? <AppText variant="soft">{helperText}</AppText> : null}
    </View>
  );
}
