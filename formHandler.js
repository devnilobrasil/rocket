// formHandler.js
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";


export async function submitForm(event, db, numeroDePartidas) {
    event.preventDefault(); // Evita o comportamento padrão de envio do formulário´
    const form = document.getElementById("myForm");
    if (!form.checkValidity()) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        // Você pode adicionar lógica adicional aqui, como exibir mensagens de erro.
        return;
    }

    // Coleta os dados do formulário
    var data = document.getElementById("data").value;
    var isTorneio = document.getElementById("torneio").checked;
    var players = ["danilo", "junin", "nilo"];
    var partidaData = [];
    var resultadoUbaki = document.getElementById("resultado_ubaki1").value;
    var resultadoVisitante = document.getElementById("resultado_visitante1").value;
    let vitoria = resultadoUbaki > resultadoVisitante ? true : false;

    players.forEach(function (player) {
        var pontos = document.getElementById(`pontos_${player}`).value;
        var gols = document.getElementById(`gols_${player}`).value;
        var passes = document.getElementById(`passes_${player}`).value;
        var defesas = document.getElementById(`defesas_${player}`).value;
        var chutes = document.getElementById(`chutes_${player}`).value;
        var mvp = document.getElementById(`mvp_${player}`).checked;

        partidaData.push({
            jogador: player,
            pontos: pontos,
            gols: gols,
            passes: passes,
            defesas: defesas,
            chutes: chutes,
            mvp: mvp,
        });
    });

    // Salva os dados no Firestore
    const partidaRef = collection(db, "partidas");
    const querySnapshot = await getDocs(partidaRef);

    if (!querySnapshot.empty) {
        numeroDePartidas = querySnapshot.size;
    }

    const novaPartidaRef = collection(db, "partidas");

    try {
        // Utiliza uma Promise para garantir a sincronia
        await new Promise((resolve) => {
            resolve(++numeroDePartidas);
        });

        await addDoc(novaPartidaRef, {
            id: `${numeroDePartidas}`,
            data: data,
            torneio: isTorneio,
            jogadores: partidaData,
            resultado: {
                ubaki: resultadoUbaki,
                visitante: resultadoVisitante
            },
            vitoria: vitoria,
        })
        .then((docRef) => {
            console.log("Dados da partida salvos com ID: ", docRef.id);
            alert("Dados salvos com sucesso!");
            clearFields();
        })
        .catch((error) => {
            console.error("Erro ao salvar dados da partida: ", error);
        });
    } catch (error) {
        console.error("Erro ao salvar dados da partida: ", error);
    }
}


export function clearFields() {
    // Array de jogadores
    var players = ["danilo", "junin", "nilo"];

    // Itera sobre cada jogador e limpa os campos
    players.forEach(function (player) {
        document.getElementById(`pontos_${player}`).value = "";
        document.getElementById(`gols_${player}`).value = "";
        document.getElementById(`passes_${player}`).value = "";
        document.getElementById(`defesas_${player}`).value = "";
        document.getElementById(`chutes_${player}`).value = "";
        document.getElementById(`mvp_${player}`).checked = false;
    });

    // Limpe os campos de resultado
    document.getElementById('resultado_ubaki1').value = "";
    document.getElementById('resultado_visitante1').value = "";

    // Limpe o campo de torneio
    document.getElementById('torneio').checked = false;
}
