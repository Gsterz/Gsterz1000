/* ==========================================================
   GROUP MANAGER V0.2
========================================================== */


/* ==========================================================
   STORAGE KEY
========================================================== */

const STORAGE_KEY =
  "groupManagerV02";



/* ==========================================================
   DEFAULT USERS
==========================================================

   처음 실행했을 때 Available Users에
   들어있는 유저가 없습니다.

   사용자가 + 버튼으로 직접 추가합니다.
========================================================== */

const DEFAULT_USERS = [];



/* ==========================================================
   DEFAULT GROUPS
========================================================== */

const DEFAULT_GROUPS = [

  {
    id: createId(),

    name: "GROUP 1",

    alliance: "",

    users: []
  },

  {
    id: createId(),

    name: "GROUP 2",

    alliance: "",

    users: []
  }

];



/* ==========================================================
   STATE
========================================================== */

let groups = [];

let availableUsers = [];

let dragState = null;
let touchState = null;

/* Selected users + selection time */
let selectedUsers = {};


/* ==========================================================
   CREATE ID
========================================================== */

function createId() {

  return (
    Date.now().toString(36) +
    Math.random()
      .toString(36)
      .substring(2, 8)
  );

}



/* ==========================================================
   INITIALIZE
========================================================== */

function init() {

  const saved =
    localStorage.getItem(
      STORAGE_KEY
    );


  if (saved) {

    try {

      const data =
        JSON.parse(saved);


      groups =
        data.groups || [];


      availableUsers =
        data.availableUsers || [];


      selectedUsers =
        data.selectedUsers || {};

    } catch {

      loadDefaultState();

    }

  } else {

    loadDefaultState();

  }


  render();

}



/* ==========================================================
   DEFAULT STATE
========================================================== */

function loadDefaultState() {

  groups =
    DEFAULT_GROUPS.map(
      group => ({

        id: createId(),

        name: group.name,

        alliance: "",

        users: []

      })
    );


  availableUsers =
    [...DEFAULT_USERS];

  selectedUsers = {};

}



/* ==========================================================
   SAVE
========================================================== */

function save() {

  localStorage.setItem(

    STORAGE_KEY,

    JSON.stringify({

      groups,

      availableUsers,

      selectedUsers

    })

  );

}



/* ==========================================================
   RENDER
========================================================== */

function render() {

  renderGroups();

  renderAvailableUsers();

  save();

}



/* ==========================================================
   RENDER GROUPS
========================================================== */

