// =======================================================
// IMPERIAL PET CARE - SIMULADOR & AGENDAMENTO WHATSAPP
// =======================================================

// Substitua pelo número do WhatsApp com DDD
const WHATSAPP_PHONE = '5511999999999';

// Captura de elementos
const bookingForm = document.getElementById('booking-form');
const petSizeSelect = document.getElementById('pet-size');
const serviceCheckboxes = document.querySelectorAll('input[name="servico"]');
const totalPriceEl = document.getElementById('total-price');

// Função de cálculo em tempo real
function calculateTotal() {
    if (!petSizeSelect || !totalPriceEl) return 0;

    const selectedOption = petSizeSelect.options[petSizeSelect.selectedIndex];
    const multiplier = parseFloat(selectedOption?.getAttribute('data-multiplier')) || 1;

    let subtotal = 0;

    serviceCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const basePrice = parseFloat(checkbox.getAttribute('data-base-price')) || 0;
            
            // "Leva e Traz" é taxa fixa
            if (checkbox.id === 'check-delivery') {
                subtotal += basePrice;
            } else {
                subtotal += (basePrice * multiplier);
            }
        }
    });

    totalPriceEl.textContent = subtotal.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    return subtotal;
}

if (petSizeSelect) petSizeSelect.addEventListener('change', calculateTotal);
serviceCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', calculateTotal);
});

if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const petName = document.getElementById('pet-name').value.trim();
        const tutorName = document.getElementById('tutor-name').value.trim();
        const petType = document.getElementById('pet-type').value;
        const petSizeText = petSizeSelect.options[petSizeSelect.selectedIndex].text;

        const selectedServices = [];
        serviceCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedServices.push(checkbox.value);
            }
        });

        if (selectedServices.length === 0) {
            alert('Por favor, selecione pelo menos um serviço para agendar!');
            return;
        }

        const totalValue = calculateTotal().toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        const message = 
`👑 *Novo Agendamento - Imperial Pet Care* 🐾

Olá! Gostaria de agendar os cuidados para o meu pet:

👤 *Tutor:* ${tutorName}
🐶 *Pet:* ${petName} (${petType} - ${petSizeText})

✂️ *Serviços Selecionados:*
${selectedServices.map(s => ` • ${s}`).join('\n')}

💰 *Estimativa de Valor:* ${totalValue}

Gostaria de verificar as datas e horários disponíveis na agenda!`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
    });
}

calculateTotal();