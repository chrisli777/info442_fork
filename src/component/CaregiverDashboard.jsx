"use client"

import { useState, useRef, useEffect} from "react"
import { Mic, Filter, Check, AlertTriangle, ChevronDown, ChevronUp, MessageCircle } from "lucide-react"
import Chat from "./chat"
import supabase from '../supabaseclient'; 

export default function CaregiverDashboard() {
  // State for active tab
  const [activeTab, setActiveTab] = useState("dashboard")

  // State for recording
  const [isRecording, setIsRecording] = useState(false)
  const [recordingText, setRecordingText] = useState("")

  // State for analytics filters
  const [selectedElder, setSelectedElder] = useState("all")
  const [dateRange, setDateRange] = useState("week")

  // State for expanded elder
  const [expandedElder, setExpandedElder] = useState(null)

  // Refs
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  const [elders, setElders] = useState([]);
  const [checkInData, setCheckInData] = useState(null);



  const fetchLatestMood = async (elderUserId) => {
  const { data, error } = await supabase
    .from("check_ins")
    .select("mood, created_at")
    .eq("elder_id", elderUserId)
    .order("created_at", { ascending: false })
    .limit(1)

  if (error) {
    console.error("Error fetching mood:", error)
    return null
  }

  return data?.[0] || null
}

useEffect(() => {
  const loadElderMoods = async () => {
    const updatedElders = await Promise.all(
      elders.map(async (elder) => {
        const latestMood = await fetchLatestMood(elder.id)
        return {
          ...elder,
          currentMood: latestMood?.mood || "unknown",
          lastCheckIn: latestMood?.created_at || "Never",
        }
      })
    )

    setElders(updatedElders)
  }

  loadElderMoods()
}, [])

useEffect(() => {
  const loadAssignedElders = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: assignments, error } = await supabase
      .from("assignments")
      .select("patient:patient_id(*)")
      .eq("caregiver_id", user.id)

    if (error) {
      console.error("Failed to fetch assigned elders:", error)
      return
    }

    const enriched = await Promise.all(
      assignments.map(async ({ patient }) => {
        const { data: moodData, error: moodError } = await supabase
          .from("check_ins")
          .select("mood, created_at")
          .eq("elder_id", patient.id)
          .order("created_at", { ascending: false })
          .limit(1)

        return {
          id: patient.id,
          name: patient.name,
          age: patient.age,
          photo: patient.profile_photo,
          contact: patient.contact, 
          currentMood: moodData?.[0]?.mood || "unknown",
          lastCheckIn: moodData?.[0]?.created_at || "N/A"
        }
      })
    )

    setElders(enriched)
  }

  loadAssignedElders()
}, [])

  // Handle voice recording for notes
  const startRecording = (elderId) => {
    setIsRecording(true)
    setRecordingText(`Recording note for ${elders.find((e) => e.id === elderId)?.name}...`)

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const mediaRecorder = new MediaRecorder(stream)
          mediaRecorderRef.current = mediaRecorder
          audioChunksRef.current = []

          mediaRecorder.addEventListener("dataavailable", (event) => {
            audioChunksRef.current.push(event.data)
          })

          mediaRecorder.addEventListener("stop", () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
            // In a real app, you would process this audio (transcribe, save, etc.)
            alert("Voice note recorded and transcribed")
          })

          mediaRecorder.start()
        })
        .catch((error) => {
          console.error("Error accessing microphone:", error)
          alert("Could not access your microphone. Please check permissions.")
        })
    } else {
      alert("Your browser does not support voice recording.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setRecordingText("")

      // Stop all audio tracks
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
      }
    }
  }

  // Handle task completion
  const handleTaskCompletion = (elderId, taskId) => {
    // In a real app, you would update this in a database
    alert(`Task marked as completed for ${elders.find((e) => e.id === elderId)?.name}`)
  }

  // Handle log submission
  const handleSubmitLog = (elderId) => {
    // In a real app, you would save this to a database
    alert(`Daily log submitted for ${elders.find((e) => e.id === elderId)?.name}`)
  }

  // Toggle elder details
  const toggleElderDetails = (elderId) => {
    setExpandedElder(expandedElder === elderId ? null : elderId)
  }

  // Render mood icon based on mood
  const renderMoodIcon = (mood) => {
    switch (mood) {
      case "happy":
        return <span className="text-2xl">😊</span>
      case "neutral":
        return <span className="text-2xl">😐</span>
      case "sad":
        return <span className="text-2xl">😔</span>
      default:
        return <span className="text-2xl">❓</span>
    }
  }


















  return (
    <div className="min-h-screen bg-rose-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Dashboard Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6 p-1">
          <div className="flex">
            <button
              className={`flex-1 py-3 px-4 rounded-lg font-medium ${
                activeTab === "dashboard" ? "bg-rose-100 text-rose-800" : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              Elder Dashboard
            </button>
            <button
              className={`flex-1 py-3 px-4 rounded-lg font-medium ${
                activeTab === "analytics" ? "bg-rose-100 text-rose-800" : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("analytics")}
            >
              Analytics
            </button>
            <button
              className={`flex-1 py-3 px-4 rounded-lg font-medium ${
                activeTab === "chat" ? "bg-rose-100 text-rose-800" : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("chat")}
            >
              <div className="flex items-center justify-center gap-2">
                <MessageCircle size={18} />
                <span>Chat</span>
              </div>
            </button>
          </div>
        </div>

        {activeTab === "dashboard" ? (
          /* Elder Dashboard */
          <div className="space-y-6">
            {elders.map((elder) => (
              <div key={elder.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-rose-100">
                {/* Elder Header - Always visible */}
                <div
                  className="p-6 bg-white border-b border-rose-100 cursor-pointer"
                  onClick={() => toggleElderDetails(elder.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={elder.photo || "/placeholder.svg"}
                        alt={elder.name}
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">{elder.name}</h2>
                        <div className="flex items-center text-gray-600">
                          <span className="mr-4">Age: {elder.age}</span>
                          <span className="flex items-center">Current mood: {renderMoodIcon(elder.currentMood)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="mr-4 p-2 bg-rose-50 rounded-lg">
                        <p className="text-sm text-rose-800">Last check-in: {elder.lastCheckIn}</p>
                      </div>
                      {expandedElder === elder.id ? (
                        <ChevronUp className="h-6 w-6 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Collapsible Elder Details */}
                {expandedElder === elder.id && (
                  <>
                    {/* Health Precautions */}
                    <div className="p-4 bg-rose-50 border-b border-rose-100">
                      <h3 className="text-sm font-medium text-rose-800">Health Precautions</h3>
                      <p className="text-sm text-gray-600">{elder.healthPrecautions}</p>
                    </div>

                    {/* Tasks Checklist */}
                    <div className="p-6 bg-gray-50 border-b border-rose-100">
                      <h3 className="text-lg font-medium text-gray-800 mb-4">Daily Tasks</h3>
                      <div className="space-y-3">
                        {elder.tasks.map((task) => (
                          <div
                            key={task.id}
                            className={`flex items-center p-3 rounded-lg ${
                              task.overdue ? "bg-amber-50 border border-amber-200" : "bg-white border border-gray-200"
                            }`}
                          >
                            <div className="flex-1">
                              <div className="flex items-center">
                                <span className={`font-medium ${task.overdue ? "text-amber-800" : "text-gray-800"}`}>
                                  {task.name}
                                </span>
                                {task.overdue && (
                                  <span className="ml-2 flex items-center text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-800">
                                    <AlertTriangle size={12} className="mr-1" /> Overdue
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500">Scheduled: {task.time}</p>
                            </div>

                            {task.completed ? (
                              <span className="flex items-center px-3 py-1 rounded-lg bg-green-100 text-green-800">
                                <Check size={16} className="mr-1" /> Completed
                              </span>
                            ) : (
                              <button
                                onClick={() => handleTaskCompletion(elder.id, task.id)}
                                className="px-3 py-1 rounded-lg bg-rose-100 text-rose-800 hover:bg-rose-200"
                              >
                                Mark Complete
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notes Section */}
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-gray-800 mb-4">Daily Notes</h3>

                      <div className="mb-4">
                        <label htmlFor={`notes-${elder.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Additional notes:
                        </label>
                        <textarea
                          id={`notes-${elder.id}`}
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          rows={3}
                          placeholder="Enter notes about today's care..."
                        ></textarea>
                      </div>

                      <div className="flex items-center justify-between">
                        <button
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                            isRecording
                              ? "bg-red-500 text-white animate-pulse"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                          onMouseDown={() => startRecording(elder.id)}
                          onTouchStart={() => startRecording(elder.id)}
                          onMouseUp={stopRecording}
                          onTouchEnd={stopRecording}
                          onMouseLeave={stopRecording}
                        >
                          <Mic size={18} />
                          <span>{isRecording ? recordingText : "Voice to Text"}</span>
                        </button>

                        <button
                          onClick={() => handleSubmitLog(elder.id)}
                          className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
                        >
                          Submit Daily Log
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : activeTab === "analytics" ? (
          /* Analytics Dashboard */
          <div className="bg-white rounded-xl shadow-lg p-6 border border-rose-100">
            <h2 className="text-2xl font-bold text-rose-800 mb-6">Care Analytics</h2>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <label htmlFor="elder-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Elder
                </label>
                <select
                  id="elder-filter"
                  className="p-2 border border-gray-300 rounded-lg"
                  value={selectedElder}
                  onChange={(e) => setSelectedElder(e.target.value)}
                >
                  <option value="all">All Elders</option>
                  {elders.map((elder) => (
                    <option key={elder.id} value={elder.id.toString()}>
                      {elder.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="date-range" className="block text-sm font-medium text-gray-700 mb-1">
                  Date Range
                </label>
                <select
                  id="date-range"
                  className="p-2 border border-gray-300 rounded-lg"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="quarter">Last 3 Months</option>
                </select>
              </div>

              <div className="flex items-end">
                <button className="flex items-center gap-2 p-2 bg-rose-100 text-rose-800 rounded-lg hover:bg-rose-200">
                  <Filter size={16} />
                  <span>Apply Filters</span>
                </button>
              </div>
            </div>

            {/* Analytics Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Mood Trends</h3>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
                  <span className="text-gray-500">Mood trend chart would appear here</span>
                </div>
              </div>

              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Task Completion Rates</h3>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
                  <span className="text-gray-500">Task completion chart would appear here</span>
                </div>
              </div>

              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Check-in Frequency</h3>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
                  <span className="text-gray-500">Check-in frequency chart would appear here</span>
                </div>
              </div>

              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Health Metrics</h3>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
                  <span className="text-gray-500">Health metrics chart would appear here</span>
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-rose-50 rounded-lg">
                <h4 className="text-sm font-medium text-rose-800">Average Mood</h4>
                <p className="text-2xl font-bold">Positive</p>
              </div>

              <div className="p-4 bg-rose-50 rounded-lg">
                <h4 className="text-sm font-medium text-rose-800">Task Completion</h4>
                <p className="text-2xl font-bold">87%</p>
              </div>

              <div className="p-4 bg-rose-50 rounded-lg">
                <h4 className="text-sm font-medium text-rose-800">Check-in Rate</h4>
                <p className="text-2xl font-bold">95%</p>
              </div>

              <div className="p-4 bg-rose-50 rounded-lg">
                <h4 className="text-sm font-medium text-rose-800">Missed Tasks</h4>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </div>
        ) : (
          /* Chat Tab */
          <div className="h-[calc(100vh-200px)]">
            <Chat />
          </div>
        )}
      </div>
    </div>
  )
}