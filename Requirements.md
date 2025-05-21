**Must have requirements**
1. *Login/Signup screen The user is given their login information by the carehome owner and tries to log-in*
    1. The user will be taken to the “log-in” screen
    2. There will be a banner at the top of the screen that says “Log-in”
    3. There will be a textbox with subtle text inside it saying “username…” where the user will be prompted to enter their username
    4. There will be a textbox below that one with subtle text inside it that says “password…” where users will be prompted to enter their password
    5. There will be a submit button that users can press to log into the app.
    6. If the username inputted does not match any existing account after the user presses the submit button, an alert will come up letting them know the user does not exist, and will prompt them to re-enter their information and then resubmit.
    7. If the username and password combination is incorrect, the user will receive an alert telling them the password is incorrect, and will be prompted to re-enter their information then resubmit.
3. *Elder Dashboard*
    1. After the elder logs in, the dashboard must display:
        1. A title labeled “How are you feeling today?” must be prominently shown.
        2. Three mood emojis (happy, neutral, sad) for daily check-in
        3. If the elder select one of the three emojis, the mood icon would be highlighted
        4. “Need something?” button for the elder to request support
        5. “Want to talk?” button for the elder for speech-to-text
            1. If the elder presses the “want to talk?” button and holds down, the app will record whatever the elder is saying for as long as the elder holds down the button.
        6. An optional text input field for the elder to add a note
        7. an optional photo upload button for the elder to upload a photo (from device or take a new one) along with their mood and notes to give a visual update to caregivers and family.
        8. Submit button on the bottom to finished up check in
        9. After submission, show a success confirmation (e.g., “Thank you for checking in!”), while sending notification to the caregiver and family member
        10. If the elder didn’t select one of the 3 moods, a submission confirmation would not be sent
            1. Highlight the mood selection area in red
            2. Display a tooltip or text error message (e.g., “Please select a mood”)
    2. If the elder does not complete the check-in by 5 PM local time:
        1. The system must send an alert to the assigned caregiver When the check-in is complete ( is verifiable )
        2. The selected mood and any additional notes must be stored and time-stamped, and sent to the caregiver and family member
    3. Elder dashboard must also have buttons to support accessibility needs:
        1. Larger text
        2. high contrast theme
        3. screen reader compatibility
4. *Caregiver dashboard*
    1. After caregiver login, the dashboard must display
        1. Each elder card displays name, photo, age, current mood, and health precautions.
        2. A checklist is shown per elder: meal served, med given, exorcist, hygiene
        3. Each task has a check button to confirmed if the was complete
        4. A free form text field is provide for additional daily notes
        5. A voice to text button for audio note input
        6. A submit log button to save the task status notes and timestamp to the system
    2. Missed tasked alert
        1. If a scheduled task is not completed within a certain time
            1. A notification appear in the care giver dashboard
    3. Caregivers can access an analytics dashboard, and the analytics must support filtering by elder name and date range. They can view charts and summaries of elder data, including:
        1. weekly and monthly mood trends
        2. frequency of missed check-ins,
        3. task completion rates
5. *Family Dashboard*
    1. After a family member logs in, the dashboard must display
        1. Elder’s current mood status(latest check in)
        2. Timeline view of activities (checkin, medication administered)
        3. Toggle switches for notifications
            1. Alert for missed check in
            2. Urgent flags
            3. Caregiver messages
    2. Family member must be able to see
        1. Top right button to send a message directly to the caregiver via a “send message to caregiver button”
6. *Chat*
    1. All roles can access built in for chat system
        1. The user will be shown a chat screen that resembles a regular chat app.
        2. There will be a display screen that shows all of the texts that the users have sent in chronological order
        3. There will be a textbox near the bottom of the screen with subtle text inside it saying “input your message…” where users can type in a message.
        4. To the left of that text box there will be a microphone icon in bright colors that elders (anyone can use, but elders would prefer generally) can press to send a voice message. When they press the button, the microphone will begin recording a message, and the message will finish and send once they press the microphone icon again.
        5. There will be a “submit” button with an arrow inside on the right side of the text box that if pressed, will submit the message the user types in.
        6. If the user types in a message but does not submit it, that message will be saved in the textbox. When they return to the chat, they will be able to see that message waiting to be sent.
    2. A message are stored by timestamp and user roles after it is sent
        1. The text bubble behind the text will also be a different color for each user to make it easier for the elderly users to see.
        2. Voice messages will be sent as a microphone icon with a time stamp on it. When pressed, the voice message sent will play.
        3. If the user is not properly connected to the internet, they will receive a warning message letting them know that the message will not be sent when they try to press the submit button.
    3. User can react to message with emoji
       1. Near every sent message to the right, there will be an blank emoticon. When the user taps on it, they will be shown a small bank of emojis
       2. When the user taps on one of the emojis shown, that will be their reaction to the message, and it will shown up on the top right corner of the text message along with a label that shows who placed that emoji reaction
    5. File can be attached
           1. On the lefthand side of the textbox where texts can be sent, there will be a paperclip icon. When that is tapped, a pop up will appear at the bottom of the screen showing the files on the user's device.
           2. When the user taps on a file, that file will be placed into the textbox with a small preview. There will be an "x" icon placed at the top of the preview.
           3. If the user taps the x icon, their file upload will be cancelled.
           4. If the user continues to press the aforementioned "submit" button, the file will be uploaded.
    7. All updates by the caregiver are updated in the chat as a message.
7. *Share timeline*
    1. After login, users can access a Shared Timeline view.
        1. Display a list of timeline entries chronologically sorted by date/time.
        2. Each entry must show:
            1. Timestamp
            2. User role, ID, and name
            3. Type of action
    2. Users must be able to filter timeline entries:
        1. Filter by date - allow input on selection of what date
            1. There will be a small calendar icon near the top of the timeline. If users click on that, they will be taken to a screen that asks them to choose from three different drop down menus. The first one will have the year, the second will have the month, and the third will have the day.
            2. There will be a submit below at the bottom of that screen that the users press after inputting the year, month, and day. If the user fails to input in one of the three cateogories, they will be given an error message and asked to try again.
        2. Filter by user - dropdown list of the role
            1. There will be a small person icon near the top of the icon. If the user clicks on it, a dropdown will appear including names of all the members of the "group." If the user presses any of the names, it will filter and only show entries from that user.
        3. Filter by update type - dropdown list of update type
            1. Mood Check-Ins
            2. Caregiver Logs
            3. Family message
        4. Clicking "Apply Filters" updates the displayed timeline based on selected criteria.
    3. User bust be able to to view more detail
        1. Each timeline entry have expand button
        2. Clicking expand would reveal full update detail including picture, voice, or text messages
