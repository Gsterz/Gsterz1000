// ======================================
// SVS Dashboard V0.2
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    // ======================================
    // Config
    // ======================================

    const config = {

        state1: "",
        state2: ""

    }

    document.getElementById("state1Header").textContent = config.state1
    document.getElementById("state2Header").textContent = config.state2

    document.getElementById("state1Title").textContent =
        "◎ " + config.state1

    document.getElementById("state2Title").textContent =
        "◎ " + config.state2


    // ======================================
    // Sheet js Data
    // ======================================

//    let members = [];

    //======================================
    // UTC Clock
    // ======================================

    let utcTimer = null;
    let refreshTimer = null;

    function updateUTC(){

        const now = new Date()

        document.getElementById("utcClock").textContent =
            now.getUTCHours().toString().padStart(2,"0") + ":" +
            now.getUTCMinutes().toString().padStart(2,"0") + ":" +
            now.getUTCSeconds().toString().padStart(2,"0")

    }

  async function refreshDashboard(){

    await loadSettings();

    members = await loadMembers();

    config.state1 = settings.state1;
    config.state2 = settings.state2;

    document.getElementById("state1Header").textContent = config.state1;
document.getElementById("state2Header").textContent = config.state2;

document.getElementById("state1Title").textContent =
    "◎ " + config.state1;

document.getElementById("state2Title").textContent =
    "◎ " + config.state2;

    PET_DURATION = Number(settings.petDuration);

    updateUTC();

    renderMembers();

    renderServerSummary();

    renderAllianceSummary();

}

async function startClock(){

    if(utcTimer) return;

    await refreshDashboard();

    utcTimer = setInterval(updateUTC,1000);

    refreshTimer = setInterval(refreshDashboard,5000);

}

function stopClock(){

    clearInterval(utcTimer);
    clearInterval(refreshTimer);

    utcTimer = null;
    refreshTimer = null;

}

    document.getElementById("startButton")
        .addEventListener("click",startClock)

    document.getElementById("stopButton")
        .addEventListener("click",stopClock)


    // ======================================
    // Utils
    // ======================================

let PET_DURATION = 7200; // 나중엔 Setting 시트에서 읽기

function formatRemain(member){

    if(member.pet !== "ON")
        return "-";

    if(!member.petStartTime)
        return "-";

    const now = new Date();

    const start = new Date(member.petStartTime);

    const remainSec =
        PET_DURATION -
        Math.floor((now - start) / 1000);

    if(remainSec <= 0)
        return "0분";

    const h = Math.floor(remainSec / 3600);
    const m = Math.floor((remainSec % 3600) / 60);

    if(h > 0)
        return `${h}시간 ${m}분`;

    return `${m}분`;
}


function getDisplayPet(member){

    if(member.pet !== "ON")
        return member.pet;

    if(!member.petStartTime)
        return "OFF";

    const start = new Date(member.petStartTime);
    const now = new Date();

    const remain =
        PET_DURATION -
        Math.floor((now - start) / 1000);

    if(remain <= 0)
        return "OFF";

    return "ON";
}

function petClass(status){

    if(status=="ON") return "petOn"

    if(status=="OFF") return "petOff"

    return "petReady"

}
  

    function attendIcon(value){

        return value
            ? '<span class="attend">✔</span>'
            : '<span class="absent">✖</span>'

    }


    // ======================================
    // Member Table
    // ======================================

function renderMembers() {

    const tbody1 = document.getElementById("memberTable1Body");
    const tbody2 = document.getElementById("memberTable2Body");

    tbody1.innerHTML = "";
    tbody2.innerHTML = "";

    // 서버별 + 펫투력 높은순 정렬
    const state1Members = members
        .filter(m => m.state === config.state1)
        .sort((a, b) => b.petPower - a.petPower);

    const state2Members = members
        .filter(m => m.state === config.state2)
        .sort((a, b) => Number(b.petPower) - Number(a.petPower))

    // 서버1 출력
    state1Members.forEach(member => {

        tbody1.innerHTML += `
        <tr>

            <td>${member.alliance}</td>

            <td>${member.id}</td>

<td class="${petClass(getDisplayPet(member))}">
    ${getDisplayPet(member)}
</td>

            <td>${formatRemain(member)}</td>

            <td>${member.planet}</td>

            <td>${member.core}</td>

            <td>${member.petPower}</td>

            <td>${attendIcon(member.attend)}</td>

            <td>${member.note}</td>

        </tr>
        `;

    });

    // 서버2 출력
    state2Members.forEach(member => {

        tbody2.innerHTML += `
        <tr>

            <td>${member.alliance}</td>

            <td>${member.id}</td>

<td class="${petClass(getDisplayPet(member))}">
    ${getDisplayPet(member)}
</td>

          <td>${formatRemain(member)}</td>

            <td>${member.planet}</td>

            <td>${member.core}</td>

            <td>${member.petPower}</td>

            <td>${attendIcon(member.attend)}</td>

            <td>${member.note}</td>

        </tr>
        `;

    });

    // 제목
    document.getElementById("memberState1Title").textContent =
        `◎ ${config.state1} (${state1Members.length}명)`;

    document.getElementById("memberState2Title").textContent =
        `◎ ${config.state2} (${state2Members.length}명)`;

    document.getElementById("memberCount").textContent =
        members.length;
}

    // ======================================
    // Server Summary
    // ======================================

