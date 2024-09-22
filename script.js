document.addEventListener('DOMContentLoaded', function() {
    const qrForm = document.getElementById('qrForm');
    const qrType = document.getElementById('qrType');
    const dynamicFields = document.getElementById('dynamicFields');
    const qrCodeContainer = document.getElementById('qrCodeContainer');
    const downloadBtn = document.getElementById('downloadBtn');

    const fieldSets = {
        vcard: [
            { name: 'firstName', type: 'text', placeholder: 'First Name', required: true },
            { name: 'lastName', type: 'text', placeholder: 'Last Name', required: true },
            { name: 'company', type: 'text', placeholder: 'Company' },
            { name: 'email', type: 'email', placeholder: 'Email', required: true },
            { name: 'phone', type: 'tel', placeholder: 'Phone' }
        ],
        link: [
            { name: 'url', type: 'url', placeholder: 'URL', required: true }
        ],
        email: [
            { name: 'email', type: 'email', placeholder: 'Email', required: true },
            { name: 'subject', type: 'text', placeholder: 'Subject' },
            { name: 'body', type: 'textarea', placeholder: 'Message' }
        ],
        phone: [
            { name: 'phone', type: 'tel', placeholder: 'Phone Number', required: true }
        ],
        sms: [
            { name: 'phone', type: 'tel', placeholder: 'Phone Number', required: true },
            { name: 'message', type: 'textarea', placeholder: 'Message' }
        ],
        whatsapp: [
            { name: 'phone', type: 'tel', placeholder: 'WhatsApp Number', required: true },
            { name: 'message', type: 'textarea', placeholder: 'Message' }
        ],
        wifi: [
            { name: 'ssid', type: 'text', placeholder: 'Network Name', required: true },
            { name: 'password', type: 'password', placeholder: 'Password' },
            { name: 'encryption', type: 'select', options: ['WEP', 'WPA', 'None'], required: true }
        ]
    };

    function updateFields() {
        const selectedType = qrType.value;
        dynamicFields.innerHTML = '';
        fieldSets[selectedType].forEach(field => {
            const input = document.createElement(field.type === 'textarea' ? 'textarea' : 'input');
            input.name = field.name;
            input.placeholder = field.placeholder;
            if (field.type !== 'textarea') {
                input.type = field.type;
            }
            if (field.required) {
                input.required = true;
            }
            if (field.type === 'select') {
                input.innerHTML = field.options.map(option => `<option value="${option}">${option}</option>`).join('');
            }
            dynamicFields.appendChild(input);
        });
    }

    qrType.addEventListener('change', updateFields);
    updateFields(); // Initial field setup

    qrForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(qrForm);
        let qrData = '';

        switch (qrType.value) {
            case 'vcard':
                qrData = `BEGIN:VCARD
VERSION:3.0
N:${formData.get('lastName')};${formData.get('firstName')}
FN:${formData.get('firstName')} ${formData.get('lastName')}
ORG:${formData.get('company')}
EMAIL:${formData.get('email')}
TEL:${formData.get('phone')}
END:VCARD`;
                break;
            case 'link':
                qrData = formData.get('url');
                break;
            case 'email':
                qrData = `mailto:${formData.get('email')}?subject=${encodeURIComponent(formData.get('subject'))}&body=${encodeURIComponent(formData.get('body'))}`;
                break;
            case 'phone':
                qrData = `tel:${formData.get('phone')}`;
                break;
            case 'sms':
                qrData = `smsto:${formData.get('phone')}:${formData.get('message')}`;
                break;
            case 'whatsapp':
                qrData = `https://wa.me/${formData.get('phone')}?text=${encodeURIComponent(formData.get('message'))}`;
                break;
            case 'wifi':
                qrData = `WIFI:T:${formData.get('encryption')};S:${formData.get('ssid')};P:${formData.get('password')};;`;
                break;
        }

        qrCodeContainer.innerHTML = '';
        new QRCode(qrCodeContainer, {
            text: qrData,
            width: 256,
            height: 256,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        downloadBtn.style.display = 'inline-block';
    });

    downloadBtn.onclick = function() {
        const canvas = qrCodeContainer.querySelector('canvas');
        const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        const link = document.createElement('a');
        link.download = `QR_Code_${qrType.value}.png`;
        link.href = image;
        link.click();
    };
});

const infoBtn = document.getElementById("infoBtn");
const infoModal = document.getElementById("infoModal");
const closeBtn = document.getElementsByClassName("close")[0];

infoBtn.onclick = function() {
    infoModal.style.display = "block";
}

closeBtn.onclick = function() {
    infoModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == infoModal) {
        infoModal.style.display = "none";
    }
}