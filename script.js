// 카페 키오스크 JavaScript

// 메뉴 데이터
const menuData = {
    coffee: [
        {
            id: 'americano',
            name: '아메리카노',
            price: 4500,
            description: '깊고 진한 에스프레소의 맛',
            image: '☕'
        },
        {
            id: 'latte',
            name: '카페라떼',
            price: 5500,
            description: '부드러운 우유와 에스프레소의 조화',
            image: '🥛'
        },
        {
            id: 'cappuccino',
            name: '카푸치노',
            price: 5500,
            description: '에스프레소, 스팀밀크, 우유거품의 완벽한 비율',
            image: '☕'
        },
        {
            id: 'mocha',
            name: '카페모카',
            price: 6500,
            description: '초콜릿과 에스프레소의 달콤한 만남',
            image: '🍫'
        },
        {
            id: 'espresso',
            name: '에스프레소',
            price: 3500,
            description: '강렬하고 진한 커피의 본질',
            image: '☕'
        },
        {
            id: 'macchiato',
            name: '카라멜 마끼아또',
            price: 6000,
            description: '카라멜의 달콤함과 에스프레소의 조화',
            image: '🍯'
        }
    ],
    tea: [
        {
            id: 'green-tea',
            name: '녹차',
            price: 4000,
            description: '신선하고 깔끔한 녹차의 맛',
            image: '🍵'
        },
        {
            id: 'black-tea',
            name: '홍차',
            price: 4000,
            description: '깊고 풍부한 홍차의 향',
            image: '🫖'
        },
        {
            id: 'chai-tea',
            name: '차이티',
            price: 5500,
            description: '향신료가 가득한 인도식 차',
            image: '☕'
        },
        {
            id: 'herb-tea',
            name: '허브티',
            price: 4500,
            description: '자연의 향이 가득한 허브 차',
            image: '🌿'
        }
    ],
    dessert: [
        {
            id: 'cheesecake',
            name: '치즈케이크',
            price: 6500,
            description: '부드럽고 진한 치즈의 맛',
            image: '🍰'
        },
        {
            id: 'tiramisu',
            name: '티라미수',
            price: 7500,
            description: '커피향이 가득한 이탈리안 디저트',
            image: '🍮'
        },
        {
            id: 'chocolate-cake',
            name: '초콜릿케이크',
            price: 6000,
            description: '진한 다크초콜릿의 맛',
            image: '🍫'
        },
        {
            id: 'croissant',
            name: '크루아상',
            price: 3500,
            description: '바삭하고 부드러운 프랑스식 페이스트리',
            image: '🥐'
        }
    ],
    snack: [
        {
            id: 'sandwich',
            name: '샌드위치',
            price: 5500,
            description: '신선한 야채와 고기의 조화',
            image: '🥪'
        },
        {
            id: 'cookie',
            name: '쿠키',
            price: 2500,
            description: '바삭하고 달콤한 홈메이드 쿠키',
            image: '🍪'
        },
        {
            id: 'muffin',
            name: '머핀',
            price: 3500,
            description: '부드럽고 달콤한 머핀',
            image: '🧁'
        },
        {
            id: 'brownie',
            name: '브라우니',
            price: 4000,
            description: '진한 초콜릿의 맛이 가득한 브라우니',
            image: '🍫'
        }
    ]
};

// 전역 변수
let currentCategory = 'coffee';
let orderItems = [];

// DOM 요소들
const categoryButtons = document.querySelectorAll('.category-btn');
const categoryTitle = document.getElementById('category-title');
const menuGrid = document.getElementById('menu-grid');
const orderList = document.getElementById('order-list');
const subtotalElement = document.getElementById('subtotal');
const taxElement = document.getElementById('tax');
const finalTotalElement = document.getElementById('final-total');
const totalPriceElement = document.getElementById('total-price');
const currentTimeElement = document.getElementById('current-time');
const clearOrderBtn = document.getElementById('clear-order');
const completeOrderBtn = document.getElementById('complete-order');
const paymentModal = document.getElementById('payment-modal');
const successModal = document.getElementById('success-modal');
const closeModalBtn = document.getElementById('close-modal');
const newOrderBtn = document.getElementById('new-order');

