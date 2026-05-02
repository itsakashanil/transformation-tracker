import { useState, useEffect, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine, Area, AreaChart, BarChart, Bar, CartesianGrid } from "recharts";
import { Dumbbell, Apple, Sparkles, TrendingUp, Check, Plus, Minus, Droplet, Sun, Moon, Calendar, Lightbulb, Trash2, Camera, ChevronDown, PlayCircle, AlertTriangle, Target, Flame, Trophy, Activity, BarChart3, Zap, Award, Clock, ArrowUp, ArrowDown, Ruler } from "lucide-react";

const EXERCISE_FORM = {
  "fri-warmup": { setup: "Light resistance band held shoulder-width with both hands. Stand tall.", movement: "Three drills back-to-back: external rotations (15 each side, elbows pinned), face pulls with band (15 reps), shoulder dislocations (10 reps).", cues: ["Move slowly, control both directions", "Feel the rear shoulder and upper back working", "Breathe steadily, don't hold breath"], avoid: ["Jerky fast reps", "Bands too heavy", "Skipping when in a hurry"], type: "warmup" },
  "fri-1": { setup: "Hold a dumbbell vertically at chest height. Feet shoulder-width apart, toes slightly turned out.", movement: "Push hips back as if sitting in a chair, lower until thighs are parallel or as deep as you can with a flat back. Drive through heels to stand up.", cues: ["Chest stays up the whole time", "Knees track in same direction as toes", "Weight in heels, not toes"], avoid: ["Knees collapsing inward", "Lower back rounding", "Heels lifting off floor"], type: "weight", sets: 3, reps: 10 },
  "fri-2": { setup: "Light dumbbells at thigh level. Soft bend in knees. Neutral spine.", movement: "Push hips backward and let weights slide down the front of your legs. Stop when you feel deep stretch in hamstrings. Drive hips forward to stand back up.", cues: ["Hinge at hips, knees stay mostly fixed", "Weights stay close to legs", "Flat back, eyes 2 meters ahead"], avoid: ["Rounding the lower back", "Turning it into a squat", "Letting weights drift away"], type: "weight", sets: 3, reps: 10 },
  "fri-3": { setup: "Lie on back, knees bent, feet flat on floor hip-width apart, arms by sides.", movement: "Drive through heels and lift hips up until body forms a straight line shoulders to knees. Squeeze glutes hard at top. Lower with control.", cues: ["Squeeze glutes at top for 1 second", "Ribs stay down", "Push through heels not toes"], avoid: ["Arching lower back to lift higher", "Knees falling inward", "Rushing reps"], type: "bodyweight", sets: 3, reps: 12 },
  "fri-4": { setup: "Stand tall, feet hip-width apart, hands on hips or holding light dumbbells.", movement: "Take a long step forward, lower back knee toward floor (don't touch), push through front heel to bring back leg through into next step.", cues: ["Front knee over ankle, not past toes", "Torso stays upright", "Controlled descent"], avoid: ["Front knee caving inward", "Steps too short", "Bouncing up"], type: "bodyweight", sets: 3, reps: 10 },
  "fri-5": { setup: "Treadmill, hands free.", movement: "Speed 5 to 6 km per hour, incline 8 to 10. Walk for 20 minutes.", cues: ["Stand tall, light forward lean from ankles", "Arms swinging naturally", "Breathe through nose"], avoid: ["Holding the rails (cuts burn 30%)", "Hunching forward", "Stopping early"], type: "cardio", duration: 20 },
  "sat-warmup": { setup: "Light band, standing tall.", movement: "External rotations, face pulls, shoulder dislocations. 5–10 minutes.", cues: ["Get blood flowing to rotator cuff before cardio", "Move with control"], avoid: ["Skipping it"], type: "warmup" },
  "sat-1": { setup: "Treadmill incline walk, stationary bike, or elliptical.", movement: "40 minutes continuous, heart rate 130–150 BPM.", cues: ["Should be able to talk in short sentences but not sing", "Steady breathing, steady rhythm"], avoid: ["Going so hard you can't sustain", "Going so easy heart rate stays under 120"], type: "cardio", duration: 40 },
  "sat-2": { setup: "Forearms on floor, elbows under shoulders, legs extended, toes on floor.", movement: "Hold a perfectly straight line head to heels. Brace core hard. Hold for 30 seconds.", cues: ["Squeeze glutes throughout", "Ribs pulled down toward hips", "Neutral neck"], avoid: ["Hips sagging", "Hips piked up", "Looking up"], type: "time", sets: 3, duration: 30 },
  "sat-3": { setup: "Lie on back. Arms pointing straight up. Knees bent at 90° with shins parallel to floor.", movement: "Slowly lower opposite arm and leg toward floor. Return. Switch sides.", cues: ["Lower back glued to floor entire time", "Slow and controlled", "Exhale as you extend"], avoid: ["Lower back arching off floor", "Going too fast", "Holding breath"], type: "bodyweight", sets: 3, reps: 10 },
  "sat-4": { setup: "Hands and knees. Hands under shoulders, knees under hips. Neutral spine.", movement: "Extend opposite arm and leg straight out parallel to floor. Hold 1 second. Return. Switch sides.", cues: ["Hips stay completely square, no rotation", "Slow and deliberate", "Engage core"], avoid: ["Hips swaying", "Lower back arching", "Speeding through"], type: "bodyweight", sets: 3, reps: 10 },
  "mon-warmup": { setup: "Light band, full circuit.", movement: "Especially important before pulling. Full 5–10 minutes.", cues: ["Activate rear delts and rotator cuff before loading"], avoid: ["Going straight to lat pulldown without prep"], type: "warmup" },
  "mon-1": { setup: "Sit at lat pulldown machine. Knees secured. Use neutral grip handle (palms facing each other).", movement: "Pull handle down to upper chest, driving elbows down and back. Squeeze back. Slowly return up to full stretch.", cues: ["Chest up, slight backward lean (max 10°)", "Lead with elbows not hands", "Shoulder blades pull down first"], avoid: ["Pulling behind the neck", "Heavy weight forcing jerking", "Shoulders shrugging up"], type: "weight", sets: 3, reps: 10 },
  "mon-2": { setup: "Sit on rowing machine. Feet flat on platform. Slight knee bend. Sit tall.", movement: "Pull handle to lower ribs, elbows back, squeeze shoulder blades. Slow return.", cues: ["Chest stays up and proud", "No rocking", "Elbows brush close to sides"], avoid: ["Rounding back at bottom", "Using bodyweight to swing", "Leaning too far back"], type: "weight", sets: 3, reps: 10 },
  "mon-3": { setup: "Cable at upper chest height. Rope attachment. Stand facing cable, palms inward.", movement: "Pull rope toward face, separating ends as you pull. Elbows stay HIGH and wide. Externally rotate so knuckles point at ceiling.", cues: ["Aim rope ends at forehead, not chest", "Elbows above shoulders throughout", "Squeeze rear delts at full pull"], avoid: ["Going too heavy", "Letting elbows drop down", "Rushing reps"], type: "weight", sets: 3, reps: 15, note: "The single most important exercise in your week for protecting your shoulder long-term. Treat it like medicine." },
  "mon-4": { setup: "Stand or sit upright, dumbbells at sides, palms forward.", movement: "Curl dumbbells up toward shoulders with control. Squeeze biceps at top. Lower over 2–3 seconds.", cues: ["Elbows pinned to sides", "No body swinging", "Full range both directions"], avoid: ["Swinging back to lift", "Half reps", "Dropping weights down"], type: "weight", sets: 3, reps: 10 },
  "mon-5": { setup: "Band attached at elbow height. Stand sideways. Tuck working elbow against side, bent 90°, forearm forward.", movement: "Rotate forearm outward, keeping elbow glued to ribs. Slow return.", cues: ["Elbow welded to ribs", "Movement is small (~60°)", "Slow on return"], avoid: ["Heavy band forcing elbow to drift", "Using shoulder to muscle through", "Rushing"], type: "bodyweight", sets: 3, reps: 15 },
  "tue-warmup": { setup: "Light band, full circuit.", movement: "Critical before pressing. Don't skip.", cues: ["Get rotator cuff prepped before chest work"], avoid: ["Cold pressing"], type: "warmup" },
  "tue-1": { setup: "Treadmill incline 5–8, or stationary bike at moderate resistance.", movement: "25 minutes brisk pace.", cues: ["Engaged core throughout", "Light heel-to-toe foot strike"], avoid: ["Hunched posture", "Holding rails"], type: "cardio", duration: 25 },
  "tue-2": { setup: "Adjust seat so handles align with mid-chest (NOT shoulder height). Plant feet, back firmly against pad.", movement: "Press handles forward in horizontal path. Full extension without locking elbows. Slow return.", cues: ["Shoulders pulled back into pad", "Slight chest puff", "Press straight forward"], avoid: ["Setting handles too high", "Shoulders rolling forward", "Locking elbows hard"], type: "weight", sets: 3, reps: 10 },
  "tue-3": { setup: "Cable at top with rope or bar. Stand facing cable. Elbows pinned to sides.", movement: "Push handle straight down to thighs, fully extending elbows. Slow return.", cues: ["Elbows don't move from sides", "Only forearms move", "Squeeze triceps at bottom"], avoid: ["Leaning forward", "Elbows flaring out", "Half reps"], type: "weight", sets: 3, reps: 12 },
};