function renderServerSummary() {

    const tbody = document.getElementById("serverSummaryBody");

    // 서버별 통계
    const summary = {};

    [config.state1, config.state2].forEach(state => {

        summary[state] = {
            rally: 0,
            on: 0,
            off: 0,
            ready: 0
        };

    });

    // members 데이터 계산
    members.forEach(member => {

        const s = summary[member.state];

        if (!s) return;

        // 참여자 = 집결장
        if (member.attend)
            s.rally++;

        // 펫 상태
switch(getDisplayPet(member)){

    case "ON":
        s.on++;
        break;

    case "OFF":
        s.off++;
        break;

    case "READY":
        s.ready++;
        break;
}

    });

    // 화면 출력
    tbody.innerHTML = `
        <tr>
            <td>집결장</td>
            <td class="number">${summary[config.state1].rally}</td>
            <td class="number">${summary[config.state2].rally}</td>
        </tr>

        <tr>
            <td>펫ON</td>
            <td class="number petOn">${summary[config.state1].on}</td>
            <td class="number petOn">${summary[config.state2].on}</td>
        </tr>

        <tr>
            <td>펫OFF</td>
            <td class="number petOff">${summary[config.state1].off}</td>
            <td class="number petOff">${summary[config.state2].off}</td>
        </tr>

        <tr>
            <td>잔여</td>
            <td class="number petReady">${summary[config.state1].ready}</td>
            <td class="number petReady">${summary[config.state2].ready}</td>
        </tr>
    `;

}


    // ======================================
    // Alliance Summary
    // ======================================

// ======================================
// Alliance Summary
// ======================================

function renderAllianceSummary() {

    const tbody1 = document.getElementById("alliance1Body");
    const tbody2 = document.getElementById("alliance2Body");

    tbody1.innerHTML = "";
    tbody2.innerHTML = "";

    // -----------------------
    // 서버별 연맹 통계 생성
    // -----------------------

    const summary = {};

    members.forEach(member => {

        if (!summary[member.state])
            summary[member.state] = {};

        if (!summary[member.state][member.alliance]) {

            summary[member.state][member.alliance] = {

                rally:0,
                on:0,
                off:0,
                ready:0

            };

        }

        const a = summary[member.state][member.alliance];

        if(member.attend)
            a.rally++;

        switch(getDisplayPet(member)){

    case "ON":
        a.on++;
        break;

    case "OFF":
        a.off++;
        break;

    case "READY":
        a.ready++;
        break;
}

    });

    // -----------------------
    // 1690 출력
    // -----------------------

    if(summary[config.state1]){

        Object.entries(summary[config.state1]).forEach(([alliance,data])=>{

            tbody1.innerHTML += `

            <tr>

                <td>${alliance}</td>

                <td class="number">${data.rally}</td>

                <td class="number petOn">${data.on}</td>

                <td class="number petOff">${data.off}</td>

                <td class="number petReady">${data.ready}</td>

            </tr>

            `;

        });

    }

    // -----------------------
    // 상대맹 출력
    // -----------------------

    if(summary[config.state2]){

        Object.entries(summary[config.state2]).forEach(([alliance,data])=>{

            tbody2.innerHTML += `

            <tr>

                <td>${alliance}</td>

                <td class="number">${data.rally}</td>

                <td class="number petOn">${data.on}</td>

                <td class="number petOff">${data.off}</td>

                <td class="number petReady">${data.ready}</td>

            </tr>

            `;

        });

    }

}

    // ======================================
    // Init
    // ======================================

    (async () => {

    await refreshDashboard();

})();

})