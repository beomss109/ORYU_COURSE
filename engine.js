// DOM과 분리한 공통 계산기. 입학년도별 데이터만 전달하면 동일한 규칙으로 계산합니다.
export const SUBJECTS = [
  { id: 'korean', label: '국어' }, { id: 'math', label: '수학' },
  { id: 'english', label: '영어' }, { id: 'society', label: '사회' },
  { id: 'science', label: '과학' }, { id: 'physical', label: '체육' },
  { id: 'art', label: '예술' }, { id: 'info', label: '정보' },
  { id: 'language', label: '제2외국어' }, { id: 'liberal', label: '교양' }
];

const CORE = ['korean', 'math', 'english'];
const OTHERS = ['language', 'info', 'liberal'];
const sumCredits = courses => courses.reduce((sum, course) => sum + course.credits, 0);
export const courseLabel = course => `${course.name}_${course.type}(${course.credits})`;
export const allCourses = config => config.semesters.flatMap(semester => semester.groups.flatMap(group => group.courses));
export const selectedCourses = (group, selected) => group.courses.filter(course => !course.closed && selected.has(course.id));
export const groupCourses = (group, selected) => group.rule.kind === 'fixed' ? group.courses : selectedCourses(group, selected);
export const sortBySubject = courses => [...courses].sort((a, b) =>
  SUBJECTS.findIndex(s => s.id === a.domain) - SUBJECTS.findIndex(s => s.id === b.domain));

export function createDraft() {
  return { selected: new Set(), student: { id: '', name: '', major: '' } };
}

export function groupMatches(group, selected, complete = false) {
  const courses = selectedCourses(group, selected);
  if (group.rule.kind === 'fixed') return true;
  if (group.rule.kind === 'count') {
    return complete ? courses.length === group.rule.count : courses.length <= group.rule.count;
  }
  const counts = {};
  courses.forEach(course => { counts[course.credits] = (counts[course.credits] || 0) + 1; });
  return group.rule.options.some(option =>
    Object.keys(counts).every(credit => counts[credit] <= (option[credit] || 0)) &&
    (!complete || Object.keys(option).every(credit => (counts[credit] || 0) === option[credit])));
}

export function getSemesterStatus(semester, selected) {
  const total = sumCredits(semester.groups.flatMap(group => groupCourses(group, selected)));
  return { total, complete: total === semester.credits && semester.groups.every(group => groupMatches(group, selected, true)) };
}

export function getCreditTotals(config, selected) {
  const totals = Object.fromEntries(SUBJECTS.map(subject => [subject.id, config.rules.firstYearSubjects[subject.id] || 0]));
  config.semesters.forEach(semester => semester.groups.forEach(group => {
    groupCourses(group, selected).forEach(course => { totals[course.domain] += course.credits; });
  }));
  return {
    subjects: totals,
    core: CORE.reduce((sum, id) => sum + totals[id], 0),
    others: config.rules.firstYearOthers + OTHERS.reduce((sum, id) => sum + totals[id], 0)
  };
}

// 저장 경고와 화면 테두리는 같은 계산 결과를 사용합니다. 과거 경고를 누적하지 않습니다.
export function getAreaWarnings(config, selected) {
  const totals = getCreditTotals(config, selected);
  const warnings = [];
  if (totals.core > config.rules.coreLimit) warnings.push({
    area: 'core', domains: CORE,
    message: `국어·수학·영어 이수 학점이 ${totals.core}학점으로, ${config.rules.coreLimit}학점을 초과했습니다.\n\n1학년 공통과목 학점이 포함된 값입니다.\n빨간 테두리로 표시된 국어·수학·영어 선택 과목을 조정해 주세요.`
  });
  if (totals.others < config.rules.otherMinimum) warnings.push({
    area: 'others', domains: OTHERS,
    message: `제2외국어·정보·교양 이수 학점이 ${totals.others}학점으로, ${config.rules.otherMinimum}학점 이상 조건에 ${config.rules.otherMinimum - totals.others}학점 부족합니다.\n\n1학년 정보 또는 한문 ${config.rules.firstYearOthers}학점이 포함된 값입니다.\n빨간 테두리로 표시된 영역에서 과목을 추가하거나 변경해 주세요.`
  });
  return warnings;
}