function renderGroups() {

  const container =
    document.getElementById(
      "groupsContainer"
    );


  container.innerHTML = "";


  groups.forEach(
    group => {

      const groupBox =
        document.createElement(
          "div"
        );


      groupBox.className =
        `
        bg-white
        rounded-xl
        border
        shadow-sm
        overflow-hidden
        `;



      /* -----------------------------------------------
         HEADER
      ------------------------------------------------ */

      const header =
        document.createElement(
          "div"
        );


      header.className =
        `
        flex
        items-center
        justify-between
        gap-3
        px-4
        py-3
        bg-gray-50
        border-b
        `;



      /* Left */

      const left =
        document.createElement(
          "div"
        );


      left.className =
        `
        flex
        items-center
        gap-2
        min-w-0
        `;



      /* Group Title */

      const title =
        document.createElement(
          "div"
        );


      title.className =
        `
        font-bold
        text-base
        whitespace-nowrap
        `;


      title.textContent =
        `◉ ${group.name}`;



      /* Alliance Input */

      const allianceInput =
        document.createElement(
          "input"
        );


      allianceInput.type =
        "text";


      allianceInput.className =
        "group-name-input";


      allianceInput.placeholder =
        "YOU";


      allianceInput.value =
        group.alliance || "";


      allianceInput.setAttribute(
        "aria-label",
        "Alliance name"
      );


      allianceInput.addEventListener(
        "input",
        e => {

          group.alliance =
            e.target.value;

          save();

        }
      );


      left.appendChild(
        title
      );


      left.appendChild(
        allianceInput
      );



      /* -----------------------------------------------
         Right
      ------------------------------------------------ */

      const right =
        document.createElement(
          "div"
        );


      right.className =
        `
        flex
        items-center
        gap-3
        `;



      /* User Count */

      const count =
        document.createElement(
          "span"
        );


      count.className =
        `
        text-xs
        text-gray-500
        font-semibold
        whitespace-nowrap
        `;


      count.textContent =
        `${group.users.length} users`;



      /* Delete */

      const deleteBtn =
        document.createElement(
          "button"
        );


      deleteBtn.className =
        `
        text-xs
        text-red-500
        font-semibold
        px-2
        py-1
        rounded
        hover:bg-red-50
        active:scale-95
        `;


      deleteBtn.textContent =
        "Delete";


      deleteBtn.addEventListener(
        "click",
        () =>
          deleteGroup(
            group.id
          )
      );


      right.appendChild(
        count
      );


      right.appendChild(
        deleteBtn
      );


      header.appendChild(
        left
      );


      header.appendChild(
        right
      );



      /* -----------------------------------------------
         DROP ZONE
      ------------------------------------------------ */

      const dropZone =
        document.createElement(
          "div"
        );


      dropZone.className =
        `
        group-drop-zone
        p-4
        min-h-[110px]
        flex
        flex-wrap
        items-start
        content-start
        gap-2
        border-2
        border-transparent
        `;


      dropZone.dataset.groupId =
        group.id;



      /* Empty */

      if (
        group.users.length === 0
      ) {

        const empty =
          document.createElement(
            "div"
          );


        empty.className =
          `
          w-full
          text-center
          text-sm
          text-gray-400
          py-6
          pointer-events-none
          `;


        empty.textContent =
          "Drop users here";


        dropZone.appendChild(
          empty
        );

      }



      /* Users */

      group.users.forEach(
        user => {

          const chip =
            createUserChip(
              user,
              group.id
            );


          dropZone.appendChild(
            chip
          );

        }
      );



      setupGroupDropZone(
        dropZone
      );


      groupBox.appendChild(
        header
      );


      groupBox.appendChild(
        dropZone
      );


      container.appendChild(
        groupBox
      );

    }
  );

}



/* ==========================================================
   RENDER AVAILABLE USERS
========================================================== */

function renderAvailableUsers() {

  const container =
    document.getElementById(
      "availableUsers"
    );


  container.innerHTML = "";


  const count =
    document.getElementById(
      "availableCount"
    );


  count.textContent =
    `${availableUsers.length} available`;



  /* -----------------------------------------------
     Existing users
  ------------------------------------------------ */

  availableUsers.forEach(
    user => {

      const chip =
        createUserChip(
          user,
          "available"
        );


      container.appendChild(
        chip
      );

    }
  );



  /* -----------------------------------------------
     Plus Button
  ------------------------------------------------ */

  const addButton =
    document.createElement(
      "button"
    );


  addButton.className =
    `
    w-[42px]
    h-[38px]
    rounded-lg
    border-2
    border-dashed
    border-gray-300
    text-gray-400
    text-xl
    font-bold
    flex
    items-center
    justify-center
    hover:bg-gray-50
    active:scale-95
    `;


  addButton.textContent =
    "+";


  addButton.title =
    "Add user";


  addButton.addEventListener(
    "click",
    showNewUserInput
  );


  container.appendChild(
    addButton
  );

}



/* ==========================================================
   CREATE USER CHIP
========================================================== */

