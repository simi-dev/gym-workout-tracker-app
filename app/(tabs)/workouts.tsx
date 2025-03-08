import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, CreditCard as Edit, Trash2 } from 'lucide-react-native';

// Sample data for workouts
const initialWorkouts = [
  {
    id: '1',
    name: 'Full Body Workout',
    exercises: [
      { name: 'Squats', sets: 3, reps: 12 },
      { name: 'Push-ups', sets: 3, reps: 15 },
      { name: 'Lunges', sets: 3, reps: 10 },
    ],
  },
  {
    id: '2',
    name: 'Upper Body Focus',
    exercises: [
      { name: 'Bench Press', sets: 4, reps: 8 },
      { name: 'Pull-ups', sets: 3, reps: 10 },
      { name: 'Shoulder Press', sets: 3, reps: 12 },
    ],
  },
];

export default function WorkoutsScreen() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState(initialWorkouts);

  const deleteWorkout = (id: string) => {
    setWorkouts(workouts.filter(workout => workout.id !== id));
  };

  const renderWorkoutItem = ({ item }: { item: typeof initialWorkouts[0] }) => (
    <View style={styles.workoutCard}>
      <View style={styles.workoutHeader}>
        <Text style={styles.workoutName}>{item.name}</Text>
        <View style={styles.workoutActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push(`/workouts/${item.id}`)}
          >
            <Edit size={18} color="#3b82f6" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => deleteWorkout(item.id)}
          >
            <Trash2 size={18} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.exerciseList}>
        {item.exercises.map((exercise, index) => (
          <View key={index} style={styles.exerciseItem}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.exerciseDetails}>
              {exercise.sets} sets × {exercise.reps} reps
            </Text>
          </View>
        ))}
      </View>
      
      <TouchableOpacity 
        style={styles.startButton}
        onPress={() => router.push(`/workouts/start/${item.id}`)}
      >
        <Text style={styles.startButtonText}>Start Workout</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={workouts}
        renderItem={renderWorkoutItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No workouts found</Text>
            <Text style={styles.emptySubtext}>Create your first workout to get started</Text>
          </View>
        }
      />
      
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/workouts/create')}
      >
        <Plus size={24} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  listContainer: {
    padding: 15,
  },
  workoutCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
  },
  workoutActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 10,
    padding: 5,
  },
  exerciseList: {
    marginBottom: 15,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  exerciseName: {
    fontSize: 16,
    color: '#334155',
  },
  exerciseDetails: {
    fontSize: 14,
    color: '#64748b',
  },
  startButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#3b82f6',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#64748b',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },
});