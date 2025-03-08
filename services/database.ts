import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

// Open the database
const db = SQLite.openDatabase('workouts.db');

// Initialize database tables
export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Create workouts table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS workouts (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          created_at INTEGER NOT NULL
        );`,
        [],
        () => {
          // Create exercises table with foreign key to workouts
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS exercises (
              id TEXT PRIMARY KEY NOT NULL,
              workout_id TEXT NOT NULL,
              name TEXT NOT NULL,
              sets INTEGER NOT NULL,
              reps INTEGER NOT NULL,
              FOREIGN KEY (workout_id) REFERENCES workouts (id) ON DELETE CASCADE
            );`,
            [],
            () => resolve(true),
            (_, error) => reject(error)
          );
        },
        (_, error) => reject(error)
      );
    });
  });
};

// Save a new workout with its exercises
export const saveWorkout = async (
  name: string,
  exercises: { name: string; sets: number; reps: number }[]
) => {
  return new Promise((resolve, reject) => {
    const workoutId = Math.random().toString(36).substring(7);
    const timestamp = Date.now();

    db.transaction(tx => {
      // Insert workout
      tx.executeSql(
        'INSERT INTO workouts (id, name, created_at) VALUES (?, ?, ?);',
        [workoutId, name, timestamp],
        (_, workoutResult) => {
          // Insert exercises
          const exercisePromises = exercises.map(exercise => {
            const exerciseId = Math.random().toString(36).substring(7);
            return new Promise((resolveExercise, rejectExercise) => {
              tx.executeSql(
                'INSERT INTO exercises (id, workout_id, name, sets, reps) VALUES (?, ?, ?, ?, ?);',
                [exerciseId, workoutId, exercise.name, exercise.sets, exercise.reps],
                () => resolveExercise(true),
                (_, error) => rejectExercise(error)
              );
            });
          });

          Promise.all(exercisePromises)
            .then(() => resolve(workoutId))
            .catch(error => reject(error));
        },
        (_, error) => reject(error)
      );
    });
  });
};

// Get all workouts with their exercises
export const getWorkouts = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT 
          w.id as workout_id,
          w.name as workout_name,
          w.created_at,
          e.id as exercise_id,
          e.name as exercise_name,
          e.sets,
          e.reps
        FROM workouts w
        LEFT JOIN exercises e ON w.id = e.workout_id
        ORDER BY w.created_at DESC;`,
        [],
        (_, { rows: { _array } }) => {
          // Group exercises by workout
          const workouts = _array.reduce((acc: any, curr: any) => {
            if (!acc[curr.workout_id]) {
              acc[curr.workout_id] = {
                id: curr.workout_id,
                name: curr.workout_name,
                created_at: curr.created_at,
                exercises: [],
              };
            }
            if (curr.exercise_id) {
              acc[curr.workout_id].exercises.push({
                id: curr.exercise_id,
                name: curr.exercise_name,
                sets: curr.sets,
                reps: curr.reps,
              });
            }
            return acc;
          }, {});

          resolve(Object.values(workouts));
        },
        (_, error) => reject(error)
      );
    });
  });
};

// Delete a workout and its exercises
export const deleteWorkout = (id: string) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM workouts WHERE id = ?;',
        [id],
        () => resolve(true),
        (_, error) => reject(error)
      );
    });
  });
};