function createUserChip(
  user,
  sourceGroup
) {

  const chip =
    document.createElement(
      "div"
    );


  chip.className =
    `
    user-chip
    inline-flex
    items-center
    px-3
    py-2
    rounded-lg
    border
    bg-white
    shadow-sm
    text-sm
    font-semibold
    whitespace-nowrap
    `;


  chip.dataset.user =
    user;


  chip.dataset.sourceGroup =
    sourceGroup;


  /* -----------------------------------------------
     User Name
  ------------------------------------------------ */

  const name =
    document.createElement(
      "span"
    );


  name.className =
    "user-name";


  name.textContent =
    user;


  chip.appendChild(
    name
  );


  /* -----------------------------------------------
     Timer
  ------------------------------------------------ */

  const timer =
    document.createElement(
      "span"
    );


  timer.className =
    "user-timer";


  chip.appendChild(
    timer
  );


  /* -----------------------------------------------
     Restore selected state
  ------------------------------------------------ */

  if (
    selectedUsers[user]
  ) {

    chip.classList.add(
      "selected"
    );

    updateUserTimer(
      chip,
      user
    );

  }


  /* -----------------------------------------------
     Click = select / deselect
  ------------------------------------------------ */

  chip.addEventListener(
    "click",
    e => {

      /*
       * Ignore click after dragging
       */

      if (
        chip.dataset.wasDragged ===
        "true"
      ) {

        chip.dataset.wasDragged =
          "false";

        return;

      }


      if (
        selectedUsers[user]
      ) {

        /*
         * Deselect
         */

        delete selectedUsers[user];

        chip.classList.remove(
          "selected"
        );

        timer.textContent =
          "";

        save();

      } else {

        /*
         * Select
         */

        selectedUsers[user] =
          Date.now();

        chip.classList.add(
          "selected"
        );

        updateUserTimer(
          chip,
          user
        );

        save();

      }

    }
  );


  /* -----------------------------------------------
     Mouse
  ------------------------------------------------ */

  chip.draggable =
    true;


  chip.addEventListener(
    "dragstart",
    mouseDragStart
  );


  chip.addEventListener(
    "dragend",
    mouseDragEnd
  );


  /* -----------------------------------------------
     Touch
  ------------------------------------------------ */

  chip.addEventListener(
    "pointerdown",
    touchPointerDown
  );


  return chip;

}


/* ==========================================================
   USER TIMER
========================================================== */

function updateUserTimer(
  chip,
  user
) {

  const selectedAt =
    selectedUsers[user];


  if (!selectedAt) {

    chip.classList.remove(
      "selected"
    );

    const timer =
      chip.querySelector(
        ".user-timer"
      );

    if (timer) {
      timer.textContent = "";
    }

    return;

  }


  const elapsed =
    Date.now() -
    selectedAt;


  const TWO_HOURS =
    2 * 60 * 60 * 1000;


  /*
   * 2 hours passed
   */

  if (
    elapsed >=
    TWO_HOURS
  ) {

    delete selectedUsers[user];

    chip.classList.remove(
      "selected"
    );

    const timer =
      chip.querySelector(
        ".user-timer"
      );

    if (timer) {
      timer.textContent = "";
    }

    save();

    return;

  }


  const remaining =
    TWO_HOURS -
    elapsed;


  const remainingMinutes =
    Math.ceil(
      remaining / 60000
    );


  const timer =
    chip.querySelector(
      ".user-timer"
    );


  if (!timer)
    return;


  if (
    remainingMinutes > 60
  ) {

    timer.textContent =
      "1h+";

  } else if (
    remainingMinutes > 30
  ) {

    timer.textContent =
      "30m+";

  } else if (
    remainingMinutes > 10
  ) {

    timer.textContent =
      "10m+";

  } else {

    timer.textContent =
      "10m-";

  }

}

/* ==========================================================
   UPDATE ALL USER TIMERS
========================================================== */

function updateAllUserTimers() {

  document
    .querySelectorAll(
      ".user-chip"
    )
    .forEach(
      chip => {

        const user =
          chip.dataset.user;

        if (
          selectedUsers[user]
        ) {

          updateUserTimer(
            chip,
            user
          );

        }

      }
    );

}


/*
 * Update every 5 minutes
 */

setInterval(
  updateAllUserTimers,
  5 * 60 * 1000
);


/* ==========================================================
   MOUSE DRAG START
========================================================== */

