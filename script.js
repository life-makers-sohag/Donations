async function fetchData() {
  const center = document.getElementById('centerSelect').value;
  const code = document.getElementById('codeInput').value.trim();
  const resultDiv = document.getElementById('result');

  // التحقق من الحقول
  if (!center) {
    resultDiv.innerHTML = '<p class="error">يرجى اختيار المركز.</p>';
    return;
  }

  if (!code) {
    resultDiv.innerHTML = '<p class="error">يرجى إدخال الكود.</p>';
    return;
  }

  resultDiv.textContent = "جاري التحقق...";

  try {
    const apiUrl = `https://script.google.com/macros/s/AKfycbxyJObKois3fKB75luhswoXfQzjGA0E_RvJ_WzAoYIudmG2wcpo2IsGmk86YRzapemx/exec?center=${encodeURIComponent(center)}&code=${encodeURIComponent(code)}`;
    console.log('API URL:', apiUrl);

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.success) {
      const donations = data.data.slice(0); 

      // Intentions and prices
      const intentions = [
        { name: "وجبة طعام", price: 200 },
        { name: "كرتونة رمضان", price: 600 },
        { name: "وصلات مياة", price: 18000 },
        { name: "العرائس", price: 700 },
        { name: "زرع النخيل", price: 50 },
        { name: "الايتام", price: 150 },
      ];

      // Generate execution details
      const executions = intentions.map((intention, index) => {
        const executionValue = donations[index + 7]; // Values from H2 to Z2
        if (executionValue) {
          const executionCount = Math.floor(executionValue / intention.price); // Calculate execution count
          return `
           <div class="execution">
            <div class="execution-header">
              <h4>اجمالي ${intention.name} (${executionValue}) عدد التنفيذ = ${executionCount}</h4>
            </div>
            <p><strong>السعر:</strong> ${intention.price} جنيه</p>

           </div>
          `;
        }
        return '';
      }).join('');

      // Render the content
      resultDiv.innerHTML = `
        <div class="donations-card">
          <div class="donations-header">
            <h3>بيانات التبرعات الخاصه ب المتطوع</h3>
          </div>
          <div class="donations-content">
            <p><strong>الاسم:</strong> ${donations[1]}</p>
            <p><strong>إجمالي التبليغ:</strong> ${donations[2]}</p>
            <p><strong>إجمالي التوريد:</strong> ${donations[3]}</p>
            <p><strong>المتبقي:</strong> ${donations[4]}</p>
            <p><strong>السيستم:</strong> ${donations[5]}</p>
            <p><strong>المتبقي:</strong> ${donations[6]}</p>
            <p><strong>عدد التنفيذ :</strong></p>
          </div>
          <div class="executions">
            ${executions}
          </div>
        </div>
      `;
    } else {
      resultDiv.innerHTML = '<p class="error">الكود غير موجود. يرجى المحاولة مرة أخرى.</p>';
    }
  } catch (error) {
    resultDiv.innerHTML = '<p class="error">حدث خطأ أثناء جلب البيانات. يرجى المحاولة لاحقاً.</p>';
  }
}
