document.addEventListener("DOMContentLoaded", function () {


  disableAllFields();  // Assuming this function handles the disabling of the fields

  // Marital status field is the only one enabled initially
  const maritalStatus = document.getElementById('maritalStatus');
  const zakatyes = document.getElementById('zakatYes');
  const zakatno = document.getElementById('zakatNo');

  maritalStatus.disabled = false
  zakatyes.disabled = false
  zakatno.disabled = false

  const nationality = document.getElementById('paknation');
  nationality.disabled = false

  const other  = document.getElementById('othernation');
  other.disabled = false

  document.getElementById('dataForm').addEventListener('submit', function (e) {
    e.preventDefault();
    document.getElementById('content').style.display = 'none';
    // Show the thank you message
    document.getElementById('thankYouMessage').style.display = 'block';


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
      "Attachments": []  // This will hold the Base64-encoded attachments
    };


      const attachmentFields = [
        {id: 'husband_eid_front', label: "Husband's Emirates ID (Front)"},
        {id: 'husband_eid_back', label: "Husband's Emirates ID (Back)"},
        {id: 'wife_eid_front', label: "Wife's Emirates ID (Front)"},
        {id: 'wife_eid_back', label: "Wife's Emirates ID (Back)"},
        {id: 'husband_salary', label: "Husband's Salary Certificate"},
        {id: 'wife_salary', label: "Wife's Salary Certificate"}
      ];

      attachmentFields.forEach(field => {
        const input = document.getElementById(field.id);
        const files = input.files;

        if (files.length > 0) {
          Array.from(files).forEach(file => {
            const fileUrl = `https://padpmc.sharepoint.com/sites/WelfareCommittee/Shared%20Documents/Food%20Cards%20Documents/${encodeURIComponent(file.name)}`;
            convertToBase64(file).then(base64Content => {
              formData.Attachments.push({
                "fileName": file.name,
                "fileContent": ensurePadding(base64Content),
                "fileUrl": fileUrl,
                "label": field.label  // Optionally include the label for identification
              });

              // Send data once all attachments are converted
              if (formData.Attachments.length === getTotalFilesCount(attachmentFields)) {
                console.log("🚀 Data being sent to Power Automate:", JSON.stringify(formData));
                sendToPowerAutomate(formData);
              }
            }).catch(error => {
              console.error("Error converting file to Base64:", error);
            });
          });
        }
      });
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

      // Show Husband and Wife Attachments
      document.getElementById('husband_eid_front').closest('.input-box').style.display = 'block';
      document.getElementById('husband_eid_back').closest('.input-box').style.display = 'block';
      document.getElementById('wife_eid_front').closest('.input-box').style.display = 'block';
      document.getElementById('wife_eid_back').closest('.input-box').style.display = 'block';
      document.getElementById('husband_salary').closest('.input-box').style.display = 'block';
      document.getElementById('wife_salary').closest('.input-box').style.display = 'block';
    }
    else if (maritalStatus === 'single') {
      disableAllFields();  // Assuming this function handles the disabling of the fields

      // Marital status field is the only one enabled initially
      const maritalStatus = document.getElementById('maritalStatus');
      maritalStatus.disabled = false;
      messageContainer.style.display = 'block';

      setTimeout(() => {
        messageContainer.style.display = 'none';
      }, 7000);

      // Hide Attachments for Single and remove 'required' attribute
      document.getElementById('husband_eid_front').closest('.input-box').style.display = 'none';
      document.getElementById('husband_eid_back').closest('.input-box').style.display = 'none';
      document.getElementById('wife_eid_front').closest('.input-box').style.display = 'none';
      document.getElementById('wife_eid_back').closest('.input-box').style.display = 'none';
      document.getElementById('husband_salary').closest('.input-box').style.display = 'none';
      document.getElementById('wife_salary').closest('.input-box').style.display = 'none';

      // Remove required attribute from Husband's fields
      document.getElementById('husband_eid_front').removeAttribute('required');
      document.getElementById('husband_eid_back').removeAttribute('required');
      document.getElementById('husband_salary').removeAttribute('required');
    }
    else if (maritalStatus === 'widowed') {
      // Show wife fields when widowed
      wifeFields.forEach(field => {
        field.closest('.input-box').style.display = 'block';
        field.disabled = false;
        field.setAttribute('required', 'true');
      });

      // Adjust labels for widowed
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

      // Show Attachments for widowed
      document.getElementById('wife_eid_front').closest('.input-box').style.display = 'block';
      document.getElementById('wife_eid_back').closest('.input-box').style.display = 'block';
      document.getElementById('wife_salary').closest('.input-box').style.display = 'block';

      // Add Death Certificate field for widowed
      const deathCertificateField = document.createElement('div');
      deathCertificateField.innerHTML = `
    <label for="death_certificate">Death Certificate</label>
    <input type="file" id="death_certificate" name="attachments" accept="image/*,application/pdf,.docx,.xlsx" required>
  `;
      document.querySelector('.attachment-container').appendChild(deathCertificateField);

      // Hide and remove required from husband's fields
      document.getElementById('husband_eid_front').closest('.input-box').style.display = 'none';
      document.getElementById('husband_eid_back').closest('.input-box').style.display = 'none';
      document.getElementById('husband_salary').closest('.input-box').style.display = 'none';

      document.getElementById('husband_eid_front').removeAttribute('required');
      document.getElementById('husband_eid_back').removeAttribute('required');
      document.getElementById('husband_salary').removeAttribute('required');
    }
    else if (maritalStatus === 'divorced') {
      // Show wife fields when divorced
      wifeFields.forEach(field => {
        field.closest('.input-box').style.display = 'block';
        field.disabled = false;
        field.setAttribute('required', 'true');
      });

      // Adjust labels for divorced
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

      // Show Attachments for divorced
      document.getElementById('wife_eid_front').closest('.input-box').style.display = 'block';
      document.getElementById('wife_eid_back').closest('.input-box').style.display = 'block';
      document.getElementById('wife_salary').closest('.input-box').style.display = 'block';

      // Add Divorce Certificate field for divorced
      const divorceCertificateField = document.createElement('div');
      divorceCertificateField.innerHTML = `
    <label for="divorce_certificate">Divorce Certificate</label>
    <input type="file" id="divorce_certificate" name="attachments" accept="image/*,application/pdf,.docx,.xlsx" required>
  `;
      document.querySelector('.attachment-container').appendChild(divorceCertificateField);

      // Hide and remove required from husband's fields
      document.getElementById('husband_eid_front').closest('.input-box').style.display = 'none';
      document.getElementById('husband_eid_back').closest('.input-box').style.display = 'none';
      document.getElementById('husband_salary').closest('.input-box').style.display = 'none';

      document.getElementById('husband_eid_front').removeAttribute('required');
      document.getElementById('husband_eid_back').removeAttribute('required');
      document.getElementById('husband_salary').removeAttribute('required');
    }


// Helper function to calculate total files
    function getTotalFilesCount(fields) {
      return fields.reduce((count, field) => {
        const input = document.getElementById(field.id);
        return count + input.files.length;
      }, 0);
    }
  });
});
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
  const messageContainer = document.getElementById('messageContainer');

  // Get all husband fields
  const husbandFields = document.querySelectorAll('#husbandDetails, #husbandPhone, #husbandEmail, #husbandID, #husbandExpiry, #husbandSalary');
  const wifeFields = document.querySelectorAll('#wifeName, #wifePhoneNumber, #wifeEmail, #wifeEmiratesID, #wifeExpiryDate, #wifeSalary');
  const commentsField = document.getElementById('comments');
  const homeAddressField = document.getElementById('homeAddress');

  homeAddressField.disabled = false;
  commentsField.disabled = false;

  // Reset the wife's label and placeholder names to defaul
  if (maritalStatus === 'married') {
    husbandFields.forEach(field => {
      field.style.display = 'block'; // Show entire container
      field.setAttribute('required', 'true'); // Ensure fields are required
    });

    // Reset Wife Labels and Placeholders to Default
    document.getElementById('wifeNameLabel').innerText = "Wife's Full Name";
    document.getElementById('wifePhoneNumberLabel').innerText = "Wife's Phone Number";
    document.getElementById('wifeEmailLabel').innerText = "Wife's Email";
    document.getElementById('wifeEmiratesIDLabel').innerText = "Wife's Emirates ID";
    document.getElementById('wifeExpiryDateLabel').innerText = "Wife's Emirates ID Expiry";
    document.getElementById('wifeSalaryLabel').innerText = "Wife's Salary";

    document.getElementById('wifeName').placeholder = "Enter wife's full name";
    document.getElementById('wifePhoneNumber').placeholder = "Enter wife's phone number";
    document.getElementById('wifeEmail').placeholder = "Enter wife's email";
    document.getElementById('wifeEmiratesID').placeholder = "Enter wife's Emirates ID number";
    document.getElementById('wifeExpiryDate').placeholder = "Enter wife's Emirates ID expiry date";
    document.getElementById('wifeSalary').placeholder = "Enter wife's salary";

    // Ensure all wife fields are visible and required
    wifeFields.forEach(field => {
      field.closest('.input-box').style.display = 'block';
      field.disabled = false;
      field.setAttribute('required', 'true'); // Ensure wife fields are required
    });

    // Hide Death & Divorce Certificate fields and remove 'required'
    document.getElementById('death_certificate').closest('div').style.display = 'none';
    document.getElementById('divorce_certificate').closest('div').style.display = 'none';
    document.getElementById('death_certificate').removeAttribute('required');
    document.getElementById('divorce_certificate').removeAttribute('required');

    // Ensure correct attachments are displayed for married
    ['husband_eid_front', 'husband_eid_back', 'husband_salary'].forEach(id => {
      const element = document.getElementById(id);
      element.closest('div').classList.remove('hidden');
      element.setAttribute('required', 'true'); // Ensure attachments are required
    });
  }



  else if (maritalStatus === 'widowed') {
    husbandFields.forEach(field => {
      field.style.display = 'none'; // Hide entire container
    });
    // Show wife fields when divorced
    wifeFields.forEach(field => {
      field.closest('.input-box').style.display = 'block';
      field.disabled = false;
      field.setAttribute('required', 'true');
    });
    document.querySelectorAll('.husband-attachment').forEach(div => {
      div.style.display = 'none';
    });

    // Adjust labels for divorced
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

    // Show Attachments for divorced
    // Hide husband's attachments
    document.getElementById('husband_eid_front').closest('div').classList.add('hidden');
    document.getElementById('husband_eid_back').closest('div').classList.add('hidden');
    document.getElementById('husband_salary').closest('div').classList.add('hidden');

// Show wife's attachments
    document.getElementById('wife_eid_front').closest('div').classList.remove('hidden');
    document.getElementById('wife_eid_back').closest('div').classList.remove('hidden');
    document.getElementById('wife_salary').closest('div').classList.remove('hidden');

// Show Divorce Certificate field
    document.getElementById('divorce_certificate').closest('div').classList.add('hidden');

// Hide Death Certificate field (if applicable)
    document.getElementById('death_certificate').closest('div').classList.remove('hidden');


  }

  else if (maritalStatus === 'divorced') {
    husbandFields.forEach(field => {
      field.style.display = 'none'; // Hide entire container
    });
    // Show wife fields when divorced
    wifeFields.forEach(field => {
      field.closest('.input-box').style.display = 'block';
      field.disabled = false;
      field.setAttribute('required', 'true');
    });
    document.querySelectorAll('.husband-attachment').forEach(div => {
      div.style.display = 'none';
    });

    // Adjust labels for divorced
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

    // Show Attachments for divorced
    // Hide husband's attachments
    document.getElementById('husband_eid_front').closest('div').classList.add('hidden');
    document.getElementById('husband_eid_back').closest('div').classList.add('hidden');
    document.getElementById('husband_salary').closest('div').classList.add('hidden');

// Show wife's attachments
    document.getElementById('wife_eid_front').closest('div').classList.remove('hidden');
    document.getElementById('wife_eid_back').closest('div').classList.remove('hidden');
    document.getElementById('wife_salary').closest('div').classList.remove('hidden');

// Show Divorce Certificate field
    document.getElementById('divorce_certificate').closest('div').classList.remove('hidden');

// Hide Death Certificate field (if applicable)
    document.getElementById('death_certificate').closest('div').classList.add('hidden');


  }

  else if (maritalStatus === 'single') {
    disableAllFields();  // Assuming this function handles the disabling of the fields

    // Marital status field is the only one enabled initially
    const maritalStatus = document.getElementById('maritalStatus');
    maritalStatus.disabled = false;
    messageContainer.style.display = 'block';

    setTimeout(() => {
      messageContainer.style.display = 'none';
    }, 7000);
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


function validateZakat() {
  const zakatFund = document.querySelector('input[name="zakatFund"]:checked');
  const zakatMessage = document.querySelector('#zakatMessage');
  const nationalitySelection = document.querySelector('#nationalitySelection');

  if (!zakatFund) {
    alert("Please select whether you are part of the Zakat fund.");
    return;
  }

  if (zakatFund.value === 'yes') {
    zakatMessage.style.display = 'none'; // Hide error message
    nationalitySelection.style.display = 'block'; // Show nationality selection
    document.querySelector('#zakatSelection').style.display = 'none'; // Hide Zakat question
  } else {
    zakatMessage.style.display = 'block'; // Show error message
  }
}

function validateNationality() {
  const nationality = document.querySelector('input[name="nationality"]:checked');
  const nationalityMessage = document.querySelector('#nationalityMessage');
  const formContent = document.querySelector('#content');

  if (!nationality) {
    alert("Please select your nationality.");
    return;
  }

  if (nationality.value === 'pakistani') {
    nationalityMessage.style.display = 'none'; // Hide error message
    formContent.style.display = 'block'; // Show form
    document.querySelector('#nationalitySelection').style.display = 'none'; // Hide nationality selection
  } else {
    nationalityMessage.style.display = 'block'; // Show error message
  }
}


function disableAllFields() {
  const allFields = document.querySelectorAll('input, select, textarea');
  allFields.forEach(field => field.disabled = true);
}

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = function () {
      resolve(reader.result.split(',')[1]);  // Remove the Base64 prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
function ensurePadding(base64) {
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  return base64;
}
