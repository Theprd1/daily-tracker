import { useState, useEffect } from 'react';
import { Check, X, MessageCircle, Calendar, Plus, ChevronLeft, ChevronRight, Sun, Moon, Edit3 } from 'lucide-react';

const TrackingDashboard = () => {
  const [viewMode, setViewMode] = useState('today'); // 'today', 'month', 'year'
  
  // Get current date for initial state
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskColor, setNewTaskColor] = useState('bg-teal-500');
  const [darkMode, setDarkMode] = useState(true);
  const [showEditTask, setShowEditTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [currentComment, setCurrentComment] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [showBackupOptions, setShowBackupOptions] = useState(false);
  const [currentTimeState, setCurrentTimeState] = useState(() => {
    return new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  });
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Default tasks
  const [defaultTasks, setDefaultTasks] = useState({
    leetcode: { label: 'LeetCode', color: 'bg-orange-500' },
    pt: { label: 'Physical Therapy', color: 'bg-purple-500' },
    gym: { label: 'Gym Workouts', color: 'bg-indigo-500' }
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

  useEffect(() => {
    localStorage.setItem('tracker-comments', JSON.stringify(comments));
  }, [comments]);

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
    
  }, [data, comments, customTasks, defaultTasks, darkMode, currentMonth, currentYear, isInitialized]);

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
      color: newTaskColor
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
                        className={`w-12 h-12 rounded-xl transition-all duration-200 hover:scale-105 flex flex-col items-center justify-center ${
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
        
        {/* Floating Add Task Button */}
        <button
          onClick={() => setShowAddTask(true)}
          className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg transition-all hover:scale-110 ${
            darkMode 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-green-500 hover:bg-green-600'
          } flex items-center justify-center`}
        >
          <Plus className="w-6 h-6 text-white" />
        </button>
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
        {/* Minimalist Header */}
        <div className="text-center pt-12 pb-8 px-6">
          <div className={`text-3xl font-light mb-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {now.toLocaleDateString('en-US', { 
              weekday: 'long',
              month: 'long', 
              day: 'numeric'
            })}
          </div>
          <div className={`text-2xl font-mono tracking-wider ${
            darkMode ? 'text-blue-400' : 'text-blue-600'
          }`}>
            {currentTimeState}
          </div>
        </div>

        {/* Clean Progress Section */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            <ActivityRing 
              percentage={completionPercentage} 
              size={200} 
              strokeWidth={8}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-4xl font-bold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {Math.round(completionPercentage)}%
                </div>
                <div className={`text-sm mt-1 ${
                  darkMode ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  {completedTasksToday.length} of {Object.keys(allTasks).length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Simple Task List */}
        <div className="px-6 pb-12 max-w-md mx-auto">
          <div className="space-y-3">
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
                  className={`w-full p-4 rounded-xl transition-all duration-200 ${
                    isCompleted
                      ? darkMode 
                        ? 'bg-gray-800/50' 
                        : 'bg-gray-100/70'
                      : darkMode 
                        ? 'bg-gray-900/50 hover:bg-gray-800/70' 
                        : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-green-500 border-green-500'
                        : darkMode
                          ? 'border-gray-600'
                          : 'border-gray-300'
                    }`}>
                      {isCompleted && <Check className="w-4 h-4 text-white" />}
                    </div>
                    
                    <div className="flex-1 text-left">
                      <div className={`font-medium ${
                        isCompleted 
                          ? 'line-through opacity-60' 
                          : ''
                      } ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {task.label}
                      </div>
                    </div>
                    
                    <div className={`w-3 h-3 rounded-full ${task.color} ${
                      isCompleted ? 'opacity-40' : 'opacity-80'
                    }`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Minimal Footer Actions */}
        <div className="px-6 pb-8">
          <div className="flex justify-center">
            <button
              onClick={() => setShowAddTask(true)}
              className={`px-8 py-3 rounded-full font-medium transition-all ${
                darkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
              }`}
            >
              Add Task
            </button>
          </div>
        </div>
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
                  {hasCompletedTasks ? (
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
                    <span className={`text-xs ${
                      isDayToday ? 'text-white font-bold' : darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {day}
                    </span>
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

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-black' : 'bg-white'
    }`}>
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
              {/* Backup Options Button */}
              <button
                onClick={() => setShowBackupOptions(true)}
                className={`p-2 rounded-full transition-colors ${
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
                className={`p-2 rounded-full transition-colors ${
                  darkMode 
                    ? 'hover:bg-gray-800 text-yellow-400' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </header>

          {/* View Toggle */}
          <div className="flex justify-center py-4">
            <div className={`flex rounded-xl ${
              darkMode ? 'bg-gray-900' : 'bg-gray-100'
            } p-1`}>
              {[
                { key: 'today', label: 'Today', icon: Sun },
                { key: 'month', label: 'Month', icon: Calendar },
                { key: 'year', label: 'Year', icon: Calendar }
              ].map(view => (
                <button
                  key={view.key}
                  onClick={() => setViewMode(view.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    viewMode === view.key
                      ? darkMode 
                        ? 'bg-gray-700 text-white' 
                        : 'bg-white text-gray-900 shadow-sm'
                      : darkMode
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <view.icon className="w-4 h-4" />
                  <span className="text-sm">{view.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Task Management Section - Only show when not in month or today view */}
          {viewMode === 'year' && (
            <div className="px-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Your Tasks
                </h2>
                <button
                  onClick={() => setShowAddTask(true)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                    darkMode 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  Add Task
                </button>
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
      {viewMode === 'today' && renderTodayView()}
      {viewMode === 'month' && renderMonthView()}
      {viewMode === 'year' && renderYearView()}

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add New Task</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Name
              </label>
              <input
                type="text"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="e.g., AWS Study"
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <div className="grid grid-cols-6 gap-2">
                {availableColors.map(color => (
                  <button
                    key={color}
                    onClick={() => setNewTaskColor(color)}
                    className={`w-8 h-8 rounded-lg ${color} ${
                      newTaskColor === color ? 'ring-2 ring-gray-800' : ''
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={addCustomTask}
                disabled={!newTaskName.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Task
              </button>
              <button
                onClick={() => {
                  setShowAddTask(false);
                  setNewTaskName('');
                  setNewTaskColor('bg-teal-500');
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold"
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
          <div className={`fixed inset-0 z-50 ${darkMode ? 'bg-black' : 'bg-white'} flex flex-col`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <button
                onClick={() => {
                  saveComment(); // Save comment before closing
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
              <div className="w-16"></div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Progress Section */}
              <div className="flex flex-col items-center justify-center py-8 px-4">
                {/* Activity Ring */}
                <div className="relative mb-6">
                  <ActivityRing 
                    percentage={getCompletionPercentage(selectedDay)} 
                    size={200} 
                    strokeWidth={16} 
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`text-4xl sm:text-5xl font-bold mb-1 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {Math.round(getCompletionPercentage(selectedDay))}%
                      </div>
                      <div className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Complete
                      </div>
                    </div>
                  </div>
                </div>

                {/* Task Statistics */}
                <div className="grid grid-cols-2 gap-6 w-full max-w-xs mb-6">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {getCompletedTasksForDay(selectedDay).length}
                    </div>
                    <div className={`text-xs ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Completed
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {Object.keys(getAllTasks()).length}
                    </div>
                    <div className={`text-xs ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Total Tasks
                    </div>
                  </div>
                </div>
              </div>

              {/* Task List */}
              <div className="px-4 pb-4">
                <h2 className={`text-lg font-bold mb-3 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Tasks
                </h2>
                <div className="space-y-2">
                  {Object.entries(getAllTasks()).map(([taskKey, task]) => {
                    const isCompleted = getTaskStatus(taskKey, selectedDay);
                    return (
                      <button
                        key={taskKey}
                        onClick={() => handleTaskToggle(taskKey)}
                        className={`w-full p-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                          darkMode ? 'bg-gray-900' : 'bg-gray-50'
                        } hover:scale-[1.01]`}
                      >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isCompleted
                            ? 'bg-green-500 border-green-500'
                            : darkMode
                              ? 'border-gray-600'
                              : 'border-gray-300'
                        }`}>
                          {isCompleted && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <div className="flex-1 text-left">
                          <div className={`font-medium text-sm ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {task.label}
                          </div>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${task.color}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comment Section */}
              <div className="px-4 pb-6">
                <h2 className={`text-lg font-bold mb-3 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Notes
                </h2>
                <div className="space-y-3">
                  <textarea
                    value={currentComment}
                    onChange={(e) => setCurrentComment(e.target.value)}
                    onBlur={saveComment}
                    placeholder="Add a note about your day..."
                    className={`w-full p-3 rounded-lg border-2 transition-colors resize-none text-sm ${
                      darkMode 
                        ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-gray-500' 
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400'
                    } focus:outline-none`}
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={saveComment}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        darkMode 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Backup Options Modal */}
        {showBackupOptions && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className={`rounded-xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto ${
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