export function getCreditBreakdown(config, selected) {
  const totals = getCreditTotals(config, selected);
  const rows = SUBJECTS.slice(0, 5).map(subject => {
    const firstYear = config.rules.firstYearSubjects[subject.id] ?? null;
    return { id: subject.id, label: subject.label, firstYear,
      upperYears: totals.subjects[subject.id] - (firstYear ?? 0), total: totals.subjects[subject.id] };
  });
  const firstYearOtherSubjects = OTHERS.reduce((sum, id) => sum + (config.rules.firstYearSubjects[id] || 0), 0);
  const firstYearOthers = config.rules.firstYearOthers + firstYearOtherSubjects;
  rows.push({ id: 'others', label: '제2외국어·정보·교양', firstYear: firstYearOthers,
    upperYears: totals.others - firstYearOthers, total: totals.others });
  return rows;
}

export function getSaveWarning(config, selected) {
  // 영역 조건을 먼저 안내해야 학생이 관련 과목의 테두리와 경고를 함께 이해할 수 있습니다.
  const areaWarning = getAreaWarnings(config, selected)[0];
  if (areaWarning) return areaWarning;
  const errors = validateSelection(config, selected);
  return errors.length ? { area: null, domains: [], message: errors.join('\n') } : null;
}

export function selectionError(config, selected, courseId) {
  let target;
  config.semesters.forEach(semester => semester.groups.forEach(group => {
    const course = group.courses.find(item => item.id === courseId);
    if (course) target = { semester, group, course };
  }));
  if (!target) return '해당 입학년도의 과목을 찾을 수 없습니다.';
  const { semester, group, course } = target;
  if (course.closed) return '폐강 과목은 선택할 수 없습니다.';
  if (group.rule.kind === 'fixed') return '필수 과목은 자동으로 포함됩니다.';
  if (selected.has(courseId)) return '이미 선택한 과목입니다.';
  if (allCourses(config).some(item => selected.has(item.id) && item.key === course.key)) {
    return '다른 학기에서 이미 선택한 과목입니다. 중복 신청할 수 없습니다.';
  }
  const next = new Set([...selected, courseId]);
  if (!groupMatches(group, next)) return `${semester.label}: ${group.label} 조건을 확인해 주세요.`;
  if (getSemesterStatus(semester, next).total > semester.credits) {
    return `${semester.label}의 신청 가능 학점(${semester.credits}학점)을 초과합니다.`;
  }
  return '';
}

export function validateSelection(config, selected) {
  const errors = [];
  const selectable = config.semesters.flatMap(semester => semester.groups
    .filter(group => group.rule.kind !== 'fixed').flatMap(group => group.courses.filter(course => !course.closed)));
  const keys = new Set();
  for (const id of selected) {
    const course = selectable.find(item => item.id === id);
    if (!course) errors.push('현재 입학년도에서 선택할 수 없는 과목이 포함되어 있습니다.');
    else if (keys.has(course.key)) errors.push(`${course.name}: 중복 선택된 과목입니다.`);
    else keys.add(course.key);
  }
  config.semesters.forEach(semester => {
    if (!getSemesterStatus(semester, selected).complete) errors.push(`${semester.label}의 학점과 과목 선택 조건을 확인해 주세요.`);
  });
  const totals = getCreditTotals(config, selected);
  if (totals.core > config.rules.coreLimit) errors.push(`국어·수학·영어 합계는 1학년 포함 ${config.rules.coreLimit}학점 이하여야 합니다.`);
  if (totals.others < config.rules.otherMinimum) errors.push(`제2외국어·정보·교양 합계는 1학년 포함 ${config.rules.otherMinimum}학점 이상이어야 합니다.`);
  return errors;
}

export function getExportModel(config, draft) {
  return {
    year: config.year,
    student: Object.fromEntries(Object.entries(draft.student).map(([key, value]) => [key, value.trim()])),
    totals: getCreditTotals(config, draft.selected),
    creditBreakdown: getCreditBreakdown(config, draft.selected),
    rules: config.rules,
    semesters: config.semesters.map(semester => ({
      label: semester.label, credits: getSemesterStatus(semester, draft.selected).total,
      fixed: semester.groups.filter(group => group.rule.kind === 'fixed').flatMap(group => group.courses),
      selected: sortBySubject(semester.groups.filter(group => group.rule.kind !== 'fixed')
        .flatMap(group => selectedCourses(group, draft.selected))),
      unselected: sortBySubject(semester.groups.filter(group => group.rule.kind !== 'fixed')
        .flatMap(group => group.courses.filter(course => !course.closed && !draft.selected.has(course.id))))
    }))
  };
}
