document.getElementById('dataForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // Get form inputs
  const formData = {
    "Title": "Ramadan Food Card",
    "MaritalStatus": getValue("MaritalStatus"),
    "FullNameHusband": getValue("FullNameHusband"),
    "PhoneNumberHusband": getValue("PhoneNumberHusband"),
    "EmailHusband": getValue("EmailHusband"),
    "EmiratesIDHusband": getValue("EmiratesIDHusband"),
    "ExpiryDateEmiratesIDHusband": getDateValue("husband_emirates_expiry"),
    "SalaryHusband": getValue("SalaryHusband"),
    "FullNameWife": getValue("FullNameWife"),
    "PhoneNumberWife": getValue("PhoneNumberWife"),
    "EmailWife": getValue("EmailWife"),
    "EmiratesIDWife": getValue("EmiratesIDWife"),
    "ExpiryDateEmiratesIDWife": getDateValue("wife_emirates_expiry"),
    "SalaryWife": getValue("SalaryWife"),
    "Emirates": getValue("Emirates"),
    "HomeAddress": getValue("HomeAddress"),
    "Comments": getValue("Comments"),
    "Nationality": getValue("Nationality"),
    "Status": "Pending", // Defaulting to one of the valid enum values
    "SubmissionDate": new Date().toISOString(),
  };

  // Check if required fields are filled
  if (!validateRequiredFields(formData)) {
    alert("Please fill in all required fields correctly.");
    return;
  }

  // Debugging: Log the cleaned data before sending
  console.log("🚀 Data being sent to Power Automate:", JSON.stringify(formData));

  sendToPowerAutomate(formData);
});
function getDateValue(id) {
  const element = document.getElementById(id);
  return element ? new Date(element.value).toISOString() : "";
}

// Function to get field value
function getValue(id) {
  const element = document.getElementById(id);
  return element ? element.value.trim() : "";
}

// Function to validate email format
function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    alert(`Invalid email: ${email}`);
    return "";
  }
  return email;
}

// Function to remove non-numeric characters from number fields
function cleanNumber(value) {
  return value.replace(/\D/g, ""); // Remove all non-digit characters
}

// Function to check if required fields are filled
function validateRequiredFields(data) {
  for (const key in data) {
    if (data[key] === "" && key !== "Comments") { // Comments can be optional
      console.error(`Missing required field: ${key}`);
      return false;
    }
  }
  return true;
}

// Function to send data to Power Automate
function sendToPowerAutomate(data) {
  const url = 'https://prod-15.uaecentral.logic.azure.com:443/workflows/602d33ca8ea64c7787c9c11454f70a62/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=QHvLiue9-exuonCOCG_N7vNUyzhM9eSFLmqjt89uTcs';

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      alert('Data submitted successfully!');
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Error submitting data!');
    });
}
