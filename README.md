![link](https://github.com/user-attachments/assets/eb70a263-7c26-41ea-9872-a9c7de3a61ea)



# 카페 키오스크 웹서비스

Firebase Firestore를 사용한 카페 키오스크 웹 애플리케이션입니다.

## 기능

- ✅ 카테고리별 메뉴 관리 (커피, 차, 디저트, 스낵)
- ✅ 주문 시스템 (수량 조절, 가격 계산)
- ✅ Firebase Firestore 연동 (주문 데이터 저장)
- ✅ 결제 모달 (신용카드, 현금, 모바일 결제)
- ✅ 반응형 디자인 (데스크톱, 태블릿, 모바일)
- ✅ 키보드 단축키 및 터치 스와이프 지원
- ✅ 실시간 시간 표시
- ✅ 주문 번호 생성 및 관리

## Firebase 설정 방법

### 1. Firebase 프로젝트 생성

1. [Firebase 콘솔](https://console.firebase.google.com/)에 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력 (예: "cafe-kiosk")
4. Google Analytics 설정 (선택사항)
5. "프로젝트 만들기" 클릭

### 2. 웹 앱 추가

1. 프로젝트 대시보드에서 웹 아이콘(</>) 클릭
2. 앱 닉네임 입력 (예: "cafe-kiosk-web")
3. "Firebase Hosting 설정" 체크 해제
4. "앱 등록" 클릭

### 3. Firebase 설정 복사

앱 등록 후 표시되는 설정 코드를 복사:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

### 4. 설정 적용

`index.html` 파일의 Firebase 설정 부분을 수정:

```html
<script type="module">
    import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
    import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
    
    // 여기에 Firebase 콘솔에서 복사한 설정을 붙여넣기
    const firebaseConfig = {
        apiKey: "your-api-key",
        authDomain: "your-project-id.firebaseapp.com",
        projectId: "your-project-id",
        storageBucket: "your-project-id.appspot.com",
        messagingSenderId: "your-messaging-sender-id",
        appId: "your-app-id"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    window.db = db;
    window.addDoc = addDoc;
    window.collection = collection;
    window.serverTimestamp = serverTimestamp;
</script>
```

### 5. Firestore 데이터베이스 설정

1. Firebase 콘솔에서 "Firestore Database" 클릭
2. "데이터베이스 만들기" 클릭
3. 보안 규칙 선택:
   - **테스트 모드**: 개발 중에만 사용 (모든 읽기/쓰기 허용)
   - **프로덕션 모드**: 보안 규칙 설정 필요

#### 테스트 모드 보안 규칙 (개발용)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

#### 프로덕션 모드 보안 규칙 (배포용)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /orders/{orderId} {
      allow read, write: if true; // 주문 데이터는 모든 사용자가 읽기/쓰기 가능
    }
  }
}
```

## 사용법

### 로컬 실행

1. 모든 파일을 웹 서버에서 실행 (Firebase SDK는 HTTPS 또는 localhost에서만 작동)
2. `index.html` 파일을 브라우저에서 열기

### 간단한 로컬 서버 실행

Python 3:
```bash
python -m http.server 8000
```

Node.js (http-server):
```bash
npx http-server
```

### 키보드 단축키

- `1-4`: 카테고리 변경 (1: 커피, 2: 차, 3: 디저트, 4: 스낵)
- `ESC`: 모달 닫기

### 터치 제스처 (모바일)

- 위로 스와이프: 다음 카테고리
- 아래로 스와이프: 이전 카테고리

## 데이터 구조

### 주문 데이터 (Firestore)

```javascript
{
  orderNumber: "#0001",
  items: [
    {
      id: "americano",
      name: "아메리카노",
      price: 4500,
      quantity: 2,
      totalPrice: 9000
    }
  ],
  subtotal: 9000,
  tax: 900,
  total: 9900,
  paymentMethod: "card",
  status: "pending",
  estimatedWaitTime: 8,
  customerInfo: {
    name: "익명",
    phone: "없음"
  },
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## 주문 상태

- `pending`: 주문 접수됨
- `preparing`: 준비 중
- `completed`: 완료됨
- `cancelled`: 취소됨

## 파일 구조

```
cafe-kiosk/
├── index.html          # 메인 HTML 파일
├── style.css           # 스타일시트
├── script.js           # JavaScript 로직
├── firebase-config.js  # Firebase 설정 (참고용)
└── README.md           # 이 파일
```

## 추가 개발 가능한 기능

- [ ] 관리자 패널 (주문 상태 관리)
- [ ] 고객 정보 입력
- [ ] 주문 내역 조회
- [ ] 실시간 주문 알림
- [ ] 메뉴 관리 시스템
- [ ] 결제 게이트웨이 연동
- [ ] 재고 관리
- [ ] 매출 통계

## 문제 해결

### Firebase 연결 오류

1. Firebase 설정이 올바른지 확인
2. Firestore 데이터베이스가 생성되었는지 확인
3. 보안 규칙이 적절히 설정되었는지 확인
4. 브라우저 콘솔에서 오류 메시지 확인

### CORS 오류

Firebase SDK는 HTTPS 또는 localhost에서만 작동합니다. 로컬 파일 시스템에서 직접 열면 오류가 발생할 수 있습니다.

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 
