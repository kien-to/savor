import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface PhoneVerificationProps {
  code: string;
  setCode: (code: string) => void;
  maxLength?: number;
}

export default function PhoneVerification({ code, setCode, maxLength = 6 }: PhoneVerificationProps) {
  const inputRefs = Array(maxLength).fill(0).map(() => React.createRef<TextInput>());

  const handleCodeChange = (text: string, index: number) => {
    const newCode = code.split('');
    newCode[index] = text;
    setCode(newCode.join(''));

    if (text && index < maxLength - 1) {
      inputRefs[index + 1].current?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {Array(maxLength).fill(0).map((_, index) => (
        <TextInput
          key={index}
          ref={inputRefs[index]}
          style={styles.input}
          maxLength={1}
          keyboardType="number-pad"
          value={code[index] || ''}
          onChangeText={(text) => handleCodeChange(text, index)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  input: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    backgroundColor: 'white',
  },
}); 