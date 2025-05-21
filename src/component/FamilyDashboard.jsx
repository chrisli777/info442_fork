"use client"

import { useState } from "react"
import { Bell, MessageSquare, Calendar, Clock, AlertTriangle, Flag, Send, MessageCircle } from "lucide-react"
import Chat from "./chat"

export default function FamilyDashboard() {
  // State for notification preferences
  const [notifications, setNotifications] = useState({
    missedCheckIns: true,
    urgentFlags: true,
    caregiverMessages: true,
  })

  // State for message modal
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [messageText, setMessageText] = useState("")

  // State for active tab
  const [activeTab, setActiveTab] = useState("dashboard")

  // Mock data for elder
  const elder = {
    name: "Martha Johnson",
    age: 78,
    photo: "/elderly-woman-knitting.png",
    currentMood: "happy",
    lastCheckIn: "Today, 9:30 AM",
    caregiver: {
      name: "Sarah Williams",
      photo: "/placeholder.svg?key=17rj7",
    },
  }

  // Mock data for timeline activities
  const activities = [
    {
      id: 1,
      type: "check-in",
      time: "Today, 9:30 AM",
      description: "Morning check-in completed",
      mood: "happy",
    },
    {
      id: 2,
      type: "medication",
      time: "Today, 8:30 AM",
      description: "Morning medication administered",
      medication: "Lisinopril, Metformin",
    },
    {
      id: 3,
      type: "meal",
      time: "Today, 8:00 AM",
      description: "Breakfast served",
      meal: "Oatmeal with fruit",
    },
    {
      id: 4,
      type: "check-in",
      time: "Yesterday, 8:00 PM",
      description: "Evening check-in completed",
      mood: "neutral",
    },
    {
      id: 5,
      type: "medication",
      time: "Yesterday, 6:00 PM",
      description: "Evening medication administered",
      medication: "Simvastatin",
    },
    {
      id: 6,
      type: "caregiver-note",
      time: "Yesterday, 5:30 PM",
      description: "Martha enjoyed watching her favorite TV show today and had a good appetite at dinner.",
      caregiver: "Sarah",
    },
  ]

  // Handle toggle change
  const handleToggleChange = (setting) => {
    setNotifications((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }))
  }

  // Handle send message
  const handleSendMessage = () => {
    if (messageText.trim()) {
      // In a real app, you would send this to a backend
      alert(`Message sent to ${elder.caregiver.name}: ${messageText}`)
      setMessageText("")
      setShowMessageModal(false)
    }
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

  // Render activity icon based on type
  const renderActivityIcon = (type) => {
    switch (type) {
      case "check-in":
        return (
          <div className="p-2 bg-sky-100 rounded-full">
            <Bell size={16} className="text-sky-600" />
          </div>
        )
      case "medication":
        return (
          <div className="p-2 bg-purple-100 rounded-full">
            <Clock size={16} className="text-purple-600" />
          </div>
        )
      case "meal":
        return (
          <div className="p-2 bg-green-100 rounded-full">
            <Clock size={16} className="text-green-600" />
          </div>
        )
      case "caregiver-note":
        return (
          <div className="p-2 bg-amber-100 rounded-full">
            <MessageSquare size={16} className="text-amber-600" />
          </div>
        )
      default:
        return (
          <div className="p-2 bg-gray-100 rounded-full">
            <Calendar size={16} className="text-gray-600" />
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-emerald-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Dashboard Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6 p-1">
          <div className="flex">
            <button
              className={`flex-1 py-3 px-4 rounded-lg font-medium ${
                activeTab === "dashboard" ? "bg-emerald-100 text-emerald-800" : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              Dashboard
            </button>
            <button
              className={`flex-1 py-3 px-4 rounded-lg font-medium ${
                activeTab === "chat" ? "bg-emerald-100 text-emerald-800" : "text-gray-600 hover:bg-gray-100"
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
          <>
            {/* Elder Status Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100 mb-6">
              <div className="flex items-center">
                <img
                  src={elder.photo || "/placeholder.svg"}
                  alt={elder.name}
                  className="w-24 h-24 rounded-full object-cover mr-6"
                />
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-800">{elder.name}</h1>
                  <p className="text-gray-600">Age: {elder.age}</p>

                  <div className="mt-3 flex items-center">
                    <div className="mr-6">
                      <span className="text-sm text-gray-500">Current Mood</span>
                      <div className="flex items-center mt-1">
                        {renderMoodIcon(elder.currentMood)}
                        <span className="ml-2 font-medium capitalize">{elder.currentMood}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-gray-500">Last Check-in</span>
                      <div className="mt-1 font-medium">{elder.lastCheckIn}</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowMessageModal(true)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
                >
                  <MessageSquare size={18} />
                  <span>Message Caregiver</span>
                </button>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100 mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Notification Preferences</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle size={20} className="text-amber-500" />
                    <span>Alert for missed check-ins</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notifications.missedCheckIns}
                      onChange={() => handleToggleChange("missedCheckIns")}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Flag size={20} className="text-red-500" />
                    <span>Urgent flags</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notifications.urgentFlags}
                      onChange={() => handleToggleChange("urgentFlags")}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare size={20} className="text-emerald-500" />
                    <span>Caregiver messages</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notifications.caregiverMessages}
                      onChange={() => handleToggleChange("caregiverMessages")}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Activity Timeline</h2>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                {/* Timeline items */}
                <div className="space-y-6">
                  {activities.map((activity) => (
                    <div key={activity.id} className="relative flex items-start ml-2">
                      <div className="absolute left-3 -translate-x-1/2">{renderActivityIcon(activity.type)}</div>

                      <div className="ml-8 bg-gray-50 p-4 rounded-lg border border-gray-200 flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-gray-800">{activity.description}</h3>
                          <span className="text-sm text-gray-500">{activity.time}</span>
                        </div>

                        {activity.type === "check-in" && activity.mood && (
                          <div className="mt-2 flex items-center">
                            <span className="text-sm text-gray-600 mr-2">Mood:</span>
                            {renderMoodIcon(activity.mood)}
                          </div>
                        )}

                        {activity.type === "medication" && activity.medication && (
                          <div className="mt-2">
                            <span className="text-sm text-gray-600">Medication: </span>
                            <span>{activity.medication}</span>
                          </div>
                        )}

                        {activity.type === "meal" && activity.meal && (
                          <div className="mt-2">
                            <span className="text-sm text-gray-600">Meal: </span>
                            <span>{activity.meal}</span>
                          </div>
                        )}

                        {activity.type === "caregiver-note" && activity.caregiver && (
                          <div className="mt-2 text-sm text-gray-600">
                            <span className="font-medium">Note from {activity.caregiver}: </span>
                            {activity.description}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Chat Tab */
          <div className="h-[calc(100vh-200px)]">
            <Chat />
          </div>
        )}
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Message to Caregiver</h3>

            <div className="mb-4">
              <div className="flex items-center mb-3">
                <img
                  src={elder.caregiver.photo || "/placeholder.svg"}
                  alt={elder.caregiver.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-medium">{elder.caregiver.name}</p>
                  <p className="text-sm text-gray-500">Caregiver for {elder.name}</p>
                </div>
              </div>

              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows={4}
                placeholder="Type your message here..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              ></textarea>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowMessageModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
                disabled={!messageText.trim()}
              >
                <Send size={18} />
                <span>Send Message</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
