export const demoScript = {
    call: [
      { speaker: "AI", text: "नमस्ते, SehatSathi में आपका स्वागत है। अपने लक्षण बताइए।", time: 0 },
      { speaker: "Patient", text: "मुझे सीने में दर्द हो रहा है", time: 3000 },
      { speaker: "AI", text: "यह कब शुरू हुआ?", time: 6000 },
      { speaker: "Patient", text: "आज सुबह से", time: 9000 },
      { speaker: "AI", text: "क्या आपको सांस लेने में तकलीफ है?", time: 12000 },
      { speaker: "Patient", text: "हाँ, थोड़ी", time: 15000 },
      { speaker: "AI", text: "यह गंभीर है। मैं आपको नजदीकी अस्पताल भेज रहा हूं।", time: 18000 }
    ],
    
    urgency: 5,
    hospital: {
      name: "District Hospital Rajpura",
      distance: "12 km",
      beds: 5,
      eta: "15 minutes"
    }
  };