// Firebase 관련 함수들
async function saveOrderToFirebase(orderData) {
    try {
        // Firebase가 로드되었는지 확인
        if (!window.db || !window.addDoc || !window.collection || !window.serverTimestamp) {
            console.error('Firebase가 아직 로드되지 않았습니다.');
            throw new Error('Firebase 초기화 대기 중...');
        }

        const { db, addDoc, collection, serverTimestamp } = window;
        
        // 주문 데이터에 타임스탬프 추가 (주문 번호는 서버에서 생성)
        const orderWithTimestamp = {
            ...orderData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        // Firestore에 주문 저장
        const docRef = await addDoc(collection(db, 'orders'), orderWithTimestamp);
        console.log('주문이 성공적으로 저장되었습니다. 문서 ID:', docRef.id);
        
        return docRef.id;
    } catch (error) {
        console.error('주문 저장 중 오류 발생:', error);
        throw error;
    }
}

// 서버에서 주문 번호 생성 함수
async function generateOrderNumber() {
    try {
        const { db, collection, query, orderBy, limit, getDocs } = window;
        
        // 주문 컬렉션에서 가장 최근 주문을 조회
        const ordersRef = collection(db, 'orders');
        const q = query(
            ordersRef,
            orderBy('createdAt', 'desc'),
            limit(1)
        );
        
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            // 첫 번째 주문인 경우
            return '#0001';
        } else {
            // 마지막 주문 번호를 가져와서 +1
            const lastOrder = querySnapshot.docs[0].data();
            const lastOrderNumber = lastOrder.orderNumber || '#0000';
            
            // 주문 번호에서 숫자 부분만 추출
            const numberMatch = lastOrderNumber.match(/#(\d+)/);
            if (numberMatch) {
                const lastNumber = parseInt(numberMatch[1]);
                const newNumber = lastNumber + 1;
                return `#${newNumber.toString().padStart(4, '0')}`;
            } else {
                // 형식이 맞지 않는 경우 기본값 사용
                return '#0001';
            }
        }
    } catch (error) {
        console.error('주문 번호 생성 중 오류:', error);
        
        // 오류 발생 시 현재 시간 기반으로 고유한 번호 생성
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2); // 년도 뒤 2자리
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hour = now.getHours().toString().padStart(2, '0');
        const minute = now.getMinutes().toString().padStart(2, '0');
        const second = now.getSeconds().toString().padStart(2, '0');
        const millisecond = now.getMilliseconds().toString().padStart(3, '0');
        
        // 형식: #YYMMDD-HHMMSS-MSS
        return `#${year}${month}${day}-${hour}${minute}${second}-${millisecond}`;
    }
}

// 주문 데이터 생성 함수
async function createOrderData(paymentMethod) {
    const subtotal = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.1);
    const total = subtotal + tax;
    
    // 서버에서 주문 번호 생성
    const orderNumber = await generateOrderNumber();
    
    return {
        orderNumber: orderNumber,
        items: orderItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            totalPrice: item.price * item.quantity
        })),
        subtotal: subtotal,
        tax: tax,
        total: total,
        paymentMethod: paymentMethod,
        status: 'pending', // pending, preparing, completed, cancelled
        estimatedWaitTime: Math.floor(Math.random() * 10) + 5, // 5-15분
        customerInfo: {
            // 향후 고객 정보 입력 기능 추가 가능
            name: '익명',
            phone: '없음'
        }
    };
}

// 카테고리 변경 이벤트
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.dataset.category;
        if (category !== currentCategory) {
            // 활성 버튼 변경
            document.querySelector('.category-btn.active').classList.remove('active');
            button.classList.add('active');
            
            // 카테고리 변경
            currentCategory = category;
            updateCategoryTitle();
            displayMenu();
        }
    });
});

// 카테고리 제목 업데이트
function updateCategoryTitle() {
    const categoryNames = {
        coffee: '커피 메뉴',
        tea: '차 메뉴',
        dessert: '디저트 메뉴',
        snack: '스낵 메뉴'
    };
    categoryTitle.textContent = categoryNames[currentCategory];
}

