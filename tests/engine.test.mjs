import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import data2025 from '../data/2025.js';
import data2026 from '../data/2026.js';
import { allCourses, courseLabel, createDraft, getCreditTotals, getSemesterStatus,
  selectionError, validateSelection, getExportModel, getAreaWarnings, getSaveWarning } from '../engine.js';
import { resultFilename } from '../export.js';

const configs = [data2025, data2026];
const golden = {
  2025: '9a3da9e78de30abf996db96e1a99374fa42de16a83749c66d65fa5fff08c2bd3',
  2026: 'fb4f73f062fc7d5becd549aff5dc49563103c0b3320d57eaddf1a725ec094028'
};
function courseAt(config, semesterId, name) {
  const result = config.semesters.find(s => s.id === semesterId).groups.flatMap(g => g.courses).find(c => c.name === name);
  assert.ok(result, `${config.year} ${semesterId} ${name}`);
  return result;
}
function select(config, draft, semester, name) {
  const course = courseAt(config, semester, name);
  assert.equal(selectionError(config, draft.selected, course.id), '', `${config.year}: ${name}`);
  draft.selected.add(course.id);
}
function completedDraft(config, mixedSecond = false, mixedFourth = true) {
  const draft = createDraft();
  draft.student = { id: '20000', name: '검증용학생', major: '테스트' };
  const choices = {
    '2-1': ['생명과학', '물리학', '일본어', '음악연주와 창작', '보건'],
    '2-2': mixedSecond ? ['데이터 과학', '화학', '법과 사회', '인간과 심리', '논리와 사고'] : ['데이터 과학', '화학', '법과 사회', '현대사회와 윤리'],
    '3-1': ['인공지능 기초', '한국지리탐구', '미적분Ⅱ', '세포와 물질대사', '인간과 철학'],
    '3-2': ['국제관계의 이해', '기후변화와 환경생태', '수학과제탐구', '심화영어독해와 작문',
      ...(mixedFourth ? ['교육의 이해', '논술'] : ['일본문화']), '음악감상과 비평']
  };
  Object.entries(choices).forEach(([semester, names]) => names.forEach(name => select(config, draft, semester, name)));
  return draft;
}