const WORKOUTS = {
  Friday: { title: "Lower Body", color: "emerald", exercises: [
    { id: "fri-warmup", name: "Band Warm-up", detail: "5–10 minutes" },
    { id: "fri-1", name: "Goblet Squats", detail: "3 × 10" },
    { id: "fri-2", name: "Romanian Deadlifts", detail: "3 × 10" },
    { id: "fri-3", name: "Glute Bridges", detail: "3 × 12" },
    { id: "fri-4", name: "Walking Lunges", detail: "3 × 10/leg" },
    { id: "fri-5", name: "Incline Treadmill Walk", detail: "20 min" },
  ]},
  Saturday: { title: "Cardio + Core", color: "amber", exercises: [
    { id: "sat-warmup", name: "Band Warm-up", detail: "5–10 minutes" },
    { id: "sat-1", name: "Steady Cardio", detail: "40 min, HR 130–150" },
    { id: "sat-2", name: "Plank", detail: "3 × 30 sec" },
    { id: "sat-3", name: "Dead Bug", detail: "3 × 10/side" },
    { id: "sat-4", name: "Bird Dog", detail: "3 × 10/side" },
  ]},
  Monday: { title: "Upper Body Pull", color: "rose", exercises: [
    { id: "mon-warmup", name: "Band Warm-up", detail: "5–10 minutes" },
    { id: "mon-1", name: "Lat Pulldown", detail: "3 × 10, neutral grip" },
    { id: "mon-2", name: "Seated Cable Row", detail: "3 × 10" },
    { id: "mon-3", name: "Face Pulls", detail: "3 × 15" },
    { id: "mon-4", name: "Bicep Curls", detail: "3 × 10" },
    { id: "mon-5", name: "Band External Rotations", detail: "3 × 15/arm" },
  ]},
  Tuesday: { title: "Cardio + Light Push", color: "sky", exercises: [
    { id: "tue-warmup", name: "Band Warm-up", detail: "5–10 minutes" },
    { id: "tue-1", name: "Brisk Walk or Cycle", detail: "25 min" },
    { id: "tue-2", name: "Machine Chest Press", detail: "3 × 10" },
    { id: "tue-3", name: "Tricep Pushdowns", detail: "3 × 12" },
  ]},
};

const REST_DAYS = ["Wednesday", "Thursday", "Sunday"];

const MEALS = [
  { time: "8 AM", name: "Breakfast", items: "4 egg whites + 2 whole eggs scrambled with veg, small bowl of oats with berries", cal: 400, p: 35 },
  { time: "1 PM", name: "Lunch", items: "Palm-size grilled chicken or paneer, 2 small chapatis or 1 cup brown rice, dal, big salad, small curd", cal: 550, p: 45 },
  { time: "4 PM", name: "Snack", items: "Greek yoghurt with berries, OR apple with peanut butter spoon", cal: 200, p: 15 },
  { time: "8 PM", name: "Dinner", items: "Grilled chicken, fish or paneer, big plate stir-fried veg, 1 chapati or small bowl rice", cal: 500, p: 45 },
];

const INSIGHTS = [
  { title: "Why energy balance beats exercise alone", body: "Your body is an accounting system, calories in versus calories out, integrated over weeks. One workout burns maybe 300 calories, which is one chocolate bar. The real fat loss happens at the dinner table." },
  { title: "Why lifting matters during a cut", body: "Strength training during a deficit signals to your body 'keep this muscle, you're using it'. Without that signal, you lose muscle alongside fat. Same principle as caching in software, the system keeps what's actively used." },
  { title: "Why face pulls matter", body: "Most shoulder injuries happen because front delts and chest are strong but rear delts and rotator cuff are weak. Face pulls reverse that pattern. Three sets of fifteen, twice a week, can transform shoulder feel in six weeks." },
  { title: "Why protein is non-negotiable", body: "Of three macros, protein is the only one your body can't synthesise from scratch. It's also the most filling and most thermogenic, you burn 20–30% of its calories digesting it." },
  { title: "Why steps beat HIIT", body: "An hour of HIIT burns ~500 calories but leaves you exhausted and hungry. 10,000 daily steps burn 400–500 without triggering hunger. Sustainable loss is built on a high baseline of low-intensity movement." },
  { title: "Why progressive overload works", body: "Muscles grow when given a slightly harder challenge than last time. Add 2.5 kg or one more rep to one exercise per week. Like incrementing a counter in code, small consistent additions compound into massive results over months." },
  { title: "Why the scale lies daily", body: "Day-to-day weight fluctuates 1–2 kg from water, glycogen, salt, digestion. Weighing daily is noise. Weekly weigh-ins reveal the real signal underneath. Like averaging a metric over a sliding window rather than reacting to every spike." },
];