function mouseDragStart(e) {

  const chip =
    e.currentTarget;

chip.dataset.wasDragged =
  "true";

  dragState = {

    user:
      chip.dataset.user,

    sourceGroup:
      chip.dataset.sourceGroup

  };


  chip.classList.add(
    "dragging"
  );


  e.dataTransfer.effectAllowed =
    "move";


  e.dataTransfer.setData(
    "text/plain",
    chip.dataset.user
  );

}



/* ==========================================================
   MOUSE DRAG END
========================================================== */

function mouseDragEnd(e) {

  e.currentTarget.classList.remove(
    "dragging"
  );


  clearDropHighlights();


  dragState =
    null;

}



/* ==========================================================
   GROUP DROP ZONE
========================================================== */

function setupGroupDropZone(
  zone
) {


  zone.addEventListener(
    "dragover",
    e => {

      e.preventDefault();


      zone.classList.add(
        "drag-over"
      );


      updateDropIndicator(
        zone,
        e.clientX,
        e.clientY
      );

    }
  );



  zone.addEventListener(
    "dragleave",
    e => {

      if (
        !zone.contains(
          e.relatedTarget
        )
      ) {

        zone.classList.remove(
          "drag-over"
        );

        removeDropIndicator(
          zone
        );

      }

    }
  );



  zone.addEventListener(
    "drop",
    e => {

      e.preventDefault();


      zone.classList.remove(
        "drag-over"
      );


      const user =
        e.dataTransfer.getData(
          "text/plain"
        );


      if (!user)
        return;


      const index =
        getInsertIndex(
          zone,
          e.clientX,
          e.clientY
        );


      moveUserToGroup(
        user,
        zone.dataset.groupId,
        index
      );


      removeDropIndicator(
        zone
      );

    }
  );

}



/* ==========================================================
   AVAILABLE USERS DROP ZONE
========================================================== */

function setupAvailableDropZone() {

  const zone =
    document.getElementById(
      "availableUsers"
    );


  zone.addEventListener(
    "dragover",
    e => {

      e.preventDefault();


      zone.classList.add(
        "drag-over"
      );

    }
  );


  zone.addEventListener(
    "dragleave",
    e => {

      if (
        !zone.contains(
          e.relatedTarget
        )
      ) {

        zone.classList.remove(
          "drag-over"
        );

      }

    }
  );


  zone.addEventListener(
    "drop",
    e => {

      e.preventDefault();


      zone.classList.remove(
        "drag-over"
      );


      const user =
        e.dataTransfer.getData(
          "text/plain"
        );


      if (!user)
        return;


      returnUserToAvailable(
        user
      );

    }
  );

}



/* ==========================================================
   DELETE DROP ZONE
========================================================== */

function setupDeleteDropZone() {

  const zone =
    document.getElementById(
      "availableDeleteZone"
    );


  zone.addEventListener(
    "dragover",
    e => {

      /*
       * Only allow delete if
       * source is Available Users.
       */

      if (
        dragState?.sourceGroup !==
        "available"
      ) {

        return;

      }


      e.preventDefault();


      zone.classList.add(
        "drag-over"
      );

    }
  );


  zone.addEventListener(
    "dragleave",
    () => {

      zone.classList.remove(
        "drag-over"
      );

    }
  );


  zone.addEventListener(
    "drop",
    e => {

      e.preventDefault();


      zone.classList.remove(
        "drag-over"
      );


      if (
        dragState?.sourceGroup !==
        "available"
      ) {

        return;

      }


      const user =
        e.dataTransfer.getData(
          "text/plain"
        );


      if (!user)
        return;


      deleteAvailableUser(
        user
      );

    }
  );

}



/* ==========================================================
   MOVE USER TO GROUP
========================================================== */

