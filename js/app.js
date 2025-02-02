document.addEventListener("DOMContentLoaded", function () {

  document.getElementById('dataForm').addEventListener('submit', function (e) {
    e.preventDefault();

  // Get form inputs
  function getValue(id) {
    const element = document.getElementById(id);
    return element ? element.value.trim() : "";
  }

  function getDateValue(id) {
    const element = document.getElementById(id);
    return element ? element.value : "";
  }
    const maritalStatus = getValue("maritalStatus");
    const requiredFields = [];

    if (maritalStatus === 'married') {
      requiredFields.push("husbandName", "husbandPhoneNumber", "husbandEmail1", "husbandEmiratesID", "husbandExpiryDate", "husbandSalaryValue");
    }

    requiredFields.push("wifeName", "wifePhoneNumber", "wifeEmail", "wifeEmiratesID", "wifeExpiryDate", "wifeSalary");

    // Check if required fields are filled
    let isValid = true;
    requiredFields.forEach(id => {
      const field = document.getElementById(id);
      if (field && !field.value.trim()) {
        isValid = false;
        field.classList.add("error"); // Add a red border or highlight (optional)
      } else {
        field.classList.remove("error");
      }
    });

    if (!isValid) {
      alert("Please fill in all required fields before submitting.");
      return;
    }

  const formData = {
    "Title": "Ramadan Food Card",
    "MaritalStatus": getValue("maritalStatus"),
    "FullNameHusband": getValue("husbandName"),
    "PhoneNumberHusband": getValue("husbandPhoneNumber"),
    "EmailHusband": getValue("husbandEmail1"),
    "EmiratesIDHusband": getValue("husbandEmiratesID"),
    "ExpiryDateEmiratesIDHusband": getDateValue("husbandExpiryDate"),
    "SalaryHusband": getValue("husbandSalaryValue"),
    "FullNameWife": getValue("wifeName"),
    "PhoneNumberWife": getValue("wifePhoneNumber"),
    "EmailWife": getValue("wifeEmail"),
    "EmiratesIDWife": getValue("wifeEmiratesID"),
    "ExpiryDateEmiratesIDWife": getDateValue("wifeExpiryDate"),
    "SalaryWife": getValue("wifeSalary"),
    "HomeAddress": getValue("homeAddress"),
    "Comments": getValue("comments"),
    "Status": "Pending",
    "SubmissionDate": new Date().toISOString(),
  };


  // Debugging: Log the cleaned data before sending
  console.log("🚀 Data being sent to Power Automate:", JSON.stringify(formData));

  sendToPowerAutomate(formData);
});});




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
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Error submitting data!');
    });
}



