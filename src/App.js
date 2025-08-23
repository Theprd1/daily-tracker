import { useState, useEffect } from 'react';
import { Check, X, MessageCircle, Calendar, Plus, ChevronLeft, ChevronRight, Sun, Moon, Edit3, BarChart3, Settings, Trash2, Palette } from 'lucide-react';

const TrackingDashboard = () => {
  const [viewMode, setViewMode] = useState('today'); // 'today', 'month', 'year', 'analytics'
  
  // Get current date for initial state
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskColor, setNewTaskColor] = useState('bg-teal-500');
  const [newTaskCategory, setNewTaskCategory] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskNotes, setNewTaskNotes] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [showEditTask, setShowEditTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [currentComment, setCurrentComment] = useState('');
  const [todayNotes, setTodayNotes] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [showBackupOptions, setShowBackupOptions] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState('tasks'); // 'tasks', 'analytics', 'layout'
  const [layoutSettings, setLayoutSettings] = useState({
    compactMode: false,
    showTaskColors: true,
    showProgress: true,
    animationsEnabled: true
  });
  const [analyticsSettings, setAnalyticsSettings] = useState({
    showWeeklyTrends: true,
    showDifficulty: true,
    showMonthlyComparison: true,
    excludeSundays: true,
    chartType: 'progress' // 'progress', 'bars', 'lines'
  });
  const [editingTaskInSettings, setEditingTaskInSettings] = useState(null);
  const [currentTimeState, setCurrentTimeState] = useState(() => {
    return new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  });
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Default tasks with enhanced properties
  const [defaultTasks, setDefaultTasks] = useState({
    leetcode: { 
      label: 'LeetCode', 
      color: 'bg-orange-500',
      category: 'Development',
      priority: 'high',
      notes: 'Daily coding practice to improve problem-solving skills'
    },
    pt: { 
      label: 'Movement & Mobility', 
      color: 'bg-purple-500',
      category: 'Health',
      priority: 'medium',
      notes: 'Physical therapy exercises and stretching routine'
    },
    gym: { 
      label: 'Gym Workouts', 
      color: 'bg-indigo-500',
      category: 'Fitness',
      priority: 'high',
      notes: 'Strength training and cardio exercises'
    }
  });
  
  const [customTasks, setCustomTasks] = useState({});
  const [data, setData] = useState({
    leetcode: {},
    pt: {},
    gym: {}
  });
  const [comments, setComments] = useState({});

  // All available colors for custom tasks
  const availableColors = [
    'bg-teal-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-lime-500',
    'bg-yellow-500', 'bg-amber-500', 'bg-rose-500', 'bg-pink-500',
    'bg-violet-500', 'bg-sky-500', 'bg-slate-500', 'bg-gray-500'
  ];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('tracker-data');
    const savedCustomTasks = localStorage.getItem('tracker-custom-tasks');
    const savedDarkMode = localStorage.getItem('tracker-dark-mode');
    const savedDefaultTasks = localStorage.getItem('tracker-default-tasks');
    const savedComments = localStorage.getItem('tracker-comments');
    const savedTodayNotes = localStorage.getItem('tracker-today-notes');
    
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setData(parsedData);
      } catch (e) {
        console.error('Error parsing saved data:', e);
      }
    }
    
    if (savedCustomTasks) {
      try {
        const tasks = JSON.parse(savedCustomTasks);
        setCustomTasks(tasks);
        // Initialize data for custom tasks
        setData(prev => {
          const newData = { ...prev };
          Object.keys(tasks).forEach(taskKey => {
            if (!newData[taskKey]) {
              newData[taskKey] = {};
            }
          });
          return newData;
        });
      } catch (e) {
        console.error('Error parsing saved custom tasks:', e);
      }
    }
    
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
    
    if (savedDefaultTasks) {
      try {
        setDefaultTasks(JSON.parse(savedDefaultTasks));
      } catch (e) {
        console.error('Error parsing saved default tasks:', e);
      }
    }
    
    if (savedComments) {
      try {
        setComments(JSON.parse(savedComments));
      } catch (e) {
        console.error('Error parsing saved comments:', e);
      }
    }
    
    if (savedTodayNotes) {
      try {
        setTodayNotes(JSON.parse(savedTodayNotes));
      } catch (e) {
        console.error('Error parsing saved today notes:', e);
      }
    }
    
    // Load settings
    const savedLayoutSettings = localStorage.getItem('tracker-layout-settings');
    const savedAnalyticsSettings = localStorage.getItem('tracker-analytics-settings');
    
    if (savedLayoutSettings) {
      try {
        const settings = JSON.parse(savedLayoutSettings);
        setLayoutSettings(settings);
      } catch (e) {
        console.error('Error parsing layout settings:', e);
      }
    }
    
    if (savedAnalyticsSettings) {
      try {
        const settings = JSON.parse(savedAnalyticsSettings);
        setAnalyticsSettings(settings);
      } catch (e) {
        console.error('Error parsing analytics settings:', e);
      }
    }

    // Mark as initialized after attempting to load data
    setIsInitialized(true);
  }, []);

  // Save data to localStorage - but only after initial load
  
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('tracker-data', JSON.stringify(data));
    }
  }, [data, isInitialized]);


  useEffect(() => {
    localStorage.setItem('tracker-custom-tasks', JSON.stringify(customTasks));
  }, [customTasks]);

  useEffect(() => {
    localStorage.setItem('tracker-dark-mode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('tracker-default-tasks', JSON.stringify(defaultTasks));
  }, [defaultTasks]);

  // Save settings to localStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('tracker-layout-settings', JSON.stringify(layoutSettings));
    }
  }, [layoutSettings, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('tracker-analytics-settings', JSON.stringify(analyticsSettings));
    }
  }, [analyticsSettings, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('tracker-comments', JSON.stringify(comments));
    }
  }, [comments, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('tracker-today-notes', JSON.stringify(todayNotes));
    }
  }, [todayNotes, isInitialized]);

  // Timer for real-time clock updates
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTimeState(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }));
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Auto-backup to multiple localStorage keys for redundancy
  useEffect(() => {
    if (!isInitialized) return;
    
    const backupData = {
      tasks: { defaultTasks, customTasks },
      data: data,
      comments: comments,
      todayNotes: todayNotes,
      settings: { darkMode, currentMonth, currentYear },
      timestamp: Date.now()
    };
    
    // Create multiple backup copies with rotation
    const backupKey1 = 'tracker-backup-1';
    const backupKey2 = 'tracker-backup-2';
    const backupKey3 = 'tracker-backup-3';
    
    // Rotate backups (newest -> 1, 1 -> 2, 2 -> 3)
    const oldBackup1 = localStorage.getItem(backupKey1);
    const oldBackup2 = localStorage.getItem(backupKey2);
    
    if (oldBackup1) localStorage.setItem(backupKey2, oldBackup1);
    if (oldBackup2) localStorage.setItem(backupKey3, oldBackup2);
    localStorage.setItem(backupKey1, JSON.stringify(backupData));
    
  }, [data, comments, todayNotes, customTasks, defaultTasks, darkMode, currentMonth, currentYear, isInitialized]);

  // Get all tasks (default + custom)
  const getAllTasks = () => {
    return { ...defaultTasks, ...customTasks };
  };

  // Check if a given day is today
  const isToday = (day, month = currentMonth, year = currentYear) => {
    const today = new Date();
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  };

  // Export data functionality
  const exportData = () => {
    const allData = {
      tasks: { 
        defaultTasks, 
        customTasks 
      },
      data: data,
      comments: comments,
      todayNotes: todayNotes,
      settings: { 
        darkMode,
        currentMonth,
        currentYear 
      },
      exportDate: new Date().toISOString(),
      version: "1.0"
    };
    
    const blob = new Blob([JSON.stringify(allData, null, 2)], 
      { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import data functionality
  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target.result);
        
        // Validate backup structure
        if (backup.tasks && backup.data && backup.comments) {
          setData(backup.data);
          setComments(backup.comments);
          setTodayNotes(backup.todayNotes || '');
          setCustomTasks(backup.tasks.customTasks || {});
          setDefaultTasks(backup.tasks.defaultTasks || defaultTasks);
          
          if (backup.settings) {
            setDarkMode(backup.settings.darkMode ?? true);
            setCurrentMonth(backup.settings.currentMonth ?? new Date().getMonth());
            setCurrentYear(backup.settings.currentYear ?? new Date().getFullYear());
          }
          
          alert('✅ Data imported successfully!');
          setShowImport(false);
        } else {
          alert('❌ Invalid backup file format');
        }
      } catch (error) {
        alert('❌ Error reading backup file');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  };

  // Recover from local backup
  const recoverFromBackup = (backupNumber) => {
    const backupKey = `tracker-backup-${backupNumber}`;
    const backup = localStorage.getItem(backupKey);
    
    if (backup) {
      try {
        const backupData = JSON.parse(backup);
        setData(backupData.data);
        setComments(backupData.comments);
        setTodayNotes(backupData.todayNotes || '');
        setCustomTasks(backupData.tasks.customTasks || {});
        setDefaultTasks(backupData.tasks.defaultTasks || defaultTasks);
        
        if (backupData.settings) {
          setDarkMode(backupData.settings.darkMode ?? true);
          setCurrentMonth(backupData.settings.currentMonth ?? new Date().getMonth());
          setCurrentYear(backupData.settings.currentYear ?? new Date().getFullYear());
        }
        
        alert(`✅ Recovered from backup ${backupNumber}!`);
        setShowBackupOptions(false);
      } catch (error) {
        alert(`❌ Error recovering backup ${backupNumber}`);
      }
    } else {
      alert(`❌ No backup ${backupNumber} found`);
    }
  };

  // Copy data to clipboard for manual backup
  const copyToClipboard = () => {
    const backupData = {
      tasks: { defaultTasks, customTasks },
      data: data,
      comments: comments,
      todayNotes: todayNotes,
      settings: { darkMode, currentMonth, currentYear },
      exportDate: new Date().toISOString(),
      version: "1.0"
    };
    
    navigator.clipboard.writeText(JSON.stringify(backupData, null, 2))
      .then(() => alert('✅ Backup data copied to clipboard! Paste it into a text file.'))
      .catch(() => alert('❌ Could not copy to clipboard'));
  };

  // Save to browser's IndexedDB for better persistence
  const saveToIndexedDB = () => {
    if (!window.indexedDB) {
      alert('❌ IndexedDB not supported');
      return;
    }
    
    const request = indexedDB.open('DailyTrackerDB', 1);
    
    request.onerror = () => alert('❌ Error opening IndexedDB');
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['backups'], 'readwrite');
      const store = transaction.objectStore('backups');
      
      const backupData = {
        id: Date.now(),
        tasks: { defaultTasks, customTasks },
        data: data,
        comments: comments,
        todayNotes: todayNotes,
        settings: { darkMode, currentMonth, currentYear },
        timestamp: new Date().toISOString()
      };
      
      store.add(backupData);
      alert('✅ Backup saved to browser database!');
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('backups')) {
        db.createObjectStore('backups', { keyPath: 'id' });
      }
    };
  };

  // Calendar calculations
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Convert to Monday-first (0 = Monday)
  };

  const generateCalendar = (month, year) => {
    const daysInMonth = getDaysInMonth(month, year);
    const firstDayOfWeek = getFirstDayOfMonth(month, year);
    const weeks = [];
    
    let day = 1;
    for (let week = 0; week < 6; week++) {
      const weekDays = [];
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        if (week === 0 && dayOfWeek < firstDayOfWeek) {
          weekDays.push(null);
        } else if (day <= daysInMonth) {
          weekDays.push(day);
          day++;
        } else {
          weekDays.push(null);
        }
      }
      weeks.push(weekDays);
      if (day > daysInMonth) break;
    }
    return weeks;
  };

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Event handlers
  const handleDayClick = (day) => {
    if (!day) return;
    setSelectedDay(day);
    setShowOptions(true);
    
    // Load existing comment for this day
    const commentKey = `${currentYear}-${currentMonth}-${day}`;
    setCurrentComment(comments[commentKey] || '');
  };

  const navigateDay = (direction) => {
    if (!selectedDay) return;
    
    const currentDate = new Date(currentYear, currentMonth, selectedDay);
    
    if (direction === 'prev') {
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Update the current month/year if we moved to a different month
    const newMonth = currentDate.getMonth();
    const newYear = currentDate.getFullYear();
    const newDay = currentDate.getDate();
    
    if (newMonth !== currentMonth || newYear !== currentYear) {
      setCurrentMonth(newMonth);
      setCurrentYear(newYear);
    }
    
    setSelectedDay(newDay);
    
    // Load comment for the new day
    const commentKey = `${newYear}-${newMonth}-${newDay}`;
    setCurrentComment(comments[commentKey] || '');
  };

  const saveComment = () => {
    if (!selectedDay) return;
    
    const commentKey = `${currentYear}-${currentMonth}-${selectedDay}`;
    setComments(prev => ({
      ...prev,
      [commentKey]: currentComment
    }));
  };

  const handleTaskToggle = (taskKey) => {
    if (!selectedDay) return;
    
    const key = `${currentYear}-${currentMonth}`;
    const currentStatus = data[taskKey]?.[key]?.[selectedDay];
    const newStatus = currentStatus === 'right' ? null : 'right';
    
    setData(prev => {
      const newData = { ...prev };
      if (!newData[taskKey]) newData[taskKey] = {};
      if (!newData[taskKey][key]) newData[taskKey][key] = {};
      
      if (newStatus === null) {
        delete newData[taskKey][key][selectedDay];
      } else {
        newData[taskKey][key][selectedDay] = newStatus;
      }
      
      return newData;
    });
  };

  const getTaskStatus = (taskKey, day) => {
    const key = `${currentYear}-${currentMonth}`;
    return data[taskKey]?.[key]?.[day] === 'right';
  };

  const getCompletionPercentage = (day, month = currentMonth, year = currentYear) => {
    const allTasks = getAllTasks();
    const totalTasks = Object.keys(allTasks).length;
    const completedTasks = getCompletedTasksForDay(day, month, year);
    return totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;
  };

  const ActivityRing = ({ percentage, size = 60, strokeWidth = 6, colors = ['#ff0844', '#32d74b', '#007aff'] }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={darkMode ? '#2d2d2d' : '#e5e5e5'}
            strokeWidth={strokeWidth}
          />
          {/* Progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors[0]}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-300"
          />
        </svg>
        {/* Day number */}
        <div className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {/* This will be filled by parent component */}
        </div>
      </div>
    );
  };

  const addCustomTask = () => {
    if (!newTaskName.trim()) return;
    
    const taskKey = newTaskName.toLowerCase().replace(/\s+/g, '_');
    const newTask = {
      label: newTaskName.trim(),
      color: newTaskColor,
      category: newTaskCategory.trim() || 'General',
      priority: newTaskPriority,
      notes: newTaskNotes.trim()
    };
    
    setCustomTasks(prev => ({
      ...prev,
      [taskKey]: newTask
    }));
    
    // Initialize data for new task
    setData(prev => ({
      ...prev,
      [taskKey]: {}
    }));
    
    setNewTaskName('');
    setNewTaskColor('bg-teal-500');
    setNewTaskCategory('');
    setNewTaskPriority('medium');
    setNewTaskNotes('');
    setShowAddTask(false);
  };

  const removeCustomTask = (taskKey) => {
    if (window.confirm('Are you sure you want to remove this task? All data will be lost.')) {
      setCustomTasks(prev => {
        const updated = { ...prev };
        delete updated[taskKey];
        return updated;
      });
      
      setData(prev => {
        const updated = { ...prev };
        delete updated[taskKey];
        return updated;
      });
      
      // Task removed successfully
    }
  };

  const editTaskColor = (taskKey) => {
    const allTasks = getAllTasks();
    setEditingTask({
      key: taskKey,
      label: allTasks[taskKey].label,
      color: allTasks[taskKey].color,
      isDefault: !!defaultTasks[taskKey]
    });
    setShowEditTask(true);
  };

  const saveTaskEdit = (newColor) => {
    if (!editingTask) return;
    
    if (editingTask.isDefault) {
      // For default tasks, we update them in defaultTasks
      setDefaultTasks(prev => ({
        ...prev,
        [editingTask.key]: {
          ...prev[editingTask.key],
          color: newColor
        }
      }));
    } else {
      // For custom tasks, we update customTasks
      setCustomTasks(prev => ({
        ...prev,
        [editingTask.key]: {
          ...prev[editingTask.key],
          color: newColor
        }
      }));
    }
    
    setShowEditTask(false);
    setEditingTask(null);
  };

  // Settings task management functions
  const editTaskInSettings = (taskKey) => {
    const allTasks = getAllTasks();
    setEditingTaskInSettings({
      key: taskKey,
      label: allTasks[taskKey].label,
      color: allTasks[taskKey].color,
      isDefault: !!defaultTasks[taskKey],
      originalLabel: allTasks[taskKey].label
    });
  };

  const saveTaskInSettings = (newLabel, newColor) => {
    if (!editingTaskInSettings) return;
    
    if (editingTaskInSettings.isDefault) {
      // For default tasks, we update them in defaultTasks
      setDefaultTasks(prev => ({
        ...prev,
        [editingTaskInSettings.key]: {
          ...prev[editingTaskInSettings.key],
          label: newLabel,
          color: newColor
        }
      }));
    } else {
      // For custom tasks, we update customTasks
      setCustomTasks(prev => ({
        ...prev,
        [editingTaskInSettings.key]: {
          ...prev[editingTaskInSettings.key],
          label: newLabel,
          color: newColor
        }
      }));
    }
    
    setEditingTaskInSettings(null);
  };

  const deleteTaskInSettings = (taskKey) => {
    const allTasks = getAllTasks();
    const isDefault = !!defaultTasks[taskKey];
    
    if (isDefault) {
      // For default tasks, remove from defaultTasks
      setDefaultTasks(prev => {
        const newTasks = { ...prev };
        delete newTasks[taskKey];
        return newTasks;
      });
    } else {
      // For custom tasks, remove from customTasks
      setCustomTasks(prev => {
        const newTasks = { ...prev };
        delete newTasks[taskKey];
        return newTasks;
      });
    }

    // Also clean up any data for this task
    setData(prev => {
      const newData = { ...prev };
      Object.keys(newData).forEach(monthKey => {
        if (newData[monthKey]) {
          Object.keys(newData[monthKey]).forEach(day => {
            if (newData[monthKey][day] && newData[monthKey][day][taskKey] !== undefined) {
              delete newData[monthKey][day][taskKey];
            }
          });
        }
      });
      return newData;
    });
  };

  const getCompletedTasksForDay = (day, month = currentMonth, year = currentYear) => {
    const monthKey = `${year}-${month}`;
    const allTasks = getAllTasks();
    const completedTasks = [];
    
    Object.keys(allTasks).forEach(taskKey => {
      const status = data[taskKey]?.[monthKey]?.[day];
      if (status === 'right') {
        completedTasks.push({ key: taskKey, ...allTasks[taskKey] });
      }
    });
    
    return completedTasks;
  };

  // Get completed days in a month excluding Sundays
  const getMonthlyCompletedDays = (taskKey, month, year) => {
    const monthKey = `${year}-${month}`;
    const taskData = data[taskKey]?.[monthKey] || {};
    let completedDays = 0;
    
    // Get number of days in the month
    const daysInMonth = getDaysInMonth(month, year);
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
      
      // Skip Sundays (0)
      if (dayOfWeek === 0) continue;
      
      // Check if task was completed on this day
      if (taskData[day] === 'right') {
        completedDays++;
      }
    }
    
    return completedDays;
  };

  // Get total possible days in a month excluding Sundays
  const getTotalNonSundaysInMonth = (month, year) => {
    const daysInMonth = getDaysInMonth(month, year);
    let nonSundayCount = 0;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();
      
      // Skip Sundays (0)
      if (dayOfWeek !== 0) {
        nonSundayCount++;
      }
    }
    
    return nonSundayCount;
  };

  // Calculate current month stats for a task
  const getCurrentMonthStats = (taskKey) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const completed = getMonthlyCompletedDays(taskKey, currentMonth, currentYear);
    const total = getTotalNonSundaysInMonth(currentMonth, currentYear);
    
    return { completed, total };
  };

  // Calculate previous month stats for a task
  const getPreviousMonthStats = (taskKey) => {
    const now = new Date();
    let prevMonth = now.getMonth() - 1;
    let prevYear = now.getFullYear();
    
    // Handle January case (go to December of previous year)
    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear -= 1;
    }
    
    const completed = getMonthlyCompletedDays(taskKey, prevMonth, prevYear);
    const total = getTotalNonSundaysInMonth(prevMonth, prevYear);
    
    return { completed, total };
  };

  // Analytics functions
  const getWeeklyTrends = (taskKey) => {
    const now = new Date();
    const weeks = [];
    
    // Get last 4 weeks
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7) - now.getDay() + 1); // Start of week (Monday)
      
      let completedDays = 0;
      let totalDays = 0;
      
      for (let j = 0; j < 7; j++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + j);
        
        // Skip Sundays
        if (date.getDay() === 0) continue;
        
        totalDays++;
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        const day = date.getDate();
        
        if (data[taskKey]?.[monthKey]?.[day] === 'right') {
          completedDays++;
        }
      }
      
      weeks.push({
        week: `Week ${4-i}`,
        completed: completedDays,
        total: totalDays,
        percentage: totalDays > 0 ? (completedDays / totalDays) * 100 : 0
      });
    }
    
    return weeks;
  };

  const getTaskDifficultyAnalysis = () => {
    const allTasks = getAllTasks();
    const analysis = [];
    
    Object.entries(allTasks).forEach(([taskKey, task]) => {
      const currentMonth = getCurrentMonthStats(taskKey);
      const previousMonth = getPreviousMonthStats(taskKey);
      
      const totalAttempts = currentMonth.total + previousMonth.total;
      const totalCompleted = currentMonth.completed + previousMonth.completed;
      const completionRate = totalAttempts > 0 ? (totalCompleted / totalAttempts) * 100 : 0;
      
      let difficulty = 'Easy';
      if (completionRate < 30) difficulty = 'Very Hard';
      else if (completionRate < 50) difficulty = 'Hard';
      else if (completionRate < 70) difficulty = 'Medium';
      else if (completionRate < 85) difficulty = 'Easy';
      else difficulty = 'Very Easy';
      
      analysis.push({
        taskKey,
        task,
        completionRate,
        difficulty,
        totalCompleted,
        totalAttempts
      });
    });
    
    return analysis.sort((a, b) => b.completionRate - a.completionRate);
  };

  const getOverallStats = () => {
    const allTasks = getAllTasks();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    let totalCompleted = 0;
    let totalPossible = 0;
    
    Object.keys(allTasks).forEach(taskKey => {
      const stats = getCurrentMonthStats(taskKey);
      totalCompleted += stats.completed;
      totalPossible += stats.total;
    });
    
    return {
      totalCompleted,
      totalPossible,
      completionRate: totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0,
      tasksCount: Object.keys(allTasks).length
    };
  };




  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const navigateToMonth = (month, year) => {
    setCurrentMonth(month);
    setCurrentYear(year);
    setViewMode('month');
  };


  // Render functions
  const renderMonthView = () => {
    const weeks = generateCalendar(currentMonth, currentYear);
    
    return (
      <div className={`${darkMode ? 'bg-black' : 'bg-white'} min-h-screen`}>
        {/* Month Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={() => navigateMonth('prev')}
              className={`p-2 rounded-full transition-colors ${
                darkMode 
                  ? 'hover:bg-gray-800 text-gray-400' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className={`text-3xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {monthNames[currentMonth]} {currentYear}
            </h1>
            <button
              onClick={() => navigateMonth('next')}
              className={`p-2 rounded-full transition-colors ${
                darkMode 
                  ? 'hover:bg-gray-800 text-gray-400' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-4 mb-6 px-4">
          {dayNames.map(dayName => (
            <div key={dayName} className={`text-center text-sm font-semibold ${
              darkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>
              {dayName}
            </div>
          ))}
        </div>

        {/* Calendar Grid with Clean Visual Indicators */}
        <div className="grid grid-cols-7 gap-3 px-4">
          {weeks.map((week, weekIndex) => 
            week.map((day, dayIndex) => {
              const completionPercentage = day ? getCompletionPercentage(day) : 0;
              const completedTasks = day ? getCompletedTasksForDay(day) : [];
              const allTasks = getAllTasks();
              
              return (
                <div key={`${weekIndex}-${dayIndex}`} className="flex flex-col items-center">
                  {day ? (
                    <div className="relative">
                      <button
                        onClick={() => handleDayClick(day)}
                        className={`w-12 h-12 rounded-xl transition-all duration-300 ease-out transform hover:scale-110 hover:shadow-lg active:scale-95 flex flex-col items-center justify-center ${
                          isToday(day) 
                            ? darkMode 
                              ? 'bg-blue-600 text-white ring-2 ring-blue-400' 
                              : 'bg-blue-500 text-white ring-2 ring-blue-300'
                            : completionPercentage === 100
                              ? darkMode
                                ? 'bg-green-600 text-white'
                                : 'bg-green-500 text-white'
                              : completionPercentage > 0
                                ? darkMode
                                  ? 'bg-yellow-600 text-white'
                                  : 'bg-yellow-400 text-white'
                                : darkMode
                                  ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <span className="text-sm font-medium">{day}</span>
                        {completionPercentage === 100 && (
                          <Check className="w-3 h-3 mt-0.5" />
                        )}
                      </button>
                      
                      {/* Task dots and comment indicator */}
                      <div className="flex justify-center items-center mt-1 gap-1">
                        {/* Task dots */}
                        {completedTasks.length > 0 && Object.keys(allTasks).length > 1 && (
                          <div className="flex gap-0.5">
                            {Object.entries(allTasks).slice(0, 3).map(([taskKey, task]) => {
                              const isTaskCompleted = getTaskStatus(taskKey, day);
                              return (
                                <div
                                  key={taskKey}
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    isTaskCompleted 
                                      ? task.color 
                                      : darkMode ? 'bg-gray-700' : 'bg-gray-300'
                                  }`}
                                />
                              );
                            })}
                            {Object.keys(allTasks).length > 3 && (
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                darkMode ? 'bg-gray-600' : 'bg-gray-400'
                              }`} />
                            )}
                          </div>
                        )}
                        
                        {/* Comment indicator */}
                        {comments[`${currentYear}-${currentMonth}-${day}`] && (
                          <MessageCircle className={`w-3 h-3 ${
                            darkMode ? 'text-blue-400' : 'text-blue-500'
                          }`} />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="w-12 h-12"></div>
                  )}
                </div>
              );
            })
          )}
        </div>
        
        {/* Legend */}
        <div className="flex justify-center mt-8 px-4">
          <div className={`flex items-center gap-6 p-4 rounded-xl ${
            darkMode ? 'bg-gray-900' : 'bg-gray-50'
          }`}>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-lg"></div>
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Complete
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded-lg"></div>
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Partial
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}></div>
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Not started
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-lg ring-2 ring-blue-300"></div>
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Today
              </span>
            </div>
          </div>
        </div>
        
      </div>
    );
  };

  const renderTodayView = () => {
    const now = new Date();
    const todayDate = now.getDate();
    const todayMonth = now.getMonth();
    const todayYear = now.getFullYear();
    
    const allTasks = getAllTasks();
    const completedTasksToday = getCompletedTasksForDay(todayDate, todayMonth, todayYear);
    const completionPercentage = getCompletionPercentage(todayDate, todayMonth, todayYear);

    return (
      <div className={`${darkMode ? 'bg-black' : 'bg-white'} min-h-screen`}>
        {/* Ultra Minimalist Header */}
        <div className="text-center pt-8 pb-6 px-6">
          <div className={`text-lg font-normal mb-1 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {now.toLocaleDateString('en-US', { weekday: 'long' })}
          </div>
          <div className={`text-sm font-mono ${
            darkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            {currentTimeState}
          </div>
        </div>

        {/* Tasks and Notes Side by Side */}
        <div className="px-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tasks Section */}
            <div>
              <h3 className={`text-sm font-medium mb-4 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Today's Tasks
              </h3>
              <div className="space-y-2">
                {Object.entries(allTasks).map(([taskKey, task]) => {
                  const isCompleted = data[taskKey]?.[`${todayYear}-${todayMonth}`]?.[todayDate] === 'right';
                  return (
                    <button
                      key={taskKey}
                      onClick={() => {
                        setSelectedDay(todayDate);
                        setCurrentMonth(todayMonth);
                        setCurrentYear(todayYear);
                        handleTaskToggle(taskKey);
                      }}
                      className={`w-full p-3 rounded-lg transition-all duration-300 ease-out transform hover:scale-[1.02] hover:shadow-md active:scale-[0.98] flex items-center gap-3 ${
                        darkMode 
                          ? 'hover:bg-gray-900/50' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-green-500 border-green-500'
                          : darkMode
                            ? 'border-gray-600'
                            : 'border-gray-300'
                      }`}>
                        {isCompleted && <Check className="w-3 h-3 text-white" />}
                      </div>
                      
                      <div className="flex-1 text-left">
                        <div className={`text-sm font-medium ${
                          isCompleted 
                            ? 'line-through opacity-50' 
                            : ''
                        } ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {task.label}
                        </div>
                      </div>
                      
                      {layoutSettings.showTaskColors && (
                        <div className={`w-2 h-2 rounded-full ${task.color} ${
                          isCompleted ? 'opacity-30' : 'opacity-70'
                        }`} />
                      )}
                    </button>
                  );
                })}
              </div>
              
              {/* Progress Summary */}
              <div className="mt-6 text-center">
                <div className={`text-2xl font-light ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {completedTasksToday.length}/{Object.keys(allTasks).length}
                </div>
                <div className={`text-xs ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  completed today
                </div>
              </div>
              
              {/* Quick Stats */}
              {completionPercentage > 0 && (
                <div className="flex justify-center mt-4">
                  <div className={`px-4 py-2 rounded-full text-xs ${
                    completionPercentage === 100 
                      ? 'bg-green-100 text-green-800' 
                      : completionPercentage >= 50
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600'
                  }`}>
                    {completionPercentage === 100 ? '✨ Perfect day!' : 
                     completionPercentage >= 75 ? '🎯 Almost there!' :
                     completionPercentage >= 50 ? '💪 Good progress' :
                     '🌱 Keep going'}
                  </div>
                </div>
              )}
            </div>

            {/* Notes Section */}
            <div>
              <h3 className={`text-sm font-medium mb-4 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Today's Notes
              </h3>
              <textarea
                value={todayNotes}
                onChange={(e) => setTodayNotes(e.target.value)}
                placeholder="What's on your mind today?"
                className={`w-full p-4 rounded-lg border-0 resize-none text-sm leading-relaxed transition-all duration-300 ease-out focus:outline-none focus:scale-[1.01] focus:shadow-lg ${
                  darkMode 
                    ? 'bg-gray-900/50 text-gray-300 placeholder-gray-600 focus:bg-gray-900/70' 
                    : 'bg-gray-50 text-gray-700 placeholder-gray-400 focus:bg-gray-100'
                }`}
                rows={12}
              />
            </div>
          </div>
        </div>

        <div className="pb-8"></div>
      </div>
    );
  };

  const renderYearView = () => {
    const months = Array.from({ length: 12 }, (_, i) => i);

    const MiniCalendar = ({ month, year }) => {
      const weeks = generateCalendar(month, year);
      return (
        <button
          onClick={() => navigateToMonth(month, year)}
          className={`p-4 rounded-xl transition-all hover:scale-105 ${
            darkMode ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <h3 className={`text-sm font-semibold mb-3 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {monthNames[month]}
          </h3>
          
          {/* Mini calendar grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {/* Day headers */}
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => (
              <div key={day} className={`text-xs font-medium p-1 ${
                darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {weeks.flat().map((day, index) => {
              if (!day) {
                return <div key={index} className="w-5 h-5"></div>;
              }
              
              const completionPercentage = getCompletionPercentage(day, month, year);
              const hasCompletedTasks = completionPercentage > 0;
              const isDayToday = isToday(day, month, year);
              
              return (
                <div 
                  key={index} 
                  className={`relative w-5 h-5 flex items-center justify-center ${
                    isDayToday ? 'bg-blue-500 rounded-full' : ''
                  }`}
                >
                  {hasCompletedTasks && layoutSettings.showProgress ? (
                    <div className="relative">
                      <svg width="16" height="16" className="transform -rotate-90">
                        <circle
                          cx="8"
                          cy="8"
                          r="6"
                          fill="none"
                          stroke={darkMode ? '#2d2d2d' : '#e5e5e5'}
                          strokeWidth="2"
                        />
                        <circle
                          cx="8"
                          cy="8"
                          r="6"
                          fill="none"
                          stroke="#ff0844"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeDasharray={37.7}
                          strokeDashoffset={37.7 - (completionPercentage / 100) * 37.7}
                        />
                      </svg>
                      <div className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${
                        isDayToday ? 'text-white' : darkMode ? 'text-white' : 'text-gray-900'
                      }`} style={{ fontSize: '8px' }}>
                        {day}
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <span className={`text-xs ${
                        isDayToday ? 'text-white font-bold' : darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {day}
                      </span>
                      {hasCompletedTasks && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </button>
      );
    };

    return (
      <div className={`${darkMode ? 'bg-black' : 'bg-white'} min-h-screen p-6`}>
        <div className="flex justify-between items-center mb-8">
          <h2 className={`text-3xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {currentYear}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentYear(currentYear - 1)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                darkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
            >
              {currentYear - 1}
            </button>
            <button
              onClick={() => setCurrentYear(currentYear + 1)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                darkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
            >
              {currentYear + 1}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 lg:grid-cols-4 gap-6">
          {months.map(month => (
            <MiniCalendar key={month} month={month} year={currentYear} />
          ))}
        </div>
      </div>
    );
  };

  const renderAnalyticsView = () => {
    const overallStats = getOverallStats();
    const difficultyAnalysis = getTaskDifficultyAnalysis();
    
    return (
      <div className={`${darkMode ? 'bg-black' : 'bg-white'} min-h-screen p-6`}>
        {/* Overall Stats Header */}
        <div className="mb-8">
          <h2 className={`text-3xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Analytics & Insights
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-xl ${
              darkMode ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
              <div className={`text-2xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {overallStats.totalCompleted}
              </div>
              <div className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Completed This Month
              </div>
            </div>
            
            <div className={`p-4 rounded-xl ${
              darkMode ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
              <div className={`text-2xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {Math.round(overallStats.completionRate)}%
              </div>
              <div className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Overall Completion
              </div>
            </div>
            
            <div className={`p-4 rounded-xl ${
              darkMode ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
              <div className={`text-2xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {overallStats.tasksCount}
              </div>
              <div className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Active Tasks
              </div>
            </div>
            
            <div className={`p-4 rounded-xl ${
              darkMode ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
              <div className={`text-2xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {overallStats.totalPossible - overallStats.totalCompleted}
              </div>
              <div className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Days Remaining
              </div>
            </div>
          </div>
        </div>

        {/* Task Difficulty Analysis */}
        <div className="mb-8">
          <h3 className={`text-xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Task Difficulty Analysis
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {difficultyAnalysis.map(({ taskKey, task, completionRate, difficulty, totalCompleted, totalAttempts }) => (
              <div key={taskKey} className={`p-4 rounded-xl ${
                darkMode ? 'bg-gray-900' : 'bg-gray-50'
              } border ${
                darkMode ? 'border-gray-800' : 'border-gray-200'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-3 h-3 rounded-full ${task.color}`} />
                  <h4 className={`font-medium ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {task.label}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    difficulty === 'Very Easy' ? 'bg-green-100 text-green-800' :
                    difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                    difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    difficulty === 'Hard' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {difficulty}
                  </span>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Completion Rate
                  </span>
                  <span className={`font-bold ${
                    completionRate >= 70 ? 'text-green-500' :
                    completionRate >= 50 ? 'text-yellow-500' :
                    'text-red-500'
                  }`}>
                    {Math.round(completionRate)}%
                  </span>
                </div>
                
                {/* Chart Type Conditional Rendering */}
                {analyticsSettings.chartType === 'progress' ? (
                  /* Progress Ring */
                  <div className="flex justify-center mb-3">
                    <div className="relative w-16 h-16">
                      <svg width="64" height="64" className="transform -rotate-90">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          fill="none"
                          stroke={darkMode ? '#374151' : '#e5e7eb'}
                          strokeWidth="4"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          fill="none"
                          stroke={completionRate >= 70 ? '#10b981' : completionRate >= 50 ? '#f59e0b' : '#ef4444'}
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray={176}
                          strokeDashoffset={176 - (completionRate / 100) * 176}
                          className="transition-all duration-500"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {Math.round(completionRate)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ) : analyticsSettings.chartType === 'bars' ? (
                  /* Bar Chart */
                  <div className="mb-3">
                    <div className="flex items-end justify-center gap-1 h-12">
                      {Array.from({length: 10}, (_, i) => (
                        <div
                          key={i}
                          className={`w-2 rounded-t transition-all duration-500 ${
                            (i + 1) * 10 <= completionRate
                              ? completionRate >= 70 ? 'bg-green-500' : completionRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                              : darkMode ? 'bg-gray-700' : 'bg-gray-200'
                          }`}
                          style={{ height: `${Math.min((i + 1) * 10, 100) / 100 * 48}px` }}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Line Chart */
                  <div className="mb-3">
                    <div className="relative h-8">
                      <div className={`w-full h-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <div 
                          className={`h-1 rounded-full relative ${
                            completionRate >= 70 ? 'bg-green-500' :
                            completionRate >= 50 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${completionRate}%` }}
                        >
                          <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white ${
                            completionRate >= 70 ? 'bg-green-500' :
                            completionRate >= 50 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between text-xs">
                  <span className={darkMode ? 'text-gray-500' : 'text-gray-500'}>
                    {totalCompleted}/{totalAttempts} days
                  </span>
                  {task.category && (
                    <span className={`px-2 py-1 rounded-full ${
                      darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {task.category}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Trends */}
        <div className="mb-8">
          <h3 className={`text-xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Weekly Trends
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(getAllTasks()).map(([taskKey, task]) => {
              const weeklyData = getWeeklyTrends(taskKey);
              
              return (
                <div key={taskKey} className={`p-4 rounded-xl ${
                  darkMode ? 'bg-gray-900' : 'bg-gray-50'
                } border ${
                  darkMode ? 'border-gray-800' : 'border-gray-200'
                }`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-3 h-3 rounded-full ${task.color}`} />
                    <h4 className={`font-medium ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {task.label}
                    </h4>
                  </div>
                  
                  <div className="space-y-3">
                    {weeklyData.map((week, index) => (
                      <div key={week.week} className="flex items-center justify-between">
                        <span className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {week.week}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className={`w-16 bg-gray-200 rounded-full h-2 ${
                            darkMode ? 'bg-gray-700' : 'bg-gray-200'
                          }`}>
                            <div 
                              className={`h-2 rounded-full ${task.color}`}
                              style={{ width: `${week.percentage}%` }}
                            />
                          </div>
                          <span className={`text-sm font-medium w-12 text-right ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {Math.round(week.percentage)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ease-out scroll-smooth ${
      darkMode ? 'bg-black' : 'bg-white'
    }`} style={{ scrollBehavior: 'smooth' }}>
      {!showOptions && (
        <>
          {/* Apple-style Header */}
          <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <h1 className={`text-xl font-semibold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Daily Tracker
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Settings Button */}
              <button
                onClick={() => setShowSettings(true)}
                className={`p-2 rounded-full transition-all duration-300 ease-out transform hover:scale-110 hover:shadow-md active:scale-95 ${
                  darkMode 
                    ? 'hover:bg-gray-800 text-gray-400' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* Backup Options Button */}
              <button
                onClick={() => setShowBackupOptions(true)}
                className={`p-2 rounded-full transition-all duration-300 ease-out transform hover:scale-110 hover:shadow-md active:scale-95 ${
                  darkMode 
                    ? 'hover:bg-gray-800 text-blue-400' 
                    : 'hover:bg-gray-100 text-blue-600'
                }`}
                title="Backup & Recovery"
              >
                🛡️
              </button>
              
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-full transition-all duration-300 ease-out transform hover:scale-110 hover:shadow-md active:scale-95 ${
                  darkMode 
                    ? 'hover:bg-gray-800 text-yellow-400' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </header>

          {/* View Toggle with Add Task Button */}
          <div className="flex justify-between items-center py-4 px-6">
            <div className="flex-1"></div>
            
            {/* Centered View Toggle */}
            <div className={`flex rounded-xl ${
              darkMode ? 'bg-gray-900' : 'bg-gray-100'
            } p-1`}>
              {[
                { key: 'today', label: 'Today', icon: Sun },
                { key: 'month', label: 'Month', icon: Calendar },
                { key: 'year', label: 'Year', icon: Calendar },
                { key: 'analytics', label: 'Analytics', icon: BarChart3 }
              ].map(view => (
                <button
                  key={view.key}
                  onClick={() => setViewMode(view.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 ${
                    viewMode === view.key
                      ? darkMode 
                        ? 'bg-gray-700 text-white shadow-lg' 
                        : 'bg-white text-gray-900 shadow-lg'
                      : darkMode
                        ? 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <view.icon className="w-4 h-4" />
                  <span className="text-sm">{view.label}</span>
                </button>
              ))}
            </div>
            
            {/* Add Task Button - Right Corner */}
            <div className="flex-1 flex justify-end">
              <button
                onClick={() => setShowAddTask(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ease-out transform hover:scale-110 hover:shadow-lg active:scale-95 ${
                  darkMode 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Add Task</span>
              </button>
            </div>
          </div>

          {/* Monthly Progress Section */}
          <div className="px-6 mb-6">
            <h2 className={`text-lg font-semibold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Monthly Progress (Excluding Sundays)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(getAllTasks()).map(([taskKey, task]) => {
                const currentMonth = getCurrentMonthStats(taskKey);
                const previousMonth = getPreviousMonthStats(taskKey);
                const currentMonthName = monthNames[new Date().getMonth()];
                const prevMonthName = monthNames[new Date().getMonth() - 1 >= 0 ? new Date().getMonth() - 1 : 11];
                
                // Calculate improvement/decline
                const currentPercentage = currentMonth.total > 0 ? (currentMonth.completed / currentMonth.total) * 100 : 0;
                const previousPercentage = previousMonth.total > 0 ? (previousMonth.completed / previousMonth.total) * 100 : 0;
                const difference = currentMonth.completed - previousMonth.completed;
                
                return (
                  <div
                    key={taskKey}
                    className={`p-4 rounded-xl ${
                      darkMode ? 'bg-gray-900' : 'bg-gray-50'
                    } border ${
                      darkMode ? 'border-gray-800' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-3 h-3 rounded-full ${task.color}`} />
                      <h3 className={`font-medium ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {task.label}
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className={`text-xl font-bold ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {currentMonth.completed}/{currentMonth.total}
                        </div>
                        <div className={`text-xs ${
                          darkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          {currentMonthName}
                        </div>
                        <div className={`text-xs font-medium ${
                          currentPercentage > 0 ? 'text-green-500' : darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {Math.round(currentPercentage)}%
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className={`text-xl font-bold ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {previousMonth.completed}/{previousMonth.total}
                        </div>
                        <div className={`text-xs ${
                          darkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          {prevMonthName}
                        </div>
                        <div className={`text-xs font-medium ${
                          previousPercentage > 0 ? 'text-blue-400' : darkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          {Math.round(previousPercentage)}%
                        </div>
                      </div>
                    </div>
                    
                    {difference !== 0 && (
                      <div className="mt-3 flex items-center justify-center gap-1">
                        <span className={`text-sm ${
                          difference > 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {difference > 0 ? '📈' : '📉'}
                        </span>
                        <span className={`text-xs ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {difference > 0 ? '+' : ''}{difference} days vs last month
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Task Management Section - Only show when not in month or today view */}
          {viewMode === 'year' && (
            <div className="px-6 mb-6">
              <div className="mb-4">
                <h2 className={`text-lg font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Your Tasks
                </h2>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {Object.entries(getAllTasks()).map(([taskKey, task]) => (
                  <div key={taskKey} className="flex items-center gap-1">
                    <div className={`px-3 py-1 rounded-full font-medium flex items-center gap-2 ${task.color} text-white`}>
                      <div className="w-2 h-2 bg-white/30 rounded-full" />
                      {task.label}
                    </div>
                    
                    <button
                      onClick={() => editTaskColor(taskKey)}
                      className={`p-1 rounded-full transition-colors ${
                        darkMode 
                          ? 'text-gray-400 hover:bg-gray-700 hover:text-white' 
                          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                      }`}
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    
                    {!defaultTasks[taskKey] && (
                      <button
                        onClick={() => removeCustomTask(taskKey)}
                        className={`p-1 rounded-full transition-colors ${
                          darkMode 
                            ? 'text-red-400 hover:bg-red-900/20' 
                            : 'text-red-500 hover:bg-red-50'
                        }`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Main Content */}
      <div className="transition-all duration-500 ease-out">
        {viewMode === 'today' && <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-300">{renderTodayView()}</div>}
        {viewMode === 'month' && <div className="animate-in fade-in-0 slide-in-from-left-4 duration-300">{renderMonthView()}</div>}
        {viewMode === 'year' && <div className="animate-in fade-in-0 slide-in-from-right-4 duration-300">{renderYearView()}</div>}
        {viewMode === 'analytics' && <div className="animate-in fade-in-0 slide-in-from-top-4 duration-300">{renderAnalyticsView()}</div>}
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-300">
          <div className={`rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out animate-in zoom-in-95 slide-in-from-bottom-4 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-xl font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Add New Task
            </h3>
            
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Task Name *
              </label>
              <input
                type="text"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="e.g., AWS Study"
                className={`w-full p-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                }`}
              />
            </div>

            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Category
              </label>
              <input
                type="text"
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value)}
                placeholder="e.g., Development, Health, Fitness"
                className={`w-full p-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                }`}
              />
            </div>

            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Priority
              </label>
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value)}
                className={`w-full p-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                    : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                }`}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Notes
              </label>
              <textarea
                value={newTaskNotes}
                onChange={(e) => setNewTaskNotes(e.target.value)}
                placeholder="Add any notes or description for this task..."
                rows={3}
                className={`w-full p-3 border-2 rounded-lg focus:outline-none resize-none transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                }`}
              />
            </div>

            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Color
              </label>
              <div className="grid grid-cols-6 gap-2">
                {availableColors.map(color => (
                  <button
                    key={color}
                    onClick={() => setNewTaskColor(color)}
                    className={`w-8 h-8 rounded-lg ${color} transition-all ${
                      newTaskColor === color 
                        ? 'ring-2 ring-offset-2 ring-blue-500' 
                        : 'hover:scale-110'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={addCustomTask}
                disabled={!newTaskName.trim()}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                  darkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                Add Task
              </button>
              <button
                onClick={() => {
                  setShowAddTask(false);
                  setNewTaskName('');
                  setNewTaskColor('bg-teal-500');
                  setNewTaskCategory('');
                  setNewTaskPriority('medium');
                  setNewTaskNotes('');
                }}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Color Modal */}
      {showEditTask && editingTask && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`rounded-2xl p-6 w-full max-w-md shadow-2xl border ${
              darkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-xl font-bold mb-6 text-center ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Edit Task Color
              </h3>
              
              <div className="mb-6 text-center">
                <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full ${editingTask.color} text-white mb-4`}>
                  <div className="w-3 h-3 bg-white/30 rounded-full" />
                  {editingTask.label}
                </div>
              </div>

              <div className="mb-6">
                <label className={`block text-sm font-semibold mb-3 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Choose Color:
                </label>
                <div className="grid grid-cols-6 gap-3">
                  {availableColors.map(color => (
                    <button
                      key={color}
                      onClick={() => saveTaskEdit(color)}
                      className={`w-10 h-10 rounded-xl ${color} transition-all hover:scale-110 ${
                        editingTask.color === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setShowEditTask(false);
                  setEditingTask(null);
                }}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Apple Activity Style Day Detail View */}
        {showOptions && selectedDay && (
          <div className={`fixed inset-0 z-50 ${darkMode ? 'bg-black' : 'bg-white'} flex flex-col animate-in fade-in-0 slide-in-from-right-4 duration-300`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <button
                onClick={() => {
                  setShowOptions(false);
                  setSelectedDay(null);
                  setCurrentComment('');
                }}
                className={`flex items-center gap-2 text-lg font-medium ${
                  darkMode ? 'text-green-400' : 'text-green-600'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigateDay('prev')}
                  className={`p-2 rounded-full transition-all duration-300 ease-out transform hover:scale-110 hover:shadow-md active:scale-95 ${
                    darkMode 
                      ? 'hover:bg-gray-800 text-gray-400' 
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                  title="Previous day"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <h1 className={`text-lg font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {new Date(currentYear, currentMonth, selectedDay).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </h1>
                
                <button
                  onClick={() => navigateDay('next')}
                  className={`p-2 rounded-full transition-all duration-300 ease-out transform hover:scale-110 hover:shadow-md active:scale-95 ${
                    darkMode 
                      ? 'hover:bg-gray-800 text-gray-400' 
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                  title="Next day"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              
              <div className="w-16"></div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 min-h-full max-w-none">
                  {/* Progress Section - Left Side */}
                  <div className="flex flex-col items-center justify-center py-8">
                    {/* Activity Ring */}
                    {layoutSettings.showProgress && (
                      <div className="relative mb-8 transition-all duration-300 ease-out hover:scale-105">
                        <ActivityRing 
                          percentage={getCompletionPercentage(selectedDay)} 
                          size={280} 
                          strokeWidth={20} 
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className={`text-5xl sm:text-6xl font-bold mb-2 ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {Math.round(getCompletionPercentage(selectedDay))}%
                          </div>
                          <div className={`text-lg ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Complete
                          </div>
                        </div>
                      </div>
                      </div>
                    )}

                    {/* Task Statistics */}
                    <div className="grid grid-cols-2 gap-12 w-full max-w-md">
                      <div className="text-center">
                        <div className={`text-4xl font-bold ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {getCompletedTasksForDay(selectedDay).length}
                        </div>
                        <div className={`text-base ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Completed
                        </div>
                      </div>
                      <div className="text-center">
                        <div className={`text-4xl font-bold ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {Object.keys(getAllTasks()).length}
                        </div>
                        <div className={`text-base ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Total Tasks
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Tasks and Notes */}
                  <div className="flex flex-col gap-8">
                    {/* Tasks Section - Right Top */}
                    <div className="flex-1">
                      <h2 className={`text-2xl font-bold mb-4 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Tasks
                      </h2>
                      <div className="space-y-3">
                        {Object.entries(getAllTasks()).map(([taskKey, task]) => {
                          const isCompleted = getTaskStatus(taskKey, selectedDay);
                          return (
                            <button
                              key={taskKey}
                              onClick={() => handleTaskToggle(taskKey)}
                              className={`w-full p-4 rounded-xl transition-all duration-300 ease-out transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] flex items-center gap-4 ${
                                darkMode ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-50 hover:bg-gray-100'
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                                isCompleted
                                  ? 'bg-green-500 border-green-500'
                                  : darkMode
                                    ? 'border-gray-600'
                                    : 'border-gray-300'
                              }`}>
                                {isCompleted && <Check className="w-5 h-5 text-white" />}
                              </div>
                              <div className="flex-1 text-left">
                                <div className={`font-medium text-base ${
                                  darkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {task.label}
                                </div>
                              </div>
                              <div className={`w-4 h-4 rounded-full ${task.color}`} />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Notes Section - Right Bottom */}
                    <div className="flex-1">
                      <h2 className={`text-2xl font-bold mb-4 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Notes
                      </h2>
                      <div className="space-y-4">
                        <textarea
                          value={currentComment}
                          onChange={(e) => {
                            setCurrentComment(e.target.value);
                            // Auto-save comment as user types
                            const commentKey = `${currentYear}-${currentMonth}-${selectedDay}`;
                            setComments(prev => ({
                              ...prev,
                              [commentKey]: e.target.value
                            }));
                          }}
                          placeholder="Add a note about your day..."
                          className={`w-full p-4 rounded-xl border-2 transition-colors resize-none text-base leading-relaxed ${
                            darkMode 
                              ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-gray-500' 
                              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400'
                          } focus:outline-none`}
                          rows={8}
                        />
                        <div className="flex justify-end">
                          <button
                            onClick={() => {
                              saveComment();
                              setShowOptions(false);
                              setSelectedDay(null);
                              setCurrentComment('');
                            }}
                            className={`px-6 py-3 rounded-xl text-base font-medium transition-colors ${
                              darkMode 
                                ? 'bg-green-600 hover:bg-green-700 text-white' 
                                : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                          >
                            Save & Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-300">
            <div className={`rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all duration-300 ease-out animate-in zoom-in-95 slide-in-from-top-4 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              {/* Settings Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className={`text-2xl font-bold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Settings
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className={`p-2 rounded-full transition-all duration-300 ease-out transform hover:scale-110 active:scale-95 ${
                    darkMode 
                      ? 'hover:bg-gray-700 text-gray-400' 
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex h-[70vh]">
                {/* Settings Sidebar */}
                <div className={`w-64 border-r ${darkMode ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50'} p-4`}>
                  <nav className="space-y-2">
                    {[
                      { id: 'tasks', label: 'Task Management', icon: Edit3 },
                      { id: 'analytics', label: 'Analytics Options', icon: BarChart3 },
                      { id: 'layout', label: 'Layout & View', icon: Palette }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setSettingsTab(tab.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-300 ease-out transform hover:scale-[1.02] ${
                          settingsTab === tab.id
                            ? darkMode
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'bg-blue-500 text-white shadow-lg'
                            : darkMode
                              ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                              : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                        }`}
                      >
                        <tab.icon className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Settings Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                  {settingsTab === 'tasks' && (
                    <div>
                      <h4 className={`text-xl font-bold mb-6 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Task Management
                      </h4>

                      {/* Existing Tasks */}
                      <div className="space-y-4">
                        <h5 className={`text-lg font-semibold ${
                          darkMode ? 'text-gray-200' : 'text-gray-800'
                        }`}>
                          Your Tasks
                        </h5>
                        
                        {Object.entries(getAllTasks()).map(([taskKey, task]) => (
                          <div key={taskKey} className={`p-4 rounded-xl border ${
                            darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'
                          }`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={`w-6 h-6 rounded-full ${task.color}`} />
                                <div>
                                  <div className={`font-medium ${
                                    darkMode ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    {task.label}
                                  </div>
                                  {task.category && (
                                    <div className={`text-sm ${
                                      darkMode ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                      {task.category} • {task.priority} priority
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => editTaskInSettings(taskKey)}
                                  className={`p-2 rounded-lg transition-all duration-300 ease-out transform hover:scale-110 active:scale-95 ${
                                    darkMode 
                                      ? 'hover:bg-gray-800 text-gray-400' 
                                      : 'hover:bg-gray-200 text-gray-600'
                                  }`}
                                  title="Edit Task"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                
                                <button
                                  onClick={() => deleteTaskInSettings(taskKey)}
                                  className={`p-2 rounded-lg transition-all duration-300 ease-out transform hover:scale-110 active:scale-95 ${
                                    darkMode 
                                      ? 'hover:bg-red-900/20 text-red-400' 
                                      : 'hover:bg-red-50 text-red-500'
                                  }`}
                                  title="Delete Task"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {/* Add New Task Button */}
                        <button
                          onClick={() => {
                            setShowSettings(false);
                            setShowAddTask(true);
                          }}
                          className={`w-full p-4 border-2 border-dashed rounded-xl transition-all duration-300 ease-out transform hover:scale-[1.02] hover:shadow-md flex items-center justify-center gap-2 ${
                            darkMode 
                              ? 'border-gray-600 hover:border-gray-500 text-gray-400 hover:text-gray-300' 
                              : 'border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-700'
                          }`}
                        >
                          <Plus className="w-5 h-5" />
                          <span>Add New Task</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {settingsTab === 'analytics' && (
                    <div>
                      <h4 className={`text-xl font-bold mb-6 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Analytics Options
                      </h4>

                      <div className="space-y-6">
                        {/* Chart Type Selection */}
                        <div>
                          <h5 className={`text-lg font-semibold mb-4 ${
                            darkMode ? 'text-gray-200' : 'text-gray-800'
                          }`}>
                            Chart Display Type
                          </h5>
                          <div className="grid grid-cols-3 gap-4">
                            {[
                              { id: 'progress', label: 'Progress Rings', desc: 'Circular progress indicators' },
                              { id: 'bars', label: 'Bar Charts', desc: 'Traditional bar charts' },
                              { id: 'lines', label: 'Line Graphs', desc: 'Trend line graphs' }
                            ].map(chart => (
                              <button
                                key={chart.id}
                                onClick={() => setAnalyticsSettings(prev => ({ ...prev, chartType: chart.id }))}
                                className={`p-4 rounded-xl border-2 transition-all duration-300 ease-out transform hover:scale-105 ${
                                  analyticsSettings.chartType === chart.id
                                    ? darkMode
                                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                                      : 'border-blue-500 bg-blue-50 text-blue-600'
                                    : darkMode
                                      ? 'border-gray-600 hover:border-gray-500 text-gray-300'
                                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                }`}
                              >
                                <div className="font-medium mb-1">{chart.label}</div>
                                <div className="text-sm opacity-75">{chart.desc}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Analytics Features */}
                        <div>
                          <h5 className={`text-lg font-semibold mb-4 ${
                            darkMode ? 'text-gray-200' : 'text-gray-800'
                          }`}>
                            Analytics Features
                          </h5>
                          <div className="space-y-3">
                            {[
                              { key: 'showWeeklyTrends', label: 'Weekly Trends', desc: 'Show 4-week progress trends' },
                              { key: 'showDifficulty', label: 'Task Difficulty Analysis', desc: 'Analyze task completion difficulty' },
                              { key: 'showMonthlyComparison', label: 'Monthly Comparison', desc: 'Compare current vs previous month' },
                              { key: 'excludeSundays', label: 'Exclude Sundays', desc: 'Skip Sundays in calculations' }
                            ].map(feature => (
                              <label key={feature.key} className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300 ease-out hover:scale-[1.01] ${
                                darkMode ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-50 hover:bg-gray-100'
                              }`}>
                                <div>
                                  <div className={`font-medium ${
                                    darkMode ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    {feature.label}
                                  </div>
                                  <div className={`text-sm ${
                                    darkMode ? 'text-gray-400' : 'text-gray-600'
                                  }`}>
                                    {feature.desc}
                                  </div>
                                </div>
                                <input
                                  type="checkbox"
                                  checked={analyticsSettings[feature.key]}
                                  onChange={(e) => setAnalyticsSettings(prev => ({ 
                                    ...prev, 
                                    [feature.key]: e.target.checked 
                                  }))}
                                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                />
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {settingsTab === 'layout' && (
                    <div>
                      <h4 className={`text-xl font-bold mb-6 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Layout & View Options
                      </h4>

                      <div className="space-y-6">
                        {/* Layout Options */}
                        <div>
                          <h5 className={`text-lg font-semibold mb-4 ${
                            darkMode ? 'text-gray-200' : 'text-gray-800'
                          }`}>
                            Layout Settings
                          </h5>
                          <div className="space-y-3">
                            {[
                              { key: 'compactMode', label: 'Compact Mode', desc: 'Reduce spacing and padding' },
                              { key: 'showTaskColors', label: 'Show Task Colors', desc: 'Display colored dots for tasks' },
                              { key: 'showProgress', label: 'Show Progress Rings', desc: 'Display circular progress indicators' },
                              { key: 'animationsEnabled', label: 'Enable Animations', desc: 'Smooth transitions and hover effects' }
                            ].map(option => (
                              <label key={option.key} className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300 ease-out hover:scale-[1.01] ${
                                darkMode ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-50 hover:bg-gray-100'
                              }`}>
                                <div>
                                  <div className={`font-medium ${
                                    darkMode ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    {option.label}
                                  </div>
                                  <div className={`text-sm ${
                                    darkMode ? 'text-gray-400' : 'text-gray-600'
                                  }`}>
                                    {option.desc}
                                  </div>
                                </div>
                                <input
                                  type="checkbox"
                                  checked={layoutSettings[option.key]}
                                  onChange={(e) => setLayoutSettings(prev => ({ 
                                    ...prev, 
                                    [option.key]: e.target.checked 
                                  }))}
                                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                />
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Theme Options */}
                        <div>
                          <h5 className={`text-lg font-semibold mb-4 ${
                            darkMode ? 'text-gray-200' : 'text-gray-800'
                          }`}>
                            Theme Options
                          </h5>
                          <div className="grid grid-cols-2 gap-4">
                            <button
                              onClick={() => setDarkMode(false)}
                              className={`p-4 rounded-xl border-2 transition-all duration-300 ease-out transform hover:scale-105 ${
                                !darkMode
                                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                                  : 'border-gray-300 hover:border-gray-400 text-gray-700 bg-white'
                              }`}
                            >
                              <Sun className="w-8 h-8 mx-auto mb-2" />
                              <div className="font-medium">Light Mode</div>
                            </button>
                            <button
                              onClick={() => setDarkMode(true)}
                              className={`p-4 rounded-xl border-2 transition-all duration-300 ease-out transform hover:scale-105 ${
                                darkMode
                                  ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                                  : 'border-gray-600 hover:border-gray-500 text-gray-300 bg-gray-800'
                              }`}
                            >
                              <Moon className="w-8 h-8 mx-auto mb-2" />
                              <div className="font-medium">Dark Mode</div>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Task Edit Modal in Settings */}
        {editingTaskInSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4 animate-in fade-in-0 duration-300">
            <div className={`rounded-xl p-6 w-full max-w-md transform transition-all duration-300 ease-out animate-in zoom-in-95 slide-in-from-top-4 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h3 className={`text-xl font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Edit Task
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Task Name
                  </label>
                  <input
                    type="text"
                    value={editingTaskInSettings.label}
                    onChange={(e) => setEditingTaskInSettings(prev => ({ ...prev, label: e.target.value }))}
                    className={`w-full p-3 rounded-lg border transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    placeholder="Enter task name"
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Color
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {[
                      'bg-red-500', 'bg-blue-500', 'bg-green-500', 
                      'bg-yellow-500', 'bg-purple-500', 'bg-pink-500',
                      'bg-indigo-500', 'bg-cyan-500', 'bg-emerald-500',
                      'bg-orange-500', 'bg-teal-500', 'bg-violet-500'
                    ].map(color => (
                      <button
                        key={color}
                        onClick={() => setEditingTaskInSettings(prev => ({ ...prev, color }))}
                        className={`w-10 h-10 rounded-lg transition-all duration-300 ease-out transform hover:scale-110 active:scale-95 ${color} ${
                          editingTaskInSettings.color === color 
                            ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800' 
                            : 'hover:ring-2 hover:ring-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setEditingTaskInSettings(null)}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    saveTaskInSettings(editingTaskInSettings.label, editingTaskInSettings.color);
                  }}
                  className="flex-1 py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Backup Options Modal */}
        {showBackupOptions && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-300">
            <div className={`rounded-xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto transform transition-all duration-300 ease-out animate-in zoom-in-95 slide-in-from-top-4 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h3 className={`text-xl font-bold mb-6 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                🛡️ Backup & Recovery
              </h3>
              
              {/* Auto-Backup Status */}
              <div className={`p-4 rounded-lg mb-6 ${
                darkMode ? 'bg-gray-700' : 'bg-green-50'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-500">✅</span>
                  <span className={`font-semibold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Auto-Backup Active
                  </span>
                </div>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Your data is automatically backed up locally with 3 rotating copies.
                </p>
              </div>

              {/* Backup Options */}
              <div className="space-y-4">
                <h4 className={`font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Backup Options
                </h4>
                
                <button
                  onClick={exportData}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span>💾</span>
                    <div>
                      <div className="font-medium">Download File</div>
                      <div className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Save a backup file to your computer
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={copyToClipboard}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span>📋</span>
                    <div>
                      <div className="font-medium">Copy to Clipboard</div>
                      <div className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Copy data to paste into notes or cloud storage
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={saveToIndexedDB}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span>🗄️</span>
                    <div>
                      <div className="font-medium">Save to Browser Database</div>
                      <div className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        More persistent than localStorage
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              {/* Recovery Options */}
              <div className="space-y-4 mt-6">
                <h4 className={`font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Recovery Options
                </h4>
                
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map(num => (
                    <button
                      key={num}
                      onClick={() => recoverFromBackup(num)}
                      className={`p-3 rounded-lg text-center transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                      }`}
                    >
                      <div className="text-lg">🔄</div>
                      <div className="text-xs">Backup {num}</div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setShowBackupOptions(false);
                    setShowImport(true);
                  }}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span>📁</span>
                    <div>
                      <div className="font-medium">Import from File</div>
                      <div className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Restore from a downloaded backup file
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              <button
                onClick={() => setShowBackupOptions(false)}
                className={`w-full mt-6 py-3 px-4 rounded-lg font-semibold transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Import Modal */}
        {showImport && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className={`rounded-xl p-6 w-full max-w-md ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h3 className={`text-xl font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Import Backup
              </h3>
              
              <p className={`text-sm mb-4 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Select a backup file to restore your data. This will replace all current data.
              </p>
              
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className={`w-full p-3 border-2 border-dashed rounded-lg mb-4 ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-700 text-white' 
                    : 'border-gray-300 bg-gray-50 text-gray-900'
                }`}
              />
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowImport(false)}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <TrackingDashboard />
    </div>
  );
}

export default App;