function moveUserToGroup(
  user,
  targetGroupId,
  insertIndex
) {


  /* -----------------------------------------------
     Remove from Available
  ------------------------------------------------ */

  availableUsers =
    availableUsers.filter(
      item =>
        item !== user
    );


  /* -----------------------------------------------
     Remove from every group
  ------------------------------------------------ */

  groups.forEach(
    group => {

      group.users =
        group.users.filter(
          item =>
            item !== user
        );

    }
  );


  /* -----------------------------------------------
     Target group
  ------------------------------------------------ */

  const targetGroup =
    groups.find(
      group =>
        group.id ===
        targetGroupId
    );


  if (!targetGroup) {

    render();

    return;

  }


  insertIndex =
    Math.max(
      0,
      Math.min(
        insertIndex ?? targetGroup.users.length,
        targetGroup.users.length
      )
    );


  targetGroup.users.splice(
    insertIndex,
    0,
    user
  );


  render();

}



/* ==========================================================
   RETURN TO AVAILABLE
========================================================== */

function returnUserToAvailable(
  user
) {


  /* -----------------------------------------------
     Remove from groups
  ------------------------------------------------ */

  groups.forEach(
    group => {

      group.users =
        group.users.filter(
          item =>
            item !== user
        );

    }
  );


  /* -----------------------------------------------
     Prevent duplicate
  ------------------------------------------------ */

  if (
    !availableUsers.includes(
      user
    )
  ) {

    availableUsers.push(
      user
    );

  }


  render();

}



/* ==========================================================
   DELETE AVAILABLE USER
========================================================== */

function deleteAvailableUser(
  user
) {

  availableUsers =
    availableUsers.filter(
      item =>
        item !== user
    );


  render();

}



/* ==========================================================
   INSERT INDEX
========================================================== */

function getInsertIndex(
  zone,
  x,
  y
) {

  const chips = [
    ...zone.querySelectorAll(
      ".user-chip:not(.dragging)"
    )
  ];


  if (
    chips.length === 0
  ) {

    return 0;

  }


  let closestIndex =
    chips.length;


  let closestDistance =
    Infinity;


  chips.forEach(
    (chip, index) => {

      const rect =
        chip.getBoundingClientRect();


      const centerX =
        rect.left +
        rect.width / 2;


      const centerY =
        rect.top +
        rect.height / 2;


      let distance;


      if (
        y >= rect.top &&
        y <= rect.bottom
      ) {

        distance =
          Math.abs(
            x - centerX
          );

      } else {

        distance =
          Math.sqrt(
            Math.pow(
              x - centerX,
              2
            ) +
            Math.pow(
              y - centerY,
              2
            )
          );

      }


      if (
        distance <
        closestDistance
      ) {

        closestDistance =
          distance;


        closestIndex =
          x < centerX
            ? index
            : index + 1;

      }

    }
  );


  return closestIndex;

}



/* ==========================================================
   DROP INDICATOR
========================================================== */

function updateDropIndicator(
  zone,
  x,
  y
) {

  removeDropIndicator(
    zone
  );


  const chips = [
    ...zone.querySelectorAll(
      ".user-chip:not(.dragging)"
    )
  ];


  if (
    chips.length === 0
  ) {

    return;

  }


  const index =
    getInsertIndex(
      zone,
      x,
      y
    );


  const indicator =
    document.createElement(
      "div"
    );


  indicator.className =
    "drop-indicator";


  indicator.dataset.dropIndicator =
    "true";


  if (
    index >= chips.length
  ) {

    zone.appendChild(
      indicator
    );

  } else {

    zone.insertBefore(
      indicator,
      chips[index]
    );

  }

}



function removeDropIndicator(
  zone
) {

  const indicator =
    zone.querySelector(
      "[data-drop-indicator]"
    );


  if (indicator) {

    indicator.remove();

  }

}



/* ==========================================================
   CLEAR DROP HIGHLIGHTS
========================================================== */

function clearDropHighlights() {

  document
    .querySelectorAll(
      ".drag-over"
    )
    .forEach(
      element => {

        element.classList.remove(
          "drag-over"
        );

      }
    );


  document
    .querySelectorAll(
      "[data-drop-indicator]"
    )
    .forEach(
      element => {

        element.remove();

      }
    );

}



/* ==========================================================
   TOUCH DRAG START
========================================================== */



