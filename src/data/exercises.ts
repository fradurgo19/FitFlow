import type { ExerciseDefinition } from '@/types';
import { EXERCISE_COPY } from '@/data/exerciseCopy';

export const EXERCISES: ExerciseDefinition[] = [
  {
    id: 'push-up',
    name: 'Push-Up',
    muscleGroup: 'chest',
    difficulty: 'beginner',
    equipment: 'No Equipment',
    instructions:
      'Start in a plank position with hands shoulder-width apart. Lower your body until your chest nearly touches the floor, then push back up. Keep your core tight and body in a straight line.',
    youtubeId: 'WDIpL0pjun0',
    youtubeUrl: 'https://www.youtube.com/watch?v=WDIpL0pjun0',
  },
  {
    id: 'incline-push-up',
    name: 'Incline Push-Up',
    muscleGroup: 'chest',
    difficulty: 'beginner',
    equipment: 'No Equipment',
    instructions:
      'Place your hands on an elevated surface like a bench or wall. Lower your chest to the surface, then push back up. Great for building push-up strength.',
    youtubeId: 'Z0bRiVhnO8Q',
    youtubeUrl: 'https://www.youtube.com/watch?v=Z0bRiVhnO8Q',
  },
  {
    id: 'diamond-push-up',
    name: 'Diamond Push-Up',
    muscleGroup: 'arms',
    difficulty: 'intermediate',
    equipment: 'No Equipment',
    instructions:
      'Form a diamond shape with your hands under your chest. Lower your body and push back up. Targets triceps heavily.',
    youtubeId: 'J0DnG1_S92I',
    youtubeUrl: 'https://www.youtube.com/watch?v=J0DnG1_S92I',
  },
  {
    id: 'barbell-bench-press',
    name: 'Barbell Bench Press',
    muscleGroup: 'chest',
    difficulty: 'intermediate',
    equipment: 'Barbell',
    instructions:
      'Lie on a flat bench. Grip the barbell slightly wider than shoulder-width. Lower the bar to your chest, then press it back up. Keep your feet flat on the floor.',
    youtubeId: 'rT7DgCr-3pg',
    youtubeUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
  },
  {
    id: 'dumbbell-bench-press',
    name: 'Dumbbell Bench Press',
    muscleGroup: 'chest',
    difficulty: 'intermediate',
    equipment: 'Dumbbells',
    instructions:
      'Lie on a flat bench holding dumbbells at chest level. Press them up until arms are extended, then lower with control.',
    youtubeId: 'VmB1G1K7v94',
    youtubeUrl: 'https://www.youtube.com/watch?v=VmB1G1K7v94',
  },
  {
    id: 'dumbbell-fly',
    name: 'Dumbbell Fly',
    muscleGroup: 'chest',
    difficulty: 'intermediate',
    equipment: 'Dumbbells',
    instructions:
      'Lie on a bench with dumbbells extended above your chest. Open your arms in a wide arc until you feel a stretch, then bring them back together.',
    youtubeId: 'eozdVDA78K0',
    youtubeUrl: 'https://www.youtube.com/watch?v=eozdVDA78K0',
  },
  {
    id: 'pull-up',
    name: 'Pull-Up',
    muscleGroup: 'back',
    difficulty: 'advanced',
    equipment: 'Pull-up Bar',
    instructions:
      'Grip a pull-up bar with palms facing away. Pull your chin above the bar, then lower with control. Engage your lats and core.',
    youtubeId: 'eGo4IYlbE5g',
    youtubeUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
  },
  {
    id: 'inverted-row',
    name: 'Inverted Row',
    muscleGroup: 'back',
    difficulty: 'beginner',
    equipment: 'No Equipment',
    instructions:
      'Lie under a sturdy table or bar. Grab it with an overhand grip. Pull your chest to the bar, then lower. Keep your body straight.',
    youtubeId: 'Fl0UMfdEzsE',
    youtubeUrl: 'https://www.youtube.com/watch?v=Fl0UMfdEzsE',
  },
  {
    id: 'dumbbell-row',
    name: 'Dumbbell Row',
    muscleGroup: 'back',
    difficulty: 'beginner',
    equipment: 'Dumbbells',
    instructions:
      'Place one knee and hand on a bench. Hold a dumbbell in the other hand. Pull it to your hip, then lower. Keep your back flat.',
    youtubeId: 'pYcpY20QaE8',
    youtubeUrl: 'https://www.youtube.com/watch?v=pYcpY20QaE8',
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    muscleGroup: 'back',
    difficulty: 'beginner',
    equipment: 'Machine',
    instructions:
      'Sit at a lat pulldown machine. Grip the bar wider than shoulder-width. Pull the bar to your upper chest, then return with control.',
    youtubeId: 'z-lxcsIN4T4',
    youtubeUrl: 'https://www.youtube.com/watch?v=z-lxcsIN4T4',
  },
  {
    id: 'barbell-deadlift',
    name: 'Barbell Deadlift',
    muscleGroup: 'back',
    difficulty: 'advanced',
    equipment: 'Barbell',
    instructions:
      'Stand with feet hip-width under the bar. Bend at hips and knees, grip the bar. Stand up by extending hips and knees simultaneously. Keep your back straight.',
    youtubeId: 'op9kVnSso6Q',
    youtubeUrl: 'https://www.youtube.com/watch?v=op9kVnSso6Q',
  },
  {
    id: 'overhead-press',
    name: 'Overhead Press',
    muscleGroup: 'shoulders',
    difficulty: 'intermediate',
    equipment: 'Barbell',
    instructions:
      'Stand holding a barbell at shoulder height. Press it overhead until arms are extended. Lower back to shoulders with control.',
    youtubeId: '2yjwXTZQDDI',
    youtubeUrl: 'https://www.youtube.com/watch?v=2yjwXTZQDDI',
  },
  {
    id: 'dumbbell-shoulder-press',
    name: 'Dumbbell Shoulder Press',
    muscleGroup: 'shoulders',
    difficulty: 'beginner',
    equipment: 'Dumbbells',
    instructions:
      'Sit or stand holding dumbbells at shoulder height. Press them overhead until arms are extended, then lower with control.',
    youtubeId: 'qEwKCR5JCog',
    youtubeUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
  },
  {
    id: 'lateral-raise',
    name: 'Lateral Raise',
    muscleGroup: 'shoulders',
    difficulty: 'beginner',
    equipment: 'Dumbbells',
    instructions:
      'Stand holding dumbbells at your sides. Raise your arms out to the sides until parallel to the floor. Lower with control.',
    youtubeId: '3VcKaXpzqRo',
    youtubeUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
  },
  {
    id: 'front-raise',
    name: 'Front Raise',
    muscleGroup: 'shoulders',
    difficulty: 'beginner',
    equipment: 'Dumbbells',
    instructions:
      'Stand holding dumbbells in front of your thighs. Raise them forward to shoulder height, then lower with control.',
    youtubeId: '-t7fuZ0KhDA',
    youtubeUrl: 'https://www.youtube.com/watch?v=-t7fuZ0KhDA',
  },
  {
    id: 'bicep-curl',
    name: 'Bicep Curl',
    muscleGroup: 'arms',
    difficulty: 'beginner',
    equipment: 'Dumbbells',
    instructions:
      'Stand holding dumbbells at your sides with palms forward. Curl the weights toward your shoulders, then lower with control.',
    youtubeId: 'ykJmrZ5v0Oo',
    youtubeUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
  },
  {
    id: 'hammer-curl',
    name: 'Hammer Curl',
    muscleGroup: 'arms',
    difficulty: 'beginner',
    equipment: 'Dumbbells',
    instructions:
      'Hold dumbbells with palms facing each other. Curl upward keeping the neutral grip. Lower with control. Targets brachialis and forearms.',
    youtubeId: 'zC3nLlEvin4',
    youtubeUrl: 'https://www.youtube.com/watch?v=zC3nLlEvin4',
  },
  {
    id: 'tricep-dip',
    name: 'Tricep Dip',
    muscleGroup: 'arms',
    difficulty: 'intermediate',
    equipment: 'No Equipment',
    instructions:
      'Sit on the edge of a chair or bench. Place hands next to hips. Slide off and lower your body by bending elbows. Push back up.',
    youtubeId: 'c3ZGl4pAwZ4',
    youtubeUrl: 'https://www.youtube.com/watch?v=c3ZGl4pAwZ4',
  },
  {
    id: 'tricep-extension',
    name: 'Overhead Tricep Extension',
    muscleGroup: 'arms',
    difficulty: 'beginner',
    equipment: 'Dumbbells',
    instructions:
      'Hold a dumbbell overhead with both hands. Lower it behind your head by bending elbows. Extend back up. Keep elbows close to your head.',
    youtubeId: 'X-iV-cG8cYs',
    youtubeUrl: 'https://www.youtube.com/watch?v=X-iV-cG8cYs',
  },
  {
    id: 'squat',
    name: 'Bodyweight Squat',
    muscleGroup: 'legs',
    difficulty: 'beginner',
    equipment: 'No Equipment',
    instructions:
      'Stand with feet shoulder-width apart. Lower your hips as if sitting in a chair. Keep your chest up and knees behind toes. Return to standing.',
    youtubeId: 'RClKKQqsvXA',
    youtubeUrl: 'https://www.youtube.com/watch?v=RClKKQqsvXA',
  },
  {
    id: 'barbell-squat',
    name: 'Barbell Back Squat',
    muscleGroup: 'legs',
    difficulty: 'advanced',
    equipment: 'Barbell',
    instructions:
      'Rest a barbell on your upper back. Stand with feet shoulder-width apart. Squat down until thighs are parallel, then drive up through your heels.',
    youtubeId: 'ultWZbUMPL8',
    youtubeUrl: 'https://www.youtube.com/watch?v=ultWZbUMPL8',
  },
  {
    id: 'dumbbell-squat',
    name: 'Dumbbell Squat',
    muscleGroup: 'legs',
    difficulty: 'beginner',
    equipment: 'Dumbbells',
    instructions:
      'Hold dumbbells at your sides or at shoulder height. Squat down until thighs are parallel. Keep your chest up. Return to standing.',
    youtubeId: 'v_c67Omje48',
    youtubeUrl: 'https://www.youtube.com/watch?v=v_c67Omje48',
  },
  {
    id: 'lunge',
    name: 'Walking Lunge',
    muscleGroup: 'legs',
    difficulty: 'beginner',
    equipment: 'No Equipment',
    instructions:
      'Step forward with one leg. Lower your hips until both knees are at 90 degrees. Push through the front heel to bring the back leg forward.',
    youtubeId: 'yDVAlYTNPSo',
    youtubeUrl: 'https://www.youtube.com/watch?v=yDVAlYTNPSo',
  },
  {
    id: 'dumbbell-lunge',
    name: 'Dumbbell Lunge',
    muscleGroup: 'legs',
    difficulty: 'intermediate',
    equipment: 'Dumbbells',
    instructions:
      'Hold dumbbells at your sides. Step forward into a lunge. Lower until both knees are at 90 degrees. Push back to standing. Alternate legs.',
    youtubeId: 'D7KaRcUTQeE',
    youtubeUrl: 'https://www.youtube.com/watch?v=D7KaRcUTQeE',
  },
  {
    id: 'goblet-squat',
    name: 'Goblet Squat',
    muscleGroup: 'legs',
    difficulty: 'beginner',
    equipment: 'Kettlebell',
    instructions:
      'Hold a kettlebell or dumbbell at chest level. Squat down between your knees until thighs are parallel. Keep your chest up. Return to standing.',
    youtubeId: 'MeIiIdhvXT4',
    youtubeUrl: 'https://www.youtube.com/watch?v=MeIiIdhvXT4',
  },
  {
    id: 'leg-press',
    name: 'Leg Press',
    muscleGroup: 'legs',
    difficulty: 'beginner',
    equipment: 'Machine',
    instructions:
      'Sit in the leg press machine. Place feet shoulder-width on the platform. Push the platform away by extending your legs. Lower with control.',
    youtubeId: '8EMbB0tCn7Q',
    youtubeUrl: 'https://www.youtube.com/watch?v=8EMbB0tCn7Q',
  },
  {
    id: 'calf-raise',
    name: 'Calf Raise',
    muscleGroup: 'legs',
    difficulty: 'beginner',
    equipment: 'No Equipment',
    instructions:
      'Stand on a flat surface. Rise onto the balls of your feet as high as possible. Lower slowly. For added challenge, stand on an edge.',
    youtubeId: 'k8ipHzKeAkQ',
    youtubeUrl: 'https://www.youtube.com/watch?v=k8ipHzKeAkQ',
  },
  {
    id: 'glute-bridge',
    name: 'Glute Bridge',
    muscleGroup: 'glutes',
    difficulty: 'beginner',
    equipment: 'No Equipment',
    instructions:
      'Lie on your back with knees bent and feet flat. Lift your hips off the floor by squeezing your glutes. Lower with control.',
    youtubeId: '8bbE64NuDTU',
    youtubeUrl: 'https://www.youtube.com/watch?v=8bbE64NuDTU',
  },
  {
    id: 'hip-thrust',
    name: 'Hip Thrust',
    muscleGroup: 'glutes',
    difficulty: 'intermediate',
    equipment: 'Barbell',
    instructions:
      'Sit with your upper back against a bench. Place a barbell across your hips. Thrust hips up by squeezing glutes. Lower with control.',
    youtubeId: '29OfN4ztW_g',
    youtubeUrl: 'https://www.youtube.com/watch?v=29OfN4ztW_g',
  },
  {
    id: 'bulgarian-split-squat',
    name: 'Bulgarian Split Squat',
    muscleGroup: 'glutes',
    difficulty: 'advanced',
    equipment: 'Dumbbells',
    instructions:
      'Hold dumbbells. Place one foot behind you on a bench. Lower into a squat on the front leg. Push back up. Keep your torso upright.',
    youtubeId: '2C-uNgKwPLE',
    youtubeUrl: 'https://www.youtube.com/watch?v=2C-uNgKwPLE',
  },
  {
    id: 'plank',
    name: 'Plank',
    muscleGroup: 'core',
    difficulty: 'beginner',
    equipment: 'No Equipment',
    instructions:
      'Rest on your forearms and toes. Keep your body in a straight line from head to heels. Hold the position. Engage your core.',
    youtubeId: 'ASdvN_XEl_c',
    youtubeUrl: 'https://www.youtube.com/watch?v=ASdvN_XEl_c',
  },
  {
    id: 'crunch',
    name: 'Crunch',
    muscleGroup: 'core',
    difficulty: 'beginner',
    equipment: 'No Equipment',
    instructions:
      'Lie on your back with knees bent. Place hands behind your head. Curl your shoulders off the floor, then lower with control.',
    youtubeId: 'Xyd_fa5zoEU',
    youtubeUrl: 'https://www.youtube.com/watch?v=Xyd_fa5zoEU',
  },
  {
    id: 'russian-twist',
    name: 'Russian Twist',
    muscleGroup: 'core',
    difficulty: 'intermediate',
    equipment: 'No Equipment',
    instructions:
      'Sit with knees bent and feet off the floor. Lean back slightly. Rotate your torso side to side, touching the floor each time.',
    youtubeId: 'wkD8rjkodUI',
    youtubeUrl: 'https://www.youtube.com/watch?v=wkD8rjkodUI',
  },
  {
    id: 'mountain-climber',
    name: 'Mountain Climbers',
    muscleGroup: 'core',
    difficulty: 'intermediate',
    equipment: 'No Equipment',
    instructions:
      'Start in a plank position. Drive one knee toward your chest, then switch legs rapidly. Keep your hips down and core engaged.',
    youtubeId: 'nmwgirgXLYM',
    youtubeUrl: 'https://www.youtube.com/watch?v=nmwgirgXLYM',
  },
  {
    id: 'leg-raise',
    name: 'Lying Leg Raise',
    muscleGroup: 'core',
    difficulty: 'intermediate',
    equipment: 'No Equipment',
    instructions:
      'Lie flat on your back. Keep your legs straight and raise them to a 90-degree angle. Lower slowly without touching the floor.',
    youtubeId: 'l4kQd9eWclE',
    youtubeUrl: 'https://www.youtube.com/watch?v=l4kQd9eWclE',
  },
  {
    id: 'burpee',
    name: 'Burpee',
    muscleGroup: 'full_body',
    difficulty: 'intermediate',
    equipment: 'No Equipment',
    instructions:
      'From standing, drop into a squat and kick your feet back to a plank. Do a push-up. Jump feet back to squat, then jump up explosively.',
    youtubeId: 'wS4OsJ4yzx4',
    youtubeUrl: 'https://www.youtube.com/watch?v=wS4OsJ4yzx4',
  },
  {
    id: 'jumping-jack',
    name: 'Jumping Jacks',
    muscleGroup: 'cardio',
    difficulty: 'beginner',
    equipment: 'No Equipment',
    instructions:
      'Stand with feet together and arms at your sides. Jump to spread feet and raise arms overhead. Jump back to start. Repeat rapidly.',
    youtubeId: 'uLVt6u15L98',
    youtubeUrl: 'https://www.youtube.com/watch?v=uLVt6u15L98',
  },
  {
    id: 'high-knees',
    name: 'High Knees',
    muscleGroup: 'cardio',
    difficulty: 'beginner',
    equipment: 'No Equipment',
    instructions:
      'Stand in place. Drive one knee up to hip height, then the other, as if running in place. Keep a quick pace and swing your arms.',
    youtubeId: 'FvjmPRU3zn4',
    youtubeUrl: 'https://www.youtube.com/watch?v=FvjmPRU3zn4',
  },
  {
    id: 'jump-rope',
    name: 'Jump Rope',
    muscleGroup: 'cardio',
    difficulty: 'beginner',
    equipment: 'Jump Rope',
    instructions:
      'Hold the rope handles. Swing the rope over your head and jump as it passes under your feet. Land softly on the balls of your feet.',
    youtubeId: 'u3zgHI8QnqE',
    youtubeUrl: 'https://www.youtube.com/watch?v=u3zgHI8QnqE',
  },
  {
    id: 'kettlebell-swing',
    name: 'Kettlebell Swing',
    muscleGroup: 'full_body',
    difficulty: 'intermediate',
    equipment: 'Kettlebell',
    instructions:
      'Stand with feet wider than shoulder-width. Hold the kettlebell with both hands. Hinge at the hips and swing the kettlebell forward to chest height.',
    youtubeId: 'B_x0tp3HIbk',
    youtubeUrl: 'https://www.youtube.com/watch?v=B_x0tp3HIbk',
  },
  {
    id: 'resistance-band-row',
    name: 'Resistance Band Row',
    muscleGroup: 'back',
    difficulty: 'beginner',
    equipment: 'Resistance Bands',
    instructions:
      'Anchor a band at chest height. Hold the ends and pull them toward your torso, squeezing your shoulder blades together. Return with control.',
    youtubeId: 'vR9KcvzLqVo',
    youtubeUrl: 'https://www.youtube.com/watch?v=vR9KcvzLqVo',
  },
  {
    id: 'resistance-band-press',
    name: 'Resistance Band Chest Press',
    muscleGroup: 'chest',
    difficulty: 'beginner',
    equipment: 'Resistance Bands',
    instructions:
      'Anchor a band behind you at chest height. Hold the ends and press forward until arms are extended. Return with control.',
    youtubeId: 'Rn-hf5iauTc',
    youtubeUrl: 'https://www.youtube.com/watch?v=Rn-hf5iauTc',
  },
  {
    id: 'stability-ball-curl',
    name: 'Stability Ball Hamstring Curl',
    muscleGroup: 'legs',
    difficulty: 'intermediate',
    equipment: 'Stability Ball',
    instructions:
      'Lie on your back with heels on a stability ball. Lift your hips. Curl the ball toward your glutes, then extend back out.',
    youtubeId: 'WNB90xXLEOg',
    youtubeUrl: 'https://www.youtube.com/watch?v=WNB90xXLEOg',
  },
  {
    id: 'bird-dog',
    name: 'Bird Dog',
    muscleGroup: 'core',
    difficulty: 'beginner',
    equipment: 'No Equipment',
    instructions:
      'Start on your hands and knees. Extend one arm forward and the opposite leg back. Hold, then return. Alternate sides. Keep your spine neutral.',
    youtubeId: 'ZdAHe9_HeEw',
    youtubeUrl: 'https://www.youtube.com/watch?v=ZdAHe9_HeEw',
  },
  {
    id: 'dead-bug',
    name: 'Dead Bug',
    muscleGroup: 'core',
    difficulty: 'beginner',
    equipment: 'No Equipment',
    instructions:
      'Lie on your back with arms extended up and knees at 90 degrees. Lower one arm and the opposite leg. Return and alternate. Keep your lower back flat.',
    youtubeId: 'g_BYB0R-4Ws',
    youtubeUrl: 'https://www.youtube.com/watch?v=g_BYB0R-4Ws',
  },
  {
    id: 'wall-sit',
    name: 'Wall Sit',
    muscleGroup: 'legs',
    difficulty: 'beginner',
    equipment: 'No Equipment',
    instructions:
      'Lean your back against a wall. Slide down until your thighs are parallel to the floor. Hold the position. Keep your knees at 90 degrees.',
    youtubeId: 'bKQQLpQbJ7s',
    youtubeUrl: 'https://www.youtube.com/watch?v=bKQQLpQbJ7s',
  },
  {
    id: 'pendlay-row',
    name: 'Pendlay Row',
    muscleGroup: 'back',
    difficulty: 'advanced',
    equipment: 'Barbell',
    instructions:
      'With the bar on the floor, hinge forward. Grip the bar and explosively pull it to your lower chest. Lower it back to the floor each rep.',
    youtubeId: '0PSfteHhUtg',
    youtubeUrl: 'https://www.youtube.com/watch?v=0PSfteHhUtg',
  },
];

export const EXERCISE_MAP: Record<string, ExerciseDefinition> = EXERCISES.reduce(
  (acc, ex) => {
    acc[ex.id] = ex;
    return acc;
  },
  {} as Record<string, ExerciseDefinition>,
);

export function localizeExercise(exercise: ExerciseDefinition): ExerciseDefinition {
  const copy = EXERCISE_COPY[exercise.id];
  if (!copy) return exercise;
  return { ...exercise, name: copy.name, instructions: copy.instructions };
}

export const LOCALIZED_EXERCISES: ExerciseDefinition[] = EXERCISES.map(localizeExercise);

export function getExercise(id: string): ExerciseDefinition | undefined {
  const exercise = EXERCISE_MAP[id];
  return exercise ? localizeExercise(exercise) : undefined;
}
