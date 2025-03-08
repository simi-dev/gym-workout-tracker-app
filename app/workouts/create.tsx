import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, X, Save } from 'lucide-react-native';
import { saveWorkout } from '@/services/database';

type Exercise = {
  id: string;
  name: string;
  sets: string;
  reps: string;
};

export default function CreateWorkoutScreen() {
  const router = useRouter();
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: '1', name: '', sets: '', reps: '' },
  ]);
  const [isSaving, setIsSaving] = useState(false);

  const addExercise = () => {
    const newId = (exercises.length + 1).toString();
    setExercises([...exercises, { id: newId, name: '', sets: '', reps: '' }]);
  };

  const removeExercise = (id: string) => {
    if (exercises.length === 1) {
      Alert.alert('Cannot Remove', 'Workout must have at least one exercise');
      return;
    }
    setExercises(exercises.filter(exercise => exercise.id !== id));
  };

  const updateExercise = (id: string, field: keyof Exercise, value: string) => {
    setExercises(
      exercises.map(exercise => 
        exercise.id === id ? { ...exercise, [field]: value } : exercise
      )
    );
  };

  const handleSaveWorkout = async () => {
    try {
      // Validate workout name
      if (!workoutName.trim()) {
        Alert.alert('Missing Information', 'Please enter a workout name');
        return;
      }

      // Validate exercises
      const invalidExercises = exercises.filter(
        exercise => !exercise.name.trim() || !exercise.sets.trim() || !exercise.reps.trim()
      );

      if (invalidExercises.length > 0) {
        Alert.alert('Missing Information', 'Please complete all exercise fields');
        return;
      }

      setIsSaving(true);

      // Format exercises for database
      const formattedExercises = exercises.map(exercise => ({
        name: exercise.name.trim(),
        sets: parseInt(exercise.sets, 10),
        reps: parseInt(exercise.reps, 10),
      }));

      // Save to database
      await saveWorkout(workoutName.trim(), formattedExercises);

      Alert.alert('Success', 'Workout created successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save workout. Please try again.');
      console.error('Save workout error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <X size={24} color="#334155" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Workout</Text>
        <TouchableOpacity 
          onPress={handleSaveWorkout} 
          style={styles.saveButton}
          disabled={isSaving}
        >
          <Save size={24} color={isSaving ? "#94a3b8" : "#3b82f6"} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Workout Name</Text>
          <TextInput
            style={styles.input}
            value={workoutName}
            onChangeText={setWorkoutName}
            placeholder="e.g., Full Body Workout"
            placeholderTextColor="#94a3b8"
          />
        </View>

        <View style={styles.exercisesContainer}>
          <Text style={styles.sectionTitle}>Exercises</Text>
          
          {exercises.map((exercise, index) => (
            <View key={exercise.id} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseNumber}>Exercise {index + 1}</Text>
                <TouchableOpacity 
                  onPress={() => removeExercise(exercise.id)}
                  style={styles.removeButton}
                >
                  <X size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Exercise Name</Text>
                <TextInput
                  style={styles.input}
                  value={exercise.name}
                  onChangeText={(value) => updateExercise(exercise.id, 'name', value)}
                  placeholder="e.g., Squats"
                  placeholderTextColor="#94a3b8"
                />
              </View>
              
              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.label}>Sets</Text>
                  <TextInput
                    style={styles.input}
                    value={exercise.sets}
                    onChangeText={(value) => updateExercise(exercise.id, 'sets', value)}
                    placeholder="e.g., 3"
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Reps</Text>
                  <TextInput
                    style={styles.input}
                    value={exercise.reps}
                    onChangeText={(value) => updateExercise(exercise.id, 'reps', value)}
                    placeholder="e.g., 12"
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>
          ))}
          
          <TouchableOpacity 
            style={styles.addExerciseButton}
            onPress={addExercise}
          >
            <Plus size={20} color="#3b82f6" />
            <Text style={styles.addExerciseText}>Add Exercise</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.saveWorkoutButton, isSaving && styles.saveWorkoutButtonDisabled]}
          onPress={handleSaveWorkout}
          disabled={isSaving}
        >
          <Text style={styles.saveWorkoutText}>
            {isSaving ? 'Saving...' : 'Save Workout'}
          </Text>
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
  saveButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  formGroup: {
    marginBottom: 15,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: '#334155',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 15,
  },
  exercisesContainer: {
    marginTop: 10,
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
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  exerciseNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  removeButton: {
    padding: 5,
  },
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  addExerciseText: {
    marginLeft: 5,
    color: '#3b82f6',
    fontWeight: '500',
  },
  footer: {
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  saveWorkoutButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
  },
  saveWorkoutButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  saveWorkoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});