function touchPointerDown(e) {

  if (e.pointerType === "mouse") {
    return;
  }

  const chip = e.currentTarget;

  touchState = {
    chip,
    pointerId: e.pointerId,
    startX: e.clientX,
    startY: e.clientY,
    dragging: false,
    preview: null
  };

  /*
   * Listen on document so the drag
   * continues even after leaving the chip.
   */
  document.addEventListener(
    "pointermove",
    touchPointerMove
  );

  document.addEventListener(
    "pointerup",
    touchPointerUp
  );

  document.addEventListener(
    "pointercancel",
    touchPointerUp
  );
}


function touchPointerMove(e) {

  if (
    !touchState ||
    e.pointerId !== touchState.pointerId
  ) {
    return;
  }

  const chip =
    touchState.chip;


  /*
   * Check movement before starting drag.
   */
  if (!touchState.dragging) {

    const dx =
      e.clientX -
      touchState.startX;

    const dy =
      e.clientY -
      touchState.startY;

    const distance =
      Math.sqrt(
        dx * dx +
        dy * dy
      );


    /*
     * Less than 8px = still a tap.
     */
    if (distance < 8) {
      return;
    }


    /*
     * Real drag starts.
     */
    touchState.dragging = true;

    chip.dataset.wasDragged =
      "true";


    const rect =
      chip.getBoundingClientRect();


    const preview =
      chip.cloneNode(true);


    preview.classList.remove(
      "user-chip"
    );

    preview.classList.add(
      "drag-preview"
    );


    preview.style.position =
      "fixed";

    preview.style.left =
      `${rect.left}px`;

    preview.style.top =
      `${rect.top}px`;

    preview.style.width =
      `${rect.width}px`;

    preview.style.pointerEvents =
      "none";

    preview.style.zIndex =
      "9999";


    document.body.appendChild(
      preview
    );


    touchState.preview =
      preview;


    chip.classList.add(
      "dragging"
    );


    dragState = {

      user:
        chip.dataset.user,

      sourceGroup:
        chip.dataset.sourceGroup,

      chip,
      preview,

      pointerId:
        e.pointerId

    };

  }


  /*
   * Prevent page scrolling
   * only after drag has started.
   */
  e.preventDefault();


  const preview =
    touchState.preview;


  if (preview) {

    preview.style.left =
      `${e.clientX -
        preview.offsetWidth / 2}px`;

    preview.style.top =
      `${e.clientY -
        preview.offsetHeight / 2}px`;

  }


  /*
   * Hide preview temporarily
   * to detect the element underneath.
   */
  if (preview) {
    preview.style.display =
      "none";
  }


  const target =
    document.elementFromPoint(
      e.clientX,
      e.clientY
    );


  if (preview) {
    preview.style.display =
      "";
  }


  clearDropHighlights();


  if (!target) {
    return;
  }


  /*
   * GROUP
   */
  const groupZone =
    target.closest(
      ".group-drop-zone"
    );


  if (groupZone) {

    groupZone.classList.add(
      "drag-over"
    );

      updateDropIndicator(
    groupZone,
    e.clientX,
    e.clientY
  );

    return;

  }


  /*
   * AVAILABLE USERS
   */
  const availableZone =
    target.closest(
      "#availableUsers"
    );


  if (availableZone) {

    availableZone.classList.add(
      "drag-over"
    );

    return;

  }


  /*
   * DELETE
   */
  const deleteZone =
    target.closest(
      "#availableDeleteZone"
    );


  if (
    deleteZone &&
    dragState?.sourceGroup ===
      "available"
  ) {

    deleteZone.classList.add(
      "drag-over"
    );

  }

}


