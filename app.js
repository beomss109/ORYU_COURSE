import data2025 from './data/2025.js';
import data2026 from './data/2026.js';
import {
  SUBJECTS, courseLabel, createDraft, getCreditTotals, getSemesterStatus,
  selectionError, validateSelection, getExportModel, selectedCourses, sortBySubject
} from './engine.js';
import { saveResultImage } from './export.js';

const admissionData = new Map([[2026, data2026], [2025, data2025]]);
const drafts = new Map(); // 탭을 열어 둔 동안만 유지하며, 학생 정보를 외부에 전송하지 않습니다.
let activeYear = null;
let saving = false;
let feedbackTimer;
const $ = id => document.getElementById(id);
const currentConfig = () => admissionData.get(activeYear);
const currentDraft = () => drafts.get(activeYear);

function node(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function feedback(message) {
  clearTimeout(feedbackTimer);
  $('feedback').textContent = message;
  $('feedback').hidden = false;
  feedbackTimer = setTimeout(() => { $('feedback').hidden = true; }, 6500);
}

function openYear(year) {
  if (saving || !admissionData.has(year)) return;
  activeYear = year;
  if (!drafts.has(year)) drafts.set(year, createDraft());
  const config = currentConfig();
  const { student } = currentDraft();
  $('studentId').value = student.id;
  $('studentName').value = student.name;
  $('studentMajor').value = student.major;
  $('active-year').textContent = `${year}학년도 입학생`;
  document.title = `오류고등학교 ${year}학년도 입학생 수강신청 시뮬레이터`;
  $('core-limit').textContent = `${config.rules.coreLimit}학점`;
  $('other-minimum').textContent = `${config.rules.otherMinimum}학점 이상`;
  const firstYearCore = Object.values(config.rules.firstYearSubjects).reduce((sum, credit) => sum + credit, 0);
  $('core-note').textContent = `※ 1학년 공통국어1·2, 공통수학1·2, 공통영어1·2 각 ${config.rules.firstYearSubjects.korean}학점, 총 ${firstYearCore}학점을 포함합니다.`;
  $('other-note').textContent = `※ 1학년 정보 또는 한문 중 한 과목 ${config.rules.firstYearOthers}학점을 포함합니다.`;
  $('summary-core-note').textContent = `※ 1학년 국어·수학·영어 ${firstYearCore}학점 + 2·3학년 필수·선택 과목 학점`;
  $('summary-others-note').textContent = `※ 1학년 정보 또는 한문 ${config.rules.firstYearOthers}학점 + 2·3학년 해당 영역 학점`;
  renderSemesters();
  updateSummary();
  $('year-picker').hidden = true;
  $('simulator').hidden = false;
  $('feedback').hidden = true;
  document.body.classList.remove('choosing-year');
  window.scrollTo(0, 0);
  $('simulator-title').focus({ preventScroll: true });
}

function courseButton(course, { fixed = false, inBasket = false } = {}) {
  const selected = currentDraft().selected.has(course.id);
  const element = node(fixed ? 'span' : 'button', `course-item course-${course.domain}${fixed ? ' fixed' : ''}${course.closed ? ' closed' : ''}`, courseLabel(course));
  if (!fixed) {
    element.type = 'button';
    element.disabled = course.closed;
    element.dataset.courseId = course.id;
    element.dataset.action = inBasket ? 'remove' : 'select';
    if (!inBasket) element.setAttribute('aria-pressed', String(selected));
    if (course.closed) {
      element.setAttribute('aria-disabled', 'true');
      element.title = '폐강 과목(선택 불가)';
      element.setAttribute('aria-label', `${courseLabel(course)} · 폐강, 선택 불가`);
    } else if (inBasket) element.setAttribute('aria-label', `${courseLabel(course)} 선택 취소`);
    else element.setAttribute('aria-label', `${courseLabel(course)} ${selected ? '선택됨' : '선택'}`);
  }
  return element;
}

function renderSemesters() {
  $('semesters').replaceChildren();
  currentConfig().semesters.forEach(semester => {
    const card = node('section', 'semester');
    card.id = `semester-${semester.id}`;
    const heading = node('h2', '', semester.label);
    heading.id = `heading-${semester.id}`;
    card.setAttribute('aria-labelledby', heading.id);
    card.appendChild(heading);
    semester.groups.forEach(group => {
      const area = node('div', 'course-area');
      area.appendChild(node('h3', 'area-title', group.label));
      const list = node('div', 'course-list');
      group.courses.forEach(course => list.appendChild(courseButton(course, { fixed: group.rule.kind === 'fixed' })));
      area.appendChild(list);
      card.appendChild(area);
    });
    const basket = node('div', 'basket');
    basket.id = `basket-${semester.id}`;
    const summary = node('p', 'semester-summary');
    summary.id = `summary-${semester.id}`;
    summary.setAttribute('role', 'status');
    card.append(basket, summary);
    $('semesters').appendChild(card);
    refreshSemester(semester);
  });
}

function refreshSemester(semester) {
  const draft = currentDraft();
  const basket = $(`basket-${semester.id}`);
  const status = getSemesterStatus(semester, draft.selected);
  const title = node('h3', 'basket-title', '내 선택과목');
  title.id = `basket-title-${semester.id}`;
  title.tabIndex = -1;
  basket.replaceChildren(title);
  const list = node('div', 'course-list');
  const selected = sortBySubject(semester.groups.filter(group => group.rule.kind !== 'fixed').flatMap(group => selectedCourses(group, draft.selected)));
  if (selected.length) selected.forEach(course => list.appendChild(courseButton(course, { inBasket: true })));
  else list.appendChild(node('p', 'basket-empty', '위에서 과목을 선택해 주세요.'));
  basket.appendChild(list);
  basket.classList.toggle('highlight-valid', status.complete);
  $(`summary-${semester.id}`).textContent = `현재 학점 총합: ${status.total} / ${semester.credits}학점${status.complete ? ' · 충족' : ''}`;
  $(`semester-${semester.id}`).querySelectorAll('[data-action="select"]').forEach(button => {
    const isSelected = draft.selected.has(button.dataset.courseId);
    button.setAttribute('aria-pressed', String(isSelected));
    if (!button.disabled) button.setAttribute('aria-label', `${button.textContent} ${isSelected ? '선택됨' : '선택'}`);
  });
}

function updateSummary() {
  const config = currentConfig();
  const draft = currentDraft();
  const totals = getCreditTotals(config, draft.selected);
  $('summary-core').textContent = `국어·수학·영어 총합(1학년 포함): ${totals.core}학점 / ${config.rules.coreLimit}학점 이하`;
  $('summary-others').textContent = `제2외국어·정보·교양 총합(1학년 포함): ${totals.others}학점 / ${config.rules.otherMinimum}학점 이상`;
  $('summary-core').classList.toggle('out-of-range', totals.core > config.rules.coreLimit);
  $('summary-others').classList.toggle('out-of-range', totals.others < config.rules.otherMinimum);
  $('summary-totals').classList.toggle('valid', totals.core <= config.rules.coreLimit && totals.others >= config.rules.otherMinimum);
  const errors = validateSelection(config, draft.selected);
  const complete = config.semesters.filter(semester => getSemesterStatus(semester, draft.selected).complete).length;
  const ready = !errors.length && !!draft.student.id.trim() && !!draft.student.name.trim();
  $('save-btn').setAttribute('aria-disabled', String(!ready || saving));
  if (saving) $('save-status').textContent = '결과 이미지를 만드는 중입니다.';
  else if (complete < config.semesters.length) $('save-status').textContent = `학기별 선택 ${complete} / ${config.semesters.length} 완료 · 모든 조건 충족 후 저장 가능`;
  else if (errors.length) $('save-status').textContent = '학기 선택 완료 · 영역별 학점 조건을 확인해 주세요.';
  else if (!ready) $('save-status').textContent = '선택 조건 충족 · 학번과 이름을 입력해 주세요.';
  else $('save-status').textContent = `${activeYear}학년도 입학생 · 저장할 준비가 되었습니다.`;
}

$('semesters').addEventListener('click', event => {
  const button = event.target.closest('button[data-course-id]');
  if (!button || saving) return;
  const courseId = button.dataset.courseId;
  const config = currentConfig();
  const draft = currentDraft();
  const semester = config.semesters.find(item => item.groups.some(group => group.courses.some(course => course.id === courseId)));
  if (!semester) return;
  const removing = button.dataset.action === 'remove';
  if (removing) draft.selected.delete(courseId);
  else {
    const error = selectionError(config, draft.selected, courseId);
    if (error) return feedback(error);
    draft.selected.add(courseId);
  }
  refreshSemester(semester);
  updateSummary();
  $('feedback').hidden = true;
  if (removing) $(`semester-${semester.id}`).querySelector(`[data-action="select"][data-course-id="${courseId}"]`)?.focus({ preventScroll: true });
});

for (const [id, field] of [['studentId', 'id'], ['studentName', 'name'], ['studentMajor', 'major']]) {
  $(id).addEventListener('input', event => {
    if (!activeYear) return;
    currentDraft().student[field] = event.target.value;
    updateSummary();
  });
}

$('change-year').addEventListener('click', () => {
  if (saving) return;
  $('simulator').hidden = true;
  $('year-picker').hidden = false;
  $('feedback').hidden = true;
  document.body.classList.add('choosing-year');
  document.title = '오류고등학교 수강신청 시뮬레이터';
  window.scrollTo(0, 0);
  $('year-options').querySelector(`[data-year="${activeYear}"]`)?.focus({ preventScroll: true });
});

$('save-btn').addEventListener('click', async () => {
  if (saving || !activeYear) return;
  const errors = validateSelection(currentConfig(), currentDraft().selected);
  if (errors.length) return feedback(errors[0]);
  if (!currentDraft().student.id.trim() || !currentDraft().student.name.trim()) {
    feedback('학번과 이름을 입력해 주세요.');
    (!currentDraft().student.id.trim() ? $('studentId') : $('studentName')).focus();
    return;
  }
  const model = getExportModel(currentConfig(), currentDraft());
  saving = true;
  $('save-btn').disabled = true;
  $('change-year').disabled = true;
  updateSummary();
  try {
    await saveResultImage(model);
    feedback('수강신청 결과 이미지 다운로드가 시작되었습니다.');
  } catch (error) {
    feedback(error.message || '이미지를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.');
  } finally {
    saving = false;
    $('save-btn').disabled = false;
    $('change-year').disabled = false;
    updateSummary();
  }
});

SUBJECTS.forEach(subject => $('legend').appendChild(node('span', `legend-item course-${subject.id}`, subject.label)));
$('legend').appendChild(node('span', 'legend-item legend-closed', '폐강(선택 불가)'));
admissionData.forEach(config => {
  const button = node('button', 'year-option', `${config.year}학년도 입학생`);
  button.type = 'button';
  button.dataset.year = config.year;
  button.addEventListener('click', () => openYear(config.year));
  $('year-options').appendChild(button);
});
$('loading-note').hidden = true;