for (const config of configs) {
  test(`${config.year}: 원본 전체 과목·분류·학점·폐강·필수 설정 보존`, () => {
    const projection = config.semesters.flatMap(s => s.groups.flatMap(g => g.courses.map(c => ({
      label: courseLabel(c), domain: c.domain, closed: c.closed, fixed: g.rule.kind === 'fixed'
    }))));
    assert.equal(createHash('sha256').update(JSON.stringify(projection)).digest('hex'), golden[config.year]);
    assert.equal(new Set(allCourses(config).map(c => c.id)).size, allCourses(config).length);
    assert.deepEqual(config.semesters.map(s => s.credits), [30, 30, 28, 26]);
    assert.equal(allCourses(config).filter(c => c.closed).length, config.year === 2025 ? 3 : 6);
  });
  test(`${config.year}: 초기 합계에 1학년과 필수 과목을 정확히 한 번 반영`, () => {
    const totals = getCreditTotals(config, new Set());
    assert.deepEqual([totals.core, totals.others], [56, 4]);
    assert.deepEqual([totals.subjects.korean, totals.subjects.math, totals.subjects.english], [20, 20, 16]);
    assert.deepEqual(config.semesters.map(s => getSemesterStatus(s, new Set()).total), [14, 14, 10, 2]);
  });
  test(`${config.year}: 폐강·필수·다른 학기 중복 선택 제한`, () => {
    allCourses(config).filter(c => c.closed).forEach(c => assert.match(selectionError(config, new Set(), c.id), /폐강/));
    assert.match(selectionError(config, new Set(), config.semesters[0].groups[0].courses[0].id), /필수/);
    const draft = createDraft();
    select(config, draft, '2-1', '일본어');
    assert.match(selectionError(config, draft.selected, courseAt(config, '2-2', '일본어').id), /중복/);
    select(config, draft, '2-1', '생명과학');
    select(config, draft, '2-1', '물리학');
    assert.match(selectionError(config, draft.selected, courseAt(config, '2-1', '기하').id), /선택/);
  });
  for (const mixedSecond of [false, true]) for (const mixedFourth of [false, true]) {
    test(`${config.year}: 2-2 혼합 ${mixedSecond}, 3-2 혼합 ${mixedFourth} 선택·계산·결과 모델`, () => {
      const draft = completedDraft(config, mixedSecond, mixedFourth);
      assert.deepEqual(validateSelection(config, draft.selected), []);
      assert.deepEqual(config.semesters.map(s => getSemesterStatus(s, draft.selected)), [
        {total:30, complete:true}, {total:30, complete:true}, {total:28, complete:true}, {total:26, complete:true}
      ]);
      const result = getExportModel(config, draft);
      assert.equal(result.year, config.year);
      assert.equal(result.totals.core, 68);
      assert.equal(result.totals.others, mixedSecond ? 28 : 24);
      assert.equal(resultFilename(result), `수강신청결과_${config.year}학년도입학생_20000_검증용학생.png`);
      result.semesters.forEach(s => {
        assert.ok(s.unselected.every(c => !c.closed && !draft.selected.has(c.id)));
        assert.ok(s.selected.every(c => !c.closed));
      });
      const snapshotCount = result.semesters[0].selected.length;
      draft.selected.clear();
      assert.equal(result.semesters[0].selected.length, snapshotCount, '내보내기 모델은 이후 선택 변경에 영향받지 않음');
    });
  }
  test(`${config.year}: 81학점 이하·16학점 이상 경계`, () => {
    const draft = completedDraft(config);
    const totals = getCreditTotals(config, draft.selected);
    const atBoundary = structuredClone(config);
    atBoundary.rules.firstYearSubjects.korean += 81 - totals.core;
    atBoundary.rules.firstYearOthers += 16 - totals.others;
    assert.deepEqual(validateSelection(atBoundary, draft.selected), []);
    atBoundary.rules.firstYearSubjects.korean += 1;
    assert.ok(validateSelection(atBoundary, draft.selected).some(e => /81학점/.test(e)));
    atBoundary.rules.firstYearSubjects.korean -= 1;
    atBoundary.rules.firstYearOthers -= 1;
    assert.ok(validateSelection(atBoundary, draft.selected).some(e => /16학점/.test(e)));
  });
  test(`${config.year}: 혼합 조합 초과·학점 초과·선택 취소`, () => {
    const draft = completedDraft(config, true, true);
    assert.ok(selectionError(config, draft.selected, courseAt(config, '2-2', '여행지리').id));
    assert.ok(selectionError(config, draft.selected, courseAt(config, '3-2', '일본문화').id));
    draft.selected.delete(courseAt(config, '2-1', '생명과학').id);
    assert.equal(getSemesterStatus(config.semesters[0], draft.selected).total, 26);
    assert.equal(getSemesterStatus(config.semesters[0], draft.selected).complete, false);
    select(config, draft, '2-1', '생명과학');
    assert.deepEqual(validateSelection(config, draft.selected), []);
  });
  test(`${config.year}: 유효하지 않은 과목 ID는 저장 불가`, () => {
    const draft = completedDraft(config);
    draft.selected.add('not-in-this-year');
    assert.ok(validateSelection(config, draft.selected).some(e => /선택할 수 없는/.test(e)));
    const closed = allCourses(config).find(c => c.closed);
    draft.selected.delete('not-in-this-year');
    draft.selected.add(closed.id);
    assert.ok(validateSelection(config, draft.selected).length);
  });
  test(`${config.year}: 국수영 경고 → 기타 영역 경고 → 전부 해제`, () => {
    const draft = completedDraft(config);
    function replace(semester, oldName, newName) {
      draft.selected.delete(courseAt(config, semester, oldName).id);
      select(config, draft, semester, newName);
    }
    replace('2-1', '일본어', '기하');
    replace('2-2', '데이터 과학', '인공지능수학');
    replace('3-1', '인공지능 기초', '영미문학읽기');
    replace('2-1', '생명과학', '독서토론글쓰기');
    assert.deepEqual([getCreditTotals(config, draft.selected).core, getCreditTotals(config, draft.selected).others], [84, 12]);
    assert.deepEqual(getAreaWarnings(config, draft.selected).map(w => w.area), ['core', 'others']);
    assert.deepEqual(getSaveWarning(config, draft.selected).domains, ['korean', 'math', 'english']);
    replace('2-1', '독서토론글쓰기', '생명과학');
    assert.equal(getCreditTotals(config, draft.selected).core, 80);
    const nextWarning = getSaveWarning(config, draft.selected);
    assert.equal(nextWarning.area, 'others');
    assert.deepEqual(nextWarning.domains, ['language', 'info', 'liberal']);
    assert.match(nextWarning.message, /4학점 부족/);
    replace('2-1', '기하', '일본어');
    assert.deepEqual(getAreaWarnings(config, draft.selected), []);
    assert.equal(getSaveWarning(config, draft.selected), null);
    assert.deepEqual(validateSelection(config, draft.selected), []);
  });
  test(`${config.year}: 결과의 1학년 + 2·3학년 = 합계 대조`, () => {
    const draft = completedDraft(config);
    const model = getExportModel(config, draft);
    const byId = Object.fromEntries(model.creditBreakdown.map(row => [row.id, row]));
    ['korean', 'math', 'english'].forEach(id => {
      assert.equal(byId[id].firstYear, 8);
      assert.equal(byId[id].firstYear + byId[id].upperYears, model.totals.subjects[id]);
      assert.equal(byId[id].total, model.totals.subjects[id]);
    });
    assert.equal(byId.others.firstYear, 4);
    assert.equal(byId.others.upperYears, 20);
    assert.equal(byId.others.total, 24);
    assert.equal(byId.society.firstYear, null, '미제공 학점을 0학점으로 확정하지 않음');
    assert.equal(byId.science.firstYear, null, '미제공 학점을 0학점으로 확정하지 않음');
  });
}

