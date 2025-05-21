"use client"

import { useState, useRef, useEffect } from "react"
import { Mic, MicOff, Paperclip, Send, X, Wifi, WifiOff, Play, Pause } from "lucide-react"

// Mock user data
const currentUser = {
  id: "user1",
  name: "Current User",
  role: "elder",
}

// Mock users for demo
const users = [
  {
    id: "user1",
    name: "Martha Johnson",
    role: "elder",
  },
  {
    id: "user2",
    name: "Sarah Williams",
    role: "caregiver",
  },
  {
    id: "user3",
    name: "John Johnson",
    role: "family",
  },
]

// Mock initial messages
const initialMessages = [
  {
    id: "msg1",
    content: "Good morning! How are you feeling today?",
    sender: {
      id: "user2",
      name: "Sarah Williams",
      role: "caregiver",
    },
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    type: "text",
    reactions: [],
  },
  {
    id: "msg2",
    content: "I'm feeling much better today, thank you!",
    sender: {
      id: "user1",
      name: "Martha Johnson",
      role: "elder",
    },
    timestamp: new Date(Date.now() - 3500000), // 58 minutes ago
    type: "text",
    reactions: [
      {
        emoji: "👍",
        user: "Sarah Williams",
      },
    ],
  },
  {
    id: "msg3",
    content: "voice-message.mp3",
    sender: {
      id: "user3",
      name: "John Johnson",
      role: "family",
    },
    timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
    type: "voice",
    reactions: [],
    duration: 12, // 12 seconds
  },
  {
    id: "msg4",
    content: "Morning medication administered",
    sender: {
      id: "user2",
      name: "Sarah Williams",
      role: "caregiver",
    },
    timestamp: new Date(Date.now() - 900000), // 15 minutes ago
    type: "update",
    reactions: [],
  },
]

// Available emoji reactions
const availableEmojis = ["👍", "❤️", "😊", "👏", "🙏", "😢"]

