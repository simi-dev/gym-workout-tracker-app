import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { CreditCard as Edit, Trash2 } from 'lucide-react-native';
import ExerciseItem from './ExerciseItem';

type Exercise = {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
};

type WorkoutCardProps = {
  id: string;
  name: string;
  exercises: Exercise[];
  onDelete: (id: string) => void;
};

export default function WorkoutCard({ id, name, exercises, onDelete }: WorkoutCardProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push(`/workouts/${id}`)}
          >
            <Edit size={18} color="#3b82f6" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onDelete(id)}
          >
            <Trash2 size={18} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.exerciseList}>
        {exercises.map((exercise, index) => (
          <ExerciseItem 
            key={index}
            name={exercise.name}
            sets={exercise.sets}
            reps={exercise.reps}
            weight={exercise.weight}
          />
        ))}
      </View>
      
      <TouchableOpacity 
        style={styles.startButton}
        onPress={() => router.push(`/workouts/start/${id}`)}
      >
        <Text style={styles.startButtonText}>Start Workout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 10,
    padding: 5,
  },
  exerciseList: {
    marginBottom: 15,
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
});