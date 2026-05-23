// Flowssom BreakExperience Component
// Full break modal with all techniques

import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TextInput } from 'react-native';
import { HapticButton } from '../shared/HapticButton';
import { GlassCard } from '../shared/GlassCard';
import { BreathingGuide } from './BreathingGuide';
import { MicroBreakPrompt } from './MicroBreakPrompt';
import { useSettingsStore } from '../../stores/settingsStore';
import { useStatsStore } from '../../stores/statsStore';
import { getTheme } from '../../constants/themes';
import { getDefaultBreakTechniques, Technique } from '../../constants/techniques';
import { formatTime } from '../../utils/formatTime';

interface BreakExperienceProps {
  visible: boolean;
  breakType: 'shortBreak' | 'longBreak';
  duration: number; // in seconds
  onClose: () => void;
}

export const BreakExperience: React.FC<BreakExperienceProps> = ({
  visible,
  breakType,
  duration,
  onClose,
}) => {
  const { themeMode, preferredBreakTechnique } = useSettingsStore();
  const { colors } = getTheme(themeMode);
  const addJournalEntry = useStatsStore((state) => state.addJournalEntry);
  
  const [selectedTechniqueId, setSelectedTechniqueId] = useState(preferredBreakTechnique);
  const [journalText, setJournalText] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(duration);

  const techniques = getDefaultBreakTechniques();
  const currentTechnique = techniques.find(t => t.id === selectedTechniqueId) || techniques[0];

  // Timer for break countdown
  React.useEffect(() => {
    if (!visible) return;
    
    setTimeRemaining(duration);
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [visible, duration]);

  const handleJournalSubmit = () => {
    if (journalText.trim()) {
      addJournalEntry(journalText);
      setJournalText('');
    }
  };

  const renderTechniqueContent = () => {
    switch (currentTechnique.type) {
      case 'breathe':
        return <BreathingGuide technique={currentTechnique} />;
      
      case 'move':
      case 'eyes':
        return <MicroBreakPrompt technique={currentTechnique} />;
      
      case 'mind':
        return (
          <View style={styles.mindContainer}>
            <Text style={[styles.mindLabel, { color: colors.textSecondary }]}>
              What's one thought you're carrying right now?
            </Text>
            <TextInput
              style={[
                styles.journalInput,
                { 
                  backgroundColor: colors.surface,
                  color: colors.textPrimary,
                  borderColor: colors.backgroundSecondary,
                }
              ]}
              placeholder="Write it down to set it aside..."
              placeholderTextColor={colors.textTertiary}
              multiline
              value={journalText}
              onChangeText={setJournalText}
            />
            <HapticButton
              onPress={handleJournalSubmit}
              title="Set it aside"
              variant="primary"
              themeMode={themeMode}
            />
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <GlassCard style={styles.card} intensity={60}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.breakTitle, { color: colors.textPrimary }]}>
              {breakType === 'shortBreak' ? 'Short Break' : 'Long Break'}
            </Text>
            <Text style={[styles.breakTimer, { color: colors.accent }]}>
              {formatTime(timeRemaining)}
            </Text>
          </View>

          {/* Technique Selector */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.techniqueSelector}
          >
            {techniques.map((tech) => (
              <HapticButton
                key={tech.id}
                onPress={() => setSelectedTechniqueId(tech.id)}
                title={tech.name}
                variant={selectedTechniqueId === tech.id ? 'primary' : 'secondary'}
                size="small"
                themeMode={themeMode}
                style={styles.techniqueButton}
              />
            ))}
          </ScrollView>

          {/* Technique Content */}
          <View style={styles.content}>
            {renderTechniqueContent()}
          </View>

          {/* Close Button */}
          <View style={styles.footer}>
            <HapticButton
              onPress={onClose}
              title="End Break Early"
              variant="tertiary"
              themeMode={themeMode}
            />
          </View>
        </GlassCard>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 24,
  },
  card: {
    width: '100%',
    maxHeight: '80%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  breakTitle: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 8,
  },
  breakTimer: {
    fontSize: 36,
    fontWeight: '200',
    fontVariant: ['tabular-nums'],
  },
  techniqueSelector: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  techniqueButton: {
    marginRight: 8,
  },
  content: {
    minHeight: 300,
    justifyContent: 'center',
  },
  mindContainer: {
    gap: 16,
    padding: 16,
  },
  mindLabel: {
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
  journalInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    lineHeight: 28,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default BreakExperience;