function touchPointerUp(e) {

  if (
    !touchState ||
    e.pointerId !== touchState.pointerId
  ) {
    return;
  }


  const state =
    touchState;

  const chip =
    state.chip;


  /*
   * -----------------------------------------------
   * SIMPLE TAP
   * -----------------------------------------------
   *
   * Do nothing.
   *
   * The normal click event in
   * createUserChip() will handle
   * select / deselect.
   */
  if (!state.dragging) {

    document.removeEventListener(
      "pointermove",
      touchPointerMove
    );

    document.removeEventListener(
      "pointerup",
      touchPointerUp
    );

    document.removeEventListener(
      "pointercancel",
      touchPointerUp
    );

    touchState =
      null;

    return;

  }


  /*
   * -----------------------------------------------
   * REAL DRAG
   * -----------------------------------------------
   */

  const preview =
    state.preview;


  if (preview) {
    preview.style.display =
      "none";
  }


  const target =
    document.elementFromPoint(
      e.clientX,
      e.clientY
    );


  if (preview) {
    preview.remove();
  }


  clearDropHighlights();


  if (
    target &&
    dragState
  ) {

    /*
     * GROUP
     */
    const groupZone =
      target.closest(
        ".group-drop-zone"
      );


    if (groupZone) {

      const insertIndex =
        getInsertIndex(
          groupZone,
          e.clientX,
          e.clientY
        );


      moveUserToGroup(
        dragState.user,
        groupZone.dataset.groupId,
        insertIndex
      );

    }


    /*
     * AVAILABLE
     */
    else if (
      target.closest(
        "#availableUsers"
      )
    ) {

      returnUserToAvailable(
        dragState.user
      );

    }


    /*
     * DELETE
     */
    else if (
      target.closest(
        "#availableDeleteZone"
      )
    ) {

      if (
        dragState.sourceGroup ===
        "available"
      ) {

        deleteAvailableUser(
          dragState.user
        );

      }

    }

  }


  chip.classList.remove(
    "dragging"
  );


  document.removeEventListener(
    "pointermove",
    touchPointerMove
  );

  document.removeEventListener(
    "pointerup",
    touchPointerUp
  );

  document.removeEventListener(
    "pointercancel",
    touchPointerUp
  );


  dragState =
    null;

  touchState =
    null;

}

/* ==========================================================
   ADD GROUP
========================================================== */

document
  .getElementById(
    "addGroupBtn"
  )
  .addEventListener(
    "click",
    addGroup
  );



function addGroup() {

  const groupNumber =
    getNextGroupNumber();


  groups.push({

    id:
      createId(),

    name:
      `GROUP ${groupNumber}`,

    alliance:
      "",

    users:
      []

  });


  render();

}



/* ==========================================================
   NEXT GROUP NUMBER
========================================================== */

function getNextGroupNumber() {

  let number = 1;


  while (
    groups.some(
      group =>
        group.name ===
        `GROUP ${number}`
    )
  ) {

    number++;

  }


  return number;

}



/* ==========================================================
   DELETE GROUP
========================================================== */

function deleteGroup(
  groupId
) {

  const group =
    groups.find(
      item =>
        item.id ===
        groupId
    );


  if (!group)
    return;


  if (
    group.users.length > 0
  ) {

    const confirmed =
      confirm(
        `${group.name} contains ${group.users.length} users.\n\nDelete the group and move the users to Available Users?`
      );


    if (!confirmed)
      return;


    group.users.forEach(
      user => {

        if (
          !availableUsers.includes(
            user
          )
        ) {

          availableUsers.push(
            user
          );

        }

      }
    );

  }


  groups =
    groups.filter(
      item =>
        item.id !==
        groupId
    );


  render();

}



/* ==========================================================
   SHOW NEW USER INPUT
========================================================== */

function showNewUserInput() {

  const container =
    document.getElementById(
      "availableUsers"
    );


  /*
   * Prevent multiple input boxes
   */

  if (
    container.querySelector(
      ".new-user-input"
    )
  ) {

    return;

  }


  const input =
    document.createElement(
      "input"
    );


  input.className =
    "new-user-input";


  input.placeholder =
    "User name";


  input.autocomplete =
    "off";


  /*
   * Put input before +
   */

  const plusButton =
    container.querySelector(
      "button"
    );


  container.insertBefore(
    input,
    plusButton
  );


  input.focus();



  /* -----------------------------------------------
     Enter
  ------------------------------------------------ */

  input.addEventListener(
    "keydown",
    e => {

      if (
        e.key ===
        "Enter"
      ) {

        e.preventDefault();
        addNewUser(
          input.value
        );

      }


      if (
        e.key ===
        "Escape"
      ) {

        render();

      }

    }
  );



  /* -----------------------------------------------
     Blur
  ------------------------------------------------ */

  input.addEventListener(
    "blur",
    () => {

      if (
        input.value.trim()
      ) {

        addNewUser(
          input.value
        );

      } else {

        render();

      }

    }
  );

}



