import { useState } from 'react';
import { Pressable, TextInput, View, type KeyboardTypeOptions, type TextStyle } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { colors, fonts, fontSize, radius, shadow, spacing, weight } from '@/lib/theme';
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

function EyeIcon({ off, color }: { off: boolean; color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
      <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={1.8} />
      {off ? <Path d="M3 3l18 18" stroke={color} strokeWidth={1.8} strokeLinecap="round" /> : null}
    </Svg>
  );
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
  const [revealed, setRevealed] = useState(false);
  const inputStyle: TextStyle = {
    fontFamily: fonts.body,
    fontSize: fontSize.md,
    fontWeight: weight.regular,
    color: colors.text,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: focused ? colors.text : colors.border,
    borderRadius: radius.md,
    borderCurve: 'continuous',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
    paddingRight: secureTextEntry ? 48 : spacing.lg,
    minHeight: multiline ? 110 : undefined,
    textAlignVertical: multiline ? 'top' : 'center',
    ...(focused ? { boxShadow: '0 0 0 2px rgba(19,19,19,0.12)' } : shadow.control),
  };

  return (
    <View style={{ gap: spacing.sm }}>
      {label ? <AppText variant="label">{label}</AppText> : null}
      <View style={{ justifyContent: 'center' }}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSofter}
          multiline={multiline}
          secureTextEntry={secureTextEntry && !revealed}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={!secureTextEntry}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={inputStyle}
        />
        {secureTextEntry ? (
          <Pressable
            onPress={() => setRevealed((r) => !r)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={revealed ? 'Hide password' : 'Show password'}
            style={{ position: 'absolute', right: 14, top: 0, bottom: 0, justifyContent: 'center' }}>
            <EyeIcon off={revealed} color={colors.textSoft} />
          </Pressable>
        ) : null}
      </View>
      {helperText ? <AppText variant="soft">{helperText}</AppText> : null}
    </View>
  );
}