const ACHIEVEMENTS = [
  { id: "first-workout", name: "First Step", desc: "Complete your first workout", icon: "🎯" },
  { id: "first-week", name: "Week One", desc: "Complete a full training week", icon: "📅" },
  { id: "lost-2kg", name: "2 kg Down", desc: "Lose your first 2 kg", icon: "⚡" },
  { id: "lost-5kg", name: "5 kg Down", desc: "Lose 5 kg total", icon: "🔥" },
  { id: "lost-10kg", name: "Double Digits", desc: "Lose 10 kg total", icon: "💎" },
  { id: "halfway", name: "Halfway There", desc: "Reach 6 kg of 12 kg goal", icon: "🚀" },
  { id: "goal", name: "Mission Accomplished", desc: "Hit your 12 kg target", icon: "🏆" },
  { id: "streak-3", name: "Building Habit", desc: "3-week training streak", icon: "🌱" },
  { id: "streak-8", name: "Iron Will", desc: "8-week training streak", icon: "⚔️" },
  { id: "ten-sessions", name: "Ten in the Bank", desc: "Complete 10 workouts", icon: "💪" },
  { id: "twenty-sessions", name: "Twenty Strong", desc: "Complete 20 workouts", icon: "🦾" },
];

const SKINCARE_AM = [
  "Wash with CeraVe Hydrating Cleanser",
  "Apply CeraVe Moisturising Lotion (thin layer)",
  "Apply gel-based sunscreen SPF 50",
];

const SKINCARE_PM = [
  "Wash with CeraVe Hydrating Cleanser",
  "Apply CeraVe Moisturising Lotion",
  "Optional after 4 weeks clear: 5% niacinamide before moisturiser",
];

