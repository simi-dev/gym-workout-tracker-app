import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { X, Check, ChevronRight, Timer } from 'lucide-react-native';

// Sample workout data - in a real app, you would fetch this from storage
const workouts = {
  '1': {
    id: '1',
    name: 'Full Body Workout',
    exercises: [
      { id: '1', name: 'Squats', sets: 3, reps: 12 },
      { id: '2', name: 'Push-ups', sets: 3, reps: 15 },
      { id: '3', name: 'Lunges', sets: 3, reps: 10 },
    ],
  },
  '2': {
    id: '2',
    name: 'Upper Body Focus',
    exercises: [
      { id: '1', name: 'Bench Press', sets: 4, reps: 8 },
      { id: '2', name: 'Pull-ups', sets: 3, reps: 10 },
      { id: '3', name: 'Shoulder Press', sets: 3, reps: 12 },
    ],
  },
};

type ExerciseSet = {
  completed: boolean;
  weight: string;
  reps: string;
};

type WorkoutExercise = {
  id: string;
  name: string;
  sets: ExerciseSet[];
};

export default function StartWorkoutScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  // Get the workout data based on the ID
  const workout = workouts[id as keyof typeof workouts];
  
  // Initialize workout exercises with tracking data
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>(
    workout?.exercises.map(exercise => ({
      id: exercise.id,
      name: exercise.name,
      sets: Array(exercise.sets).fill(0).map(() => ({
        completed: false,
        weight: '',
        reps: exercise.reps.toString(),
      })),
    })) || []
  );

  const [timer, setTimer] = useState({
    isRunning: false,
    startTime: 0,
    elapsedTime: 0,
  });

  // Start or pause the timer
  const toggleTimer = () => {
    if (timer.isRunning) {
      // Pause timer
      setTimer({
        ...timer,
        isRunning: false,
        elapsedTime: Date.now() - timer.startTime + timer.elapsedTime,
      });
    } else {
      // Start timer
      setTimer({
        ...timer,
        isRunning: true,
        startTime: Date.now(),
      });
    }
  };

  // Format elapsed time as mm:ss
  const formatTime = () => {
    const totalSeconds = Math.floor(
      (timer.isRunning 
        ? Date.now() - timer.startTime + timer.elapsedTime 
        : timer.elapsedTime) / 1000
    );
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Toggle set completion
  const toggleSetCompletion = (exerciseIndex: number, setIndex: number) => {
    const updatedExercises = [...workoutExercises];
    updatedExercises[exerciseIndex].sets[setIndex].completed = 
      !updatedExercises[exerciseIndex].sets[setIndex].completed;
    setWorkoutExercises(updatedExercises);
  };

  // Update set weight
  const updateSetWeight = (exerciseIndex: number, setIndex: number, weight: string) => {
    const updatedExercises = [...workoutExercises];
    updatedExercises[exerciseIndex].sets[setIndex].weight = weight;
    setWorkoutExercises(updatedExercises);
  };

  // Update set reps
  const updateSetReps = (exerciseIndex: number, setIndex: number, reps: string) => {
    const updatedExercises = [...workoutExercises];
    updatedExercises[exerciseIndex].sets[setIndex].reps = reps;
    setWorkoutExercises(updatedExercises);
  };

  // Complete workout
  const completeWorkout = () => {
    // Check if all sets are completed
    const allSetsCompleted = workoutExercises.every(exercise => 
      exercise.sets.every(set => set.completed)
    );

    if (!allSetsCompleted) {
      Alert.alert(
        'Incomplete Workout',
        'Not all sets are marked as completed. Do you want to finish anyway?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Finish Anyway', onPress: saveWorkoutHistory }
        ]
      );
    } else {
      saveWorkoutHistory();
    }
  };

  // Save workout to history
  const saveWorkoutHistory = () => {
    // Here you would save the workout to history storage
    // For now, we'll just go back to the workouts screen
    Alert.alert('Workout Completed', 'Your workout has been saved to history', [
      { text: 'OK', onPress: () => router.replace('/history') }
    ]);
  };

  if (!workout) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Workout not found</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <X size={24} color="#334155" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{workout.name}</Text>
        <TouchableOpacity onPress={completeWorkout} style={styles.completeButton}>
          <Check size={24} color="#22c55e" />
        </TouchableOpacity>
      </View>

      <View style={styles.timerContainer}>
        <TouchableOpacity 
          style={[styles.timerButton, timer.isRunning ? styles.timerRunning : {}]}
          onPress={toggleTimer}
        >
          <Timer size={20} color={timer.isRunning ? '#ffffff' : '#3b82f6'} />
          <Text style={[styles.timerText, timer.isRunning ? styles.timerTextRunning : {}]}>
            {formatTime()}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {workoutExercises.map((exercise, exerciseIndex) => (
          <View key={exercise.id} style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            
            <View style={styles.setsHeader}>
              <Text style={[styles.setHeaderText, { flex: 0.2 }]}>Set</Text>
              <Text style={[styles.setHeaderText, { flex: 0.3 }]}>Weight (kg)</Text>
              <Text style={[styles.setHeaderText, { flex: 0.3 }]}>Reps</Text>
              <Text style={[styles.setHeaderText, { flex: 0.2 }]}>Done</Text>
            </View>
            
            {exercise.sets.map((set, setIndex) => (
              <View key={setIndex} style={styles.setRow}>
                <Text style={[styles.setText, { flex: 0.2 }]}>{setIndex + 1}</Text>
                <View style={[styles.inputContainer, { flex: 0.3 }]}>
                  <TextInput
                    style={styles.input}
                    value={set.weight}
                    onChangeText={(value) => updateSetWeight(exerciseIndex, setIndex, value)}
                    placeholder="0"
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.inputContainer, { flex: 0.3 }]}>
                  <TextInput
                    style={styles.input}
                    value={set.reps}
                    onChangeText={(value) => updateSetReps(exerciseIndex, setIndex, value)}
                    placeholder="0"
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                  />
                </View>
                <TouchableOpacity 
                  style={[styles.checkButton, set.completed ? styles.checkButtonCompleted : {}]}
                  onPress={() => toggleSetCompletion(exerciseIndex, setIndex)}
                >
                  {set.completed && <Check size={16} color="#ffffff" />}
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.completeWorkoutButton}
          onPress={completeWorkout}
        >
          <Text style={styles.completeWorkoutText}>Complete Workout</Text>
          <ChevronRight size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
  },
  completeButton: {
    padding: 5,
  },
  timerContainer: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  timerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  timerRunning: {
    backgroundColor: '#3b82f6',
  },
  timerText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  timerTextRunning: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  exerciseCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 15,
  },
  setsHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginBottom: 10,
  },
  setHeaderText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  setText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  inputContainer: {
    marginHorizontal: 5,
  },
  input: {
    backgroundColor: '#f1f5f9',
    borderRadius: 5,
    padding: 8,
    textAlign: 'center',
    fontSize: 16,
    color: '#334155',
  },
  checkButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  checkButtonCompleted: {
    backgroundColor: '#3b82f6',
  },
  footer: {
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  completeWorkoutButton: {
    backgroundColor: '#22c55e',
    borderRadius: 5,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeWorkoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 5,
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  backButtonText: {
    color: '#3b82f6',
    fontSize: 16,
    textAlign: 'center',
  },
});