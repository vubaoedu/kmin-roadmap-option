import subjects from "../data/subjects.json" assert { type: "json" };
import roadmaps from "../data/roadmaps.json" assert { type: "json" };

const discount1 = 10;
const discount2 = 27;

subjects.forEach((element) => {
  element.tuition -= (discount1 / 100) * element.tuition;
});

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function renderDataToTable(data, showedColumn, headerName, filter) {
  if (data.length == 0) return null;

  if (!headerName) {
    headerName = showedColumn;
  }

  const table = document.createElement("table");
  table.className = "table table-striped";

  const thead = document.createElement("thead");
  table.appendChild(thead);

  const tr = document.createElement("tr");
  thead.appendChild(tr);
  for (const cell in data[0]) {
    const indexOfCell = showedColumn.indexOf(cell);
    if (indexOfCell >= 0) {
      const th = document.createElement("th");
      th.innerText = headerName[indexOfCell];
      tr.appendChild(th);
    }
  }

  const tbody = document.createElement("tbody");
  table.appendChild(tbody);
  for (const row of data) {
    const tr = document.createElement("tr");
    for (const cell in row) {
      if (showedColumn.includes(cell)) {
        const td = document.createElement("td");
        td.innerText = row[cell];
        tr.appendChild(td);
      }
    }
    tbody.appendChild(tr);
  }

  return table;
}
function filterBy(data, prop, values) {
  const dataFiltered = [];
  for (const value of values) {
    for (const subject of subjects) {
      if (value == subject[prop]) {
        dataFiltered.push(subject);
      }
    }
  }
  return dataFiltered;
}
function getRoadmapDetail(code) {
  const index = roadmaps.findIndex((item) => item.code == code);
  const subject_list = roadmaps[index].subject_list.split(", ");
  console.log(subject_list);
  const subjectsInRoadmap = filterBy(subjects, "code", subject_list);
  return subjectsInRoadmap;
}

function renderRoadmaps() {
  const divAccordion = document.getElementsByClassName("accordion")[0];
  const sampleAccordionItem =
    document.getElementsByClassName("accordion-item")[0];
  // console.log(roadmaps);
  for (const roadmap of roadmaps) {
    let newAccordionItem = sampleAccordionItem.cloneNode(true);
    const id = "collapse" + roadmap.id;
    // console.log(newAccordionItem);
    newAccordionItem.children[0].children[0].setAttribute(
      "data-bs-target",
      "#" + id
    );
    newAccordionItem.children[0].children[0].setAttribute("aria-controls", id);
    newAccordionItem.children[0].children[0].innerText =
      roadmap.code + " - " + roadmap.name;
    newAccordionItem.children[1].id = id;
    const subjectsInRoadmap = getRoadmapDetail(roadmap.code);
    console.log(roadmap.code, subjectsInRoadmap);
    const subjectsInRoadmapRendered = renderDataToTable(
      subjectsInRoadmap,
      ["code", "name", "weeks", "tuition"],
      ["Mã môn học", "Tên môn học", "Thời lượng (tuần)", "Học phí"]
    );
    newAccordionItem.children[1].children[0].appendChild(
      subjectsInRoadmapRendered
    );

    // Create p element to show tuition of courses
    const divSummary = document.createElement("div");
    const tuition = subjectsInRoadmap.reduce(
      (sumTuition, subject) => sumTuition + subject.tuition,
      0
    );

    const weeks = subjectsInRoadmap.reduce(
      (sumWeeks, subject) => sumWeeks + subject.weeks,
      0
    );

    divSummary.innerHTML =
      "<p>- Tổng thời lượng: <strong>" +
      weeks +
      "</strong></p>" +
      "<p>- Học phí gốc: <strong>" +
      numberWithCommas(tuition) +
      "</strong></p>" +
      "<p>- Được giảm: <strong>" +
      numberWithCommas(discount2) +
      "%</strong></p>" +
      "<p>- Học phí sau giảm: <strong>" +
      numberWithCommas(tuition - (discount2 / 100) * tuition) +
      "</strong></p>" +
      "<p>- Tiết kiệm: <strong>" +
      numberWithCommas((discount2 / 100) * tuition) +
      "</strong></p>";
    newAccordionItem.children[1].children[0].appendChild(divSummary);
    divAccordion.appendChild(newAccordionItem);
  }
  divAccordion.children[0].remove();
  // divAccordion.children[0].children[1].classList.add('show');
  return divAccordion;
}

function main() {
  const table = renderDataToTable(
    subjects,
    ["code", "name", "weeks", "tuition"],
    ["Mã môn học", "Tên môn học", "Thời lượng (tuần)", "Học phí"]
  );
  const divSubjects = document.getElementById("subjects");
  divSubjects.appendChild(table);
  divSubjects.appendChild(renderRoadmaps());
}

main();
