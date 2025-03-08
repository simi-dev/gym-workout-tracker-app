import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Calendar } from 'lucide-react-native';

// Sample workout history data
const workoutHistory = [
  {
    id: '1',
    date: '2023-10-15',
    workout: 'Full Body Workout',
    duration: '45 min',
    exercises: [
      { name: 'Squats', sets: 3, reps: 12, weight: 60 },
      { name: 'Push-ups', sets: 3, reps: 15, weight: 0 },
      { name: 'Lunges', sets: 3, reps: 10, weight: 20 },
    ],
  },
  {
    id: '2',
    date: '2023-10-13',
    workout: 'Upper Body Focus',
    duration: '50 min',
    exercises: [
      { name: 'Bench Press', sets: 4, reps: 8, weight: 70 },
      { name: 'Pull-ups', sets: 3, reps: 10, weight: 0 },
      { name: 'Shoulder Press', sets: 3, reps: 12, weight: 40 },
    ],
  },
  {
    id: '3',
    date: '2023-10-10',
    workout: 'Leg Day',
    duration: '55 min',
    exercises: [
      { name: 'Squats', sets: 4, reps: 10, weight: 80 },
      { name: 'Leg Press', sets: 3, reps: 12, weight: 120 },
      { name: 'Calf Raises', sets: 3, reps: 15, weight: 40 },
    ],
  },
];

export default function HistoryScreen() {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderHistoryItem = ({ item }: { item: typeof workoutHistory[0] }) => (
    <View style={styles.historyCard}>
      <View style={styles.historyHeader}>
        <View style={styles.dateContainer}>
          <Calendar size={18} color="#3b82f6" />
          <Text style={styles.date}>{formatDate(item.date)}</Text>
        </View>
        <Text style={styles.duration}>{item.duration}</Text>
      </View>
      
      <Text style={styles.workoutName}>{item.workout}</Text>
      
      <View style={styles.exerciseList}>
        {item.exercises.map((exercise, index) => (
          <View key={index} style={styles.exerciseItem}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <View style={styles.exerciseDetails}>
              <Text style={styles.detailText}>
                {exercise.sets} sets × {exercise.reps} reps
              </Text>
              <Text style={styles.weightText}>
                {exercise.weight > 0 ? `${exercise.weight} kg` : 'Bodyweight'}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={workoutHistory}
        renderItem={renderHistoryItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No workout history</Text>
            <Text style={styles.emptySubtext}>Complete your first workout to see it here</Text>
          </View>
        }
      />
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
  historyCard: {
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
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    marginLeft: 5,
    fontSize: 14,
    color: '#64748b',
  },
  duration: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 10,
  },
  exerciseList: {
    marginTop: 5,
  },
  exerciseItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  exerciseName: {
    fontSize: 16,
    color: '#334155',
    marginBottom: 4,
  },
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailText: {
    fontSize: 14,
    color: '#64748b',
  },
  weightText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
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