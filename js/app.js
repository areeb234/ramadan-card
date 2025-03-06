document.addEventListener("DOMContentLoaded", function () {

  disableAllFields();  // Assuming this function handles the disabling of the fields

  // Marital status field is the only one enabled initially
  const maritalStatus = document.getElementById('maritalStatus');
  const zakatyes = document.getElementById('zakatYes');
  const zakatno = document.getElementById('zakatNo');
  const country = document.getElementById('countryDropdown');
  country.disabled = false
  maritalStatus.disabled = false
  zakatyes.disabled = false
  zakatno.disabled = false

  document.getElementById('dataForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const maritalStatusval = document.getElementById("maritalStatus").value;

    let isValid = true;
    let errorMessage = "";

    function validateExpiryDate(dateInput) {
      let expiryDate = new Date(dateInput);

      // Check if the date is invalid
      if (isNaN(expiryDate)) {
        return false; // Invalid date
      }

      // Check if the date has a complete day, month, and year
      if (expiryDate.getDate() === 1 && expiryDate.getMonth() === 0 && expiryDate.getFullYear() === 1970) {
        return false; // This indicates an incomplete or invalid date
      }

      return true; // Valid date with complete day, month, and year
    }


    let husbandExpiryDate = document.getElementById("husbandExpiryDate").value.trim();
    if (husbandExpiryDate && !validateExpiryDate(husbandExpiryDate) && maritalStatusval.toLowerCase() === "married"){
      isValid = false;
    }

    // Validate wife's Emirates ID expiry date
    let wifeExpiryDate = document.getElementById("wifeExpiryDate").value.trim();
    if (wifeExpiryDate && !validateExpiryDate(wifeExpiryDate)) {
      isValid = false;
    }

    const wifeEmail = document.getElementById('wifeEmail').value;
    const husbandEmail = document.getElementById('husbandEmail1').value;

    // Regular expression for validating email
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    // Validate Wife's Email
    if (!emailPattern.test(wifeEmail)) {
      alert('Please enter a valid email address for the wife.');
      isValid = false
    }

    // Validate Husband's Email
    if (!emailPattern.test(husbandEmail) && maritalStatusval.toLowerCase() === "married") {
      alert('Please enter a valid email address for the husband.');
      isValid = false
    }

    // If validation fails, prevent form submission
    if (!isValid) {
      e.preventDefault();
      return
    }
    function getValue(id) {
      const element = document.getElementById(id);
      return element ? element.value.trim() : "";
    }

    function getDateValue(id) {
      const element = document.getElementById(id);
      return element ? element.value : "";
    }

    function getNationalityValue() {
      const dropdown = document.getElementById("countryDropdown");
      const dropdownValue = dropdown.value;

      // If the dropdown has a selected value, clear the radio selection
      if (dropdownValue) {
        return dropdownValue;
      }

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
      "SubmissionDate": new Date().toLocaleString('en-GB', { timeZone: 'Asia/Dubai' }),
      "Emirates": getValue("emirates"),
      "Nationality": getNationalityValue(),
      "Attachments": []  // This will hold the Base64-encoded attachments
    };
    const attachmentFields = [
      { id: 'husband_eid_front', label: "Husband's Emirates ID (Front)" },
      { id: 'husband_eid_back', label: "Husband's Emirates ID (Back)" },
      { id: 'wife_eid_front', label: "Wife's Emirates ID (Front)" },
      { id: 'wife_eid_back', label: "Wife's Emirates ID (Back)" },
      { id: 'husband_salary', label: "Husband's Salary Certificate" },
      { id: 'wife_salary', label: "Wife's Salary Certificate" },
      { id: 'divorce_certificate', label: "Divorce Certificate" },
      { id: 'death_certificate', label: "Death Certificate" }
    ];

    attachmentFields.forEach(field => {
      const input = document.getElementById(field.id);

      // Ignore if the input is empty or does not exist
      if (!input || input.files.length === 0) return;

      Array.from(input.files).forEach(file => {
        // Find the last dot (.) to correctly extract the file extension
        const lastDotIndex = file.name.lastIndexOf(".");
        const fileExtension = lastDotIndex !== -1 ? file.name.substring(lastDotIndex) : ""; // Keep dot and extension
        const customFileName = `${field.id}${fileExtension}`; // Use input field ID as file name

        const fileUrl = `https://padpmc.sharepoint.com/sites/WelfareCommittee/Shared%20Documents/Food%20Cards%20Documents/${encodeURIComponent(customFileName)}`;

        convertToBase64(file).then(base64Content => {
          formData.Attachments.push({
            "fileName": customFileName, // Use custom filename with proper extension
            "fileContent": ensurePadding(base64Content),
            "fileUrl": fileUrl,
            "label": field.label // Optionally include label for reference
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
    });


// Helper function to calculate total files
    function getTotalFilesCount(fields) {
      return fields.reduce((count, field) => {
        const input = document.getElementById(field.id);
        return count + input.files.length;
      }, 0);
    }

    document.getElementById('content').style.display = 'none';
    // Show the thank you message
    document.getElementById('thankYouMessage').style.display = 'block';


  });

  function setupPhoneNumberInput(inputId) {
    const input = document.getElementById(inputId);

    // Set default value to '05' when the page loads
    input.value = "05";

    // Ensure cursor starts at the end when clicked
    input.addEventListener("focus", function () {
      if (!input.value.startsWith("05")) {
        input.value = "05";
      }
      setTimeout(() => input.setSelectionRange(2, 2), 0);
    });

    // Restrict input to only numbers and prevent deletion of '05'
    input.addEventListener("input", function () {
      if (!input.value.startsWith("05")) {
        input.value = "05"; // Reset if user tries to remove '05'
      }
      input.value = input.value.replace(/[^0-9]/g, ""); // Allow only numbers
      if (input.value.length > 10) {
        input.value = input.value.slice(0, 10); // Limit to 10 characters
      }
    });

    // Prevent backspace from deleting '05'
    input.addEventListener("keydown", function (event) {
      if ((input.selectionStart <= 2 && event.key === "Backspace") || input.selectionStart < 2) {
        event.preventDefault();
      }
    });
  }

  setupPhoneNumberInput("husbandPhoneNumber");
  setupPhoneNumberInput("wifePhoneNumber");


});

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
  const husbandFieldsrequired = document.querySelectorAll('#husbandName, #husbandPhoneNumber, #husbandEmail1, #husbandEmiratesID, #husbandExpiryDate, #husbandSalaryValue');

  if (maritalStatus === 'married') {
    husbandFields.forEach(field => {
      field.style.display = 'block'; // Show entire container
    });

    husbandFieldsrequired.forEach(field => {
      field.setAttribute('required', 'true'); // Ensure fields are required
    });


    document.getElementById('wifeNameLabel').innerText = "Wife's Full Name";
    document.getElementById('wifePhoneNumberLabel').innerText = "Wife's Phone Number";
    document.getElementById('wifeEmailLabel').innerText = "Wife's Email";
    document.getElementById('wifeEmiratesIDLabel').innerText = "Wife's Emirates ID No.";
    document.getElementById('wifeExpiryDateLabel').innerText = "Wife's Emirates ID Expiry";
    document.getElementById('wifeSalaryLabel').innerText = "Wife's Salary";
    document.querySelector("label[for='wife_eid_front']").textContent = "Wife's Emirates ID (Front)"
    document.querySelector("label[for='wife_eid_back']").textContent = "Wife's Emirates ID (Back)"
    document.querySelector("label[for='wife_salary']").textContent = "Wife's Salary Certificate"


    document.getElementById('wifeName').placeholder = "Enter wife's full name";
    document.getElementById('wifePhoneNumber').placeholder = "05XXXXXXX";
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
    document.getElementById('divorce_certificate').closest('div').classList.add('hidden');
    document.getElementById('death_certificate').closest('div').classList.add('hidden');
    document.getElementById('death_certificate').removeAttribute('required');
    document.getElementById('divorce_certificate').removeAttribute('required');
    document.getElementById('wifeSalary').removeAttribute('required');
    document.getElementById('wife_salary').removeAttribute('required');

    // Ensure correct attachments are displayed for married
    ['husband_eid_front', 'husband_eid_back', 'husband_salary'].forEach(id => {
      const element = document.getElementById(id);
      element.closest('div').classList.remove('hidden');
      element.setAttribute('required', 'true'); // Ensure attachments are required
    });

    ['wife_eid_front', 'wife_eid_back'].forEach(id => {
      const element = document.getElementById(id);
      element.setAttribute('required', 'true'); // Ensure attachments are required
    });
  }

  else if (maritalStatus === 'widowed') {
    husbandFields.forEach(field => {
      field.style.display = 'none'; // Hide entire container
      field.setAttribute('required', 'false');

      field.removeAttribute('required')
    });

    husbandFieldsrequired.forEach(field => {
      field.setAttribute('required', 'false');
      field.removeAttribute('required')

    });
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
    document.getElementById('wifeSalary').innerText = 'Your Salary';
    document.querySelector("label[for='wife_eid_front']").textContent = 'Your Emirates ID (Front)'
    document.querySelector("label[for='wife_eid_back']").textContent = 'Your Emirates ID (Back)'
    document.querySelector("label[for='wife_salary']").textContent = 'Your Salary Certificate'

    document.getElementById('wifeName').placeholder = 'Enter your full name';
    document.getElementById('wifePhoneNumber').placeholder = '05XXXXXXX';
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
    document.getElementById('divorce_certificate').closest('div').classList.add('hidden');
    document.getElementById('death_certificate').closest('div').classList.remove('hidden');
    document.getElementById('wifeSalary').removeAttribute('required');
    document.getElementById('wife_salary').removeAttribute('required');

    ['husband_eid_front', 'husband_eid_back', 'husband_salary'].forEach(id => {
      const element = document.getElementById(id);
      element.setAttribute('required', 'false'); // Ensure attachments are required
      element.removeAttribute('required')

    });

    ['wife_eid_front', 'wife_eid_back', 'death_certificate'].forEach(id => {
      const element = document.getElementById(id);
      element.setAttribute('required', 'true'); // Ensure attachments are required
    });

  }

  else if (maritalStatus === 'divorced') {
    husbandFields.forEach(field => {
      field.style.display = 'none'; // Hide entire container
      field.setAttribute('required', 'false');
      field.removeAttribute('required')
    });

    husbandFieldsrequired.forEach(field => {
      field.setAttribute('required', 'false');
      field.removeAttribute('required')
    });
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
    document.querySelector("label[for='wife_eid_front']").textContent = 'Your  Emirates ID (Front)'
    document.querySelector("label[for='wife_eid_back']").textContent = 'Your Emirates ID (Back)'
    document.querySelector("label[for='wife_salary']").textContent = 'Your Salary Certificate'


    document.getElementById('wifeName').placeholder = 'Enter your full name';
    document.getElementById('wifePhoneNumber').placeholder = '05XXXXXXX';
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
    document.getElementById('divorce_certificate').closest('div').classList.remove('hidden');
    document.getElementById('death_certificate').closest('div').classList.add('hidden');
    document.getElementById('wifeSalary').removeAttribute('required');
    document.getElementById('wife_salary').removeAttribute('required');


    ['husband_eid_front', 'husband_eid_back', 'husband_salary'].forEach(id => {
      const element = document.getElementById(id);
      element.setAttribute('required', 'false');
      element.removeAttribute('required')
    });

    ['wife_eid_front', 'wife_eid_back', 'divorce_certificate'].forEach(id => {
      const element = document.getElementById(id);
      element.setAttribute('required', 'true'); // Ensure attachments are required
    });
  }

// Function to add a red asterisk (*) after the label text
  function addRedAsterisk(labelId) {
    const label = document.getElementById(labelId);
    if (label && !label.querySelector('.required-star')) {  // Prevent duplicates
      label.innerHTML += `<span class="required-star" style="color: red;"> *</span>`;
    }
  }

  if (maritalStatus === 'married') {
    // Add red asterisk to wife-related required fields
    ['wifeNameLabel', 'wifePhoneNumberLabel', 'wifeEmailLabel', 'wifeEmiratesIDLabel',
      'wifeExpiryDateLabel'].forEach(addRedAsterisk);

    // Add red asterisk to required file uploads
    ["wife_eid_front", "wife_eid_back", "husband_eid_front", "husband_eid_back", "husband_salary"].forEach(id => {
      document.querySelector(`label[for='${id}']`).innerHTML += `<span class="required-star" style="color: red;"> *</span>`;
    });
  }

  else if (maritalStatus === 'widowed') {
    // Add red asterisk to personal required fields
    ['wifeNameLabel', 'wifePhoneNumberLabel', 'wifeEmailLabel', 'wifeEmiratesIDLabel',
      'wifeExpiryDateLabel'].forEach(addRedAsterisk);

    // Add red asterisk to widow-specific required file uploads
    ["wife_eid_front", "wife_eid_back", "death_certificate"].forEach(id => {
      document.querySelector(`label[for='${id}']`).innerHTML += `<span class="required-star" style="color: red;"> *</span>`;
    });
  }

  else if (maritalStatus === 'divorced') {
    // Add red asterisk to personal required fields
    ['wifeNameLabel', 'wifePhoneNumberLabel', 'wifeEmailLabel', 'wifeEmiratesIDLabel',
      'wifeExpiryDateLabel'].forEach(addRedAsterisk);

    // Add red asterisk to divorce-specific required file uploads
    ["wife_eid_front", "wife_eid_back", "divorce_certificate"].forEach(id => {
      document.querySelector(`label[for='${id}']`).innerHTML += `<span class="required-star" style="color: red;"> *</span>`;
    });
  }

}


function validateZakat() {
  const zakatFund = document.querySelector('input[name="zakatFund"]:checked');
  const zakatMessage = document.querySelector('#zakatMessage');
  const nationalitySelection = document.querySelector('#nationalitySelection');
  const formContent = document.querySelector('#content'); // Hide the entire form

  if (!zakatFund) {
    alert("Please select whether you are part of the Zakat fund.");
    return;
  }

  if (zakatFund.value === 'yes') {
    zakatMessage.style.display = 'none'; // Hide error message
    nationalitySelection.style.display = 'block'; // Show nationality selection
    document.querySelector('#zakatSelection').style.display = 'none'; // Hide Zakat question
  } else {
    document.querySelector('#zakatSelection').style.display = 'none'; // Hide Zakat question
    zakatMessage.style.display = 'block'; // Show error message
    nationalitySelection.style.display = 'none'; // Hide nationality selection
    formContent.style.display = 'none'; // Hide form content
  }
}

function validateNationality() {
  const nationality = document.getElementById('countryDropdown').value; // Get selected value
  const formContent = document.querySelector('#content');

  if (!nationality) {
    alert("Please select your nationality.");
    return;
  }
  formContent.style.display = 'block'; // Show form
  document.querySelector('#nationalitySelection').style.display = 'none'; // Hide nationality selection

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

function populateCountries() {
  fetch("./countries.json")  // Assuming 'countries.json' is in the same directory
    .then(response => response.json())
    .then(countries => {
      const dropdown = document.getElementById("countryDropdown");

      // Sort countries alphabetically by name
      const sortedCountries = countries.sort((a, b) => a.name.localeCompare(b.name));

      sortedCountries.forEach(country => {
        const option = document.createElement("option");
        option.value = country.code;  // Use country code as the value
        option.textContent = `${country.name} (${country.code})`;  // Display country name with code
        dropdown.appendChild(option);
      });
    })
    .catch(error => console.error("Error loading countries:", error));
}

populateCountries()
function formatEmiratesID(element) {
  const input = document.getElementById(element);
  let value = input.value.replace(/\D/g, ''); // Remove any non-digit characters
  let formattedValue = '';

  // Add dashes at appropriate positions
  for (let i = 0; i < value.length; i++) {
    if (i === 3 || i === 7 || i === 14) { // Add dash after 3rd, 7th, and 14th digits
      formattedValue += '-';
    }
    formattedValue += value[i];
  }

  input.value = formattedValue.slice(0, 19); // Limit the length to 19 characters
}

function isNumberKey(event) {
  // Allow only numbers (0-9) and control keys (Backspace, Delete, Arrow keys)
  if (event.key >= "0" && event.key <= "9") {
    return true;
  }
  if (event.key === "Backspace" || event.key === "Delete" || event.key === "ArrowLeft" || event.key === "ArrowRight") {
    return true;
  }
  return false; // Block everything else
}

