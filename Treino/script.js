// Função para adicionar treinos
function adicionarTreino() {
    const checkboxes = document.querySelectorAll('input[name="exercises"]:checked');
    const month = document.getElementById('month').value;

    let exercicios = {
        Peito: 0,
        Ombro: 0,
        Tríceps: 0,
        Costas: 0,
        Abdômen: 0,
        Bíceps: 0,
        Pernas: 0,
        Glúteo: 0,
        Cardio: 0
    };

    checkboxes.forEach(cb => {
        exercicios[cb.value]++;
    });

    let monthlyData = JSON.parse(localStorage.getItem('monthlyTreinos')) || [];
    let existingMonthly = monthlyData.find(item => item.month === month);

    if (existingMonthly) {
        for (let exercise in exercicios) {
            existingMonthly[exercise] += exercicios[exercise];
        }
    } else {
        monthlyData.push({ month, ...exercicios });
    }

    let totalAcademia = JSON.parse(localStorage.getItem('totalAcademia')) || {};
    totalAcademia[month] = (totalAcademia[month] || 0) + 1;

    localStorage.setItem('monthlyTreinos', JSON.stringify(monthlyData));
    localStorage.setItem('totalAcademia', JSON.stringify(totalAcademia));

    atualizarTabelas();
    atualizarProgresso();

    let checkboxesArray = document.querySelectorAll('input[type="checkbox"]');
    checkboxesArray.forEach(cb => (cb.checked = false));
}

function definirMeta() {
    const month = document.getElementById('goal-month').value;
    const goal = parseInt(document.getElementById('goal').value);

    if (!goal || goal < 1) return;

    let metas = JSON.parse(localStorage.getItem('metas')) || [];
    let existingMeta = metas.find(meta => meta.month === month);

    if (existingMeta) {
        existingMeta.goal = goal;
    } else {
        metas.push({ month, goal });
    }

    localStorage.setItem('metas', JSON.stringify(metas));
    atualizarProgresso();
}

function atualizarTabelas() {
    let monthlyData = JSON.parse(localStorage.getItem('monthlyTreinos')) || [];
    let monthlyTableBody = document.getElementById('monthly-table').querySelector('tbody');

    monthlyTableBody.innerHTML = '';

    monthlyData.forEach(item => {
        let row = `<tr><td>${item.month}</td>`;
        for (let exercise in item) {
            if (exercise !== 'month') {
                row += `<td>${item[exercise]}</td>`;
            }
        }
        row += `<td><button onclick="editarTreino('${item.month}')">Editar</button></td></tr>`;
        monthlyTableBody.innerHTML += row;
    });
}

function atualizarProgresso() {
    let metas = JSON.parse(localStorage.getItem('metas')) || [];
    let totalAcademia = JSON.parse(localStorage.getItem('totalAcademia')) || {};
    let progressoTabelaBody = document.querySelector('#progress-table tbody');

    progressoTabelaBody.innerHTML = '';

    metas.forEach(meta => {
        let idas = totalAcademia[meta.month] || 0;
        let porcentagem = meta.goal > 0 ? ((idas / meta.goal) * 100).toFixed(2) : 0;

        progressoTabelaBody.innerHTML += `
            <tr>
                <td>${meta.month}</td>
                <td>${idas}</td>
                <td>${porcentagem}%</td>
                <td>${meta.goal}</td>
            </tr>
        `;
    });
}


function editarTreino(month) {
    let monthlyData = JSON.parse(localStorage.getItem('monthlyTreinos')) || [];
    let dataToEdit = monthlyData.find(item => item.month === month);

    if (dataToEdit) {
        let editForm = document.createElement('div');
        editForm.id = `edit-${month}`;
        editForm.innerHTML = `
            <h3>Editar Treinos para ${month}</h3>
            ${Object.keys(dataToEdit)
                .filter(key => key !== 'month')
                .map(key => `
                    <label>${key}: 
                        <input type="number" id="input-${key}-${month}" value="${dataToEdit[key]}">
                    </label><br>
                `).join('')}
            <button id="save-${month}" onclick="finalizarEdicao('${month}')">Finalizar</button>
            <button onclick="atualizarTabelas()">Cancelar</button>
        `;
        document.body.appendChild(editForm);
    }
}

function finalizarEdicao(month) {
    let monthlyData = JSON.parse(localStorage.getItem('monthlyTreinos')) || [];
    let dataToEdit = monthlyData.find(item => item.month === month);

    if (dataToEdit) {
        Object.keys(dataToEdit).forEach(key => {
            if (key !== 'month') {
                let inputElement = document.getElementById(`input-${key}-${month}`);
                dataToEdit[key] = parseInt(inputElement.value);
            }
        });

        localStorage.setItem('monthlyTreinos', JSON.stringify(monthlyData));
    }

    atualizarTabelas();
    document.getElementById(`edit-${month}`).remove();
}

// Eventos
document.getElementById('add-train').addEventListener('click', adicionarTreino);
document.getElementById('set-goal').addEventListener('click', definirMeta);

// Inicialização
atualizarTabelas();
atualizarProgresso();
