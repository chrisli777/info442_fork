"use client"

import { useState, useRef, useEffect } from "react"
import {
  Smile,
  Meh,
  Frown,
  HelpCircle,
  Mic,
  Send,
  Upload,
  Camera,
  Type,
  Sun,
  Eye,
  Clock,
  Pill,
  MessageCircle,
} from "lucide-react"
import Chat from "./chat"
import supabase from '../supabaseclient'; 

export default function ElderDashboard() {
  // State for mood selection
  const [selectedMood, setSelectedMood] = useState(null)
  const [showMoodError, setShowMoodError] = useState(false)

  // State for note and photo
  const [note, setNote] = useState("")
  const [photoPreview, setPhotoPreview] = useState(null)

  // State for recording
  const [isRecording, setIsRecording] = useState(false)
  const [recordingText, setRecordingText] = useState("(hold to speak)")

  // State for submission
  const [isSubmitted, setIsSubmitted] = useState(false)

  // State for accessibility features
  const [largeText, setLargeText] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [screenReaderMode, setScreenReaderMode] = useState(false)

  // State for active tab
  const [activeTab, setActiveTab] = useState("dashboard")

  // Refs
  const photoInputRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  // Mock health data
  const healthData = {
    bloodPressure: "120/80",
    heartRate: "72 bpm",
    bloodSugar: "95 mg/dL",
    weight: "165 lbs",
    lastUpdated: "Today, 8:30 AM",
  }

  // Mock medication data
  const medications = [
    { name: "Lisinopril", dosage: "10mg", time: "8:00 AM", taken: true },
    { name: "Metformin", dosage: "500mg", time: "1:00 PM", taken: false, due: true },
    { name: "Simvastatin", dosage: "20mg", time: "8:00 PM", taken: false },
  ]

  // Handle mood selection
  const handleMoodSelect = (mood) => {
    setSelectedMood(mood)
    setShowMoodError(false)
  }

  // Handle help request
  const handleHelpRequest = () => {
    alert("Your request for help has been sent to your caregiver.")
  }

  // Handle voice recording
  const startRecording = (e) => {
    e.preventDefault()

    setIsRecording(true)
    setRecordingText("(Recording...)")

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
            // In a real app, you might want to display a playback option
            // or automatically transcribe the audio
            setNote((prev) => prev + "[Voice message recorded] ")
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
      setRecordingText("(hold to speak)")

      // Stop all audio tracks
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
      }
    }
  }

  // Handle photo upload
  const handlePhotoUpload = (useCamera = false) => {
    if (photoInputRef.current) {
      if (useCamera) {
        photoInputRef.current.setAttribute("capture", "environment")
      } else {
        photoInputRef.current.removeAttribute("capture")
      }
      photoInputRef.current.click()
    }
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedMood) {
      setShowMoodError(true)
      const moodSection = document.querySelector(".mood-section")
      moodSection?.scrollIntoView({ behavior: "smooth" })
      return
    }

  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase.from("check_ins").insert({
    elder_id: user.id, 
    mood: selectedMood,
    note: note || null,
    photo_url: photoPreview || null,

  })
  
  if (error) {
    alert("Failed to submit check-in.")
    return
  }

    setIsSubmitted(true)
  }

  // Reset form
  const resetForm = () => {
    setSelectedMood(null)
    setNote("")
    setPhotoPreview(null)
    setIsSubmitted(false)
    setShowMoodError(false)
  }

  // Apply accessibility classes based on state
  const textSizeClass = largeText ? "text-lg md:text-xl" : ""
  const containerClass = highContrast
    ? "bg-black text-white border-yellow-400"
    : "bg-white text-gray-800 border-gray-200"
  const buttonClass = highContrast ? "bg-yellow-500 text-black hover:bg-yellow-400" : ""

  // Add screen reader announcements
  
  // Text-to-speech function
  const speakText = (text) => {
    if (!screenReaderMode) return;

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    } else {
      console.log("Text-to-speech not supported in this browser");
    }
  };

  useEffect(() => {
    if (screenReaderMode) {
      document.querySelectorAll("[aria-label]").forEach((el) => {
        el.setAttribute("role", "button");
      });

      document.querySelectorAll(".sr-clickable").forEach((el) => {
        el.classList.add("cursor-pointer");
        if (!el.getAttribute("tabindex")) {
          el.setAttribute("tabindex", "0");
        }
        el.addEventListener("click", () => speakText(el.innerText));
        el.addEventListener("keypress", (e) => {
          if (e.key === "Enter") speakText(el.innerText);
        });
      });

      speakText("Screen reader mode is now active. Click on any text to have it read aloud.");
    }
  }, [screenReaderMode]);