// 메뉴 표시
function displayMenu() {
    const menuItems = menuData[currentCategory];
    menuGrid.innerHTML = '';
    
    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 15px;">${item.image}</div>
            <h3>${item.name}</h3>
            <div class="price">₩${item.price.toLocaleString()}</div>
            <div class="description">${item.description}</div>
        `;
        
        menuItem.addEventListener('click', () => {
            addToOrder(item);
        });
        
        menuGrid.appendChild(menuItem);
    });
}

// 주문에 아이템 추가
function addToOrder(item) {
    const existingItem = orderItems.find(orderItem => orderItem.id === item.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        orderItems.push({
            ...item,
            quantity: 1
        });
    }
    
    updateOrderDisplay();
    updateTotalPrice();
    
    // 애니메이션 효과
    const menuItem = event.currentTarget;
    menuItem.style.transform = 'scale(0.95)';
    setTimeout(() => {
        menuItem.style.transform = '';
    }, 150);
}

// 주문 표시 업데이트
function updateOrderDisplay() {
    orderList.innerHTML = '';
    
    orderItems.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <div class="order-item-info">
                <h4>${item.name}</h4>
                <div class="price">₩${(item.price * item.quantity).toLocaleString()}</div>
            </div>
            <div class="order-item-controls">
                <button class="quantity-btn" onclick="changeQuantity('${item.id}', -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="changeQuantity('${item.id}', 1)">+</button>
            </div>
        `;
        
        orderList.appendChild(orderItem);
    });
}

// 수량 변경
function changeQuantity(itemId, change) {
    const item = orderItems.find(orderItem => orderItem.id === itemId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            orderItems = orderItems.filter(orderItem => orderItem.id !== itemId);
        }
        
        updateOrderDisplay();
        updateTotalPrice();
    }
}

// 총 가격 업데이트
function updateTotalPrice() {
    const subtotal = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.1);
    const total = subtotal + tax;
    
    subtotalElement.textContent = `₩${subtotal.toLocaleString()}`;
    taxElement.textContent = `₩${tax.toLocaleString()}`;
    finalTotalElement.textContent = `₩${total.toLocaleString()}`;
    totalPriceElement.textContent = `총 금액: ₩${total.toLocaleString()}`;
}

// 주문 취소
clearOrderBtn.addEventListener('click', () => {
    if (orderItems.length > 0) {
        if (confirm('주문을 취소하시겠습니까?')) {
            orderItems = [];
            updateOrderDisplay();
            updateTotalPrice();
        }
    }
});

// 주문 완료
completeOrderBtn.addEventListener('click', () => {
    if (orderItems.length === 0) {
        alert('주문할 메뉴를 선택해주세요.');
        return;
    }
    
    paymentModal.style.display = 'block';
});

// 모달 닫기
closeModalBtn.addEventListener('click', () => {
    paymentModal.style.display = 'none';
});

// 모달 외부 클릭시 닫기
window.addEventListener('click', (event) => {
    if (event.target === paymentModal) {
        paymentModal.style.display = 'none';
    }
    if (event.target === successModal) {
        successModal.style.display = 'none';
    }
});

// 결제 방법 선택
document.querySelectorAll('.payment-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        const paymentMethod = btn.dataset.method;
        
        try {
            // 결제 버튼 비활성화
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 처리 중...';
            
            // 주문 데이터 생성 (서버에서 주문 번호 생성)
            const orderData = await createOrderData(paymentMethod);
            
            // Firebase에 주문 저장
            const docId = await saveOrderToFirebase(orderData);
            
            // 성공 처리
            processPaymentSuccess(orderData, docId);
            
        } catch (error) {
            console.error('결제 처리 중 오류:', error);
            alert('주문 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
            
            // 버튼 복원
            btn.disabled = false;
            btn.innerHTML = `<i class="fas fa-credit-card"></i> ${getPaymentMethodName(paymentMethod)}`;
        }
    });
});

// 결제 방법 이름 가져오기
function getPaymentMethodName(method) {
    const methodNames = {
        card: '신용카드',
        cash: '현금',
        mobile: '모바일 결제'
    };
    return methodNames[method] || method;
}