const COLOR_MAP = {
  emerald: { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200", solid: "bg-emerald-700" },
  amber: { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200", solid: "bg-amber-700" },
  rose: { bg: "bg-rose-50", text: "text-rose-800", border: "border-rose-200", solid: "bg-rose-700" },
  sky: { bg: "bg-sky-50", text: "text-sky-800", border: "border-sky-200", solid: "bg-sky-700" },
};

const dateKey = (d) => d.toISOString().split("T")[0];
const fmtDate = (s) => new Date(s).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
const fmtDateLong = (s) => new Date(s).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

function getWorkoutForDate(d) {
  const dayName = d.toLocaleDateString("en-US", { weekday: "long" });
  return { dayName, workout: WORKOUTS[dayName] };
}

function calculateStreak(sessions) {
  // Streak = consecutive weeks where at least 3 of 4 planned workouts were done
  if (Object.keys(sessions).length === 0) return 0;
  const weeks = {};
  Object.keys(sessions).forEach((d) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = day === 0 ? 6 : day - 1;
    const monday = new Date(date);
    monday.setDate(date.getDate() - diff);
    const wk = dateKey(monday);
    weeks[wk] = (weeks[wk] || 0) + 1;
  });
  const sortedWeeks = Object.keys(weeks).sort().reverse();
  let streak = 0;
  for (const wk of sortedWeeks) {
    if (weeks[wk] >= 3) streak++;
    else break;
  }
  return streak;
}

function predictWeight(weightLog, targetDate) {
  if (weightLog.length < 2) return null;
  const sorted = [...weightLog].sort((a, b) => a.date.localeCompare(b.date));
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const daysBetween = (new Date(last.date) - new Date(first.date)) / 86400000;
  if (daysBetween < 1) return null;
  const ratePerDay = (last.weight - first.weight) / daysBetween;
  const daysToTarget = (targetDate - new Date(last.date)) / 86400000;
  return last.weight + ratePerDay * daysToTarget;
}

function CalendarHeatmap({ sessions, weeks = 12 }) {
  const today = new Date();
  const cells = [];
  const start = new Date(today);
  start.setDate(today.getDate() - (weeks * 7 - 1));
  for (let i = 0; i < weeks * 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = dateKey(d);
    const session = sessions[key];
    const exerciseCount = session ? Object.keys(session.exercises || {}).length : 0;
    cells.push({ date: key, count: exerciseCount, day: d.getDay() });
  }

  const intensity = (n) => {
    if (n === 0) return "bg-stone-100";
    if (n <= 2) return "bg-emerald-200";
    if (n <= 4) return "bg-emerald-400";
    return "bg-emerald-600";
  };

  const monthLabels = [];
  let lastMonth = -1;
  cells.forEach((c, i) => {
    if (i % 7 === 0) {
      const m = new Date(c.date).getMonth();
      if (m !== lastMonth) {
        monthLabels.push({ idx: i / 7, label: new Date(c.date).toLocaleDateString("en-US", { month: "short" }) });
        lastMonth = m;
      }
    }
  });

  return (
    <div>
      <div className="flex gap-1 mb-1 text-[10px] text-stone-500 ml-6">
        {Array.from({ length: weeks }).map((_, i) => {
          const label = monthLabels.find((m) => m.idx === i);
          return <div key={i} className="w-3.5 text-left">{label?.label || ""}</div>;
        })}
      </div>
      <div className="flex gap-1">
        <div className="flex flex-col gap-1 text-[10px] text-stone-400 mr-1">
          <div className="h-3.5 leading-none">M</div>
          <div className="h-3.5 leading-none"></div>
          <div className="h-3.5 leading-none">W</div>
          <div className="h-3.5 leading-none"></div>
          <div className="h-3.5 leading-none">F</div>
          <div className="h-3.5 leading-none"></div>
          <div className="h-3.5 leading-none">S</div>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: weeks }).map((_, w) => (
            <div key={w} className="flex flex-col gap-1">
              {[1, 2, 3, 4, 5, 6, 0].map((dow) => {
                const cell = cells.find((c, i) => Math.floor(i / 7) === w && c.day === dow);
                return cell ? (
                  <div key={dow} className={`w-3.5 h-3.5 rounded-sm ${intensity(cell.count)}`} title={`${fmtDate(cell.date)}: ${cell.count} exercises`}></div>
                ) : (
                  <div key={dow} className="w-3.5 h-3.5"></div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1 mt-2 text-[10px] text-stone-500">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-stone-100"></div>
        <div className="w-3 h-3 rounded-sm bg-emerald-200"></div>
        <div className="w-3 h-3 rounded-sm bg-emerald-400"></div>
        <div className="w-3 h-3 rounded-sm bg-emerald-600"></div>
        <span>More</span>
      </div>
    </div>
  );
}

function NumberInput({ value, onChange, min = 0, max = 999, step = 0.5, suffix }) {
  return (
    <div className="flex items-center gap-1 bg-white border border-stone-300 rounded-md">
      <button onClick={() => onChange(Math.max(min, (value || 0) - step))} className="px-2 py-1.5 text-stone-600 hover:bg-stone-100 rounded-l-md"><Minus size={12} /></button>
      <input type="number" value={value || ""} onChange={(e) => onChange(parseFloat(e.target.value) || 0)} className="w-12 text-center text-sm font-medium bg-transparent focus:outline-none" placeholder="0" />
      {suffix && <span className="text-xs text-stone-500">{suffix}</span>}
      <button onClick={() => onChange(Math.min(max, (value || 0) + step))} className="px-2 py-1.5 text-stone-600 hover:bg-stone-100 rounded-r-md"><Plus size={12} /></button>
    </div>
  );
}

function SetLogger({ exerciseId, exercise, todaySession, lastSession, onUpdate }) {
  const targetSets = exercise.sets || 3;
  const targetReps = exercise.reps;
  const sets = todaySession?.sets || [];
  const lastSets = lastSession?.sets || [];

  const updateSet = (idx, field, val) => {
    const newSets = [...sets];
    while (newSets.length <= idx) newSets.push({ weight: 0, reps: 0 });
    newSets[idx] = { ...newSets[idx], [field]: val };
    onUpdate({ ...todaySession, sets: newSets });
  };

  const isWeighted = exercise.type === "weight";
  const isBodyweight = exercise.type === "bodyweight";

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <Dumbbell size={12} className="text-stone-700" />
        <span className="text-xs uppercase tracking-wider font-semibold text-stone-700">Log your sets</span>
      </div>
      <div className="space-y-2">
        {Array.from({ length: targetSets }).map((_, i) => {
          const set = sets[i] || {};
          const last = lastSets[i];
          const isComplete = isWeighted ? (set.weight && set.reps) : (set.reps);
          return (
            <div key={i} className={`flex items-center gap-2 p-2 rounded-md border ${isComplete ? "bg-emerald-50 border-emerald-200" : "bg-white border-stone-200"}`}>
              <span className="text-xs font-semibold text-stone-500 w-6">#{i + 1}</span>
              {isWeighted && (
                <NumberInput value={set.weight} onChange={(v) => updateSet(i, "weight", v)} step={2.5} suffix="kg" />
              )}
              <NumberInput value={set.reps} onChange={(v) => updateSet(i, "reps", v)} step={1} suffix="reps" />
              {last && (
                <span className="text-[10px] text-stone-400 ml-auto">
                  Last: {isWeighted ? `${last.weight}kg ×` : ""} {last.reps}
                </span>
              )}
              {!last && targetReps && (
                <span className="text-[10px] text-stone-400 ml-auto">Target: {targetReps}</span>
              )}
              {isComplete && <Check size={14} className="text-emerald-600 flex-shrink-0" />}
            </div>
          );
        })}
      </div>
      {lastSession && lastSets.length > 0 && (
        <p className="text-xs text-stone-500 mt-2">💡 Try beating last session by 1 rep or 2.5 kg on at least one set.</p>
      )}
    </div>
  );
}

function CardioLogger({ exercise, todaySession, onUpdate }) {
  const target = exercise.duration;
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <Clock size={12} className="text-stone-700" />
        <span className="text-xs uppercase tracking-wider font-semibold text-stone-700">Log session</span>
      </div>
      <div className="flex items-center gap-2 p-2 rounded-md border bg-white border-stone-200">
        <span className="text-xs text-stone-600">Duration:</span>
        <NumberInput value={todaySession?.duration} onChange={(v) => onUpdate({ ...todaySession, duration: v })} step={1} max={180} suffix="min" />
        <span className="text-[10px] text-stone-400 ml-auto">Target: {target} min</span>
      </div>
    </div>
  );
}

function ExerciseCard({ exercise, color, isToday, todaySession, lastSession, onUpdate, onMarkDone }) {
  const [expanded, setExpanded] = useState(false);
  const form = EXERCISE_FORM[exercise.id];
  const c = COLOR_MAP[color];
  const ytLink = `https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.name + " proper form technique")}`;

  // Determine if completed based on logged data
  const isComplete = useMemo(() => {
    if (!todaySession) return false;
    if (todaySession.markedDone) return true;
    if (form?.type === "weight" || form?.type === "bodyweight") {
      const targetSets = form.sets || 3;
      const sets = todaySession.sets || [];
      const completedSets = sets.filter((s) => (form.type === "weight" ? (s.weight && s.reps) : s.reps)).length;
      return completedSets >= targetSets;
    }
    if (form?.type === "cardio") return todaySession.duration >= (form.duration || 0) * 0.8;
    if (form?.type === "warmup") return todaySession.markedDone;
    return false;
  }, [todaySession, form]);

  return (
    <div className="border-b border-stone-100 last:border-b-0">
      <div className="flex items-stretch">
        <button
          onClick={() => isToday && onMarkDone(exercise.id, !isComplete)}
          disabled={!isToday}
          className={`flex-shrink-0 w-12 flex items-center justify-center ${isToday ? "hover:bg-stone-50 cursor-pointer" : "cursor-default"}`}
        >
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${isComplete ? `${c.solid} border-transparent` : "border-stone-300"}`}>
            {isComplete && <Check size={12} className="text-white" />}
          </div>
        </button>
        <button onClick={() => setExpanded(!expanded)} className="flex-1 px-2 py-4 text-left hover:bg-stone-50 flex items-center gap-2">
          <div className="flex-1">
            <div className={`font-medium ${isComplete ? "line-through text-stone-500" : "text-stone-900"}`}>{exercise.name}</div>
            <div className="text-sm text-stone-600 mt-0.5">{exercise.detail}</div>
          </div>
          <ChevronDown size={18} className={`text-stone-400 mr-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      </div>

      {expanded && form && (
        <div className="bg-stone-50 px-5 py-4 space-y-4 border-t border-stone-100">
          {form.note && (
            <div className="bg-amber-100 border border-amber-300 rounded-md p-3 flex gap-2">
              <Lightbulb size={16} className="text-amber-700 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-900 leading-relaxed">{form.note}</p>
            </div>
          )}

          {isToday && (form.type === "weight" || form.type === "bodyweight") && (
            <SetLogger exerciseId={exercise.id} exercise={form} todaySession={todaySession} lastSession={lastSession} onUpdate={onUpdate} />
          )}
          {isToday && form.type === "cardio" && (
            <CardioLogger exercise={form} todaySession={todaySession} onUpdate={onUpdate} />
          )}

          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-1 h-3 bg-stone-700 rounded-full"></div>
              <span className="text-xs uppercase tracking-wider font-semibold text-stone-700">Setup</span>
            </div>
            <p className="text-sm text-stone-800 leading-relaxed">{form.setup}</p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-1 h-3 bg-stone-700 rounded-full"></div>
              <span className="text-xs uppercase tracking-wider font-semibold text-stone-700">Movement</span>
            </div>
            <p className="text-sm text-stone-800 leading-relaxed">{form.movement}</p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Target size={12} className="text-emerald-700" />
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-700">Form cues</span>
            </div>
            <ol className="space-y-1">
              {form.cues.map((cue, i) => (
                <li key={i} className="text-sm text-stone-800 flex gap-2">
                  <span className="text-emerald-600 flex-shrink-0">{i + 1}.</span>
                  <span className="leading-relaxed">{cue}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <AlertTriangle size={12} className="text-rose-700" />
              <span className="text-xs uppercase tracking-wider font-semibold text-rose-700">Avoid</span>
            </div>
            <ol className="space-y-1">
              {form.avoid.map((a, i) => (
                <li key={i} className="text-sm text-stone-800 flex gap-2">
                  <span className="text-rose-600 flex-shrink-0">×</span>
                  <span className="leading-relaxed">{a}</span>
                </li>
              ))}
            </ol>
          </div>

          <a href={ytLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-stone-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-stone-800">
            <PlayCircle size={16} /> Watch demo on YouTube
          </a>
        </div>
      )}
    </div>
  );
}

export default function TransformationTracker() {
  const [tab, setTab] = useState("today");
  const [weightLog, setWeightLog] = useState([]);
  const [newWeight, setNewWeight] = useState("");
  const [sessions, setSessions] = useState({});
  const [measurements, setMeasurements] = useState([]);
  const [newMeasurement, setNewMeasurement] = useState({ waist: "", chest: "", arms: "" });
  const [water, setWater] = useState(0);
  const [skin, setSkin] = useState({ am: false, pm: false });
  const [selectedExerciseChart, setSelectedExerciseChart] = useState("mon-1");

  const today = new Date();
  const todayKey = dateKey(today);
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const targetDate = new Date("2026-08-20");
  const daysLeft = Math.max(0, Math.ceil((targetDate - today) / 86400000));
  const totalDays = 110;
  const daysPassed = totalDays - daysLeft;

  useEffect(() => {
    (async () => {
      try { const w = localStorage.getItem("weight_log"); if (w) setWeightLog(JSON.parse(w)); } catch {}
      try { const s = localStorage.getItem("sessions"); if (s) setSessions(JSON.parse(s)); } catch {}
      try { const m = localStorage.getItem("measurements"); if (m) setMeasurements(JSON.parse(m)); } catch {}
      try { const wa = localStorage.getItem(`water_${todayKey}`); if (wa) setWater(parseInt(wa)); } catch {}
      try { const sk = localStorage.getItem(`skin_${todayKey}`); if (sk) setSkin(JSON.parse(sk)); } catch {}
    })();
  }, [todayKey]);

  const persist = (key, value) => {
    try { localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value)); } catch {}
  };

  const updateExercise = (exerciseId, data) => {
    const todaySession = sessions[todayKey] || { exercises: {} };
    const updated = {
      ...sessions,
      [todayKey]: {
        ...todaySession,
        exercises: { ...todaySession.exercises, [exerciseId]: data },
        date: todayKey,
        dayName,
      },
    };
    setSessions(updated);
    persist("sessions", updated);
  };

  const markExerciseDone = (exerciseId, done) => {
    const todaySession = sessions[todayKey] || { exercises: {} };
    const existing = todaySession.exercises?.[exerciseId] || {};
    updateExercise(exerciseId, { ...existing, markedDone: done });
  };

  const addWeight = () => {
    const w = parseFloat(newWeight);
    if (!w || w < 30 || w > 300) return;
    const filtered = weightLog.filter((e) => e.date !== todayKey);
    const updated = [...filtered, { date: todayKey, weight: w }].sort((a, b) => a.date.localeCompare(b.date));
    setWeightLog(updated);
    persist("weight_log", updated);
    setNewWeight("");
  };

  const removeWeight = (date) => {
    const updated = weightLog.filter((e) => e.date !== date);
    setWeightLog(updated);
    persist("weight_log", updated);
  };

  const addMeasurement = () => {
    const { waist, chest, arms } = newMeasurement;
    if (!waist && !chest && !arms) return;
    const entry = { date: todayKey, waist: parseFloat(waist) || null, chest: parseFloat(chest) || null, arms: parseFloat(arms) || null };
    const filtered = measurements.filter((e) => e.date !== todayKey);
    const updated = [...filtered, entry].sort((a, b) => a.date.localeCompare(b.date));
    setMeasurements(updated);
    persist("measurements", updated);
    setNewMeasurement({ waist: "", chest: "", arms: "" });
  };

  const adjustWater = (delta) => {
    const next = Math.max(0, Math.min(12, water + delta));
    setWater(next);
    persist(`water_${todayKey}`, String(next));
  };

  const toggleSkin = (k) => {
    const next = { ...skin, [k]: !skin[k] };
    setSkin(next);
    persist(`skin_${todayKey}`, next);
  };

  // Derived stats
  const startWeight = weightLog[0]?.weight || 95;
  const currentWeight = weightLog[weightLog.length - 1]?.weight || 95;
  const lostKg = Math.max(0, startWeight - currentWeight);
  const targetLoss = 12;
  const predicted = predictWeight(weightLog, targetDate);

  const totalSessions = Object.keys(sessions).filter((d) => sessions[d].exercises && Object.keys(sessions[d].exercises).length > 0).length;
  const streak = calculateStreak(sessions);

  // Find last session for a given exercise (for "last time" reference)
  const findLastSession = (exerciseId) => {
    const dates = Object.keys(sessions).filter((d) => d !== todayKey).sort().reverse();
    for (const d of dates) {
      if (sessions[d].exercises?.[exerciseId]?.sets?.length > 0) {
        return sessions[d].exercises[exerciseId];
      }
    }
    return null;
  };

  const todayWorkout = WORKOUTS[dayName];
  const todaySessionData = sessions[todayKey] || { exercises: {} };

  // Achievements
  const earnedAchievements = useMemo(() => {
    const earned = new Set();
    if (totalSessions >= 1) earned.add("first-workout");
    if (totalSessions >= 4) earned.add("first-week");
    if (totalSessions >= 10) earned.add("ten-sessions");
    if (totalSessions >= 20) earned.add("twenty-sessions");
    if (lostKg >= 2) earned.add("lost-2kg");
    if (lostKg >= 5) earned.add("lost-5kg");
    if (lostKg >= 6) earned.add("halfway");
    if (lostKg >= 10) earned.add("lost-10kg");
    if (lostKg >= 12) earned.add("goal");
    if (streak >= 3) earned.add("streak-3");
    if (streak >= 8) earned.add("streak-8");
    return earned;
  }, [totalSessions, lostKg, streak]);

  const todayInsight = INSIGHTS[today.getDate() % INSIGHTS.length];

  // Per-exercise progression data
  const exerciseProgressionData = useMemo(() => {
    const data = [];
    const sortedDates = Object.keys(sessions).sort();
    sortedDates.forEach((d) => {
      const ex = sessions[d].exercises?.[selectedExerciseChart];
      if (ex?.sets?.length > 0) {
        const heaviestSet = ex.sets.reduce((max, s) => (s.weight > (max?.weight || 0) ? s : max), null);
        if (heaviestSet?.weight > 0) {
          data.push({ date: d, weight: heaviestSet.weight, reps: heaviestSet.reps });
        }
      }
    });
    return data;
  }, [sessions, selectedExerciseChart]);

  // Weekly summary
  const thisWeekSessions = useMemo(() => {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    return Object.keys(sessions).filter((d) => new Date(d) >= monday && sessions[d].exercises && Object.keys(sessions[d].exercises).length > 0).length;
  }, [sessions]);

  const weightExercises = Object.entries(EXERCISE_FORM)
    .filter(([_, f]) => f.type === "weight")
    .map(([id]) => ({ id, name: WORKOUTS[Object.keys(WORKOUTS).find((d) => WORKOUTS[d].exercises.some((e) => e.id === id))]?.exercises.find((e) => e.id === id)?.name }))
    .filter((e) => e.name);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      <header className="bg-stone-900 text-stone-50 px-5 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-baseline justify-between">
            <h1 className="font-serif text-2xl tracking-tight">Akash · The Plan</h1>
            <span className="text-xs text-stone-400 tracking-wider uppercase">India · Aug 20</span>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3 text-sm">
            <div className="bg-stone-800 rounded-lg p-3">
              <div className="font-serif text-2xl text-amber-200">{daysLeft}</div>
              <div className="text-[10px] text-stone-400 uppercase tracking-wider mt-1">Days left</div>
            </div>
            <div className="bg-stone-800 rounded-lg p-3">
              <div className="font-serif text-2xl text-emerald-300">{lostKg.toFixed(1)}</div>
              <div className="text-[10px] text-stone-400 uppercase tracking-wider mt-1">Kg lost</div>
            </div>
            <div className="bg-stone-800 rounded-lg p-3">
              <div className="font-serif text-2xl text-orange-300 flex items-center gap-1">{streak}<Flame size={16} /></div>
              <div className="text-[10px] text-stone-400 uppercase tracking-wider mt-1">Wk streak</div>
            </div>
            <div className="bg-stone-800 rounded-lg p-3">
              <div className="font-serif text-2xl text-stone-100">{totalSessions}</div>
              <div className="text-[10px] text-stone-400 uppercase tracking-wider mt-1">Sessions</div>
            </div>
          </div>
          <div className="mt-4 h-2 bg-stone-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-amber-300 transition-all duration-500" style={{ width: `${Math.min(100, (lostKg / targetLoss) * 100)}%` }}></div>
          </div>
          <div className="text-xs text-stone-400 mt-1.5">{lostKg.toFixed(1)} of {targetLoss} kg target · {Math.round((lostKg / targetLoss) * 100)}% of goal</div>
        </div>
      </header>

      <nav className="sticky top-0 bg-stone-50 border-b border-stone-200 z-10">
        <div className="max-w-2xl mx-auto flex overflow-x-auto">
          {[
            { id: "today", icon: Calendar, label: "Today" },
            { id: "train", icon: Dumbbell, label: "Train" },
            { id: "stats", icon: BarChart3, label: "Stats" },
            { id: "diet", icon: Apple, label: "Diet" },
            { id: "skin", icon: Sparkles, label: "Skin" },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex-1 min-w-fit px-4 py-3 text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-1.5 ${tab === t.id ? "text-stone-900 border-b-2 border-stone-900" : "text-stone-500 hover:text-stone-700"}`}>
              <t.icon size={14} />
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-5 py-6 pb-24">
        {tab === "today" && (
          <div className="space-y-5">
            <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-stone-50 rounded-lg p-5">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xs uppercase tracking-wider text-stone-400">{dayName}</span>
                <span className="text-xs text-stone-400">{today.toLocaleDateString("en-GB", { day: "numeric", month: "long" })}</span>
              </div>
              {todayWorkout ? (
                <>
                  <h2 className="font-serif text-2xl text-amber-100 mt-1">{todayWorkout.title}</h2>
                  <p className="text-sm text-stone-300 mt-2">{todayWorkout.exercises.length} exercises today. Tap Train to log your sets.</p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="text-xs text-stone-400">
                      Today: {Object.keys(todaySessionData.exercises || {}).filter((id) => todaySessionData.exercises[id]?.markedDone || (todaySessionData.exercises[id]?.sets?.length > 0)).length} / {todayWorkout.exercises.length} done
                    </div>
                  </div>
                  <button onClick={() => setTab("train")} className="mt-4 bg-amber-200 text-stone-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-100">Start workout →</button>
                </>
              ) : (
                <>
                  <h2 className="font-serif text-2xl text-emerald-200 mt-1">Rest Day</h2>
                  <p className="text-sm text-stone-300 mt-2">No gym today. Aim for 8,000–10,000 steps. Recovery is where muscle is built.</p>
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-stone-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={14} className="text-amber-600" />
                  <span className="text-xs uppercase tracking-wider text-stone-500">This week</span>
                </div>
                <div className="font-serif text-2xl">{thisWeekSessions} <span className="text-sm text-stone-500">/ 4</span></div>
                <div className="text-xs text-stone-500 mt-1">workouts complete</div>
              </div>
              <div className="bg-white border border-stone-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={14} className="text-emerald-600" />
                  <span className="text-xs uppercase tracking-wider text-stone-500">Projected</span>
                </div>
                <div className="font-serif text-2xl">
                  {predicted ? `${predicted.toFixed(0)}` : "—"} <span className="text-sm text-stone-500">kg</span>
                </div>
                <div className="text-xs text-stone-500 mt-1">on Aug 20 at current pace</div>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Droplet size={16} className="text-sky-600" />
                  <h3 className="font-serif text-lg">Water · {water}/10</h3>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => adjustWater(-1)} className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 font-medium">−</button>
                  <button onClick={() => adjustWater(1)} className="w-8 h-8 rounded-full bg-sky-600 text-white font-medium">+</button>
                </div>
              </div>
              <div className="flex gap-1.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className={`flex-1 h-8 rounded ${i < water ? "bg-sky-500" : "bg-stone-100"}`}></div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-lg p-5">
              <h3 className="font-serif text-lg mb-3 flex items-center gap-2"><Sparkles size={16} className="text-rose-600" /> Skin today</h3>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => toggleSkin("am")} className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 ${skin.am ? "bg-amber-50 border-amber-400 text-amber-900" : "bg-stone-50 border-stone-200 text-stone-500"}`}>
                  <Sun size={24} />
                  <span className="text-sm font-medium">Morning</span>
                  {skin.am && <Check size={14} />}
                </button>
                <button onClick={() => toggleSkin("pm")} className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 ${skin.pm ? "bg-indigo-50 border-indigo-400 text-indigo-900" : "bg-stone-50 border-stone-200 text-stone-500"}`}>
                  <Moon size={24} />
                  <span className="text-sm font-medium">Evening</span>
                  {skin.pm && <Check size={14} />}
                </button>
              </div>
            </div>

            <div className="bg-stone-900 text-stone-100 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={14} className="text-amber-300" />
                <span className="text-xs uppercase tracking-wider text-stone-400">Insight of the day</span>
              </div>
              <h3 className="font-serif text-lg text-amber-200">{todayInsight.title}</h3>
              <p className="text-sm text-stone-300 mt-2 leading-relaxed">{todayInsight.body}</p>
            </div>
          </div>
        )}

        {tab === "train" && (
          <div className="space-y-5">
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
              <h3 className="font-serif text-base text-rose-900 mb-1">Shoulder rule</h3>
              <p className="text-sm text-rose-800">No overhead pressing for 4–6 weeks. Always do band warm-up first. Tap any exercise to log sets and see proper form.</p>
            </div>

            {Object.entries(WORKOUTS).map(([day, w]) => {
              const c = COLOR_MAP[w.color];
              const isToday = day === dayName;
              return (
                <div key={day} className={`bg-white border rounded-lg overflow-hidden ${isToday ? "border-stone-900 shadow-md" : "border-stone-200"}`}>
                  <div className={`${c.bg} ${c.border} border-b px-5 py-4`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs uppercase tracking-wider text-stone-600">{day}</div>
                        <h3 className={`font-serif text-xl ${c.text}`}>{w.title}</h3>
                      </div>
                      {isToday && <span className="text-xs bg-stone-900 text-stone-50 px-2 py-1 rounded-full uppercase tracking-wider">Today</span>}
                    </div>
                  </div>
                  <div>
                    {w.exercises.map((ex) => (
                      <ExerciseCard
                        key={ex.id}
                        exercise={ex}
                        color={w.color}
                        isToday={isToday}
                        todaySession={todaySessionData.exercises?.[ex.id]}
                        lastSession={findLastSession(ex.id)}
                        onUpdate={(data) => updateExercise(ex.id, data)}
                        onMarkDone={markExerciseDone}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            <div className="bg-stone-100 border border-stone-200 rounded-lg p-5">
              <h3 className="font-serif text-lg mb-2">Off days · {REST_DAYS.join(", ")}</h3>
              <p className="text-sm text-stone-700">8,000–10,000 steps every day. This is where the bulk of fat loss actually happens.</p>
            </div>
          </div>
        )}

        {tab === "stats" && (
          <div className="space-y-5">
            <div className="bg-white border border-stone-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg">Weight journey</h3>
                <div className="text-xs text-stone-500">Goal: {(startWeight - targetLoss).toFixed(0)} kg</div>
              </div>
              <div className="flex gap-2 mb-3">
                <input type="number" step="0.1" placeholder="Today's weight (kg)" value={newWeight} onChange={(e) => setNewWeight(e.target.value)} className="flex-1 px-4 py-3 border border-stone-300 rounded-lg text-base focus:outline-none focus:border-stone-900" />
                <button onClick={addWeight} className="bg-stone-900 text-white px-5 rounded-lg font-medium flex items-center gap-1"><Plus size={16} /> Log</button>
              </div>
              {weightLog.length > 1 && (
                <div style={{ width: "100%", height: 200 }}>
                  <ResponsiveContainer>
                    <AreaChart data={weightLog}>
                      <defs>
                        <linearGradient id="wgrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#1c1917" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#1c1917" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={fmtDate} />
                      <YAxis domain={["dataMin - 1", "dataMax + 1"]} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <ReferenceLine y={startWeight - targetLoss} stroke="#059669" strokeDasharray="3 3" label={{ value: "Goal", fontSize: 10, fill: "#059669" }} />
                      <Area type="monotone" dataKey="weight" stroke="#1c1917" strokeWidth={2.5} fill="url(#wgrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
              {predicted && (
                <div className="mt-3 bg-amber-50 border border-amber-200 rounded-md p-3 text-xs text-amber-900">
                  At your current pace, you'll be <span className="font-semibold">{predicted.toFixed(1)} kg</span> on Aug 20.
                  {predicted <= (startWeight - targetLoss) ? " You're on track to hit your goal! 🎯" : ` That's ${(predicted - (startWeight - targetLoss)).toFixed(1)} kg short of your goal. Tighten the diet or add a daily walk.`}
                </div>
              )}
              {weightLog.length > 0 && (
                <div className="mt-3 max-h-32 overflow-y-auto">
                  {[...weightLog].reverse().slice(0, 5).map((e) => (
                    <div key={e.date} className="flex items-center justify-between py-1.5 text-sm border-b border-stone-100 last:border-b-0">
                      <span className="text-stone-600">{fmtDateLong(e.date)}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{e.weight} kg</span>
                        <button onClick={() => removeWeight(e.date)} className="text-stone-400 hover:text-rose-600"><Trash2 size={12} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white border border-stone-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg">Workout consistency</h3>
                <span className="text-xs text-stone-500">Last 12 weeks</span>
              </div>
              <CalendarHeatmap sessions={sessions} weeks={12} />
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="text-center bg-stone-50 rounded-lg p-3">
                  <div className="font-serif text-2xl">{totalSessions}</div>
                  <div className="text-[10px] uppercase tracking-wider text-stone-500 mt-1">Total sessions</div>
                </div>
                <div className="text-center bg-stone-50 rounded-lg p-3">
                  <div className="font-serif text-2xl flex items-center justify-center gap-1">{streak}<Flame size={16} className="text-orange-500" /></div>
                  <div className="text-[10px] uppercase tracking-wider text-stone-500 mt-1">Week streak</div>
                </div>
                <div className="text-center bg-stone-50 rounded-lg p-3">
                  <div className="font-serif text-2xl">{thisWeekSessions}/4</div>
                  <div className="text-[10px] uppercase tracking-wider text-stone-500 mt-1">This week</div>
                </div>
              </div>
            </div>

            {weightExercises.length > 0 && (
              <div className="bg-white border border-stone-200 rounded-lg p-5">
                <h3 className="font-serif text-lg mb-3">Exercise progression</h3>
                <select value={selectedExerciseChart} onChange={(e) => setSelectedExerciseChart(e.target.value)} className="w-full mb-3 px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-stone-900">
                  {weightExercises.map((e) => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
                {exerciseProgressionData.length >= 2 ? (
                  <div style={{ width: "100%", height: 180 }}>
                    <ResponsiveContainer>
                      <LineChart data={exerciseProgressionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={fmtDate} />
                        <YAxis tick={{ fontSize: 10 }} label={{ value: "kg", angle: -90, position: "insideLeft", style: { fontSize: 10 } }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="weight" stroke="#059669" strokeWidth={2.5} dot={{ r: 4, fill: "#059669" }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center py-8 text-sm text-stone-500">Log this exercise at least twice to see your progression curve.</div>
                )}
              </div>
            )}

            <div className="bg-white border border-stone-200 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <Ruler size={16} className="text-stone-700" />
                <h3 className="font-serif text-lg">Body measurements (cm)</h3>
              </div>
              <p className="text-xs text-stone-500 mb-3">Often more telling than the scale. Take once every 2 weeks.</p>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <input type="number" placeholder="Waist" value={newMeasurement.waist} onChange={(e) => setNewMeasurement({ ...newMeasurement, waist: e.target.value })} className="px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none" />
                <input type="number" placeholder="Chest" value={newMeasurement.chest} onChange={(e) => setNewMeasurement({ ...newMeasurement, chest: e.target.value })} className="px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none" />
                <input type="number" placeholder="Arms" value={newMeasurement.arms} onChange={(e) => setNewMeasurement({ ...newMeasurement, arms: e.target.value })} className="px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none" />
              </div>
              <button onClick={addMeasurement} className="w-full bg-stone-900 text-white py-2 rounded-lg text-sm font-medium">Save measurements</button>
              {measurements.length > 1 && (
                <div className="mt-4" style={{ width: "100%", height: 180 }}>
                  <ResponsiveContainer>
                    <LineChart data={measurements}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={fmtDate} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="waist" stroke="#dc2626" strokeWidth={2} dot={{ r: 3 }} name="Waist" />
                      <Line type="monotone" dataKey="chest" stroke="#0284c7" strokeWidth={2} dot={{ r: 3 }} name="Chest" />
                      <Line type="monotone" dataKey="arms" stroke="#059669" strokeWidth={2} dot={{ r: 3 }} name="Arms" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="bg-white border border-stone-200 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <Trophy size={16} className="text-amber-600" />
                <h3 className="font-serif text-lg">Achievements</h3>
                <span className="text-xs text-stone-500 ml-auto">{earnedAchievements.size}/{ACHIEVEMENTS.length}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {ACHIEVEMENTS.map((a) => {
                  const earned = earnedAchievements.has(a.id);
                  return (
                    <div key={a.id} className={`p-3 rounded-lg border flex items-center gap-3 ${earned ? "bg-amber-50 border-amber-200" : "bg-stone-50 border-stone-200 opacity-50"}`}>
                      <div className="text-2xl">{a.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-semibold ${earned ? "text-amber-900" : "text-stone-700"}`}>{a.name}</div>
                        <div className="text-[10px] text-stone-500 truncate">{a.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
              <div className="px-5 py-3 border-b border-stone-200 flex items-center gap-2">
                <Activity size={16} className="text-stone-700" />
                <h3 className="font-serif text-lg">Workout history</h3>
              </div>
              {Object.keys(sessions).length === 0 ? (
                <div className="px-5 py-8 text-center text-sm text-stone-500">No workouts logged yet. Your history will appear here.</div>
              ) : (
                <div className="divide-y divide-stone-100 max-h-96 overflow-y-auto">
                  {Object.keys(sessions).sort().reverse().map((d) => {
                    const s = sessions[d];
                    const exCount = Object.keys(s.exercises || {}).filter((id) => s.exercises[id]?.markedDone || s.exercises[id]?.sets?.length > 0).length;
                    if (exCount === 0) return null;
                    const w = WORKOUTS[s.dayName];
                    const totalVolume = Object.values(s.exercises || {}).reduce((sum, ex) => {
                      return sum + (ex.sets || []).reduce((sub, set) => sub + (set.weight || 0) * (set.reps || 0), 0);
                    }, 0);
                    return (
                      <div key={d} className="px-5 py-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium">{fmtDateLong(d)}</div>
                            <div className="text-xs text-stone-500">{w?.title || s.dayName} · {exCount} exercises</div>
                          </div>
                          {totalVolume > 0 && (
                            <div className="text-right">
                              <div className="text-sm font-serif">{totalVolume.toFixed(0)} kg</div>
                              <div className="text-[10px] text-stone-500 uppercase tracking-wider">Volume</div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-stone-100 border border-stone-200 rounded-lg p-5 flex gap-3">
              <Camera size={20} className="text-stone-700 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-serif text-base mb-1">Photo reminder</h3>
                <p className="text-sm text-stone-700 leading-relaxed">Take a front and side photo every two weeks. Same lighting, same outfit. Photos taken weeks apart never lie.</p>
              </div>
            </div>
          </div>
        )}

        {tab === "diet" && (
          <div className="space-y-5">
            <div className="bg-white border border-stone-200 rounded-lg p-5">
              <h2 className="font-serif text-xl mb-4">Daily targets</h2>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center bg-stone-50 rounded-lg p-3">
                  <div className="font-serif text-2xl text-stone-900">1,750</div>
                  <div className="text-xs uppercase tracking-wider text-stone-500 mt-1">Calories</div>
                </div>
                <div className="text-center bg-stone-50 rounded-lg p-3">
                  <div className="font-serif text-2xl text-emerald-700">160g</div>
                  <div className="text-xs uppercase tracking-wider text-stone-500 mt-1">Protein</div>
                </div>
                <div className="text-center bg-stone-50 rounded-lg p-3">
                  <div className="font-serif text-2xl text-sky-700">3.5L</div>
                  <div className="text-xs uppercase tracking-wider text-stone-500 mt-1">Water</div>
                </div>
              </div>
              <p className="text-xs text-stone-500 mt-4">Maintenance is around 2,400 kcal. A 700 kcal deficit gives ~0.7 kg fat loss per week.</p>
            </div>

            <div className="space-y-3">
              <h3 className="font-serif text-lg">Sample day</h3>
              {MEALS.map((m, i) => (
                <div key={i} className="bg-white border border-stone-200 rounded-lg p-5">
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-serif text-lg">{m.name}</h4>
                    <span className="text-xs uppercase tracking-wider text-stone-500">{m.time}</span>
                  </div>
                  <p className="text-sm text-stone-700 mt-2 leading-relaxed">{m.items}</p>
                  <div className="mt-3 flex gap-3 text-xs">
                    <span className="bg-stone-100 px-2 py-1 rounded text-stone-700">{m.cal} kcal</span>
                    <span className="bg-emerald-50 text-emerald-800 px-2 py-1 rounded">{m.p}g protein</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-stone-900 text-stone-100 rounded-lg p-5">
              <h3 className="font-serif text-lg text-amber-200 mb-3">Cut hard</h3>
              <p className="text-sm text-stone-300 leading-relaxed">Sugary drinks including fruit juice. Fried snacks. Sweets. White bread. Oil-heavy curries. Alcohol. The Lidl bakery section.</p>
            </div>
          </div>
        )}

        {tab === "skin" && (
          <div className="space-y-5">
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
              <h3 className="font-serif text-base text-rose-900 mb-1">Your principle</h3>
              <p className="text-sm text-rose-800">Fewer products, used consistently, never mixed. Your skin reacted to layering before.</p>
            </div>

            <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
              <div className="bg-amber-50 border-b border-amber-200 px-5 py-3 flex items-center gap-2">
                <Sun size={18} className="text-amber-700" />
                <h3 className="font-serif text-lg text-amber-900">Morning</h3>
              </div>
              <ol className="divide-y divide-stone-100">
                {SKINCARE_AM.map((step, i) => (
                  <li key={i} className="px-5 py-4 flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-sm font-medium flex items-center justify-center">{i + 1}</span>
                    <span className="text-sm text-stone-800 leading-relaxed pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
              <div className="bg-indigo-50 border-b border-indigo-200 px-5 py-3 flex items-center gap-2">
                <Moon size={18} className="text-indigo-700" />
                <h3 className="font-serif text-lg text-indigo-900">Evening</h3>
              </div>
              <ol className="divide-y divide-stone-100">
                {SKINCARE_PM.map((step, i) => (
                  <li key={i} className="px-5 py-4 flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium flex items-center justify-center">{i + 1}</span>
                    <span className="text-sm text-stone-800 leading-relaxed pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-stone-900 text-stone-100 rounded-lg p-5">
              <h3 className="font-serif text-lg text-amber-200 mb-3">Stay away from</h3>
              <p className="text-sm text-stone-300 leading-relaxed">Fairness creams. Mixing two creams. Talcum powder on face. Anything fragranced. Scrubs. Patch test new products on inner forearm for three nights first.</p>
            </div>
          </div>
        )}
      </main>

      <footer className="max-w-2xl mx-auto px-5 pb-8 text-center">
        <p className="text-xs text-stone-400">Built for one transformation. August 20, 2026.</p>
      </footer>
    </div>
  );
}
