import { View, Text, StyleSheet } from 'react-native';

type ExerciseItemProps = {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
};

export default function ExerciseItem({ name, sets, reps, weight }: ExerciseItemProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.details}>
        <Text style={styles.detailText}>
          {sets} sets × {reps} reps
        </Text>
        {weight !== undefined && (
          <Text style={styles.weightText}>
            {weight > 0 ? `${weight} kg` : 'Bodyweight'}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 4,
  },
  details: {
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
});