// 결제 성공 처리
function processPaymentSuccess(orderData, docId) {
    paymentModal.style.display = 'none';
    
    // 주문 완료 모달 표시
    const orderNumberElement = document.getElementById('order-number');
    const waitTimeElement = document.getElementById('wait-time');
    
    orderNumberElement.textContent = orderData.orderNumber;
    waitTimeElement.textContent = orderData.estimatedWaitTime;
    
    successModal.style.display = 'block';
    
    // 주문 목록 초기화
    orderItems = [];
    updateOrderDisplay();
    updateTotalPrice();
    
    console.log(`주문 완료: ${orderData.orderNumber} (문서 ID: ${docId})`);
}

// 새 주문하기
newOrderBtn.addEventListener('click', () => {
    successModal.style.display = 'none';
    orderItems = [];
    updateOrderDisplay();
    updateTotalPrice();
});

// 현재 시간 업데이트
function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    currentTimeElement.textContent = timeString;
}

// Firebase 초기화 확인
function checkFirebaseInitialization() {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 50; // 5초 대기
        
        const check = () => {
            attempts++;
            if (window.db && window.addDoc && window.collection && window.serverTimestamp) {
                resolve(true);
            } else if (attempts >= maxAttempts) {
                reject(new Error('Firebase 초기화 시간 초과'));
            } else {
                setTimeout(check, 100);
            }
        };
        
        check();
    });
}

// 초기화
async function init() {
    try {
        // Firebase 초기화 대기
        await checkFirebaseInitialization();
        console.log('Firebase가 성공적으로 초기화되었습니다.');
    } catch (error) {
        console.warn('Firebase 초기화 실패:', error.message);
        console.log('오프라인 모드로 실행됩니다.');
    }
    
    displayMenu();
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
}

// 페이지 로드시 초기화
document.addEventListener('DOMContentLoaded', init);

// 키보드 단축키
document.addEventListener('keydown', (event) => {
    // ESC 키로 모달 닫기
    if (event.key === 'Escape') {
        paymentModal.style.display = 'none';
        successModal.style.display = 'none';
    }
    
    // 숫자 키로 카테고리 변경
    if (event.key >= '1' && event.key <= '4') {
        const categories = ['coffee', 'tea', 'dessert', 'snack'];
        const categoryIndex = parseInt(event.key) - 1;
        const targetCategory = categories[categoryIndex];
        
        if (targetCategory && targetCategory !== currentCategory) {
            document.querySelector('.category-btn.active').classList.remove('active');
            document.querySelector(`[data-category="${targetCategory}"]`).classList.add('active');
            currentCategory = targetCategory;
            updateCategoryTitle();
            displayMenu();
        }
    }
});

// 터치 이벤트 지원 (모바일)
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (event) => {
    touchStartY = event.touches[0].clientY;
});

document.addEventListener('touchend', (event) => {
    touchEndY = event.changedTouches[0].clientY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // 위로 스와이프 - 다음 카테고리
            const categories = ['coffee', 'tea', 'dessert', 'snack'];
            const currentIndex = categories.indexOf(currentCategory);
            const nextIndex = (currentIndex + 1) % categories.length;
            const nextCategory = categories[nextIndex];
            
            document.querySelector('.category-btn.active').classList.remove('active');
            document.querySelector(`[data-category="${nextCategory}"]`).classList.add('active');
            currentCategory = nextCategory;
            updateCategoryTitle();
            displayMenu();
        } else {
            // 아래로 스와이프 - 이전 카테고리
            const categories = ['coffee', 'tea', 'dessert', 'snack'];
            const currentIndex = categories.indexOf(currentCategory);
            const prevIndex = (currentIndex - 1 + categories.length) % categories.length;
            const prevCategory = categories[prevIndex];
            
            document.querySelector('.category-btn.active').classList.remove('active');
            document.querySelector(`[data-category="${prevCategory}"]`).classList.add('active');
            currentCategory = prevCategory;
            updateCategoryTitle();
            displayMenu();
        }
    }
} 