function toggleFields() {
  const maritalStatus = document.getElementById('maritalStatus').value;

  // Select all fields to toggle disabled
  const allFields = document.querySelectorAll('input, select, textarea');

  // If no marital status is selected, disable all fields and exit early
  if (!maritalStatus) {
    allFields.forEach(field => field.disabled = true);
    document.getElementById('maritalStatus').disabled = false;
    return;
  }

  // Reset all fields to their default state (disabled)
  allFields.forEach(field => field.disabled = false);

  // Get all husband fields
  const husbandFields = document.querySelectorAll('#husbandDetails, #husbandPhone, #husbandEmail, #husbandID, #husbandExpiry, #husbandSalary');
  const wifeFields = document.querySelectorAll('#wifeName, #wifePhoneNumber, #wifeEmail, #wifeEmiratesID, #wifeExpiryDate, #wifeSalary');
  const commentsField = document.getElementById('comments');
  const homeAddressField = document.getElementById('homeAddress');

  homeAddressField.disabled = false;
  commentsField.disabled = false;

  // Reset the wife's label and placeholder names to default
  const wifeLabelNames = {
    'wifeName': 'Wife\'s Full Name',
    'wifePhoneNumber': 'Wife\'s Phone Number',
    'wifeEmail': 'Wife\'s Email',
    'wifeEmiratesID': 'Wife\'s Emirates ID',
    'wifeExpiryDate': 'Wife\'s Emirates ID Expiry',
    'wifeSalary': 'Wife\'s Salary',
  };

  const wifePlaceholderNames = {
    'wifeName': 'Enter wife\'s full name',
    'wifePhoneNumber': 'Enter wife\'s phone number',
    'wifeEmail': 'Enter wife\'s email',
    'wifeEmiratesID': 'Enter wife\'s Emirates ID number',
    'wifeExpiryDate': 'Enter wife\'s Emirates ID expiry date',
    'wifeSalary': 'Enter wife\'s salary',
  };

  // Show/hide fields based on marital status
  if (maritalStatus === 'married') {
    // Show both Husband and Wife fields when married
    husbandFields.forEach(field => {
      field.closest('.input-box').style.display = 'block';
      field.disabled = false;
      field.setAttribute('required', 'true'); // Make required
    });
    wifeFields.forEach(field => {
      field.closest('.input-box').style.display = 'block';
      field.disabled = false;
      field.setAttribute('required', 'true');
    });

    // Change wife's labels and placeholders to default
    document.getElementById('wifeNameLabel').innerText = wifeLabelNames['wifeName'];
    document.getElementById('wifePhoneNumberLabel').innerText = wifeLabelNames['wifePhoneNumber'];
    document.getElementById('wifeEmailLabel').innerText = wifeLabelNames['wifeEmail'];
    document.getElementById('wifeEmiratesIDLabel').innerText = wifeLabelNames['wifeEmiratesID'];
    document.getElementById('wifeExpiryDateLabel').innerText = wifeLabelNames['wifeExpiryDate'];
    document.getElementById('wifeSalaryLabel').innerText = wifeLabelNames['wifeSalary'];

    // Reset placeholders to default
    document.getElementById('wifeName').placeholder = wifePlaceholderNames['wifeName'];
    document.getElementById('wifePhoneNumber').placeholder = wifePlaceholderNames['wifePhoneNumber'];
    document.getElementById('wifeEmail').placeholder = wifePlaceholderNames['wifeEmail'];
    document.getElementById('wifeEmiratesID').placeholder = wifePlaceholderNames['wifeEmiratesID'];
    document.getElementById('wifeExpiryDate').placeholder = wifePlaceholderNames['wifeExpiryDate'];
    document.getElementById('wifeSalary').placeholder = wifePlaceholderNames['wifeSalary'];
  } else {

    // Hide husband fields for single, widowed, or divorced
    husbandFields.forEach(field => {
      field.removeAttribute('required');
      field.closest('.input-box').style.display = 'none';
      field.disabled = true;
    });

    // Ensure wife fields are visible and enabled
    wifeFields.forEach(field => {
      field.closest('.input-box').style.display = 'block';
      field.disabled = false;
      field.setAttribute('required', 'true');
    });


    // Change wife fields' labels and placeholders to "Your"
    document.getElementById('wifeNameLabel').innerText = 'Your Full Name';
    document.getElementById('wifePhoneNumberLabel').innerText = 'Your Phone Number';
    document.getElementById('wifeEmailLabel').innerText = 'Your Email';
    document.getElementById('wifeEmiratesIDLabel').innerText = 'Your Emirates ID Number';
    document.getElementById('wifeExpiryDateLabel').innerText = 'Emirates ID Expiry Date';
    document.getElementById('wifeSalaryLabel').innerText = 'Your Salary';

    document.getElementById('wifeName').placeholder = 'Enter your full name';
    document.getElementById('wifePhoneNumber').placeholder = 'Enter your phone number';
    document.getElementById('wifeEmail').placeholder = 'Enter your email';
    document.getElementById('wifeEmiratesID').placeholder = 'Enter your Emirates ID number';
    document.getElementById('wifeExpiryDate').placeholder = 'Enter your Emirates ID expiry date';
    document.getElementById('wifeSalary').placeholder = 'Enter your salary';
  }

}
function handleAttachments() {
  const attachmentInput = document.getElementById("attachments");
  const attachmentError = document.getElementById("attachmentError");
  const attachmentList = document.getElementById("attachmentList");
  const files = attachmentInput.files;

  // Validate file count
  if (files.length > 8) {
    attachmentError.style.display = "block";
    attachmentInput.setCustomValidity("You can only upload up to 8 files.");
  } else {
    attachmentError.style.display = "none";
    attachmentInput.setCustomValidity("");
  }

  // Clear the previous attachment list
  attachmentList.innerHTML = '';

  // Loop through each file and display its name with a remove button
  Array.from(files).forEach((file, index) => {
    const fileDiv = document.createElement("div");
    fileDiv.classList.add("file-item");
    fileDiv.style.marginBottom = "5px"; // Optional styling

    const fileName = document.createElement("span");
    fileName.textContent = file.name;

    const removeButton = document.createElement("button");
    removeButton.textContent = "❌";
    removeButton.style.marginLeft = "10px";
    removeButton.style.color = "red";
    removeButton.style.border = "none";
    removeButton.style.background = "none";
    removeButton.style.cursor = "pointer";
    removeButton.onclick = () => removeAttachment(file, index);

    fileDiv.appendChild(fileName);
    fileDiv.appendChild(removeButton);
    attachmentList.appendChild(fileDiv);
  });
}

function removeAttachment(file, index) {
  const attachmentInput = document.getElementById("attachments");
  const dataTransfer = new DataTransfer(); // To handle file list manipulation

  // Loop through the current files and re-add to DataTransfer except the file to remove
  Array.from(attachmentInput.files).forEach((f, i) => {
    if (i !== index) {
      dataTransfer.items.add(f);
    }
  });

  // Update the input with the modified file list
  attachmentInput.files = dataTransfer.files;

  // Refresh the displayed list
  handleAttachments();
}


function checkNationality() {
  const nationality = document.querySelector('input[name="nationality"]:checked').value;
  const container = document.querySelector('.container');
  const nationalityMessage = document.querySelector('#nationalityMessage');
  const formContent = document.querySelector('#content');
  const nationalitySelection = document.querySelector('#nationalitySelection');

  // Hide nationality selection after a choice is made
  nationalitySelection.style.display = 'none';

  if (nationality === 'pakistani') {
    nationalityMessage.style.display = 'none';  // Hide message
    formContent.style.display = 'block';  // Show form content
  } else {
    nationalityMessage.style.display = 'block';  // Show message
    formContent.style.display = 'none';  // Hide form content
  }
}

