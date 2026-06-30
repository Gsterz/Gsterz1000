// Sheet js 작성 //

// ======================================
// Google Sheet
// ======================================

const SHEET_ID = "1hYmLnpX24eu5frHfHY_lLavwbp3a9aUwqr5kUnC7lH4";
const MEMBER_SHEET = "Members";
const SETTING_SHEET = "Settings";

// 화면에서 사용할 데이터
let members = [];
let settings = {};


// ======================================
// Settings 읽기
// ======================================

async function loadSettings() {

    const url =
        `https://opensheet.elk.sh/${SHEET_ID}/${SETTING_SHEET}`;

    const data = await fetch(url).then(r => r.json());

    settings = {};

    data.forEach(row => {

        settings[row.key] = row.value;

    });

}


// ======================================
// Members 읽기
// ======================================

async function loadMembers() {

    const url =
        `https://opensheet.elk.sh/${SHEET_ID}/${MEMBER_SHEET}`;

    members = await fetch(url).then(r => r.json());

}