useEffect(() => {
    if (screenReaderMode) {
      document.querySelectorAll("[aria-label]").forEach((el) => {
        el.setAttribute("role", "button")
      })
    }
  }, [screenReaderMode])

  // Handle medication taken
  const handleMedicationTaken = (index) => {
    // In a real app, you would update this in a database
    alert(`Marked ${medications[index].name} as taken`)
  }

  return (
    <div className={`min-h-screen bg-gray-50 p-4 ${largeText ? "text-lg" : ""}`}>
      <div className="max-w-6xl mx-auto sr-clickable">
        {/* Accessibility Controls */}
        <div className="flex flex-wrap gap-2 mb-6 justify-end sr-clickable">
          <button
            onClick={() => setLargeText(!largeText)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              largeText ? "bg-sky-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
            aria-label="Toggle larger text"
          >
            <Type size={18} />
            <span className="hidden sm:inline sr-clickable">Larger Text</span>
          </button>

          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              highContrast ? "bg-yellow-500 text-black" : "bg-gray-200 text-gray-700"
            }`}
            aria-label="Toggle high contrast"
          >
            <Sun size={18} />
            <span className="hidden sm:inline sr-clickable">High Contrast</span>
          </button>

          <button
            onClick={() => setScreenReaderMode(!screenReaderMode)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              screenReaderMode ? "bg-sky-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
            aria-label="Toggle screen reader mode"
          >
            <Eye size={18} />
            <span className="hidden sm:inline sr-clickable">Screen Reader</span>
          </button>
        </div>

        {/* Dashboard Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6 p-1 sr-clickable">
          <div className="flex sr-clickable">
            <button
              className={`flex-1 py-3 px-4 rounded-lg font-medium ${
                activeTab === "dashboard" ? "bg-sky-100 text-sky-800" : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              Dashboard
            </button>
            <button
              className={`flex-1 py-3 px-4 rounded-lg font-medium ${
                activeTab === "chat" ? "bg-sky-100 text-sky-800" : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("chat")}
            >
              <div className="flex items-center justify-center gap-2 sr-clickable">
                <MessageCircle size={18} />
                <span className="sr-clickable">Chat</span>
              </div>
            </button>
          </div>
        </div>

        {activeTab === "dashboard" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sr-clickable">
            {/* Left Column: Health Info and Medication */}
            <div className="space-y-6 sr-clickable">
              {/* My Profile Section */}
              <div className={`rounded-xl shadow-lg p-4 ${containerClass} border-2`}>
                <h2
                  className={`text-xl ${largeText ? "text-2xl" : ""} font-bold mb-3 ${highContrast ? "text-yellow-400" : "text-sky-800"}`}
                >
                  My Profile
                </h2>

                <div className="grid grid-cols-2 gap-2 mb-3 sr-clickable">
                  <div className={`p-2 rounded-lg ${highContrast ? "bg-gray-800" : "bg-sky-50"}`}>
                    <div className="text-sm font-medium mb-0.5 sr-clickable">Full Name</div>
                    <p className="text-base font-bold sr-clickable">Martha Johnson</p>
                  </div>

                  <div className={`p-2 rounded-lg ${highContrast ? "bg-gray-800" : "bg-sky-50"}`}>
                    <div className="text-sm font-medium mb-0.5 sr-clickable">Age</div>
                    <p className="text-base font-bold sr-clickable">78 years</p>
                  </div>

                  <div className={`p-2 rounded-lg ${highContrast ? "bg-gray-800" : "bg-sky-50"}`}>
                    <div className="text-sm font-medium mb-0.5 sr-clickable">Room Number</div>
                    <p className="text-base font-bold sr-clickable">101</p>
                  </div>

                  <div className={`p-2 rounded-lg ${highContrast ? "bg-gray-800" : "bg-sky-50"}`}>
                    <div className="text-sm font-medium mb-0.5 sr-clickable">Emergency Contact</div>
                    <p className="text-base font-bold sr-clickable">John Johnson (Son)</p>
                  </div>
                </div>

                <div className="space-y-2 mb-2 sr-clickable">
                  <div className={`p-2 rounded-lg ${highContrast ? "bg-gray-800" : "bg-sky-50"}`}>
                    <div className="text-sm font-medium mb-0.5 sr-clickable">Medical Conditions</div>
                    <p className="text-sm sr-clickable">Hypertension, Type 2 Diabetes, Mild Arthritis</p>
                  </div>

                  <div className={`p-2 rounded-lg ${highContrast ? "bg-gray-800" : "bg-sky-50"}`}>
                    <div className="text-sm font-medium mb-0.5 sr-clickable">Preferences</div>
                    <p className="text-sm sr-clickable">
                      Enjoys reading, classical music, and afternoon walks. Prefers to eat dinner before 6 PM.
                    </p>
                  </div>
                </div>

                <p className={`text-xs ${highContrast ? "text-gray-400" : "text-gray-500"}`}>
                  Last updated: {healthData.lastUpdated}
                </p>
              </div>

              {/* Medication Alerts */}
              <div className={`rounded-xl shadow-lg p-6 ${containerClass} border-2`}>
                <h2
                  className={`text-2xl ${largeText ? "text-3xl" : ""} font-bold mb-4 ${highContrast ? "text-yellow-400" : "text-sky-800"}`}
                >
                  Medication Reminders
                </h2>

                <div className="space-y-4 sr-clickable">
                  {medications.map((med, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        med.due
                          ? highContrast
                            ? "bg-yellow-500 text-black border-yellow-600"
                            : "bg-amber-50 border-amber-200"
                          : highContrast
                            ? "bg-gray-800 border-gray-700"
                            : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-center sr-clickable">
                        <div className="sr-clickable">
                          <div className="flex items-center gap-2 sr-clickable">
                            <Pill
                              size={20}
                              className={med.due ? (highContrast ? "text-black" : "text-amber-500") : ""}
                            />
                            <span className={`font-bold ${largeText ? "text-xl" : "text-lg"}`}>{med.name}</span>
                            {med.due && (
                              <span className="flex items-center text-sm font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-800 sr-clickable">
                                <Clock size={14} className="mr-1" /> Due now
                              </span>
                            )}
                          </div>
                          <p className="ml-7 sr-clickable">
                            {med.dosage} - {med.time}
                          </p>
                        </div>

                        {!med.taken ? (
                          <button
                            onClick={() => handleMedicationTaken(index)}
                            className={`px-3 py-1 rounded-lg ${
                              highContrast
                                ? "bg-yellow-400 text-black hover:bg-yellow-300"
                                : "bg-sky-100 text-sky-800 hover:bg-sky-200"
                            }`}
                            aria-label={`Mark ${med.name} as taken`}
                          >
                            Take now
                          </button>
                        ) : (
                          <span
                            className={`flex items-center px-3 py-1 rounded-lg ${
                              highContrast ? "bg-gray-700 text-yellow-400" : "bg-green-100 text-green-800"
                            }`}
                          >
                            ✓ Taken
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Check-in Section */}
            <div className={`rounded-xl shadow-lg p-6 ${containerClass} border-2`}>
              {!isSubmitted ? (
                <>
                  {/* Mood Check-in Section */}
                  <div className="mood-section mb-8 sr-clickable">
                    <h2
                      className={`text-2xl ${largeText ? "text-3xl" : ""} font-bold mb-6 text-center ${highContrast ? "text-yellow-400" : "text-sky-800"}`}
                    >
                      How are you feeling today?
                    </h2>

                    <div
                      className={`grid grid-cols-3 gap-4 ${showMoodError ? "border-2 border-red-500 p-4 rounded-xl" : ""}`}
                    >
                      <MoodOption
                        emoji={<Smile size={largeText ? 64 : 48} />}
                        label="Happy"
                        isSelected={selectedMood === "happy"}
                        onClick={() => handleMoodSelect("happy")}
                        highContrast={highContrast}
                        largeText={largeText}
                      />

                      <MoodOption
                        emoji={<Meh size={largeText ? 64 : 48} />}
                        label="Okay"
                        isSelected={selectedMood === "neutral"}
                        onClick={() => handleMoodSelect("neutral")}
                        highContrast={highContrast}
                        largeText={largeText}
                      />

                      <MoodOption
                        emoji={<Frown size={largeText ? 64 : 48} />}
                        label="Sad"
                        isSelected={selectedMood === "sad"}
                        onClick={() => handleMoodSelect("sad")}
                        highContrast={highContrast}
                        largeText={largeText}
                      />
                    </div>

                    {showMoodError && (
                      <p className="text-red-500 text-center mt-2 sr-clickable" role="alert">
                        Please select how you're feeling today
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-8 sr-clickable">
                    <button
                      className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl ${
                        highContrast
                          ? "bg-yellow-500 text-black hover:bg-yellow-400"
                          : "bg-sky-100 text-sky-800 hover:bg-sky-200"
                      } transition-colors ${largeText ? "text-xl" : ""}`}
                      onClick={handleHelpRequest}
                      aria-label="Request help"
                    >
                      <HelpCircle size={largeText ? 24 : 20} />
                      <span className="sr-clickable">Need something?</span>
                    </button>

                    <button
                      className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl ${
                        isRecording
                          ? "bg-red-500 text-white animate-pulse"
                          : highContrast
                            ? "bg-yellow-500 text-black hover:bg-yellow-400"
                            : "bg-purple-100 text-purple-800 hover:bg-purple-200"
                      } transition-colors ${largeText ? "text-xl" : ""}`}
                      onMouseDown={startRecording}
                      onTouchStart={startRecording}
                      onMouseUp={stopRecording}
                      onTouchEnd={stopRecording}
                      onMouseLeave={stopRecording}
                      aria-label="Record voice message"
                    >
                      <Mic size={largeText ? 24 : 20} />
                      <span className="sr-clickable">Want to talk? {recordingText}</span>
                    </button>
                  </div>

                  {/* Additional Inputs */}
                  <div className="mb-8 sr-clickable">
                    <div className="mb-6 sr-clickable">
                      <label
                        htmlFor="noteInput"
                        className={`block mb-2 font-medium ${highContrast ? "text-yellow-400" : "text-gray-700"} ${largeText ? "text-xl" : ""}`}
                      >
                        Add a note (optional):
                      </label>
                      <textarea
                        id="noteInput"
                        className={`w-full p-3 border rounded-lg ${
                          highContrast ? "bg-gray-800 text-white border-yellow-400" : "bg-gray-50 border-gray-300"
                        } ${largeText ? "text-xl" : ""}`}
                        rows={3}
                        placeholder="Type your message here..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        aria-label="Optional note"
                      />
                    </div>

                    <div className="sr-clickable">
                      <label
                        className={`block mb-2 font-medium ${highContrast ? "text-yellow-400" : "text-gray-700"} ${largeText ? "text-xl" : ""}`}
                      >
                        Add a photo (optional):
                      </label>

                      <div className="flex flex-col sm:flex-row gap-3 sr-clickable">
                        <button
                          className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg ${
                            highContrast
                              ? "bg-yellow-500 text-black hover:bg-yellow-400"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          } transition-colors ${largeText ? "text-xl" : ""}`}
                          onClick={() => handlePhotoUpload(false)}
                          aria-label="Upload photo from device"
                        >
                          <Upload size={largeText ? 24 : 20} />
                          <span className="sr-clickable">Upload Photo</span>
                        </button>

                        <button
                          className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg ${
                            highContrast
                              ? "bg-yellow-500 text-black hover:bg-yellow-400"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          } transition-colors ${largeText ? "text-xl" : ""}`}
                          onClick={() => handlePhotoUpload(true)}
                          aria-label="Take a new photo with camera"
                        >
                          <Camera size={largeText ? 24 : 20} />
                          <span className="sr-clickable">Take Photo</span>
                        </button>
                      </div>

                      <input
                        type="file"
                        ref={photoInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        aria-hidden="true"
                      />

                      {photoPreview && (
                        <div className="mt-4 sr-clickable">
                          <img
                            src={photoPreview || "/placeholder.svg"}
                            alt="Preview of uploaded photo"
                            className="w-full max-h-48 object-contain rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    className={`w-full p-4 rounded-xl ${largeText ? "text-xl" : ""} font-medium ${
                      highContrast
                        ? "bg-yellow-500 text-black hover:bg-yellow-400"
                        : "bg-green-600 text-white hover:bg-green-700"
                    } transition-colors`}
                    onClick={handleSubmit}
                    aria-label="Submit your check-in"
                  >
                    <span className="flex items-center justify-center gap-2 sr-clickable">
                      <Send size={largeText ? 24 : 20} />
                      Submit Check-in
                    </span>
                  </button>
                </>
              ) : (
                /* Success Message */
                <div className="text-center py-8 sr-clickable">
                  <div
                    className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
                      highContrast ? "bg-yellow-500 text-black" : "bg-green-100 text-green-600"
                    }`}
                  >
                    <span className="text-4xl sr-clickable" role="img" aria-label="Success">
                      ✓
                    </span>
                  </div>

                  <h2
                    className={`text-2xl ${largeText ? "text-3xl" : ""} font-bold mb-4 ${
                      highContrast ? "text-yellow-400" : "text-green-600"
                    }`}
                  >
                    Thank you for checking in!
                  </h2>

                  <p className={`mb-8 ${largeText ? "text-xl" : ""}`}>Your caregiver and family have been notified.</p>

                  <button
                    className={`px-6 py-3 rounded-lg ${largeText ? "text-xl" : ""} ${
                      highContrast
                        ? "bg-yellow-500 text-black hover:bg-yellow-400"
                        : "bg-sky-600 text-white hover:bg-sky-700"
                    } transition-colors`}
                    onClick={resetForm}
                    aria-label="Return to check-in form"
                  >
                    Back to Dashboard
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Chat Tab */
          <div className="h-[calc(100vh-200px)] sr-clickable">
            <Chat />
          </div>
        )}
      </div>
    </div>
  )
}

// Mood option component
function MoodOption({ emoji, label, isSelected, onClick, highContrast, largeText }) {
  return (
    <button
      className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all ${
        isSelected
          ? highContrast
            ? "bg-yellow-500 text-black scale-105"
            : "bg-sky-100 border-2 border-sky-500 scale-105"
          : highContrast
            ? "bg-gray-800 hover:bg-gray-700"
            : "bg-white hover:bg-gray-50 border border-gray-200"
      }`}
      onClick={onClick}
      aria-label={`Select mood: ${label}`}
      aria-pressed={isSelected}
    >
      <div className="mb-2 sr-clickable">{emoji}</div>
      <span className={`font-medium ${largeText ? "text-xl" : ""}`}>{label}</span>
    </button>
  )
}
