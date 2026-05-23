// Flowssom Focus Rooms Screen
// Silent co-working with anonymous presence

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, ScrollView } from 'react-native';
import { HapticButton } from '../../components/shared/HapticButton';
import { useRoomsStore } from '../../stores/roomsStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { getTheme } from '../../constants/themes';
import { useHaptics } from '../../hooks/useHaptics';

export default function RoomsScreen() {
  const { themeMode } = useSettingsStore();
  const { colors } = getTheme(themeMode);
  const haptics = useHaptics();
  
  const { currentRoom, isJoined, isLoading, error, createRoom, joinRoom, leaveRoom } = useRoomsStore();
  
  const [roomCode, setRoomCode] = useState('');
  const [roomName, setRoomName] = useState('');

  const handleCreateRoom = async () => {
    await haptics.light();
    const code = await createRoom(roomName || undefined);
    if (code) {
      setRoomCode(code);
    }
  };

  const handleJoinRoom = async () => {
    await haptics.light();
    const success = await joinRoom(roomCode);
    if (success) {
      setRoomCode('');
    }
  };

  const handleLeaveRoom = async () => {
    await haptics.light();
    await leaveRoom();
  };

  const styles = createStyles(themeMode, colors);

  if (isJoined && currentRoom) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Focus Room</Text>
          
          <View style={styles.roomInfo}>
            <Text style={styles.roomName}>{currentRoom.name}</Text>
            <Text style={styles.roomCode}>Code: {currentRoom.code}</Text>
            
            <View style={styles.participants}>
              <Text style={styles.participantsTitle}>
                {currentRoom.participants.length} focusing with you
              </Text>
              
              {currentRoom.participants.map((participant, index) => (
                <View key={participant.id} style={styles.participant}>
                  <View style={[
                    styles.avatar,
                    { backgroundColor: colors.accent }
                  ]}>
                    <Text style={styles.avatarText}>
                      {participant.name.charAt(0)}
                    </Text>
                  </View>
                  <Text style={styles.participantName}>{participant.name}</Text>
                  <View style={[
                    styles.statusDot,
                    { backgroundColor: participant.status === 'focusing' ? '#4ade80' : '#fbbf24' }
                  ]} />
                </View>
              ))}
            </View>
          </View>

          <HapticButton
            onPress={handleLeaveRoom}
            title="Leave Room"
            variant="secondary"
            themeMode={themeMode}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Focus Rooms</Text>
          <Text style={styles.subtitle}>
            Silent co-working. Share a room code with friends and focus together.
          </Text>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Create Room */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Create a Room</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.backgroundSecondary, color: colors.textPrimary }]}
              placeholder="Room name (optional)"
              placeholderTextColor={colors.textTertiary}
              value={roomName}
              onChangeText={setRoomName}
            />
            <HapticButton
              onPress={handleCreateRoom}
              title="Create Room"
              variant="primary"
              disabled={isLoading}
              themeMode={themeMode}
            />
          </View>

          {/* Join Room */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Join a Room</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.backgroundSecondary, color: colors.textPrimary }]}
              placeholder="Enter 6-character code"
              placeholderTextColor={colors.textTertiary}
              value={roomCode}
              onChangeText={(text) => setRoomCode(text.toUpperCase())}
              maxLength={6}
            />
            <HapticButton
              onPress={handleJoinRoom}
              title="Join Room"
              variant="secondary"
              disabled={isLoading || roomCode.length !== 6}
              themeMode={themeMode}
            />
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              🤫 Rooms are silent - no chat, no video, no audio. Just knowing others are focusing alongside you.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (themeMode: string, colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '200',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  section: {
    width: '100%',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  errorContainer: {
    backgroundColor: 'rgba(191, 125, 125, 0.2)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
    width: '100%',
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    width: '100%',
  },
  infoText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
  roomInfo: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 32,
  },
  roomName: {
    fontSize: 24,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  roomCode: {
    fontSize: 18,
    color: colors.accent,
    fontFamily: 'monospace',
    marginBottom: 24,
  },
  participants: {
    width: '100%',
  },
  participantsTitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  participant: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: themeMode === 'dark' ? '#ffffff' : colors.background,
    fontWeight: '600',
  },
  participantName: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
