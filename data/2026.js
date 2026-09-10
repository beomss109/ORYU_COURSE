// 2026학년도 입학생 전용 과목·폐강·이수 조건. 공통 기능은 engine.js에서 관리합니다.
export default {
  "year": 2026,
  "rules": {
    "firstYearSubjects": {
      "korean": 8,
      "math": 8,
      "english": 8
    },
    "firstYearOthers": 4,
    "coreLimit": 81,
    "otherMinimum": 16
  },
  "semesters": [
    {
      "id": "2-1",
      "label": "2학년 1학기",
      "credits": 30,
      "groups": [
        {
          "id": "2-1-g0",
          "label": "필수 과목",
          "rule": {
            "kind": "fixed"
          },
          "courses": [
            {
              "id": "2-1-0-0",
              "name": "문학",
              "type": "일",
              "credits": 4,
              "domain": "korean",
              "closed": false,
              "key": "문학"
            },
            {
              "id": "2-1-0-1",
              "name": "대수",
              "type": "일",
              "credits": 4,
              "domain": "math",
              "closed": false,
              "key": "대수"
            },
            {
              "id": "2-1-0-2",
              "name": "영어Ⅰ",
              "type": "일",
              "credits": 4,
              "domain": "english",
              "closed": false,
              "key": "영어Ⅰ"
            },
            {
              "id": "2-1-0-3",
              "name": "스포츠생활1",
              "type": "융",
              "credits": 2,
              "domain": "physical",
              "closed": false,
              "key": "스포츠생활1"
            }
          ]
        },
        {
          "id": "2-1-g1",
          "label": "선택과목1 (3개 선택)",
          "rule": {
            "kind": "count",
            "count": 3
          },
          "courses": [
            {
              "id": "2-1-1-0",
              "name": "독서토론글쓰기",
              "type": "융",
              "credits": 4,
              "domain": "korean",
              "closed": false,
              "key": "독서토론글쓰기"
            },
            {
              "id": "2-1-1-1",
              "name": "기하",
              "type": "진",
              "credits": 4,
              "domain": "math",
              "closed": false,
              "key": "기하"
            },
            {
              "id": "2-1-1-2",
              "name": "미디어영어",
              "type": "융",
              "credits": 4,
              "domain": "english",
              "closed": false,
              "key": "미디어영어"
            },
            {
              "id": "2-1-1-3",
              "name": "사회와 문화",
              "type": "일",
              "credits": 4,
              "domain": "society",
              "closed": false,
              "key": "사회와문화"
            },
            {
              "id": "2-1-1-4",
              "name": "경제",
              "type": "진",
              "credits": 4,
              "domain": "society",
              "closed": false,
              "key": "경제"
            },
            {
              "id": "2-1-1-5",
              "name": "세계시민과 지리",
              "type": "일",
              "credits": 4,
              "domain": "society",
              "closed": false,
              "key": "세계시민과지리"
            },
            {
              "id": "2-1-1-6",
              "name": "역사로 탐구하는 현대 세계",
              "type": "융",
              "credits": 4,
              "domain": "society",
              "closed": true,
              "key": "역사로탐구하는현대세계"
            },
            {
              "id": "2-1-1-7",
              "name": "생명과학",
              "type": "일",
              "credits": 4,
              "domain": "science",
              "closed": false,
              "key": "생명과학"
            },
            {
              "id": "2-1-1-8",
              "name": "물리학",
              "type": "일",
              "credits": 4,
              "domain": "science",
              "closed": false,
              "key": "물리학"
            },
            {
              "id": "2-1-1-9",
              "name": "운동과건강",
              "type": "진",
              "credits": 4,
              "domain": "physical",
              "closed": false,
              "key": "운동과건강"
            },
            {
              "id": "2-1-1-10",
              "name": "중국어(온라인)",
              "type": "일",
              "credits": 4,
              "domain": "language",
              "closed": false,
              "key": "중국어"
            },
            {
              "id": "2-1-1-11",
              "name": "일본어",
              "type": "일",
              "credits": 4,
              "domain": "language",
              "closed": false,
              "key": "일본어"
            },
            {
              "id": "2-1-1-12",
              "name": "스페인어(온라인)",
              "type": "일",
              "credits": 4,
              "domain": "language",
              "closed": false,
              "key": "스페인어"
            }
          ]
        },
        {
          "id": "2-1-g2",
          "label": "선택과목2 (1개 선택)",
          "rule": {
            "kind": "count",
            "count": 1
          },
          "courses": [
            {
              "id": "2-1-2-0",
              "name": "음악연주와 창작",
              "type": "진",
              "credits": 2,
              "domain": "art",
              "closed": false,
              "key": "음악연주와창작"
            },
            {
              "id": "2-1-2-1",
              "name": "미술 창작",
              "type": "진",
              "credits": 2,
              "domain": "art",
              "closed": false,
              "key": "미술창작"
            }
          ]
        },
        {
          "id": "2-1-g3",
          "label": "선택과목3 (1개 선택)",
          "rule": {
            "kind": "count",
            "count": 1
          },
          "courses": [
            {
              "id": "2-1-3-0",
              "name": "인간과 심리",
              "type": "진",
              "credits": 2,
              "domain": "liberal",
              "closed": false,
              "key": "인간과심리"
            },
            {
              "id": "2-1-3-1",
              "name": "논리와 사고",
              "type": "진",
              "credits": 2,
              "domain": "liberal",
              "closed": true,
              "key": "논리와사고"
            },
            {
              "id": "2-1-3-2",
              "name": "보건",
              "type": "진",
              "credits": 2,
              "domain": "liberal",
              "closed": false,
              "key": "보건"
            },
            {
              "id": "2-1-3-3",
              "name": "통계와 사회",
              "type": "진",
              "credits": 2,
              "domain": "liberal",
              "closed": false,
              "key": "통계와사회"
            },
            {
              "id": "2-1-3-4",
              "name": "생태와 환경",
              "type": "일",
              "credits": 2,
              "domain": "liberal",
              "closed": true,
              "key": "생태와환경"
            },
            {
              "id": "2-1-3-5",
              "name": "호모 스토리텔리쿠스",
              "type": "융",
              "credits": 2,
              "domain": "liberal",
              "closed": true,
              "key": "호모스토리텔리쿠스"
            }
          ]
        }
      ]
    },
    {
      "id": "2-2",
      "label": "2학년 2학기",
      "credits": 30,
      "groups": [
        {
          "id": "2-2-g0",
          "label": "필수 과목",
          "rule": {
            "kind": "fixed"
          },
          "courses": [
            {
              "id": "2-2-0-0",
              "name": "화법과 언어",
              "type": "일",
              "credits": 4,
              "domain": "korean",
              "closed": false,
              "key": "화법과언어"
            },
            {
              "id": "2-2-0-1",
              "name": "미적분Ⅰ",
              "type": "일",
              "credits": 4,
              "domain": "math",
              "closed": false,
              "key": "미적분Ⅰ"
            },
            {
              "id": "2-2-0-2",
              "name": "영어Ⅱ",
              "type": "일",
              "credits": 4,
              "domain": "english",
              "closed": false,
              "key": "영어Ⅱ"
            },
            {
              "id": "2-2-0-3",
              "name": "스포츠생활2",
              "type": "융",
              "credits": 2,
              "domain": "physical",
              "closed": false,
              "key": "스포츠생활2"
            }
          ]
        },
        {
          "id": "2-2-g1",
          "label": "선택 과목 (4학점 4개 또는 4학점 3개 + 2학점 2개)",
          "rule": {
            "kind": "combinations",
            "options": [
              {
                "4": 4
              },
              {
                "2": 2,
                "4": 3
              }
            ]
          },
          "courses": [
            {
              "id": "2-2-1-0",
              "name": "주제 탐구 독서",
              "type": "진",
              "credits": 4,
              "domain": "korean",
              "closed": false,
              "key": "주제탐구독서"
            },
            {
              "id": "2-2-1-1",
              "name": "인공지능수학",
              "type": "진",
              "credits": 4,
              "domain": "math",
              "closed": false,
              "key": "인공지능수학"
            },
            {
              "id": "2-2-1-2",
              "name": "경제 수학",
              "type": "진",
              "credits": 4,
              "domain": "math",
              "closed": false,
              "key": "경제수학"
            },
            {
              "id": "2-2-1-3",
              "name": "세계문화와 영어",
              "type": "융",
              "credits": 4,
              "domain": "english",
              "closed": false,
              "key": "세계문화와영어"
            },
            {
              "id": "2-2-1-4",
              "name": "법과 사회",
              "type": "진",
              "credits": 4,
              "domain": "society",
              "closed": false,
              "key": "법과사회"
            },
            {
              "id": "2-2-1-5",
              "name": "여행지리",
              "type": "융",
              "credits": 4,
              "domain": "society",
              "closed": false,
              "key": "여행지리"
            },
            {
              "id": "2-2-1-6",
              "name": "동아시아 역사 기행",
              "type": "진",
              "credits": 4,
              "domain": "society",
              "closed": true,
              "key": "동아시아역사기행"
            },
            {
              "id": "2-2-1-7",
              "name": "현대사회와 윤리",
              "type": "일",
              "credits": 4,
              "domain": "society",
              "closed": false,
              "key": "현대사회와윤리"
            },
            {
              "id": "2-2-1-8",
              "name": "세계문제와 미래사회(공캠)",
              "type": "융",
              "credits": 4,
              "domain": "society",
              "closed": false,
              "key": "세계문제와미래사회(공캠)"
            },
            {
              "id": "2-2-1-9",
              "name": "화학",
              "type": "일",
              "credits": 4,
              "domain": "science",
              "closed": false,
              "key": "화학"
            },
            {
              "id": "2-2-1-10",
              "name": "지구과학",
              "type": "일",
              "credits": 4,
              "domain": "science",
              "closed": false,
              "key": "지구과학"
            },
            {
              "id": "2-2-1-11",
              "name": "전자기와 양자",
              "type": "진",
              "credits": 4,
              "domain": "science",
              "closed": false,
              "key": "전자기와양자"
            },
            {
              "id": "2-2-1-12",
              "name": "생물의 유전",
              "type": "진",
              "credits": 4,
              "domain": "science",
              "closed": false,
              "key": "생물의유전"
            },
            {
              "id": "2-2-1-13",
              "name": "데이터 과학",
              "type": "진",
              "credits": 4,
              "domain": "info",
              "closed": false,
              "key": "데이터과학"
            },
            {
              "id": "2-2-1-14",
              "name": "중국어(온라인)",
              "type": "일",
              "credits": 4,
              "domain": "language",
              "closed": false,
              "key": "중국어"
            },
            {
              "id": "2-2-1-15",
              "name": "일본어",
              "type": "일",
              "credits": 4,
              "domain": "language",
              "closed": false,
              "key": "일본어"
            },
            {
              "id": "2-2-1-16",
              "name": "스페인어(온라인)",
              "type": "일",
              "credits": 4,
              "domain": "language",
              "closed": false,
              "key": "스페인어"
            },
            {
              "id": "2-2-1-17",
              "name": "인간과 심리",
              "type": "진",
              "credits": 2,
              "domain": "liberal",
              "closed": false,
              "key": "인간과심리"
            },
            {
              "id": "2-2-1-18",
              "name": "논리와 사고",
              "type": "진",
              "credits": 2,
              "domain": "liberal",
              "closed": false,
              "key": "논리와사고"
            },
            {
              "id": "2-2-1-19",
              "name": "보건",
              "type": "진",
              "credits": 2,
              "domain": "liberal",
              "closed": false,
              "key": "보건"
            },
            {
              "id": "2-2-1-20",
              "name": "통계와 사회",
              "type": "진",
              "credits": 2,
              "domain": "liberal",
              "closed": false,
              "key": "통계와사회"
            },
            {
              "id": "2-2-1-21",
              "name": "생태와 환경",
              "type": "진",
              "credits": 2,
              "domain": "liberal",
              "closed": false,
              "key": "생태와환경"
            },
            {
              "id": "2-2-1-22",
              "name": "호모 스토리텔리쿠스",
              "type": "융",
              "credits": 2,
              "domain": "liberal",
              "closed": true,
              "key": "호모스토리텔리쿠스"
            }
          ]
        }
      ]
    },
    {
      "id": "3-1",
      "label": "3학년 1학기",
      "credits": 28,
      "groups": [
        {
          "id": "3-1-g0",
          "label": "필수 과목",
          "rule": {
            "kind": "fixed"
          },
          "courses": [
            {
              "id": "3-1-0-0",
              "name": "독서와 작문",
              "type": "일",
              "credits": 4,
              "domain": "korean",
              "closed": false,
              "key": "독서와작문"
            },
            {
              "id": "3-1-0-1",
              "name": "확률과 통계",
              "type": "일",
              "credits": 4,
              "domain": "math",
              "closed": false,
              "key": "확률과통계"
            },
            {
              "id": "3-1-0-2",
              "name": "스포츠과학",
              "type": "진",
              "credits": 2,
              "domain": "physical",
              "closed": false,
              "key": "스포츠과학"
            }
          ]
        },
        {
          "id": "3-1-g1",
          "label": "선택과목1 (4개 선택)",
          "rule": {
            "kind": "count",
            "count": 4
          },
          "courses": [
            {
              "id": "3-1-1-0",
              "name": "문학과 영상",
              "type": "진",
              "credits": 4,
              "domain": "korean",
              "closed": false,
              "key": "문학과영상"
            },
            {
              "id": "3-1-1-1",
              "name": "매체 의사소통",
              "type": "융",
              "credits": 4,
              "domain": "korean",
              "closed": false,
              "key": "매체의사소통"
            },
            {
              "id": "3-1-1-2",
              "name": "미적분Ⅱ",
              "type": "진",
              "credits": 4,
              "domain": "math",
              "closed": false,
              "key": "미적분Ⅱ"
            },
            {
              "id": "3-1-1-3",
              "name": "영어독해와 작문",
              "type": "일",
              "credits": 4,
              "domain": "english",
              "closed": false,
              "key": "영어독해와작문"
            },
            {
              "id": "3-1-1-4",
              "name": "영미문학읽기",
              "type": "진",
              "credits": 4,
              "domain": "english",
              "closed": false,
              "key": "영미문학읽기"
            },
            {
              "id": "3-1-1-5",
              "name": "사회문제탐구",
              "type": "융",
              "credits": 4,
              "domain": "society",
              "closed": false,
              "key": "사회문제탐구"
            },
            {
              "id": "3-1-1-6",
              "name": "한국지리탐구",
              "type": "진",
              "credits": 4,
              "domain": "society",
              "closed": false,
              "key": "한국지리탐구"
            },
            {
              "id": "3-1-1-7",
              "name": "윤리와 사상",
              "type": "진",
              "credits": 4,
              "domain": "society",
              "closed": false,
              "key": "윤리와사상"
            },
            {
              "id": "3-1-1-8",
              "name": "정치",
              "type": "진",
              "credits": 4,
              "domain": "society",
              "closed": false,
              "key": "정치"
            },
            {
              "id": "3-1-1-9",
              "name": "역학과 에너지",
              "type": "진",
              "credits": 4,
              "domain": "science",
              "closed": false,
              "key": "역학과에너지"
            },
            {
              "id": "3-1-1-10",
              "name": "물질과 에너지",
              "type": "진",
              "credits": 4,
              "domain": "science",
              "closed": false,
              "key": "물질과에너지"
            },
            {
              "id": "3-1-1-11",
              "name": "화학반응의 세계",
              "type": "진",
              "credits": 4,
              "domain": "science",
              "closed": false,
              "key": "화학반응의세계"
            },
            {
              "id": "3-1-1-12",
              "name": "세포와 물질대사",
              "type": "진",
              "credits": 4,
              "domain": "science",
              "closed": false,
              "key": "세포와물질대사"
            },
            {
              "id": "3-1-1-13",
              "name": "지구시스템과학",
              "type": "진",
              "credits": 4,
              "domain": "science",
              "closed": false,
              "key": "지구시스템과학"
            },
            {
              "id": "3-1-1-14",
              "name": "행성우주과학",
              "type": "진",
              "credits": 4,
              "domain": "science",
              "closed": false,
              "key": "행성우주과학"
            },
            {
              "id": "3-1-1-15",
              "name": "심화체육전공실기",
              "type": "진",
              "credits": 4,
              "domain": "physical",
              "closed": false,
              "key": "심화체육전공실기"
            },
            {
              "id": "3-1-1-16",
              "name": "인공지능 기초",
              "type": "진",
              "credits": 4,
              "domain": "info",
              "closed": false,
              "key": "인공지능기초"
            },
            {
              "id": "3-1-1-17",
              "name": "심화 일본어",
              "type": "진",
              "credits": 4,
              "domain": "language",
              "closed": false,
              "key": "심화일본어"
            }
          ]
        },
        {
          "id": "3-1-g2",
          "label": "선택과목2 (1개 선택)",
          "rule": {
            "kind": "count",
            "count": 1
          },
          "courses": [
            {
              "id": "3-1-2-0",
              "name": "교육의 이해",
              "type": "진",
              "credits": 2,
              "domain": "liberal",
              "closed": false,
              "key": "교육의이해"
            },
            {
              "id": "3-1-2-1",
              "name": "인간과 철학",
              "type": "진",
              "credits": 2,
              "domain": "liberal",
              "closed": false,
              "key": "인간과철학"
            },
            {
              "id": "3-1-2-2",
              "name": "인간과 경제활동",
              "type": "융",
              "credits": 2,
              "domain": "liberal",
              "closed": false,
              "key": "인간과경제활동"
            },
            {
              "id": "3-1-2-3",
              "name": "논술",
              "type": "융",
              "credits": 2,
              "domain": "liberal",
              "closed": false,
              "key": "논술"
            }
          ]
        }
      ]
    },
    {
      "id": "3-2",
      "label": "3학년 2학기",
      "credits": 26,
      "groups": [
        {
          "id": "3-2-g0",
          "label": "필수 과목",
          "rule": {
            "kind": "fixed"
          },
          "courses": [
            {
              "id": "3-2-0-0",
              "name": "스포츠문화",
              "type": "융",
              "credits": 2,
              "domain": "physical",
              "closed": false,
              "key": "스포츠문화"
            }
          ]
        },
        {
          "id": "3-2-g1",
          "label": "선택과목1 (4학점 5개 또는 4학점 4개 + 2학점 2개)",
          "rule": {
            "kind": "combinations",
            "options": [
              {
                "4": 5
              },
              {
                "2": 2,
                "4": 4
              }
            ]
          },
          "courses": [
            {
              "id": "3-2-1-0",
              "name": "언어생활탐구",
              "type": "융",
              "credits": 4,
              "domain": "korean",
              "closed": false,
              "key": "언어생활탐구"
            },
            {
              "id": "3-2-1-1",
              "name": "수학과제탐구",
              "type": "융",
              "credits": 4,
              "domain": "math",
              "closed": false,
              "key": "수학과제탐구"
            },
            {
              "id": "3-2-1-2",
              "name": "심화영어독해와 작문",
              "type": "진",
              "credits": 4,
              "domain": "english",
              "closed": false,
              "key": "심화영어독해와작문"
            },
            {
              "id": "3-2-1-3",
              "name": "국제관계의 이해",
              "type": "진",
              "credits": 4,
              "domain": "society",
              "closed": false,
              "key": "국제관계의이해"
            },
            {
              "id": "3-2-1-4",
              "name": "기후변화와 지속가능한세계",
              "type": "융",
              "credits": 4,
              "domain": "society",
              "closed": false,
              "key": "기후변화와지속가능한세계"
            },
            {
              "id": "3-2-1-5",
              "name": "금융과 경제 생활",
              "type": "융",
              "credits": 4,
              "domain": "society",
              "closed": false,
              "key": "금융과경제생활"
            },
            {
              "id": "3-2-1-6",
              "name": "기후변화와 환경생태",
              "type": "융",
              "credits": 4,
              "domain": "science",
              "closed": false,
              "key": "기후변화와환경생태"
            },
            {
              "id": "3-2-1-7",
              "name": "융합과학탐구",
              "type": "융",
              "credits": 4,
              "domain": "science",
              "closed": false,
              "key": "융합과학탐구"
            },
            {
              "id": "3-2-1-8",
              "name": "일본문화",
              "type": "융",
              "credits": 4,
              "domain": "language",
              "closed": false,
              "key": "일본문화"
            },
            {
              "id": "3-2-1-9",
              "name": "교육의 이해",
              "type": "진",
              "credits": 2,
              "domain": "liberal",
              "closed": false,
              "key": "교육의이해"
            },
            {
              "id": "3-2-1-10",
              "name": "인간과 철학",
              "type": "진",
              "credits": 2,
              "domain": "liberal",
              "closed": false,
              "key": "인간과철학"
            },
            {
              "id": "3-2-1-11",
              "name": "인간과 경제활동",
              "type": "융",
              "credits": 2,
              "domain": "liberal",
              "closed": false,
              "key": "인간과경제활동"
            },
            {
              "id": "3-2-1-12",
              "name": "논술",
              "type": "융",
              "credits": 2,
              "domain": "liberal",
              "closed": false,
              "key": "논술"
            }
          ]
        },
        {
          "id": "3-2-g2",
          "label": "선택과목2 (1개 선택)",
          "rule": {
            "kind": "count",
            "count": 1
          },
          "courses": [
            {
              "id": "3-2-2-0",
              "name": "음악감상과 비평",
              "type": "진",
              "credits": 4,
              "domain": "art",
              "closed": false,
              "key": "음악감상과비평"
            },
            {
              "id": "3-2-2-1",
              "name": "미술감상과 비평",
              "type": "진",
              "credits": 4,
              "domain": "art",
              "closed": false,
              "key": "미술감상과비평"
            }
          ]
        }
      ]
    }
  ]
};

