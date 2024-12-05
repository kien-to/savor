import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import DropDownPicker from 'react-native-dropdown-picker';

const CountryScreen = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Hà Nội', value: 'hanoi' },
    { label: 'TP.HCM', value: 'hcmc' },
    { label: 'Đà Nẵng', value: 'da_nang' },
  ]);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bắt đầu</Text>
      <Text style={styles.label}>Chọn thành phố</Text>

      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder="Chọn thành phố"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
      />

      <View style={styles.checkboxContainer}>
        {/* <CheckBox value={isChecked} onValueChange={setIsChecked} /> */}
        <BouncyCheckbox
          isChecked={isChecked}
          fillColor="#036B52"
          size={20}
          onPress={() => setIsChecked(!isChecked)}
        />
        <Text style={styles.checkboxLabel}>
          Tôi đồng ý với <Text style={styles.linkText}>điều khoản</Text> và{' '}
          <Text style={styles.linkText}>chính sách bảo mật</Text>
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, isChecked ? styles.buttonActive : styles.buttonInactive]}
        disabled={!isChecked}
        onPress={() => {
          navigation.navigate('OnboardingScreen');
          alert('Đăng ký thành công!')
        }}
      >
        <Text style={styles.buttonText}>Đăng ký</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingVertical: 70,
    backgroundColor: '#FFF',
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  dropdown: {
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#F8F8F8',
  },
  dropdownContainer: {
    borderColor: '#E0E0E0',
  },
  dropdownText: {
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    // alignItems: 'center',
    marginBottom: 16,
  },
  checkboxLabel: {
    // marginLeft: 2,
    fontSize: 14,
  },
  linkText: {
    color: '#036B52',
    textDecorationLine: 'underline',
  },
  button: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#036B52',
  },
  buttonInactive: {
    backgroundColor: '#E0E0E0',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default CountryScreen;
