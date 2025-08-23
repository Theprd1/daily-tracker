import { supabase } from '../supabaseClient'

// Sync tasks to Supabase
export const syncTasks = async (tasks, userId) => {
  try {
    const tasksArray = Object.entries(tasks).map(([taskKey, task]) => ({
      user_id: userId,
      task_key: taskKey,
      label: task.label,
      color: task.color,
      is_default: task.isDefault || false,
      category: task.category || null,
      priority: task.priority || null
    }))

    const { error } = await supabase
      .from('tasks')
      .upsert(tasksArray, { onConflict: 'user_id,task_key' })

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error syncing tasks:', error)
    return false
  }
}

// Sync task data to Supabase
export const syncTaskData = async (taskData, userId) => {
  try {
    const dataArray = []
    
    // The data structure is data[monthKey][day][taskKey] = status
    Object.entries(taskData).forEach(([monthKey, dayData]) => {
      if (dayData && typeof dayData === 'object') {
        Object.entries(dayData).forEach(([day, taskStatuses]) => {
          if (taskStatuses && typeof taskStatuses === 'object') {
            Object.entries(taskStatuses).forEach(([taskKey, status]) => {
              dataArray.push({
                user_id: userId,
                task_key: taskKey,
                date_key: `${monthKey}-${day}`,
                status: status
              })
            })
          }
        })
      }
    })

    if (dataArray.length > 0) {
      const { error } = await supabase
        .from('task_data')
        .upsert(dataArray, { onConflict: 'user_id,task_key,date_key' })

      if (error) throw error
    }
    
    return true
  } catch (error) {
    console.error('Error syncing task data:', error)
    return false
  }
}

// Sync settings to Supabase
export const syncSettings = async (settings, userId) => {
  try {
    const settingsArray = Object.entries(settings).map(([key, value]) => ({
      user_id: userId,
      setting_key: key,
      setting_value: value
    }))

    const { error } = await supabase
      .from('user_settings')
      .upsert(settingsArray, { onConflict: 'user_id,setting_key' })

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error syncing settings:', error)
    return false
  }
}

// Sync comments to Supabase
export const syncComments = async (comments, userId) => {
  try {
    const commentsArray = Object.entries(comments).map(([dateKey, comment]) => ({
      user_id: userId,
      date_key: dateKey,
      comment: comment
    }))

    const { error } = await supabase
      .from('comments')
      .upsert(commentsArray, { onConflict: 'user_id,date_key' })

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error syncing comments:', error)
    return false
  }
}

// Sync notes to Supabase
export const syncNotes = async (notes, userId) => {
  try {
    const notesArray = Object.entries(notes).map(([dateKey, note]) => ({
      user_id: userId,
      date_key: dateKey,
      note: note
    }))

    const { error } = await supabase
      .from('notes')
      .upsert(notesArray, { onConflict: 'user_id,date_key' })

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error syncing notes:', error)
    return false
  }
}

// Load all data from Supabase
export const loadUserData = async (userId) => {
  try {
    // Load tasks
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)

    if (tasksError) throw tasksError

    // Load task data
    const { data: taskData, error: taskDataError } = await supabase
      .from('task_data')
      .select('*')
      .eq('user_id', userId)

    if (taskDataError) throw taskDataError

    // Load settings
    const { data: settings, error: settingsError } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)

    if (settingsError) throw settingsError

    // Load comments
    const { data: comments, error: commentsError } = await supabase
      .from('comments')
      .select('*')
      .eq('user_id', userId)

    if (commentsError) throw commentsError

    // Load notes
    const { data: notes, error: notesError } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)

    if (notesError) throw notesError

    // Transform data to match app format
    const transformedTasks = {}
    tasks.forEach(task => {
      transformedTasks[task.task_key] = {
        label: task.label,
        color: task.color,
        isDefault: task.is_default,
        category: task.category,
        priority: task.priority
      }
    })

    const transformedTaskData = {}
    taskData.forEach(data => {
      const dateParts = data.date_key.split('-')
      const day = dateParts.pop()
      const monthKey = dateParts.join('-')
      
      // Transform to data[monthKey][day][taskKey] = status format
      if (!transformedTaskData[monthKey]) {
        transformedTaskData[monthKey] = {}
      }
      if (!transformedTaskData[monthKey][day]) {
        transformedTaskData[monthKey][day] = {}
      }
      transformedTaskData[monthKey][day][data.task_key] = data.status
    })

    const transformedSettings = {}
    settings.forEach(setting => {
      transformedSettings[setting.setting_key] = setting.setting_value
    })

    const transformedComments = {}
    comments.forEach(comment => {
      transformedComments[comment.date_key] = comment.comment
    })

    const transformedNotes = {}
    notes.forEach(note => {
      transformedNotes[note.date_key] = note.note
    })

    return {
      tasks: transformedTasks,
      taskData: transformedTaskData,
      settings: transformedSettings,
      comments: transformedComments,
      notes: transformedNotes
    }
  } catch (error) {
    console.error('Error loading user data:', error)
    return null
  }
}

// Sync all local data to cloud
export const syncAllData = async (localData, userId) => {
  try {
    const results = await Promise.all([
      syncTasks({ ...localData.defaultTasks, ...localData.customTasks }, userId),
      syncTaskData(localData.data, userId),
      syncSettings({
        layoutSettings: localData.layoutSettings,
        analyticsSettings: localData.analyticsSettings,
        darkMode: localData.darkMode
      }, userId),
      syncComments(localData.comments, userId),
      syncNotes(localData.todayNotes, userId)
    ])

    return results.every(result => result === true)
  } catch (error) {
    console.error('Error syncing all data:', error)
    return false
  }
}