// Flowssom Rooms Store
// Focus Rooms with Supabase Realtime presence

import { create } from 'zustand';
import { supabase } from '../utils/supabaseClient';

export interface RoomParticipant {
  id: string;
  name: string;
  status: 'focusing' | 'onBreak' | 'idle';
  lastSeen: string;
}

export interface Room {
  code: string;
  name: string;
  participants: RoomParticipant[];
  createdAt: string;
}

interface RoomsState {
  // Current room state
  currentRoom: Room | null;
  isJoined: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  createRoom: (name?: string) => Promise<string | null>;
  joinRoom: (code: string) => Promise<boolean>;
  leaveRoom: () => Promise<void>;
  updateStatus: (status: RoomParticipant['status']) => void;
  clearError: () => void;
}

const generateAnonymousName = (): string => {
  const adjectives = ['Focused', 'Calm', 'Peaceful', 'Quiet', 'Mindful', 'Serene', 'Tranquil', 'Still'];
  const nouns = ['Friend', 'Soul', 'Mind', 'Spirit', 'Seeker', 'Dreamer', 'Thinker', 'Being'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 100);
  return `${adj} ${noun} ${num}`;
};

export const useRoomsStore = create<RoomsState>((set, get) => ({
  currentRoom: null,
  isJoined: false,
  isLoading: false,
  error: null,

  createRoom: async (name?: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const roomCode = generateRoomCode();
      const participantName = generateAnonymousName();
      
      const newRoom: Room = {
        code: roomCode,
        name: name || 'Quiet Room',
        participants: [{
          id: Date.now().toString(),
          name: participantName,
          status: 'idle',
          lastSeen: new Date().toISOString(),
        }],
        createdAt: new Date().toISOString(),
      };
      
      // Insert room into Supabase
      const { data, error } = await supabase
        .from('rooms')
        .insert({
          code: roomCode,
          name: newRoom.name,
          participants: newRoom.participants,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      set({
        currentRoom: newRoom,
        isJoined: true,
        isLoading: false,
      });
      
      // Subscribe to room updates
      subscribeToRoom(roomCode);
      
      return roomCode;
    } catch (err: any) {
      set({
        error: err.message || 'Failed to create room',
        isLoading: false,
      });
      return null;
    }
  },

  joinRoom: async (code: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const normalizedCode = code.toUpperCase().trim();
      const participantName = generateAnonymousName();
      
      // Fetch existing room
      const { data: room, error: fetchError } = await supabase
        .from('rooms')
        .select('*')
        .eq('code', normalizedCode)
        .single();
      
      if (fetchError || !room) {
        throw new Error('Room not found');
      }
      
      // Add participant
      const newParticipant: RoomParticipant = {
        id: Date.now().toString(),
        name: participantName,
        status: 'idle',
        lastSeen: new Date().toISOString(),
      };
      
      const updatedParticipants = [...(room.participants || []), newParticipant];
      
      const { error: updateError } = await supabase
        .from('rooms')
        .update({ participants: updatedParticipants })
        .eq('code', normalizedCode);
      
      if (updateError) throw updateError;
      
      set({
        currentRoom: {
          ...room,
          participants: updatedParticipants,
        },
        isJoined: true,
        isLoading: false,
      });
      
      // Subscribe to room updates
      subscribeToRoom(normalizedCode);
      
      return true;
    } catch (err: any) {
      set({
        error: err.message || 'Failed to join room',
        isLoading: false,
      });
      return false;
    }
  },

  leaveRoom: async () => {
    const { currentRoom } = get();
    
    if (!currentRoom) return;
    
    try {
      // Remove self from room (in a real app, we'd track our participant ID)
      // For now, we'll just clear local state
      // In production, you'd want to properly remove the participant
      
      set({
        currentRoom: null,
        isJoined: false,
        error: null,
      });
      
      // Unsubscribe would happen here
    } catch (err: any) {
      console.error('Failed to leave room:', err);
    }
  },

  updateStatus: (status: RoomParticipant['status']) => {
    const { currentRoom } = get();
    if (!currentRoom) return;
    
    // Update local state immediately
    const updatedRoom = {
      ...currentRoom,
      participants: currentRoom.participants.map(p => 
        p.id === currentRoom.participants[0]?.id // First participant is "us"
          ? { ...p, status, lastSeen: new Date().toISOString() }
          : p
      ),
    };
    
    set({ currentRoom: updatedRoom });
    
    // Update in Supabase (debounced in production)
    updateRoomStatus(currentRoom.code, status);
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Helper functions
const generateRoomCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I, O, 0, 1 for clarity
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const subscribeToRoom = (roomCode: string) => {
  // In production, this would set up a Supabase Realtime subscription
  // For now, we'll skip the actual subscription logic
  console.log(`Subscribed to room: ${roomCode}`);
};

const updateRoomStatus = async (roomCode: string, status: RoomParticipant['status']) => {
  // In production, this would update the participant's status in Supabase
  console.log(`Updated status to ${status} in room ${roomCode}`);
};

// Export for use in utils
export { generateRoomCode };

export default useRoomsStore;