/* ==========================================================
   ADD NEW USER
========================================================== */

function addNewUser(
  name
) {

  name =
    name.trim();


  if (!name) {

    render();

    return;

  }


  /*
   * Prevent duplicate
   */

  const exists =
    availableUsers.includes(
      name
    );


  const inGroup =
    groups.some(
      group =>
        group.users.includes(
          name
        )
    );


  if (
    exists ||
    inGroup
  ) {


    return;

  }


  availableUsers.push(
    name
  );


  render();

}



/* ==========================================================
   COPY
========================================================== */

document
  .getElementById(
    "copyBtn"
  )
  .addEventListener(
    "click",
    copyGroups
  );

  function copyGroups() {

    let text = "";

    groups.forEach(
      (group, index) => {

        const alliance =
          group.alliance
            ? `[${group.alliance}]`
            : "";

        text +=
          `◉ ${group.name} ${alliance}`;

        text += "\n";

        if (
          group.users.length === 0
        ) {

          text +=
            "(empty)\n";

        } else {

          text +=
            group.users.join(", ") + "\n";

        }

        /*
         * Empty line between groups
         */

        if (
          index <
          groups.length - 1
        ) {

          text += "\n";

        }

      }
    );

    navigator.clipboard
      .writeText(text.trimEnd())
      .then(
        () => {
          showCopyFeedback();
        }
      )
      .catch(
        () => {
          fallbackCopy(text);
        }
      );

  }



/* ==========================================================
   COPY FEEDBACK
========================================================== */

function showCopyFeedback() {

  const button =
    document.getElementById(
      "copyBtn"
    );


  const original =
    button.textContent;


  button.textContent =
    "Copied!";


  button.classList.remove(
    "bg-gray-200",
    "text-gray-700"
  );


  button.classList.add(
    "bg-green-500",
    "text-white"
  );


  setTimeout(
    () => {

      button.textContent =
        original;


      button.classList.remove(
        "bg-green-500",
        "text-white"
      );


      button.classList.add(
        "bg-gray-200",
        "text-gray-700"
      );

    },
    1200
  );

}



/* ==========================================================
   FALLBACK COPY
========================================================== */

function fallbackCopy(
  text
) {

  const textarea =
    document.createElement(
      "textarea"
    );


  textarea.value =
    text;


  textarea.style.position =
    "fixed";


  textarea.style.opacity =
    "0";


  document.body.appendChild(
    textarea
  );


  textarea.select();


  try {

    document.execCommand(
      "copy"
    );


    showCopyFeedback();

  } catch {

    alert(
      text
    );

  }


  textarea.remove();

}



/* ==========================================================
   RESET
========================================================== */

document
  .getElementById(
    "resetBtn"
  )
  .addEventListener(
    "click",
    resetAll
  );



function resetAll() {

  const allUsers = [];

  // 모든 그룹의 유저를 Available Users로 이동
  groups.forEach(group => {

    allUsers.push(...group.users);

    group.users = [];

  });

  // 기존 Available Users도 유지
  availableUsers = [
    ...availableUsers,
    ...allUsers
  ];

  // 중복 제거
  availableUsers = [...new Set(availableUsers)];

  save();
  render();

}


/* ==========================================================
   AVAILABLE DROP ZONE INIT
========================================================== */

setupAvailableDropZone();

setupDeleteDropZone();



/* ==========================================================
   START
========================================================== */

init();

updateAllUserTimers();