test('입학년도별 선택과 학생 정보를 분리', () => {
  const drafts = new Map(configs.map(config => [config.year, createDraft()]));
  select(data2025, drafts.get(2025), '2-1', '일본어');
  drafts.get(2025).student.name = '2025검증';
  assert.equal(drafts.get(2026).selected.size, 0);
  assert.equal(drafts.get(2026).student.name, '');
  select(data2026, drafts.get(2026), '2-1', '생명과학');
  assert.ok(drafts.get(2025).selected.has(courseAt(data2025, '2-1', '일본어').id));
});

test('지역 경로·모듈 연결·화면 ID·학생 입력 안전성', () => {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const html = readFileSync(resolve(root, 'index.html'), 'utf8');
  const app = readFileSync(resolve(root, 'app.js'), 'utf8');
  const exporter = readFileSync(resolve(root, 'export.js'), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const [, id] of app.matchAll(/\$\('([^']+)'\)/g)) assert.ok(ids.includes(id), `missing element ${id}`);
  for (const filename of ['app.js', 'export.js', 'engine.js']) {
    const code = readFileSync(resolve(root, filename), 'utf8');
    for (const [, path] of code.matchAll(/from '(\.[^']+)'/g)) assert.ok(existsSync(resolve(root, path.split('?')[0])), path);
  }
  for (const [, path] of html.matchAll(/(?:src|href)="(\.[^"]+)"/g)) assert.ok(existsSync(resolve(root, path.split('?')[0])), path);
  assert.ok(!html.includes('<iframe'));
  assert.ok(!app.includes('location.href'));
  assert.ok(!app.includes('innerHTML') && !exporter.includes('innerHTML'), '학생 입력은 textContent로 렌더링');
  assert.ok(html.includes('name="viewport"'));
  assert.ok(exporter.includes('finally'));
});
