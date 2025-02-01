document.getElementById('dataForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // Collect form data
  const formData = {
    Title: "Application - " + new Date().toISOString(), // A unique title (you can customize it)
    maritalStatus: document.getElementById('maritalStatus').value,
    fullNameHusband: document.getElementById('fullNameHusband').value,
    phoneNumberHusband: document.getElementById('phoneNumberHusband').value,
    emailHusband: document.getElementById('emailHusband').value,
    emiratesIdHusband: document.getElementById('emiratesIdHusband').value,
    expiryDateEmiratesIdHusband: document.getElementById('expiryDateEmiratesIdHusband').value,
    salaryHusband: document.getElementById('salaryHusband').value,
    fullNameWife: document.getElementById('fullNameWife').value,
    phoneNumberWife: document.getElementById('phoneNumberWife').value,
    emailWife: document.getElementById('emailWife').value,
    emiratesIdWife: document.getElementById('emiratesIdWife').value,
    expiryDateEmiratesIdWife: document.getElementById('expiryDateEmiratesIdWife').value,
    salaryWife: document.getElementById('salaryWife').value,
    emirates: document.getElementById('emirates').value,
    homeAddress: document.getElementById('homeAddress').value,
    comments: document.getElementById('comments').value,
    nationality: document.getElementById('nationality').value,
    status: document.getElementById('status').value,
    submissionDate: document.getElementById('submissionDate').value,
    attachments: []
  };

  // Optional: Handle file attachments
  const fileInput = document.getElementById('fileInput');
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onloadend = function () {
      formData.attachments.push({
        fileName: file.name,
        fileData: reader.result.split(',')[1] // Convert to base64 binary data
      });

      sendToPowerAutomate(formData); // Send data to Power Automate after processing file
    };
    reader.readAsDataURL(file);
  } else {
    sendToPowerAutomate(formData); // No file to send
  }
});

function sendToPowerAutomate(data) {
  const url = 'https://prod-15.uaecentral.logic.azure.com:443/workflows/602d33ca8ea64c7787c9c11454f70a62/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=QHvLiue9-exuonCOCG_N7vNUyzhM9eSFLmqjt89uTcs'; // Replace with your actual URL

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) // Send data to Power Automate
  })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      // Handle success (e.g., show a message to the user)
      alert('Data submitted successfully!');
    })
    .catch((error) => {
      console.error('Error:', error);
      // Handle error (e.g., show an error message)
      alert('Error submitting data!');
    });
}
