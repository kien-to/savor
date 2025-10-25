import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { storeManagementService } from '../../services/storeManagement';

interface DaySchedule {
  day: string;
  shortName: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
}

const SetWeeklyScheduleScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [showEarningsDetail, setShowEarningsDetail] = useState(false);
  const [schedule, setSchedule] = useState<DaySchedule[]>([
    { day: 'Monday', shortName: 'Mon', enabled: true, startTime: '05:00 PM', endTime: '05:30 PM' },
    { day: 'Tuesday', shortName: 'Tue', enabled: true, startTime: '05:00 PM', endTime: '05:30 PM' },
    { day: 'Wednesday', shortName: 'Wed', enabled: true, startTime: '05:00 PM', endTime: '05:30 PM' },
    { day: 'Thursday', shortName: 'Thu', enabled: true, startTime: '05:00 PM', endTime: '05:30 PM' },
    { day: 'Friday', shortName: 'Fri', enabled: true, startTime: '05:00 PM', endTime: '05:30 PM' },
    { day: 'Saturday', shortName: 'Sat', enabled: false, startTime: '05:00 PM', endTime: '05:30 PM' },
    { day: 'Sunday', shortName: 'Sun', enabled: false, startTime: '05:00 PM', endTime: '05:30 PM' },
  ]);

  const toggleDay = (index: number) => {
    const newSchedule = [...schedule];
    newSchedule[index].enabled = !newSchedule[index].enabled;
    setSchedule(newSchedule);
  };

  const updateTime = (index: number, field: 'startTime' | 'endTime', value: string) => {
    const newSchedule = [...schedule];
    newSchedule[index][field] = value;
    setSchedule(newSchedule);
  };

  // Calculate weekly earnings based on schedule and bag details
  const earnings = useMemo(() => {
    const bagSize = params.bagSize as string;
    const dailyBags = Number(params.dailyBags) || 3;
    const enabledDays = schedule.filter(day => day.enabled).length;
    const weeklyBags = enabledDays * dailyBags;
    
    let pricePerBag = 5.99; // Default medium
    switch (bagSize) {
      case 'small': pricePerBag = 4.99; break;
      case 'large': pricePerBag = 6.99; break;
    }

    const grossEarnings = weeklyBags * pricePerBag;
    const serviceFee = grossEarnings * 0.30; // 30% service fee
    const netEarnings = grossEarnings - serviceFee;

    return {
      weekly: netEarnings.toFixed(2),
      gross: grossEarnings.toFixed(2),
      fee: serviceFee.toFixed(2),
      bagCount: weeklyBags,
    };
  }, [schedule, params.bagSize, params.dailyBags]);

  const handleContinue = async () => {
    try {
        await storeManagementService.updateSchedule(
            schedule.map(s => ({
                day: s.day,
                enabled: s.enabled,
                startTime: s.startTime,
                endTime: s.endTime
            }))
        );
        
        router.push({
            pathname: '/SetupSuccessScreen',
            params: {
                ...params,
                schedule: JSON.stringify(schedule)
            }
        });
    } catch (error) {
        console.error('Failed to update schedule:', error);
        // Add error handling UI
    }
  };

  return (
    <View style={styles.container}>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Set weekly pickup schedule</Text>
        <Text style={styles.subtitle}>This schedule will repeat weekly</Text>

        <View style={styles.scheduleContainer}>
          {schedule.map((day, index) => (
            <View key={day.day} style={styles.dayRow}>
              <TouchableOpacity 
                style={styles.dayToggle}
                onPress={() => toggleDay(index)}
              >
                <View style={[
                  styles.checkbox,
                  day.enabled && styles.checkboxChecked
                ]}>
                  {day.enabled && (
                    <MaterialIcons name="check" size={18} color="#FFF" />
                  )}
                </View>
                <Text style={[
                  styles.dayText,
                  !day.enabled && styles.dayTextDisabled
                ]}>
                  {day.shortName}
                </Text>
              </TouchableOpacity>

              <View style={styles.timeInputs}>
                <TextInput
                  style={[
                    styles.timeInput,
                    !day.enabled && styles.timeInputDisabled
                  ]}
                  value={day.startTime}
                  onChangeText={(value) => updateTime(index, 'startTime', value)}
                  editable={day.enabled}
                />
                <Text style={styles.timeSeparator}>-</Text>
                <TextInput
                  style={[
                    styles.timeInput,
                    !day.enabled && styles.timeInputDisabled
                  ]}
                  value={day.endTime}
                  onChangeText={(value) => updateTime(index, 'endTime', value)}
                  editable={day.enabled}
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.earningsPanel}
        onPress={() => setShowEarningsDetail(!showEarningsDetail)}
      >
        <View style={styles.earningsHeader}>
          <Text style={styles.earningsTitle}>Earnings per week</Text>
          <View style={styles.earningsAmount}>
            <Text style={styles.earningsValue}>{earnings.weekly}USD</Text>
            <MaterialIcons 
              name={showEarningsDetail ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
              size={24} 
              color="#FFF" 
            />
          </View>
        </View>
        
        {showEarningsDetail && (
          <View style={styles.earningsDetail}>
            <Text style={styles.earningsDetailText}>
              {earnings.bagCount} × Medium Surprise Bag (price in app)
              <Text style={styles.earningsDetailAmount}>{earnings.gross}USD</Text>
            </Text>
            <Text style={styles.earningsDetailText}>
              {earnings.bagCount} × fee per sale
              <Text style={styles.earningsDetailAmount}>-{earnings.fee}USD</Text>
            </Text>
            <TouchableOpacity style={styles.moreInfoButton}>
              <Text style={styles.moreInfoText}>More about pricing</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleContinue}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  scheduleContainer: {
    marginBottom: 24,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dayToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#036B52',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#036B52',
  },
  dayText: {
    fontSize: 16,
    color: '#333',
  },
  dayTextDisabled: {
    color: '#999',
  },
  timeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    width: 100,
    textAlign: 'center',
  },
  timeInputDisabled: {
    backgroundColor: '#F5F5F5',
    color: '#999',
  },
  timeSeparator: {
    marginHorizontal: 8,
    color: '#666',
  },
  earningsPanel: {
    backgroundColor: '#036B52',
    padding: 16,
  },
  earningsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  earningsTitle: {
    color: '#FFF',
    fontSize: 16,
  },
  earningsAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  earningsValue: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  earningsDetail: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  earningsDetailText: {
    color: '#FFF',
    fontSize: 14,
    marginBottom: 8,
    justifyContent: 'space-between',
    display: 'flex',
  },
  earningsDetailAmount: {
    fontWeight: '600',
    marginLeft: 8,
  },
  moreInfoButton: {
    marginTop: 8,
  },
  moreInfoText: {
    color: '#FFF',
    textDecorationLine: 'underline',
  },
  continueButton: {
    backgroundColor: '#036B52',
    padding: 16,
    borderRadius: 8,
    margin: 20,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SetWeeklyScheduleScreen;