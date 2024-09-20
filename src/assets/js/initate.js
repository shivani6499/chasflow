$(document).ready(function () {
    // Click event for table rows
    $(".selectable-row").on("click", function () {
      // Get the selected corporate code and name
      var selectedCode = $(this).find("td:first").text();
      var selectedName = $(this).find("td:last").text();

      // Set the values of the input fields
      $("#corporateCode").val(selectedCode);
      $("#corporateName").val(selectedName);

      // Close the modal
      $("#corporateCodeModal").modal("hide");
    });

    // Change event for entry type
    $("#entryType").on("change", function () {
      var entryType = $(this).val();
      console.log(entryType.value,'dsdsds')
      if (entryType === "recurring") {
        $("#recurringFieldsFrom").show();
        // $("#recurringFieldsTo").show();
        // $("#recurringFieldsPattern").show();
      } else { 
        $("#recurringFieldsFrom").hide();
        $("#recurringFieldsTo").hide();
        $("#recurringFieldsPattern").hide();
      }
    });
  });


  document.addEventListener('DOMContentLoaded', function() {
    // Define the account options
    const accountOptions = {
      internalAccount: [
        { value: 'internalAcc001', text: 'Internal Acc 001' },
        { value: 'internalAcc002', text: 'Internal Acc 002' }
      ],
      externalAccount: [
        { value: 'externalAcc001', text: 'External Acc 001' },
        { value: 'externalAcc002', text: 'External Acc 002' }
      ]
    };

    // Function to update the Account Number dropdown based on selected Account Type
    function updateAccountNumberOptions() {
      const accountTypeSelect = document.getElementById('accountType');
      const accountNumberSelect = document.getElementById('accountNumber');
      const selectedType = accountTypeSelect.value;

      // Clear the current options in Account Number dropdown
      accountNumberSelect.innerHTML = '<option selected>Please Select</option>';

      // Get the options for the selected Account Type
      const options = accountOptions[selectedType] || [];

      // Add the new options to the Account Number dropdown
      options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option.value;
        opt.textContent = option.text;
        accountNumberSelect.appendChild(opt);
      });
    }

    // Add event listener for changes in Account Type dropdown
    document.getElementById('accountType').addEventListener('change', updateAccountNumberOptions);
  });
  function toggleValueDate() {
    var entryType = document.getElementById('entryType').value;
    var valueDateField = document.getElementById('valueDateField');
    var recurringFields1 = document.getElementById('recurringFieldsFrom');
    var recurringFields2 = document.getElementById('recurringFieldsTo');
    var recurringFields3 = document.getElementById('recurringFieldsPattern');
    
    if (entryType === 'one-time') {
      valueDateField.style.display = 'block';
      recurringFields1.style.display = 'none';
      recurringFields2.style.display = 'none';
      recurringFields3.style.display = 'none';
    } else if (entryType === 'recurring') {
      valueDateField.style.display = 'none';
      recurringFields1.style.display = 'block';
      recurringFields2.style.display = 'block';
      recurringFields3.style.display = 'block';
    } else {
      valueDateField.style.display = 'none';
      recurringFields.style.display = 'none';
    }
  }
  document.addEventListener('DOMContentLoaded', function() {
    // Function to update "Mode" dropdown based on "Forecasting As"
    function updateModeOptions() {
      var forecastingAs = document.getElementById('forecastingAs').value;
      var modeSelect = document.getElementById('mode');
      
      // Clear current options
      modeSelect.innerHTML = '<option selected>Please Select</option>';
      
      // Define options based on the value of "Forecasting As"
      var options = [];
      if (forecastingAs === 'inwardPayment') {
        options = ['Account Deposit', 'Cash'];
      } else if (forecastingAs === 'outwardPayment') {
        options = ['Account Withdrawal', 'Cash'];
      }
      
      // Add new options to "Mode" dropdown
      options.forEach(function(option) {
        var opt = document.createElement('option');
        opt.value = option.toLowerCase().replace(/ /g, ''); // Convert to a suitable value (e.g., 'accountdeposit')
        opt.textContent = option;
        modeSelect.appendChild(opt);
      });
    }
    
    // Event listener for changes in "Forecasting As"
    document.getElementById('forecastingAs').addEventListener('change', updateModeOptions);
  });
  function updateAccountNumberOptions() {
      var accountType = document.getElementById('accountType').value;
      var accountNumberSelect = document.getElementById('accountNumber');
      
      // Clear current options
      accountNumberSelect.innerHTML = '<option selected>Please Select</option>';
      
      // Define options based on the value of "Account Type"
      var options = [];
      if (accountType === 'internalAccount') {
        options = ['Internal Acc 001', 'Internal Acc 002'];
      } else if (accountType === 'externalAccount') {
        options = ['External Acc 001', 'External Acc 002'];
      }
      
      // Add new options to "Account Number" dropdown
      options.forEach(function(option) {
        var opt = document.createElement('option');
        opt.value = option.toLowerCase().replace(/ /g, ''); // Convert to a suitable value (e.g., 'internalacc001')
        opt.textContent = option;
        accountNumberSelect.appendChild(opt);
      });
    }