export default function Chat() {
  // State for messages
  const [messages, setMessages] = useState(initialMessages)
  const [draftMessage, setDraftMessage] = useState("")
  const [isOnline, setIsOnline] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [selectedFile, setSelectedFile] = useState(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(null)
  const [isPlaying, setIsPlaying] = useState(null)

  // Refs
  const fileInputRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const messagesEndRef = useRef(null)
  const recordingTimerRef = useRef(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Save draft message to localStorage
  useEffect(() => {
    if (draftMessage) {
      localStorage.setItem("chatDraftMessage", draftMessage)
    }
  }, [draftMessage])

  // Load draft message from localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem("chatDraftMessage")
    if (savedDraft) {
      setDraftMessage(savedDraft)
    }
  }, [])

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Handle recording timer
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1)
      }, 1000)
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
        recordingTimerRef.current = null
      }
      setRecordingDuration(0)
    }

    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }
    }
  }, [isRecording])

  // Format time for voice messages
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Handle send message
  const handleSendMessage = () => {
    if (!isOnline) {
      alert("You are offline. Your message will be sent when you reconnect to the internet.")
      return
    }

    if (draftMessage.trim() || selectedFile) {
      const newMessage = {
        id: `msg${Date.now()}`,
        content: selectedFile ? selectedFile.name : draftMessage,
        sender: currentUser,
        timestamp: new Date(),
        type: selectedFile ? "file" : "text",
        reactions: [],
        fileType: selectedFile?.type,
        fileName: selectedFile?.name,
      }

      setMessages((prev) => [...prev, newMessage])
      setDraftMessage("")
      setSelectedFile(null)
      localStorage.removeItem("chatDraftMessage")
    }
  }

  // Handle voice recording
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const startRecording = () => {
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
            // In a real app, you would upload this blob to a server and get a URL
            // For demo purposes, we'll just create a fake voice message
            const newMessage = {
              id: `msg${Date.now()}`,
              content: "voice-message.wav",
              sender: currentUser,
              timestamp: new Date(),
              type: "voice",
              reactions: [],
              duration: recordingDuration,
            }

            setMessages((prev) => [...prev, newMessage])
          })

          mediaRecorder.start()
          setIsRecording(true)
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

      // Stop all audio tracks
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
      }
    }
  }

  // Handle file selection
  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  // Handle emoji reactions
  const toggleEmojiPicker = (messageId) => {
    setShowEmojiPicker(showEmojiPicker === messageId ? null : messageId)
  }

  const addReaction = (messageId, emoji) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          // Check if user already reacted with this emoji
          const existingReaction = msg.reactions.find((r) => r.user === currentUser.name && r.emoji === emoji)

          if (existingReaction) {
            // Remove the reaction if it already exists
            return {
              ...msg,
              reactions: msg.reactions.filter((r) => !(r.user === currentUser.name && r.emoji === emoji)),
            }
          } else {
            // Add the new reaction
            return {
              ...msg,
              reactions: [
                ...msg.reactions.filter((r) => r.user !== currentUser.name), // Remove any existing reaction from this user
                { emoji, user: currentUser.name },
              ],
            }
          }
        }
        return msg
      }),
    )
    setShowEmojiPicker(null)
  }

  // Handle voice message playback
  const togglePlayVoiceMessage = (messageId) => {
    if (isPlaying === messageId) {
      setIsPlaying(null)
      // In a real app, you would pause the audio playback here
    } else {
      setIsPlaying(messageId)
      // In a real app, you would play the audio here

      // Simulate playback ending after the duration
      const message = messages.find((m) => m.id === messageId)
      if (message && message.duration) {
        setTimeout(() => {
          setIsPlaying(null)
        }, message.duration * 1000)
      }
    }
  }

  // Get bubble color based on user role
  const getBubbleColor = (role) => {
    switch (role) {
      case "elder":
        return "bg-sky-100 text-sky-800"
      case "caregiver":
        return "bg-rose-100 text-rose-800"
      case "family":
        return "bg-emerald-100 text-emerald-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get sender name color based on user role
  const getSenderColor = (role) => {
    switch (role) {
      case "elder":
        return "text-sky-600"
      case "caregiver":
        return "text-rose-600"
      case "family":
        return "text-emerald-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <h2 className="text-lg font-medium text-gray-800">Chat</h2>
        <div className="flex items-center">
          {isOnline ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4 text-red-500" />}
          <span className={`ml-2 text-sm ${isOnline ? "text-green-500" : "text-red-500"}`}>
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="relative group">
              <div className="flex flex-col">
                <div className="flex items-baseline mb-1">
                  <span className={`font-medium ${getSenderColor(message.sender.role)}`}>{message.sender.name}</span>
                  <span className="ml-2 text-xs text-gray-500">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                <div
                  className={`relative rounded-lg p-3 ${getBubbleColor(message.sender.role)} ${
                    message.type === "update" ? "italic bg-gray-100 text-gray-700" : ""
                  }`}
                >
                  {message.type === "text" && <p>{message.content}</p>}

                  {message.type === "voice" && (
                    <button className="flex items-center gap-2 py-1" onClick={() => togglePlayVoiceMessage(message.id)}>
                      {isPlaying === message.id ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      <Mic className="h-5 w-5" />
                      <span>{formatTime(message.duration || 0)}</span>
                    </button>
                  )}

                  {message.type === "file" && (
                    <div className="flex items-center gap-2">
                      <Paperclip className="h-5 w-5" />
                      <span className="underline">{message.fileName}</span>
                    </div>
                  )}

                  {/* Emoji reactions */}
                  {message.reactions.length > 0 && (
                    <div className="absolute -top-2 -right-2 flex gap-1 bg-white rounded-full px-2 py-1 shadow-sm border border-gray-200">
                      {message.reactions.map((reaction, index) => (
                        <div key={index} className="text-sm" title={`${reaction.user}`}>
                          {reaction.emoji}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Emoji reaction button */}
              <button
                className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-1 shadow-sm border border-gray-200"
                onClick={() => toggleEmojiPicker(message.id)}
              >
                {message.reactions.some((r) => r.user === currentUser.name) ? (
                  <span className="text-sm">😀</span>
                ) : (
                  <span className="text-sm text-gray-400">😶</span>
                )}
              </button>

              {/* Emoji picker */}
              {showEmojiPicker === message.id && (
                <div className="absolute right-8 top-1/2 -translate-y-1/2 bg-white rounded-full px-2 py-1 shadow-md border border-gray-200 flex gap-1 z-10">
                  {availableEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      className="hover:bg-gray-100 rounded-full p-1 transition-colors"
                      onClick={() => addReaction(message.id, emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white">
        {selectedFile && (
          <div className="mb-2 p-2 bg-gray-100 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <Paperclip className="h-4 w-4 text-gray-500" />
              <span className="text-sm truncate">{selectedFile.name}</span>
            </div>
            <button className="text-gray-500 hover:text-gray-700" onClick={() => setSelectedFile(null)}>
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            className={`p-2 rounded-full ${
              isRecording ? "bg-red-500 text-white animate-pulse" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={toggleRecording}
          >
            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>

          <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200" onClick={handleFileSelect}>
            <Paperclip className="h-5 w-5" />
          </button>

          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />

          <input
            type="text"
            className="flex-1 p-2 border border-gray-300 rounded-lg"
            placeholder="Type your message..."
            value={draftMessage}
            onChange={(e) => setDraftMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
          />

          <button
            className="p-2 rounded-full bg-sky-500 text-white hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSendMessage}
            disabled={(!draftMessage.trim() && !selectedFile) || isRecording}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>

        {isRecording && (
          <div className="mt-2 text-center text-sm text-red-500 animate-pulse">
            Recording... {formatTime(recordingDuration)}
          </div>
        )}

        {!isOnline && (
          <div className="mt-2 text-center text-sm text-red-500">
            You are offline. Messages will be sent when you reconnect.
          </div>
        )}
      </div>
    </div>
  )
}
