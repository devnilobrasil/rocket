import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

function formatarData(data) {
    // A suposição é que data é uma string no formato "yyyy-mm-dd"
    const partesData = data.split('-');
    if (partesData.length === 3) {
        const ano = partesData[0];
        const mes = partesData[1];
        const dia = partesData[2];
        return `${dia}/${mes}/${ano}`;
    } else {
        // Se o formato for diferente, ajuste conforme necessário
        return 'Data inválida';
    }
}

export async function lerDados(db) {
    const partidaRef = collection(db, "partidas");
    const dadosContainer = document.getElementById("dadosContainer");
    

    try {
        const q = query(partidaRef, orderBy("id"));
        const querySnapshot = await getDocs(q);
        

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log("Dados da partida:", data);
            let nomeTorneio = '';

            if(data.torneio){
                nomeTorneio = 'Torneio'
            } else nomeTorneio = 'Temporada'

            // Adiciona a div dataPartida acima de cada tabela
            const dataPartidaDiv = document.createElement("div");
            dataPartidaDiv.id = "data_partida";
            dataPartidaDiv.className = "data_partida";
            dataPartidaDiv.innerHTML = `
            <div class="infosTable">
            <span>Partida: ${data.id}</span>
            <span>${nomeTorneio}</span>
            </div>
            <span class="dataLerDados">${formatarData(data.data)}</span>
            `;
            dadosContainer.appendChild(dataPartidaDiv);

            // Criação do formulário e da tabela
            const form = document.createElement("form");
            form.id = "myForm";
            form.classList.add("block");

            const tabelaDados = document.createElement("table");
            tabelaDados.id = "tabelaDados";

            // Criação do cabeçalho da tabela
            const cabecalho = document.createElement("tr");
            cabecalho.innerHTML = `
                <th class="table_cabecalho">Players</th>
                <th class="table_cabecalho">Pontos</th>
                <th class="table_cabecalho">Gols</th>
                <th class="table_cabecalho">Passes</th>
                <th class="table_cabecalho">Defesas</th>
                <th class="table_cabecalho">Chutes</th>
                <th class="table_cabecalho">MVP</th>
            `;
            tabelaDados.appendChild(cabecalho);

            // Iteração sobre os jogadores e criação das linhas da tabela
            data.jogadores.forEach((jogador) => {
                const linha = document.createElement("tr");
                linha.classList.add(`table_row_${jogador.jogador}`);
                linha.innerHTML = `
                    <td class="table_name_player">${jogador.jogador}</td>
                    <td>
                        <input id="pontos_${jogador.jogador}"
                            class="table_column_points_${jogador.jogador}" 
                            type="number" oninput="limitarCaracteres(this, 4)" 
                            required value="${jogador.pontos}" readonly>
                    </td>
                    <td>
                        <input id="gols_${jogador.jogador}" 
                            class="table_column_gols_${jogador.jogador}" 
                            type="number" oninput="limitarCaracteres(this, 2)" 
                            required value="${jogador.gols}" readonly>
                    </td>
                    <td>
                        <input id="passes_${jogador.jogador}" 
                            class="table_column_passes_${jogador.jogador}" 
                            type="number" oninput="limitarCaracteres(this, 2)" 
                            required value="${jogador.passes}" readonly>
                    </td>
                    <td>
                        <input id="defesas_${jogador.jogador}" 
                            class="table_column_defesas_${jogador.jogador}" 
                            type="number" oninput="limitarCaracteres(this, 2)" 
                            required value="${jogador.defesas}" readonly>
                    </td>
                    <td>
                        <input id="chutes_${jogador.jogador}" 
                            class="table_column_chutes_${jogador.jogador}" 
                            type="number" oninput="limitarCaracteres(this, 2)" 
                            required value="${jogador.chutes}" readonly>
                    </td>
                    <td>
                        <input id="mvp_${jogador.jogador}" 
                            class="table_column_mvp_${jogador.jogador} checkDisabled" 
                            type="checkbox" ${jogador.mvp ? 'checked' : ''} >
                    </td>
                `;
                tabelaDados.appendChild(linha);
            });

            // Adiciona a tabela ao formulário
            form.appendChild(tabelaDados);

            // Criação do campo de resultado
            const resultadoPartida = document.createElement("div");
            resultadoPartida.classList.add("resultado_partida");
            resultadoPartida.innerHTML = `
                <strong for="resultado">Resultado:</strong>
                <input class="resultado_input" id="resultado_ubaki" 
                    type="number" oninput="limitarCaracteres(this, 2)" 
                    required value="${data.resultado.ubaki}" readonly >
                <strong for="x">x</strong>
                <input class="resultado_input" id="resultado_visitante" 
                    type="number" oninput="limitarCaracteres(this, 2)" 
                    required value="${data.resultado.visitante}" readonly >
            `;

            // Adiciona o campo de resultado ao formulário
            form.appendChild(resultadoPartida);

            // Adiciona o formulário ao corpo do documento
            dadosContainer.appendChild(form);
        });

    } catch (error) {
        console.error("Erro ao ler dados do Firestore:", error);
    }
}


