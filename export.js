import { SUBJECTS, courseLabel } from './engine.js?v=20260910-ui2';

function node(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

export function resultFilename(model) {
  const clean = value => value.replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_');
  return `수강신청결과_${model.year}학년도입학생_${clean(model.student.id)}_${clean(model.student.name)}.png`;
}

export function buildResultSheet(model) {
  const sheet = node('section', 'export-sheet');
  sheet.setAttribute('aria-hidden', 'true');
  sheet.appendChild(node('h2', '', `오류고등학교 ${model.year}학년도 입학생 수강신청 결과`));
  sheet.appendChild(node('p', '', `학번: ${model.student.id} / 이름: ${model.student.name} / 희망학과(계열): ${model.student.major || '미입력'}`));

  const summary = node('div', 'export-summary');
  summary.appendChild(node('h3', '', '영역별 이수 학점 합계'));
  const table = node('table', 'export-credit-table');
  const thead = node('thead');
  const headerRow = node('tr');
  ['영역', '1학년', '2·3학년', '합계'].forEach(label => {
    const cell = node('th', '', label);
    cell.scope = 'col';
    headerRow.appendChild(cell);
  });
  thead.appendChild(headerRow);
  const tbody = node('tbody');
  model.creditBreakdown.forEach(row => {
    const tr = node('tr');
    const label = node('th', '', row.label);
    label.scope = 'row';
    tr.appendChild(label);
    tr.appendChild(node('td', '', row.firstYear === null ? '미반영' : `${row.firstYear}학점`));
    tr.appendChild(node('td', '', `${row.upperYears}학점`));
    tr.appendChild(node('td', 'credit-total', `${row.total}학점${row.firstYear === null ? ' (2·3학년)' : ''}`));
    tbody.appendChild(tr);
  });
  table.append(thead, tbody);
  summary.appendChild(table);
  const omitted = model.creditBreakdown.filter(row => row.firstYear === null).map(row => row.label);
  if (omitted.length) summary.appendChild(node('p', 'export-note', `※ ${omitted.join('·')}은 1학년 이수분이 반영되지 않은 2·3학년 합계입니다.`));
  summary.appendChild(node('p', '', `국어·수학·영어 합계(1학년 포함): ${model.totals.core} / ${model.rules.coreLimit}학점 이하  |  제2외국어·정보·교양 합계(1학년 포함): ${model.totals.others} / ${model.rules.otherMinimum}학점 이상`));
  summary.appendChild(node('p', 'export-note', `※ 1학년 국어·수학·영어는 공통과목 이수분, 제2외국어·정보·교양은 정보 또는 한문 ${model.rules.firstYearOthers}학점 포함. 일반·진로·융합 모두 합산.`));
  const { society, science } = model.rules.firstYearSubjects;
  const scienceLab = model.rules.firstYearScienceLab;
  if (society !== undefined && science !== undefined && scienceLab !== undefined) {
    summary.appendChild(node('p', 'export-note', `※ 1학년 사회: 통합사회1·2 ${society}학점. 과학: 통합과학1·2 ${science - scienceLab}학점 + 과학탐구실험1·2 ${scienceLab}학점(학기당 ${scienceLab / 2}학점), 총 ${science}학점.`));
  }
  sheet.appendChild(summary);

  const legend = node('div', 'export-legend');
  SUBJECTS.forEach(subject => legend.appendChild(node('span', `course-${subject.id}`, subject.label)));
  legend.appendChild(node('span', '', '일: 일반 / 진: 진로 / 융: 융합'));
  sheet.appendChild(legend);

  const semesters = node('div', 'export-semesters');
  model.semesters.forEach(semester => {
    const box = node('div', 'export-semester');
    box.appendChild(node('h3', '', `${semester.label} · ${semester.credits}학점`));
    for (const [label, courses] of [['필수 과목', semester.fixed], ['선택 과목', semester.selected], ['미선택 과목', semester.unselected]]) {
      if (!courses.length) continue;
      box.appendChild(node('h4', '', label));
      courses.forEach(course => box.appendChild(node('p', `export-course course-${course.domain}`, courseLabel(course))));
    }
    semesters.appendChild(box);
  });
  sheet.appendChild(semesters);
  sheet.appendChild(node('p', 'export-footer', '폐강 과목은 미선택 목록에서 제외됩니다. · made by 김민범&이현우선생님'));
  return sheet;
}

export async function saveResultImage(model) {
  if (typeof window.html2canvas !== 'function') {
    throw new Error('이미지 저장 기능을 불러오지 못했습니다. 인터넷 연결을 확인한 뒤 새로고침해 주세요.');
  }
  const sheet = buildResultSheet(model);
  document.body.appendChild(sheet);
  try {
    if (document.fonts?.ready) await document.fonts.ready;
    const canvas = await window.html2canvas(sheet, { backgroundColor: '#ffffff', scale: 1.5, logging: false, windowWidth: 1280 });
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error('이미지 파일을 만들지 못했습니다. 다시 시도해 주세요.');
    const url = URL.createObjectURL(blob);
    const link = node('a');
    link.href = url;
    link.download = resultFilename(model);
    document.body.appendChild(link);
    try { link.click(); } finally {
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    }
  } finally {
    sheet.remove();
  }
}
